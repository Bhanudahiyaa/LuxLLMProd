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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Slack,
  MessageCircle,
  Globe,
  Smartphone,
  Mail,
  Webhook,
  Settings,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const integrations = [
  {
    id: "slack",
    name: "Slack",
    description: "Connect your AI agent to Slack channels and direct messages",
    icon: Slack,
    category: "Messaging",
    status: "available",
    connected: false,
    popular: true,
  },
  {
    id: "discord",
    name: "Discord",
    description: "Deploy your agent as a Discord bot in servers and DMs",
    icon: MessageCircle,
    category: "Messaging",
    status: "available",
    connected: true,
    popular: true,
  },
  {
    id: "website",
    name: "Website Widget",
    description: "Embed a chat widget directly on your website",
    icon: Globe,
    category: "Web",
    status: "available",
    connected: true,
    popular: true,
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    description: "Connect to WhatsApp Business API for customer support",
    icon: Smartphone,
    category: "Messaging",
    status: "coming-soon",
    connected: false,
    popular: false,
  },
  {
    id: "email",
    name: "Email Integration",
    description: "Handle customer support emails with AI assistance",
    icon: Mail,
    category: "Support",
    status: "available",
    connected: false,
    popular: false,
  },
  {
    id: "webhook",
    name: "Custom Webhook",
    description: "Create custom integrations using webhooks and APIs",
    icon: Webhook,
    category: "Developer",
    status: "available",
    connected: false,
    popular: false,
  },
];

const categories = ["All", "Messaging", "Web", "Support", "Developer"];

export function Integrations() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [connectedIntegrations, setConnectedIntegrations] = useState(
    integrations.reduce((acc, integration) => {
      acc[integration.id] = integration.connected;
      return acc;
    }, {} as Record<string, boolean>)
  );
  const { toast } = useToast();

  const filteredIntegrations = integrations.filter(
    integration =>
      selectedCategory === "All" || integration.category === selectedCategory
  );

  const handleToggleConnection = (
    integrationId: string,
    integrationName: string
  ) => {
    const isConnecting = !connectedIntegrations[integrationId];

    setConnectedIntegrations(prev => ({
      ...prev,
      [integrationId]: isConnecting,
    }));

    toast({
      title: isConnecting
        ? "Integration Connected"
        : "Integration Disconnected",
      description: `${integrationName} has been ${
        isConnecting ? "connected" : "disconnected"
      } successfully.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return (
          <Badge variant="default" className="text-xs">
            Available
          </Badge>
        );
      case "coming-soon":
        return (
          <Badge variant="secondary" className="text-xs">
            Coming Soon
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground mt-2">
          Connect your AI agents to popular platforms and services
        </p>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-5">
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="text-xs">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIntegrations.map(integration => {
              const IconComponent = integration.icon;
              const isConnected = connectedIntegrations[integration.id];
              const isAvailable = integration.status === "available";

              return (
                <Card
                  key={integration.id}
                  className="hover:shadow-card transition-all duration-300"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 w-fit">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        {integration.popular && (
                          <Badge variant="secondary" className="text-xs">
                            Popular
                          </Badge>
                        )}
                      </div>
                      {getStatusBadge(integration.status)}
                    </div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {integration.name}
                      {isConnected && (
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      )}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {integration.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {isConnected ? "Connected" : "Connect"}
                        </span>
                        <Switch
                          checked={isConnected}
                          onCheckedChange={() =>
                            handleToggleConnection(
                              integration.id,
                              integration.name
                            )
                          }
                          disabled={!isAvailable}
                        />
                      </div>

                      {isConnected && isAvailable && (
                        <div className="pt-2 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Configure
                          </Button>
                        </div>
                      )}

                      {!isAvailable && (
                        <div className="pt-2">
                          <p className="text-xs text-muted-foreground">
                            This integration is coming soon. Join our newsletter
                            to get notified.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Connected Integrations Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Summary</CardTitle>
          <CardDescription>
            Overview of your connected integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {Object.values(connectedIntegrations).filter(Boolean).length}
              </div>
              <p className="text-sm text-muted-foreground">Connected</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-muted-foreground">
                {integrations.filter(i => i.status === "available").length}
              </div>
              <p className="text-sm text-muted-foreground">Available</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-accent">
                {integrations.filter(i => i.status === "coming-soon").length}
              </div>
              <p className="text-sm text-muted-foreground">Coming Soon</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Webhook className="h-5 w-5" />
            Custom Integration
          </CardTitle>
          <CardDescription>
            Need a custom integration? Contact our team or use our API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="api-endpoint">API Endpoint</Label>
              <Input
                id="api-endpoint"
                placeholder="https://api.yourservice.com/webhook"
                className="font-mono text-sm"
              />
            </div>
            <div>
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Your API key"
                className="font-mono text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              View API Docs
            </Button>
            <Button>Test Connection</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
