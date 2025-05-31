import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Subscriptions() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Subscription Management</CardTitle>
          <CardDescription>Manage pricing plans and user subscriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Subscription management interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}