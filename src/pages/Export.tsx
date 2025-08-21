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
}

export default function ExportPage() {
  const { isSignedIn, isLoaded } = useAuth();
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

  useEffect(() => {
    // Load chatbot customizations from localStorage
    const customizations = localStorage.getItem("chatbotCustomizations");
    const selectedAgent = localStorage.getItem("selectedAgent");

    let config: ChatbotConfig | null = null;

    if (selectedAgent) {
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
        };
        setEmbedName(agent.name || "Portfolio Bot");
        setDescription(
          agent.description || "Customer support chatbot for my website"
        );
      } catch (e) {
        console.log("Error parsing selected agent:", e);
      }
    }

    if (customizations && !config) {
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
        };
      } catch (e) {
        console.log("Error parsing chatbot customizations:", e);
      }
    }

    if (config) {
      setChatbotConfig(config);
      console.log("Loaded chatbot config:", config);
    }
  }, []);

  const generateEmbedScript = () => {
    if (!chatbotConfig || !embedCode) return "";

    // Generate a complete working embed script with all customizations
    const scriptId = `lux-llm-chatbot-${Date.now()}`;

    return `<!-- LuxLLM Customized Chatbot Embed Script -->
<script id="${scriptId}">
(function() {
  'use strict';
  
  // Configuration with all your customizations
  const config = {
    name: '${chatbotConfig.name.replace(/'/g, "\\'")}',
    systemPrompt: '${chatbotConfig.systemPrompt.replace(/'/g, "\\'")}',
    avatarUrl: '${chatbotConfig.avatar || ""}',
    chatBg: '${chatbotConfig.chatBgColor}',
    borderColor: '${chatbotConfig.chatBorderColor}',
    userMsgColor: '${chatbotConfig.userMsgColor}',
    botMsgColor: '${chatbotConfig.botMsgColor}',
    welcomeMessage: '${chatbotConfig.welcomeMessage.replace(/'/g, "\\'")}',
    placeholder: '${chatbotConfig.placeholder.replace(/'/g, "\\'")}',
    apiUrl: 'https://lux-llm-prod.vercel.app/api/public-chat',
    embedCode: '${embedCode}',
    borderRadius: '12px',
    fontFamily: 'Inter, sans-serif'
  };

  // Create chatbot HTML with customizations
  const chatbotHTML = \`
    <div id="lux-llm-chatbot" style="
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 10000;
      font-family: \${config.fontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
        border-radius: \${config.borderRadius};
        display: none;
        flex-direction: column;
        box-shadow: 0 8px 32px rgba(0,0,0,0.12);
      ">
        <!-- Header -->
        <div style="
          padding: 16px;
          background: \${config.userMsgColor};
          color: white;
          border-radius: \${config.borderRadius} \${config.borderRadius} 0 0;
          display: flex;
          align-items: center;
          gap: 12px;
        ">
          \${config.avatarUrl ? \`<img src="\${config.avatarUrl}" style="width: 32px; height: 32px; border-radius: 50%;">\` : '<div style="width: 32px; height: 32px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center;"><span style="font-size: 16px;">🤖</span></div>'}
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
            max-width: 80%;
          ">\${config.welcomeMessage}</div>
        </div>

        <!-- Input -->
        <div style="
          padding: 16px;
          border-top: 1px solid \${config.borderColor};
          background: \${config.chatBg};
          border-radius: 0 0 \${config.borderRadius} \${config.borderRadius};
        ">
          <div style="display: flex; gap: 8px;">
            <input type="text" id="chat-input" placeholder="\${config.placeholder}" style="
              flex: 1;
              padding: 12px;
              border: 1px solid \${config.borderColor};
              border-radius: 6px;
              font-size: 14px;
              outline: none;
              background: \${config.chatBg};
              color: \${config.botMsgColor};
            ">
            <button onclick="sendMessage()" style="
              padding: 12px 16px;
              background: \${config.userMsgColor};
              color: white;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-size: 14px;
              font-weight: 500;
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
          embedCode: config.embedCode
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

  console.log('LuxLLM Customized Chatbot loaded:', config);
})();
</script>`;
  };

  const generateIframeEmbed = () => {
    if (!embedCode) return "";

    return `<iframe src="https://lux-llm-prod.vercel.app/api/embed-preview/${embedCode}" width="400" height="600" frameborder="0" style="border: none; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);"></iframe>`;
  };

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCreateEmbed = async () => {
    // Generate a unique embed code
    const newEmbedCode = `embed-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    setEmbedCode(newEmbedCode);
  };

  const platformIntegrations = [
    { name: "WordPress", description: "Add to header.php or use plugin" },
    { name: "Shopify", description: "Edit theme.liquid file" },
    { name: "Wix", description: "Use HTML embed element" },
    { name: "Squarespace", description: "Code injection in header" },
    { name: "GoDaddy", description: "Website builder custom code" },
    { name: "Google Sites", description: "Embed HTML element" },
    { name: "Joomla", description: "Template customization" },
    { name: "Drupal", description: "Block configuration" },
    { name: "BigCommerce", description: "Theme editor" },
    { name: "Weebly", description: "Custom HTML element" },
    { name: "Unbounce", description: "Page builder code" },
    { name: "Framer", description: "Code component" },
    { name: "Duda", description: "Widget integration" },
    { name: "Ghost", description: "Code injection" },
    { name: "Blogger", description: "Template HTML" },
    { name: "Tumblr", description: "Custom theme" },
    { name: "Yola", description: "HTML widget" },
    { name: "Cargo", description: "Custom code" },
    { name: "Piwigo", description: "Template modification" },
    { name: "LiveJournal", description: "Custom CSS" },
    { name: "Jigsy", description: "HTML editor" },
    { name: "IM Creator", description: "Custom widget" },
  ];

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">
            Please sign in to access Export
          </h1>
          <p className="text-gray-400">
            You need to be authenticated to export your chatbot.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-green-400">LuxLLM</h1>
        </div>

        <nav className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              BUILD
            </h3>
            <ul className="space-y-2">
              <li className="text-gray-300 hover:text-white cursor-pointer">
                Templates
              </li>
              <li className="text-gray-300 hover:text-white cursor-pointer">
                Premium
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              MANAGE
            </h3>
            <ul className="space-y-2">
              <li className="text-gray-300 hover:text-white cursor-pointer">
                My Agents
              </li>
              <li className="text-gray-300 hover:text-white cursor-pointer">
                Customize
              </li>
              <li className="text-green-400 flex items-center gap-2">
                <Code className="w-4 h-4" />
                Export
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              HELP
            </h3>
            <ul className="space-y-2">
              <li className="text-gray-300 hover:text-white cursor-pointer">
                How it Works
              </li>
              <li className="text-gray-300 hover:text-white cursor-pointer">
                Quick Start
              </li>
              <li className="text-gray-300 hover:text-white cursor-pointer">
                Pricing
              </li>
              <li className="text-gray-300 hover:text-white cursor-pointer">
                Blog
              </li>
              <li className="text-gray-300 hover:text-white cursor-pointer">
                Team
              </li>
              <li className="text-gray-300 hover:text-white cursor-pointer">
                Support
              </li>
              <li className="text-gray-300 hover:text-white cursor-pointer">
                About
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Code className="w-8 h-8 text-green-400" />
            <h1 className="text-3xl font-bold text-green-400">
              Export Chatbot
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Seamlessly integrate your AI chatbot into any website with our
            elegant embed solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Chatbot Preview */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Globe className="w-6 h-6 text-green-400" />
                  <CardTitle>Chatbot Preview</CardTitle>
                </div>
                <CardDescription className="text-gray-400">
                  Your customized '{embedName}' chatbot will appear seamlessly
                  on any website where you embed the code below.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {chatbotConfig ? (
                  <div className="w-full h-80 bg-gray-700 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center relative overflow-hidden">
                    {/* Working Chatbot Preview - Exact replica of editor */}
                    <div 
                      className="absolute bottom-4 right-4 w-80 h-64 bg-white rounded-xl shadow-2xl border-2 flex flex-col"
                      style={{
                        backgroundColor: chatbotConfig.chatBgColor,
                        borderColor: chatbotConfig.chatBorderColor,
                        borderRadius: '12px',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      {/* Header */}
                      <div 
                        className="p-3 rounded-t-xl flex items-center justify-between"
                        style={{ backgroundColor: chatbotConfig.userMsgColor }}
                      >
                        <div className="flex items-center gap-2">
                          {chatbotConfig.avatar ? (
                            <img 
                              src={chatbotConfig.avatar} 
                              alt="Avatar" 
                              className="w-6 h-6 rounded-full"
                                                          onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              target.style.display = 'none';
                              const nextElement = target.nextElementSibling as HTMLElement;
                              if (nextElement) nextElement.style.display = 'flex';
                            }}
                            />
                          ) : null}
                          <div 
                            className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center"
                            style={{ display: chatbotConfig.avatar ? 'none' : 'flex' }}
                          >
                            <span className="text-white text-xs">🤖</span>
                          </div>
                          <span className="text-white font-medium text-sm">
                            {chatbotConfig.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-white/80 text-xs">Online</span>
                        </div>
                      </div>
                      
                      {/* Messages */}
                      <div className="flex-1 p-3 overflow-hidden">
                        <div 
                          className="inline-block p-2 rounded-lg text-sm max-w-[80%]"
                          style={{
                            backgroundColor: chatbotConfig.chatBorderColor,
                            color: chatbotConfig.botMsgColor
                          }}
                        >
                          {chatbotConfig.welcomeMessage}
                        </div>
                      </div>
                      
                      {/* Input */}
                      <div className="p-3 border-t border-gray-200">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder={chatbotConfig.placeholder}
                            className="flex-1 px-3 py-2 text-sm border rounded-lg outline-none"
                            style={{
                              borderColor: chatbotConfig.chatBorderColor,
                              backgroundColor: chatbotConfig.chatBgColor,
                              color: chatbotConfig.botMsgColor
                            }}
                          />
                          <button 
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: chatbotConfig.userMsgColor }}
                          >
                            <span className="text-white text-xs">→</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Color Info - Show exact values */}
                    <div className="absolute top-2 left-2 text-xs text-gray-400 bg-gray-800/80 p-2 rounded">
                      <div className="font-medium mb-1">Current Settings:</div>
                      <div>Name: {chatbotConfig.name}</div>
                      <div>Primary: {chatbotConfig.userMsgColor}</div>
                      <div>Background: {chatbotConfig.chatBgColor}</div>
                      <div>Text: {chatbotConfig.botMsgColor}</div>
                      <div>Border: {chatbotConfig.chatBorderColor}</div>
                      <div className="mt-1 text-yellow-400">
                        System: {chatbotConfig.systemPrompt.substring(0, 50)}...
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-80 bg-gray-700 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <Globe className="w-12 h-12 mx-auto mb-2" />
                      <p>No chatbot configuration found</p>
                      <p className="text-sm">
                        Go to /editor to customize your chatbot first
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Create Embed */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Plus className="w-6 h-6 text-green-400" />
                  <CardTitle>Create Embed</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Embed Name
                  </label>
                  <Input
                    value={embedName}
                    onChange={e => setEmbedName(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter embed name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <Textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Max Requests per Hour
                    </label>
                    <Input
                      value={maxRequestsPerHour}
                      onChange={e => setMaxRequestsPerHour(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      type="number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Max Requests per Day
                    </label>
                    <Input
                      value={maxRequestsPerDay}
                      onChange={e => setMaxRequestsPerDay(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      type="number"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleCreateEmbed}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                  disabled={!chatbotConfig}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Embed
                </Button>
                {!chatbotConfig && (
                  <p className="text-sm text-yellow-400 text-center">
                    ⚠️ Please customize your chatbot in the /editor page first
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Script Embed */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Code className="w-6 h-6 text-green-400" />
                  <CardTitle>Script Embed</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <textarea
                    value={generateEmbedScript()}
                    readOnly
                    className="w-full h-32 bg-gray-700 border border-gray-600 rounded-lg p-3 text-sm font-mono text-white resize-none"
                    placeholder="Create an embed first to generate the script..."
                  />
                  <Button
                    onClick={() =>
                      copyToClipboard(generateEmbedScript(), "script")
                    }
                    className="absolute top-2 right-2 bg-green-500 hover:bg-green-600 text-white"
                    size="sm"
                    disabled={!embedCode}
                  >
                    {copied === "script" ? (
                      "Copied!"
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Iframe Embed */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Globe className="w-6 h-6 text-green-400" />
                  <CardTitle>Iframe Embed</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <textarea
                    value={generateIframeEmbed()}
                    readOnly
                    className="w-full h-20 bg-gray-700 border border-gray-600 rounded-lg p-3 text-sm font-mono text-white resize-none"
                    placeholder="Create an embed first to generate the iframe..."
                  />
                  <Button
                    onClick={() =>
                      copyToClipboard(generateIframeEmbed(), "iframe")
                    }
                    className="absolute top-2 right-2 bg-green-500 hover:bg-green-600 text-white"
                    size="sm"
                    disabled={!embedCode}
                  >
                    {copied === "iframe" ? (
                      "Copied!"
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Test Your Embed */}
            {embedCode && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Test Your Embed</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-700 border border-gray-600 rounded-lg p-3">
                    <p className="text-sm text-gray-300">
                      Your embed code: {embedCode}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => window.open(`https://lux-llm-prod.vercel.app/api/embed-preview/${embedCode}`, '_blank')}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview Embed
                    </Button>
                    <Button 
                      onClick={() => copyToClipboard(embedCode, "embedCode")}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Embed Code
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* API Configuration */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>API Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-700 border border-green-500 rounded-lg p-4">
                  <p className="text-sm text-gray-300">
                    <strong className="text-green-400">Important:</strong> The
                    embed code calls an API endpoint (
                    <code className="text-green-400">
                      https://lux-llm-prod.vercel.app/api/public-chat
                    </code>
                    ) for handling chat requests, tracking usage, and storing
                    conversations.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Live Test Chatbot */}
        {chatbotConfig && (
          <div className="mt-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Test Your Chatbot Live
              </h2>
              <p className="text-gray-400">
                Try out your customized chatbot right here before embedding it
              </p>
            </div>
            
            <div className="max-w-md mx-auto">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-0">
                  <div 
                    className="w-full h-96 rounded-xl flex flex-col"
                    style={{
                      backgroundColor: chatbotConfig.chatBgColor,
                      borderColor: chatbotConfig.chatBorderColor,
                      borderRadius: '12px',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    {/* Header */}
                    <div 
                      className="p-3 rounded-t-xl flex items-center justify-between"
                      style={{ backgroundColor: chatbotConfig.userMsgColor }}
                    >
                      <div className="flex items-center gap-2">
                        {chatbotConfig.avatar ? (
                          <img 
                            src={chatbotConfig.avatar} 
                            alt="Avatar" 
                            className="w-6 h-6 rounded-full"
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              target.style.display = 'none';
                              const nextElement = target.nextElementSibling as HTMLElement;
                              if (nextElement) nextElement.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center"
                          style={{ display: chatbotConfig.avatar ? 'none' : 'flex' }}
                        >
                          <span className="text-white text-xs">🤖</span>
                        </div>
                        <span className="text-white font-medium text-sm">
                          {chatbotConfig.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-white/80 text-xs">Online</span>
                      </div>
                    </div>
                    
                    {/* Messages */}
                    <div className="flex-1 p-3 overflow-y-auto">
                      <div 
                        className="inline-block p-2 rounded-lg text-sm max-w-[80%]"
                        style={{
                          backgroundColor: chatbotConfig.chatBorderColor,
                          color: chatbotConfig.botMsgColor
                        }}
                      >
                        {chatbotConfig.welcomeMessage}
                      </div>
                    </div>
                    
                    {/* Input */}
                    <div className="p-3 border-t border-gray-200">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder={chatbotConfig.placeholder}
                          className="flex-1 px-3 py-2 text-sm border rounded-lg outline-none"
                          style={{
                            borderColor: chatbotConfig.chatBorderColor,
                            backgroundColor: chatbotConfig.chatBgColor,
                            color: chatbotConfig.botMsgColor
                          }}
                        />
                        <button 
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: chatbotConfig.userMsgColor }}
                        >
                          <span className="text-white text-xs">→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Platform Integrations */}
        <div className="mt-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Platform Integrations
            </h2>
            <p className="text-gray-400">
              Step-by-step instructions for embedding your chatbot on popular
              platforms
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {platformIntegrations.map((platform, index) => (
              <Card
                key={index}
                className="bg-gray-800 border-gray-700 hover:border-green-500 transition-colors cursor-pointer"
              >
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-gray-700 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="font-medium text-white text-sm mb-1">
                    {platform.name}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {platform.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
