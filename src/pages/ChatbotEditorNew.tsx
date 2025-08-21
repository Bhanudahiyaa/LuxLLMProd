import React, { useState, useEffect, useRef, useMemo } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatbotSettingsService } from "@/hooks/chatbotSettingsService";
import { useAgentService } from "@/hooks/agentService";
import { chatWithAgent } from "@/api/chat";
import { AppSidebar } from "@/components/layout/AppSidebar";
import Navigation from "@/components/Navigation";
import { useAuth } from "@clerk/clerk-react";
import { supabase, getAuthenticatedClient } from "@/lib/supabaseClient";

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
  system_prompt?: string;
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [borderRadius, setBorderRadius] = useState(12);
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState("Inter");
  const [position, setPosition] = useState("bottom-right");
  const [showTypingIndicatorState, setShowTypingIndicatorState] =
    useState(true);
  const [enableSoundsState, setEnableSoundsState] = useState(false);
  const [animationSpeedState, setAnimationSpeedState] = useState<
    "slow" | "normal" | "fast"
  >("normal");
  const [welcomeMessageState, setWelcomeMessageState] = useState(
    "Hello! How can I help you today?"
  );
  const [placeholderState, setPlaceholderState] = useState(
    "Type your message..."
  );
  const didInitRef = useRef(false);

  // Chat functionality
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const { getChatbotSettings, saveChatbotSettings } =
    useChatbotSettingsService();
  const { getAgentsByUser, updateAgent, createAgent } = useAgentService();
  const { getToken } = useAuth();

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
      bot_msg_color: "#000000",
      system_prompt: "You are a helpful assistant.",
    },
    mode: "onChange",
  });

  console.log("Form initialized with default values");

  // Watch form values for live preview
  const chatBg = watch("chat_bg");
  const borderColor = watch("border_color");
  const userMsgColor = watch("user_msg_color");
  const botMsgColor = watch("bot_msg_color");
  const chatName = watch("name");
  const avatarUrl = watch("avatar_url");
  const systemPrompt = watch("system_prompt");

  // Debug: Log form values
  console.log("Form values:", {
    chatBg,
    borderColor,
    userMsgColor,
    botMsgColor,
    chatName,
    avatarUrl,
    systemPrompt,
  });

  // Debug: Log when name changes
  useEffect(() => {
    console.log("Chat name changed to:", chatName);
  }, [chatName]);

  // Debug: Test form watching
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === "name") {
        console.log("Form name field changed:", value.name, "Type:", type);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Debug: Track form state changes
  useEffect(() => {
    console.log("Form state changed - current values:", {
      name: watch("name"),
      avatar_url: watch("avatar_url"),
      system_prompt: watch("system_prompt"),
    });
  }, [watch]);

  // Create a config object for the SettingsPanel that updates when form values change
  const settingsConfig = useMemo(() => {
    console.log("Creating settings config with botMsgColor:", botMsgColor);
    console.log("Settings config name will be:", chatName);
    return {
      name: chatName,
      theme: isDarkMode ? "dark" : "light",
      primaryColor: userMsgColor,
      accentColor: borderColor,
      backgroundColor: chatBg,
      textColor: botMsgColor || "#000000",
      borderRadius: borderRadius,
      fontSize: fontSize,
      fontFamily: fontFamily,
      position: position as "bottom-right" | "bottom-left",
      welcomeMessage: welcomeMessageState,
      systemPrompt: systemPrompt || "You are a helpful assistant.",
      placeholder: placeholderState,
      avatar: avatarUrl || "",
      showTypingIndicator: showTypingIndicatorState,
      enableSounds: enableSoundsState,
      animationSpeed: animationSpeedState,
    };
  }, [
    chatName,
    isDarkMode,
    userMsgColor,
    borderColor,
    chatBg,
    botMsgColor,
    borderRadius,
    fontSize,
    fontFamily,
    position,
    welcomeMessageState,
    systemPrompt,
    placeholderState,
    avatarUrl,
    showTypingIndicatorState,
    enableSoundsState,
    animationSpeedState,
  ]);

  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: welcomeMessageState,
        timestamp: new Date(),
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ensure form is properly initialized with default values
  useEffect(() => {
    // Force set the default values to ensure they're applied
    setValue("bot_msg_color", "#000000", { shouldDirty: false });
    setValue("chat_bg", "#ffffff", { shouldDirty: false });
    setValue("border_color", "#e5e7eb", { shouldDirty: false });
    setValue("user_msg_color", "#3b82f6", { shouldDirty: false });
    // Remove the hardcoded system prompt override - let templates use their own prompts
    // setValue("system_prompt", "You are a helpful assistant.", { shouldDirty: false });
  }, [setValue]);

  // Load agent data if agentId is provided (only once per agentId)
  useEffect(() => {
    const loadAgentData = async () => {
      if (didInitRef.current) return;
      didInitRef.current = true;

      // Check if we have template data first - if so, skip agent loading
      const templateParam = searchParams.get("template");
      if (templateParam) {
        // Template data will be handled by the template useEffect
        return;
      }

      if (!agentId) {
        // No agent ID, try to restore from localStorage first
        const savedAgentData = localStorage.getItem("selectedAgent");
        if (savedAgentData) {
          try {
            const parsedAgent = JSON.parse(savedAgentData);
            console.log("Restoring agent from localStorage:", parsedAgent);

            // Restore form with saved agent data
            const restoreData = {
              name: parsedAgent.name || "My Chatbot",
              avatar_url: parsedAgent.avatar_url || "",
              chat_bg: parsedAgent.chat_bg || "#ffffff",
              border_color: parsedAgent.border_color || "#e5e7eb",
              user_msg_color: parsedAgent.user_msg_color || "#3b82f6",
              bot_msg_color: parsedAgent.bot_msg_color || "#000000",
              system_prompt:
                parsedAgent.system_prompt || "You are a helpful assistant.",
            };

            console.log("Restoring form with data:", restoreData);
            reset(restoreData);

            // Verify form was updated
            setTimeout(() => {
              console.log(
                "Form after localStorage restore - name:",
                watch("name")
              );
            }, 100);

            // Set agent state for UI consistency
            setAgent(parsedAgent);
            setLoading(false);

            // Verify localStorage data was used
            console.log(
              "Verified localStorage restore - agent state:",
              parsedAgent
            );

            // Verify form was updated
            console.log("Final form state after localStorage restore:", {
              name: watch("name"),
              avatar_url: watch("avatar_url"),
              system_prompt: watch("system_prompt"),
            });

            return;
          } catch (error) {
            console.error("Error parsing saved agent data:", error);
            localStorage.removeItem("selectedAgent"); // Clear invalid data
          }
        }

        // No saved agent, load saved chatbot settings if any
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
        // PRIORITY: Agent customizations > User settings > Defaults
        const agentFormData = {
          name: foundAgent.name,
          avatar_url: foundAgent.avatar_url || "",
          system_prompt:
            foundAgent.system_prompt || "You are a helpful assistant.",
          // Use agent's actual customizations if they exist, otherwise fall back to user settings
          chat_bg: foundAgent.chat_bg_color || uiSettings.chat_bg,
          border_color: foundAgent.chat_border_color || uiSettings.border_color,
          user_msg_color: foundAgent.user_msg_color || uiSettings.user_msg_color,
          bot_msg_color: foundAgent.bot_msg_color || uiSettings.bot_msg_color,
        };

        console.log("Resetting form with agent data:", agentFormData);
        reset(agentFormData);

        // Verify form was updated
        setTimeout(() => {
          console.log("Form after reset - name:", watch("name"));
        }, 100);

        // Save agent data to localStorage for persistence
        const agentDataToSave = {
          ...foundAgent,
          ...agentFormData,
        };
        localStorage.setItem("selectedAgent", JSON.stringify(agentDataToSave));
        console.log("Saved agent to localStorage:", agentDataToSave);

        // Verify localStorage was saved
        const savedData = localStorage.getItem("selectedAgent");
        console.log(
          "Verified localStorage save:",
          savedData ? JSON.parse(savedData) : null
        );

        // Verify agent state was set
        console.log("Verified agent state set:", foundAgent);

        // Verify form was updated
        console.log("Final form state after agent load:", {
          name: watch("name"),
          avatar_url: watch("avatar_url"),
          system_prompt: watch("system_prompt"),
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
    // Only depend on agentId to avoid re-running due to unstable function refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentId]);

  // Load template data if template parameter is provided
  useEffect(() => {
    const templateParam = searchParams.get("template");
    if (templateParam) {
      try {
        const template = JSON.parse(decodeURIComponent(templateParam));
        console.log("Loading template:", template); // Debug log

        // Check if user has existing customizations in localStorage
        const existingCustomizations = localStorage.getItem("chatbotCustomizations");
        let userColors: {
          chat_bg?: string;
          border_color?: string;
          user_msg_color?: string;
          bot_msg_color?: string;
        } = {};
        
        if (existingCustomizations) {
          try {
            userColors = JSON.parse(existingCustomizations);
            console.log("Found existing user customizations:", userColors);
          } catch (e) {
            console.log("No existing customizations found");
          }
        }

        // Update form with template data, preserving user customizations
        const templateFormData = {
          name: template.name || template.title || "My Chatbot",
          avatar_url: template.avatar_url || "",
          // Use user customizations if they exist, otherwise use template defaults
          chat_bg: userColors.chat_bg || "#ffffff",
          border_color: userColors.border_color || "#e5e7eb",
          user_msg_color: userColors.user_msg_color || "#3b82f6",
          bot_msg_color: userColors.bot_msg_color || "#000000",
          system_prompt:
            template.system_prompt || "You are a helpful assistant.",
        };

        console.log("Loading template form data with customizations:", templateFormData);
        reset(templateFormData);

        // Verify form was updated
        setTimeout(() => {
          console.log("Form after template load - name:", watch("name"));
        }, 100);

        // Save template data to localStorage for persistence
        const templateDataToSave = {
          id: template.id || `template-${Date.now()}`,
          name: template.name || template.title || "My Chatbot",
          avatar_url: template.avatar_url || "",
          system_prompt:
            template.system_prompt || "You are a helpful assistant.",
          // Preserve user customizations
          chat_bg: userColors.chat_bg || "#ffffff",
          border_color: userColors.border_color || "#e5e7eb",
          user_msg_color: userColors.user_msg_color || "#3b82f6",
          bot_msg_color: userColors.bot_msg_color || "#000000",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        localStorage.setItem(
          "selectedAgent",
          JSON.stringify(templateDataToSave)
        );
        console.log("Saved template to localStorage:", templateDataToSave);

        // Verify localStorage was saved
        const savedTemplateData = localStorage.getItem("selectedAgent");
        console.log(
          "Verified template localStorage save:",
          savedTemplateData ? JSON.parse(savedTemplateData) : null
        );

        // Also update the local state for immediate UI update
        setAgent(templateDataToSave);
        setLoading(false);

        // Verify template data was used
        console.log(
          "Verified template load - agent state:",
          templateDataToSave
        );

        // Verify form was updated
        console.log("Final form state after template load:", {
          name: watch("name"),
          avatar_url: watch("avatar_url"),
          system_prompt: watch("system_prompt"),
        });

        // Clear the template parameter from URL
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete("template");
        navigate(`/editor?${newSearchParams.toString()}`, { replace: true });
      } catch (error) {
        console.error("Error parsing template:", error);
        toast.error("Failed to load template");
        setLoading(false);
      }
    }
  }, [searchParams, navigate, reset]);

  // Save user customizations to localStorage when colors change
  const saveUserCustomizations = (colors: {
    chat_bg: string;
    border_color: string;
    user_msg_color: string;
    bot_msg_color: string;
  }) => {
    localStorage.setItem("chatbotCustomizations", JSON.stringify(colors));
    console.log("Saved user customizations:", colors);
  };

  // Watch for color changes and save customizations
  useEffect(() => {
    const colors = {
      chat_bg: chatBg,
      border_color: borderColor,
      user_msg_color: userMsgColor,
      bot_msg_color: botMsgColor,
    };
    
    // Save customizations whenever colors change
    saveUserCustomizations(colors);
  }, [chatBg, borderColor, userMsgColor, botMsgColor]);

  // Clear localStorage when switching agents or unmounting
  useEffect(() => {
    return () => {
      // Only clear if we're not actively using an agent
      if (!agentId && !agent) {
        clearSelectedAgent();
      }
    };
  }, [agentId, agent]);

  // Clear localStorage when switching agents
  const clearSelectedAgent = () => {
    localStorage.removeItem("selectedAgent");
    console.log("Cleared selected agent from localStorage");
  };

  // Update localStorage when form values change
  useEffect(() => {
    if (agent && !loading) {
      const currentFormData = {
        name: watch("name"),
        avatar_url: watch("avatar_url"),
        chat_bg: watch("chat_bg"),
        border_color: watch("border_color"),
        user_msg_color: watch("user_msg_color"),
        bot_msg_color: watch("bot_msg_color"),
        system_prompt: watch("system_prompt"),
      };

      const agentDataToUpdate = {
        ...agent,
        ...currentFormData,
        updated_at: new Date().toISOString(),
      };

      localStorage.setItem("selectedAgent", JSON.stringify(agentDataToUpdate));
    }
  }, [agent, watch, loading]);

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
      if (agentId && agent) {
        // Update existing agent
        const { data: updatedAgent, error: updateError } = await updateAgent(
          agentId,
          {
            name: data.name,
            avatar_url: data.avatar_url,
            heading: data.name,
            subheading: "AI-powered chatbot",
            system_prompt: data.system_prompt,
            // Add UI customizations
            chat_bg_color: data.chat_bg,
            chat_border_color: data.border_color,
            user_msg_color: data.user_msg_color,
            bot_msg_color: data.bot_msg_color,
            chat_name: data.name,
          }
        );

        if (updateError) {
          toast.error("Failed to update agent: " + updateError);
          return;
        }

        toast.success("Chatbot updated successfully!");
      } else {
        // Create a new agent with the chatbot settings
        const { data: newAgent, error: createError } = await createAgent({
          name: data.name,
          avatar_url: data.avatar_url,
          heading: data.name,
          subheading: "AI-powered chatbot",
          system_prompt: data.system_prompt,
          // Add UI customizations
          chat_bg_color: data.chat_bg,
          chat_border_color: data.border_color,
          user_msg_color: data.user_msg_color,
          bot_msg_color: data.bot_msg_color,
          chat_name: data.name,
        });

        if (createError) {
          toast.error("Failed to create agent: " + createError);
          return;
        }

        toast.success("Chatbot created successfully!");

        // Navigate to My Agents page for new agents
        navigate("/build/agents");
      }

      // Save UI customization settings
      const { error: settingsError } = await saveChatbotSettings(data);
      if (settingsError) {
        console.warn("Failed to save UI settings:", settingsError);
        // Continue anyway since the agent was created/updated
      }

      // Update localStorage with the agent data
      const agentDataToSave = {
        ...(agentId && agent ? agent : {}),
        ...data,
        updated_at: new Date().toISOString(),
      };
      localStorage.setItem("selectedAgent", JSON.stringify(agentDataToSave));
      console.log("Updated localStorage with agent data:", agentDataToSave);
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Failed to save chatbot");
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
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/build")}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Build
              </Button>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {agent ? `Customize ${agent.name}` : "Chatbot Customization"}
              </h1>
              <p className="text-muted-foreground mt-2">
                {agent
                  ? "Customize the UI appearance of your agent"
                  : "Design your perfect chatbot interface"}
              </p>
            </div>
          </div>

          <section>
            <Tabs defaultValue="design" className="w-full">
              <div className="mb-6 flex items-center justify-between gap-3">
                <TabsList className="bg-background border border-border">
                  <TabsTrigger
                    value="design"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Design & Preview
                  </TabsTrigger>
                </TabsList>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 shadow-sm bg-background border-border hover:bg-muted"
                  onClick={() => {
                    const currentData = {
                      id: "preview-" + Date.now(),
                      name: watch("name") || "My Chatbot",
                      avatar_url: watch("avatar_url") || "",
                      system_prompt:
                        watch("system_prompt") ||
                        "You are a helpful assistant.",
                      chat_bg_color: watch("chat_bg") || "#ffffff",
                      chat_border_color: watch("border_color") || "#e5e7eb",
                      user_msg_color: watch("user_msg_color") || "#3b82f6",
                      bot_msg_color: watch("bot_msg_color") || "#f3f4f6",
                    };
                    localStorage.setItem(
                      "chatbotPreviewData",
                      JSON.stringify(currentData)
                    );
                    navigate("/export");
                  }}
                >
                  <Code className="h-4 w-4" />
                  Export Code
                </Button>
              </div>
              <TabsContent value="design">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Customization Panel */}
                  <Card className="shadow-lg border border-border">
                    <CardHeader className="border-b border-border">
                      <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Palette className="h-5 w-5 text-primary" />
                        </div>
                        Customization Panel
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <SettingsPanel
                        config={settingsConfig}
                        onAvatarUpload={async (file: File) => {
                          try {
                            // Upload to Supabase storage
                            const fileExt = file.name.split(".").pop();
                            const fileName = `${Date.now()}.${fileExt}`;
                            const filePath = fileName;

                            // Get authenticated client for storage operations
                            const token = await getToken();
                            const client = await getAuthenticatedClient(token);

                            const { data: uploadData, error: uploadError } =
                              await client.storage
                                .from("avatars")
                                .upload(filePath, file, { upsert: false });

                            if (uploadError) {
                              console.error(
                                "Avatar upload error:",
                                uploadError
                              );
                              toast.error("Failed to upload avatar");
                              return;
                            }

                            const {
                              data: { publicUrl },
                            } = client.storage
                              .from("avatars")
                              .getPublicUrl(filePath);

                            // Set avatar URL back into form
                            setValue("avatar_url", publicUrl, {
                              shouldDirty: true,
                            });

                            // Force a re-render by updating the avatar state
                            // This will update the settingsConfig since it depends on avatarUrl
                            setValue("avatar_url", publicUrl, {
                              shouldDirty: true,
                            });

                            // Debug: Log the avatar update
                            console.log(
                              "Avatar uploaded successfully:",
                              publicUrl
                            );
                            console.log(
                              "Form avatar_url value:",
                              watch("avatar_url")
                            );
                            console.log(
                              "Settings config avatar:",
                              settingsConfig.avatar
                            );

                            toast.success("Avatar uploaded successfully");
                          } catch (e) {
                            console.error("Avatar upload error:", e);
                            toast.error(
                              "Failed to upload avatar. Please try again."
                            );
                          }
                        }}
                        onConfigChange={cfg => {
                          console.log("Settings panel config change:", cfg);
                          console.log("Text color changed to:", cfg.textColor);

                          // Map settings panel changes back to form values
                          setValue("chat_bg", cfg.backgroundColor, {
                            shouldDirty: true,
                          });
                          setValue("border_color", cfg.accentColor, {
                            shouldDirty: true,
                          });
                          setValue("user_msg_color", cfg.primaryColor, {
                            shouldDirty: true,
                          });
                          setValue("bot_msg_color", cfg.textColor, {
                            shouldDirty: true,
                          });
                          setIsDarkMode(cfg.theme === "dark");

                          // Update UI settings
                          setBorderRadius(cfg.borderRadius);
                          setFontSize(cfg.fontSize);
                          setFontFamily(cfg.fontFamily);
                          setPosition(cfg.position);
                          setWelcomeMessageState(cfg.welcomeMessage);
                          setPlaceholderState(cfg.placeholder);
                          setShowTypingIndicatorState(cfg.showTypingIndicator);
                          setEnableSoundsState(cfg.enableSounds);
                          setAnimationSpeedState(
                            (cfg.animationSpeed as
                              | "slow"
                              | "normal"
                              | "fast") || "normal"
                          );

                          // Update other settings
                          if (cfg.avatar !== avatarUrl) {
                            setValue("avatar_url", cfg.avatar, {
                              shouldDirty: true,
                            });
                          }

                          // Update form state immediately for real-time preview
                          // This ensures the watched values are updated
                          const formData = {
                            chat_bg: cfg.backgroundColor,
                            border_color: cfg.accentColor,
                            user_msg_color: cfg.primaryColor,
                            bot_msg_color: cfg.textColor,
                            avatar_url: cfg.avatar,
                          };

                          // Force form update
                          Object.entries(formData).forEach(([key, value]) => {
                            setValue(key as keyof ChatbotFormData, value, {
                              shouldDirty: true,
                            });
                          });
                        }}
                        lockedFields={["name", "systemPrompt"]}
                      />

                      {/* Save Button */}
                      <div className="mt-6 pt-6 border-t border-border">
                        <Button
                          onClick={handleSubmit(onSubmit)}
                          disabled={saving}
                          className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {saving ? "Creating..." : "Create & Save Chatbot"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Live Preview */}
                  <div className="relative">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Live Preview
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        See your changes in real-time
                      </p>
                    </div>

                    <AnimatePresence mode="wait">
                      {loading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center h-[600px] bg-muted/50 border border-border rounded-lg"
                        >
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-muted-foreground">
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
                          className="bg-muted/50 border border-border rounded-lg p-4"
                        >
                          <ChatbotPreview config={settingsConfig} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </section>
        </main>
      </div>
    </div>
  );
}
