import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { StudentDashboard } from '@/components/Dashboard/StudentDashboard';
import { AdminDashboard } from '@/components/Dashboard/AdminDashboard';
import { FacultyDashboard } from '@/components/Dashboard/FacultyDashboard';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'student':
      return <StudentDashboard user={user} />;
    case 'admin':
      return <AdminDashboard user={user} />;
    case 'faculty':
      return <FacultyDashboard user={user} />;
    default:
      return <div>Invalid user role</div>;
  }
};