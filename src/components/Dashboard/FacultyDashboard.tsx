import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  MessageSquare, 
  BookOpen,
  ClipboardList,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';
import { User } from '@/types/auth';
import { Link } from 'react-router-dom';

interface FacultyDashboardProps {
  user: User;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ user }) => {
  // Mock data - in real app this would come from API
  const stats = {
    totalStudents: 89,
    pendingQueries: 7,
    assignmentsPosted: 12,
    averageAttendance: 82,
  };

  const pendingQueries = [
    { 
      id: 1, 
      student: 'John Doe', 
      subject: 'Data Structures', 
      question: 'Can you explain the difference between arrays and linked lists?',
      time: '2 hours ago',
      urgent: false
    },
    { 
      id: 2, 
      student: 'Jane Smith', 
      subject: 'Operating Systems', 
      question: 'How does process scheduling work in real-time systems?',
      time: '4 hours ago',
      urgent: true
    },
    { 
      id: 3, 
      student: 'Mike Johnson', 
      subject: 'Computer Networks', 
      question: 'What is the purpose of the OSI model?',
      time: '1 day ago',
      urgent: false
    },
  ];

  const upcomingDeadlines = [
    { id: 1, type: 'assignment', title: 'Algorithm Analysis Report', dueDate: '2024-01-20', subject: 'Data Structures' },
    { id: 2, type: 'exam', title: 'Mid-term Evaluation', dueDate: '2024-01-25', subject: 'Operating Systems' },
    { id: 3, type: 'project', title: 'Network Protocol Implementation', dueDate: '2024-02-01', subject: 'Computer Networks' },
  ];

  const recentActivity = [
    { id: 1, type: 'query_answered', content: 'Answered query about binary search trees', time: '3 hours ago' },
    { id: 2, type: 'assignment_posted', content: 'Posted new assignment for OS course', time: '1 day ago' },
    { id: 3, type: 'student_tracked', content: 'Updated progress notes for 5 students', time: '2 days ago' },
  ];

  const classSchedule = [
    { time: '9:00 AM', subject: 'Data Structures', room: 'CS-101', students: 45 },
    { time: '11:00 AM', subject: 'Operating Systems', room: 'CS-203', students: 38 },
    { time: '2:00 PM', subject: 'Computer Networks', room: 'CS-305', students: 42 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-6 border">
        <h1 className="text-2xl font-bold text-gray-900">Faculty Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome {user.name} • {user.department} Department • Faculty
        </p>
      </div>

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
              <p className="text-sm text-muted-foreground">Pending Queries</p>
              <p className="text-xl font-bold">{stats.pendingQueries}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <ClipboardList className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Assignments Posted</p>
              <p className="text-xl font-bold">{stats.assignmentsPosted}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-full">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Attendance</p>
              <p className="text-xl font-bold">{stats.averageAttendance}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Today's Schedule
            </CardTitle>
            <CardDescription>Your classes for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {classSchedule.map((class_, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">{class_.subject}</p>
                  <p className="text-xs text-muted-foreground">
                    {class_.time} • {class_.room} • {class_.students} students
                  </p>
                </div>
                <Badge variant="outline">
                  {class_.time}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pending Queries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Pending Queries
            </CardTitle>
            <CardDescription>Student questions awaiting response</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingQueries.slice(0, 3).map((query) => (
              <div key={query.id} className="space-y-2 p-3 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{query.student}</p>
                    <p className="text-xs text-muted-foreground">{query.subject} • {query.time}</p>
                  </div>
                  {query.urgent && (
                    <Badge variant="destructive" className="text-xs">
                      Urgent
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-700">{query.question}</p>
              </div>
            ))}
            <Button asChild className="w-full">
              <Link to="/queries">View All Queries</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Important dates and deadlines</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingDeadlines.map((deadline) => (
              <div key={deadline.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">{deadline.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {deadline.subject} • Due: {deadline.dueDate}
                  </p>
                </div>
                <Badge variant="outline">
                  {deadline.type}
                </Badge>
              </div>
            ))}
            <Button asChild variant="outline" className="w-full">
              <Link to="/assignments">Manage Assignments</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className={`p-1 rounded-full ${
                  activity.type === 'query_answered' ? 'bg-blue-100' :
                  activity.type === 'assignment_posted' ? 'bg-green-100' : 'bg-purple-100'
                }`}>
                  {activity.type === 'query_answered' && <MessageSquare className="w-3 h-3 text-blue-600" />}
                  {activity.type === 'assignment_posted' && <ClipboardList className="w-3 h-3 text-green-600" />}
                  {activity.type === 'student_tracked' && <Users className="w-3 h-3 text-purple-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{activity.content}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
            <Button asChild variant="outline" className="w-full">
              <Link to="/tracking">Student Tracking</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};