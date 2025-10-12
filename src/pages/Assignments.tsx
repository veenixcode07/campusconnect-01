import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, FileText, Plus, Paperclip, User, Download, Eye, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'react-router-dom';

export const Assignments: React.FC = () => {
  const { user } = useAuth();
  const { getFilteredAssignments, addAssignment, deleteAssignment } = useApp();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get filtered assignments based on user's role and class
  const assignments = getFilteredAssignments();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    subject: '',
    description: '',
    dueDate: '',
    attachments: [] as string[],
    classTargets: [] as string[]
  });

  // Check URL params to auto-open create dialog
  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      setIsCreateDialogOpen(true);
      // Remove the search param after opening
      searchParams.delete('action');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  const handleCreateAssignment = () => {
    if (!newAssignment.title.trim() || !newAssignment.subject.trim() || 
        !newAssignment.description.trim() || !newAssignment.dueDate || 
        newAssignment.classTargets.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and select at least one class.",
        variant: "destructive"
      });
      return;
    }
    
    addAssignment({
      ...newAssignment,
      author: user?.name || 'Unknown',
      authorRole: user?.role === 'admin' ? 'admin' : 'faculty'
    });
    
    toast({
      title: "Success",
      description: "Assignment created successfully!",
    });
    
    // Reset form
    setNewAssignment({
      title: '',
      subject: '',
      description: '',
      dueDate: '',
      attachments: [],
      classTargets: []
    });
    setIsCreateDialogOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const fileNames = files.map(file => file.name);
    setNewAssignment(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...fileNames]
    }));
  };

  const handleClassToggle = (className: string) => {
    setNewAssignment(prev => ({
      ...prev,
      classTargets: prev.classTargets.includes(className)
        ? prev.classTargets.filter(c => c !== className)
        : [...prev.classTargets, className]
    }));
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    deleteAssignment(assignmentId);
    toast({
      title: "Success",
      description: "Assignment deleted successfully!",
    });
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
                <div className="space-y-2">
                  <Label htmlFor="classTargets">Target Classes</Label>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="cse-a" 
                        checked={newAssignment.classTargets.includes('CSE-A')}
                        onCheckedChange={() => handleClassToggle('CSE-A')}
                      />
                      <Label htmlFor="cse-a">CSE-A</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="cse-b" 
                        checked={newAssignment.classTargets.includes('CSE-B')}
                        onCheckedChange={() => handleClassToggle('CSE-B')}
                      />
                      <Label htmlFor="cse-b">CSE-B</Label>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="attachments">Attachments</Label>
                  <Input
                    id="attachments"
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                  />
                  {newAssignment.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {newAssignment.attachments.map((attachment, index) => (
                        <Badge key={index} variant="outline">
                          {attachment}
                        </Badge>
                      ))}
                    </div>
                  )}
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
                    {assignment.author} • {assignment.subject}
                  </CardDescription>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p>Created: {new Date(assignment.timestamp).toLocaleDateString()}</p>
                  <div className="flex gap-1 mt-1">
                    {assignment.classTargets.map(target => (
                      <Badge key={target} variant="secondary" className="text-xs">
                        {target}
                      </Badge>
                    ))}
                  </div>
                </div>
                {user?.name === assignment.author && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteAssignment(assignment.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Assignment Preview</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">{assignment.title}</h3>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>Subject: {assignment.subject}</span>
                          <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                          <span>Author: {assignment.author}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Description</h4>
                        <p className="text-sm leading-relaxed">{assignment.description}</p>
                      </div>
                      
                      {assignment.attachments && assignment.attachments.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium">Attachments</h4>
                          <div className="flex flex-wrap gap-2">
                            {assignment.attachments.map((attachment, index) => (
                              <Badge key={index} variant="outline" className="flex items-center gap-1">
                                <Paperclip className="w-3 h-3" />
                                {attachment}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {assignment.classTargets && assignment.classTargets.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium">Target Classes</h4>
                          <div className="flex flex-wrap gap-2">
                            {assignment.classTargets.map((target, index) => (
                              <Badge key={index} variant="secondary">{target}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Download className="w-4 h-4 mr-2" />
                  Download Materials
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};