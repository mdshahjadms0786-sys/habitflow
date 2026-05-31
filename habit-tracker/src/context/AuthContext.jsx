import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  signUp as supabaseSignUp,
  signIn as supabaseSignIn,
  signOut as supabaseSignOut,
  getCurrentUser,
  onAuthStateChange,
  resetPassword as supabaseResetPassword,
  resendVerificationEmail as supabaseResendVerification,
} from '../services/supabaseService';
import { supabase } from '../services/supabaseClient';
import toast from 'react-hot-toast';
import logger from '../utils/logger';

const AuthContext = createContext(null);
const LOCK_DURATION_MS = 30000;
const MAX_ATTEMPTS = 3;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [loginAttempts, setLoginAttempts] = useState(() => {
    return parseInt(localStorage.getItem('ht_login_attempts') || '0', 10);
  });
  const [loginLockedUntil, setLoginLockedUntil] = useState(() => {
    const stored = localStorage.getItem('ht_login_locked_until');
    return stored ? parseInt(stored, 10) : null;
  });

  const clearLoginLock = useCallback(() => {
    setLoginAttempts(0);
    setLoginLockedUntil(null);
    localStorage.removeItem('ht_login_attempts');
    localStorage.removeItem('ht_login_locked_until');
  }, []);

  useEffect(() => {
    let subscription = null;

    const initializeAuth = async () => {
      try {
        const { data: currentUser, error } = await getCurrentUser();
        if (error) {
          logger.error('Error fetching user on init:', error);
        } else {
          setUser(currentUser);
        }
      } finally {
        setIsLoading(false);
      }

      const { data } = onAuthStateChange((event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      });
      subscription = data?.subscription;
    };

    initializeAuth();

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const signup = async (email, password) => {
    setIsLoading(true);
    setAuthError(null);
    const { data, error } = await supabaseSignUp(email, password);
    if (error) {
      setAuthError(error.message);
      toast.error(error.message);
    } else {
      if (data?.user) {
        await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            plan: 'free',
            total_points: 0,
            current_level: 1
          });
      }
      toast.success('Sign up successful! Please check your email to verify.');
    }
    setIsLoading(false);
    return { data, error };
  };

  const login = async (email, password) => {
    if (loginLockedUntil && Date.now() < loginLockedUntil) {
      toast.error('Too many attempts. Please wait.');
      return { data: null, error: { message: 'Rate limited' } };
    }

    setIsLoading(true);
    setAuthError(null);
    const { data, error } = await supabaseSignIn(email, password);
    if (error) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      localStorage.setItem('ht_login_attempts', String(newAttempts));

      if (newAttempts >= MAX_ATTEMPTS) {
        const lockTime = Date.now() + LOCK_DURATION_MS;
        setLoginLockedUntil(lockTime);
        localStorage.setItem('ht_login_locked_until', String(lockTime));
        toast.error('Too many failed attempts. Please wait 30 seconds.');
      } else {
        setAuthError(error.message);
        toast.error(error.message);
      }
    } else {
      clearLoginLock();
      toast.success('Successfully logged in!');
    }
    setIsLoading(false);
    return { data, error };
  };

  const logout = async () => {
    setIsLoading(true);
    const { error } = await supabaseSignOut();
    if (error) {
      toast.error(error.message);
    } else {
      setUser(null);
      toast.success('Logged out successfully.');
    }
    setIsLoading(false);
  };

  const resetPassword = async (email) => {
    const result = await supabaseResetPassword(email);
    if (result.error) {
      toast.error(result.error.message);
    } else {
      toast.success('Password reset link sent! Check your email.');
    }
    return result;
  };

  const resendVerification = async (email) => {
    const result = await supabaseResendVerification(email);
    if (result.error) {
      toast.error(result.error.message);
    } else {
      toast.success('Verification email resent! Check your inbox.');
    }
    return result;
  };

  const loginLockRemaining = loginLockedUntil
    ? Math.max(0, Math.ceil((loginLockedUntil - Date.now()) / 1000))
    : 0;

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    authError,
    signup,
    login,
    logout,
    resetPassword,
    resendVerification,
    loginLockRemaining,
    signUp: signup,
    signIn: login,
    signOut: logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within AuthProvider');
  return context;
}