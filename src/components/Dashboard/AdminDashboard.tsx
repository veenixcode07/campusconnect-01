import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Users, 
  MessageSquare, 
  BookOpen,
  AlertCircle,
  TrendingUp,
  Calendar,
  FileText
} from 'lucide-react';
import { User } from '@/types/auth';
import { Link } from 'react-router-dom';

interface AdminDashboardProps {
  user: User;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  // Mock data - in real app this would come from API
  const stats = {
    totalStudents: 156,
    activeQueries: 12,
    pendingNotices: 3,
    resourcesUploaded: 45,
  };

  const recentActivity = [
    { id: 1, type: 'query', content: 'New query posted about Data Structures', time: '2 hours ago' },
    { id: 2, type: 'notice', content: 'Posted exam schedule notice', time: '1 day ago' },
    { id: 3, type: 'resource', content: 'Uploaded OS lab manual', time: '2 days ago' },
  ];

  const pendingTasks = [
    { id: 1, task: 'Review CS department queries', priority: 'high', count: 5 },
    { id: 2, task: 'Update attendance records', priority: 'medium', count: 3 },
    { id: 3, task: 'Approve resource uploads', priority: 'low', count: 2 },
  ];

  const quickActions = [
    { name: 'Post Notice', href: '/notices/new', icon: MessageSquare, color: 'bg-blue-100 text-blue-600' },
    { name: 'Upload Resource', href: '/resources/new', icon: BookOpen, color: 'bg-green-100 text-green-600' },
    { name: 'View Queries', href: '/queries', icon: Users, color: 'bg-purple-100 text-purple-600' },
    { name: 'Add Assignment', href: '/assignments/new', icon: FileText, color: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome {user.name} • {user.department} • Student Admin
        </p>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used admin functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.name}
                  asChild
                  variant="outline"
                  className="h-20 flex-col gap-2 hover:bg-muted/50"
                >
                  <Link to={action.href}>
                    <div className={`p-2 rounded-full ${action.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm">{action.name}</span>
                  </Link>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-xl font-bold">{stats.totalStudents}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-full">
              <MessageSquare className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Queries</p>
              <p className="text-xl font-bold">{stats.activeQueries}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-full">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Notices</p>
              <p className="text-xl font-bold">{stats.pendingNotices}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <BookOpen className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Resources</p>
              <p className="text-xl font-bold">{stats.resourcesUploaded}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className={`p-1 rounded-full ${
                  activity.type === 'query' ? 'bg-blue-100' :
                  activity.type === 'notice' ? 'bg-green-100' : 'bg-purple-100'
                }`}>
                  {activity.type === 'query' && <MessageSquare className="w-3 h-3 text-blue-600" />}
                  {activity.type === 'notice' && <AlertCircle className="w-3 h-3 text-green-600" />}
                  {activity.type === 'resource' && <BookOpen className="w-3 h-3 text-purple-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{activity.content}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
            <CardDescription>Items requiring your attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium">{task.task}</p>
                  <p className="text-xs text-muted-foreground">{task.count} items</p>
                </div>
                <Badge 
                  variant={
                    task.priority === 'high' ? 'destructive' :
                    task.priority === 'medium' ? 'default' : 'secondary'
                  }
                >
                  {task.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};