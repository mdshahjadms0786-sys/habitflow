import { useEffect, useRef } from 'react'
import { supabase } from '../../services/supabaseClient'
import logger from '../../utils/logger'

const AuthCallback = () => {
  const handled = useRef(false)

  useEffect(() => {
    // Listen for Supabase to finish exchanging the OAuth code
    // (detectSessionInUrl: true in supabaseClient handles the exchange automatically)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (handled.current) return
        
        if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
          handled.current = true
          
          try {
            // Ensure user_profiles row exists
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('id')
              .eq('id', session.user.id)
              .single()

            if (!profile) {
              await supabase
                .from('user_profiles')
                .insert({
                  id: session.user.id,
                  plan: 'free',
                  total_points: 0,
                  current_level: 1
                })
            }
          } catch (err) {
            logger.error('Profile creation error:', err)
          }

          // Full page reload so AuthContext picks up the new session
          window.location.replace('/')
        }
      }
    )

    // Fallback: if no auth event fires within 6 seconds,
    // check session manually and redirect
    const fallbackTimer = setTimeout(async () => {
      if (handled.current) return
      handled.current = true
      
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          logger.info('Auth callback: session found via fallback')
        } else {
          logger.error('Auth callback: no session after timeout')
        }
      } catch (err) {
        logger.error('Auth callback fallback error:', err)
      }
      
      window.location.replace('/')
    }, 6000)

    return () => {
      subscription?.unsubscribe()
      clearTimeout(fallbackTimer)
    }
  }, [])

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: '16px',
      backgroundColor: 'var(--bg, #0f0f1a)'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '3px solid #e2e8f0',
        borderTop: '3px solid #8b5cf6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}/>
      <p style={{ color: '#94a3b8', fontSize: '16px', fontWeight: 500 }}>
        Signing you in...
      </p>
      <p style={{ color: '#64748b', fontSize: '13px' }}>
        Please wait, this may take a moment
      </p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default AuthCallback
