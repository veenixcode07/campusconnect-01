import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  BookOpen, 
  MessageSquare, 
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  Users,
  FileText,
  Plus
} from 'lucide-react';
import { User } from '@/types/auth';
import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useQuery } from '@/contexts/QueryContext';

interface AdminDashboardProps {
  user: User;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const { getFilteredAssignments, getFilteredNotices, getFilteredResources } = useApp();
  const { filteredQueries } = useQuery();
  
  // Get filtered data based on user's class and role
  const assignments = getFilteredAssignments();
  const notices = getFilteredNotices();
  const resources = getFilteredResources();

  // Mock data - in real app this would come from API
  const attendanceData = {
    overall: 85,
    subjects: [
      { name: 'Data Structures', attendance: 92, classes: 25, attended: 23 },
      { name: 'Operating Systems', attendance: 78, classes: 30, attended: 23 },
      { name: 'Computer Networks', attendance: 89, classes: 22, attended: 19 },
    ]
  };

  const recentNotices = notices.slice(0, 3).map(notice => ({
    id: notice.id,
    title: notice.title,
    date: notice.date,
    urgent: notice.category === 'urgent'
  }));

  const upcomingAssignments = assignments.slice(0, 2).map(assignment => ({
    id: assignment.id,
    subject: assignment.subject,
    title: assignment.title,
    dueDate: assignment.dueDate
  }));

  const pendingQueries = filteredQueries.slice(0, 3).map(query => ({
    id: query.id,
    subject: query.subject,
    question: query.title,
    status: query.solved ? 'answered' : 'pending',
    author: query.author
  }));

  const quickActions = [
    { name: 'Post Notice', href: '/notices', icon: MessageSquare, color: 'bg-blue-100 text-blue-600' },
    { name: 'Upload Resource', href: '/resources', icon: BookOpen, color: 'bg-green-100 text-green-600' },
    { name: 'View Queries', href: '/queries', icon: Users, color: 'bg-purple-100 text-purple-600' },
    { name: 'Add Assignment', href: '/assignments', icon: FileText, color: 'bg-orange-100 text-orange-600' },
  ];

  const adminStats = {
    totalStudents: 156,
    activeQueries: 12,
    pendingNotices: 3,
    resourcesUploaded: 45,
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
        <p className="text-gray-600 mt-1">
          {user.department} • {user.year} • SAPID: {user.sapid} • Admin
        </p>
      </div>

      {/* Admin Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Quick Actions</CardTitle>
          <CardDescription>Administrative functions and tools</CardDescription>
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

      {/* Admin Stats + Student Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overall Attendance</p>
              <p className="text-xl font-bold">{attendanceData.overall}%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
               <p className="text-sm text-muted-foreground">Total Assignments</p>
               <p className="text-xl font-bold">{assignments.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-full">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
               <p className="text-sm text-muted-foreground">Pending Queries</p>
               <p className="text-xl font-bold">{filteredQueries.filter(q => !q.solved).length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-full">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-xl font-bold">{adminStats.totalStudents}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Attendance Overview
            </CardTitle>
            <CardDescription>Your attendance across all subjects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {attendanceData.subjects.map((subject, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{subject.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {subject.attended}/{subject.classes} classes
                  </span>
                </div>
                <Progress 
                  value={subject.attendance} 
                  className="h-2"
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {subject.attendance}%
                  </span>
                  {subject.attendance < 80 && (
                    <Badge variant="destructive" className="text-xs">
                      Below 80%
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            <Button asChild className="w-full mt-4">
              <Link to="/attendance">View Detailed Attendance</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Notices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Recent Notices
            </CardTitle>
            <CardDescription>Latest announcements and updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentNotices.map((notice) => (
              <div key={notice.id} className="flex items-start gap-3 p-3 border rounded-lg">
                {notice.urgent && (
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">{notice.title}</p>
                  <p className="text-xs text-muted-foreground">{notice.date}</p>
                </div>
                {notice.urgent && (
                  <Badge variant="destructive" className="text-xs">
                    Urgent
                  </Badge>
                )}
              </div>
            ))}
            <Button asChild variant="outline" className="w-full">
              <Link to="/notices">View All Notices</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Assignments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Assignments</CardTitle>
            <CardDescription>Assignments due soon</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingAssignments.map((assignment) => (
              <div key={assignment.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium">{assignment.title}</p>
                  <p className="text-xs text-muted-foreground">{assignment.subject}</p>
                  <p className="text-xs text-muted-foreground">Due: {assignment.dueDate}</p>
                </div>
              </div>
            ))}
            <Button asChild variant="outline" className="w-full">
              <Link to="/assignments">View All Assignments</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Query Status */}
         <Card>
           <CardHeader>
             <CardTitle>Recent Queries from Class {user.section}</CardTitle>
             <CardDescription>Questions from students in your class</CardDescription>
           </CardHeader>
           <CardContent className="space-y-3">
             {pendingQueries.length === 0 ? (
               <p className="text-sm text-muted-foreground text-center py-4">
                 No queries from Class {user.section} students yet.
               </p>
             ) : (
               pendingQueries.map((query) => (
                 <div key={query.id} className="flex items-start gap-3 p-3 border rounded-lg">
                   <div className="flex-1">
                     <p className="text-sm font-medium">{query.question}</p>
                     <p className="text-xs text-muted-foreground">{query.subject} • by {query.author}</p>
                   </div>
                   <Badge variant={query.status === 'answered' ? 'default' : 'secondary'}>
                     {query.status}
                   </Badge>
                 </div>
               ))
             )}
            <Button asChild variant="outline" className="w-full">
              <Link to="/queries">View Query Forum</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};