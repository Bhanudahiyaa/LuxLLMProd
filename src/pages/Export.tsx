"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
  Lock,
  Check,
  CheckCircle,
  MessageSquare,
  Zap,
  Sparkles,
  Bot,
  X,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { useChatbotSettingsService } from "@/hooks/chatbotSettingsService";
import { useAgentService } from "@/hooks/agentService";
import { useEmbedService } from "@/hooks/embedService";
import { getThemeById, themePresets } from "@/lib/themes";
import { AppSidebar } from "@/components/layout/AppSidebar";
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";

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
  const [searchParams] = useSearchParams();
  const agentId = searchParams.get("agentId");

  const { getChatbotSettings } = useChatbotSettingsService();
  const { getAgentById } = useAgentService();
  const { createEmbed } = useEmbedService();
  const [copied, setCopied] = useState<string | null>(null);
  const [embedName, setEmbedName] = useState("Portfolio Bot");
  const [description, setDescription] = useState("");
  const [maxRequestsPerHour, setMaxRequestsPerHour] = useState("100");
  const [maxRequestsPerDay, setMaxRequestsPerDay] = useState("1000");
  const [chatbotConfig, setChatbotConfig] = useState<ChatbotConfig | null>(
    null
  );
  const [embedCode, setEmbedCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<any>(null);

  useEffect(() => {
    // Load chatbot customizations from specific agent if agentId is provided
    const loadChatbotConfig = async () => {
      try {
        // If agentId is provided, load that specific agent's configuration
        if (agentId) {
          console.log("Loading configuration for specific agent:", agentId);
          const { data: agent, error } = await getAgentById(agentId);

          if (agent && !error) {
            console.log("Loaded agent configuration:", agent);

            const config: ChatbotConfig = {
              name: agent.name || "Portfolio Bot",
              description: agent.description || "AI chatbot for my website",
              systemPrompt:
                agent.system_prompt || "You are a helpful AI assistant.",
              avatar: agent.avatar_url || "",
              chatBgColor: agent.chat_bg_color || "#ffffff",
              chatBorderColor: agent.chat_border_color || "#e5e7eb",
              userMsgColor: agent.user_msg_color || "#3b82f6",
              botMsgColor: agent.bot_msg_color || "#1f2937",
              welcomeMessage: "Hello! How can I help you today?",
              placeholder: "Type your message...",
              borderRadius: 12,
              fontSize: 14,
              fontFamily: "Inter",
              theme: "modern",
            };

            setChatbotConfig(config);
            setEmbedName(agent.name || "Portfolio Bot");
            setDescription(agent.description || "AI chatbot for my website");
            console.log("Using agent configuration:", config);
            return;
          } else {
            console.log(
              "Failed to load agent, falling back to default:",
              error
            );
          }
        }

        // Fallback: Load chatbot customizations from database first, then localStorage
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
              theme: "modern",
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
              description:
                exportData.description || "AI chatbot for my website",
              systemPrompt:
                exportData.system_prompt || "You are a helpful AI assistant.",
              avatar: exportData.avatar_url || "",
              chatBgColor: exportData.chat_bg || "#ffffff",
              chatBorderColor: exportData.border_color || "#e5e7eb",
              userMsgColor: exportData.user_msg_color || "#3b82f6",
              botMsgColor: exportData.bot_msg_color || "#1f2937",
              welcomeMessage:
                exportData.welcome_message ||
                "Hello! How can I help you today?",
              placeholder: exportData.placeholder || "Type your message...",
              borderRadius: exportData.border_radius || 12,
              fontSize: exportData.font_size || 14,
              fontFamily: exportData.font_family || "Inter",
              theme: exportData.theme || "modern",
            };

            setEmbedName(exportData.name || "Portfolio Bot");
            setDescription(
              exportData.description || "AI chatbot for my website"
            );

            console.log(
              "Using export configuration from localStorage:",
              config
            );
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
              theme: agent.theme || "modern",
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
              theme: "modern",
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
      } catch (error) {
        console.error("Error loading chatbot config:", error);
      }
    };

    loadChatbotConfig();
  }, [agentId, getAgentById, getChatbotSettings]);

  const generateScriptEmbed = () => {
    if (!chatbotConfig) return "";

    // Generate a simple script tag that loads the embed script with configuration
    // Map to match the embed script interface (CORRECT mapping)
    const configParam = encodeURIComponent(
      JSON.stringify({
        name: chatbotConfig.name,
        systemPrompt: chatbotConfig.systemPrompt,
        avatar: chatbotConfig.avatar || "",
        // Map colors to match embed script interface (CORRECT mapping)
        primaryColor: chatbotConfig.userMsgColor, // userMsgColor → primaryColor (headers, buttons)
        backgroundColor: chatbotConfig.chatBgColor, // chatBgColor → backgroundColor (chat background)
        accentColor: chatbotConfig.chatBorderColor, // chatBorderColor → accentColor (borders, secondary)
        textColor: chatbotConfig.botMsgColor, // botMsgColor → textColor (text content)
        // Keep other properties
        welcomeMessage: chatbotConfig.welcomeMessage,
        placeholder: chatbotConfig.placeholder,
        borderRadius: chatbotConfig.borderRadius || 12,
        fontSize: chatbotConfig.fontSize || 14,
        fontFamily: chatbotConfig.fontFamily || "Inter",
        theme: chatbotConfig.theme || "modern",
        // Add missing properties that ChatbotPreview expects
        position: "bottom-right",
        showTypingIndicator: true,
        enableSounds: false,
        animationSpeed: "normal",
      })
    );

    console.log("🔧 Generating embed script with config:", {
      embedCode: embedCode || "default",
      config: JSON.parse(decodeURIComponent(configParam)),
    });

    return `<script src="https://lux-llm-prod.vercel.app/api/embed-script/${
      embedCode || "default"
    }?config=${configParam}" async></script>`;
  };

  const generateIframeEmbed = () => {
    if (!chatbotConfig) return "";

    // Pass configuration to the embed preview via URL parameters
    // Map to match the embed script interface (CORRECT mapping)
    const configParam = encodeURIComponent(
      JSON.stringify({
        name: chatbotConfig.name,
        systemPrompt: chatbotConfig.systemPrompt,
        avatar: chatbotConfig.avatar || "",
        // Map colors to match embed script interface (CORRECT mapping)
        primaryColor: chatbotConfig.userMsgColor, // userMsgColor → primaryColor (headers, buttons)
        backgroundColor: chatbotConfig.chatBgColor, // chatBgColor → backgroundColor (chat background)
        accentColor: chatbotConfig.chatBorderColor, // chatBorderColor → accentColor (borders, secondary)
        textColor: chatbotConfig.botMsgColor, // botMsgColor → textColor (text content)
        // Keep other properties
        welcomeMessage: chatbotConfig.welcomeMessage,
        placeholder: chatbotConfig.placeholder,
        borderRadius: chatbotConfig.borderRadius || 12,
        fontSize: chatbotConfig.fontSize || 14,
        fontFamily: chatbotConfig.fontFamily || "Inter",
        theme: chatbotConfig.theme || "modern",
        // Add missing properties that ChatbotPreview expects
        position: "bottom-right",
        showTypingIndicator: true,
        enableSounds: false,
        animationSpeed: "normal",
      })
    );

    return `<iframe 
      src="https://lux-llm-prod.vercel.app/api/embed-preview/${
        embedCode || "default"
      }?config=${configParam}"
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

  const getIntegrationInstructions = (platformName: string) => {
    const instructions: { [key: string]: string[] } = {
      WordPress: [
        "Install and activate the 'Custom HTML' plugin",
        "Add a new HTML block to your page or post",
        "Paste the embed script in the HTML block",
        "Save and publish your page",
      ],
      Shopify: [
        "Go to your Shopify admin panel",
        "Navigate to Online Store > Themes",
        "Click 'Actions' > 'Edit code'",
        "Find the theme.liquid file and paste the script before </head>",
        "Save the changes",
      ],
      Webflow: [
        "Open your Webflow project",
        "Add an 'Embed' element to your page",
        "Paste the embed script in the embed code field",
        "Publish your site",
      ],
      React: [
        "Create a new component for the chatbot",
        "Import the embed script in your component",
        "Use useEffect to load the script when component mounts",
        "Add the component to your desired page",
      ],
      "Next.js": [
        "Create a new component for the chatbot",
        "Use Next.js Script component to load the embed",
        "Add the component to your page or layout",
        "Ensure proper client-side rendering",
      ],
      "Vue.js": [
        "Create a new Vue component",
        "Use mounted() lifecycle hook to load script",
        "Add the component to your template",
        "Handle any Vue-specific styling conflicts",
      ],
      Angular: [
        "Create a new Angular component",
        "Use AfterViewInit lifecycle hook",
        "Dynamically load the script",
        "Handle Angular zone.js considerations",
      ],
      HTML: [
        "Open your HTML file in a text editor",
        "Paste the embed script in the <head> section",
        "Save the file and open in a browser",
        "The chatbot should appear on your page",
      ],
      Notion: [
        "Create a new code block in your Notion page",
        "Paste the embed script",
        "Note: Limited styling options in Notion",
        "Works best with simple implementations",
      ],
      Bubble: [
        "Open your Bubble project",
        "Add an HTML element to your page",
        "Paste the embed script in the HTML field",
        "Configure the element positioning and styling",
      ],
      Framer: [
        "Open your Framer project",
        "Add a 'Code' element to your page",
        "Paste the embed script in the code field",
        "Position and style the element as needed",
      ],
      Squarespace: [
        "Go to your Squarespace admin panel",
        "Navigate to Pages > Add Section",
        "Choose 'Code' section type",
        "Paste the embed script and save",
      ],
      Wix: [
        "Open your Wix editor",
        "Add an 'HTML' element to your page",
        "Paste the embed script in the HTML field",
        "Position and resize the element",
      ],
      Ghost: [
        "Access your Ghost admin panel",
        "Go to Code Injection",
        "Paste the script in the Site Header field",
        "Save and refresh your site",
      ],
      Drupal: [
        "Go to Structure > Block Layout",
        "Add a new Custom Block",
        "Set block type to 'Custom HTML'",
        "Paste the embed script and save",
      ],
      Joomla: [
        "Go to Extensions > Modules",
        "Create a new Custom HTML module",
        "Paste the embed script in the HTML field",
        "Assign to desired position and publish",
      ],
      Magento: [
        "Go to Content > Blocks",
        "Create a new block",
        "Set content type to HTML",
        "Paste the embed script and save",
      ],
      WooCommerce: [
        "Go to Appearance > Widgets",
        "Add a 'Custom HTML' widget",
        "Paste the embed script in the HTML field",
        "Add to desired widget area",
      ],
      Svelte: [
        "Create a new Svelte component",
        "Use onMount lifecycle function",
        "Dynamically load the script",
        "Add the component to your page",
      ],
      "Nuxt.js": [
        "Create a new component for the chatbot",
        "Use Nuxt's clientOnly component wrapper",
        "Load the script in mounted() hook",
        "Add to your page or layout",
      ],
    };
    return (
      instructions[platformName] || ["Integration instructions coming soon..."]
    );
  };

  const getPlatformUrl = (platformName: string) => {
    const urls: { [key: string]: string } = {
      WordPress: "https://wordpress.org",
      Shopify: "https://shopify.com",
      Webflow: "https://webflow.com",
      React: "https://reactjs.org",
      "Next.js": "https://nextjs.org",
      "Vue.js": "https://vuejs.org",
      Angular: "https://angular.io",
      HTML: "https://developer.mozilla.org/en-US/docs/Web/HTML",
      Notion: "https://notion.so",
      Bubble: "https://bubble.io",
      Framer: "https://framer.com",
      Squarespace: "https://squarespace.com",
      Wix: "https://wix.com",
      Ghost: "https://ghost.org",
      Drupal: "https://drupal.org",
      Joomla: "https://joomla.org",
      Magento: "https://magento.com",
      WooCommerce: "https://woocommerce.com",
      Svelte: "https://svelte.dev",
      "Nuxt.js": "https://nuxtjs.org",
    };
    return urls[platformName] || "#";
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
      setShowSuccess(true);
      console.log("Created embed with configuration:", data);

      // Also save to localStorage as backup
      localStorage.setItem(
        `embed-${newEmbedCode}`,
        JSON.stringify({
          embedCode: newEmbedCode,
          chatbotConfig: chatbotConfig,
          createdAt: new Date().toISOString(),
          name: embedName,
          description: description,
          maxRequestsPerHour: parseInt(maxRequestsPerHour),
          maxRequestsPerDay: parseInt(maxRequestsPerDay),
        })
      );

      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
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

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Current Settings */}
              <motion.article className="group relative rounded-2xl border bg-card/20 text-card-foreground p-6 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-full">
                    Current Settings
                  </span>
                  <div className="text-muted-foreground transition-colors duration-200 group-hover:text-green-500">
                    <Palette size={20} />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-thin text-foreground mb-3 group-hover:text-primary transition-colors duration-200">
                    Current Settings
                  </h3>
                  <p className="text-sm font-thin text-muted-foreground mb-4">
                    Your chatbot configuration from the editor
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Name
                      </label>
                      <Input
                        value={chatbotConfig?.name || ""}
                        readOnly
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Theme
                      </label>
                      <Input value="modern" readOnly className="mt-1" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Primary Color
                      </label>
                      <div className="flex items-center space-x-2 mt-1">
                        <div
                          className="w-6 h-6 rounded border"
                          style={{
                            backgroundColor:
                              chatbotConfig?.userMsgColor || "#10b981",
                          }}
                        />
                        <Input
                          value={chatbotConfig?.userMsgColor || "#10b981"}
                          readOnly
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Background
                      </label>
                      <div className="flex items-center space-x-2 mt-1">
                        <div
                          className="w-6 h-6 rounded border"
                          style={{
                            backgroundColor:
                              chatbotConfig?.chatBgColor || "#ffffff",
                          }}
                        />
                        <Input
                          value={chatbotConfig?.chatBgColor || "#ffffff"}
                          readOnly
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Welcome Message
                    </label>
                    <Input
                      value="Hello! How can I help you today?"
                      readOnly
                      className="mt-1"
                    />
                  </div>
                </div>
              </motion.article>

              {/* Create Embed */}
              <motion.article className="group relative rounded-2xl border bg-card/20 text-card-foreground p-6 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-full">
                    Create Embed
                  </span>
                  <div className="text-muted-foreground transition-colors duration-200 group-hover:text-green-500">
                    <Zap size={20} />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-thin text-foreground mb-3 group-hover:text-primary transition-colors duration-200">
                    Generate Embed Code
                  </h3>
                  <p className="text-sm font-thin text-muted-foreground mb-4">
                    Generate a unique embed code for your chatbot
                  </p>
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Embed Name
                    </label>
                    <Input
                      value={embedName}
                      onChange={e => setEmbedName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Description
                    </label>
                    <Input value={description} readOnly className="mt-1" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Description is automatically set from your editor
                      configuration and cannot be changed here.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Max Requests/Hour
                      </label>
                      <Input
                        type="number"
                        value={maxRequestsPerHour}
                        onChange={e => setMaxRequestsPerHour(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Max Requests/Day
                      </label>
                      <Input
                        type="number"
                        value={maxRequestsPerDay}
                        onChange={e => setMaxRequestsPerDay(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleCreateEmbed}
                    disabled={isCreating || !chatbotConfig}
                    className="w-full"
                    variant="default"
                  >
                    {isCreating ? (
                      "Creating..."
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Create Embed
                      </>
                    )}
                  </Button>
                </div>
              </motion.article>

              {/* API Configuration */}
              <motion.article className="group relative rounded-2xl border bg-card/20 text-card-foreground p-6 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-full">
                    API Config
                  </span>
                  <div className="text-muted-foreground transition-colors duration-200 group-hover:text-green-500">
                    <Settings size={20} />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-thin text-foreground mb-3 group-hover:text-primary transition-colors duration-200">
                    API Configuration
                  </h3>
                  <p className="text-sm font-thin text-muted-foreground mb-4">
                    Your chatbot's API endpoint and configuration
                  </p>
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
                        onClick={() =>
                          copyToClipboard(
                            "https://lux-llm-prod.vercel.app/api/public-chat",
                            "api"
                          )
                        }
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
                    <pre className="bg-muted p-4 rounded text-xs font-mono">
                      {JSON.stringify(
                        {
                          message: "Hello",
                          embedCode: embedCode || "your-embed-code",
                          sessionId: "unique-session-id",
                        },
                        null,
                        2
                      )}
                    </pre>
                  </div>
                </div>
              </motion.article>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Script Embed */}
              <motion.article className="group relative rounded-2xl border bg-card/20 text-card-foreground p-6 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-full">
                    Script Embed
                  </span>
                  <div className="text-muted-foreground transition-colors duration-200 group-hover:text-green-500">
                    <Code size={20} />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-thin text-foreground mb-3 group-hover:text-primary transition-colors duration-200">
                    Script Embed
                  </h3>
                  <p className="text-sm font-thin text-muted-foreground mb-4">
                    Add this script tag to your website's HTML.
                  </p>
                  {embedCode ? (
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-lg border text-sm font-mono overflow-x-auto">
                        <code className="text-foreground">
                          {generateScriptEmbed()}
                        </code>
                      </pre>
                      <Button
                        onClick={() =>
                          copyToClipboard(generateScriptEmbed(), "script")
                        }
                        size="sm"
                        className="absolute top-2 right-2"
                        variant="outline"
                      >
                        {copied === "script" ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        {copied === "script" ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Code className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        Press "Create Embed" to generate your custom script tag
                      </p>
                      <div className="bg-muted p-4 rounded-lg border-2 border-dashed border-muted-foreground/20">
                        <p className="text-sm text-muted-foreground">
                          Your script embed will appear here after creating an
                          embed
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.article>

              {/* Iframe Embed */}
              <motion.article className="group relative rounded-2xl border bg-card/20 text-card-foreground p-6 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-full">
                    Iframe Embed
                  </span>
                  <div className="text-muted-foreground transition-colors duration-200 group-hover:text-green-500">
                    <Globe size={20} />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-thin text-foreground mb-3 group-hover:text-primary transition-colors duration-200">
                    Iframe Embed
                  </h3>
                  <p className="text-sm font-thin text-muted-foreground mb-4">
                    Embed the chatbot as an iframe element.
                  </p>
                  {embedCode ? (
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-lg border text-sm font-mono overflow-x-auto">
                        <code className="text-foreground">
                          {generateIframeEmbed()}
                        </code>
                      </pre>
                      <Button
                        onClick={() =>
                          copyToClipboard(generateIframeEmbed(), "iframe")
                        }
                        size="sm"
                        className="absolute top-2 right-2"
                        variant="outline"
                      >
                        {copied === "iframe" ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        {copied === "iframe" ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        Press "Create Embed" to generate your custom iframe code
                      </p>
                      <div className="bg-muted p-4 rounded-lg border-2 border-dashed border-muted-foreground/20">
                        <p className="text-sm text-muted-foreground">
                          Your iframe embed will appear here after creating an
                          embed
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.article>

              {/* See Live Demo */}
              <motion.article className="group relative rounded-2xl border bg-card/20 text-card-foreground p-6 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-full">
                    Live Demo
                  </span>
                  <div className="text-muted-foreground transition-colors duration-200 group-hover:text-green-500">
                    <Globe size={20} />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-thin text-foreground mb-3 group-hover:text-primary transition-colors duration-200">
                    See Live Demo
                  </h3>
                  <p className="text-sm font-thin text-muted-foreground mb-4">
                    See your chatbot working on a real demo website
                  </p>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Experience your chatbot in a real website environment.
                      This demo shows exactly how your chatbot will appear and
                      function when embedded on any website.
                    </p>
                    <Button
                      onClick={() => {
                        if (chatbotConfig) {
                          localStorage.setItem(
                            "exportChatbotConfig",
                            JSON.stringify(chatbotConfig)
                          );
                        }
                        window.open("/demo-website.html", "_blank");
                      }}
                      className="w-full"
                      variant="default"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      See Live Demo
                    </Button>
                  </div>
                </div>
              </motion.article>
            </div>
          </div>

          {/* Success Message - Appear after creating embed */}
          {embedCode && (
            <motion.article className="group relative rounded-2xl border bg-card/20 text-card-foreground p-6 shadow-sm hover:shadow-md transition mb-6 mt-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-full">
                  Success
                </span>
                <div className="text-muted-foreground transition-colors duration-200 group-hover:text-green-500">
                  <CheckCircle size={20} />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-thin text-foreground mb-3 group-hover:text-primary transition-colors duration-200">
                  Embed Created Successfully
                </h3>
                <p className="text-sm font-thin text-muted-foreground mb-4">
                  Your chatbot is now ready to be embedded on any website
                </p>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-foreground">
                    Embed created successfully! Your chatbot is ready to use.
                  </span>
                </div>
              </div>
            </motion.article>
          )}

          {/* Platform Integrations - Full Width at Bottom */}
          <motion.article className="group relative rounded-2xl border bg-card/20 text-card-foreground p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-full">
                Integrations
              </span>
              <div className="text-muted-foreground transition-colors duration-200 group-hover:text-green-500">
                <Users size={20} />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-thin text-foreground mb-3 group-hover:text-primary transition-colors duration-200">
                Platform Integrations
              </h3>
              <p className="text-sm font-thin text-muted-foreground mb-4">
                Choose your platform for detailed integration instructions
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    name: "WordPress",
                    type: "CMS",
                    difficulty: "Easy",
                  },
                  {
                    name: "Shopify",
                    type: "E-commerce",
                    difficulty: "Easy",
                  },
                  {
                    name: "Webflow",
                    type: "No-Code",
                    difficulty: "Easy",
                  },
                  {
                    name: "React",
                    type: "Framework",
                    difficulty: "Medium",
                  },
                  {
                    name: "Next.js",
                    type: "Framework",
                    difficulty: "Medium",
                  },
                  {
                    name: "Vue.js",
                    type: "Framework",
                    difficulty: "Medium",
                  },
                  {
                    name: "Angular",
                    type: "Framework",
                    difficulty: "Hard",
                  },
                  {
                    name: "HTML",
                    type: "Static",
                    difficulty: "Easy",
                  },
                  {
                    name: "Notion",
                    type: "No-Code",
                    difficulty: "Medium",
                  },
                  {
                    name: "Bubble",
                    type: "No-Code",
                    difficulty: "Easy",
                  },
                  {
                    name: "Framer",
                    type: "No-Code",
                    difficulty: "Easy",
                  },
                  {
                    name: "Squarespace",
                    type: "CMS",
                    difficulty: "Easy",
                  },
                  {
                    name: "Wix",
                    type: "No-Code",
                    difficulty: "Easy",
                  },
                  {
                    name: "Ghost",
                    type: "CMS",
                    difficulty: "Medium",
                  },
                  {
                    name: "Drupal",
                    type: "CMS",
                    difficulty: "Hard",
                  },
                  {
                    name: "Joomla",
                    type: "CMS",
                    difficulty: "Medium",
                  },
                  {
                    name: "Magento",
                    type: "E-commerce",
                    difficulty: "Hard",
                  },
                  {
                    name: "WooCommerce",
                    type: "E-commerce",
                    difficulty: "Medium",
                  },
                  {
                    name: "Svelte",
                    type: "Framework",
                    difficulty: "Medium",
                  },
                  {
                    name: "Nuxt.js",
                    type: "Framework",
                    difficulty: "Medium",
                  },
                ].map((platform, index) => (
                  <motion.article
                    key={platform.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                    onClick={() => setSelectedPlatform(platform)}
                    className="group relative rounded-2xl border bg-card/20 text-card-foreground p-6 shadow-sm hover:shadow-md transition cursor-pointer"
                  >
                    {/* Top badge and icon */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-full">
                        {platform.type}
                      </span>
                      <div className="text-xl text-muted-foreground transition-colors duration-200 group-hover:text-primary">
                        <Globe className="h-5 w-5" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-thin text-foreground mb-3 group-hover:text-primary transition-colors duration-200">
                      {platform.name}
                    </h3>

                    {/* Difficulty badge */}
                    <div className="mb-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          platform.difficulty === "Easy"
                            ? "bg-green-100 text-green-700"
                            : platform.difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {platform.difficulty}
                      </span>
                    </div>

                    {/* Action text */}
                    <p className="text-sm font-thin text-muted-foreground">
                      Click for integration guide
                    </p>
                  </motion.article>
                ))}
              </div>
            </div>
          </motion.article>

          {/* Integration Modal */}
          {selectedPlatform && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-background rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {selectedPlatform.name} Integration
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Step-by-step guide to integrate your chatbot with{" "}
                        {selectedPlatform.name}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedPlatform(null)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                      {selectedPlatform.type}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        selectedPlatform.difficulty === "Easy"
                          ? "bg-green-100 text-green-700"
                          : selectedPlatform.difficulty === "Medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {selectedPlatform.difficulty}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground flex items-center gap-2">
                      <Code size={16} />
                      Instructions
                    </h4>
                    <div className="space-y-3">
                      {getIntegrationInstructions(selectedPlatform.name).map(
                        (instruction, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center font-medium flex-shrink-0 mt-0.5">
                              {index + 1}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {instruction}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() =>
                        window.open(
                          getPlatformUrl(selectedPlatform.name),
                          "_blank"
                        )
                      }
                    >
                      <ExternalLink size={16} className="mr-2" />
                      Visit {selectedPlatform.name}
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => setSelectedPlatform(null)}
                    >
                      Start Integration
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
