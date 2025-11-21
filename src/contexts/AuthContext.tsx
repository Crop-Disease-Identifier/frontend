import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Mock login
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsAuthenticated(true);
    setUser({ name: email.split('@')[0], email });
  };

  const signup = async (email: string, password: string, name?: string) => {
    // Mock signup
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsAuthenticated(true);
    setUser({ name: name || email.split('@')[0], email });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout, updateUser }}>
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