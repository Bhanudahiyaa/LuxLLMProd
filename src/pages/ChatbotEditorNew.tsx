import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { motion, AnimatePresence } from "framer-motion";
import { ChatbotPreview } from "@/components/chatbot-preview";
import { SettingsPanel } from "@/components/settings-panel";
import { TemplateGallery } from "@/components/template-gallery";
import { AnimatedBackground } from "@/components/animated-background";
import { LoadingSpinner } from "@/components/loading-spinner";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useToast } from "@/hooks/use-toast";
import { Sparkles, Zap } from "lucide-react";
import type { ChatbotTemplate } from "@/lib/templates";
import {
  Upload,
  Save,
  Code,
  MessageCircle,
  Palette,
  User,
  Bot,
  ArrowLeft,
  Download,
  Send,
  Moon,
  Sun,
  Copy,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatbotSettingsService } from "@/hooks/chatbotSettingsService";
import { useAgentService } from "@/hooks/agentService";
import { chatWithAgent } from "@/api/chat";

// Types
interface ChatbotFormData {
  name: string;
  avatar_url: string;
  chat_bg: string;
  border_color: string;
  user_msg_color: string;
  bot_msg_color: string;
  system_prompt: string;
}

interface Agent {
  id: string;
  name: string;
  heading?: string;
  subheading?: string;
  avatar_url?: string;
  system_prompt: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatbotEditor() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const agentId = searchParams.get("agentId");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Chat functionality
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const { getChatbotSettings, saveChatbotSettings } =
    useChatbotSettingsService();
  const { getAgentsByUser, updateAgent } = useAgentService();

  // Form setup with default values
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ChatbotFormData>({
    defaultValues: {
      name: "My Chatbot",
      avatar_url: "",
      chat_bg: "#ffffff",
      border_color: "#e5e7eb",
      user_msg_color: "#3b82f6",
      bot_msg_color: "#f3f4f6",
      system_prompt: "You are a helpful assistant.",
    },
    mode: "onChange",
  });

