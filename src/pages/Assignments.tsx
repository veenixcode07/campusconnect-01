import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, FileText, Plus, Paperclip, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export const Assignments: React.FC = () => {
  const { user } = useAuth();

  const assignments = [
    {
      id: 1,
      title: "Data Structures and Algorithms Project",
      subject: "Computer Science",
      dueDate: "2024-02-15",
      description: "Implement a complete binary search tree with insert, delete, search operations and balanced tree functionality. Include unit tests and documentation.",
      instructor: "Dr. Sarah Johnson",
      attachments: ["project_requirements.pdf", "sample_test_cases.txt"],
      createdDate: "2024-01-10"
    },
    {
      id: 2,
      title: "Quantum Physics Research Assignment",
      subject: "Physics",
      dueDate: "2024-02-20",
      description: "Analyze the wave-particle duality experiment and write a comprehensive report on your findings. Include mathematical derivations and experimental observations.",
      instructor: "Prof. Michael Chen",
      attachments: ["experiment_guidelines.pdf", "reference_papers.zip"],
      createdDate: "2024-01-12"
    },
    {
      id: 3,
      title: "Advanced Calculus Problem Set",
      subject: "Mathematics",
      dueDate: "2024-02-10",
      description: "Solve integration problems from chapters 5-7. Show all working steps and provide graphical representations where applicable.",
      instructor: "Dr. Emma Rodriguez",
      attachments: ["problem_set.pdf"],
      createdDate: "2024-01-08"
    },
    {
      id: 4,
      title: "Database Design Project",
      subject: "Computer Science",
      dueDate: "2024-02-25",
      description: "Design and implement a complete database system for a library management system. Include ER diagrams, normalization, and SQL queries.",
      instructor: "Prof. David Liu",
      attachments: ["db_requirements.pdf", "sample_data.sql"],
      createdDate: "2024-01-15"
    }
  ];

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    subject: '',
    description: '',
    dueDate: '',
    attachments: [] as string[]
  });

  const handleCreateAssignment = () => {
    if (!newAssignment.title.trim() || !newAssignment.subject.trim() || !newAssignment.description.trim() || !newAssignment.dueDate) {
      return;
    }
    
    // In a real app, this would make an API call
    console.log('Creating assignment:', newAssignment);
    
    // Reset form
    setNewAssignment({
      title: '',
      subject: '',
      description: '',
      dueDate: '',
      attachments: []
    });
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Assignments</h1>
        {(user?.role === 'faculty' || user?.role === 'admin') && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Assignment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Assignment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Assignment Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter assignment title"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Enter subject"
                    value={newAssignment.subject}
                    onChange={(e) => setNewAssignment({...newAssignment, subject: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter detailed assignment description"
                    rows={4}
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateAssignment}>
                    Create Assignment
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <User className="w-4 h-4" />
                    {assignment.instructor} • {assignment.subject}
                  </CardDescription>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p>Created: {new Date(assignment.createdDate).toLocaleDateString()}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{assignment.description}</p>
              
              {assignment.attachments && assignment.attachments.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                    <Paperclip className="w-4 h-4" />
                    Attachments
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {assignment.attachments.map((attachment, index) => (
                      <Badge key={index} variant="outline" className="cursor-pointer hover:bg-muted">
                        {attachment}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" />
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {Math.ceil((new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">View Details</Button>
                {user?.role === 'student' && (
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Download Materials
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};