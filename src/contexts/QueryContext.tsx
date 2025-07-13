import React, { createContext, useContext, useState, ReactNode } from 'react';

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
}

const QueryContext = createContext<QueryContextType | undefined>(undefined);

export const useQuery = () => {
  const context = useContext(QueryContext);
  if (!context) {
    throw new Error('useQuery must be used within a QueryProvider');
  }
  return context;
};

const initialQueries: Query[] = [
  {
    id: '1',
    title: "Help with Data Structures Assignment",
    content: "I'm having trouble implementing a binary search tree. Can someone help?",
    author: "John Doe",
    subject: "Computer Science",
    replies: 2,
    likes: 12,
    solved: false,
    timestamp: "2024-01-15T10:30:00Z",
    answers: [
      {
        id: '1',
        content: "You should start by defining the node structure. Each node should have a value, left child, and right child pointer.",
        author: "Dr. Smith",
        authorRole: 'faculty',
        timestamp: "2024-01-15T11:00:00Z"
      },
      {
        id: '2',
        content: "Also, make sure to handle the recursive insertion properly. Check if the current node is null, and if so, create a new node.",
        author: "Sarah Wilson",
        authorRole: 'student',
        timestamp: "2024-01-15T11:30:00Z"
      }
    ],
    likedBy: []
  },
  {
    id: '2',
    title: "Physics Lab Equipment Issue",
    content: "The oscilloscope in Lab 2 seems to be malfunctioning. Who should I contact?",
    author: "Jane Smith",
    subject: "Physics",
    replies: 1,
    likes: 8,
    solved: true,
    timestamp: "2024-01-14T14:20:00Z",
    answers: [
      {
        id: '3',
        content: "Please contact the lab technician Mr. Johnson at lab.support@college.edu or visit the equipment maintenance office in Room 101.",
        author: "Prof. Davis",
        authorRole: 'faculty',
        timestamp: "2024-01-14T15:00:00Z",
        isAccepted: true
      }
    ],
    likedBy: []
  },
  {
    id: '3',
    title: "Study Group for Mathematics",
    content: "Looking for students to form a study group for advanced calculus.",
    author: "Mike Johnson",
    subject: "Mathematics",
    replies: 3,
    likes: 25,
    solved: false,
    timestamp: "2024-01-13T09:15:00Z",
    answers: [
      {
        id: '4',
        content: "I'm interested! I'm also struggling with integration by parts. What time works for everyone?",
        author: "Emma Davis",
        authorRole: 'student',
        timestamp: "2024-01-13T10:00:00Z"
      },
      {
        id: '5',
        content: "Count me in! How about we meet every Tuesday and Thursday at 3 PM in the library?",
        author: "Alex Chen",
        authorRole: 'student',
        timestamp: "2024-01-13T11:00:00Z"
      },
      {
        id: '6',
        content: "Great initiative! If you need any guidance, feel free to reach out during my office hours.",
        author: "Dr. Martinez",
        authorRole: 'faculty',
        timestamp: "2024-01-13T12:00:00Z"
      }
    ],
    likedBy: []
  }
];

export const QueryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [queries, setQueries] = useState<Query[]>(initialQueries);

  const addQuery = (newQuery: Omit<Query, 'id' | 'replies' | 'likes' | 'solved' | 'timestamp' | 'answers' | 'likedBy'>) => {
    const query: Query = {
      ...newQuery,
      id: Date.now().toString(),
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
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
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
        return {
          ...query,
          likes: hasLiked ? query.likes - 1 : query.likes + 1,
          likedBy: hasLiked 
            ? query.likedBy.filter(id => id !== userId)
            : [...query.likedBy, userId]
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

  return (
    <QueryContext.Provider value={{
      queries,
      addQuery,
      addAnswer,
      likeQuery,
      markAnswerAsAccepted
    }}>
      {children}
    </QueryContext.Provider>
  );
};