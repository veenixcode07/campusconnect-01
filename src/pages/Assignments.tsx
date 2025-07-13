import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, FileText, Plus } from 'lucide-react';

export const Assignments: React.FC = () => {
  const { user } = useAuth();

  const assignments = [
    {
      id: 1,
      title: "Data Structures Project",
      subject: "Computer Science",
      dueDate: "2024-01-20",
      status: "pending",
      description: "Implement a binary search tree with all basic operations"
    },
    {
      id: 2,
      title: "Physics Lab Report",
      subject: "Physics",
      dueDate: "2024-01-18",
      status: "submitted",
      description: "Analysis of pendulum motion experiments"
    },
    {
      id: 3,
      title: "Mathematics Assignment",
      subject: "Mathematics",
      dueDate: "2024-01-25",
      status: "pending",
      description: "Solve calculus problems from chapter 5"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Assignments</h1>
        {user?.role === 'faculty' && (
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Assignment
          </Button>
        )}
      </div>

      <div className="grid gap-6">
        {assignments.map((assignment) => (
          <Card key={assignment.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    {assignment.title}
                  </CardTitle>
                  <CardDescription>{assignment.subject}</CardDescription>
                </div>
                <Badge className={`${getStatusColor(assignment.status)} text-white`}>
                  {assignment.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{assignment.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" />
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {Math.ceil((new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                {assignment.status === 'pending' && user?.role === 'student' && (
                  <Button size="sm">Submit Assignment</Button>
                )}
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};