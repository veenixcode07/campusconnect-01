import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageSquare, ThumbsUp, Search, Plus, User } from 'lucide-react';

export const QueryForum: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const queries = [
    {
      id: 1,
      title: "Help with Data Structures Assignment",
      content: "I'm having trouble implementing a binary search tree. Can someone help?",
      author: "John Doe",
      subject: "Computer Science",
      replies: 5,
      likes: 12,
      solved: false,
      timestamp: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      title: "Physics Lab Equipment Issue",
      content: "The oscilloscope in Lab 2 seems to be malfunctioning. Who should I contact?",
      author: "Jane Smith",
      subject: "Physics",
      replies: 2,
      likes: 8,
      solved: true,
      timestamp: "2024-01-14T14:20:00Z"
    },
    {
      id: 3,
      title: "Study Group for Mathematics",
      content: "Looking for students to form a study group for advanced calculus.",
      author: "Mike Johnson",
      subject: "Mathematics",
      replies: 15,
      likes: 25,
      solved: false,
      timestamp: "2024-01-13T09:15:00Z"
    }
  ];

  const filteredQueries = queries.filter(query =>
    query.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    query.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    query.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Query Forum</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Ask Question
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ask a Question</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Question title" />
              <Input placeholder="Subject/Category" />
              <Textarea placeholder="Describe your question in detail..." rows={5} />
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Post Question</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredQueries.map((query) => (
          <Card key={query.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    {query.title}
                    {query.solved && (
                      <Badge className="bg-green-500 text-white">Solved</Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <User className="w-4 h-4" />
                    {query.author} • {query.subject} • {new Date(query.timestamp).toLocaleDateString()}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{query.content}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {query.replies} replies
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    {query.likes} likes
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    Like
                  </Button>
                  <Button size="sm">View Discussion</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};