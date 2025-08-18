import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useClerkSupabase } from "@/lib/useClerkSupabase";
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
import { templateConfigs } from "@/lib/templateConfigs";

interface AgentConfig {
  name: string;
  description: string;
  personality: string;
  temperature: number;
  systemPrompt: string;
  isActive: boolean;
}

interface Template {
  id: string;
  title: string;
  description: string;
  personality?: string;
  temperature?: number;
  systemPrompt?: string;
}

function isValidUUID(uuid: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    uuid
  );
}

export function AgentSettings() {
  const { agentId } = useParams<{ agentId?: string }>();
  const { toast } = useToast();
  const { getSupabase } = useClerkSupabase();

  const [config, setConfig] = useState<AgentConfig>({
    name: "",
    description: "",
    personality: "",
    temperature: 0.7,
    systemPrompt: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAgentOrTemplate = async () => {
      try {
        setLoading(true);
        const supabase = await getSupabase();

        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          console.warn("No logged in user");
          return;
        }

        // Fetch templates just to ensure Supabase works
        const { data: templates } = await supabase
          .from("templates")
          .select("*");
        console.log("Templates fetched:", templates);

        if (agentId && isValidUUID(agentId)) {
          const { data: agent, error } = await supabase
            .from("agents")
            .select("*")
            .eq("id", agentId)
            .eq("user_id", user.id)
            .maybeSingle();
          if (error) throw error;
          if (agent) {
            setConfig(agent as AgentConfig);
            return;
          }
        }

        const storedTemplate = localStorage.getItem("selectedTemplate");
        if (storedTemplate) {
          const template: Template = JSON.parse(storedTemplate);
          const templateConfig = templateConfigs[template.id];
          setConfig(
            (templateConfig as AgentConfig) ||
              ({
                name: template.title,
                description: template.description,
                personality: template.personality || "",
                temperature: template.temperature || 0.7,
                systemPrompt: template.systemPrompt || "",
                isActive: true,
              } as AgentConfig)
          );
          localStorage.removeItem("selectedTemplate");
          return;
        }

        const { data } = await supabase
          .from("user_selected_templates")
          .select("template_id, templates(*)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data?.templates) {
          const template: Template = data.templates;
          setConfig({
            name: template.title,
            description: template.description,
            personality: template.personality || "",
            temperature: template.temperature || 0.7,
            systemPrompt: template.systemPrompt || "",
            isActive: true,
          });
        }
      } catch (err) {
        console.error("Error loading agent/template:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentOrTemplate();
  }, [agentId, getSupabase]);

  const handleSave = async () => {
    if (!config.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for your agent.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      const supabase = await getSupabase();

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No logged in user");

      let agent_id = agentId;

      if (agentId && isValidUUID(agentId)) {
        const { data, error } = await supabase
          .from("agents")
          .update(config)
          .eq("id", agentId)
          .eq("user_id", user.id)
          .select("id")
          .maybeSingle();
        if (error) throw error;
        agent_id = data?.id || agentId;
      } else {
        let template_id;
        const storedTemplate = localStorage.getItem("selectedTemplate");
        if (storedTemplate) {
          try {
            const template = JSON.parse(storedTemplate);
            if (template.id && isValidUUID(template.id)) {
              template_id = template.id;
            }
          } catch (error) {
            console.warn("Failed to parse stored template:", error);
          }
        }
        if (!template_id) {
          const { data } = await supabase
            .from("user_selected_templates")
            .select("template_id")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();
          if (data?.template_id && isValidUUID(data.template_id)) {
            template_id = data.template_id;
          }
        }

        const insertObj: AgentConfig & { user_id: string; template_id?: string } = { ...config, user_id: user.id };
        if (template_id) insertObj.template_id = template_id;

        const { data, error } = await supabase
          .from("agents")
          .insert(insertObj)
          .select("id")
          .maybeSingle();
        if (error) throw error;
        agent_id = data?.id;
      }

      toast({
        title: "Agent Saved",
        description: "Your agent configuration has been saved successfully.",
      });
    } catch (err) {
      console.error("Error saving agent:", err);
      toast({
        title: "Save Failed",
        description: "Could not save your agent configuration.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTest = () => {
    toast({
      title: "Test Message Sent",
      description: "Your agent is responding...",
    });
  };

  if (loading) return <p>Loading agent settings...</p>;

  // === Your original UI preserved ===
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agent Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure your AI agent's behavior and personality
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
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
              <Label htmlFor="name">Agent Name</Label>
              <Input
                id="name"
                value={config.name}
                onChange={e => setConfig({ ...config, name: e.target.value })}
                disabled={loading || saving}
              />

              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={config.description}
                onChange={e =>
                  setConfig({ ...config, description: e.target.value })
                }
                rows={3}
                disabled={loading || saving}
              />

              <Label htmlFor="personality">Personality</Label>
              <Input
                id="personality"
                value={config.personality}
                onChange={e =>
                  setConfig({ ...config, personality: e.target.value })
                }
                disabled={loading || saving}
              />
            </CardContent>
          </Card>

          {/* System Prompt */}
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
                rows={8}
                className="font-mono text-sm"
                disabled={loading || saving}
              />
            </CardContent>
          </Card>

          {/* Advanced Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Temperature: {config.temperature}</Label>
                <Slider
                  value={[config.temperature]}
                  onValueChange={([value]) =>
                    setConfig({ ...config, temperature: value })
                  }
                  max={1}
                  min={0}
                  step={0.1}
                  disabled={loading || saving}
                />
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
                  disabled={loading || saving}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={handleSave} className="w-full" disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Agent"}
              </Button>
              <Button
                onClick={handleTest}
                variant="outline"
                className="w-full"
                disabled={saving}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Test Agent
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
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
