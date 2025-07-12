import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuth();

  if (!user) return null;

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'default';
      case 'faculty': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg hidden sm:inline">Campus Connect</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium">{user.name}</p>
            <div className="flex items-center gap-2">
              <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
              {user.department && (
                <span className="text-xs text-muted-foreground">{user.department}</span>
              )}
            </div>
          </div>
          
          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-xs">
              {user.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};