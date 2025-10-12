import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@/contexts/QueryContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, ThumbsUp, Search, Plus, User, CheckCircle, Send, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const QueryForum: React.FC = () => {
  const { user } = useAuth();
  const { filteredQueries, addQuery, addAnswer, likeQuery, markAnswerAsAccepted, deleteQuery } = useQuery();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuery, setSelectedQuery] = useState<string | null>(null);
  const [newAnswer, setNewAnswer] = useState('');
  
  // Ask Question Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionSubject, setQuestionSubject] = useState('');
  const [questionContent, setQuestionContent] = useState('');

  // Filter queries based on search (using already class-filtered queries)
  const searchFilteredQueries = filteredQueries.filter(query =>
    query.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    query.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    query.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePostQuestion = () => {
    if (!questionTitle.trim() || !questionSubject.trim() || !questionContent.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    addQuery({
      title: questionTitle.trim(),
      subject: questionSubject.trim(),
      content: questionContent.trim(),
      author: user?.name || 'Anonymous'
    });

    // Reset form
    setQuestionTitle('');
    setQuestionSubject('');
    setQuestionContent('');
    setIsDialogOpen(false);

    toast({
      title: "Success",
      description: "Your question has been posted!"
    });
  };

  const handleCancelQuestion = () => {
    setQuestionTitle('');
    setQuestionSubject('');
    setQuestionContent('');
    setIsDialogOpen(false);
  };

  const handleLike = (queryId: string) => {
    if (user?.id) {
      likeQuery(queryId, user.id);
    }
  };

  const handleAddAnswer = (queryId: string) => {
    if (!newAnswer.trim() || !user) return;

    addAnswer(queryId, {
      content: newAnswer.trim(),
      author: user.name,
      authorRole: user.role
    });

    setNewAnswer('');
    toast({
      title: "Success",
      description: "Your answer has been posted!"
    });
  };

  const handleAcceptAnswer = (queryId: string, answerId: string) => {
    markAnswerAsAccepted(queryId, answerId);
    toast({
      title: "Success",
      description: "Answer marked as accepted!"
    });
  };

  const handleDeleteQuery = (queryId: string) => {
    deleteQuery(queryId);
    toast({
      title: "Success",
      description: "Query deleted successfully!"
    });
  };

  const selectedQueryData = selectedQuery ? searchFilteredQueries.find(q => q.id === selectedQuery) : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Query Forum</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
              <Input 
                placeholder="Question title" 
                value={questionTitle}
                onChange={(e) => setQuestionTitle(e.target.value)}
              />
              <Input 
                placeholder="Subject/Category" 
                value={questionSubject}
                onChange={(e) => setQuestionSubject(e.target.value)}
              />
              <Textarea 
                placeholder="Describe your question in detail..." 
                rows={5}
                value={questionContent}
                onChange={(e) => setQuestionContent(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleCancelQuestion}>Cancel</Button>
                <Button onClick={handlePostQuestion}>Post Question</Button>
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
        {searchFilteredQueries.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No questions found for your class.</p>
            </CardContent>
          </Card>
        ) : (
          searchFilteredQueries.map((query) => (
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
                  {user?.name === query.author && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteQuery(query.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
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
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleLike(query.id)}
                    className={`transition-all ${query.likedBy?.includes(user?.id || '') ? 'bg-primary/10 text-primary' : ''}`}
                  >
                    <ThumbsUp className={`w-4 h-4 mr-1 transition-all ${query.likedBy?.includes(user?.id || '') ? 'fill-current' : ''}`} />
                    {query.likes}
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" onClick={() => setSelectedQuery(query.id)}>
                        View Discussion
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <MessageSquare className="w-5 h-5" />
                          {selectedQueryData?.title}
                          {selectedQueryData?.solved && (
                            <Badge className="bg-green-500 text-white">Solved</Badge>
                          )}
                        </DialogTitle>
                      </DialogHeader>
                      
                      {selectedQueryData && (
                        <div className="space-y-6">
                          {/* Original Question */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <User className="w-4 h-4" />
                              {selectedQueryData.author} • {selectedQueryData.subject} • {new Date(selectedQueryData.timestamp).toLocaleString()}
                            </div>
                            <p className="text-base">{selectedQueryData.content}</p>
                          </div>

                          <Separator />

                          {/* Answers */}
                          <div className="space-y-4">
                            <h3 className="font-semibold flex items-center gap-2">
                              <MessageSquare className="w-4 h-4" />
                              Answers ({selectedQueryData.answers.length})
                            </h3>
                            
                            {selectedQueryData.answers.map((answer) => (
                              <Card key={answer.id} className={answer.isAccepted ? 'border-green-500 bg-green-50 dark:bg-green-950' : ''}>
                                <CardContent className="pt-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <User className="w-4 h-4" />
                                      {answer.author}
                                      <Badge variant={answer.authorRole === 'faculty' ? 'default' : 'secondary'}>
                                        {answer.authorRole}
                                      </Badge>
                                      • {new Date(answer.timestamp).toLocaleString()}
                                      {answer.isAccepted && (
                                        <Badge className="bg-green-500 text-white ml-2">
                                          <CheckCircle className="w-3 h-3 mr-1" />
                                          Accepted Answer
                                        </Badge>
                                      )}
                                    </div>
                                    {user?.role === 'faculty' && !selectedQueryData.solved && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleAcceptAnswer(selectedQueryData.id, answer.id)}
                                        className="text-green-600 border-green-600 hover:bg-green-50"
                                      >
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        Accept
                                      </Button>
                                    )}
                                  </div>
                                  <p>{answer.content}</p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>

                          {/* Add Answer Form */}
                          {user && (
                            <div className="space-y-4">
                              <Separator />
                              <div className="space-y-3">
                                <h4 className="font-medium">Your Answer</h4>
                                <Textarea
                                  placeholder="Write your answer here..."
                                  value={newAnswer}
                                  onChange={(e) => setNewAnswer(e.target.value)}
                                  rows={4}
                                />
                                <div className="flex justify-end">
                                  <Button 
                                    onClick={() => handleAddAnswer(selectedQueryData.id)}
                                    disabled={!newAnswer.trim()}
                                  >
                                    <Send className="w-4 h-4 mr-2" />
                                    Post Answer
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </div>
    </div>
  );
};