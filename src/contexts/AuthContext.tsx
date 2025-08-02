import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, UserRole } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (sapid: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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
      // Demo authentication logic
      const validCredentials = [
        { sapid: 'STU001', password: 'password123', name: 'John Student', role: 'student' as UserRole, department: 'Computer Science', year: '2024', section: 'A', rollNumber: 'CS24001' },
        { sapid: 'STU002', password: 'password123', name: 'Emma Wilson', role: 'student' as UserRole, department: 'Computer Science', year: '2024', section: 'B', rollNumber: 'CS24002' },
        { sapid: 'FAC001', password: 'faculty123', name: 'Dr. Sarah Faculty', role: 'faculty' as UserRole, department: 'Computer Science' },
        { sapid: 'FAC002', password: 'faculty123', name: 'Dr. Michael Chen', role: 'faculty' as UserRole, department: 'Computer Science' },
        { sapid: 'ADM001', password: 'admin123', name: 'Admin User', role: 'admin' as UserRole, department: 'Administration' },
        { sapid: 'ADM002', password: 'admin123', name: 'Sarah Admin', role: 'admin' as UserRole, department: 'Computer Science' }
      ];

      const credential = validCredentials.find(c => c.sapid === sapid && c.password === password);
      
      if (!credential) {
        throw new Error('Invalid credentials');
      }

      // Create user object directly for demo
      const userData: User = {
        id: `${credential.sapid}-id`,
        sapid: credential.sapid,
        name: credential.name,
        role: credential.role,
        department: credential.department,
        year: credential.year,
        section: credential.section,
        rollNumber: credential.rollNumber,
        createdAt: new Date().toISOString()
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during login';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};