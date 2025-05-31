import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Copy,
  Star,
  Download,
  Upload,
  FileText,
  Palette,
  Layout,
  BarChart3
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Mock template data
const mockTemplates = [
  {
    id: 1,
    name: "Modern Professional",
    category: "Professional",
    description: "Clean and modern design perfect for corporate roles",
    thumbnail: "/placeholder.svg",
    usageCount: 1234,
    avgAtsScore: 87,
    isPremium: false,
    isFeatured: true,
    createdAt: "2024-01-15",
    tags: ["modern", "professional", "clean"]
  },
  {
    id: 2,
    name: "Creative Designer",
    category: "Creative",
    description: "Bold and creative template for design professionals",
    thumbnail: "/placeholder.svg",
    usageCount: 856,
    avgAtsScore: 82,
    isPremium: true,
    isFeatured: false,
    createdAt: "2024-01-10",
    tags: ["creative", "design", "colorful"]
  },
  {
    id: 3,
    name: "Tech Minimalist",
    category: "Technology",
    description: "Minimalist design optimized for tech roles",
    thumbnail: "/placeholder.svg",
    usageCount: 2341,
    avgAtsScore: 91,
    isPremium: true,
    isFeatured: true,
    createdAt: "2024-01-05",
    tags: ["minimalist", "tech", "simple"]
  }
];

const mockCategories = [
  { id: 1, name: "Professional", count: 15 },
  { id: 2, name: "Creative", count: 8 },
  { id: 3, name: "Technology", count: 12 },
  { id: 4, name: "Healthcare", count: 6 },
  { id: 5, name: "Education", count: 9 }
];

export default function Templates() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [premiumFilter, setPremiumFilter] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter;
    const matchesPremium = premiumFilter === "all" || 
                          (premiumFilter === "premium" && template.isPremium) ||
                          (premiumFilter === "free" && !template.isPremium);
    
    return matchesSearch && matchesCategory && matchesPremium;
  });

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Template Management</h1>
          <p className="text-muted-foreground">
            Manage resume templates, categories, and design elements
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import Template
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Template</DialogTitle>
                <DialogDescription>Design a new resume template</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="design">Design</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Template Name</Label>
                      <Input id="name" placeholder="Enter template name" />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Describe the template" />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockCategories.map(cat => (
                            <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input id="tags" placeholder="modern, professional, clean" />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="design" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label>Template Preview</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Upload template thumbnail</p>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="html">HTML Structure</Label>
                      <Textarea id="html" placeholder="Enter HTML structure" className="h-32" />
                    </div>
                    <div>
                      <Label htmlFor="css">CSS Styles</Label>
                      <Textarea id="css" placeholder="Enter CSS styles" className="h-32" />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="settings" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="premium">Premium Template</Label>
                        <p className="text-sm text-muted-foreground">Require subscription to use</p>
                      </div>
                      <Switch id="premium" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="featured">Featured Template</Label>
                        <p className="text-sm text-muted-foreground">Show in featured section</p>
                      </div>
                      <Switch id="featured" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="active">Active</Label>
                        <p className="text-sm text-muted-foreground">Make template available to users</p>
                      </div>
                      <Switch id="active" defaultChecked />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <div className="flex space-x-2 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="flex-1">Create Template</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="admin-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTemplates.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        
        <Card className="admin-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Layout className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCategories.length}</div>
            <p className="text-xs text-muted-foreground">Active categories</p>
          </CardContent>
        </Card>
        
        <Card className="admin-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockTemplates.reduce((sum, t) => sum + t.usageCount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Template downloads</p>
          </CardContent>
        </Card>
        
        <Card className="admin-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg ATS Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(mockTemplates.reduce((sum, t) => sum + t.avgAtsScore, 0) / mockTemplates.length)}
            </div>
            <p className="text-xs text-muted-foreground">Across all templates</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {mockCategories.map(cat => (
                  <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={premiumFilter} onValueChange={setPremiumFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="admin-card-hover">
            <CardHeader className="p-0">
              <div className="relative">
                <img 
                  src={template.thumbnail} 
                  alt={template.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  {template.isFeatured && (
                    <Badge className="bg-yellow-500">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  {template.isPremium && (
                    <Badge variant="secondary">Premium</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{template.name}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedTemplate(template)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Template
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-sm text-muted-foreground">{template.description}</p>
                <div className="flex flex-wrap gap-1">
                  {template.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{template.usageCount} uses</span>
                  <span>ATS: {template.avgAtsScore}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Template Details Dialog */}
      <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Template Details</DialogTitle>
            <DialogDescription>Complete template information and analytics</DialogDescription>
          </DialogHeader>
          {selectedTemplate && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <img 
                      src={selectedTemplate.thumbnail} 
                      alt={selectedTemplate.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold">{selectedTemplate.name}</h3>
                      <p className="text-muted-foreground">{selectedTemplate.description}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Category:</span>
                        <Badge variant="outline">{selectedTemplate.category}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Usage Count:</span>
                        <span>{selectedTemplate.usageCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg ATS Score:</span>
                        <Badge variant="outline">{selectedTemplate.avgAtsScore}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Created:</span>
                        <span>{selectedTemplate.createdAt}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="design">
                <div className="space-y-4">
                  <p className="text-muted-foreground">Template design and structure details</p>
                  {/* Design editor would go here */}
                </div>
              </TabsContent>
              
              <TabsContent value="analytics">
                <div className="space-y-4">
                  <p className="text-muted-foreground">Usage analytics and performance metrics</p>
                  {/* Analytics charts would go here */}
                </div>
              </TabsContent>
              
              <TabsContent value="settings">
                <div className="space-y-4">
                  <p className="text-muted-foreground">Template configuration and permissions</p>
                  {/* Settings form would go here */}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}