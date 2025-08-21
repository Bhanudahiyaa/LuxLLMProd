import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Eye, Download } from "lucide-react";
import { toast } from "react-hot-toast";

interface ChatbotConfig {
  name: string;
  system_prompt: string;
  avatar_url: string;
  chat_bg: string;
  border_color: string;
  user_msg_color: string;
  bot_msg_color: string;
  welcome_message: string;
  placeholder: string;
}

export default function Export() {
  const { isLoaded, isSignedIn } = useAuth();
  const [config, setConfig] = useState<ChatbotConfig>({
    name: "My AI Assistant",
    system_prompt: "You are a helpful AI assistant.",
    avatar_url: "",
    chat_bg: "#ffffff",
    border_color: "#e5e7eb",
    user_msg_color: "#3b82f6",
    bot_msg_color: "#1f2937",
    welcome_message: "Hello! How can I help you today?",
    placeholder: "Type your message...",
  });

  const [generatedScript, setGeneratedScript] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // Load current form state from localStorage
  useEffect(() => {
    const savedCustomizations = localStorage.getItem("chatbotCustomizations");
    if (savedCustomizations) {
      try {
        const parsed = JSON.parse(savedCustomizations);
        setConfig(prev => ({
          ...prev,
          chat_bg: parsed.chat_bg || prev.chat_bg,
          border_color: parsed.border_color || prev.border_color,
          user_msg_color: parsed.user_msg_color || prev.user_msg_color,
          bot_msg_color: parsed.bot_msg_color || prev.bot_msg_color,
        }));
      } catch (e) {
        console.log("No saved customizations found");
      }
    }

    // Also try to get from selectedAgent
    const selectedAgent = localStorage.getItem("selectedAgent");
    if (selectedAgent) {
      try {
        const parsed = JSON.parse(selectedAgent);
        setConfig(prev => ({
          ...prev,
          name: parsed.name || prev.name,
          system_prompt: parsed.system_prompt || prev.system_prompt,
          avatar_url: parsed.avatar_url || prev.avatar_url,
          chat_bg: parsed.chat_bg || prev.chat_bg,
          border_color: parsed.border_color || prev.border_color,
          user_msg_color: parsed.user_msg_color || prev.user_msg_color,
          bot_msg_color: parsed.bot_msg_color || prev.bot_msg_color,
        }));
      } catch (e) {
        console.log("No selected agent found");
      }
    }
  }, []);

  // Generate the embed script with all customizations
  const generateEmbedScript = (config: ChatbotConfig): string => {
    const scriptId = `lux-llm-chatbot-${Date.now()}`;
    
    return `<!-- LuxLLM Chatbot Embed Script -->
<script id="${scriptId}">
(function() {
  'use strict';
  
  // Configuration with all your customizations
  const config = {
    name: '${config.name.replace(/'/g, "\\'")}',
    systemPrompt: '${config.system_prompt.replace(/'/g, "\\'")}',
    avatarUrl: '${config.avatar_url || ""}',
    chatBg: '${config.chat_bg}',
    borderColor: '${config.border_color}',
    userMsgColor: '${config.user_msg_color}',
    botMsgColor: '${config.bot_msg_color}',
    welcomeMessage: '${config.welcome_message.replace(/'/g, "\\'")}',
    placeholder: '${config.placeholder.replace(/'/g, "\\'")}',
    apiUrl: '${window.location.origin}/api/public-chat'
  };

  // Create chatbot HTML
  const chatbotHTML = \`
    <div id="lux-llm-chatbot" style="
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ">
      <!-- Chat Button -->
      <div id="chat-button" style="
        width: 60px;
        height: 60px;
        background: \${config.userMsgColor};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: transform 0.2s;
      " onclick="toggleChat()">
        <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
        </svg>
      </div>

      <!-- Chat Window -->
      <div id="chat-window" style="
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 350px;
        height: 500px;
        background: \${config.chatBg};
        border: 2px solid \${config.borderColor};
        border-radius: 12px;
        display: none;
        flex-direction: column;
        box-shadow: 0 8px 32px rgba(0,0,0,0.12);
      ">
        <!-- Header -->
        <div style="
          padding: 16px;
          background: \${config.userMsgColor};
          color: white;
          border-radius: 10px 10px 0 0;
          display: flex;
          align-items: center;
          gap: 12px;
        ">
          \${config.avatarUrl ? \`<img src="\${config.avatarUrl}" style="width: 32px; height: 32px; border-radius: 50%;">\` : ''}
          <div>
            <div style="font-weight: 600; font-size: 16px;">\${config.name}</div>
            <div style="font-size: 12px; opacity: 0.8;">AI Assistant</div>
          </div>
        </div>

        <!-- Messages -->
        <div id="chat-messages" style="
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          background: \${config.chatBg};
        ">
          <div style="
            padding: 12px 16px;
            background: \${config.borderColor};
            border-radius: 8px;
            color: \${config.botMsgColor};
            font-size: 14px;
            line-height: 1.4;
          ">\${config.welcomeMessage}</div>
        </div>

        <!-- Input -->
        <div style="
          padding: 16px;
          border-top: 1px solid \${config.borderColor};
          background: \${config.chatBg};
          border-radius: 0 0 10px 10px;
        ">
          <div style="display: flex; gap: 8px;">
            <input type="text" id="chat-input" placeholder="\${config.placeholder}" style="
              flex: 1;
              padding: 12px;
              border: 1px solid \${config.borderColor};
              border-radius: 6px;
              font-size: 14px;
              outline: none;
            ">
            <button onclick="sendMessage()" style="
              padding: 12px 16px;
              background: \${config.userMsgColor};
              color: white;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-size: 14px;
            ">Send</button>
          </div>
        </div>
      </div>
    </div>
  \`;

  // Insert chatbot into page
  document.body.insertAdjacentHTML('beforeend', chatbotHTML);

  // Chat functionality
  let isOpen = false;

  window.toggleChat = function() {
    const chatWindow = document.getElementById('chat-window');
    const chatButton = document.getElementById('chat-button');
    
    if (isOpen) {
      chatWindow.style.display = 'none';
      chatButton.style.transform = 'scale(1)';
    } else {
      chatWindow.style.display = 'flex';
      chatButton.style.transform = 'scale(1.1)';
    }
    isOpen = !isOpen;
  };

  window.sendMessage = async function() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, 'user');
    input.value = '';

    // Show typing indicator
    addTypingIndicator();

    try {
      // Send to API
      const response = await fetch(config.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message,
          systemPrompt: config.systemPrompt,
          embedCode: 'custom-${Date.now()}'
        })
      });

      const data = await response.json();
      
      // Remove typing indicator
      removeTypingIndicator();
      
      // Add bot response
      if (data.response) {
        addMessage(data.response, 'bot');
      } else {
        addMessage('Sorry, I encountered an error. Please try again.', 'bot');
      }
    } catch (error) {
      removeTypingIndicator();
      addMessage('Sorry, I encountered an error. Please try again.', 'bot');
    }
  };

  function addMessage(text, sender) {
    const messages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = \`
      margin: 8px 0;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      line-height: 1.4;
      max-width: 80%;
      \${sender === 'user' 
        ? \`background: \${config.userMsgColor}; color: white; margin-left: auto;\`
        : \`background: \${config.borderColor}; color: \${config.botMsgColor};\`
      }
    \`;
    messageDiv.textContent = text;
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
  }

  function addTypingIndicator() {
    const messages = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.style.cssText = \`
      margin: 8px 0;
      padding: 12px 16px;
      background: \${config.borderColor};
      color: \${config.botMsgColor};
      border-radius: 8px;
      font-size: 14px;
      font-style: italic;
    \`;
    typingDiv.textContent = 'Typing...';
    messages.appendChild(typingDiv);
    messages.scrollTop = messages.scrollHeight;
  }

  function removeTypingIndicator() {
    const typing = document.getElementById('typing-indicator');
    if (typing) typing.remove();
  }

  // Enter key support
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && document.activeElement.id === 'chat-input') {
      sendMessage();
    }
  });

  console.log('LuxLLM Chatbot loaded with customizations:', config);
})();
</script>`;
  };

  // Generate script when config changes
  useEffect(() => {
    const script = generateEmbedScript(config);
    setGeneratedScript(script);
    
    // Create preview URL
    const previewHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Chatbot Preview</title>
    <style>
        body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
        .preview-container { max-width: 800px; margin: 0 auto; }
        .preview-title { text-align: center; margin-bottom: 30px; }
        .preview-info { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="preview-container">
        <div class="preview-title">
            <h1>Chatbot Preview</h1>
            <p>This is how your chatbot will look on any website</p>
        </div>
        <div class="preview-info">
            <h3>Configuration:</h3>
            <p><strong>Name:</strong> ${config.name}</p>
            <p><strong>Colors:</strong> User: ${config.user_msg_color}, Bot: ${config.bot_msg_color}</p>
            <p><strong>Background:</strong> ${config.chat_bg}</p>
            <p><strong>Border:</strong> ${config.border_color}</p>
        </div>
    </div>
    ${script}
</body>
</html>`;
    
    const blob = new Blob([previewHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
  }, [config]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const downloadScript = () => {
    const blob = new Blob([generatedScript], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lux-llm-chatbot.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Script downloaded!");
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <div>Please sign in to access the export page.</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Export Your Chatbot</h1>
        <p className="text-gray-600">
          Generate a script tag with all your customizations and see a live preview.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Chatbot Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Chatbot Name</Label>
              <Input
                id="name"
                value={config.name}
                onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                placeholder="My AI Assistant"
              />
            </div>

            <div>
              <Label htmlFor="system_prompt">System Prompt</Label>
              <Textarea
                id="system_prompt"
                value={config.system_prompt}
                onChange={(e) => setConfig(prev => ({ ...prev, system_prompt: e.target.value }))}
                placeholder="You are a helpful AI assistant."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="welcome_message">Welcome Message</Label>
              <Input
                id="welcome_message"
                value={config.welcome_message}
                onChange={(e) => setConfig(prev => ({ ...prev, welcome_message: e.target.value }))}
                placeholder="Hello! How can I help you today?"
              />
            </div>

            <div>
              <Label htmlFor="placeholder">Input Placeholder</Label>
              <Input
                id="placeholder"
                value={config.placeholder}
                onChange={(e) => setConfig(prev => ({ ...prev, placeholder: e.target.value }))}
                placeholder="Type your message..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="chat_bg">Chat Background</Label>
                <div className="flex gap-2">
                  <Input
                    id="chat_bg"
                    type="color"
                    value={config.chat_bg}
                    onChange={(e) => setConfig(prev => ({ ...prev, chat_bg: e.target.value }))}
                  />
                  <Input
                    value={config.chat_bg}
                    onChange={(e) => setConfig(prev => ({ ...prev, chat_bg: e.target.value }))}
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="border_color">Border Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="border_color"
                    type="color"
                    value={config.border_color}
                    onChange={(e) => setConfig(prev => ({ ...prev, border_color: e.target.value }))}
                  />
                  <Input
                    value={config.border_color}
                    onChange={(e) => setConfig(prev => ({ ...prev, border_color: e.target.value }))}
                    placeholder="#e5e7eb"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="user_msg_color">User Message Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="user_msg_color"
                    type="color"
                    value={config.user_msg_color}
                    onChange={(e) => setConfig(prev => ({ ...prev, user_msg_color: e.target.value }))}
                  />
                  <Input
                    value={config.user_msg_color}
                    onChange={(e) => setConfig(prev => ({ ...prev, user_msg_color: e.target.value }))}
                    placeholder="#3b82f6"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bot_msg_color">Bot Message Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="bot_msg_color"
                    type="color"
                    value={config.bot_msg_color}
                    onChange={(e) => setConfig(prev => ({ ...prev, bot_msg_color: e.target.value }))}
                  />
                  <Input
                    value={config.bot_msg_color}
                    onChange={(e) => setConfig(prev => ({ ...prev, bot_msg_color: e.target.value }))}
                    placeholder="#1f2937"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Export & Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="script" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="script">Script Tag</TabsTrigger>
                <TabsTrigger value="preview">Live Preview</TabsTrigger>
                <TabsTrigger value="download">Download</TabsTrigger>
              </TabsList>

              <TabsContent value="script" className="space-y-4">
                <div>
                  <Label>Generated Script Tag</Label>
                  <div className="relative">
                    <Textarea
                      value={generatedScript}
                      readOnly
                      rows={15}
                      className="font-mono text-sm"
                    />
                    <Button
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(generatedScript)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Copy this script tag and paste it into any website's HTML to embed your chatbot.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="space-y-4">
                <div>
                  <Label>Live Preview</Label>
                  <div className="border rounded-lg overflow-hidden">
                    <iframe
                      src={previewUrl}
                      className="w-full h-96"
                      title="Chatbot Preview"
                    />
                  </div>
                  <Button
                    className="w-full mt-4"
                    onClick={() => window.open(previewUrl, '_blank')}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Open Preview in New Tab
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="download" className="space-y-4">
                <div>
                  <Label>Download Script File</Label>
                  <p className="text-sm text-gray-600 mb-4">
                    Download the JavaScript file to host on your own server.
                  </p>
                  <Button
                    className="w-full"
                    onClick={downloadScript}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download lux-llm-chatbot.js
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
