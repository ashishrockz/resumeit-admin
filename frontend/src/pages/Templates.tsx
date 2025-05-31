// In the templates grid section, update the template card:
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
      <Card key={template.id} className="admin-card-hover overflow-hidden">
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
            <div className="absolute top-2 left-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="sm" className="shadow-lg">
                    <Edit className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => setSelectedTemplate(template)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleEditTemplate(template)}>
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
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{template.name}</h3>
              <Badge variant="outline" className="text-xs">
                {template.category}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {template.description}
            </p>
            <div className="flex flex-wrap gap-1">
              {template.tags?.slice(0, 3).map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
              ))}
              {template.tags?.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{template.tags.length - 3} more
                </Badge>
              )}
            </div>
            <div className="flex justify-between items-center text-sm text-muted-foreground pt-2 border-t">
              <div className="flex items-center space-x-4">
                <span>{template.usage_count || 0} uses</span>
                <span>ATS: {template.avg_ats_score || 0}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedTemplate(template)}
              >
                <Eye className="w-4 h-4 mr-1" />
                Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
)}