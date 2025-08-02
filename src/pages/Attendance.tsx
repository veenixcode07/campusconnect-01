import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  BarChart3,
  Download
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AttendanceRecord {
  subject: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
  lastUpdated: string;
  recentAttendance: boolean[];
}

interface DayAttendance {
  date: string;
  subjects: {
    subject: string;
    present: boolean;
    time: string;
  }[];
}

export const Attendance: React.FC = () => {
  const { user } = useAuth();
  const [selectedSemester, setSelectedSemester] = useState('current');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data - in real app this would come from SAP API
  const attendanceData: AttendanceRecord[] = [
    {
      subject: 'Data Structures',
      totalClasses: 45,
      attendedClasses: 41,
      percentage: 91,
      lastUpdated: '2024-01-15',
      recentAttendance: [true, true, false, true, true, true, true, true, false, true]
    },
    {
      subject: 'Operating Systems',
      totalClasses: 42,
      attendedClasses: 33,
      percentage: 79,
      lastUpdated: '2024-01-15',
      recentAttendance: [true, false, true, true, false, true, true, false, true, true]
    },
    {
      subject: 'Computer Networks',
      totalClasses: 38,
      attendedClasses: 34,
      percentage: 89,
      lastUpdated: '2024-01-15',
      recentAttendance: [true, true, true, false, true, true, true, true, true, false]
    },
    {
      subject: 'Database Management',
      totalClasses: 40,
      attendedClasses: 28,
      percentage: 70,
      lastUpdated: '2024-01-15',
      recentAttendance: [false, true, false, true, true, false, true, false, true, true]
    },
    {
      subject: 'Software Engineering',
      totalClasses: 35,
      attendedClasses: 32,
      percentage: 91,
      lastUpdated: '2024-01-15',
      recentAttendance: [true, true, true, true, false, true, true, true, true, true]
    }
  ];

  const recentDays: DayAttendance[] = [
    {
      date: '2024-01-15',
      subjects: [
        { subject: 'Data Structures', present: true, time: '9:00 AM' },
        { subject: 'Operating Systems', present: true, time: '11:00 AM' },
        { subject: 'Computer Networks', present: false, time: '2:00 PM' },
      ]
    },
    {
      date: '2024-01-14',
      subjects: [
        { subject: 'Database Management', present: true, time: '10:00 AM' },
        { subject: 'Software Engineering', present: true, time: '1:00 PM' },
      ]
    },
    {
      date: '2024-01-13',
      subjects: [
        { subject: 'Data Structures', present: true, time: '9:00 AM' },
        { subject: 'Operating Systems', present: false, time: '11:00 AM' },
        { subject: 'Computer Networks', present: true, time: '2:00 PM' },
      ]
    }
  ];

  const overallAttendance = Math.round(
    attendanceData.reduce((sum, record) => sum + record.percentage, 0) / attendanceData.length
  );

  const criticalSubjects = attendanceData.filter(record => record.percentage < 80);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call to SAP system
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 90) return { color: 'text-green-600', status: 'Excellent' };
    if (percentage >= 80) return { color: 'text-blue-600', status: 'Good' };
    if (percentage >= 75) return { color: 'text-yellow-600', status: 'Warning' };
    return { color: 'text-red-600', status: 'Critical' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Attendance Tracker</h1>
          <p className="text-muted-foreground">Monitor your class attendance across all subjects</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Syncing...' : 'Sync SAP'}
          </Button>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overall Attendance</p>
              <p className="text-xl font-bold">{overallAttendance}%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Classes Attended</p>
              <p className="text-xl font-bold">
                {attendanceData.reduce((sum, record) => sum + record.attendedClasses, 0)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-full">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Critical Subjects</p>
              <p className="text-xl font-bold">{criticalSubjects.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Attendance Alert */}
      {criticalSubjects.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              Attendance Warning
            </CardTitle>
            <CardDescription className="text-red-600">
              You have {criticalSubjects.length} subject(s) with attendance below 80%. 
              Immediate action required to avoid academic consequences.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {criticalSubjects.map((subject) => (
                <div key={subject.subject} className="flex items-center justify-between">
                  <span className="font-medium">{subject.subject}</span>
                  <Badge variant="destructive">{subject.percentage}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject-wise Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Subject-wise Attendance
            </CardTitle>
            <CardDescription>Detailed breakdown by subject</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {attendanceData.map((record) => {
              const status = getAttendanceStatus(record.percentage);
              return (
                <div key={record.subject} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{record.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        {record.attendedClasses}/{record.totalClasses} classes
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${status.color}`}>{record.percentage}%</p>
                      <p className="text-xs text-muted-foreground">{status.status}</p>
                    </div>
                  </div>
                  
                  <Progress value={record.percentage} className="h-2" />
                  
                  {/* Recent Attendance Pattern */}
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground mr-2">Recent:</span>
                    {record.recentAttendance.slice(-10).map((present, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full ${
                          present ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        title={present ? 'Present' : 'Absent'}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Attendance
            </CardTitle>
            <CardDescription>Last few days of attendance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentDays.map((day) => (
              <div key={day.date} className="space-y-2">
                <h4 className="font-medium text-sm">
                  {new Date(day.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </h4>
                <div className="space-y-2">
                  {day.subjects.map((subject, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="text-sm font-medium">{subject.subject}</p>
                        <p className="text-xs text-muted-foreground">{subject.time}</p>
                      </div>
                      <Badge variant={subject.present ? 'default' : 'destructive'}>
                        {subject.present ? 'Present' : 'Absent'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Actions</CardTitle>
          <CardDescription>Manage your attendance records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Report
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Request Correction
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              View Calendar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};