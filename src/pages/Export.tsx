import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useAgentService } from "../hooks/agentService";
import { useEmbedService } from "../hooks/embedService";
import { useToast, toast } from "../hooks/use-toast";
import { useAuth } from "@clerk/clerk-react";
import Navigation from "../components/Navigation";
import { AppSidebar } from "../components/layout/AppSidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Code,
  Globe,
  ExternalLink,
  Copy,
  Check,
  Loader2,
  Settings,
  Download,
  Eye,
} from "lucide-react";
import { integrations } from "../lib/integrations";
import {
  generateEmbedScript,
  generateEmbedHTML,
  generateIframeEmbed,
  generateIntegrationInstructions,
} from "../lib/scriptGenerator";
import { ChatbotConfig } from "../components/chatbot-preview";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  instructions: string[];
}

export default function Export() {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getAgentsByUser, createAgent } = useAgentService();
  const { createEmbed } = useEmbedService();

  // Get platform logo URLs
  const getPlatformLogo = (platformName: string): string => {
    const logoMap: { [key: string]: string } = {
      WordPress: "https://logo.clearbit.com/wordpress.com",
      Shopify: "https://logo.clearbit.com/shopify.com",
      Wix: "https://logo.clearbit.com/wix.com",
      Squarespace: "https://logo.clearbit.com/squarespace.com",
      GoDaddy: "https://logo.clearbit.com/godaddy.com",
      "Google Sites": "https://logo.clearbit.com/sites.google.com",
      Joomla: "https://logo.clearbit.com/joomla.org",
      Drupal: "https://logo.clearbit.com/drupal.org",
      BigCommerce: "https://logo.clearbit.com/bigcommerce.com",
      Weebly: "https://logo.clearbit.com/weebly.com",
      Unbounce: "https://logo.clearbit.com/unbounce.com",
      Framer: "https://logo.clearbit.com/framer.com",
      Duda: "https://logo.clearbit.com/duda.co",
      Ghost: "https://logo.clearbit.com/ghost.org",
      Blogger: "https://logo.clearbit.com/blogger.com",
      Tumblr: "https://logo.clearbit.com/tumblr.com",
      Yola: "https://logo.clearbit.com/yola.com",
      Cargo: "https://logo.clearbit.com/cargo.site",
      Piwigo: "https://logo.clearbit.com/piwigo.org",
      LiveJournal: "https://logo.clearbit.com/livejournal.com",
      Jigsy: "https://logo.clearbit.com/jigsy.com",
      "IM Creator": "https://logo.clearbit.com/imcreator.com",
    };
    return logoMap[platformName] || "";
  };

  // Secure access control - only allow access from authorized sources
  const [agent, setAgent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedIntegration, setSelectedIntegration] =
    useState<Integration | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [embedCode, setEmbedCode] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  const [embedHtml, setEmbedHtml] = useState("");
  const [embedIframe, setEmbedIframe] = useState("");
  const [embedConfig, setEmbedConfig] = useState<ChatbotConfig | null>(null);
  const [isCreatingEmbed, setIsCreatingEmbed] = useState(false);
  const [embedName, setEmbedName] = useState("");
  const [embedDescription, setEmbedDescription] = useState("");
  const [maxRequestsPerHour, setMaxRequestsPerHour] = useState(100);
  const [maxRequestsPerDay, setMaxRequestsPerDay] = useState(1000);

  // Add loading guard to prevent multiple simultaneous calls
  const [isLoadingAgents, setIsLoadingAgents] = useState(false);

  // Add ref to prevent multiple data loads
  const hasLoadedData = useRef(false);

  // Add authentication check
  const { isSignedIn, isLoaded } = useAuth();

  // Debug authentication state
  console.log("Export page: Authentication state:", { isLoaded, isSignedIn });

  // Debug effect to monitor agent state changes
  useEffect(() => {
    console.log("Export page: Agent state changed to:", agent);
  }, [agent]);

  useEffect(() => {
    // Use ref to prevent multiple executions
    if (hasLoadedData.current) {
      console.log("Export page: useEffect blocked - data already loaded");
      return;
    }

    let isMounted = true;
    setLoading(true);

    const loadData = async () => {
      try {
        console.log("Export page: Starting to load data...");
        console.log("Export page: agentId =", agentId);

        // Check authentication first
        if (!isLoaded) {
          console.log("Export page: Clerk still loading, waiting...");
          return;
        }

        if (!isSignedIn) {
          console.log(
            "Export page: User not authenticated, redirecting to sign in..."
          );
          if (isMounted) {
            setLoading(false);
            navigate("/auth/sign-in");
          }
          return;
        }

        // Check if we have preview data from the editor
        const previewData = localStorage.getItem("chatbotPreviewData");
        console.log("Export page: previewData exists =", !!previewData);

        if (previewData) {
          // Preview mode - use data from editor
          try {
            const parsedData = JSON.parse(previewData);
            console.log("Export page: Parsed preview data:", parsedData);
            if (isMounted) {
              setAgent(parsedData);
              setIsPreviewMode(true);
              setLoading(false);
              hasLoadedData.current = true; // Mark as loaded
            }
            return;
          } catch (parseError) {
            console.error("Error parsing preview data:", parseError);
            localStorage.removeItem("chatbotPreviewData");
          }
        }

        if (agentId) {
          // Load specific agent
          try {
            console.log("Export page: Loading agent with ID:", agentId);

            // Prevent multiple simultaneous calls
            if (isLoadingAgents) {
              console.log("Export page: Already loading agents, skipping...");
              return;
            }

            setIsLoadingAgents(true);
            console.log("Export page: About to call getAgentsByUser()...");

            // Add timeout for getAgentsByUser call
            const agentsPromise = getAgentsByUser();
            const timeoutPromise = new Promise<never>((_, reject) =>
              setTimeout(
                () =>
                  reject(new Error("getAgentsByUser timeout after 15 seconds")),
                15000
              )
            );

            const result = await Promise.race([agentsPromise, timeoutPromise]);
            const { data: agents, error } = result;
            console.log("Export page: getAgentsByUser() completed!");
            console.log("Export page: Agents response:", { agents, error });

            if (error || !agents) {
              console.log("Export page: Error or no agents, throwing error");
              throw new Error(error || "Failed to load agents");
            }

            // Debug: Log all agent IDs to see what we have
            console.log(
              "Export page: Available agent IDs:",
              agents.map((a: any) => a.id)
            );
            console.log("Export page: Looking for agent ID:", agentId);

            const foundAgent = agents.find((a: any) => a.id === agentId);
            console.log("Export page: Found agent:", foundAgent);

            if (foundAgent) {
              console.log("Export page: Setting agent and stopping loading");
              setAgent(foundAgent);
              setLoading(false);
              hasLoadedData.current = true; // Mark as loaded
              console.log("Export page: About to return from loadData");
              return; // This should stop execution here
            } else {
              console.log(
                "Export page: Agent not found in the list - this will cause infinite loading!"
              );
              // Force stop loading and show error
              if (isMounted) {
                setLoading(false);

                // Show the first available agent as a fallback
                if (agents && agents.length > 0) {
                  console.log(
                    "Export page: Using first available agent as fallback"
                  );
                  setAgent(agents[0]);
                  toast({
                    title: "Agent Not Found",
                    description: `Agent with ID ${agentId} was not found. Showing first available agent instead.`,
                    variant: "default",
                  });
                } else {
                  toast({
                    title: "Agent Not Found",
                    description: `Agent with ID ${agentId} was not found in your agents list.`,
                    variant: "destructive",
                  });
                }
              }
              return;
            }
          } catch (agentError) {
            console.error("Export page: Error loading agent:", agentError);
            if (isMounted) {
              setLoading(false);
              toast({
                title: "Error",
                description: `Failed to load agents: ${agentError.message}`,
                variant: "destructive",
              });
            }
          } finally {
            // Always reset the loading guard
            if (isMounted) {
              setIsLoadingAgents(false);
            }
          }
        }

        // Only reach here if no agent was found
        console.log("Export page: No agent found, showing message");
        if (isMounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error loading agent data:", error);
        if (isMounted) {
          setLoading(false);
          toast({
            title: "Error",
            description: "Failed to load chatbot data",
            variant: "destructive",
          });
        }
      }
    };

    loadData();

    // Add a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (isMounted && loading) {
        console.log(
          "Export page: Loading timeout reached, forcing loading to false"
        );
        setLoading(false);
        toast({
          title: "Warning",
          description: "Loading took too long. Please refresh the page.",
          variant: "destructive",
        });
      }
    }, 10000); // 10 second timeout

    // Cleanup function
    return () => {
      isMounted = false;
      clearTimeout(timeout);
      if (isPreviewMode) {
        localStorage.removeItem("chatbotPreviewData");
      }
    };
  }, []); // Empty dependency array - only run once

  // Generate simple single-line embed code
  const generateEmbedCode = () => {
    if (!agent) return "";
    return `<script src="https://lux-llm-prod.vercel.app/embed/${agent.id}.js"></script>`;
  };

  // Create embed function
  const handleCreateEmbed = async () => {
    if (!agent) {
      toast({
        title: "Error",
        description: "No agent selected",
        variant: "destructive",
      });
      return;
    }

    if (!embedName.trim()) {
      toast({
        title: "Error",
        description: "Please enter an embed name",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingEmbed(true);
    try {
      let finalAgentId = agent.id;
      let finalAgent = agent;

      // Check if we're in preview mode (agent ID starts with 'preview-')
      if (isPreviewMode && agent.id.startsWith('preview-')) {
        console.log("Export page: Preview mode detected, creating real agent first...");
        
        // Create a real agent from the preview data
        const agentData = {
          name: agent.name || "My Chatbot",
          avatar_url: agent.avatar_url,
          heading: agent.heading,
          subheading: agent.subheading,
          system_prompt: agent.system_prompt || "You are a helpful AI assistant.",
          chat_bg_color: agent.chat_bg_color || "#ffffff",
          chat_border_color: agent.chat_border_color || "#e5e7eb",
          user_msg_color: agent.user_msg_color || "#3b82f6",
          bot_msg_color: agent.bot_msg_color || "#1f2937",
          chat_name: agent.chat_name || agent.name || "My Chatbot",
        };

        const { data: newAgent, error: agentError } = await createAgent(agentData);
        
        if (agentError || !newAgent) {
          throw new Error(`Failed to create agent: ${agentError || "Unknown error"}`);
        }

        console.log("Export page: Real agent created:", newAgent);
        finalAgentId = newAgent.id;
        finalAgent = newAgent;
        
        // Update the agent state to use the real agent
        setAgent(newAgent);
        setIsPreviewMode(false);
        
        // Clear the preview data from localStorage
        localStorage.removeItem("chatbotPreviewData");
        
        toast({
          title: "Agent Created",
          description: "Your agent has been saved and is now ready for embedding!",
        });
      }

      // Now create the embed with the real agent ID
      const { data: embed, error } = await createEmbed({
        agentId: finalAgentId,
        name: embedName || finalAgent.name,
        description: embedDescription,
        maxRequestsPerHour,
        maxRequestsPerDay,
      });

      if (error) {
        throw new Error(error);
      }

      // Generate embed script
      const generatedScript = await generateEmbedScript({
        embedCode: embed.embed_code,
        chatbotName: embed.name,
        systemPrompt: finalAgent.system_prompt || "You are a helpful AI assistant.",
        config: embedConfig,
      });

      // Update state
      setEmbedCode(embed.embed_code);
      setEmbedUrl(
        `https://lux-llm-prod.vercel.app/api/embed/${embed.embed_code}.js`
      );
      setEmbedHtml(generateEmbedHTML(embed.embed_code));
      setEmbedIframe(generateIframeEmbed(embed.embed_code));

      toast({
        title: "Success",
        description: "Embed created successfully!",
      });
    } catch (error) {
      console.error("Error creating embed:", error);
      toast({
        title: "Error",
        description:
          "Failed to create embed: " +
          (error instanceof Error ? error.message : "Unknown error"),
        variant: "destructive",
      });
    } finally {
      setIsCreatingEmbed(false);
    }
  };

  // Initialize embed config from agent data
  useEffect(() => {
    if (agent && !embedConfig) {
      setEmbedConfig({
        name: agent.name || "My Chatbot",
        theme: "light",
        primaryColor: "#3b82f6",
        accentColor: "#e5e7eb",
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
        borderRadius: 12,
        fontSize: 14,
        fontFamily: "Inter",
        position: "bottom-right",
        welcomeMessage: "Hello! How can I help you today?",
        systemPrompt: agent.system_prompt || "You are a helpful AI assistant.",
        placeholder: "Type your message...",
        avatar: agent.avatar_url || "",
        showTypingIndicator: true,
        enableSounds: false,
        animationSpeed: "normal",
      });
      setEmbedName(agent.name || "My Chatbot");
    }
  }, [agent, embedConfig]);

  // Copy to clipboard
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Success",
        description: `${type} copied to clipboard!`,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a]">
        <Navigation />
        <div className="flex">
          <AppSidebar />
          <div className="flex-1 p-8">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#00ff00] to-[#00cc00] rounded-full flex items-center justify-center mx-auto mb-8 shadow-glow-lg">
                  <Loader2 className="h-10 w-10 animate-spin text-black" />
                </div>
                <h2 className="text-2xl font-light text-white mb-4 tracking-tight">
                  {!isLoaded
                    ? "Loading Authentication"
                    : !isSignedIn
                    ? "Checking Access"
                    : "Loading Chatbot Data"}
                </h2>
                <p className="text-gray-400 text-lg mb-6 font-light">
                  {!isLoaded
                    ? "Please wait while we verify your account..."
                    : !isSignedIn
                    ? "Verifying your authentication status..."
                    : "Preparing your chatbot export..."}
                </p>
                {!isSignedIn && isLoaded && (
                  <div className="mt-6">
                    <Button
                      onClick={() => navigate("/auth/sign-in")}
                      className="bg-gradient-to-r from-[#00ff00] to-[#00cc00] hover:from-[#00cc00] hover:to-[#00ff00] text-black px-8 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105 shadow-glow-lg"
                    >
                      Sign In
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Debug logging for agent state
  console.log("Export page: Current agent state:", agent);
  console.log("Export page: Current loading state:", loading);

  // No agent found - show a helpful message instead of returning null
  if (!agent) {
    console.log("Export page: Rendering 'No Chatbot Found' message");
    return (
      <div className="min-h-screen bg-[#1a1a1a]">
        <Navigation />
        <div className="flex">
          <AppSidebar />
          <div className="flex-1 p-8">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#00ff00] to-[#00cc00] rounded-full flex items-center justify-center mx-auto mb-8 shadow-glow-lg">
                  <Code className="h-10 w-10 text-black" />
                </div>
                <h2 className="text-3xl font-light text-white mb-6 tracking-tight">
                  No Chatbot Found
                </h2>
                <p className="text-gray-400 text-lg mb-8 max-w-lg font-light leading-relaxed">
                  Please create a chatbot first or select one from My Agents to
                  export.
                </p>
                <Button
                  onClick={() => navigate("/build/templates")}
                  className="bg-gradient-to-r from-[#00ff00] to-[#00cc00] hover:from-[#00cc00] hover:to-[#00ff00] text-black px-8 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105 shadow-glow-lg"
                >
                  Go to Templates
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <Navigation />
      <div className="flex">
        <AppSidebar />
        <div className="flex-1 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex items-center justify-center gap-4 mb-8"
              >
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-[#00ff00] to-[#00cc00] rounded-3xl flex items-center justify-center shadow-glow-lg"
                  whileHover={{ scale: 1.02, rotate: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  <Code className="h-8 w-8 text-black" />
                </motion.div>
                <motion.h1
                  className="text-5xl font-light text-white tracking-tight"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                >
                  Export{" "}
                  <span className="text-[#00ff00] font-normal">Chatbot</span>
                </motion.h1>
                {isPreviewMode && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    <Badge
                      variant="secondary"
                      className="ml-6 bg-[#00ff00]/10 text-[#00ff00] border-[#00ff00]/20 backdrop-blur-sm"
                    >
                      Preview Mode
                    </Badge>
                  </motion.div>
                )}
              </motion.div>
              <motion.p
                className="text-lg text-gray-400 max-w-xl mx-auto leading-relaxed font-light"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              >
                Seamlessly integrate your AI chatbot into any website with our
                elegant embed solutions.
              </motion.p>
            </div>

            {/* Chatbot Preview */}
            <Card className="mb-16 border-0 bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] rounded-3xl overflow-hidden">
              <CardContent className="p-16">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#00ff00] to-[#00cc00] rounded-full flex items-center justify-center mx-auto mb-8 shadow-glow-lg">
                    <Globe className="h-12 w-12 text-black" />
                  </div>
                  <h3 className="text-3xl font-light text-white mb-4 tracking-tight">
                    Chatbot{" "}
                    <span className="text-[#00ff00] font-normal">Preview</span>
                  </h3>
                  <p className="text-gray-400 text-lg leading-relaxed max-w-lg mx-auto font-light">
                    Your customized "{agent.name}" chatbot will appear
                    seamlessly on any website where you embed the code below.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Embed Creation Form */}
            <Card className="mb-16 border-0 bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] rounded-3xl overflow-hidden">
              <CardHeader className="pb-8">
                <CardTitle className="flex items-center gap-4 text-2xl font-light text-white tracking-tight">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#00ff00] to-[#00cc00] rounded-xl flex items-center justify-center shadow-glow">
                    <Settings className="h-5 w-5 text-black" />
                  </div>
                  Create{" "}
                  <span className="text-[#00ff00] font-normal">Embed</span>
                </CardTitle>
                <p className="text-gray-400 font-light text-lg leading-relaxed">
                  Configure your chatbot embed settings and generate the code to
                  integrate it into any website.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Basic Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label
                        htmlFor="embedName"
                        className="text-white text-sm font-medium"
                      >
                        Embed Name
                      </Label>
                      <Input
                        id="embedName"
                        value={embedName}
                        onChange={e => setEmbedName(e.target.value)}
                        placeholder="My Website Chatbot"
                        className="mt-2 bg-[#1a1a1a] border-[#333] text-white placeholder:text-gray-500"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="embedDescription"
                        className="text-white text-sm font-medium"
                      >
                        Description (Optional)
                      </Label>
                      <Input
                        id="embedDescription"
                        value={embedDescription}
                        onChange={e => setEmbedDescription(e.target.value)}
                        placeholder="Customer support chatbot for my website"
                        className="mt-2 bg-[#1a1a1a] border-[#333] text-white placeholder:text-gray-500"
                      />
                    </div>
                  </div>

                  {/* Preview Mode Warning */}
                  {isPreviewMode && (
                    <div className="bg-gradient-to-r from-[#ff6b35] to-[#f7931e] rounded-2xl p-4 border border-[#ff6b35]/30">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                          <span className="text-[#ff6b35] text-sm font-bold">!</span>
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">
                            Preview Mode Active
                          </p>
                          <p className="text-white/90 text-xs">
                            You're working with a preview agent. When you create an embed, we'll automatically save your agent first, then create the embed.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Rate Limiting */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label
                        htmlFor="maxRequestsPerHour"
                        className="text-white text-sm font-medium"
                      >
                        Max Requests per Hour
                      </Label>
                      <Input
                        id="maxRequestsPerHour"
                        type="number"
                        value={maxRequestsPerHour}
                        onChange={e =>
                          setMaxRequestsPerHour(parseInt(e.target.value) || 100)
                        }
                        min="10"
                        max="1000"
                        className="mt-2 bg-[#1a1a1a] border-[#333] text-white"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="maxRequestsPerDay"
                        className="text-white text-sm font-medium"
                      >
                        Max Requests per Day
                      </Label>
                      <Input
                        id="maxRequestsPerDay"
                        type="number"
                        value={maxRequestsPerDay}
                        onChange={e =>
                          setMaxRequestsPerDay(parseInt(e.target.value) || 1000)
                        }
                        min="100"
                        max="10000"
                        className="mt-2 bg-[#1a1a1a] border-[#333] text-white"
                      />
                    </div>
                  </div>

                  {/* Create Embed Button */}
                  <div className="text-center pt-4">
                    <Button
                      onClick={handleCreateEmbed}
                      disabled={isCreatingEmbed || !embedConfig}
                      size="lg"
                      className="bg-gradient-to-r from-[#00ff00] to-[#00cc00] hover:from-[#00cc00] hover:to-[#00ff00] text-black px-12 py-4 font-medium rounded-2xl transition-all duration-300 hover:scale-105 shadow-glow-lg hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCreatingEmbed ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                          Creating Embed...
                        </>
                      ) : (
                        <>
                          <Settings className="h-5 w-5 mr-3" />
                          Create Embed
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generated Embed Codes */}
            {embedCode && (
              <>
                {/* Script Embed */}
                <Card className="mb-8 border-0 bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] rounded-3xl overflow-hidden">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3 text-xl font-light text-white tracking-tight">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#00ff00] to-[#00cc00] rounded-lg flex items-center justify-center shadow-glow">
                        <Code className="h-4 w-4 text-black" />
                      </div>
                      Script{" "}
                      <span className="text-[#00ff00] font-normal">Embed</span>
                    </CardTitle>
                    <p className="text-gray-400 font-light text-sm leading-relaxed">
                      Add this script tag to your website's HTML head or before
                      the closing body tag.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-6 border border-[#333]/30">
                      <div className="flex items-center justify-between">
                        <pre className="bg-[#0a0a0a] text-[#00ff00] px-4 py-3 rounded-xl overflow-x-auto text-sm font-mono flex-1 mr-4 border border-[#333]/50 font-light">
                          <code>{embedHtml}</code>
                        </pre>
                        <Button
                          onClick={() =>
                            copyToClipboard(embedHtml, "Script embed code")
                          }
                          size="sm"
                          className="bg-gradient-to-r from-[#00ff00] to-[#00cc00] hover:from-[#00cc00] hover:to-[#00ff00] text-black px-4 py-2 whitespace-nowrap font-medium rounded-xl transition-all duration-300 hover:scale-105 shadow-glow-lg"
                        >
                          {copied ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Iframe Embed */}
                <Card className="mb-8 border-0 bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] rounded-3xl overflow-hidden">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3 text-xl font-light text-white tracking-tight">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#00ff00] to-[#00cc00] rounded-lg flex items-center justify-center shadow-glow">
                        <Globe className="h-4 w-4 text-black" />
                      </div>
                      Iframe{" "}
                      <span className="text-[#00ff00] font-normal">Embed</span>
                    </CardTitle>
                    <p className="text-gray-400 font-light text-sm leading-relaxed">
                      Use this iframe code for platforms that don't support
                      custom JavaScript.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-6 border border-[#333]/30">
                      <div className="flex items-center justify-between">
                        <pre className="bg-[#0a0a0a] text-[#00ff00] px-4 py-3 rounded-xl overflow-x-auto text-sm font-mono flex-1 mr-4 border border-[#333]/50 font-light">
                          <code>{embedIframe}</code>
                        </pre>
                        <Button
                          onClick={() =>
                            copyToClipboard(embedIframe, "Iframe embed code")
                          }
                          size="sm"
                          className="bg-gradient-to-r from-[#00ff00] to-[#00cc00] hover:from-[#00cc00] hover:to-[#00ff00] text-black px-4 py-2 whitespace-nowrap font-medium rounded-xl transition-all duration-300 hover:scale-105 shadow-glow-lg"
                        >
                          {copied ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Preview and Test */}
                <Card className="mb-16 border-0 bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] rounded-3xl overflow-hidden">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3 text-xl font-light text-white tracking-tight">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#00ff00] to-[#00cc00] rounded-lg flex items-center justify-center shadow-glow">
                        <Eye className="h-4 w-4 text-black" />
                      </div>
                      Test{" "}
                      <span className="text-[#00ff00] font-normal">
                        Your Embed
                      </span>
                    </CardTitle>
                    <p className="text-gray-400 font-light text-sm leading-relaxed">
                      Test your chatbot embed before adding it to your website.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-6 border border-[#333]/30">
                      <div className="text-center space-y-4">
                        <p className="text-gray-400 text-sm">
                          Your embed code:{" "}
                          <code className="bg-[#0a0a0a] text-[#00ff00] px-2 py-1 rounded text-xs border border-[#333]/50">
                            {embedCode}
                          </code>
                        </p>
                        <div className="flex gap-4 justify-center">
                          <Button
                            onClick={() =>
                              window.open(
                                `https://lux-llm-prod.vercel.app/embed/${embedCode}`,
                                "_blank"
                              )
                            }
                            variant="outline"
                            className="border-[#00ff00] text-[#00ff00] hover:bg-[#00ff00] hover:text-black transition-all duration-300"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Preview Embed
                          </Button>
                          <Button
                            onClick={() =>
                              copyToClipboard(embedCode, "Embed code")
                            }
                            variant="outline"
                            className="border-[#00ff00] text-[#00ff00] hover:bg-[#00ff00] hover:text-black transition-all duration-300"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Embed Code
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* API Configuration Note */}
            <Card className="mb-16 border-0 bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] rounded-3xl overflow-hidden">
              <CardHeader className="pb-8">
                <CardTitle className="flex items-center gap-4 text-2xl font-light text-white tracking-tight">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#00ff00] to-[#00cc00] rounded-xl flex items-center justify-center shadow-glow">
                    <ExternalLink className="h-5 w-5 text-black" />
                  </div>
                  API{" "}
                  <span className="text-[#00ff00] font-normal">
                    Configuration
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-8 border border-[#333]/30">
                  <p className="text-gray-400 leading-relaxed text-lg font-light">
                    <strong className="text-[#00ff00] font-normal">
                      Important:
                    </strong>{" "}
                    The generated embed code includes a call to{" "}
                    <code className="bg-[#0a0a0a] text-[#00ff00] px-3 py-2 rounded-lg font-mono text-sm border border-[#333]/50 font-light">
                      https://lux-llm-prod.vercel.app/api/public-chat
                    </code>
                    . This endpoint handles all chat requests from embedded
                    chatbots and uses your AI API key to provide responses. The
                    system automatically tracks usage, prevents abuse, and
                    stores conversations for analytics.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Integration Cards */}
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light text-white mb-6 tracking-tight">
                Platform{" "}
                <span className="text-[#00ff00] font-normal">Integrations</span>
              </h2>
              <p className="text-gray-400 text-lg font-light max-w-2xl mx-auto leading-relaxed">
                Get step-by-step instructions for embedding your chatbot on
                popular platforms and content management systems.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {integrations.map(integration => (
                <Card
                  key={integration.name}
                  className="group hover:scale-[1.02] transition-all duration-500 cursor-pointer border-0 bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] hover:from-[#2f2f2f] hover:to-[#252525] rounded-3xl overflow-hidden shadow-lg hover:shadow-glow-lg"
                  onClick={() => {
                    setSelectedIntegration(integration);
                    setIsModalOpen(true);
                  }}
                >
                  <CardContent className="p-10">
                    <div className="flex items-center gap-8">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl flex items-center justify-center group-hover:from-[#00ff00] group-hover:to-[#00cc00] transition-all duration-500 shadow-glow">
                        <img
                          src={getPlatformLogo(integration.name)}
                          alt={`${integration.name} logo`}
                          className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300"
                          onError={e => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.style.display = "none";
                            const nextElement =
                              target.nextElementSibling as HTMLElement;
                            if (nextElement)
                              nextElement.style.display = "block";
                          }}
                        />
                        <span className="text-3xl hidden text-black font-bold">
                          {integration.icon}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-light text-white mb-3 tracking-tight">
                          {integration.name}
                        </h3>
                        <p className="text-gray-400 leading-relaxed text-lg font-light">
                          {integration.description}
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#00ff00] to-[#00cc00] rounded-full flex items-center justify-center shadow-glow-lg group-hover:scale-110 transition-transform duration-300">
                          <svg
                            className="w-6 h-6 text-black"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Integration Modal */}
      {isModalOpen && selectedIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2a2a2a] rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-[#333]">
            <div className="p-6 border-b border-[#333]">
              <div className="flex items-center gap-3">
                <img
                  src={getPlatformLogo(selectedIntegration.name)}
                  alt={`${selectedIntegration.name} logo`}
                  className="w-8 h-8 object-contain"
                  onError={e => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = "none";
                    const nextElement =
                      target.nextElementSibling as HTMLElement;
                    if (nextElement) nextElement.style.display = "block";
                  }}
                />
                <span className="text-2xl hidden">
                  {selectedIntegration.icon}
                </span>
                <h3 className="text-xl font-semibold text-white">
                  {selectedIntegration.name}{" "}
                  <span className="text-[#00ff00]">Integration</span>
                </h3>
              </div>
            </div>
            <div className="p-6">
              <div className="prose prose-gray max-w-none">
                <ol className="list-decimal list-inside space-y-2">
                  {selectedIntegration.instructions.map(
                    (instruction, index) => (
                      <li key={index} className="text-gray-300">
                        {instruction}
                      </li>
                    )
                  )}
                </ol>
              </div>
            </div>
            <div className="p-6 border-t border-[#333] flex justify-end">
              <Button
                onClick={() => setIsModalOpen(false)}
                variant="outline"
                className="border-[#333] text-gray-300 hover:bg-[#1a1a1a] hover:text-white"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
