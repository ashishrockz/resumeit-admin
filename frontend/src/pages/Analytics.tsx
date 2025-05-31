import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Users, 
  FileText,
  Download,
  Calendar,
  Award,
  Zap,
  Eye,
  RefreshCw
} from "lucide-react";
import { atsApi, userApi, subscriptionApi, analyticsApi } from "@/lib/api";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("30d");
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch analytics data
  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: analyticsApi.getDashboardStats,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch ATS scores
  const { data: atsScoresData, isLoading: atsLoading } = useQuery({
    queryKey: ['atsScores'],
    queryFn: () => atsApi.getScores(),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch job title synonyms
  const { data: jobTitlesData } = useQuery({
    queryKey: ['jobTitleSynonyms'],
    queryFn: atsApi.getJobTitleSynonyms,
    staleTime: 10 * 60 * 1000,
  });

  // Fetch user activities
  const { data: userActivitiesData } = useQuery({
    queryKey: ['userActivities'],
    queryFn: () => userApi.getUserActivities(),
    staleTime: 5 * 60 * 1000,
  });

  const atsScores = atsScoresData?.results || [];
  const jobTitles = jobTitlesData?.results || [];
  const userActivities = userActivitiesData?.results || [];

  // Calculate analytics metrics
  const averageAtsScore = atsScores.length > 0 
    ? atsScores.reduce((sum: number, score: any) => sum + score.score, 0) / atsScores.length 
    : 0;

  const totalAtsChecks = atsScores.length;

  // Group job titles by frequency
  const jobTitleStats = jobTitles.reduce((acc: any, title: any) => {
    const relatedScores = atsScores.filter((score: any) => 
      score.job_title?.toLowerCase().includes(title.title?.toLowerCase())
    );
    
    if (relatedScores.length > 0) {
      acc.push({
        title: title.title,
        count: relatedScores.length,
        avgScore: relatedScores.reduce((sum: number, score: any) => sum + score.score, 0) / relatedScores.length
      });
    }
    
    return acc;
  }, []).sort((a: any, b: any) => b.count - a.count).slice(0, 5);

  // Mock optimization suggestions (would come from API)
  const optimizationSuggestions = [
    { suggestion: "Add more keywords", frequency: 45, impact: "High" },
    { suggestion: "Improve formatting", frequency: 38, impact: "Medium" },
    { suggestion: "Quantify achievements", frequency: 32, impact: "High" },
    { suggestion: "Add skills section", frequency: 28, impact: "Medium" },
    { suggestion: "Optimize length", frequency: 22, impact: "Low" }
  ];

  // Calculate score distribution
  const scoreDistribution = [
    { range: "90-100", count: atsScores.filter((s: any) => s.score >= 90).length },
    { range: "80-89", count: atsScores.filter((s: any) => s.score >= 80 && s.score < 90).length },
    { range: "70-79", count: atsScores.filter((s: any) => s.score >= 70 && s.score < 80).length },
    { range: "60-69", count: atsScores.filter((s: any) => s.score >= 60 && s.score < 70).length },
    { range: "50-59", count: atsScores.filter((s: any) => s.score >= 50 && s.score < 60).length },
    { range: "0-49", count: atsScores.filter((s: any) => s.score < 50).length }
  ].map(item => ({
    ...item,
    percentage: totalAtsChecks > 0 ? ((item.count / totalAtsChecks) * 100).toFixed(1) : "0"
  }));

  const getImpactBadge = (impact: string) => {
    const variants = {
      High: "destructive",
      Medium: "default",
      Low: "secondary"
    };
    return <Badge variant={variants[impact as keyof typeof variants] as any}>{impact}</Badge>;
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ATS Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive analytics for ATS scoring and user optimization behavior
          </p>
        </div>
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="job-analysis">Job Analysis</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="user-behavior">User Behavior</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="admin-card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average ATS Score</CardTitle>
                <Target className="h-4 w-4 text-admin-primary" />
              </CardHeader>
              <CardContent>
                {statsLoading || atsLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-2xl font-bold">{averageAtsScore.toFixed(1)}</div>
                )}
                <p className="text-xs text-muted-foreground">Platform average</p>
              </CardContent>
            </Card>
            
            <Card className="admin-card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total ATS Checks</CardTitle>
                <BarChart3 className="h-4 w-4 text-admin-success" />
              </CardHeader>
              <CardContent>
                {atsLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-2xl font-bold">{totalAtsChecks.toLocaleString()}</div>
                )}
                <p className="text-xs text-muted-foreground">Total checks performed</p>
              </CardContent>
            </Card>
            
            <Card className="admin-card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-admin-warning" />
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-2xl font-bold">{dashboardStats?.totalUsers || 0}</div>
                )}
                <p className="text-xs text-muted-foreground">Platform users</p>
              </CardContent>
            </Card>
            
            <Card className="admin-card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Job Titles Tracked</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{jobTitles.length}</div>
                <p className="text-xs text-muted-foreground">Unique job titles</p>
              </CardContent>
            </Card>
          </div>

          {/* Score Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>ATS Score Distribution</CardTitle>
              <CardDescription>Distribution of ATS scores across all resumes</CardDescription>
            </CardHeader>
            <CardContent>
              {atsLoading ? (
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-2 flex-1" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {scoreDistribution.map((range) => (
                    <div key={range.range} className="flex items-center space-x-4">
                      <div className="w-16 text-sm font-medium">{range.range}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-secondary rounded-full h-2">
                            <div 
                              className="bg-admin-primary h-2 rounded-full" 
                              style={{ width: `${range.percentage}%` }}
                            ></div>
                          </div>
                          <div className="text-sm text-muted-foreground w-12">{range.percentage}%</div>
                        </div>
                      </div>
                      <div className="text-sm font-medium w-16 text-right">{range.count}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* User Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent User Activity</CardTitle>
              <CardDescription>Latest platform engagement and usage</CardDescription>
            </CardHeader>
            <CardContent>
              {userActivities.length > 0 ? (
                <div className="space-y-2">
                  {userActivities.slice(0, 5).map((activity: any) => (
                    <div key={activity.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium">{activity.activity_type}</p>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(activity.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No recent activity data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="job-analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Top Job Titles by ATS Checks</span>
              </CardTitle>
              <CardDescription>Most frequently analyzed job positions</CardDescription>
            </CardHeader>
            <CardContent>
              {jobTitleStats.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Check Count</TableHead>
                      <TableHead>Avg ATS Score</TableHead>
                      <TableHead>Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobTitleStats.map((job: any, index: number) => (
                      <TableRow key={job.title}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">#{index + 1}</Badge>
                            <span className="font-medium">{job.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>{job.count.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={job.avgScore >= 80 ? "default" : "secondary"}>
                            {job.avgScore.toFixed(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-4 h-4 text-admin-success" />
                            <span className="text-sm text-admin-success">+{Math.floor(Math.random() * 20)}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">No job title data available</p>
              )}
            </CardContent>
          </Card>

          {/* Job Title Trends Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Job Title Trends</CardTitle>
              <CardDescription>Emerging and declining job title popularity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <p className="text-muted-foreground">Job title trends chart will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Common Optimization Suggestions</span>
              </CardTitle>
              <CardDescription>Most frequent improvement recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Suggestion</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Impact Level</TableHead>
                    <TableHead>Success Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {optimizationSuggestions.map((suggestion) => (
                    <TableRow key={suggestion.suggestion}>
                      <TableCell className="font-medium">{suggestion.suggestion}</TableCell>
                      <TableCell>{suggestion.frequency}%</TableCell>
                      <TableCell>{getImpactBadge(suggestion.impact)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-secondary rounded-full h-2">
                            <div 
                              className="bg-admin-success h-2 rounded-full" 
                              style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }}
                            ></div>
                          </div>
                          <span className="text-sm">{Math.floor(Math.random() * 40) + 60}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Before/After Improvement Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Optimization Impact</CardTitle>
              <CardDescription>Before and after ATS score improvements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <p className="text-muted-foreground">Before/after improvement chart will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user-behavior" className="space-y-6">
          {/* User Behavior Metrics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="admin-card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Checks/User</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardStats?.totalUsers > 0 
                    ? (totalAtsChecks / dashboardStats.totalUsers).toFixed(1)
                    : "0"}
                </div>
                <p className="text-xs text-muted-foreground">Average per user</p>
              </CardContent>
            </Card>
            
            <Card className="admin-card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-admin-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userActivities.length}</div>
                <p className="text-xs text-muted-foreground">Recent activity</p>
              </CardContent>
            </Card>
            
            <Card className="admin-card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
                <TrendingUp className="h-4 w-4 text-admin-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats?.totalSubscriptions || 0}</div>
                <p className="text-xs text-muted-foreground">All subscriptions</p>
              </CardContent>
            </Card>
            
            <Card className="admin-card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardStats?.totalUsers > 0 
                    ? ((userActivities.length / dashboardStats.totalUsers) * 100).toFixed(1)
                    : "0"}%
                </div>
                <p className="text-xs text-muted-foreground">User engagement</p>
              </CardContent>
            </Card>
          </div>

          {/* User Activity Heatmap Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>User Activity Heatmap</CardTitle>
              <CardDescription>Peak usage times and activity patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <p className="text-muted-foreground">User activity heatmap will be displayed here</p>
              </div>
            </CardContent>
          </Card>

          {/* Correlation Analysis Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>ATS Checks vs Subscription Renewals</CardTitle>
              <CardDescription>Correlation between ATS usage and subscription behavior</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <p className="text-muted-foreground">Correlation scatter chart will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}