import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthContext } from '../context/AuthContext';
import LoginForm from '../components/Auth/LoginForm';

const LoginPage = () => {
  const { user, isLoading, login, signup, authError, loginLockRemaining } = useAuthContext();

  if (user && !isLoading) {
    const completed = localStorage.getItem('ht_onboarding_complete');
    return <Navigate to={completed ? '/' : '/onboarding'} replace />;
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
        <motion.div
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ fontSize: '1.2rem', fontWeight: 600 }}
        >
          Loading Application...
        </motion.div>
      </div>
    );
  }

  return (
    <LoginForm
      onLogin={login}
      onSignup={signup}
      isLoading={isLoading}
      error={authError}
      loginLockRemaining={loginLockRemaining}
    />
  );
};

export default LoginPage;
