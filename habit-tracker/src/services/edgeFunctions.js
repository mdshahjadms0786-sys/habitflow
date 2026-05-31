import { supabase, isSupabaseConfigured, configuredSupabaseUrl } from './supabaseClient'

export const callEdgeFunction = async (functionName, body) => {
  if (!isSupabaseConfigured || !supabase) {
    return { error: 'Supabase not configured' }
  }

  const session = await supabase.auth.getSession()
  const token = session?.data?.session?.access_token

  if (!token) {
    return { error: 'Not authenticated' }
  }

  try {
    const response = await fetch(
      `${configuredSupabaseUrl}/functions/v1/${functionName}`,
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

    if (!response.ok) {
      return { error: data.error || 'Edge function error' }
    }

    return { data, error: null }
  } catch (err) {
    return { error: err.message }
  }
}
