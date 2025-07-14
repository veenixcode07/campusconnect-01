import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, MapPin, Calendar, BookOpen, TrendingUp, Clock } from 'lucide-react';

interface StudentProfile {
  id: number;
  name: string;
  rollNumber: string;
  class: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  attendance: number;
  averageGrade: number;
  status: string;
  enrolledCourses: string[];
  recentActivity: {
    date: string;
    activity: string;
  }[];
}

interface StudentProfileModalProps {
  student: any;
  isOpen: boolean;
  onClose: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({ student, isOpen, onClose }) => {
  // Extended student profile data
  const fullProfile: StudentProfile = {
    ...student,
    email: `${student.rollNumber.toLowerCase()}@college.edu`,
    phone: "+1 (555) 123-4567",
    address: "123 College Street, Campus City, CC 12345",
    dateOfBirth: "2001-05-15",
    enrolledCourses: ["Data Structures", "Web Development", "Database Systems", "Machine Learning"],
    recentActivity: [
      { date: "2024-01-15", activity: "Submitted Database Assignment" },
      { date: "2024-01-14", activity: "Attended ML Workshop" },
      { date: "2024-01-13", activity: "Posted query in forum" },
      { date: "2024-01-12", activity: "Downloaded course materials" }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'needs_attention': return 'bg-yellow-500';
      case 'at_risk': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Student Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{fullProfile.name}</span>
                <Badge className={`${getStatusColor(fullProfile.status)} text-white`}>
                  {fullProfile.status.replace('_', ' ')}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Roll Number: {fullProfile.rollNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Class: {fullProfile.class}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{fullProfile.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{fullProfile.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{fullProfile.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">DOB: {new Date(fullProfile.dateOfBirth).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Academic Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary">{fullProfile.attendance}%</div>
                  <div className="text-sm text-muted-foreground">Attendance</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">{fullProfile.averageGrade}</div>
                  <div className="text-sm text-muted-foreground">Average Grade</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">{fullProfile.enrolledCourses.length}</div>
                  <div className="text-sm text-muted-foreground">Enrolled Courses</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enrolled Courses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Enrolled Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {fullProfile.enrolledCourses.map((course, index) => (
                  <Badge key={index} variant="outline">{course}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {fullProfile.recentActivity.map((activity, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{activity.activity}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(activity.date).toLocaleDateString()}
                      </span>
                    </div>
                    {index < fullProfile.recentActivity.length - 1 && <Separator className="mt-2" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};