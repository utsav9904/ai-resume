import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useResumeStore } from '../store/useResumeStore';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to decode JWT payload without a library
const decodeJWTPayload = (token: string): any => {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};

const isTokenExpired = (token: string): boolean => {
  const payload = decodeJWTPayload(token);
  if (!payload || !payload.exp) return false;
  return Date.now() >= payload.exp * 1000;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const resetResume = useResumeStore((state) => state.resetResume);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');

      if (!storedToken) {
        setLoading(false);
        return;
      }

      // If the JWT is expired, log out immediately
      if (isTokenExpired(storedToken)) {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        resetResume(); // Clear any leftover resume data
        setLoading(false);
        return;
      }

      // Token is valid — trust it
      setToken(storedToken);

      // Try to fetch full user profile (best effort — do NOT log out if it fails)
      try {
        const response = await api.get('/api/auth/profile');
        if (response?.data) {
          setUser(response.data);
        }
      } catch {
        // Backend unreachable — stay logged in with JWT
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (newToken: string, newUser: User) => {
    resetResume(); // 🔑 Clear previous user's resume data before loading new session
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    resetResume(); // 🔑 Clear resume data on logout so the next user starts fresh
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