  // Watch form values for live preview
  const chatBg = watch("chat_bg");
  const borderColor = watch("border_color");
  const userMsgColor = watch("user_msg_color");
  const botMsgColor = watch("bot_msg_color");
  const chatName = watch("name");
  const avatarUrl = watch("avatar_url");
  const systemPrompt = watch("system_prompt");

  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "Hello! How can I help you today?",
        timestamp: new Date(),
      },
    ]);
  }, []);

  // Load agent data if agentId is provided
  useEffect(() => {
    const loadAgentData = async () => {
      if (!agentId) {
        // No agent ID, load saved chatbot settings if any
        try {
          const { data: settings, error } = await getChatbotSettings();
          if (!error && settings) {
            // Use reset to set all values at once to prevent re-renders
            reset({
              name: settings.name,
              avatar_url: settings.avatar_url || "",
              chat_bg: settings.chat_bg,
              border_color: settings.border_color,
              user_msg_color: settings.user_msg_color,
              bot_msg_color: settings.bot_msg_color,
              system_prompt: settings.system_prompt,
            });
          }
        } catch (error) {
          console.error("Error loading settings:", error);
        }
        setLoading(false);
        return;
      }

      // Load agent data
      try {
        const { data: agents, error } = await getAgentsByUser();
        if (error) throw new Error(error);

        const foundAgent = agents?.find(a => a.id === agentId);
        if (!foundAgent) {
          toast.error("Agent not found");
          navigate("/build");
          return;
        }

        setAgent(foundAgent);

        // Load existing UI customization settings first
        let uiSettings = {
          chat_bg: "#ffffff",
          border_color: "#e5e7eb",
          user_msg_color: "#3b82f6",
          bot_msg_color: "#f3f4f6",
        };

        try {
          const { data: settings } = await getChatbotSettings();
          if (settings) {
            uiSettings = {
              chat_bg: settings.chat_bg,
              border_color: settings.border_color,
              user_msg_color: settings.user_msg_color,
              bot_msg_color: settings.bot_msg_color,
            };
          }
        } catch (settingsError) {
          console.error("Error loading UI settings:", settingsError);
        }

        // Set all form values at once using reset
        reset({
          name: foundAgent.name,
          avatar_url: foundAgent.avatar_url || "",
          system_prompt: foundAgent.system_prompt,
          ...uiSettings,
        });
      } catch (error) {
        console.error("Error loading agent:", error);
        toast.error("Failed to load agent");
        navigate("/build");
      } finally {
        setLoading(false);
      }
    };

    loadAgentData();
  }, [agentId, getChatbotSettings, getAgentsByUser, navigate, reset]);

  // Send message function
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await chatWithAgent({
        system_prompt: systemPrompt,
        message: inputMessage,
        agentId: agentId || "default",
      });

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.message,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I apologize, but I'm experiencing some technical difficulties. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Save chatbot settings
  const onSubmit = async (data: ChatbotFormData) => {
    setSaving(true);
    try {
      // Save UI customization settings
      const { error: settingsError } = await saveChatbotSettings(data);
      if (settingsError) {
        toast.error("Failed to save settings: " + settingsError);
        return;
      }

      // If we have an agent, update it with the new avatar
      if (agent && agentId) {
        const { error: agentError } = await updateAgent(agentId, {
          ...agent,
          avatar_url: data.avatar_url,
        } as any);
        if (agentError) {
          toast.error("Failed to update agent: " + agentError);
          return;
        }
      }

      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  // Generate export code
  const generateExportCode = () => {
    const embedCode = `
<!-- Chatbot Widget -->
<div id="chatbot-widget" style="
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 350px;
  height: 500px;
  background: ${chatBg};
  border: 2px solid ${borderColor};
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  font-family: system-ui, -apple-system, sans-serif;
  z-index: 1000;
">
  <div style="
    padding: 16px;
    border-bottom: 1px solid ${borderColor};
    display: flex;
    align-items: center;
    gap: 8px;
  ">
    ${
      avatarUrl
        ? `<img src="${avatarUrl}" alt="Avatar" style="width: 32px; height: 32px; border-radius: 50%;">`
        : '<div style="width: 32px; height: 32px; border-radius: 50%; background: #e5e7eb; display: flex; align-items: center; justify-content: center; font-size: 14px;">🤖</div>'
    }
    <h3 style="margin: 0; font-size: 16px; font-weight: 600;">${chatName}</h3>
  </div>
  <div id="chat-messages" style="
    height: 380px;
    padding: 16px;
    overflow-y: auto;
  ">
    <div style="
      background: ${botMsgColor};
      padding: 8px 12px;
      border-radius: 8px;
      margin-bottom: 8px;
      max-width: 80%;
    ">
      Hello! How can I help you today?
    </div>
  </div>
  <div style="
    padding: 16px;
    border-top: 1px solid ${borderColor};
  ">
    <div style="display: flex; gap: 8px;">
      <input type="text" placeholder="Type your message..." style="
        flex: 1;
        padding: 8px 12px;
        border: 1px solid ${borderColor};
        border-radius: 6px;
        outline: none;
      ">
      <button style="
        background: ${userMsgColor};
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 6px;
        cursor: pointer;
      ">Send</button>
    </div>
  </div>
</div>

<script>
// Basic chatbot functionality
document.addEventListener('DOMContentLoaded', function() {
  const input = document.querySelector('#chatbot-widget input');
  const button = document.querySelector('#chatbot-widget button');
  const messages = document.getElementById('chat-messages');
  
  function addMessage(text, isUser = false) {
    const div = document.createElement('div');
    div.style.cssText = \`
      background: \${isUser ? '${userMsgColor}' : '${botMsgColor}'};
      color: \${isUser ? 'white' : 'black'};
      padding: 8px 12px;
      border-radius: 8px;
      margin-bottom: 8px;
      max-width: 80%;
      margin-left: \${isUser ? 'auto' : '0'};
      margin-right: \${isUser ? '0' : 'auto'};
    \`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }
  
  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    
    addMessage(text, true);
    input.value = '';
    
    // Simulate bot response
    setTimeout(() => {
      addMessage("Thanks for your message! This is a demo response.");
    }, 1000);
  }
  
  button.addEventListener('click', sendMessage);
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendMessage();
  });
});
</script>`;
    return embedCode;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chatbot editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/build")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Build
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {agent ? `Customize ${agent.name}` : "Chatbot Customization"}
              </h1>
              <p className="text-gray-600 mt-1">
                {agent
                  ? "Customize the UI appearance of your agent"
                  : "Design your perfect chatbot interface"}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Dialog
              open={isExportModalOpen}
              onOpenChange={setIsExportModalOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Code
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle>Export Chatbot Widget</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-96">
                  <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{generateExportCode()}</code>
                  </pre>
                </ScrollArea>
                <div className="flex justify-end">
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(generateExportCode());
                      toast.success("Code copied to clipboard!");
                    }}
                  >
                    Copy Code
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <section>
          <Tabs defaultValue="design" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="design">Design &amp; Preview</TabsTrigger>
              <TabsTrigger value="templates">Template Gallery</TabsTrigger>
            </TabsList>
            <TabsContent value="design">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Customization Panel */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Customization Panel
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      {/* Basic Info */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Basic Information
                        </h3>

                        <div className="space-y-2">
                          <Label htmlFor="name">Display Name</Label>
                          <Input
                            id="name"
                            {...register("name", {
                              required: "Name is required",
                            })}
                            placeholder="My Chatbot"
                            disabled={!!agent} // Disable if editing an agent (name comes from template)
                          />
                          {errors.name && (
                            <p className="text-sm text-red-600">
                              {errors.name.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="avatar_url">Avatar URL</Label>
                          <Input
                            id="avatar_url"
                            {...register("avatar_url")}
                            placeholder="https://example.com/avatar.jpg"
                          />
                        </div>
                      </div>

                      <Separator />

                      {/* UI Customization */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Palette className="h-4 w-4" />
                          UI Customization
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="chat_bg">Background Color</Label>
                            <Input
                              id="chat_bg"
                              type="color"
                              {...register("chat_bg")}
                              className="h-10"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="border_color">Border Color</Label>
                            <Input
                              id="border_color"
                              type="color"
                              {...register("border_color")}
                              className="h-10"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="user_msg_color">
                              User Message Color
                            </Label>
                            <Input
                              id="user_msg_color"
                              type="color"
                              {...register("user_msg_color")}
                              className="h-10"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="bot_msg_color">
                              Bot Message Color
                            </Label>
                            <Input
                              id="bot_msg_color"
                              type="color"
                              {...register("bot_msg_color")}
                              className="h-10"
                            />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* System Prompt */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Bot className="h-4 w-4" />
                          System Prompt
                        </h3>

                        <div className="space-y-2">
                          <Label htmlFor="system_prompt">System Prompt</Label>
                          <Textarea
                            id="system_prompt"
                            {...register("system_prompt", {
                              required: "System prompt is required",
                            })}
                            placeholder="You are a helpful assistant..."
                            rows={4}
                            disabled={!!agent} // Disable if editing an agent (prompt comes from template)
                          />
                          {errors.system_prompt && (
                            <p className="text-sm text-red-600">
                              {errors.system_prompt.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Save Button */}
                      <Button
                        type="submit"
                        disabled={saving}
                        className="w-full flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Live Preview */}
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center h-[600px]"
                    >
                      <div className="text-center">
                        <LoadingSpinner size="lg" color={userMsgColor} />
                        <p className="mt-4 text-muted-foreground">
                          Loading preview...
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <ChatbotPreview
                        config={{
                          name: chatName,
                          theme: isDarkMode ? "dark" : "light",
                          primaryColor: userMsgColor,
                          accentColor: borderColor,
                          backgroundColor: chatBg,
                          textColor: isDarkMode ? "#f9fafb" : "#111827",
                          borderRadius: 12,
                          fontSize: 14,
                          fontFamily: "system-ui, sans-serif",
                          position: "bottom-right",
                          welcomeMessage:
                            systemPrompt || "Hello! How can I help you today?",
                          placeholder: "Type your message...",
                          avatar: avatarUrl,
                          showTypingIndicator: true,
                          enableSounds: false,
                          animationSpeed: "normal",
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </TabsContent>
            <TabsContent value="templates">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="shadow-lg col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Template Gallery
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Placeholder handlers and current config */}
                    <TemplateGallery
                      currentConfig={{
                        name: chatName,
                        theme: isDarkMode ? "dark" : "light",
                        primaryColor: userMsgColor,
                        accentColor: borderColor,
                        backgroundColor: chatBg,
                        textColor: isDarkMode ? "#f9fafb" : "#111827",
                        borderRadius: 12,
                        fontSize: 14,
                        fontFamily: "system-ui, sans-serif",
                        position: "bottom-right",
                        welcomeMessage:
                          systemPrompt || "Hello! How can I help you today?",
                        placeholder: "Type your message...",
                        avatar: avatarUrl,
                        showTypingIndicator: true,
                        enableSounds: false,
                        animationSpeed: "normal",
                      }}
                      onApplyTemplate={() => {
                        toast.info("Apply Template: Not implemented yet");
                      }}
                      onPreviewTemplate={() => {
                        toast.info("Preview Template: Not implemented yet");
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
          {/* Floating Add Template Button */}
          <div className="fixed bottom-8 right-8 z-30">
            <Button
              variant="outline"
              className="flex items-center gap-2 shadow-lg"
              onClick={() => toast.info("Add Template/Theme: Coming soon!")}
            >
              <Sparkles className="h-4 w-4" />
              Add Template/Theme
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
