import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import {
  login as apiLogin,
  signup as apiSignup,
  getUser,
  logout as apiLogout
} from '../api';

interface User {
  name: string;
  email: string;
  // Add other fields as needed
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch user on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setLoading(true);
      getUser()
        .then(res => {
          setUser(res.data);
          setIsAuthenticated(true);
        })
        .catch(() => {
          setUser(null);
          setIsAuthenticated(false);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await apiLogin({ email, password });
      localStorage.setItem('token', res.data.token);
      const userRes = await getUser();
      setUser(userRes.data);
      setIsAuthenticated(true);
    } catch (err: any) {
      let errorMessage = err.response?.data?.message || err.message || 'Login failed';
      if (err.message === 'Network Error') {
        errorMessage = 'Unable to connect to the server. Please check your internet connection or try again later.';
      }
      setError(errorMessage);
      setIsAuthenticated(false);
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await apiSignup({ email, password, name });
      localStorage.setItem('token', res.data.token);
      const userRes = await getUser();
      setUser(userRes.data);
      setIsAuthenticated(true);
    } catch (err: any) {
      let errorMessage = err.response?.data?.message || err.message || 'Signup failed';
      if (err.message === 'Network Error') {
        errorMessage = 'Unable to connect to the server. Please check your internet connection or try again later.';
      }
      setError(errorMessage);
      setIsAuthenticated(false);
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError('');
    try {
      await apiLogout();
    } catch (err) {
      // Optionally handle error
    }
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    setLoading(false);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, error, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}