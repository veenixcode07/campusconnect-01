import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthState } from '@/types/auth';
import { supabase, Profile } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

interface AuthContextType extends AuthState {
  login: (sapid: string, password: string) => Promise<void>;
  signup: (sapid: string, password: string, userData: Partial<Profile>) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setAuthState({ user: null, loading: false, error: null });
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await loadUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setAuthState({ user: null, loading: false, error: null });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      const user: User = {
        id: profile.id,
        email: profile.sapid,
        name: profile.name,
        role: profile.role,
        department: profile.department,
        year: profile.year,
        createdAt: profile.created_at,
      };

      setAuthState({ user, loading: false, error: null });
    } catch (error) {
      console.error('Error loading user profile:', error);
      setAuthState({ user: null, loading: false, error: 'Failed to load user profile' });
    }
  };

  const login = async (sapid: string, password: string): Promise<void> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // First, find the user's email by SAPID
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('sapid', sapid)
        .single();

      if (profileError || !profile) {
        throw new Error('Invalid SAPID');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }
      
      // User profile will be loaded by the auth state change listener
    } catch (error) {
      setAuthState({
        user: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Login failed'
      });
      throw error;
    }
  };

  const signup = async (sapid: string, password: string, userData: Partial<Profile>): Promise<void> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Generate email from SAPID for Supabase auth
      const email = `${sapid}@college.edu`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw new Error(error.message);

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email,
            sapid,
            ...userData,
          });

        if (profileError) throw new Error(profileError.message);
      }
    } catch (error) {
      setAuthState({
        user: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Signup failed'
      });
      throw error;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setAuthState({ user: null, loading: false, error: null });
  };

  const value: AuthContextType = {
    ...authState,
    login,
    signup,
    logout,
    isAuthenticated: !!authState.user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};