import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, Download, Code, Settings, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAgentService } from "@/hooks/agentService";
import { toast } from "sonner";

interface Agent {
  id: number;
  name: string;
  description: string;
  status: "active" | "inactive";
  messages: number;
  lastActive: string;
  rating: number;
  category: string;
}

export default function ExportAgent() {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getAgentsByUser } = useAgentService();

  useEffect(() => {
    const loadAgent = async () => {
      if (!agentId) return;

      try {
        const { data, error } = await getAgentsByUser();
        if (error) {
          toast.error("Failed to load agent");
          return;
        }

        const foundAgent = data?.find(a => a.id.toString() === agentId);
        if (foundAgent) {
          setAgent(foundAgent);
        }
      } catch (err) {
        console.error("Error loading agent:", err);
        toast.error("Failed to load agent");
      } finally {
        setIsLoading(false);
      }
    };

    loadAgent();
  }, [agentId, getAgentsByUser]);

  const generateExportCode = () => {
    if (!agent) return "";

    return `<!-- ${agent.name} Chatbot Widget -->
<script>
(function() {
  // Chatbot configuration
  const config = {
    name: "${agent.name}",
    description: "${agent.description}",
    category: "${agent.category}",
    status: "${agent.status}"
  };
  
  // Create chatbot widget
  const widget = document.createElement('div');
  widget.id = 'chatbot-widget-${agent.id}';
  widget.innerHTML = \`
    <div style="
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      background: #007bff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
    ">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
      </svg>
    </div>
  \`;
  
  document.body.appendChild(widget);
  
  // Add click handler
  widget.addEventListener('click', function() {
    alert('Chatbot: ' + config.name + '\\nDescription: ' + config.description);
  });
})();
</script>`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateExportCode());
    toast.success("Export code copied to clipboard!");
  };

  const downloadCode = () => {
    const blob = new Blob([generateExportCode()], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${agent?.name
      ?.replace(/\s+/g, "-")
      .toLowerCase()}-chatbot.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Export code downloaded!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading agent...</p>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Agent Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The agent you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/build/agents")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Agents
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/build/agents")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Agents
          </Button>
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            <span className="font-semibold">Export Agent</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Agent Info */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{agent.name}</CardTitle>
                  <p className="text-muted-foreground mt-2">
                    {agent.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      agent.status === "active" ? "default" : "secondary"
                    }
                  >
                    {agent.status}
                  </Badge>
                  <Badge variant="outline">{agent.category}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Messages:</span>
                  <span className="ml-2 font-medium">
                    {agent.messages.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Rating:</span>
                  <span className="ml-2 font-medium">{agent.rating}/5.0</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Last Active:</span>
                  <span className="ml-2 font-medium">{agent.lastActive}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Tabs defaultValue="code" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="code" className="gap-2">
                <Code className="w-4 h-4" />
                Export Code
              </TabsTrigger>
              <TabsTrigger value="config" className="gap-2">
                <Settings className="w-4 h-4" />
                Configuration
              </TabsTrigger>
              <TabsTrigger value="embed" className="gap-2">
                <Download className="w-4 h-4" />
                Embed
              </TabsTrigger>
            </TabsList>

            <TabsContent value="code" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Export Code</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={copyToClipboard}
                        className="gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Copy
                      </Button>
                      <Button onClick={downloadCode} className="gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-lg p-4">
                    <pre className="text-sm overflow-x-auto">
                      <code>{generateExportCode()}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="config" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Agent Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Name</label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {agent.name}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Category</label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {agent.category}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Status</label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {agent.status}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Rating</label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {agent.rating}/5.0
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {agent.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="embed" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Embed Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">HTML Embed</h4>
                      <div className="bg-muted rounded-lg p-4">
                        <code className="text-sm">
                          {`<script src="https://your-domain.com/chatbot.js" data-agent-id="${agent.id}"></script>`}
                        </code>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">React Component</h4>
                      <div className="bg-muted rounded-lg p-4">
                        <code className="text-sm">
                          {`import { Chatbot } from 'your-chatbot-package';
<Chatbot agentId="${agent.id}" />`}
                        </code>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">API Integration</h4>
                      <div className="bg-muted rounded-lg p-4">
                        <code className="text-sm">
                          {`const response = await fetch('https://your-api.com/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ agentId: ${agent.id}, message: 'Hello' })
});`}
                        </code>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}
