import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

// Mock analytics data
const mockAtsData = {
  averageScore: 78.5,
  totalChecks: 15234,
  improvementRate: 23.4,
  topJobTitles: [
    { title: "Software Engineer", count: 2341, avgScore: 82 },
    { title: "Marketing Manager", count: 1876, avgScore: 76 },
    { title: "Data Analyst", count: 1543, avgScore: 85 },
    { title: "Product Manager", count: 1234, avgScore: 79 },
    { title: "Sales Representative", count: 987, avgScore: 73 }
  ],
  optimizationSuggestions: [
    { suggestion: "Add more keywords", frequency: 45, impact: "High" },
    { suggestion: "Improve formatting", frequency: 38, impact: "Medium" },
    { suggestion: "Quantify achievements", frequency: 32, impact: "High" },
    { suggestion: "Add skills section", frequency: 28, impact: "Medium" },
    { suggestion: "Optimize length", frequency: 22, impact: "Low" }
  ],
  scoreDistribution: [
    { range: "90-100", count: 1234, percentage: 8.1 },
    { range: "80-89", count: 3456, percentage: 22.7 },
    { range: "70-79", count: 4567, percentage: 30.0 },
    { range: "60-69", count: 3890, percentage: 25.5 },
    { range: "50-59", count: 1567, percentage: 10.3 },
    { range: "0-49", count: 520, percentage: 3.4 }
  ]
};

const mockUserBehavior = {
  avgChecksPerUser: 3.2,
  avgTimeSpent: "12:34",
  conversionRate: 27.3,
  retentionRate: 68.9,
  engagementMetrics: [
    { metric: "Resume Downloads", value: 8234, change: "+12.5%" },
    { metric: "Template Views", value: 15678, change: "+8.3%" },
    { metric: "ATS Checks", value: 12456, change: "+15.7%" },
    { metric: "Account Upgrades", value: 234, change: "+23.1%" }
  ]
};

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("30d");
  const [activeTab, setActiveTab] = useState("overview");

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
                <div className="text-2xl font-bold">{mockAtsData.averageScore}</div>
                <p className="text-xs text-muted-foreground">+2.3 from last month</p>
              </CardContent>
            </Card>
            
            <Card className="admin-card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total ATS Checks</CardTitle>
                <BarChart3 className="h-4 w-4 text-admin-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockAtsData.totalChecks.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+15.7% this month</p>
              </CardContent>
            </Card>
            
            <Card className="admin-card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Improvement Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-admin-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockAtsData.improvementRate}%</div>
                <p className="text-xs text-muted-foreground">Users who improved scores</p>
              </CardContent>
            </Card>
            
            <Card className="admin-card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Checks/User</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockUserBehavior.avgChecksPerUser}</div>
                <p className="text-xs text-muted-foreground">Per user engagement</p>
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
              <div className="space-y-4">
                {mockAtsData.scoreDistribution.map((range) => (
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
            </CardContent>
          </Card>

          {/* Engagement Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>User Engagement</CardTitle>
              <CardDescription>Platform usage and engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {mockUserBehavior.engagementMetrics.map((metric) => (
                  <div key={metric.metric} className="space-y-2">
                    <div className="text-sm text-muted-foreground">{metric.metric}</div>
                    <div className="text-2xl font-bold">{metric.value.toLocaleString()}</div>
                    <Badge variant="outline" className="text-xs">
                      {metric.change}
                    </Badge>
                  </div>
                ))}
              </div>
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
                  {mockAtsData.topJobTitles.map((job, index) => (
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
                          {job.avgScore}
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
                  {mockAtsData.optimizationSuggestions.map((suggestion) => (
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
                <CardTitle className="text-sm font-medium">Avg Time Spent</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockUserBehavior.avgTimeSpent}</div>
                <p className="text-xs text-muted-foreground">Per optimization session</p>
              </CardContent>
            </Card>
            
            <Card className="admin-card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-admin-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockUserBehavior.conversionRate}%</div>
                <p className="text-xs text-muted-foreground">ATS checks to upgrades</p>
              </CardContent>
            </Card>
            
            <Card className="admin-card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
                <Users className="h-4 w-4 text-admin-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockUserBehavior.retentionRate}%</div>
                <p className="text-xs text-muted-foreground">30-day user retention</p>
              </CardContent>
            </Card>
            
            <Card className="admin-card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Checks per User</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockUserBehavior.avgChecksPerUser}</div>
                <p className="text-xs text-muted-foreground">Average per user</p>
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