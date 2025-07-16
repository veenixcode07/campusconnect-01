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

const initialQueries: Query[] = [
  {
    id: '1',
    title: "Advanced Database Query Optimization",
    content: "I'm working on optimizing complex SQL queries for our database project. The queries involve multiple joins and subqueries, and they're running very slowly. Can anyone help with optimization techniques?",
    author: "Alice Cooper",
    subject: "Database Systems",
    replies: 3,
    likes: 18,
    solved: true,
    timestamp: "2024-01-20T09:30:00Z",
    answers: [
      {
        id: '1',
        content: "Start by analyzing your execution plan. Look for table scans and consider adding appropriate indexes. Also, try to rewrite subqueries as joins where possible for better performance.",
        author: "Prof. Williams",
        authorRole: 'faculty',
        timestamp: "2024-01-20T10:15:00Z",
        isAccepted: true
      },
      {
        id: '2',
        content: "I had a similar issue. Using EXPLAIN ANALYZE helped me identify bottlenecks. Also consider partitioning large tables if your dataset is huge.",
        author: "Mark Thompson",
        authorRole: 'student',
        timestamp: "2024-01-20T11:00:00Z"
      },
      {
        id: '3',
        content: "Don't forget about query caching and consider using materialized views for frequently accessed complex queries.",
        author: "Dr. Chen",
        authorRole: 'faculty',
        timestamp: "2024-01-20T14:30:00Z"
      }
    ],
    likedBy: ['STU001', 'STU002', 'FAC001']
  },
  {
    id: '2',
    title: "Machine Learning Algorithm Selection",
    content: "For my final project, I need to classify customer behavior data. I'm torn between using Random Forest, SVM, or Neural Networks. What factors should I consider when choosing?",
    author: "David Kim",
    subject: "Machine Learning",
    replies: 2,
    likes: 15,
    solved: false,
    timestamp: "2024-01-19T14:20:00Z",
    answers: [
      {
        id: '4',
        content: "Consider your dataset size, interpretability needs, and computational resources. Random Forest is great for tabular data and provides feature importance. Neural Networks need more data but can capture complex patterns.",
        author: "Dr. Patel",
        authorRole: 'faculty',
        timestamp: "2024-01-19T15:45:00Z"
      },
      {
        id: '5',
        content: "I'd suggest starting with Random Forest for baseline performance, then try SVM if you need better results. Neural Networks should be your last resort unless you have a large dataset.",
        author: "Lisa Zhang",
        authorRole: 'student',
        timestamp: "2024-01-19T16:30:00Z"
      }
    ],
    likedBy: ['STU003', 'ADM001']
  },
  {
    id: '3',
    title: "Quantum Computing Study Group",
    content: "Is anyone interested in forming a study group for Quantum Computing fundamentals? We could meet weekly to discuss concepts and solve problems together.",
    author: "Sarah Johnson",
    subject: "Quantum Computing",
    replies: 4,
    likes: 22,
    solved: false,
    timestamp: "2024-01-18T11:15:00Z",
    answers: [
      {
        id: '6',
        content: "Count me in! I'm struggling with quantum gates and circuits. Group study would be really helpful.",
        author: "Tom Wilson",
        authorRole: 'student',
        timestamp: "2024-01-18T12:00:00Z"
      },
      {
        id: '7',
        content: "Great idea! I suggest we start with the basics of qubits and superposition before moving to more complex topics.",
        author: "Emily Davis",
        authorRole: 'student',
        timestamp: "2024-01-18T13:30:00Z"
      },
      {
        id: '8',
        content: "I'm interested too! Maybe we can use IBM Qiskit for practical exercises.",
        author: "Alex Rodriguez",
        authorRole: 'student',
        timestamp: "2024-01-18T14:15:00Z"
      },
      {
        id: '9',
        content: "Excellent initiative! I can provide guidance and additional resources. Consider meeting in the physics lab where we have quantum simulation software.",
        author: "Prof. Anderson",
        authorRole: 'faculty',
        timestamp: "2024-01-18T16:00:00Z"
      }
    ],
    likedBy: ['STU001', 'STU004', 'STU005', 'FAC002']
  },
  {
    id: '4',
    title: "Cybersecurity Career Advice",
    content: "I'm a second-year CS student interested in cybersecurity. What skills should I focus on developing, and are there any internship opportunities you'd recommend?",
    author: "Jessica Lee",
    subject: "Career Guidance",
    replies: 2,
    likes: 28,
    solved: true,
    timestamp: "2024-01-17T10:00:00Z",
    answers: [
      {
        id: '10',
        content: "Focus on networking fundamentals, cryptography, and hands-on experience with security tools. Participate in CTF competitions and consider certifications like CompTIA Security+. I can share some internship opportunities.",
        author: "Prof. Martinez",
        authorRole: 'faculty',
        timestamp: "2024-01-17T11:30:00Z",
        isAccepted: true
      },
      {
        id: '11',
        content: "Also learn Python and bash scripting - they're essential for security automation. Check out HackTheBox and TryHackMe for practical experience.",
        author: "Ryan Foster",
        authorRole: 'student',
        timestamp: "2024-01-17T15:20:00Z"
      }
    ],
    likedBy: ['STU001', 'STU002', 'STU003', 'STU006', 'ADM001']
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