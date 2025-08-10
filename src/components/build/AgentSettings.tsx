import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Save, Bot, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AgentConfig {
  name: string;
  description: string;
  personality: string;
  temperature: number;
  systemPrompt: string;
  isActive: boolean;
}

export function AgentSettings() {
  const { toast } = useToast();
  const [config, setConfig] = useState<AgentConfig>({
    name: "",
    description: "",
    personality: "",
    temperature: 0.7,
    systemPrompt: "",
    isActive: true,
  });

  useEffect(() => {
    // Check if a template was selected
    const selectedTemplate = localStorage.getItem("selectedTemplate");
    if (selectedTemplate) {
      try {
        const template = JSON.parse(selectedTemplate);
        setConfig({
          name: template.name,
          description: template.description,
          personality: template.personality,
          temperature: template.temperature,
          systemPrompt: template.systemPrompt,
          isActive: true,
        });
        // Clear the stored template
        localStorage.removeItem("selectedTemplate");
      } catch (error) {
        console.error("Error parsing template:", error);
      }
    }
  }, []);

  const handleSave = () => {
    // Here you would typically save to Supabase
    // For now, we'll just show a success toast
    toast({
      title: "Agent Saved",
      description: "Your agent configuration has been saved successfully.",
    });
  };

  const handleTest = () => {
    // Simulate testing the agent
    toast({
      title: "Test Message Sent",
      description: "Your agent is responding...",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agent Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure your AI agent's behavior and personality
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Set up your agent's basic details and identity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Agent Name</Label>
                <Input
                  id="name"
                  value={config.name}
                  onChange={e => setConfig({ ...config, name: e.target.value })}
                  placeholder="Enter your agent's name"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={config.description}
                  onChange={e =>
                    setConfig({ ...config, description: e.target.value })
                  }
                  placeholder="Describe what your agent does"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="personality">Personality</Label>
                <Input
                  id="personality"
                  value={config.personality}
                  onChange={e =>
                    setConfig({ ...config, personality: e.target.value })
                  }
                  placeholder="e.g., Friendly, professional, helpful"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Prompt</CardTitle>
              <CardDescription>
                Define how your agent should behave and respond
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={config.systemPrompt}
                onChange={e =>
                  setConfig({ ...config, systemPrompt: e.target.value })
                }
                placeholder="You are a helpful assistant that..."
                rows={8}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Fine-tune your agent's behavior parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Temperature: {config.temperature}</Label>
                  <span className="text-sm text-muted-foreground">
                    {config.temperature < 0.3
                      ? "Conservative"
                      : config.temperature < 0.7
                      ? "Balanced"
                      : "Creative"}
                  </span>
                </div>
                <Slider
                  value={[config.temperature]}
                  onValueChange={value =>
                    setConfig({ ...config, temperature: value[0] })
                  }
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Lower values make responses more focused and consistent
                </p>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Agent Status</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable your agent
                  </p>
                </div>
                <Switch
                  checked={config.isActive}
                  onCheckedChange={checked =>
                    setConfig({ ...config, isActive: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>
                Save your changes or test your agent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={handleSave} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Agent
              </Button>
              <Button onClick={handleTest} variant="outline" className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                Test Agent
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>How your agent will appear</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-muted/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{config.name || "Agent Name"}</p>
                    <p className="text-xs text-muted-foreground">
                      {config.personality || "Personality"}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {config.description || "Agent description will appear here"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
