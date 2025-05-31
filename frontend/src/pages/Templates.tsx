// In the templates grid section, update the TemplatePreview usage:

{templates.map((template: Template) => (
  <Card key={template.id} className="admin-card-hover overflow-hidden">
    <CardHeader className="p-0">
      <div className="relative">
        <TemplatePreview 
          template={template} 
          className="rounded-t-lg"
        />
        
        {/* Rest of the template card content */}
      </div>
    </CardHeader>
    {/* Rest of the card content */}
  </Card>
))}