import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthState, UserRole } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
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

// Mock users for demo - in real app this would come from Supabase
const mockUsers: Record<string, { password: string; user: User }> = {
  'student@college.edu': {
    password: 'password123',
    user: {
      id: '1',
      email: 'student@college.edu',
      name: 'John Doe',
      role: 'student',
      department: 'Computer Science',
      year: '3rd Year',
      createdAt: new Date().toISOString(),
    }
  },
  'admin@college.edu': {
    password: 'admin123',
    user: {
      id: '2',
      email: 'admin@college.edu',
      name: 'Jane Smith',
      role: 'admin',
      department: 'Computer Science',
      year: '4th Year',
      createdAt: new Date().toISOString(),
    }
  },
  'faculty@college.edu': {
    password: 'faculty123',
    user: {
      id: '3',
      email: 'faculty@college.edu',
      name: 'Dr. Robert Johnson',
      role: 'faculty',
      department: 'Computer Science',
      createdAt: new Date().toISOString(),
    }
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('campus_connect_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setAuthState({ user, loading: false, error: null });
      } catch (error) {
        localStorage.removeItem('campus_connect_user');
        setAuthState({ user: null, loading: false, error: null });
      }
    } else {
      setAuthState({ user: null, loading: false, error: null });
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userRecord = mockUsers[email];
      if (!userRecord || userRecord.password !== password) {
        throw new Error('Invalid email or password');
      }

      const user = userRecord.user;
      localStorage.setItem('campus_connect_user', JSON.stringify(user));
      setAuthState({ user, loading: false, error: null });
    } catch (error) {
      setAuthState({
        user: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Login failed'
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('campus_connect_user');
    setAuthState({ user: null, loading: false, error: null });
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    isAuthenticated: !!authState.user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};