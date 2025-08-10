import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Copy, Code, MessageCircle, Palette, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function EmbedGenerator() {
  const { toast } = useToast();
  const [config, setConfig] = useState({
    agentId: "agent_12345",
    title: "Chat with our AI Assistant",
    placeholder: "Type your message...",
    primaryColor: "#8B5CF6",
    showAvatar: true,
    showTyping: true,
    position: "bottom-right",
    width: "400",
    height: "600",
  });

  const generateEmbedCode = () => {
    return `<!-- LuxLLM Chat Widget -->
<div id="luxllm-chat-widget"></div>
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://cdn.luxllm.com/widget.js';
    script.async = true;
    script.onload = function() {
      LuxLLM.init({
        agentId: '${config.agentId}',
        title: '${config.title}',
        placeholder: '${config.placeholder}',
        primaryColor: '${config.primaryColor}',
        showAvatar: ${config.showAvatar},
        showTyping: ${config.showTyping},
        position: '${config.position}',
        width: ${config.width},
        height: ${config.height}
      });
    };
    document.head.appendChild(script);
  })();
</script>`;
  };

  const generateReactCode = () => {
    return `import { LuxLLMChat } from '@luxllm/react';

function MyComponent() {
  return (
    <LuxLLMChat
      agentId="${config.agentId}"
      title="${config.title}"
      placeholder="${config.placeholder}"
      primaryColor="${config.primaryColor}"
      showAvatar={${config.showAvatar}}
      showTyping={${config.showTyping}}
      width={${config.width}}
      height={${config.height}}
    />
  );
}`;
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied to clipboard",
      description: "The embed code has been copied to your clipboard.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Embed Generator</h1>
        <p className="text-muted-foreground mt-2">
          Generate embed code to integrate your AI agent into any website
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Widget Configuration
              </CardTitle>
              <CardDescription>
                Customize your chat widget appearance and behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="agentId">Agent ID</Label>
                <Input
                  id="agentId"
                  value={config.agentId}
                  onChange={e =>
                    setConfig({ ...config, agentId: e.target.value })
                  }
                  placeholder="agent_12345"
                />
              </div>

              <div>
                <Label htmlFor="title">Widget Title</Label>
                <Input
                  id="title"
                  value={config.title}
                  onChange={e =>
                    setConfig({ ...config, title: e.target.value })
                  }
                  placeholder="Chat with our AI Assistant"
                />
              </div>

              <div>
                <Label htmlFor="placeholder">Input Placeholder</Label>
                <Input
                  id="placeholder"
                  value={config.placeholder}
                  onChange={e =>
                    setConfig({ ...config, placeholder: e.target.value })
                  }
                  placeholder="Type your message..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize the visual appearance of your widget
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={config.primaryColor}
                    onChange={e =>
                      setConfig({ ...config, primaryColor: e.target.value })
                    }
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={config.primaryColor}
                    onChange={e =>
                      setConfig({ ...config, primaryColor: e.target.value })
                    }
                    placeholder="#8B5CF6"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="width">Width (px)</Label>
                  <Input
                    id="width"
                    value={config.width}
                    onChange={e =>
                      setConfig({ ...config, width: e.target.value })
                    }
                    placeholder="400"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (px)</Label>
                  <Input
                    id="height"
                    value={config.height}
                    onChange={e =>
                      setConfig({ ...config, height: e.target.value })
                    }
                    placeholder="600"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Show Avatar</Label>
                  <Switch
                    checked={config.showAvatar}
                    onCheckedChange={checked =>
                      setConfig({ ...config, showAvatar: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Show Typing Indicator</Label>
                  <Switch
                    checked={config.showTyping}
                    onCheckedChange={checked =>
                      setConfig({ ...config, showTyping: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Code Generation */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Generated Code
              </CardTitle>
              <CardDescription>
                Copy and paste this code into your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="html" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="html">HTML/JavaScript</TabsTrigger>
                  <TabsTrigger value="react">React</TabsTrigger>
                </TabsList>

                <TabsContent value="html" className="mt-4">
                  <div className="relative">
                    <Textarea
                      value={generateEmbedCode()}
                      readOnly
                      className="font-mono text-sm min-h-[300px] resize-none"
                    />
                    <Button
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(generateEmbedCode())}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="react" className="mt-4">
                  <div className="relative">
                    <Textarea
                      value={generateReactCode()}
                      readOnly
                      className="font-mono text-sm min-h-[300px] resize-none"
                    />
                    <Button
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(generateReactCode())}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Live Preview
              </CardTitle>
              <CardDescription>
                See how your widget will look on your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-muted/50 min-h-[200px] flex items-center justify-center">
                <div
                  className="border rounded-lg bg-card shadow-lg p-4 max-w-sm w-full"
                  style={{ borderColor: config.primaryColor }}
                >
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b">
                    {config.showAvatar && (
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                        style={{ backgroundColor: config.primaryColor }}
                      >
                        AI
                      </div>
                    )}
                    <h4 className="font-medium text-sm">{config.title}</h4>
                  </div>
                  <div className="space-y-2 mb-3">
                    <div className="bg-muted rounded-lg p-2 text-sm">
                      Hello! How can I help you today?
                    </div>
                    {config.showTyping && (
                      <div className="flex items-center gap-1 text-muted-foreground text-xs">
                        <div className="w-1 h-1 bg-current rounded-full animate-pulse"></div>
                        <div className="w-1 h-1 bg-current rounded-full animate-pulse delay-75"></div>
                        <div className="w-1 h-1 bg-current rounded-full animate-pulse delay-150"></div>
                        <span className="ml-1">AI is typing...</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder={config.placeholder}
                      className="flex-1 text-sm"
                      disabled
                    />
                    <Button
                      size="sm"
                      style={{ backgroundColor: config.primaryColor }}
                      className="text-white"
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
