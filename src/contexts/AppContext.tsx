import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  author: string;
  authorRole: 'faculty' | 'admin';
  createdAt: string;
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
  createdAt: string;
  pinned: boolean;
  pinnedUntil?: string;
  attachments: string[];
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'ppt' | 'doc' | 'video' | 'image' | 'other';
  subject: string;
  uploadedBy: string;
  createdAt: string;
  size: string;
  downloads: number;
  likes: number;
  tags: string[];
}

export interface StudentNote {
  id: string;
  studentId: string;
  note: string;
  author: string;
  createdAt: string;
}

interface AppContextType {
  assignments: Assignment[];
  notices: Notice[];
  resources: Resource[];
  studentNotes: StudentNote[];
  // Filtered data based on user role and class
  getFilteredAssignments: () => Assignment[];
  getFilteredNotices: () => Notice[];
  getFilteredResources: () => Resource[];
  addAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt'>) => Promise<void>;
  addNotice: (notice: Omit<Notice, 'id' | 'createdAt'>) => Promise<void>;
  addStudentNote: (studentId: string, note: string) => Promise<void>;
  getStudentNotes: (studentId: string, facultyName?: string) => StudentNote[];
  pinNotice: (noticeId: string, pinUntil?: string) => Promise<void>;
  unpinNotice: (noticeId: string) => Promise<void>;
  deleteAssignment: (assignmentId: string) => Promise<void>;
  deleteNotice: (noticeId: string) => Promise<void>;
  deleteResource: (resourceId: string) => Promise<void>;
  addResource: (resource: Omit<Resource, 'id' | 'createdAt' | 'downloads' | 'likes'>) => Promise<void>;
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

