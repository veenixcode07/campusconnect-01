import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          // Load user profile when authenticated
          loadUserProfile(session.user.id);
        } else {
          setUser(null);
          localStorage.removeItem('user');
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        // @ts-ignore - Types will be regenerated after migration
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error || !profile) {
        throw new Error('Profile not found');
      }

      const userData: User = {
        id: (profile as any).id,
        sapid: (profile as any).sapid,
        name: (profile as any).name,
        role: (profile as any).role as UserRole,
        department: (profile as any).department,
        year: (profile as any).year,
        section: (profile as any).section,
        createdAt: (profile as any).created_at
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      console.error('Error loading profile:', err);
      setUser(null);
      localStorage.removeItem('user');
    }
  };

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
        // @ts-ignore - Types will be regenerated after migration
        .from('profiles')
        .select('*')
        .eq('sapid', sapid)
        .single();

      if (profileError || !profile) {
        throw new Error('Profile not found');
      }

      const userData: User = {
        id: (profile as any).id,
        sapid: (profile as any).sapid,
        name: (profile as any).name,
        role: (profile as any).role as UserRole,
        department: (profile as any).department,
        year: (profile as any).year,
        section: (profile as any).section,
        createdAt: (profile as any).created_at
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