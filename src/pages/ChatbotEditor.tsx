import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
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
import { Upload, Save, Code, MessageCircle, Palette, User, Bot } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useChatbotSettings } from "@/hooks/chatbotSettingsService";
import { useAgentService } from "@/hooks/agentService"; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatbotSettingsService, ChatbotSettingsData } from "../hooks/chatbotSettingsService";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

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

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function ChatbotEditor() {
  const navigate = useNavigate();
  const { getChatbotSettings, saveChatbotSettings } = useChatbotSettingsService();

  // Form state
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ChatbotFormData>({
    defaultValues: {
      name: "My Chatbot",
      avatar_url: "",
      chat_bg: "#ffffff",
      border_color: "#000000",
      user_msg_color: "#3b82f6",
      bot_msg_color: "#f3f4f6",
      system_prompt: "You are a helpful assistant."
    }
  });

  // Component state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // Watch form values for live preview
  const watchedValues = watch();
  
  // Watch specific UI customization fields for real-time updates
  const chatBg = watch("chat_bg");
  const borderColor = watch("border_color");
  const userMsgColor = watch("user_msg_color");
  const botMsgColor = watch("bot_msg_color");
  const chatName = watch("name");
  const avatarUrl = watch("avatar_url");
  const systemPrompt = watch("system_prompt");

  // Load chatbot settings on mount (only once)
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data: settings, error } = await getChatbotSettings();
        if (error) {
          console.error("Error loading settings:", error);
          toast.error("Failed to load chatbot settings");
        } else if (settings) {
          // Only populate form if we have actual saved settings
          setValue("name", settings.name);
          setValue("avatar_url", settings.avatar_url || "");
          setValue("chat_bg", settings.chat_bg);
          setValue("border_color", settings.border_color);
          setValue("user_msg_color", settings.user_msg_color);
          setValue("bot_msg_color", settings.bot_msg_color);
          setValue("system_prompt", settings.system_prompt);
        }
        // If no settings exist, form will use its default values
      } catch (error) {
        console.error("Unexpected error loading settings:", error);
        toast.error("Failed to load chatbot settings");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []); // Remove dependencies to prevent re-running

  // Save chatbot settings
  const onSubmit = async (data: ChatbotFormData) => {
    setSaving(true);
    try {
      const { error } = await saveChatbotSettings(data);
      if (error) {
        toast.error("Failed to save settings: " + error);
      } else {
        toast.success("Settings saved successfully!");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  // Send message in chat preview
  const sendMessage = async () => {
    if (!currentMessage.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: currentMessage,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "This is a preview response from your chatbot. The actual responses will be generated based on your system prompt.",
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Generate export code
  const generateExportCode = () => {
    const embedCode = `<!-- Chatbot Embed Code -->
<div id="chatbot-container"></div>
<script>
  (function() {
    const chatbotConfig = {
      name: "${chatName}",
      avatar: "${avatarUrl}",
      chatBg: "${chatBg}",
      borderColor: "${borderColor}",
      userMsgColor: "${userMsgColor}",
      botMsgColor: "${botMsgColor}",
      systemPrompt: "${systemPrompt}"
    };
    
    // Create chatbot widget
    const container = document.getElementById('chatbot-container');
    container.innerHTML = \`
      <div style="
        width: 400px;
        height: 600px;
        border: 2px solid \${chatbotConfig.borderColor};
        border-radius: 12px;
        background: \${chatbotConfig.chatBg};
        display: flex;
        flex-direction: column;
        font-family: system-ui, -apple-system, sans-serif;
      ">
        <div style="
          padding: 16px;
          border-bottom: 1px solid \${chatbotConfig.borderColor};
          display: flex;
          align-items: center;
          gap: 12px;
        ">
          <div style="
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #f3f4f6;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            \${chatbotConfig.avatar ? 
              \`<img src="\${chatbotConfig.avatar}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">\` : 
              '🤖'
            }
          </div>
          <h3 style="margin: 0; font-size: 18px; font-weight: 600;">\${chatbotConfig.name}</h3>
        </div>
        <div style="flex: 1; padding: 16px; overflow-y: auto;" id="chat-messages">
          <!-- Messages will appear here -->
        </div>
        <div style="
          padding: 16px;
          border-top: 1px solid \${chatbotConfig.borderColor};
          display: flex;
          gap: 8px;
        ">
          <input 
            type="text" 
            placeholder="Type a message..." 
            style="
              flex: 1;
              padding: 8px 12px;
              border: 1px solid \${chatbotConfig.borderColor};
              border-radius: 6px;
              outline: none;
            "
            id="chat-input"
          >
          <button 
            style="
              padding: 8px 12px;
              background: \${chatbotConfig.userMsgColor};
              color: white;
              border: none;
              border-radius: 6px;
              cursor: pointer;
            "
            onclick="sendMessage()"
          >
            Send
          </button>
        </div>
      </div>
    \`;
    
    // Add chat functionality
    window.sendMessage = function() {
      const input = document.getElementById('chat-input');
      const messages = document.getElementById('chat-messages');
      
      if (input.value.trim()) {
        // Add user message
        messages.innerHTML += \`
          <div style="margin-bottom: 12px; display: flex; justify-content: flex-end;">
            <div style="
              background: \${chatbotConfig.userMsgColor};
              color: white;
              padding: 8px 12px;
              border-radius: 8px;
              max-width: 70%;
            ">
              \${input.value}
            </div>
          </div>
        \`;
        
        // Add bot response (placeholder)
        setTimeout(() => {
          messages.innerHTML += \`
            <div style="margin-bottom: 12px; display: flex; justify-content: flex-start;">
              <div style="
                background: \${chatbotConfig.botMsgColor};
                color: #374151;
                padding: 8px 12px;
                border-radius: 8px;
                max-width: 70%;
              ">
                Thanks for your message! This is a demo response.
              </div>
            </div>
          \`;
          messages.scrollTop = messages.scrollHeight;
        }, 500);
        
        input.value = '';
        messages.scrollTop = messages.scrollHeight;
      }
    };
    
    // Enter key support
    document.getElementById('chat-input').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  })();
</script>`;

    return embedCode;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading chatbot settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/build")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Build
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Chatbot Editor</h1>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-6 py-2 shadow-lg"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              onClick={() => setExportModalOpen(true)}
              variant="outline"
              className="rounded-xl px-6 py-2 shadow-lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Code
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Panel - Customization */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground">UI Customization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Display Name */}
                  <div>
                    <Label htmlFor="name" className="text-foreground">
                      Display Name
                    </Label>
                    <Input
                      id="name"
                      {...register("name", { required: "Name is required" })}
                      className="bg-background border-border text-foreground"
                      placeholder="My Chatbot"
                    />
                    {errors.name && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Avatar */}
                  <div>
                    <Label className="text-foreground mb-2 block">Avatar</Label>
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={avatarUrl} />
                        <AvatarFallback className="bg-muted">
                          <Bot className="w-8 h-8 text-muted-foreground" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Input
                          {...register("avatar_url")}
                          className="bg-background border-border text-foreground"
                          placeholder="https://example.com/avatar.png"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Chat Background */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="chat_bg" className="text-foreground">
                        Chat Background
                      </Label>
                      <div className="flex space-x-2">
                        <Input
                          type="color"
                          {...register("chat_bg")}
                          className="w-12 h-10 p-1 bg-background border-border"
                        />
                        <Input
                          {...register("chat_bg")}
                          className="flex-1 bg-background border-border text-foreground"
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>

                    {/* Border Color */}
                    <div>
                      <Label htmlFor="border_color" className="text-foreground">
                        Border Color
                      </Label>
                      <div className="flex space-x-2">
                        <Input
                          type="color"
                          {...register("border_color")}
                          className="w-12 h-10 p-1 bg-background border-border"
                        />
                        <Input
                          {...register("border_color")}
                          className="flex-1 bg-background border-border text-foreground"
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Message Colors */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="user_msg_color" className="text-foreground">
                        User Message
                      </Label>
                      <div className="flex space-x-2">
                        <Input
                          type="color"
                          {...register("user_msg_color")}
                          className="w-12 h-10 p-1 bg-background border-border"
                        />
                        <Input
                          {...register("user_msg_color")}
                          className="flex-1 bg-background border-border text-foreground"
                          placeholder="#3b82f6"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bot_msg_color" className="text-foreground">
                        Bot Message
                      </Label>
                      <div className="flex space-x-2">
                        <Input
                          type="color"
                          {...register("bot_msg_color")}
                          className="w-12 h-10 p-1 bg-background border-border"
                        />
                        <Input
                          {...register("bot_msg_color")}
                          className="flex-1 bg-background border-border text-foreground"
                          placeholder="#f3f4f6"
                        />
                      </div>
                    </div>
                  </div>

                  {/* System Prompt */}
                  <div>
                    <Label htmlFor="system_prompt" className="text-foreground">
                      System Prompt
                    </Label>
                    <Textarea
                      id="system_prompt"
                      {...register("system_prompt", {
                        required: "System prompt is required",
                      })}
                      className="bg-background border-border text-foreground min-h-[120px]"
                      placeholder="You are a helpful assistant..."
                    />
                    {errors.system_prompt && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.system_prompt.message}
                      </p>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Chat Preview */}
          <div 
            className="lg:col-span-3 flex flex-col rounded-xl shadow-lg"
            style={{
              backgroundColor: chatBg || '#ffffff',
              border: `2px solid ${borderColor || '#000000'}`,
            }}
          >
            {/* Chat Header */}
            <div 
              className="p-6 border-b rounded-t-xl"
              style={{ borderColor: borderColor || '#000000' }}
            >
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="bg-muted">
                    <Bot className="w-5 h-5 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    {chatName || "Chat Preview"}
                  </h2>
                  <p className="text-muted-foreground">
                    Test your chatbot in real-time
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {chatMessages.map(message => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                        message.role === "user"
                          ? "flex-row-reverse space-x-reverse"
                          : ""
                      }`}
                    >
                      <Avatar className="w-8 h-8">
                        {message.role === "user" ? (
                          <AvatarFallback className="bg-primary">
                            <User className="w-4 h-4 text-primary-foreground" />
                          </AvatarFallback>
                        ) : (
                          <>
                            <AvatarImage src={avatarUrl} />
                            <AvatarFallback className="bg-muted">
                              <Bot className="w-4 h-4 text-muted-foreground" />
                            </AvatarFallback>
                          </>
                        )}
                      </Avatar>
                      <div
                        className="p-3 rounded-lg"
                        style={{
                          backgroundColor: message.role === "user" 
                            ? (userMsgColor || '#3b82f6')
                            : (botMsgColor || '#f3f4f6'),
                          color: message.role === "user" ? '#ffffff' : '#374151'
                        }}
                      >
                        {message.role === "assistant" ? (
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        ) : (
                          message.content
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start space-x-2 max-w-xs lg:max-w-md">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={avatarUrl} />
                        <AvatarFallback className="bg-muted">
                          <Bot className="w-4 h-4 text-muted-foreground" />
                        </AvatarFallback>
                      </Avatar>
                      <div 
                        className="p-3 rounded-lg"
                        style={{
                          backgroundColor: botMsgColor || '#f3f4f6'
                        }}
                      >
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Chat Input */}
            <div 
              className="p-6 border-t rounded-b-xl"
              style={{ borderColor: borderColor || '#000000' }}
            >
              <div className="flex items-center space-x-3">
                <Input
                  value={currentMessage}
                  onChange={e => setCurrentMessage(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Type a message to test your chatbot..."
                  className="bg-background border-border text-foreground flex-1"
                  disabled={isTyping}
                  style={{
                    borderColor: borderColor || '#000000'
                  }}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!currentMessage.trim() || isTyping}
                  className="bg-blue-600 hover:bg-blue-700 rounded-xl"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Code Modal */}
      <Dialog open={exportModalOpen} onOpenChange={setExportModalOpen}>
        <DialogContent className="bg-card border-border text-card-foreground max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-foreground">Export Chatbot Code</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Copy and paste this code into your website to embed your chatbot:
            </p>
            <div className="bg-muted p-4 rounded-lg overflow-auto max-h-96">
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                {generateExportCode()}
              </pre>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setExportModalOpen(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(generateExportCode());
                  toast.success("Code copied to clipboard!");
                }}
              >
                Copy Code
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
