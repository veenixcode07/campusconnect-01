import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Search, User, TrendingUp, TrendingDown, AlertTriangle, FileText } from 'lucide-react';
import { StudentProfileModal } from '@/components/StudentProfileModal';
import { ContactStudentModal } from '@/components/ContactStudentModal';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const StudentTracking: React.FC = () => {
  const { addStudentNote, getStudentNotes } = useApp();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAddNotesModalOpen, setIsAddNotesModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [studentForNotes, setStudentForNotes] = useState<any>(null);
  const [studentForContact, setStudentForContact] = useState<any>(null);
  const [noteContent, setNoteContent] = useState('');

  const students = [
    {
      id: 1,
      name: "Emma Thompson",
      rollNumber: "CSE2022001", 
      class: "CSE-A",
      attendance: 94,
      averageGrade: 8.7,
      lastActivity: "2024-01-20",
      status: "active",
      trend: "up"
    },
    {
      id: 2,
      name: "Alexander Chen",
      rollNumber: "CSE2022002",
      class: "CSE-A", 
      attendance: 89,
      averageGrade: 9.2,
      lastActivity: "2024-01-19",
      status: "active",
      trend: "up"
    },
    {
      id: 3,
      name: "Maria Rodriguez",
      rollNumber: "CSE2022003",
      class: "CSE-B",
      attendance: 72,
      averageGrade: 7.1,
      lastActivity: "2024-01-18",
      status: "needs_attention", 
      trend: "stable"
    },
    {
      id: 4,
      name: "James Wilson",
      rollNumber: "CSE2022004",
      class: "CSE-A",
      attendance: 63,
      averageGrade: 6.2,
      lastActivity: "2024-01-16",
      status: "at_risk",
      trend: "down"
    },
    {
      id: 5,
      name: "Priya Patel",
      rollNumber: "CSE2022005",
      class: "CSE-B",
      attendance: 91,
      averageGrade: 8.9,
      lastActivity: "2024-01-20",
      status: "active",
      trend: "up"
    },
    {
      id: 6,
      name: "David Kim",
      rollNumber: "CSE2022006",
      class: "CSE-B",
      attendance: 85,
      averageGrade: 8.4,
      lastActivity: "2024-01-19",
      status: "active", 
      trend: "up"
    }
  ];

  const handleViewProfile = (student: any) => {
    setSelectedStudent(student);
    setIsProfileModalOpen(true);
  };

  const handleAddNotes = (student: any) => {
    setStudentForNotes(student);
    setIsAddNotesModalOpen(true);
  };

  const handleContactStudent = (student: any) => {
    setStudentForContact(student);
    setIsContactModalOpen(true);
  };

  const handleSaveNote = () => {
    if (!noteContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter a note before saving.",
        variant: "destructive"
      });
      return;
    }

    addStudentNote(studentForNotes.id.toString(), noteContent);

    toast({
      title: "Success",
      description: "Note added successfully!",
      duration: 3000,
    });

    setNoteContent('');
    setIsAddNotesModalOpen(false);
    setStudentForNotes(null);
  };

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
            <SelectItem value="CSE-A">CSE-A</SelectItem>
            <SelectItem value="CSE-B">CSE-B</SelectItem>
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
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewProfile(student)}
                >
                  View Profile
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleContactStudent(student)}
                >
                  Contact Student
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAddNotes(student)}
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Add Notes
                </Button>
              </div>
            </CardContent>
          </Card>
          ))}
      </div>

      {/* Student Profile Modal */}
      {selectedStudent && (
        <StudentProfileModal
          student={selectedStudent}
          isOpen={isProfileModalOpen}
          onClose={() => {
            setIsProfileModalOpen(false);
            setSelectedStudent(null);
          }}
        />
      )}

      {/* Contact Student Modal */}
      {studentForContact && (
        <ContactStudentModal
          student={studentForContact}
          isOpen={isContactModalOpen}
          onClose={() => {
            setIsContactModalOpen(false);
            setStudentForContact(null);
          }}
        />
      )}

      {/* Add Notes Modal */}
      <Dialog open={isAddNotesModalOpen} onOpenChange={setIsAddNotesModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Notes for {studentForNotes?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="studentInfo">Student Information</Label>
              <div className="text-sm text-muted-foreground">
                <p><strong>Name:</strong> {studentForNotes?.name}</p>
                <p><strong>Roll Number:</strong> {studentForNotes?.rollNumber}</p>
                <p><strong>Class:</strong> {studentForNotes?.class}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="noteContent">Note Content</Label>
              <Textarea
                id="noteContent"
                placeholder="Enter your note about the student..."
                rows={6}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
              />
            </div>

            {/* Previous Notes */}
            {studentForNotes && (
              <div className="space-y-2">
                <Label>Previous Notes</Label>
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {getStudentNotes(studentForNotes.id.toString(), user?.name).length > 0 ? (
                    getStudentNotes(studentForNotes.id.toString(), user?.name).map((note) => (
                      <div key={note.id} className="p-2 bg-muted rounded-md">
                        <div className="text-sm text-muted-foreground mb-1">
                          {note.author} - {new Date(note.createdAt).toLocaleString()}
                        </div>
                        <div className="text-sm">{note.note}</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No previous notes</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddNotesModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveNote}>
                Save Note
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};