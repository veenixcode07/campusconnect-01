import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Bell, 
  Search, 
  Filter,
  Calendar,
  User,
  AlertCircle,
  PlusCircle,
  Download,
  Pin,
  Paperclip
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

export const Notices: React.FC = () => {
  const { user } = useAuth();
  const { notices, addNotice } = useApp();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    subject: '',
    category: 'general' as 'general' | 'exam' | 'urgent',
    pinned: false,
    attachments: [] as string[]
  });

  const handleCreateNotice = () => {
    if (!newNotice.title.trim() || !newNotice.content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    addNotice({
      ...newNotice,
      author: user?.name || 'Unknown',
      department: user?.department || 'Administration'
    });

    toast({
      title: "Success",
      description: "Notice posted successfully!",
    });

    setNewNotice({
      title: '',
      content: '',
      subject: '',
      category: 'general',
      pinned: false,
      attachments: []
    });
    setIsCreateModalOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const fileNames = files.map(file => file.name);
    setNewNotice(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...fileNames]
    }));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'urgent': return 'destructive';
      case 'exam': return 'default';
      case 'general': return 'secondary';
      default: return 'outline';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'urgent': return <AlertCircle className="w-4 h-4" />;
      case 'exam': return <Calendar className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || notice.category === selectedCategory;
    const matchesSubject = selectedSubject === 'all' || notice.subject === selectedSubject;
    
    return matchesSearch && matchesCategory && matchesSubject;
  });

  const sortedNotices = [...filteredNotices].sort((a, b) => {
    // Pinned notices first
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    // Then by date (newest first)
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const canPost = user?.role === 'admin' || user?.role === 'faculty';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Notices & Announcements</h1>
          <p className="text-muted-foreground">Stay updated with latest college announcements</p>
        </div>
        {canPost && (
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                Post New Notice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Post New Notice</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Notice Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter notice title"
                    value={newNotice.title}
                    onChange={(e) => setNewNotice({...newNotice, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Notice Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Enter notice content"
                    rows={5}
                    value={newNotice.content}
                    onChange={(e) => setNewNotice({...newNotice, content: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={newNotice.category} onValueChange={(value: 'general' | 'exam' | 'urgent') => setNewNotice({...newNotice, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="exam">Exam</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject (Optional)</Label>
                    <Input
                      id="subject"
                      placeholder="Enter subject"
                      value={newNotice.subject}
                      onChange={(e) => setNewNotice({...newNotice, subject: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="attachments">Attachments</Label>
                  <Input
                    id="attachments"
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                  />
                  {newNotice.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {newNotice.attachments.map((attachment, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          <Paperclip className="w-3 h-3" />
                          {attachment}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateNotice}>
                    Post Notice
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search notices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="exam">Exam</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Data Structures">Data Structures</SelectItem>
                <SelectItem value="Operating Systems">Operating Systems</SelectItem>
                <SelectItem value="Computer Networks">Computer Networks</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notices List */}
      <div className="space-y-4">
        {sortedNotices.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No notices found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
            </CardContent>
          </Card>
        ) : (
          sortedNotices.map((notice) => (
            <Card key={notice.id} className={`${notice.pinned ? 'border-primary shadow-md' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {notice.pinned && (
                        <Pin className="w-4 h-4 text-primary" />
                      )}
                      <CardTitle className="text-lg">{notice.title}</CardTitle>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {notice.author}
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(notice.date).toLocaleDateString()}
                      </div>
                      <span>•</span>
                      <span>{notice.department}</span>
                      {notice.subject && (
                        <>
                          <span>•</span>
                          <span>{notice.subject}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getCategoryColor(notice.category) as any} className="flex items-center gap-1">
                      {getCategoryIcon(notice.category)}
                      {notice.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{notice.content}</p>
                
                {notice.attachments && notice.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {notice.attachments.map((attachment, index) => (
                      <Button key={index} variant="outline" size="sm" className="flex items-center gap-2">
                        <Download className="w-3 h-3" />
                        {attachment}
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};