  // Fetch data functions
  const fetchAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const transformedData = data?.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        subject: item.subject,
        dueDate: item.due_date || '',
        author: item.author || '',
        authorRole: (item.author_role as 'faculty' | 'admin') || 'faculty',
        createdAt: item.created_at,
        attachments: item.attachments || [],
        classTargets: item.class_targets || []
      })) || [];
      
      setAssignments(transformedData);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const fetchNotices = async () => {
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const transformedData = data?.map(item => ({
        id: item.id,
        title: item.title,
        content: item.content,
        author: item.author || '',
        department: item.department || '',
        subject: item.subject,
        category: (item.category as 'general' | 'exam' | 'urgent') || 'general',
        createdAt: item.created_at,
        pinned: item.pinned,
        pinnedUntil: item.pinned_until,
        attachments: item.attachments || []
      })) || [];
      
      setNotices(transformedData);
    } catch (error) {
      console.error('Error fetching notices:', error);
    }
  };

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const transformedData = data?.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        type: (item.type as 'pdf' | 'ppt' | 'doc' | 'video' | 'image' | 'other') || 'pdf',
        subject: item.subject,
        uploadedBy: item.uploaded_by,
        createdAt: item.created_at,
        size: item.size,
        downloads: item.downloads,
        likes: item.likes,
        tags: item.tags || []
      })) || [];
      
      setResources(transformedData);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  const fetchStudentNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('student_notes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const transformedData = data?.map(item => ({
        id: item.id,
        studentId: item.student_id,
        note: item.note,
        author: item.author,
        createdAt: item.created_at
      })) || [];
      
      setStudentNotes(transformedData);
    } catch (error) {
      console.error('Error fetching student notes:', error);
    }
  };

  // Initialize data on mount and auth change
  useEffect(() => {
    if (user) {
      fetchAssignments();
      fetchNotices();
      fetchResources();
      fetchStudentNotes();
    } else {
      // Clear data when user logs out
      setAssignments([]);
      setNotices([]);
      setResources([]);
      setStudentNotes([]);
    }
  }, [user]);

  const addAssignment = async (assignmentData: Omit<Assignment, 'id' | 'createdAt'>) => {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .insert([{
          title: assignmentData.title,
          description: assignmentData.description,
          subject: assignmentData.subject,
          due_date: assignmentData.dueDate,
          class_targets: assignmentData.classTargets,
          attachments: assignmentData.attachments,
          author: assignmentData.author,
          author_role: assignmentData.authorRole,
          created_by: user?.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      const newAssignment: Assignment = {
        id: data.id,
        title: data.title,
        description: data.description,
        subject: data.subject,
        dueDate: data.due_date,
        classTargets: data.class_targets,
        attachments: data.attachments,
        author: data.author,
        authorRole: data.author_role as 'faculty' | 'admin',
        createdAt: data.created_at
      };
      
      setAssignments(prev => [newAssignment, ...prev]);
    } catch (error) {
      console.error('Error adding assignment:', error);
      throw error;
    }
  };

  const deleteAssignment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('assignments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setAssignments(prev => prev.filter(assignment => assignment.id !== id));
    } catch (error) {
      console.error('Error deleting assignment:', error);
      throw error;
    }
  };

  const addNotice = async (noticeData: Omit<Notice, 'id' | 'createdAt'>) => {
    try {
      const { data, error } = await supabase
        .from('notices')
        .insert([{
          title: noticeData.title,
          content: noticeData.content,
          subject: noticeData.subject,
          author: noticeData.author,
          department: noticeData.department,
          category: noticeData.category,
          attachments: noticeData.attachments,
          pinned: noticeData.pinned,
          pinned_until: noticeData.pinnedUntil,
          author_id: user?.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      const newNotice: Notice = {
        id: data.id,
        title: data.title,
        content: data.content,
        subject: data.subject,
        author: data.author,
        department: data.department,
        category: data.category as 'general' | 'exam' | 'urgent',
        attachments: data.attachments,
        pinned: data.pinned,
        pinnedUntil: data.pinned_until,
        createdAt: data.created_at
      };
      
      setNotices(prev => [newNotice, ...prev]);
    } catch (error) {
      console.error('Error adding notice:', error);
      throw error;
    }
  };

  const deleteNotice = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notices')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setNotices(prev => prev.filter(notice => notice.id !== id));
    } catch (error) {
      console.error('Error deleting notice:', error);
      throw error;
    }
  };

  const pinNotice = async (id: string, pinnedUntil?: string) => {
    try {
      const { error } = await supabase
        .from('notices')
        .update({ pinned: true, pinned_until: pinnedUntil })
        .eq('id', id);

      if (error) throw error;
      
      setNotices(prev => prev.map(notice => 
        notice.id === id 
          ? { ...notice, pinned: true, pinnedUntil }
          : notice
      ));
    } catch (error) {
      console.error('Error pinning notice:', error);
      throw error;
    }
  };

  const unpinNotice = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notices')
        .update({ pinned: false, pinned_until: null })
        .eq('id', id);

      if (error) throw error;
      
      setNotices(prev => prev.map(notice => 
        notice.id === id 
          ? { ...notice, pinned: false, pinnedUntil: undefined }
          : notice
      ));
    } catch (error) {
      console.error('Error unpinning notice:', error);
      throw error;
    }
  };

  const addResource = async (resourceData: Omit<Resource, 'id' | 'createdAt' | 'downloads' | 'likes'>) => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .insert([{
          title: resourceData.title,
          description: resourceData.description,
          type: resourceData.type,
          subject: resourceData.subject,
          uploaded_by: resourceData.uploadedBy,
          size: resourceData.size,
          tags: resourceData.tags
        }])
        .select()
        .single();

      if (error) throw error;
      
      const newResource: Resource = {
        id: data.id,
        title: data.title,
        description: data.description,
        type: data.type as 'pdf' | 'ppt' | 'doc' | 'video' | 'image' | 'other',
        subject: data.subject,
        uploadedBy: data.uploaded_by,
        size: data.size,
        tags: data.tags,
        downloads: data.downloads,
        likes: data.likes,
        createdAt: data.created_at
      };
      
      setResources(prev => [newResource, ...prev]);
    } catch (error) {
      console.error('Error adding resource:', error);
      throw error;
    }
  };

  const deleteResource = async (id: string) => {
    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setResources(prev => prev.filter(resource => resource.id !== id));
    } catch (error) {
      console.error('Error deleting resource:', error);
      throw error;
    }
  };

  const addStudentNote = async (studentId: string, note: string) => {
    try {
      const { data, error } = await supabase
        .from('student_notes')
        .insert([{
          student_id: studentId,
          note: note,
          author: user?.name || 'Unknown'
        }])
        .select()
        .single();

      if (error) throw error;
      
      const newNote: StudentNote = {
        id: data.id,
        studentId: data.student_id,
        note: data.note,
        author: data.author,
        createdAt: data.created_at
      };
      
      setStudentNotes(prev => [newNote, ...prev]);
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

  // Role-based filtering functions
  const getFilteredAssignments = () => {
    if (!user) return assignments;
    
    const userClass = `${user.department}-${user.year}-${user.section}`;
    
    if (user.role === 'student' || user.role === 'admin') {
      return assignments.filter(assignment => 
        assignment.classTargets.includes(userClass) || 
        assignment.classTargets.length === 0
      );
    } else if (user.role === 'faculty') {
      return assignments;
    }
    
    return assignments;
  };

  const getFilteredNotices = () => {
    if (!user) return notices;
    
    if (user.role === 'faculty') {
      return notices;
    }
    
    return notices;
  };

  const getFilteredResources = () => {
    if (!user) return resources;
    
    if (user.role === 'faculty') {
      return resources;
    }
    
    return resources;
  };

  // Auto-unpin expired notices
  useEffect(() => {
    const checkExpiredPins = () => {
      const now = new Date();
      setNotices(prev => prev.map(notice => {
        if (notice.pinned && notice.pinnedUntil && now >= new Date(notice.pinnedUntil)) {
          return { ...notice, pinned: false, pinnedUntil: undefined };
        }
        return notice;
      }));
    };

    const interval = setInterval(checkExpiredPins, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppContext.Provider value={{
      assignments,
      notices,
      resources,
      studentNotes,
      getFilteredAssignments,
      getFilteredNotices,
      getFilteredResources,
      addAssignment,
      addNotice,
      addStudentNote,
      getStudentNotes,
      pinNotice,
      unpinNotice,
      deleteAssignment,
      deleteNotice,
      deleteResource,
      addResource
    }}>
      {children}
    </AppContext.Provider>
  );
};