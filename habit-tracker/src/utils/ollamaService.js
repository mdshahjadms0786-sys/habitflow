import * as Sentry from '@sentry/react'
import { supabase, configuredSupabaseUrl } from '../services/supabaseClient'

let lastRateLimit = 0

const getAuthToken = async () => {
  const session = await supabase.auth.getSession()
  return session?.data?.session?.access_token || null
}

const callGeminiProxy = async (body) => {
  const token = await getAuthToken()
  if (!token) return { error: 'Not authenticated' }

  try {
    const response = await fetch(
      `${configuredSupabaseUrl}/functions/v1/gemini-proxy`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    )
    const data = await response.json()
    if (!response.ok) return { error: data.error || 'Gemini proxy error' }
    return { data, error: null }
  } catch (err) {
    return { error: err.message }
  }
}

export const checkOllamaStatus = async () => {
  const result = await callGeminiProxy({ action: 'check' })
  if (result.error) return { isRunning: false, models: [] }
  return { isRunning: result.data.isRunning, models: result.data.models || [] }
}

export const streamCompletion = async ({ prompt, onChunk, onDone, onError }) => {
  const now = Date.now()
  if (now - lastRateLimit < 15000) {
    onError(new Error('Rate limited'))
    return
  }

  const token = await getAuthToken()
  if (!token) {
    onError(new Error('Not authenticated'))
    return
  }

  try {
    const response = await fetch(
      `${configuredSupabaseUrl}/functions/v1/gemini-proxy`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Accept: 'text/event-stream',
        },
        body: JSON.stringify({ prompt, action: 'chat' }),
      }
    )

    if (response.status === 429) {
      lastRateLimit = Date.now()
      onError(new Error('Rate limited'))
      return
    }

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const jsonStr = line.slice(6).trim()
        if (!jsonStr || jsonStr === '[DONE]') continue
        try {
          const json = JSON.parse(jsonStr)
          const text = json.candidates?.[0]?.content?.parts?.[0]?.text
          if (text) onChunk(text)
        } catch {
          // Skip malformed chunks
        }
      }
    }

    onDone()
  } catch (error) {
    onError(error)
  }
}

export const getCompletion = async (prompt) => {
  const now = Date.now()
  if (now - lastRateLimit < 15000) return null

  return Sentry.startSpan({ name: 'getCompletion', op: 'ai.coach' }, async () => {
    const result = await callGeminiProxy({ prompt, action: 'chat' })
    if (result.error) return null
    return result.data.text || null
  })
}

export const getHabitSuggestions = async (userGoal) => {
  return Sentry.startSpan({ name: 'getHabitSuggestions', op: 'ai.coach' }, async () => {
    const result = await callGeminiProxy({ prompt: userGoal, action: 'suggestions' })
    if (result.error) return null

    const text = result.data.text || ''
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      const suggestions = JSON.parse(jsonMatch[0])
      return suggestions.map((s) => ({
        ...s,
        category: validateCategory(s.category),
        priority: validatePriority(s.priority),
      }))
    }

    return null
  })
}

export const getDailyMotivation = async (stats) => {
  const result = await callGeminiProxy({ action: 'motivation', stats, prompt: '' })
  if (result.error) return null
  return result.data.text?.trim() || null
}

export const checkOllamaConnection = async () => {
  const result = await callGeminiProxy({ action: 'check' })
  return !result.error && result.data?.isRunning
}

const validateCategory = (category) => {
  const validCategories = ['Health', 'Work', 'Personal', 'Fitness', 'Learning']
  return validCategories.includes(category) ? category : 'Personal'
}

const validatePriority = (priority) => {
  const validPriorities = ['High', 'Medium', 'Low']
  return validPriorities.includes(priority) ? priority : 'Medium'
}
