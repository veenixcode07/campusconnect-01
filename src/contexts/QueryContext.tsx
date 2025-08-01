import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

export interface Answer {
  id: string;
  content: string;
  author: string;
  authorRole: 'student' | 'faculty' | 'admin';
  timestamp: string;
  isAccepted?: boolean;
}

export interface Query {
  id: string;
  title: string;
  content: string;
  author: string;
  subject: string;
  replies: number;
  likes: number;
  solved: boolean;
  timestamp: string;
  answers: Answer[];
  likedBy: string[];
}

interface QueryContextType {
  queries: Query[];
  addQuery: (query: Omit<Query, 'id' | 'replies' | 'likes' | 'solved' | 'timestamp' | 'answers' | 'likedBy'>) => void;
  addAnswer: (queryId: string, answer: Omit<Answer, 'id' | 'timestamp'>) => void;
  likeQuery: (queryId: string, userId: string) => void;
  markAnswerAsAccepted: (queryId: string, answerId: string) => void;
  deleteQuery: (queryId: string) => void;
}

const QueryContext = createContext<QueryContextType | undefined>(undefined);

export const useQuery = () => {
  const context = useContext(QueryContext);
  if (!context) {
    throw new Error('useQuery must be used within a QueryProvider');
  }
  return context;
};

export const QueryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);

  // Load queries when user is authenticated
  React.useEffect(() => {
    if (user) {
      loadQueries();
    }
  }, [user]);

  const loadQueries = async () => {
    try {
      setLoading(true);
      
      // Load queries
      const { data: queriesData, error: queriesError } = await supabase
        .from('queries')
        .select('*')
        .order('created_at', { ascending: false });

      if (queriesError) throw queriesError;

      // Load answers for all queries
      const { data: answersData, error: answersError } = await supabase
        .from('answers')
        .select('*')
        .order('created_at', { ascending: true });

      if (answersError) throw answersError;

      // Map and combine data
      const mappedQueries: Query[] = queriesData.map(query => {
        const queryAnswers = answersData
          .filter(answer => answer.query_id === query.id)
          .map(answer => ({
            id: answer.id,
            content: answer.content,
            author: answer.author,
            authorRole: answer.author_role,
            timestamp: answer.created_at,
            isAccepted: answer.is_accepted
          }));

        return {
          id: query.id,
          title: query.title,
          content: query.content,
          author: query.author,
          subject: query.subject,
          replies: queryAnswers.length,
          likes: query.likes,
          solved: query.solved,
          timestamp: query.created_at,
          answers: queryAnswers,
          likedBy: query.liked_by || []
        };
      });

      setQueries(mappedQueries);
    } catch (error) {
      console.error('Error loading queries:', error);
    } finally {
      setLoading(false);
    }
  };

  const addQuery = async (newQuery: Omit<Query, 'id' | 'replies' | 'likes' | 'solved' | 'timestamp' | 'answers' | 'likedBy'>) => {
    try {
      const { data, error } = await supabase
        .from('queries')
        .insert({
          title: newQuery.title,
          content: newQuery.content,
          author: newQuery.author,
          subject: newQuery.subject,
          likes: 0,
          solved: false,
          liked_by: []
        })
        .select()
        .single();

      if (error) throw error;

      const query: Query = {
        id: data.id,
        title: data.title,
        content: data.content,
        author: data.author,
        subject: data.subject,
        replies: 0,
        likes: 0,
        solved: false,
        timestamp: data.created_at,
        answers: [],
        likedBy: []
      };

      setQueries(prev => [query, ...prev]);
    } catch (error) {
      console.error('Error adding query:', error);
      throw error;
    }
  };

  const addAnswer = async (queryId: string, newAnswer: Omit<Answer, 'id' | 'timestamp'>) => {
    try {
      const { data, error } = await supabase
        .from('answers')
        .insert({
          query_id: queryId,
          content: newAnswer.content,
          author: newAnswer.author,
          author_role: newAnswer.authorRole,
          is_accepted: false
        })
        .select()
        .single();

      if (error) throw error;

      const answer: Answer = {
        id: data.id,
        content: data.content,
        author: data.author,
        authorRole: data.author_role,
        timestamp: data.created_at,
        isAccepted: false
      };

      // Update replies count in database
      await supabase
        .from('queries')
        .update({ replies: queries.find(q => q.id === queryId)?.replies + 1 || 1 })
        .eq('id', queryId);

      setQueries(prev => prev.map(query => {
        if (query.id === queryId) {
          return {
            ...query,
            answers: [...query.answers, answer],
            replies: query.replies + 1
          };
        }
        return query;
      }));
    } catch (error) {
      console.error('Error adding answer:', error);
      throw error;
    }
  };

  const likeQuery = async (queryId: string, userId: string) => {
    try {
      const query = queries.find(q => q.id === queryId);
      if (!query) return;

      const hasLiked = query.likedBy.includes(userId);
      const newLikedBy = hasLiked 
        ? query.likedBy.filter(id => id !== userId)
        : [...query.likedBy, userId];
      const newLikes = hasLiked ? query.likes - 1 : query.likes + 1;

      const { error } = await supabase
        .from('queries')
        .update({
          likes: newLikes,
          liked_by: newLikedBy
        })
        .eq('id', queryId);

      if (error) throw error;

      setQueries(prev => prev.map(q => {
        if (q.id === queryId) {
          return {
            ...q,
            likes: newLikes,
            likedBy: newLikedBy
          };
        }
        return q;
      }));
    } catch (error) {
      console.error('Error liking query:', error);
      throw error;
    }
  };

  const markAnswerAsAccepted = async (queryId: string, answerId: string) => {
    try {
      // First, unmark all other answers for this query
      await supabase
        .from('answers')
        .update({ is_accepted: false })
        .eq('query_id', queryId);

      // Mark the selected answer as accepted
      await supabase
        .from('answers')
        .update({ is_accepted: true })
        .eq('id', answerId);

      // Mark the query as solved
      await supabase
        .from('queries')
        .update({ solved: true })
        .eq('id', queryId);

      setQueries(prev => prev.map(query => {
        if (query.id === queryId) {
          const updatedAnswers = query.answers.map(answer => ({
            ...answer,
            isAccepted: answer.id === answerId
          }));
          return {
            ...query,
            answers: updatedAnswers,
            solved: true
          };
        }
        return query;
      }));
    } catch (error) {
      console.error('Error marking answer as accepted:', error);
      throw error;
    }
  };

  const deleteQuery = async (queryId: string) => {
    try {
      // Delete all answers first (due to foreign key constraint)
      await supabase
        .from('answers')
        .delete()
        .eq('query_id', queryId);

      // Delete the query
      const { error } = await supabase
        .from('queries')
        .delete()
        .eq('id', queryId);

      if (error) throw error;

      setQueries(prev => prev.filter(query => query.id !== queryId));
    } catch (error) {
      console.error('Error deleting query:', error);
      throw error;
    }
  };

  if (loading && user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading queries...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryContext.Provider value={{
      queries,
      addQuery,
      addAnswer,
      likeQuery,
      markAnswerAsAccepted,
      deleteQuery
    }}>
      {children}
    </QueryContext.Provider>
  );
};