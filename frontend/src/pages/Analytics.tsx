import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Analytics() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>ATS Analytics Dashboard</CardTitle>
          <CardDescription>View ATS scoring analytics and optimization metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}