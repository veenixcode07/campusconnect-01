export type UserRole = 'student' | 'admin' | 'faculty';

export interface User {
  id: string;
  sapid: string;
  name: string;
  role: UserRole;
  department?: string;
  year?: string;
  section?: string;
  rollNumber?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}