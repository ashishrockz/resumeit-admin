import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  FileText, 
  CreditCard, 
  TrendingUp, 
  UserPlus,
  DollarSign,
  Activity,
  Target
} from "lucide-react";

export default function Dashboard() {
  // Mock data - will be replaced with real API calls
  const stats = {
    totalUsers: 12543,
    premiumUsers: 3421,
    weeklySignups: 234,
    avgAtsScore: 78.5,
    monthlyRevenue: 45230,
    conversionRate: 27.3
  };

  const StatCard = ({ title, value, description, icon: Icon, trend, color = "default" }: {
    title: string;
    value: string | number;
    description: string;
    icon: any;
    trend?: string;
    color?: "default" | "success" | "warning" | "danger";
  }) => (
    <Card className="admin-card-hover">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn(
          "h-4 w-4",
          color === "success" && "text-admin-success",
          color === "warning" && "text-admin-warning", 
          color === "danger" && "text-admin-danger",
          color === "default" && "text-muted-foreground"
        )} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center space-x-2">
          <p className="text-xs text-muted-foreground">{description}</p>
          {trend && (
            <Badge variant={trend.startsWith('+') ? "default" : "destructive"} className="text-xs">
              {trend}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with ResumeIt today.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          description="Active registered users"
          icon={Users}
          trend="+12.5%"
          color="success"
        />
        <StatCard
          title="Premium Conversion"
          value={`${stats.conversionRate}%`}
          description="Free to premium rate"
          icon={TrendingUp}
          trend="+2.1%"
          color="success"
        />
        <StatCard
          title="Weekly Signups"
          value={stats.weeklySignups}
          description="New users this week"
          icon={UserPlus}
          trend="+8.3%"
          color="success"
        />
        <StatCard
          title="Avg ATS Score"
          value={stats.avgAtsScore}
          description="Platform average"
          icon={Target}
          trend="+1.2"
          color="default"
        />
      </div>

      {/* Revenue & Activity Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="admin-card-hover">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-admin-success" />
              <span>Revenue Metrics</span>
            </CardTitle>
            <CardDescription>Monthly recurring revenue and projections</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Monthly Revenue</span>
              <span className="text-lg font-semibold">${stats.monthlyRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Annual Projection</span>
              <span className="text-lg font-semibold">${(stats.monthlyRevenue * 12).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Premium Users</span>
              <span className="text-lg font-semibold">{stats.premiumUsers.toLocaleString()}</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div className="bg-admin-success h-2 rounded-full" style={{ width: `${stats.conversionRate}%` }}></div>
            </div>
          </CardContent>
        </Card>

        <Card className="admin-card-hover">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-admin-primary" />
              <span>User Activity</span>
            </CardTitle>
            <CardDescription>Recent platform engagement metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Resume Downloads</span>
                <span className="font-medium">1,234 today</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>ATS Checks</span>
                <span className="font-medium">567 today</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Template Views</span>
                <span className="font-medium">2,891 today</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Active Sessions</span>
                <span className="font-medium">89 now</span>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              View Detailed Analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Add Template
            </Button>
            <Button variant="outline" className="justify-start">
              <CreditCard className="w-4 h-4 mr-2" />
              Manage Plans
            </Button>
            <Button variant="outline" className="justify-start">
              <Users className="w-4 h-4 mr-2" />
              Review Users
            </Button>
            <Button variant="outline" className="justify-start">
              <Activity className="w-4 h-4 mr-2" />
              Send Announcement
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}