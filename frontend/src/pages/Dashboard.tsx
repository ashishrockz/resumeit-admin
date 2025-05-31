import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
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
import { analyticsApi, userApi, subscriptionApi, atsApi } from "@/lib/api";

export default function Dashboard() {
  // Fetch dashboard statistics
  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: analyticsApi.getDashboardStats,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch recent users
  const { data: usersData } = useQuery({
    queryKey: ['recentUsers'],
    queryFn: () => userApi.getUsers({ page: 1 }),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch recent transactions
  const { data: transactionsData } = useQuery({
    queryKey: ['recentTransactions'],
    queryFn: () => subscriptionApi.getTransactions({ page: 1 }),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch ATS scores for average calculation
  const { data: atsData } = useQuery({
    queryKey: ['atsScores'],
    queryFn: () => atsApi.getScores(),
    staleTime: 5 * 60 * 1000,
  });

  const users = usersData?.results || [];
  const transactions = transactionsData?.results || [];
  const atsScores = atsData?.results || [];

  // Calculate metrics
  const totalUsers = dashboardStats?.totalUsers || 0;
  const totalSubscriptions = dashboardStats?.totalSubscriptions || 0;
  const avgAtsScore = atsScores.length > 0 
    ? atsScores.reduce((sum: number, score: any) => sum + score.score, 0) / atsScores.length 
    : 0;
  
  const monthlyRevenue = transactions
    .filter((t: any) => t.status === "completed")
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const weeklySignups = users.filter((user: any) => {
    const joinDate = new Date(user.date_joined);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return joinDate >= weekAgo;
  }).length;

  const premiumUsers = users.filter((user: any) => 
    user.profile?.subscription_type === "premium"
  ).length;

  const conversionRate = totalUsers > 0 ? ((premiumUsers / totalUsers) * 100).toFixed(1) : "0";

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
        {statsLoading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
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
          value={totalUsers.toLocaleString()}
          description="Active registered users"
          icon={Users}
          trend="+12.5%"
          color="success"
        />
        <StatCard
          title="Premium Conversion"
          value={`${conversionRate}%`}
          description="Free to premium rate"
          icon={TrendingUp}
          trend="+2.1%"
          color="success"
        />
        <StatCard
          title="Weekly Signups"
          value={weeklySignups}
          description="New users this week"
          icon={UserPlus}
          trend="+8.3%"
          color="success"
        />
        <StatCard
          title="Avg ATS Score"
          value={avgAtsScore.toFixed(1)}
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
            {statsLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Monthly Revenue</span>
                  <span className="text-lg font-semibold">${monthlyRevenue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Annual Projection</span>
                  <span className="text-lg font-semibold">${(monthlyRevenue * 12).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Premium Users</span>
                  <span className="text-lg font-semibold">{premiumUsers.toLocaleString()}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-admin-success h-2 rounded-full" 
                    style={{ width: `${Math.min(parseFloat(conversionRate), 100)}%` }}
                  ></div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="admin-card-hover">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-admin-primary" />
              <span>Platform Activity</span>
            </CardTitle>
            <CardDescription>Recent platform engagement metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Users</span>
                <span className="font-medium">{totalUsers.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>ATS Checks</span>
                <span className="font-medium">{atsScores.length.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Subscriptions</span>
                <span className="font-medium">{totalSubscriptions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Avg ATS Score</span>
                <span className="font-medium">{avgAtsScore.toFixed(1)}</span>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              View Detailed Analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Latest user registrations</CardDescription>
          </CardHeader>
          <CardContent>
            {users.length > 0 ? (
              <div className="space-y-3">
                {users.slice(0, 5).map((user: any) => (
                  <div key={user.id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-admin-primary rounded-full flex items-center justify-center text-white text-sm">
                      {user.first_name?.[0]}{user.last_name?.[0]}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{user.first_name} {user.last_name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {new Date(user.date_joined).toLocaleDateString()}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No recent users</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest payment activity</CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.slice(0, 5).map((transaction: any) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">${transaction.amount}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge 
                      variant={transaction.status === "completed" ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No recent transactions</p>
            )}
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
              View Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}