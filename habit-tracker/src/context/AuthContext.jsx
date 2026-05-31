import { createContext, useContext, useState, useEffect } from 'react';
import { 
  signUp as supabaseSignUp, 
  signIn as supabaseSignIn, 
  signOut as supabaseSignOut, 
  getCurrentUser, 
  onAuthStateChange 
} from '../services/supabaseService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let subscription = null;

    const initializeAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Error fetching user on init:', err);
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
      toast.success('Sign up successful! Please check your email to verify.');
    }
    setIsLoading(false);
    return { data, error };
  };

  const login = async (email, password) => {
    setIsLoading(true);
    setAuthError(null);
    const { data, error } = await supabaseSignIn(email, password);
    if (error) {
      setAuthError(error.message);
      toast.error(error.message);
    } else {
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

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    authError,
    signup,
    login,
    logout,
    signUp: signup,
    signIn: login,
    signOut: logout
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