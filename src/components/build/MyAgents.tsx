import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Bot,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Play,
  Pause,
  MessageSquare,
  Eye,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Mock data for agents
const mockAgents = [
  {
    id: 1,
    name: "Customer Support Pro",
    description:
      "Advanced customer support assistant with knowledge base integration",
    status: "active",
    messages: 1234,
    lastActive: "2 hours ago",
    rating: 4.8,
    category: "Support",
  },
  {
    id: 2,
    name: "Sales Assistant",
    description:
      "AI-powered sales assistant for lead qualification and product recommendations",
    status: "active",
    messages: 987,
    lastActive: "1 hour ago",
    rating: 4.6,
    category: "Sales",
  },
  {
    id: 3,
    name: "General Helper",
    description: "Versatile chatbot for general inquiries and basic assistance",
    status: "inactive",
    messages: 756,
    lastActive: "1 day ago",
    rating: 4.4,
    category: "General",
  },
  {
    id: 4,
    name: "Technical Support",
    description:
      "Specialized technical support for troubleshooting and IT issues",
    status: "active",
    messages: 543,
    lastActive: "30 minutes ago",
    rating: 4.2,
    category: "Technical",
  },
];

export function MyAgents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [agents, setAgents] = useState(mockAgents);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const filteredAgents = agents.filter(
    agent =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (agent: any) => {
    // Store agent data for editing
    localStorage.setItem("editingAgent", JSON.stringify(agent));
    navigate("/build/settings");
  };

  const handleDelete = (agentId: number) => {
    setAgents(agents.filter(agent => agent.id !== agentId));
    toast({
      title: "Agent Deleted",
      description: "The agent has been permanently deleted.",
      variant: "destructive",
    });
  };

  const handleToggleStatus = (agentId: number) => {
    setAgents(
      agents.map(agent =>
        agent.id === agentId
          ? {
              ...agent,
              status: agent.status === "active" ? "inactive" : "active",
            }
          : agent
      )
    );
    const agent = agents.find(a => a.id === agentId);
    toast({
      title: `Agent ${
        agent?.status === "active" ? "Deactivated" : "Activated"
      }`,
      description: `${agent?.name} is now ${
        agent?.status === "active" ? "inactive" : "active"
      }.`,
    });
  };

  const handlePreview = (agent: any) => {
    setSelectedAgent(agent);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Agents</h1>
          <p className="text-muted-foreground mt-2">
            Manage and monitor your AI agents
          </p>
        </div>
        <Button onClick={() => navigate("/build/templates")} className="w-fit">
          <Plus className="h-4 w-4 mr-2" />
          Create New Agent
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search agents..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-10 max-w-md"
        />
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map(agent => (
          <Card
            key={agent.id}
            className="hover:shadow-card transition-all duration-300"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 w-fit">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <Badge
                      variant={
                        agent.status === "active" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {agent.status}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(agent)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handlePreview(agent)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleToggleStatus(agent.id)}
                    >
                      {agent.status === "active" ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Activate
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(agent.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardTitle className="text-lg">{agent.name}</CardTitle>
              <CardDescription className="text-sm">
                {agent.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Messages:</span>
                  <span className="font-medium">
                    {agent.messages.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Rating:</span>
                  <span className="font-medium">{agent.rating}/5.0</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Active:</span>
                  <span className="font-medium">{agent.lastActive}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handlePreview(agent)}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(agent)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAgents.length === 0 && (
        <div className="text-center py-12">
          <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium">No agents found</p>
          <p className="text-muted-foreground mb-4">
            Create your first AI agent to get started
          </p>
          <Button onClick={() => navigate("/build/templates")}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Agent
          </Button>
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog
        open={!!selectedAgent}
        onOpenChange={() => setSelectedAgent(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Agent Preview: {selectedAgent?.name}</DialogTitle>
            <DialogDescription>
              Test your agent in a simulated chat environment
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-muted/50 min-h-[300px]">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium">{selectedAgent?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedAgent?.category}
                  </p>
                </div>
              </div>
              <div className="space-y-3 mb-4">
                <div className="bg-card rounded-lg p-3 max-w-xs">
                  <p className="text-sm">
                    Hello! I'm {selectedAgent?.name}. How can I help you today?
                  </p>
                </div>
                <div className="bg-primary/10 rounded-lg p-3 max-w-xs ml-auto">
                  <p className="text-sm">This is a preview of your agent</p>
                </div>
                <div className="bg-card rounded-lg p-3 max-w-xs">
                  <p className="text-sm">
                    Perfect! I'm here and ready to assist. This preview shows
                    how I'll interact with your users.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Input placeholder="Type a message..." className="flex-1" />
                <Button>Send</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
