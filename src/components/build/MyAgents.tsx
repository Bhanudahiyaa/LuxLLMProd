import { useState, useEffect } from "react";
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
// Preview dialog removed
import {
  Bot,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Plus,
  Clipboard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAgentService } from "@/hooks/agentService";

interface Agent {
  id: string;
  name: string;
  description?: string;
  status?: "active" | "inactive";
  messages?: number;
  lastActive?: string;
  rating?: number;
  category?: string;
  created_at: string;
  updated_at: string;
}

export function MyAgents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [agents, setAgents] = useState<Agent[]>([]);
  // Preview state removed
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getAgentsByUser, deleteAgent, updateAgent } = useAgentService();

  // Load agents on component mount
  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      setLoading(true);
      const { data, error } = await getAgentsByUser();
      if (error) {
        toast({
          title: "Error",
          description: "Failed to load agents: " + error,
          variant: "destructive",
        });
        return;
      }
      setAgents(data || []);
    } catch (error) {
      console.error("Error loading agents:", error);
      toast({
        title: "Error",
        description: "Failed to load agents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredAgents = agents.filter(
    agent =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (agent.description &&
        agent.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEdit = (agent: Agent) => {
    // Navigate to the new chatbot editor
    navigate("/editor");
  };

  const handleDelete = async (agentId: string) => {
    try {
      const { error } = await deleteAgent(agentId);
      if (error) {
        toast({
          title: "Error deleting agent",
          description: "Failed to delete agent: " + error,
          variant: "destructive",
        });
        return;
      }
      setAgents(agents.filter(agent => agent.id !== agentId));
      toast({
        title: "Agent Deleted",
        description: "The agent has been permanently deleted.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error deleting agent:", error);
      toast({
        title: "Error deleting agent",
        description: "Failed to delete agent",
        variant: "destructive",
      });
    }
  };

  // Status toggle removed from dropdown

  // Preview handler removed

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
        {loading ? (
          <div className="col-span-full text-center py-12">
            <p className="text-lg font-medium">Loading agents...</p>
          </div>
        ) : filteredAgents.length === 0 ? (
          <div className="col-span-full text-center py-12">
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
        ) : (
          filteredAgents.map(agent => (
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
                      {/* Preview and Activate removed */}
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
                  {agent.description || "No description available"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Messages:</span>
                    <span className="font-medium">
                      {agent.messages?.toLocaleString() || "0"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Rating:</span>
                    <span className="font-medium">
                      {agent.rating !== undefined
                        ? `${agent.rating}/5.0`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last Active:</span>
                    <span className="font-medium">
                      {agent.lastActive || "Never"}
                    </span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(agent)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/export/${agent.id}`)}
                    >
                      <Clipboard className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Preview Dialog removed */}
    </div>
  );
}
