import { get, loginUser } from '@/lib/api';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role: 'USER' | 'ADMIN' | 'user' | 'admin';
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (user: User) => void;
  loginWithToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  });

  // Persistance du token
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  // Récupère le profil utilisateur si token présent
  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        try {
          const res = await get<User>('/api/users/me');
          setUser(res.data);
          setIsAuthenticated(true);
        } catch {
          console.log('logout');
          logout();
        }
      } else {
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      }
    };
    fetchProfile();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const { token: jwt } = await loginUser(email, password);
      setToken(jwt);
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      logout();
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  // TODO: register à brancher sur l'API
  const register = (userData: User) => {
    setUser({ ...userData, role: userData.role || 'user' });
    setIsAuthenticated(true);
  };

  const loginWithToken = (jwt: string) => {
    setToken(jwt);
    // Le useEffect se chargera de récupérer le profil utilisateur
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, token, login, logout, register, loginWithToken }}
    >
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

export { AuthContext };
