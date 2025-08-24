import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
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
import { useAuth } from "@clerk/clerk-react";

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
  const loadingRef = useRef(loading);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getAgentsByUser, deleteAgent, updateAgent } = useAgentService();

  // Add authentication check
  const { isSignedIn, isLoaded } = useAuth();

  // Debug authentication state
  console.log("MyAgents: Authentication state:", { isLoaded, isSignedIn });

  // Update ref when loading state changes
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  // Load agents on component mount
  useEffect(() => {
    // Only load agents if user is signed in and Clerk is loaded
    if (isLoaded && isSignedIn) {
      console.log("MyAgents: User is authenticated, loading agents...");
      loadAgents();
    } else if (isLoaded && !isSignedIn) {
      console.log(
        "MyAgents: User is not authenticated, redirecting to sign in..."
      );
      setLoading(false);
      navigate("/auth/sign-in");
      return;
    }

    // Add a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (loadingRef.current) {
        console.log(
          "MyAgents: Loading timeout reached, forcing loading to false"
        );
        setLoading(false);
        loadingRef.current = false;
        toast({
          title: "Warning",
          description: "Loading took too long. Please refresh the page.",
          variant: "destructive",
        });
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [isLoaded, isSignedIn, toast, navigate]);

  const loadAgents = async () => {
    try {
      console.log("MyAgents: Starting to load agents...");
      setLoading(true);
      loadingRef.current = true;

      const { data, error } = await getAgentsByUser();
      console.log("MyAgents: Response from getAgentsByUser:", { data, error });

      if (error) {
        console.error("MyAgents: Error loading agents:", error);
        toast({
          title: "Error",
          description: "Failed to load agents: " + error,
          variant: "destructive",
        });
        return;
      }

      console.log("MyAgents: Setting agents:", data);
      setAgents(data || []);
    } catch (error) {
      console.error("MyAgents: Unexpected error loading agents:", error);
      toast({
        title: "Error",
        description: "Failed to load agents",
        variant: "destructive",
      });
    } finally {
      console.log("MyAgents: Setting loading to false");
      setLoading(false);
      loadingRef.current = false;
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
    <section className="pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-thin tracking-tight text-foreground">
              {!isLoaded
                ? "Loading..."
                : !isSignedIn
                ? "Authentication Required"
                : "My Agents"}
            </h1>
            <p className="text-muted-foreground mt-2 font-thin">
              {!isLoaded
                ? "Please wait..."
                : !isSignedIn
                ? "Sign in to access your agents"
                : "Manage and monitor your AI agents"}
            </p>
          </div>
          {isLoaded && isSignedIn && (
            <Button
              onClick={() => navigate("/build/templates")}
              className="w-fit"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Agent
            </Button>
          )}
        </div>

        {/* Search - Only show when authenticated */}
        {isLoaded && isSignedIn && (
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search agents..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 max-w-md"
            />
          </div>
        )}

        {/* Agents Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!isLoaded ? (
            <div className="col-span-full text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-lg font-medium">Loading authentication...</p>
              </div>
            </div>
          ) : !isSignedIn ? (
            <div className="col-span-full text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">
                  Please sign in to view your agents
                </p>
                <Button onClick={() => navigate("/auth/sign-in")}>
                  Sign In
                </Button>
              </div>
            </div>
          ) : loading ? (
            <div className="col-span-full text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-lg font-medium">Loading agents...</p>
                <Button variant="outline" onClick={loadAgents} className="mt-2">
                  Retry
                </Button>
              </div>
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
            filteredAgents.map((agent, index) => (
              <motion.article
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
                className="group relative rounded-2xl border bg-card/20 text-card-foreground p-6 shadow-sm hover:shadow-md transition cursor-pointer"
              >
                {/* Top badge and icon */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-full">
                    {agent.status || "Active"}
                  </span>
                  <div className="text-xl text-muted-foreground transition-colors duration-200 group-hover:text-primary">
                    <Bot className="h-5 w-5" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-thin text-foreground mb-3 group-hover:text-primary transition-colors duration-200">
                  {agent.name}
                </h3>

                {/* Description */}
                <p className="text-sm font-thin text-muted-foreground mb-4">
                  {agent.description || "No description available"}
                </p>

                {/* Stats */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Messages:</span>
                    <span className="font-medium">
                      {agent.messages?.toLocaleString() || "0"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Rating:</span>
                    <span className="font-medium">
                      {agent.rating !== undefined
                        ? `${agent.rating}/5.0`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Last Active:</span>
                    <span className="font-medium">
                      {agent.lastActive || "Never"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={e => {
                        e.stopPropagation();
                        handleEdit(agent);
                      }}
                      className="border-border text-xs px-3 py-1 h-7"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={e => {
                        e.stopPropagation();
                        navigate(`/export?agentId=${agent.id}`);
                      }}
                      className="border-border text-xs px-3 py-1 h-7"
                    >
                      <Clipboard className="h-3 w-3 mr-1" />
                      Export
                    </Button>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                        onClick={e => e.stopPropagation()}
                      >
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(agent)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
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
              </motion.article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
