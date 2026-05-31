import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { supabase } from '../../services/supabaseClient';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAuthContext();

  useEffect(() => {
    const ensureProfile = async () => {
      if (isLoading || !isAuthenticated || !user) return;
      const { data: existing } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .single();
      if (!existing) {
        await supabase
          .from('user_profiles')
          .insert({
            id: user.id,
            plan: 'free',
            total_points: 0,
            current_level: 1
          });
      }
      navigate('/', { replace: true });
    };
    ensureProfile();
  }, [isAuthenticated, isLoading, navigate, user]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: 'var(--text)' }}>
      <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Completing Google sign in...</div>
    </div>
  );
}
