import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  author: string;
  authorRole: 'faculty' | 'admin';
  timestamp: string;
  attachments: string[];
  classTargets: string[];
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  author: string;
  department: string;
  subject?: string;
  category: 'general' | 'exam' | 'urgent';
  date: string;
  pinned: boolean;
  pinnedUntil?: Date;
  attachments: string[];
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'ppt' | 'doc' | 'video' | 'image' | 'other';
  subject: string;
  uploadedBy: string;
  uploadDate: string;
  size: string;
  downloads: number;
  likes: number;
  tags: string[];
  favorited: boolean;
}

export interface StudentNote {
  id: string;
  studentId: string;
  note: string;
  author: string;
  timestamp: string;
}

interface AppContextType {
  assignments: Assignment[];
  notices: Notice[];
  resources: Resource[];
  studentNotes: StudentNote[];
  addAssignment: (assignment: Omit<Assignment, 'id' | 'timestamp'>) => void;
  addNotice: (notice: Omit<Notice, 'id' | 'date'>) => void;
  toggleResourceFavorite: (resourceId: string) => void;
  addStudentNote: (note: Omit<StudentNote, 'id' | 'timestamp'>) => void;
  getStudentNotes: (studentId: string, facultyName?: string) => StudentNote[];
  pinNotice: (noticeId: string, pinUntil: Date) => void;
  unpinNotice: (noticeId: string) => void;
  deleteAssignment: (assignmentId: string) => void;
  deleteResource: (resourceId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // Initialize with mock data
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Data Structures Project',
      description: 'Implement a binary search tree with insertion, deletion, and traversal operations.',
      subject: 'Computer Science',
      dueDate: '2024-09-15T23:59:59Z',
      author: 'Dr. Sarah Faculty',
      authorRole: 'faculty',
      timestamp: '2024-08-20T10:00:00Z',
      attachments: [],
      classTargets: ['Computer Science-2024-A']
    },
    {
      id: '2',
      title: 'Algorithm Analysis Report',
      description: 'Analyze the time complexity of sorting algorithms and write a comprehensive report.',
      subject: 'Computer Science',
      dueDate: '2024-09-10T23:59:59Z',
      author: 'Dr. Sarah Faculty',
      authorRole: 'faculty',
      timestamp: '2024-08-15T14:30:00Z',
      attachments: [],
      classTargets: ['Computer Science-2024-A']
    },
    {
      id: '3',
      title: 'Database Design Project',
      description: 'Design and implement a complete database system for a library management system.',
      subject: 'Database Management',
      dueDate: '2024-09-20T23:59:59Z',
      author: 'Dr. Michael Chen',
      authorRole: 'faculty',
      timestamp: '2024-08-18T09:00:00Z',
      attachments: [],
      classTargets: ['Computer Science-2024-B']
    },
    {
      id: '4',
      title: 'Operating Systems Lab',
      description: 'Complete the process scheduling simulation lab assignment.',
      subject: 'Operating Systems',
      dueDate: '2024-09-12T23:59:59Z',
      author: 'Dr. Michael Chen',
      authorRole: 'faculty',
      timestamp: '2024-08-16T11:30:00Z',
      attachments: [],
      classTargets: ['Computer Science-2024-A', 'Computer Science-2024-B']
    }
  ]);

  const [notices, setNotices] = useState<Notice[]>([
    {
      id: '1',
      title: 'Welcome to New Semester',
      content: 'Welcome all students to the new academic semester. Please check your schedules and report any discrepancies.',
      author: 'Admin User',
      department: 'Administration',
      subject: 'General',
      category: 'general',
      date: '2024-08-20',
      pinned: true,
      attachments: []
    },
    {
      id: '2',
      title: 'Mid-term Examination Schedule',
      content: 'The mid-term examinations will begin from next Monday. Please prepare accordingly and check the timetable.',
      author: 'Dr. Sarah Faculty',
      department: 'Computer Science',
      subject: 'Computer Science',
      category: 'exam',
      date: '2024-08-18',
      pinned: false,
      attachments: []
    },
    {
      id: '3',
      title: 'Class A - Lab Schedule Update',
      content: 'Lab sessions for Computer Science A will be held in Lab 2 starting next week. Please note the room change.',
      author: 'Dr. Sarah Faculty',
      department: 'Computer Science',
      subject: 'Computer Science',
      category: 'general',
      date: '2024-08-19',
      pinned: false,
      attachments: []
    },
    {
      id: '4',
      title: 'Class B - Project Submission Guidelines',
      content: 'All project submissions for Class B students must follow the new formatting guidelines available on the portal.',
      author: 'Dr. Michael Chen',
      department: 'Computer Science',
      subject: 'Computer Science',
      category: 'general',
      date: '2024-08-17',
      pinned: false,
      attachments: []
    }
  ]);

  const [resources, setResources] = useState<Resource[]>([
    {
      id: '1',
      title: 'Introduction to Algorithms PDF',
      description: 'Comprehensive guide to algorithms and data structures',
      type: 'pdf',
      subject: 'Computer Science',
      uploadedBy: 'Dr. Sarah Faculty',
      uploadDate: '2024-08-15',
      size: '2.5 MB',
      downloads: 45,
      likes: 12,
      tags: ['algorithms', 'data-structures', 'programming'],
      favorited: false
    },
    {
      id: '2',
      title: 'Database Design Tutorial',
      description: 'Step-by-step tutorial on database design principles',
      type: 'video',
      subject: 'Computer Science',
      uploadedBy: 'Dr. Sarah Faculty',
      uploadDate: '2024-08-10',
      size: '150 MB',
      downloads: 28,
      likes: 8,
      tags: ['database', 'sql', 'design'],
      favorited: false
    },
    {
      id: '3',
      title: 'Operating Systems Concepts',
      description: 'Complete notes on operating system fundamentals and concepts',
      type: 'pdf',
      subject: 'Operating Systems',
      uploadedBy: 'Dr. Michael Chen',
      uploadDate: '2024-08-12',
      size: '3.2 MB',
      downloads: 62,
      likes: 18,
      tags: ['os', 'processes', 'memory-management'],
      favorited: false
    },
    {
      id: '4',
      title: 'Data Structures Implementation Guide',
      description: 'Code examples and implementations of common data structures',
      type: 'doc',
      subject: 'Data Structures',
      uploadedBy: 'Dr. Sarah Faculty',
      uploadDate: '2024-08-14',
      size: '1.8 MB',
      downloads: 39,
      likes: 15,
      tags: ['data-structures', 'implementation', 'code'],
      favorited: false
    }
  ]);

  const [studentNotes, setStudentNotes] = useState<StudentNote[]>([
    {
      id: '1',
      studentId: 'STU001',
      note: 'Student shows excellent progress in data structures concepts.',
      author: 'Dr. Sarah Faculty',
      timestamp: '2024-08-20T10:00:00Z'
    }
  ]);

  const addAssignment = (newAssignment: Omit<Assignment, 'id' | 'timestamp'>) => {
    const assignment: Assignment = {
      ...newAssignment,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };
    setAssignments(prev => [assignment, ...prev]);
  };

  const addNotice = (newNotice: Omit<Notice, 'id' | 'date'>) => {
    const notice: Notice = {
      ...newNotice,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0]
    };
    setNotices(prev => [notice, ...prev]);
  };

  const toggleResourceFavorite = (resourceId: string) => {
    setResources(prev => prev.map(resource => 
      resource.id === resourceId 
        ? { ...resource, favorited: !resource.favorited }
        : resource
    ));
  };

  const addStudentNote = (newNote: Omit<StudentNote, 'id' | 'timestamp'>) => {
    const note: StudentNote = {
      ...newNote,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };
    setStudentNotes(prev => [note, ...prev]);
  };

  const getStudentNotes = (studentId: string, facultyName?: string) => {
    let notes = studentNotes.filter(note => note.studentId === studentId);
    if (facultyName) {
      notes = notes.filter(note => note.author === facultyName);
    }
    return notes;
  };

  const pinNotice = (noticeId: string, pinUntil: Date) => {
    setNotices(prev => prev.map(notice => 
      notice.id === noticeId 
        ? { ...notice, pinned: true, pinnedUntil: pinUntil }
        : notice
    ));
  };

  const unpinNotice = (noticeId: string) => {
    setNotices(prev => prev.map(notice => 
      notice.id === noticeId 
        ? { ...notice, pinned: false, pinnedUntil: undefined }
        : notice
    ));
  };

  const deleteAssignment = (assignmentId: string) => {
    setAssignments(prev => prev.filter(assignment => assignment.id !== assignmentId));
  };

  const deleteResource = (resourceId: string) => {
    setResources(prev => prev.filter(resource => resource.id !== resourceId));
  };

  // Auto-unpin expired notices
  useEffect(() => {
    const checkExpiredPins = () => {
      const now = new Date();
      setNotices(prev => prev.map(notice => {
        if (notice.pinned && notice.pinnedUntil && now >= notice.pinnedUntil) {
          return { ...notice, pinned: false, pinnedUntil: undefined };
        }
        return notice;
      }));
    };

    const interval = setInterval(checkExpiredPins, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <AppContext.Provider value={{
      assignments,
      notices,
      resources,
      studentNotes,
      addAssignment,
      addNotice,
      toggleResourceFavorite,
      addStudentNote,
      getStudentNotes,
      pinNotice,
      unpinNotice,
      deleteAssignment,
      deleteResource
    }}>
      {children}
    </AppContext.Provider>
  );
};