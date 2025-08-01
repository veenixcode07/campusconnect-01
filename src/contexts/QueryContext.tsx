import React, { createContext, useContext, useState, ReactNode } from 'react';
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

  // Initialize with mock data
  const [queries, setQueries] = useState<Query[]>([
    {
      id: '1',
      title: 'Help with Binary Tree Implementation',
      content: 'I am having trouble implementing a binary tree in C++. Can someone help me with the insertion logic?',
      author: 'John Student',
      subject: 'Computer Science',
      replies: 1,
      likes: 3,
      solved: false,
      timestamp: '2024-08-20T10:00:00Z',
      likedBy: ['FAC001', 'ADM001', 'STU002'],
      answers: [
        {
          id: 'a1',
          content: 'For binary tree insertion, you need to compare the new value with the current node. If it\'s smaller, go to the left child; if larger, go to the right child. Repeat until you find an empty spot.',
          author: 'Dr. Sarah Faculty',
          authorRole: 'faculty',
          timestamp: '2024-08-20T11:00:00Z',
          isAccepted: false
        }
      ]
    },
    {
      id: '2',
      title: 'SQL Join Queries Confusion',
      content: 'Can someone explain the difference between INNER JOIN and LEFT JOIN with examples?',
      author: 'John Student',
      subject: 'Computer Science',
      replies: 1,
      likes: 5,
      solved: true,
      timestamp: '2024-08-19T15:30:00Z',
      likedBy: ['FAC001', 'STU003', 'STU004', 'ADM001', 'STU005'],
      answers: [
        {
          id: 'a2',
          content: 'INNER JOIN returns only rows that have matching values in both tables, while LEFT JOIN returns all rows from the left table and matching rows from the right table. If no match is found, NULL values are returned for the right table columns.',
          author: 'Dr. Sarah Faculty',
          authorRole: 'faculty',
          timestamp: '2024-08-19T16:00:00Z',
          isAccepted: true
        }
      ]
    }
  ]);

  const addQuery = (newQuery: Omit<Query, 'id' | 'replies' | 'likes' | 'solved' | 'timestamp' | 'answers' | 'likedBy'>) => {
    const query: Query = {
      ...newQuery,
      id: Math.random().toString(36).substr(2, 9),
      replies: 0,
      likes: 0,
      solved: false,
      timestamp: new Date().toISOString(),
      answers: [],
      likedBy: []
    };
    setQueries(prev => [query, ...prev]);
  };

  const addAnswer = (queryId: string, newAnswer: Omit<Answer, 'id' | 'timestamp'>) => {
    const answer: Answer = {
      ...newAnswer,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      isAccepted: false
    };

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
  };

  const likeQuery = (queryId: string, userId: string) => {
    setQueries(prev => prev.map(query => {
      if (query.id === queryId) {
        const hasLiked = query.likedBy.includes(userId);
        const newLikedBy = hasLiked 
          ? query.likedBy.filter(id => id !== userId)
          : [...query.likedBy, userId];
        const newLikes = hasLiked ? query.likes - 1 : query.likes + 1;

        return {
          ...query,
          likes: newLikes,
          likedBy: newLikedBy
        };
      }
      return query;
    }));
  };

  const markAnswerAsAccepted = (queryId: string, answerId: string) => {
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
  };

  const deleteQuery = (queryId: string) => {
    setQueries(prev => prev.filter(query => query.id !== queryId));
  };

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