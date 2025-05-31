import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
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
import { templateApi, Template, TemplateCategory } from "@/lib/api";

export default function Templates() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [premiumFilter, setPremiumFilter] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch templates with filters
  const { data: templatesData, isLoading: templatesLoading, error: templatesError } = useQuery({
    queryKey: ['templates', page, searchTerm, categoryFilter, premiumFilter],
    queryFn: () => templateApi.getTemplates({
      page,
      search: searchTerm || undefined,
      category: categoryFilter !== 'all' ? categoryFilter : undefined,
      premium: premiumFilter !== 'all' ? premiumFilter : undefined,
    }),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['templateCategories'],
    queryFn: templateApi.getCategories,
    staleTime: 10 * 60 * 1000,
  });

  // Create template mutation
  const createTemplateMutation = useMutation({
    mutationFn: templateApi.createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Template created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update template mutation
  const updateTemplateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Template> }) => 
      templateApi.updateTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast({
        title: "Success",
        description: "Template updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete template mutation
  const deleteTemplateMutation = useMutation({
    mutationFn: templateApi.deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast({
        title: "Success",
        description: "Template deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const templates = templatesData?.results || [];
  const categories = categoriesData?.results || [];
  const totalTemplates = templatesData?.count || 0;

  const handleCreateTemplate = (formData: FormData) => {
    const templateData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      html_structure: formData.get('html') as string,
      css_styles: formData.get('css') as string,
      is_premium: formData.get('premium') === 'on',
      is_featured: formData.get('featured') === 'on',
      tags: (formData.get('tags') as string)?.split(',').map(tag => tag.trim()) || [],
    };
    createTemplateMutation.mutate(templateData);
  };

  const handleDeleteTemplate = (templateId: number) => {
    if (confirm('Are you sure you want to delete this template?')) {
      deleteTemplateMutation.mutate(templateId);
    }
  };

  if (templatesError) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-destructive">
              Error loading templates: {(templatesError as Error).message}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Template Management</h1>
          <p className="text-muted-foreground">
            Manage resume templates, categories, and design elements ({totalTemplates} total)
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
              <form onSubmit={(e) => {
                e.preventDefault();
                handleCreateTemplate(new FormData(e.currentTarget));
              }}>
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
                        <Input id="name" name="name" placeholder="Enter template name" required />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" placeholder="Describe the template" />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select name="category">
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat: TemplateCategory) => (
                              <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="tags">Tags (comma separated)</Label>
                        <Input id="tags" name="tags" placeholder="modern, professional, clean" />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="design" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="html">HTML Structure</Label>
                        <Textarea id="html" name="html" placeholder="Enter HTML structure" className="h-32" />
                      </div>
                      <div>
                        <Label htmlFor="css">CSS Styles</Label>
                        <Textarea id="css" name="css" placeholder="Enter CSS styles" className="h-32" />
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
                        <Switch id="premium" name="premium" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="featured">Featured Template</Label>
                          <p className="text-sm text-muted-foreground">Show in featured section</p>
                        </div>
                        <Switch id="featured" name="featured" />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                <div className="flex space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1" 
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={createTemplateMutation.isPending}
                  >
                    {createTemplateMutation.isPending ? "Creating..." : "Create Template"}
                  </Button>
                </div>
              </form>
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
            <div className="text-2xl font-bold">{totalTemplates}</div>
            <p className="text-xs text-muted-foreground">Available templates</p>
          </CardContent>
        </Card>
        
        <Card className="admin-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Layout className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
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
              {templates.reduce((sum, t) => sum + (t.usage_count || 0), 0).toLocaleString()}
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
              {templates.length > 0 
                ? Math.round(templates.reduce((sum, t) => sum + (t.avg_ats_score || 0), 0) / templates.length)
                : 0}
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
                {categories.map((cat: TemplateCategory) => (
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
      {templatesLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="admin-card-hover">
              <CardHeader className="p-0">
                <Skeleton className="w-full h-48 rounded-t-lg" />
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template: Template) => (
            <Card key={template.id} className="admin-card-hover">
              <CardHeader className="p-0">
                <div className="relative">
                  <img 
                    src={template.thumbnail || "/placeholder.svg"} 
                    alt={template.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 right-2 flex space-x-1">
                    {template.is_featured && (
                      <Badge className="bg-yellow-500">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    {template.is_premium && (
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
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDeleteTemplate(template.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {template.tags?.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{template.usage_count || 0} uses</span>
                    <span>ATS: {template.avg_ats_score || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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
                      src={selectedTemplate.thumbnail || "/placeholder.svg"} 
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
                        <span>{selectedTemplate.usage_count || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg ATS Score:</span>
                        <Badge variant="outline">{selectedTemplate.avg_ats_score || 0}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Created:</span>
                        <span>{new Date(selectedTemplate.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="design">
                <div className="space-y-4">
                  <div>
                    <Label>HTML Structure</Label>
                    <Textarea 
                      value={selectedTemplate.html_structure || ""} 
                      readOnly 
                      className="h-32"
                    />
                  </div>
                  <div>
                    <Label>CSS Styles</Label>
                    <Textarea 
                      value={selectedTemplate.css_styles || ""} 
                      readOnly 
                      className="h-32"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="analytics">
                <div className="space-y-4">
                  <p className="text-muted-foreground">Usage analytics and performance metrics</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Usage Stats</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Total Downloads:</span>
                            <span>{selectedTemplate.usage_count || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Average ATS Score:</span>
                            <span>{selectedTemplate.avg_ats_score || 0}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="settings">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Premium Template</Label>
                      <p className="text-sm text-muted-foreground">Requires subscription</p>
                    </div>
                    <Switch checked={selectedTemplate.is_premium} disabled />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Featured Template</Label>
                      <p className="text-sm text-muted-foreground">Shown in featured section</p>
                    </div>
                    <Switch checked={selectedTemplate.is_featured} disabled />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}