import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Bell, 
  BookOpen, 
  MessageSquare, 
  Calendar,
  ClipboardList,
  Users,
  LogOut,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';
import { LogoutConfirmModal } from '@/components/LogoutConfirmModal';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}

const navigationItems: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['student', 'admin', 'faculty'] },
  { name: 'Notices', href: '/notices', icon: Bell, roles: ['student', 'admin', 'faculty'] },
  { name: 'Resources', href: '/resources', icon: BookOpen, roles: ['student', 'admin', 'faculty'] },
  { name: 'Query Forum', href: '/queries', icon: MessageSquare, roles: ['student', 'admin', 'faculty'] },
  { name: 'Attendance', href: '/attendance', icon: Calendar, roles: ['student', 'admin'] },
  { name: 'Assignments', href: '/assignments', icon: ClipboardList, roles: ['student', 'admin', 'faculty'] },
  { name: 'Student Tracking', href: '/tracking', icon: Users, roles: ['faculty'] },
];

interface NavigationProps {
  isDesktop?: boolean;
  onItemClick?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ isDesktop = false, onItemClick }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  if (!user) return null;

  const availableItems = navigationItems.filter(item => 
    item.roles.includes(user.role)
  );

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    onItemClick?.();
    setShowLogoutModal(false);
  };

  return (
    <nav className="space-y-2">
      {availableItems.map((item) => {
        const isActive = location.pathname === item.href;
        const Icon = item.icon;
        
        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={onItemClick}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
          >
            <Icon className="w-4 h-4" />
            <span className={isDesktop ? "" : "sr-only md:not-sr-only"}>{item.name}</span>
          </Link>
        );
      })}
      
      <Button
        variant="ghost"
        onClick={handleLogout}
        className={cn(
          'w-full justify-start gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground',
          !isDesktop && 'justify-center'
        )}
      >
        <LogOut className="w-4 h-4" />
        <span className={isDesktop ? "" : "sr-only md:not-sr-only"}>Logout</span>
      </Button>
      
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />
    </nav>
  );
};