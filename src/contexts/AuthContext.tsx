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
      // First, authenticate with Supabase using email/password
      // We'll use a mapping of SAPID to email for demo accounts
      const emailMapping: Record<string, string> = {
        'STU001': 'student@college.edu',
        'ADM001': 'admin@college.edu', 
        'FAC001': 'faculty@college.edu'
      };

      const email = emailMapping[sapid];
      if (!email) {
        throw new Error('Invalid SAPID');
      }

      // Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (authError) {
        throw new Error('Invalid credentials');
      }

      // Query the profiles table for the user data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('sapid', sapid)
        .single();

      if (profileError || !profile) {
        throw new Error('Profile not found');
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
    supabase.auth.signOut();
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