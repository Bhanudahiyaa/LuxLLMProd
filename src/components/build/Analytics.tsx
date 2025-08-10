import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  MessageSquare,
  Users,
  CreditCard,
  TrendingUp,
  Bot,
  Clock,
  Star,
  Activity,
} from "lucide-react";

// Mock data for analytics
const monthlyData = [
  { month: "Jan", messages: 1200, users: 89, credits: 240 },
  { month: "Feb", messages: 1890, users: 134, credits: 378 },
  { month: "Mar", messages: 2340, users: 187, credits: 468 },
  { month: "Apr", messages: 2100, users: 156, credits: 420 },
  { month: "May", messages: 2890, users: 223, credits: 578 },
  { month: "Jun", messages: 3200, users: 267, credits: 640 },
];

const dailyData = [
  { day: "Mon", messages: 145, activeAgents: 3 },
  { day: "Tue", messages: 234, activeAgents: 4 },
  { day: "Wed", messages: 189, activeAgents: 3 },
  { day: "Thu", messages: 267, activeAgents: 5 },
  { day: "Fri", messages: 298, activeAgents: 4 },
  { day: "Sat", messages: 156, activeAgents: 2 },
  { day: "Sun", messages: 123, activeAgents: 2 },
];

const agentUsage = [
  { name: "Customer Support", value: 45, color: "#8B5CF6" },
  { name: "Sales Assistant", value: 30, color: "#10B981" },
  { name: "General Chat", value: 15, color: "#F59E0B" },
  { name: "Technical Support", value: 10, color: "#EF4444" },
];

const topPerformers = [
  {
    name: "Customer Support Bot",
    messages: 1234,
    rating: 4.8,
    uptime: "99.9%",
  },
  { name: "Sales Assistant Pro", messages: 987, rating: 4.6, uptime: "99.7%" },
  { name: "General Helper", messages: 756, rating: 4.4, uptime: "99.8%" },
  { name: "Tech Support AI", messages: 543, rating: 4.2, uptime: "99.5%" },
];

export function Analytics() {
  const totalMessages = monthlyData.reduce(
    (sum, item) => sum + item.messages,
    0
  );
  const totalUsers = monthlyData.reduce((sum, item) => sum + item.users, 0);
  const totalCredits = monthlyData.reduce((sum, item) => sum + item.credits, 0);
  const activeAgents = 4;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Monitor your AI agents' performance and usage statistics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Messages
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalMessages.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-600">+8%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credits Used</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalCredits.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-600">+15%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAgents}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-600">All online</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="usage">Usage Breakdown</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Messages</CardTitle>
                <CardDescription>
                  Total messages processed by your agents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="messages" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Activity</CardTitle>
                <CardDescription>
                  Messages and active agents over the past week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="messages"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="activeAgents"
                      stroke="#10B981"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Agent Usage Distribution</CardTitle>
                <CardDescription>
                  Which agents are getting the most traffic
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={agentUsage}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {agentUsage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
                <CardDescription>
                  Detailed breakdown of agent usage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agentUsage.map((agent, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: agent.color }}
                        />
                        <span className="font-medium">{agent.name}</span>
                      </div>
                      <Badge variant="secondary">{agent.value}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Agents</CardTitle>
              <CardDescription>
                Your best agents ranked by activity and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformers.map((agent, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{agent.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {agent.messages.toLocaleString()} messages
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {agent.rating} rating
                          </span>
                          <span className="flex items-center gap-1">
                            <Activity className="h-3 w-3" />
                            {agent.uptime} uptime
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">#{index + 1}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
