import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [studentNotes, setStudentNotes] = useState<StudentNote[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data when user is authenticated
  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadAssignments(),
        loadNotices(),
        loadResources(),
        loadStudentNotes()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAssignments = async () => {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading assignments:', error);
      return;
    }

    const mappedAssignments: Assignment[] = data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      subject: item.subject,
      dueDate: item.due_date,
      author: item.author,
      authorRole: item.author_role,
      timestamp: item.created_at,
      attachments: item.attachments || [],
      classTargets: item.class_targets || []
    }));

    setAssignments(mappedAssignments);
  };

  const loadNotices = async () => {
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading notices:', error);
      return;
    }

    const mappedNotices: Notice[] = data.map(item => ({
      id: item.id,
      title: item.title,
      content: item.content,
      author: item.author,
      department: item.department,
      subject: item.subject,
      category: item.category,
      date: item.created_at.split('T')[0],
      pinned: item.pinned,
      pinnedUntil: item.pinned_until ? new Date(item.pinned_until) : undefined,
      attachments: item.attachments || []
    }));

    setNotices(mappedNotices);
  };

  const loadResources = async () => {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading resources:', error);
      return;
    }

    const mappedResources: Resource[] = data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      type: item.type,
      subject: item.subject,
      uploadedBy: item.uploaded_by,
      uploadDate: item.created_at.split('T')[0],
      size: item.size,
      downloads: item.downloads,
      likes: item.likes,
      tags: item.tags || [],
      favorited: false // This would need to be determined based on user preferences
    }));

    setResources(mappedResources);
  };

  const loadStudentNotes = async () => {
    const { data, error } = await supabase
      .from('student_notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading student notes:', error);
      return;
    }

    const mappedNotes: StudentNote[] = data.map(item => ({
      id: item.id,
      studentId: item.student_id,
      note: item.note,
      author: item.author,
      timestamp: item.created_at
    }));

    setStudentNotes(mappedNotes);
  };

  const addAssignment = async (newAssignment: Omit<Assignment, 'id' | 'timestamp'>) => {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .insert({
          title: newAssignment.title,
          description: newAssignment.description,
          subject: newAssignment.subject,
          due_date: newAssignment.dueDate,
          author: newAssignment.author,
          author_role: newAssignment.authorRole,
          attachments: newAssignment.attachments,
          class_targets: newAssignment.classTargets
        })
        .select()
        .single();

      if (error) throw error;

      const assignment: Assignment = {
        id: data.id,
        title: data.title,
        description: data.description,
        subject: data.subject,
        dueDate: data.due_date,
        author: data.author,
        authorRole: data.author_role,
        timestamp: data.created_at,
        attachments: data.attachments || [],
        classTargets: data.class_targets || []
      };

      setAssignments(prev => [assignment, ...prev]);
    } catch (error) {
      console.error('Error adding assignment:', error);
      throw error;
    }
  };

  const addNotice = async (newNotice: Omit<Notice, 'id' | 'date'>) => {
    try {
      const { data, error } = await supabase
        .from('notices')
        .insert({
          title: newNotice.title,
          content: newNotice.content,
          author: newNotice.author,
          department: newNotice.department,
          subject: newNotice.subject,
          category: newNotice.category,
          pinned: newNotice.pinned,
          attachments: newNotice.attachments
        })
        .select()
        .single();

      if (error) throw error;

      const notice: Notice = {
        id: data.id,
        title: data.title,
        content: data.content,
        author: data.author,
        department: data.department,
        subject: data.subject,
        category: data.category,
        date: data.created_at.split('T')[0],
        pinned: data.pinned,
        attachments: data.attachments || []
      };

      setNotices(prev => [notice, ...prev]);
    } catch (error) {
      console.error('Error adding notice:', error);
      throw error;
    }
  };

  const toggleResourceFavorite = (resourceId: string) => {
    setResources(prev => prev.map(resource => 
      resource.id === resourceId 
        ? { ...resource, favorited: !resource.favorited }
        : resource
    ));
  };

  const addStudentNote = async (newNote: Omit<StudentNote, 'id' | 'timestamp'>) => {
    try {
      const { data, error } = await supabase
        .from('student_notes')
        .insert({
          student_id: newNote.studentId,
          note: newNote.note,
          author: newNote.author
        })
        .select()
        .single();

      if (error) throw error;

      const note: StudentNote = {
        id: data.id,
        studentId: data.student_id,
        note: data.note,
        author: data.author,
        timestamp: data.created_at
      };

      setStudentNotes(prev => [note, ...prev]);
    } catch (error) {
      console.error('Error adding student note:', error);
      throw error;
    }
  };

  const getStudentNotes = (studentId: string, facultyName?: string) => {
    let notes = studentNotes.filter(note => note.studentId === studentId);
    if (facultyName) {
      notes = notes.filter(note => note.author === facultyName);
    }
    return notes;
  };

  const pinNotice = async (noticeId: string, pinUntil: Date) => {
    try {
      const { error } = await supabase
        .from('notices')
        .update({
          pinned: true,
          pinned_until: pinUntil.toISOString()
        })
        .eq('id', noticeId);

      if (error) throw error;

      setNotices(prev => prev.map(notice => 
        notice.id === noticeId 
          ? { ...notice, pinned: true, pinnedUntil: pinUntil }
          : notice
      ));
    } catch (error) {
      console.error('Error pinning notice:', error);
      throw error;
    }
  };

  const unpinNotice = async (noticeId: string) => {
    try {
      const { error } = await supabase
        .from('notices')
        .update({
          pinned: false,
          pinned_until: null
        })
        .eq('id', noticeId);

      if (error) throw error;

      setNotices(prev => prev.map(notice => 
        notice.id === noticeId 
          ? { ...notice, pinned: false, pinnedUntil: undefined }
          : notice
      ));
    } catch (error) {
      console.error('Error unpinning notice:', error);
      throw error;
    }
  };

  const deleteAssignment = async (assignmentId: string) => {
    try {
      const { error } = await supabase
        .from('assignments')
        .delete()
        .eq('id', assignmentId);

      if (error) throw error;

      setAssignments(prev => prev.filter(assignment => assignment.id !== assignmentId));
    } catch (error) {
      console.error('Error deleting assignment:', error);
      throw error;
    }
  };

  const deleteResource = async (resourceId: string) => {
    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', resourceId);

      if (error) throw error;

      setResources(prev => prev.filter(resource => resource.id !== resourceId));
    } catch (error) {
      console.error('Error deleting resource:', error);
      throw error;
    }
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

  if (loading && user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

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