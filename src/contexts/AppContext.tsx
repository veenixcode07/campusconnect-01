import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  getStudentNotes: (studentId: string) => StudentNote[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

const initialAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Binary Tree Implementation',
    description: 'Implement a binary search tree with insert, delete, and search operations. Include proper traversal methods (inorder, preorder, postorder) and balance checking functionality.',
    subject: 'Data Structures',
    dueDate: '2024-01-25',
    author: 'Dr. Sarah Wilson',
    authorRole: 'faculty',
    timestamp: '2024-01-15T10:00:00Z',
    attachments: ['bst_requirements.pdf', 'test_cases.txt'],
    classTargets: ['CSE-A', 'CSE-B']
  },
  {
    id: '2',
    title: 'Process Scheduling Algorithms',
    description: 'Compare and implement three different process scheduling algorithms: FCFS, SJF, and Round Robin. Analyze their performance with different workloads.',
    subject: 'Operating Systems',
    dueDate: '2024-01-30',
    author: 'Prof. Michael Brown',
    authorRole: 'faculty',
    timestamp: '2024-01-16T14:30:00Z',
    attachments: ['scheduling_template.docx'],
    classTargets: ['CSE-A', 'CSE-B']
  },
  {
    id: '3',
    title: 'Network Protocol Analysis',
    description: 'Analyze the TCP/IP protocol stack using Wireshark. Capture and examine network packets to understand protocol behavior in different scenarios.',
    subject: 'Computer Networks',
    dueDate: '2024-02-05',
    author: 'Dr. Emily Davis',
    authorRole: 'faculty',
    timestamp: '2024-01-17T09:15:00Z',
    attachments: ['wireshark_guide.pdf', 'sample_captures.pcap'],
    classTargets: ['CSE-A']
  }
];

const initialNotices: Notice[] = [
  {
    id: '1',
    title: 'Mid-term Examination Schedule Released',
    content: 'The mid-term examination schedule for all courses has been finalized. Please check your respective course pages for detailed timings and venues.',
    author: 'Dr. Sarah Wilson',
    department: 'Academic Office',
    subject: 'All Subjects',
    category: 'exam',
    date: '2024-01-15',
    pinned: true,
    attachments: ['exam_schedule.pdf']
  },
  {
    id: '2',
    title: 'Library Hours Extended During Exam Period',
    content: 'The library will remain open 24/7 during the examination period (Jan 20 - Feb 5). Additional study spaces have been arranged.',
    author: 'Library Administration',
    department: 'Library',
    category: 'general',
    date: '2024-01-14',
    pinned: false,
    attachments: []
  },
  {
    id: '3',
    title: 'Campus Network Maintenance',
    content: 'The campus network will undergo maintenance on January 18, 2024, from 12:00 AM to 6:00 AM. Internet services may be interrupted.',
    author: 'IT Department',
    department: 'IT Services',
    category: 'urgent',
    date: '2024-01-11',
    pinned: false,
    attachments: []
  }
];

const initialResources: Resource[] = [
  {
    id: '1',
    title: 'Data Structures - Binary Trees Complete Guide',
    description: 'Comprehensive guide covering binary trees, BST, AVL trees, and operations with examples.',
    type: 'pdf',
    subject: 'Data Structures',
    uploadedBy: 'Dr. Sarah Wilson',
    uploadDate: '2024-01-15',
    size: '2.4 MB',
    downloads: 156,
    likes: 23,
    tags: ['binary-trees', 'bst', 'algorithms'],
    favorited: false
  },
  {
    id: '2',
    title: 'Operating Systems - Process Scheduling Presentation',
    description: 'Detailed presentation on various process scheduling algorithms including FCFS, SJF, Round Robin.',
    type: 'ppt',
    subject: 'Operating Systems',
    uploadedBy: 'Prof. Michael Brown',
    uploadDate: '2024-01-14',
    size: '5.1 MB',
    downloads: 134,
    likes: 19,
    tags: ['scheduling', 'processes', 'algorithms'],
    favorited: false
  },
  {
    id: '3',
    title: 'Computer Networks - OSI Model Explained',
    description: 'Video lecture explaining the 7 layers of OSI model with real-world examples.',
    type: 'video',
    subject: 'Computer Networks',
    uploadedBy: 'Dr. Emily Davis',
    uploadDate: '2024-01-13',
    size: '45.2 MB',
    downloads: 89,
    likes: 15,
    tags: ['osi-model', 'networking', 'protocols'],
    favorited: true
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [studentNotes, setStudentNotes] = useState<StudentNote[]>([]);

  const addAssignment = (newAssignment: Omit<Assignment, 'id' | 'timestamp'>) => {
    const assignment: Assignment = {
      ...newAssignment,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    setAssignments(prev => [assignment, ...prev]);
  };

  const addNotice = (newNotice: Omit<Notice, 'id' | 'date'>) => {
    const notice: Notice = {
      ...newNotice,
      id: Date.now().toString(),
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
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    setStudentNotes(prev => [note, ...prev]);
  };

  const getStudentNotes = (studentId: string) => {
    return studentNotes.filter(note => note.studentId === studentId);
  };

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
      getStudentNotes
    }}>
      {children}
    </AppContext.Provider>
  );
};