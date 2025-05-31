import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Maximize2 } from "lucide-react";
import { Template } from "@/lib/api";

interface TemplatePreviewProps {
  template: Template;
  className?: string;
  showFullPreview?: boolean;
}

export function TemplatePreview({ template, className = "", showFullPreview = false }: TemplatePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const createPreviewContent = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Template Preview</title>
        <style>
          body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: white;
            transform: scale(${showFullPreview ? '1' : '0.6'});
            transform-origin: top left;
            width: ${showFullPreview ? '100%' : '166.67%'};
            height: ${showFullPreview ? '100%' : '166.67%'};
          }
          ${template.css_styles || ''}
        </style>
      </head>
      <body>
        ${template.html_structure || '<div style="padding: 20px; text-align: center; color: #666;">No preview available</div>'}
      </body>
      </html>
    `;
    return htmlContent;
  };

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (doc) {
        doc.open();
        doc.write(createPreviewContent());
        doc.close();
        setIsLoaded(true);
      }
    }
  }, [template.html_structure, template.css_styles, showFullPreview]);

  return (
    <div className={`relative ${className}`}>
      <iframe
        ref={iframeRef}
        className={`w-full border-0 bg-white rounded-lg ${
          showFullPreview ? 'h-[600px]' : 'h-48'
        }`}
        sandbox="allow-same-origin"
        title={`Preview of ${template.name}`}
      />
      {!isLoaded && (
        <div className={`absolute inset-0 flex items-center justify-center bg-muted rounded-lg ${
          showFullPreview ? 'h-[600px]' : 'h-48'
        }`}>
          <div className="text-sm text-muted-foreground">Loading preview...</div>
        </div>
      )}
      {!showFullPreview && (
        <div className="absolute inset-0 bg-transparent hover:bg-black/5 transition-colors rounded-lg flex items-center justify-center opacity-0 hover:opacity-100">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm" className="shadow-lg">
                <Maximize2 className="w-4 h-4 mr-2" />
                Full Preview
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>{template.name} - Full Preview</DialogTitle>
                <DialogDescription>
                  Complete preview of the {template.name} template
                </DialogDescription>
              </DialogHeader>
              <TemplatePreview template={template} showFullPreview={true} />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}