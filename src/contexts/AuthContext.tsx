import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User, UserRole } from '../types/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (sapid: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Demo passwords for testing
  const demoPasswords: Record<string, string> = {
    'STU001': 'password123',
    'ADM001': 'admin123',
    'FAC001': 'faculty123'
  };

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (sapid: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // Query the profiles table for the user
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('sapid', sapid)
        .single();

      if (profileError || !profile) {
        throw new Error('Invalid SAPID');
      }

      // Check password (using demo passwords for now)
      if (demoPasswords[sapid] !== password) {
        throw new Error('Invalid password');
      }

      const userData: User = {
        id: profile.id,
        sapid: profile.sapid,
        name: profile.name,
        role: profile.role as UserRole,
        department: profile.department,
        year: profile.year,
        section: profile.section,
        createdAt: profile.created_at
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
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