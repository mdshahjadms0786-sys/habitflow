import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../services/supabaseClient'
import logger from '../../utils/logger'

const AuthCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data, error } = await supabase.auth.exchangeCodeForSession(
          window.location.href
        )

        if (error) {
          logger.error('Auth callback error:', error)
          navigate('/login?error=auth_failed')
          return
        }

        if (data?.user) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('id')
            .eq('id', data.user.id)
            .single()

          if (!profile) {
            await supabase
              .from('user_profiles')
              .insert({
                id: data.user.id,
                plan: 'free',
                total_points: 0,
                current_level: 1
              })
          }
        }

        navigate('/')
      } catch (err) {
        logger.error('Unexpected auth callback error:', err)
        navigate('/login?error=unexpected')
      }
    }

    handleCallback()
  }, [navigate])

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid #e2e8f0',
        borderTop: '3px solid #8b5cf6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}/>
      <p style={{ color: '#64748b', fontSize: '14px' }}>
        Signing you in...
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
