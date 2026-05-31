import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'

serve(async (req) => {
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing auth header' }), { status: 401 })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')

    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { Authorization: authHeader, apikey: anonKey! },
    })
    if (!userResponse.ok) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const geminiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiKey) {
      return new Response(JSON.stringify({ error: 'AI service not configured' }), { status: 500 })
    }

    const { prompt, action, model, stats } = await req.json()

    if (!prompt && action !== 'check' && action !== 'status') {
      return new Response(JSON.stringify({ error: 'Missing prompt' }), { status: 400 })
    }

    const geminiModel = model || 'gemini-2.5-flash-lite'
    const baseUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}`

    if (action === 'check' || action === 'status') {
      const resp = await fetch(baseUrl, {
        headers: { Authorization: `Bearer ${geminiKey}` },
        signal: AbortSignal.timeout(5000),
      })
      return new Response(JSON.stringify({ isRunning: resp.ok, models: ['gemini-2.5-flash-lite'] }), { status: 200 })
    }

    const useStream = req.headers.get('Accept') === 'text/event-stream'

    if (useStream) {
      const resp = await fetch(`${baseUrl}:streamGenerateContent?alt=sse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${geminiKey}`,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
        }),
      })

      if (!resp.ok) {
        const errorText = await resp.text()
        return new Response(JSON.stringify({ error: `Gemini API error: ${resp.status}`, detail: errorText }), { status: resp.status })
      }

      const reader = resp.body.getReader()
      const decoder = new TextDecoder()

      const stream = new ReadableStream({
        async start(controller) {
          let buffer = ''
          try {
            while (true) {
              const { value, done } = await reader.read()
              if (done) break
              buffer += decoder.decode(value, { stream: true })
              const lines = buffer.split('\n')
              buffer = lines.pop() || ''
              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  controller.enqueue(new TextEncoder().encode(line + '\n'))
                }
              }
            }
            if (buffer && buffer.startsWith('data: ')) {
              controller.enqueue(new TextEncoder().encode(buffer + '\n'))
            }
          } catch (e) {
            if (e.name !== 'AbortError') throw e
          } finally {
            controller.close()
          }
        },
      })

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      })
    }

    let geminiPrompt = prompt
    const maxTokens = 1024

    if (action === 'suggestions') {
      geminiPrompt = `Suggest 5 specific daily habits for someone who wants to: ${prompt}. Return ONLY a JSON array with objects having keys: name, category, priority, notes. Categories must be one of: Health, Work, Personal, Fitness, Learning. Priorities must be one of: High, Medium, Low. Example format: [{"name": "Morning meditation", "category": "Health", "priority": "Medium", "notes": "Start with 5 minutes"}]`
    } else if (action === 'motivation') {
      geminiPrompt = `Give one short motivational sentence (max 15 words) for someone who has completed ${stats?.completedToday || 0}/${stats?.totalHabits || 0} habits today and has a ${stats?.bestStreak || 0} day streak.`
    }

    const resp = await fetch(`${baseUrl}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${geminiKey}`,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: geminiPrompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: maxTokens },
      }),
    })

    if (!resp.ok) {
      const errorText = await resp.text()
      return new Response(JSON.stringify({ error: `Gemini API error: ${resp.status}`, detail: errorText }), { status: resp.status })
    }

    const data = await resp.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    return new Response(JSON.stringify({ text }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
