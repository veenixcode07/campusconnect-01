import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  Heart,
  Trash2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

export const Resources: React.FC = () => {
  const { user } = useAuth();
  const { resources, toggleResourceFavorite, deleteResource } = useApp();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedFavorite, setSelectedFavorite] = useState<string>('all');
  const [showFavorites, setShowFavorites] = useState(false);

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

  const handleToggleFavorite = (resourceId: string) => {
    toggleResourceFavorite(resourceId);
    toast({
      title: "Success",
      description: "Resource favorite status updated!",
      duration: 3000,
    });
  };

  const handleDeleteResource = (resourceId: string) => {
    deleteResource(resourceId);
    toast({
      title: "Success",
      description: "Resource deleted successfully!",
      duration: 3000,
    });
  };

  const handleDownload = (resource: any) => {
    // Create a downloadable file URL (for demo purposes)
    const fileName = `${resource.title.replace(/\s+/g, '_')}.${resource.type}`;
    const fileContent = `This is a sample ${resource.type.toUpperCase()} file for ${resource.title}.\n\nDescription: ${resource.description}\n\nSubject: ${resource.subject}\nUploaded by: ${resource.uploadedBy}\nUpload Date: ${resource.uploadDate}`;
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: `Downloading ${resource.title}`,
      duration: 3000,
    });
  };

  const handlePreview = (resource: any) => {
    // This would open a preview dialog with the resource content
    return resource;
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = selectedSubject === 'all' || resource.subject === selectedSubject;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    const matchesFavorites = !showFavorites || resource.favorited;
    
    return matchesSearch && matchesSubject && matchesType && matchesFavorites;
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
        <CardContent className="p-3 md:p-4">
          <div className="flex flex-col gap-3 md:flex-row md:gap-4">
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
            <Select value={showFavorites ? 'favorited' : 'all'} onValueChange={(value) => setShowFavorites(value === 'favorited')}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="favorited">Favorited</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
                  {user?.name === resource.uploadedBy && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteResource(resource.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
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
                  <Button 
                    className="flex-1" 
                    size="sm"
                    onClick={() => handleDownload(resource)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Resource Preview</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold">{resource.title}</h3>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>Type: {resource.type.toUpperCase()}</span>
                            <span>Subject: {resource.subject}</span>
                            <span>Size: {resource.size}</span>
                            <span>Uploaded by: {resource.uploadedBy}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium">Description</h4>
                          <p className="text-sm leading-relaxed">{resource.description}</p>
                        </div>
                        
                        {resource.tags && resource.tags.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium">Tags</h4>
                            <div className="flex flex-wrap gap-2">
                              {resource.tags.map((tag, index) => (
                                <Badge key={index} variant="outline">{tag}</Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <h4 className="font-medium">Statistics</h4>
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-2xl font-bold text-primary">{resource.downloads}</div>
                              <div className="text-sm text-muted-foreground">Downloads</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-primary">{resource.likes}</div>
                              <div className="text-sm text-muted-foreground">Likes</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-primary">{new Date(resource.uploadDate).toLocaleDateString()}</div>
                              <div className="text-sm text-muted-foreground">Upload Date</div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-muted p-4 rounded-lg">
                          {resource.type === 'pdf' && (
                            <div className="space-y-2">
                              <div className="h-40 bg-white border rounded flex items-center justify-center">
                                <FileText className="w-12 h-12 text-red-500" />
                              </div>
                              <Button 
                                className="w-full" 
                                onClick={() => handleDownload(resource)}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download PDF
                              </Button>
                            </div>
                          )}
                          {resource.type === 'video' && (
                            <div className="space-y-2">
                              <div className="h-40 bg-black rounded flex items-center justify-center">
                                <Video className="w-12 h-12 text-white" />
                              </div>
                              <p className="text-sm text-center text-muted-foreground">
                                Video content preview
                              </p>
                            </div>
                          )}
                          {resource.type === 'image' && (
                            <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
                              <Image className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                          {!['pdf', 'video', 'image'].includes(resource.type) && (
                            <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
                              <File className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleToggleFavorite(resource.id)}
                  >
                    <Heart className={`w-4 h-4 ${resource.favorited ? 'fill-red-500 text-red-500' : ''}`} />
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