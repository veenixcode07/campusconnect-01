import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bell, 
  Search, 
  Filter,
  Calendar,
  User,
  AlertCircle,
  PlusCircle,
  Download,
  Pin
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Notice {
  id: number;
  title: string;
  content: string;
  author: string;
  department: string;
  subject?: string;
  category: 'general' | 'academic' | 'exam' | 'event' | 'urgent';
  date: string;
  pinned: boolean;
  attachments?: string[];
}

export const Notices: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  // Mock data - in real app this would come from API
  const notices: Notice[] = [
    {
      id: 1,
      title: 'Mid-term Examination Schedule Released',
      content: 'The mid-term examination schedule for all courses has been finalized. Please check your respective course pages for detailed timings and venues. Make sure to carry your student ID cards and necessary stationery.',
      author: 'Dr. Sarah Wilson',
      department: 'Academic Office',
      subject: 'All Subjects',
      category: 'exam',
      date: '2024-01-15',
      pinned: true,
      attachments: ['exam_schedule.pdf']
    },
    {
      id: 2,
      title: 'Library Hours Extended During Exam Period',
      content: 'The library will remain open 24/7 during the examination period (Jan 20 - Feb 5). Additional study spaces have been arranged in the conference halls.',
      author: 'Library Administration',
      department: 'Library',
      category: 'general',
      date: '2024-01-14',
      pinned: false
    },
    {
      id: 3,
      title: 'Guest Lecture on Artificial Intelligence and Machine Learning',
      content: 'Join us for an exciting guest lecture by Dr. John Smith from MIT on "The Future of AI in Industry". Date: January 25, 2024, Time: 2:00 PM, Venue: Main Auditorium.',
      author: 'Dr. Michael Brown',
      department: 'Computer Science',
      subject: 'Computer Science',
      category: 'event',
      date: '2024-01-13',
      pinned: false
    },
    {
      id: 4,
      title: 'Data Structures Assignment Deadline Extended',
      content: 'Due to technical issues with the submission portal, the deadline for the Data Structures assignment has been extended to January 22, 2024.',
      author: 'Prof. Emily Davis',
      department: 'Computer Science',
      subject: 'Data Structures',
      category: 'academic',
      date: '2024-01-12',
      pinned: false
    },
    {
      id: 5,
      title: 'Campus Network Maintenance',
      content: 'The campus network will undergo maintenance on January 18, 2024, from 12:00 AM to 6:00 AM. Internet services may be interrupted during this period.',
      author: 'IT Department',
      department: 'IT Services',
      category: 'urgent',
      date: '2024-01-11',
      pinned: false
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'urgent': return 'destructive';
      case 'exam': return 'default';
      case 'academic': return 'secondary';
      case 'event': return 'outline';
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
          <Button className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            Post New Notice
          </Button>
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
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="exam">Exam</SelectItem>
                <SelectItem value="event">Events</SelectItem>
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