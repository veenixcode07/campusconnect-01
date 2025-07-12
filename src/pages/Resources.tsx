import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BookOpen, 
  Search, 
  Download,
  FileText,
  Video,
  Image,
  File,
  Calendar,
  User,
  PlusCircle,
  Eye,
  Heart
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Resource {
  id: number;
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
}

export const Resources: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Mock data - in real app this would come from API
  const resources: Resource[] = [
    {
      id: 1,
      title: 'Data Structures - Binary Trees Complete Guide',
      description: 'Comprehensive guide covering binary trees, BST, AVL trees, and operations with examples.',
      type: 'pdf',
      subject: 'Data Structures',
      uploadedBy: 'Dr. Sarah Wilson',
      uploadDate: '2024-01-15',
      size: '2.4 MB',
      downloads: 156,
      likes: 23,
      tags: ['binary-trees', 'bst', 'algorithms']
    },
    {
      id: 2,
      title: 'Operating Systems - Process Scheduling Presentation',
      description: 'Detailed presentation on various process scheduling algorithms including FCFS, SJF, Round Robin.',
      type: 'ppt',
      subject: 'Operating Systems',
      uploadedBy: 'Prof. Michael Brown',
      uploadDate: '2024-01-14',
      size: '5.1 MB',
      downloads: 134,
      likes: 19,
      tags: ['scheduling', 'processes', 'algorithms']
    },
    {
      id: 3,
      title: 'Computer Networks - OSI Model Explained',
      description: 'Video lecture explaining the 7 layers of OSI model with real-world examples.',
      type: 'video',
      subject: 'Computer Networks',
      uploadedBy: 'Dr. Emily Davis',
      uploadDate: '2024-01-13',
      size: '45.2 MB',
      downloads: 89,
      likes: 15,
      tags: ['osi-model', 'networking', 'protocols']
    },
    {
      id: 4,
      title: 'Database Design - ER Diagrams Lab Manual',
      description: 'Step-by-step lab manual for creating ER diagrams and database normalization.',
      type: 'doc',
      subject: 'Database Management',
      uploadedBy: 'Prof. John Smith',
      uploadDate: '2024-01-12',
      size: '1.8 MB',
      downloads: 98,
      likes: 12,
      tags: ['er-diagrams', 'normalization', 'database-design']
    },
    {
      id: 5,
      title: 'Software Engineering - UML Diagram Examples',
      description: 'Collection of UML diagram examples for different software design patterns.',
      type: 'pdf',
      subject: 'Software Engineering',
      uploadedBy: 'Dr. Lisa Johnson',
      uploadDate: '2024-01-11',
      size: '3.7 MB',
      downloads: 76,
      likes: 18,
      tags: ['uml', 'design-patterns', 'software-design']
    },
    {
      id: 6,
      title: 'Algorithm Analysis - Time Complexity Cheat Sheet',
      description: 'Quick reference for Big O notation and time complexity analysis of common algorithms.',
      type: 'pdf',
      subject: 'Data Structures',
      uploadedBy: 'Teaching Assistant',
      uploadDate: '2024-01-10',
      size: '0.9 MB',
      downloads: 203,
      likes: 45,
      tags: ['big-o', 'complexity', 'algorithms', 'cheat-sheet']
    }
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-5 h-5 text-red-500" />;
      case 'ppt': return <FileText className="w-5 h-5 text-orange-500" />;
      case 'doc': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'video': return <Video className="w-5 h-5 text-purple-500" />;
      case 'image': return <Image className="w-5 h-5 text-green-500" />;
      default: return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const getFileTypeLabel = (type: string) => {
    switch (type) {
      case 'pdf': return 'PDF';
      case 'ppt': return 'PowerPoint';
      case 'doc': return 'Document';
      case 'video': return 'Video';
      case 'image': return 'Image';
      default: return 'File';
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = selectedSubject === 'all' || resource.subject === selectedSubject;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    
    return matchesSearch && matchesSubject && matchesType;
  });

  const canUpload = user?.role === 'admin' || user?.role === 'faculty';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Learning Resources</h1>
          <p className="text-muted-foreground">Access study materials, notes, and educational content</p>
        </div>
        {canUpload && (
          <Button className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            Upload Resource
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
                  placeholder="Search resources, tags, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="Data Structures">Data Structures</SelectItem>
                <SelectItem value="Operating Systems">Operating Systems</SelectItem>
                <SelectItem value="Computer Networks">Computer Networks</SelectItem>
                <SelectItem value="Database Management">Database Management</SelectItem>
                <SelectItem value="Software Engineering">Software Engineering</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="ppt">PowerPoint</SelectItem>
                <SelectItem value="doc">Document</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="image">Image</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredResources.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No resources found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
            </CardContent>
          </Card>
        ) : (
          filteredResources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {getFileIcon(resource.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg line-clamp-2">{resource.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">
                      {resource.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Resource Meta */}
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline">{resource.subject}</Badge>
                  <Badge variant="secondary">{getFileTypeLabel(resource.type)}</Badge>
                  <span>•</span>
                  <span>{resource.size}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {resource.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                {/* Author and Date */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {resource.uploadedBy}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(resource.uploadDate).toLocaleDateString()}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {resource.downloads} downloads
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {resource.likes} likes
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};