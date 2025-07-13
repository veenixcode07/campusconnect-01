import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, User, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

export const StudentTracking: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('all');

  const students = [
    {
      id: 1,
      name: "John Doe",
      rollNumber: "CS2021001",
      class: "CS-A",
      attendance: 85,
      averageGrade: 8.2,
      lastActivity: "2024-01-15",
      status: "active",
      trend: "up"
    },
    {
      id: 2,
      name: "Jane Smith",
      rollNumber: "CS2021002",
      class: "CS-A",
      attendance: 92,
      averageGrade: 9.1,
      lastActivity: "2024-01-15",
      status: "active",
      trend: "up"
    },
    {
      id: 3,
      name: "Mike Johnson",
      rollNumber: "CS2021003",
      class: "CS-B",
      attendance: 68,
      averageGrade: 6.5,
      lastActivity: "2024-01-13",
      status: "at_risk",
      trend: "down"
    },
    {
      id: 4,
      name: "Sarah Wilson",
      rollNumber: "CS2021004",
      class: "CS-A",
      attendance: 78,
      averageGrade: 7.8,
      lastActivity: "2024-01-14",
      status: "needs_attention",
      trend: "stable"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'needs_attention': return 'bg-yellow-500';
      case 'at_risk': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = filterClass === 'all' || student.class === filterClass;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Student Tracking</h1>
        <Button>Export Report</Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterClass} onValueChange={setFilterClass}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            <SelectItem value="CS-A">CS-A</SelectItem>
            <SelectItem value="CS-B">CS-B</SelectItem>
            <SelectItem value="CS-C">CS-C</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredStudents.map((student) => (
          <Card key={student.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {student.name}
                  </CardTitle>
                  <CardDescription>
                    {student.rollNumber} • {student.class}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(student.trend)}
                  <Badge className={`${getStatusColor(student.status)} text-white`}>
                    {student.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{student.attendance}%</p>
                  <p className="text-sm text-muted-foreground">Attendance</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{student.averageGrade}</p>
                  <p className="text-sm text-muted-foreground">Average Grade</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{new Date(student.lastActivity).toLocaleDateString()}</p>
                  <p className="text-sm text-muted-foreground">Last Activity</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">View Profile</Button>
                <Button variant="outline" size="sm">Contact Student</Button>
                <Button variant="outline" size="sm">Generate Report</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};