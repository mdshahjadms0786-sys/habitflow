import LoginForm from './LoginForm';
import { useLocation, Navigate } from 'react-router-dom';

export default function AuthGuard({ children, user, isLoading, onLogin, onSignup, authError, loginLockRemaining }) {
  const location = useLocation();

  if (location.pathname === '/landing') {
    return children;
  }

  if (location.pathname === '/login') {
    return children;
  }

  if (location.pathname === '/auth/callback') {
    return children;
  }

  if (location.pathname === '/onboarding') {
    return children;
  }

  if (location.pathname === '/forgot-password') {
    return children;
  }

  if (location.pathname === '/reset-password') {
    return children;
  }

  // Redirect unauthenticated users from root to landing page
  if (!user && !isLoading && location.pathname === '/') {
    return <Navigate to="/landing" replace />;
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>Loading Application...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg)', padding: '20px' }}>
        <LoginForm
          onLogin={onLogin}
          onSignup={onSignup}
          isLoading={isLoading}
          error={authError}
          loginLockRemaining={loginLockRemaining}
        />
      </div>
    );
  }

  return children;
}
