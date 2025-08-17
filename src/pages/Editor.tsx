import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Code,
  Send,
  Upload,
  Save,
  Copy,
  X,
  User,
  Bot,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAgentService } from "../hooks/agentService";
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

export function Editor() {
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

  // Load agent data on mount
  useEffect(() => {
    const loadAgent = async () => {
      if (!agentId) return;

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

        // Populate form with agent data
        setValue("name", foundAgent.name || "");
        setValue("heading", foundAgent.heading || "");
        setValue("subheading", foundAgent.subheading || "");
        setValue("avatar_url", foundAgent.avatar_url || "");
        setValue("system_prompt", foundAgent.system_prompt || "");
        // UI Customization defaults
        setValue("chat_bg_color", foundAgent.chat_bg_color || "#ffffff");
        setValue("chat_border_color", foundAgent.chat_border_color || "#e5e7eb");
        setValue("user_msg_color", foundAgent.user_msg_color || "#3b82f6");
        setValue("bot_msg_color", foundAgent.bot_msg_color || "#f3f4f6");
        setValue("chat_name", foundAgent.chat_name || foundAgent.name || "AI Assistant");
      } catch (error) {
        console.error("Error loading agent:", error);
        toast.error("Failed to load agent");
        navigate("/build");
      } finally {
        setLoading(false);
      }
    };

    loadAgent();
  }, [agentId, getAgentsByUser, setValue, navigate]);

  // Save agent changes
  const onSave = async (data: AgentFormData) => {
    if (!agentId) return;

    setSaving(true);
    try {
      const { error } = await updateAgent(agentId, data);
      if (error) throw new Error(error);

      toast.success("Agent updated successfully!");
      setAgent({ ...agent, ...data });
    } catch (error) {
      console.error("Error saving agent:", error);
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  // Send chat message
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

    try {
      // Import and use the real Qwen3 API
      const { chatWithAgent } = await import("../api/chat");

      const response = await chatWithAgent({
        system_prompt:
          watchedValues.system_prompt ||
          agent?.system_prompt ||
          "You are a helpful AI assistant.",
        message: currentMessage,
        agentId: agentId || "",
      });

      if (response.error) {
        throw new Error(response.error);
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.message,
        timestamp: new Date(),
      };

      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      // Fallback error response
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I apologize, but I'm experiencing some technical difficulties. Please try again later.",
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  // Generate export code
  const generateReactCode = () => {
    return `import React, { useState } from 'react';

const ${watchedValues.name?.replace(/\s+/g, "") || "Chatbot"} = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    
    // Call your chat API here
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_prompt: "${watchedValues.system_prompt || ""}",
        message: input,
        agentId: "${agentId}"
      })
    });
    
    const data = await response.json();
    const botMessage = { role: 'assistant', content: data.message };
    setMessages(prev => [...prev, botMessage]);
    setInput('');
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b">
        <h3 className="font-semibold">${
          watchedValues.heading || "Chat Assistant"
        }</h3>
        <p className="text-sm text-gray-600">${
          watchedValues.subheading || "How can I help you?"
        }</p>
      </div>
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={\`flex \${msg.role === 'user' ? 'justify-end' : 'justify-start'}\`}>
            <div className={\`max-w-xs p-3 rounded-lg \${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}\`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded"
        />
        <button onClick={sendMessage} className="px-4 py-2 bg-blue-500 text-white rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default ${watchedValues.name?.replace(/\s+/g, "") || "Chatbot"};`;
  };

  const generateHtmlCode = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${watchedValues.name || "Chatbot"}</title>
    <style>
        .chatbot-container {
            max-width: 400px;
            margin: 50px auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .chatbot-header {
            padding: 16px;
            background: #f3f4f6;
            border-bottom: 1px solid #e5e7eb;
        }
        .chatbot-messages {
            height: 300px;
            overflow-y: auto;
            padding: 16px;
        }
        .message {
            margin-bottom: 12px;
            display: flex;
        }
        .message.user {
            justify-content: flex-end;
        }
        .message-content {
            max-width: 70%;
            padding: 8px 12px;
            border-radius: 8px;
        }
        .message.user .message-content {
            background: #3b82f6;
            color: white;
        }
        .message.bot .message-content {
            background: #f3f4f6;
            color: #374151;
        }
        .chatbot-input {
            display: flex;
            padding: 16px;
            border-top: 1px solid #e5e7eb;
        }
        .chatbot-input input {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            margin-right: 8px;
        }
        .chatbot-input button {
            padding: 8px 16px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="chatbot-container">
        <div class="chatbot-header">
            <h3>${watchedValues.heading || "Chat Assistant"}</h3>
            <p>${watchedValues.subheading || "How can I help you?"}</p>
        </div>
        <div class="chatbot-messages" id="messages"></div>
        <div class="chatbot-input">
            <input type="text" id="messageInput" placeholder="Type a message...">
            <button onclick="sendMessage()">Send</button>
        </div>
    </div>

    <script>
        const messages = [];
        
        function addMessage(role, content) {
            messages.push({ role, content });
            renderMessages();
        }
        
        function renderMessages() {
            const container = document.getElementById('messages');
            container.innerHTML = messages.map(msg => 
                \`<div class="message \${msg.role}">
                    <div class="message-content">\${msg.content}</div>
                </div>\`
            ).join('');
            container.scrollTop = container.scrollHeight;
        }
        
        async function sendMessage() {
            const input = document.getElementById('messageInput');
            const message = input.value.trim();
            if (!message) return;
            
            addMessage('user', message);
            input.value = '';
            
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        system_prompt: "${watchedValues.system_prompt || ""}",
                        message: message,
                        agentId: "${agentId}"
                    })
                });
                
                const data = await response.json();
                addMessage('bot', data.message);
            } catch (error) {
                addMessage('bot', 'Sorry, I encountered an error. Please try again.');
            }
        }
        
        document.getElementById('messageInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') sendMessage();
        });
    </script>
</body>
</html>`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading agent...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <div className="sticky top-0 z-10 bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigate("/build")}
            variant="ghost"
            className="text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Build
          </Button>

          <div className="flex items-center space-x-3">
            <Button
              onClick={handleSubmit(onSave)}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>

            <Button
              onClick={() => setExportModalOpen(true)}
              variant="outline"
              className="border-neutral-600 text-neutral-300 hover:bg-neutral-700"
            >
              <Code className="w-4 h-4 mr-2" />
              Export Code
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 h-[calc(100vh-80px)]">
        {/* Left Panel - Customizer */}
        <div className="lg:col-span-1 bg-muted/20 p-6 overflow-y-auto">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">
                Customize Your Chatbot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit(onSave)} className="space-y-4">
                {/* Chatbot Name */}
                <div>
                  <Label htmlFor="name" className="text-foreground">
                    Chatbot Name
                  </Label>
                  <Input
                    id="name"
                    {...register("name", { required: "Name is required" })}
                    className="bg-neutral-700 border-neutral-600 text-white"
                    placeholder="My AI Assistant"
                  />
                  {errors.name && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Heading */}
                <div>
                  <Label htmlFor="heading" className="text-foreground">
                    Heading
                  </Label>
                  <Input
                    id="heading"
                    {...register("heading")}
                    className="bg-neutral-700 border-neutral-600 text-white"
                    placeholder="Welcome! How can I help?"
                  />
                </div>

                {/* Subheading */}
                <div>
                  <Label htmlFor="subheading" className="text-foreground">
                    Subheading
                  </Label>
                  <Input
                    id="subheading"
                    {...register("subheading")}
                    className="bg-neutral-700 border-neutral-600 text-white"
                    placeholder="I'm here to assist you"
                  />
                </div>

                {/* Avatar */}
                <div>
                  <Label htmlFor="avatar_url" className="text-foreground">
                    Avatar URL
                  </Label>
                  <div className="flex items-center space-x-3">
                    <Input
                      id="avatar_url"
                      {...register("avatar_url")}
                      className="bg-background border-border text-foreground flex-1"
                      placeholder="https://example.com/avatar.png"
                    />
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={watchedValues.avatar_url} />
                      <AvatarFallback className="bg-neutral-600">
                        <Bot className="w-5 h-5 text-neutral-300" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
              </div>

              {/* Heading */}
              <div>
                <Label htmlFor="heading" className="text-foreground">
                  Heading
                </Label>
                <Input
                  id="heading"
                  {...register("heading")}
                  className="bg-background border-border text-foreground"
                  placeholder="Welcome! How can I help?"
                />
              </div>

              {/* Subheading */}
              <div>
                <Label htmlFor="subheading" className="text-foreground">
                  Subheading
                </Label>
                <Input
                  id="subheading"
                  {...register("subheading")}
                  className="bg-background border-border text-foreground"
                  placeholder="I'm here to assist you"
                />
              </div>

              {/* Avatar */}
              <div>
                <Label htmlFor="avatar_url" className="text-foreground">
                  Avatar URL
                </Label>
                <div className="flex items-center space-x-3">
                  <Input
                    id="avatar_url"
                    {...register("avatar_url")}
                    className="bg-background border-border text-foreground flex-1"
                    placeholder="https://example.com/avatar.png"
                  />
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={watchedValues.avatar_url} />
                    <AvatarFallback className="bg-neutral-600">
                      <Bot className="w-5 h-5 text-neutral-300" />
                    </AvatarFallback>
                  </Avatar>
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
                  placeholder="You are a helpful AI assistant..."
                />
                {errors.system_prompt && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.system_prompt.message}
                  </p>
                )}
              </div>

              {/* UI Customization Section */}
              <div className="border-t border-border pt-6">
                <h4 className="text-lg font-semibold text-foreground mb-4">UI Customization</h4>
                
                {/* Chat Name */}
                <div className="mb-4">
                  <Label htmlFor="chat_name" className="text-foreground">
                    Display Name
                  </Label>
                  <Input
                    id="chat_name"
                    {...register("chat_name")}
                    className="bg-background border-border text-foreground"
                    placeholder="AI Assistant"
                  />
                </div>

                {/* Avatar Upload/Change */}
                <div className="mb-4">
                  <Label className="text-foreground mb-2 block">
                    Avatar
                  </Label>
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
                        className="bg-background border-border text-foreground mb-2"
                        placeholder="https://example.com/avatar.png"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                setValue('avatar_url', e.target?.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          };
                          input.click();
                        }}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Image
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Color Customization */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="chat_bg_color" className="text-foreground">
                      Chat Background
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="chat_bg_color"
                        type="color"
                        {...register("chat_bg_color")}
                        className="w-12 h-10 p-1 border-border"
                      />
                      <Input
                        {...register("chat_bg_color")}
                        className="bg-background border-border text-foreground flex-1"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="chat_border_color" className="text-foreground">
                      Border Color
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="chat_border_color"
                        type="color"
                        {...register("chat_border_color")}
                        className="w-12 h-10 p-1 border-border"
                      />
                      <Input
                        {...register("chat_border_color")}
                        className="bg-background border-border text-foreground flex-1"
                        placeholder="#e5e7eb"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="user_msg_color" className="text-foreground">
                      User Message
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="user_msg_color"
                        type="color"
                        {...register("user_msg_color")}
                        className="w-12 h-10 p-1 border-border"
                      />
                      <Input
                        {...register("user_msg_color")}
                        className="bg-background border-border text-foreground flex-1"
                        placeholder="#3b82f6"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bot_msg_color" className="text-foreground">
                      Bot Message
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="bot_msg_color"
                        type="color"
                        {...register("bot_msg_color")}
                        className="w-12 h-10 p-1 border-border"
                      />
                      <Input
                        {...register("bot_msg_color")}
                        className="bg-background border-border text-foreground flex-1"
                        placeholder="#f3f4f6"
                      />
                    </div>
                  </div>
                </div>
              </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Chat Preview */}
        <div 
          className="lg:col-span-2 flex flex-col"
          style={{
            backgroundColor: chatBgColor || '#ffffff',
            border: `2px solid ${chatBorderColor || '#e5e7eb'}`,
            borderRadius: '12px'
          }}
        >
          {/* Chat Header */}
          <div 
            className="p-6 border-b"
            style={{ borderColor: chatBorderColor || '#e5e7eb' }}
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
                  {chatName || watchedValues.heading || agent?.heading || "Chat Preview"}
                </h2>
                <p className="text-muted-foreground">
                  {watchedValues.subheading ||
                    agent?.subheading ||
                    "Test your chatbot in real-time"}
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

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center space-x-2">
                    <div className="flex items-start space-x-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-muted">
                          <Bot className="w-4 h-4 text-muted-foreground" />
                        </AvatarFallback>
                      </Avatar>
                      <div 
                        className="p-3 rounded-lg"
                        style={{
                          backgroundColor: watchedValues.bot_msg_color || '#f3f4f6'
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
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>

          {/* Chat Input */}
          <div 
            className="p-6 border-t"
            style={{ borderColor: watchedValues.chat_border_color || '#e5e7eb' }}
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
                  borderColor: chatBorderColor || '#e5e7eb'
                }}
              />
              <Button
                onClick={sendMessage}
                disabled={!currentMessage.trim() || isTyping}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Export Code Modal */}
      <Dialog open={exportModalOpen} onOpenChange={setExportModalOpen}>
        <DialogContent className="bg-card border-border text-card-foreground max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">
                Export Code
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExportModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          <Tabs defaultValue="react" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted">
              <TabsTrigger
                value="react"
                className="data-[state=active]:bg-background"
              >
                React Component
              </TabsTrigger>
              <TabsTrigger
                value="html"
                className="data-[state=active]:bg-background"
              >
                HTML/JavaScript
              </TabsTrigger>
            </TabsList>

            <TabsContent value="react" className="mt-4">
              <div className="relative">
                <Button
                  onClick={() => copyToClipboard(generateReactCode())}
                  className="absolute top-2 right-2 z-10"
                  size="sm"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
                <ScrollArea className="h-96 w-full rounded-md border border-border bg-muted/20 p-4">
                  <pre className="text-sm text-muted-foreground">
                    <code>{generateReactCode()}</code>
                  </pre>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="html" className="mt-4">
              <div className="relative">
                <Button
                  onClick={() => copyToClipboard(generateHtmlCode())}
                  className="absolute top-2 right-2 z-10"
                  size="sm"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
                <ScrollArea className="h-96 w-full rounded-md border border-border bg-muted/20 p-4">
                  <pre className="text-sm text-muted-foreground">
                    <code>{generateHtmlCode()}</code>
                  </pre>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
