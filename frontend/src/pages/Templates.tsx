import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Templates() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Template Management</CardTitle>
          <CardDescription>Manage resume templates and categories</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Template management interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}