"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Copy,
  Plus,
  Eye,
  Globe,
  Code,
  Settings,
  Users,
  Palette,
  Download,
} from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { useChatbotSettingsService } from "@/hooks/chatbotSettingsService";
import { useEmbedService } from "@/hooks/embedService";
import { getThemeById, themePresets } from "@/lib/themes";
import { AppSidebar } from "@/components/layout/AppSidebar";
import Navigation from "@/components/Navigation";

interface ChatbotConfig {
  name: string;
  description: string;
  systemPrompt: string;
  avatar: string;
  chatBgColor: string;
  chatBorderColor: string;
  userMsgColor: string;
  botMsgColor: string;
  welcomeMessage: string;
  placeholder: string;
  theme?: string;
  borderRadius?: number;
  fontSize?: number;
  fontFamily?: string;
}

export default function ExportPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const { getChatbotSettings } = useChatbotSettingsService();
  const { createEmbed } = useEmbedService();
  const [copied, setCopied] = useState<string | null>(null);
  const [embedName, setEmbedName] = useState("Portfolio Bot");
  const [description, setDescription] = useState(
    "Customer support chatbot for my website"
  );
  const [maxRequestsPerHour, setMaxRequestsPerHour] = useState("100");
  const [maxRequestsPerDay, setMaxRequestsPerDay] = useState("1000");
  const [chatbotConfig, setChatbotConfig] = useState<ChatbotConfig | null>(
    null
  );
  const [embedCode, setEmbedCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    // Load chatbot customizations from database first, then localStorage
    const loadChatbotConfig = async () => {
      try {
        // First try to load from database (most up-to-date)
        const { data: dbSettings, error } = await getChatbotSettings();

        if (dbSettings && !error) {
          console.log("Loaded configuration from database:", dbSettings);

          const config: ChatbotConfig = {
            name: dbSettings.name || "Portfolio Bot",
            description: "AI chatbot for my website",
            systemPrompt:
              dbSettings.system_prompt || "You are a helpful AI assistant.",
            avatar: dbSettings.avatar_url || "",
            chatBgColor: dbSettings.chat_bg || "#ffffff",
            chatBorderColor: dbSettings.border_color || "#e5e7eb",
            userMsgColor: dbSettings.user_msg_color || "#3b82f6",
            botMsgColor: dbSettings.bot_msg_color || "#1f2937",
            welcomeMessage: "Hello! How can I help you today?",
            placeholder: "Type your message...",
            borderRadius: 12,
            fontSize: 14,
            fontFamily: "Inter",
            theme: "modern"
          };

          setChatbotConfig(config);
          setEmbedName(dbSettings.name || "Portfolio Bot");
          setDescription("AI chatbot for my website");
          console.log("Using database configuration:", config);
          return;
        }
      } catch (dbError) {
        console.log("Database load failed, trying localStorage:", dbError);
      }

      // Fallback to localStorage
      const customizations = localStorage.getItem("chatbotCustomizations");
      const selectedAgent = localStorage.getItem("selectedAgent");
      const exportConfig = localStorage.getItem("exportChatbotConfig");

      let config: ChatbotConfig | null = null;

      // Priority: exportChatbotConfig (from editor) > selectedAgent > customizations
      if (exportConfig) {
        try {
          const exportData = JSON.parse(exportConfig);
          console.log(
            "Loaded export configuration from localStorage:",
            exportData
          );

          config = {
            name: exportData.name || "Portfolio Bot",
            description: exportData.description || "AI chatbot for my website",
            systemPrompt:
              exportData.system_prompt || "You are a helpful AI assistant.",
            avatar: exportData.avatar_url || "",
            chatBgColor: exportData.chat_bg || "#ffffff",
            chatBorderColor: exportData.border_color || "#e5e7eb",
            userMsgColor: exportData.user_msg_color || "#3b82f6",
            botMsgColor: exportData.bot_msg_color || "#1f2937",
            welcomeMessage:
              exportData.welcome_message || "Hello! How can I help you today?",
            placeholder: exportData.placeholder || "Type your message...",
            borderRadius: exportData.border_radius || 12,
            fontSize: exportData.font_size || 14,
            fontFamily: exportData.font_family || "Inter",
            theme: exportData.theme || "modern"
          };

          setEmbedName(exportData.name || "Portfolio Bot");
          setDescription(exportData.description || "AI chatbot for my website");

          console.log("Using export configuration from localStorage:", config);
        } catch (e) {
          console.log("Error parsing export config:", e);
        }
      }

      if (!config && selectedAgent) {
        try {
          const agent = JSON.parse(selectedAgent);
          config = {
            name: agent.name || "Portfolio Bot",
            description:
              agent.description || "Customer support chatbot for my website",
            systemPrompt:
              agent.system_prompt || "You are a helpful AI assistant.",
            avatar: agent.avatar_url || "",
            chatBgColor: agent.chat_bg || "#ffffff",
            chatBorderColor: agent.border_color || "#e5e7eb",
            userMsgColor: agent.user_msg_color || "#3b82f6",
            botMsgColor: agent.bot_msg_color || "#1f2937",
            welcomeMessage:
              agent.welcome_message || "Hello! How can I help you today?",
            placeholder: agent.placeholder || "Type your message...",
            borderRadius: agent.border_radius || 12,
            fontSize: agent.font_size || 14,
            fontFamily: agent.font_family || "Inter",
            theme: agent.theme || "modern"
          };
          setEmbedName(agent.name || "Portfolio Bot");
          setDescription(
            agent.description || "Customer support chatbot for my website"
          );
        } catch (e) {
          console.log("Error parsing selected agent:", e);
        }
      }

      if (!config && customizations) {
        try {
          const colors = JSON.parse(customizations);
          config = {
            name: "Portfolio Bot",
            description: "Customer support chatbot for my website",
            systemPrompt: "You are a helpful AI assistant.",
            avatar: "",
            chatBgColor: colors.chat_bg || "#ffffff",
            chatBorderColor: colors.border_color || "#e5e7eb",
            userMsgColor: colors.user_msg_color || "#3b82f6",
            botMsgColor: colors.bot_msg_color || "#1f2937",
            welcomeMessage: "Hello! How can I help you today?",
            placeholder: "Type your message...",
            borderRadius: 12,
            fontSize: 14,
            fontFamily: "Inter",
            theme: "modern"
          };
        } catch (e) {
          console.log("Error parsing customizations:", e);
        }
      }

      if (config) {
        setChatbotConfig(config);
        console.log("Final chatbot config loaded:", config);
      } else {
        console.log("No chatbot configuration found");
      }
    };

    loadChatbotConfig();
  }, []);

  const generateEmbedScript = () => {
    if (!chatbotConfig) return "";

    // Generate a simple script tag that loads the embed script with configuration
    const configParam = encodeURIComponent(JSON.stringify({
      name: chatbotConfig.name,
      systemPrompt: chatbotConfig.systemPrompt,
      avatar: chatbotConfig.avatar || "",
      chatBgColor: chatbotConfig.chatBgColor,
      chatBorderColor: chatbotConfig.chatBorderColor,
      userMsgColor: chatbotConfig.userMsgColor,
      botMsgColor: chatbotConfig.botMsgColor,
      welcomeMessage: chatbotConfig.welcomeMessage,
      placeholder: chatbotConfig.placeholder,
      borderRadius: chatbotConfig.borderRadius || 12,
      fontSize: chatbotConfig.fontSize || 14,
      fontFamily: chatbotConfig.fontFamily || "Inter",
      theme: chatbotConfig.theme || "modern"
    }));

    return `<script src="https://lux-llm-prod.vercel.app/api/embed-script/${embedCode || "default"}?config=${configParam}" async></script>`;
  };

  const generateIframeEmbed = () => {
    if (!chatbotConfig) return "";

    return `<iframe 
      src="https://lux-llm-prod.vercel.app/api/embed-preview/${
        embedCode || "default"
      }"
      width="400" 
      height="600" 
      frameborder="0" 
      style="border: none; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);"
      title="${chatbotConfig.name} Chatbot"
    ></iframe>`;
  };

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCreateEmbed = async () => {
    if (!chatbotConfig) {
      console.error("No chatbot configuration available");
      return;
    }

    setIsCreating(true);

    try {
      // Generate a unique embed code
      const newEmbedCode = `embed-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Create embed configuration for database
      const embedConfig = {
        embed_code: newEmbedCode,
        name: embedName,
        description: description,
        agent_config: {
          name: chatbotConfig.name,
          system_prompt: chatbotConfig.systemPrompt,
          avatar_url: chatbotConfig.avatar,
          chat_bg_color: chatbotConfig.chatBgColor,
          chat_border_color: chatbotConfig.chatBorderColor,
          user_msg_color: chatbotConfig.userMsgColor,
          bot_msg_color: chatbotConfig.botMsgColor,
          welcome_message: chatbotConfig.welcomeMessage,
          placeholder: chatbotConfig.placeholder,
          theme: chatbotConfig.theme,
          borderRadius: chatbotConfig.borderRadius,
          fontSize: chatbotConfig.fontSize,
          fontFamily: chatbotConfig.fontFamily,
        },
        max_requests_per_hour: parseInt(maxRequestsPerHour),
        max_requests_per_day: parseInt(maxRequestsPerDay),
        is_active: true,
      };

      const { data, error } = await createEmbed(embedConfig);

      if (error) {
        console.error("Failed to create embed:", error);
        alert("Failed to create embed. Please try again.");
        return;
      }

      setEmbedCode(newEmbedCode);
      console.log("Created embed with configuration:", data);

      // Also save to localStorage as backup
      localStorage.setItem(`embed-${newEmbedCode}`, JSON.stringify({
        embedCode: newEmbedCode,
        chatbotConfig: chatbotConfig,
        createdAt: new Date().toISOString(),
        name: embedName,
        description: description,
        maxRequestsPerHour: parseInt(maxRequestsPerHour),
        maxRequestsPerDay: parseInt(maxRequestsPerDay),
      }));

    } catch (error) {
      console.error("Error creating embed:", error);
      alert("Failed to create embed. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <div>Please sign in to access this page.</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <AppSidebar />

      {/* Main Content */}
      <div className="md:ml-48">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="md:hidden">
              {/* Mobile menu trigger is handled by AppSidebar */}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Code className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">
                Export Chatbot
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Seamlessly integrate your AI chatbot into any website with our
              elegant embed solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Chatbot Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-primary" />
                    Current Settings
                  </CardTitle>
                  <CardDescription>
                    Your chatbot configuration from the editor
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {chatbotConfig ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Name
                          </label>
                          <p className="text-foreground font-medium">
                            {chatbotConfig.name}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Theme
                          </label>
                          <p className="text-foreground font-medium">
                            {chatbotConfig.theme || "Modern"}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Primary Color
                          </label>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded border"
                              style={{ backgroundColor: chatbotConfig.userMsgColor }}
                            />
                            <span className="text-foreground font-mono text-sm">
                              {chatbotConfig.userMsgColor}
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Background
                          </label>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded border"
                              style={{ backgroundColor: chatbotConfig.chatBgColor }}
                            />
                            <span className="text-foreground font-mono text-sm">
                              {chatbotConfig.chatBgColor}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Welcome Message
                        </label>
                        <p className="text-foreground text-sm">
                          {chatbotConfig.welcomeMessage}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground">
                      No chatbot configuration found. Please customize your chatbot first.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Create Embed */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary" />
                    Create Embed
                  </CardTitle>
                  <CardDescription>
                    Generate a unique embed code for your chatbot
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Embed Name
                    </label>
                    <Input
                      value={embedName}
                      onChange={(e) => setEmbedName(e.target.value)}
                      placeholder="My Website Chatbot"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Description
                    </label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your chatbot's purpose"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Max Requests/Hour
                      </label>
                      <Input
                        type="number"
                        value={maxRequestsPerHour}
                        onChange={(e) => setMaxRequestsPerHour(e.target.value)}
                        placeholder="100"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Max Requests/Day
                      </label>
                      <Input
                        type="number"
                        value={maxRequestsPerDay}
                        onChange={(e) => setMaxRequestsPerDay(e.target.value)}
                        placeholder="1000"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleCreateEmbed}
                    disabled={isCreating || !chatbotConfig}
                    className="w-full"
                  >
                    {isCreating ? "Creating..." : "Create Embed"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Script Embed */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-primary" />
                    Script Embed
                  </CardTitle>
                  <CardDescription>
                    Add this script tag to your website's HTML
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg border text-sm font-mono overflow-x-auto">
                      <code className="text-foreground">
                        {generateEmbedScript()}
                      </code>
                    </pre>
                    <Button
                      onClick={() => copyToClipboard(generateEmbedScript(), "script")}
                      size="sm"
                      className="absolute top-2 right-2"
                      variant="outline"
                    >
                      {copied === "script" ? (
                        <Copy className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      {copied === "script" ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Iframe Embed */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" />
                    Iframe Embed
                  </CardTitle>
                  <CardDescription>
                    Embed the chatbot as an iframe element
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg border text-sm font-mono overflow-x-auto">
                      <code className="text-foreground">
                        {generateIframeEmbed()}
                      </code>
                    </pre>
                    <Button
                      onClick={() => copyToClipboard(generateIframeEmbed(), "iframe")}
                      size="sm"
                      className="absolute top-2 right-2"
                      variant="outline"
                    >
                      {copied === "iframe" ? (
                        <Copy className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      {copied === "iframe" ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Test Your Embed */}
              {embedCode && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-primary" />
                      Test Your Embed
                    </CardTitle>
                    <CardDescription>
                      Preview how your chatbot will look on websites
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Click the button below to open a preview page where you can test your chatbot.
                      </p>
                      <Button
                        onClick={() => window.open(`/api/embed-preview/${embedCode}`, '_blank')}
                        className="w-full"
                        variant="outline"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Open Preview
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* API Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    API Configuration
                  </CardTitle>
                  <CardDescription>
                    Your chatbot's API endpoint and configuration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      API Endpoint
                    </label>
                    <div className="relative">
                      <Input
                        value="https://lux-llm-prod.vercel.app/api/public-chat"
                        readOnly
                        className="pr-20"
                      />
                      <Button
                        onClick={() => copyToClipboard("https://lux-llm-prod.vercel.app/api/public-chat", "api")}
                        size="sm"
                        className="absolute right-1 top-1"
                        variant="outline"
                      >
                        {copied === "api" ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Required Headers
                    </label>
                    <pre className="bg-muted p-3 rounded text-xs font-mono">
                      Content-Type: application/json
                    </pre>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Request Body
                    </label>
                    <pre className="bg-muted p-3 rounded text-xs font-mono">
                      {JSON.stringify({
                        message: "Hello",
                        embedCode: embedCode || "your-embed-code",
                        sessionId: "unique-session-id"
                      }, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Platform Integrations */}
          <div className="mt-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Platform Integrations
              </h2>
              <p className="text-muted-foreground">
                Get step-by-step instructions for popular platforms
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "WordPress", icon: "🌐" },
                { name: "Shopify", icon: "🛍️" },
                { name: "Webflow", icon: "🎨" },
                { name: "React", icon: "⚛️" },
                { name: "Next.js", icon: "🚀" },
                { name: "Vue.js", icon: "💚" },
                { name: "Angular", icon: "🅰️" },
                { name: "HTML", icon: "📄" },
              ].map((platform) => (
                <Card key={platform.name} className="text-center p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-2xl mb-2">{platform.icon}</div>
                  <h3 className="font-medium text-foreground">{platform.name}</h3>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
