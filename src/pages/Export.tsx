"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Copy, Check, MessageCircle, Zap, Code, Globe } from "lucide-react";
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

export default function ExportPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const [copied, setCopied] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(
    null
  );
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

  const embedScript = generateEmbedScript(config);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(embedScript);
      setCopied(true);
      toast.success("Script copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const integrations = [
    {
      name: "Webflow",
      logo: "/placeholder.svg?height=40&width=40",
      category: "No-Code",
      difficulty: "Easy",
      steps: [
        "Open your Webflow project",
        "Go to Project Settings > Custom Code",
        "Paste the embed script in the Head Code section",
        "Publish your site to see the chatbot live",
      ],
    },
    {
      name: "WordPress",
      logo: "/placeholder.svg?height=40&width=40",
      category: "CMS",
      difficulty: "Easy",
      steps: [
        "Access your WordPress admin dashboard",
        "Install a custom code plugin or use theme editor",
        "Add the embed script to your header.php file",
        "Save changes and view your site",
      ],
    },
    {
      name: "Bubble",
      logo: "/placeholder.svg?height=40&width=40",
      category: "No-Code",
      difficulty: "Easy",
      steps: [
        "Open your Bubble app editor",
        "Go to Settings > SEO/metatags",
        "Add the script to the HTML header section",
        "Deploy your app to production",
      ],
    },
    {
      name: "Wix",
      logo: "/placeholder.svg?height=40&width=40",
      category: "Website Builder",
      difficulty: "Easy",
      steps: [
        "Open your Wix site editor",
        "Add an HTML embed element to your page",
        "Paste the embed script into the element",
        "Publish your site to activate the chatbot",
      ],
    },
    {
      name: "Squarespace",
      logo: "/placeholder.svg?height=40&width=40",
      category: "CMS",
      difficulty: "Easy",
      steps: [
        "Log into your Squarespace account",
        "Go to Settings > Advanced > Code Injection",
        "Paste the script in the Header section",
        "Save and your chatbot will appear site-wide",
      ],
    },
    {
      name: "Notion",
      logo: "/placeholder.svg?height=40&width=40",
      category: "No-Code",
      difficulty: "Medium",
      steps: [
        "Open your Notion page",
        "Type /embed to add an embed block",
        "Enter your widget URL in the embed",
        "Resize and position as needed",
      ],
    },
    {
      name: "Framer",
      logo: "/placeholder.svg?height=40&width=40",
      category: "No-Code",
      difficulty: "Easy",
      steps: [
        "Open your Framer project",
        "Add a Code component to your page",
        "Paste the embed script",
        "Customize positioning and styling",
      ],
    },
    {
      name: "Carrd",
      logo: "/placeholder.svg?height=40&width=40",
      category: "Website Builder",
      difficulty: "Easy",
      steps: [
        "Edit your Carrd site",
        "Add an Embed element",
        "Paste the script code",
        "Publish your site",
      ],
    },
    {
      name: "Shopify",
      logo: "/placeholder.svg?height=40&width=40",
      category: "E-commerce",
      difficulty: "Medium",
      steps: [
        "Access your Shopify admin",
        "Go to Online Store > Themes",
        "Edit code and find theme.liquid",
        "Add script before closing </head> tag",
      ],
    },
    {
      name: "React",
      logo: "/placeholder.svg?height=40&width=40",
      category: "Framework",
      difficulty: "Advanced",
      steps: [
        "Install the widget package via npm",
        "Import the component in your React app",
        "Add the component to your JSX",
        "Configure props and styling",
      ],
    },
    {
      name: "Next.js",
      logo: "/placeholder.svg?height=40&width=40",
      category: "Framework",
      difficulty: "Advanced",
      steps: [
        "Add the script to your _document.js file",
        "Or use the Script component in your layout",
        "Configure loading strategy",
        "Deploy to see changes",
      ],
    },
    {
      name: "Vue.js",
      logo: "/placeholder.svg?height=40&width=40",
      category: "Framework",
      difficulty: "Advanced",
      steps: [
        "Add script to your index.html",
        "Or create a Vue component wrapper",
        "Mount the widget in your app",
        "Handle lifecycle events",
      ],
    },
    {
      name: "Angular",
      logo: "/placeholder.svg?height=40&width=40",
      category: "Framework",
      difficulty: "Advanced",
      steps: [
        "Add script to index.html",
        "Create an Angular service wrapper",
        "Inject into your components",
        "Handle Angular lifecycle",
      ],
    },
    {
      name: "Drupal",
      logo: "/placeholder.svg?height=40&width=40",
      category: "CMS",
      difficulty: "Medium",
      steps: [
        "Log into Drupal admin",
        "Go to Structure > Blocks",
        "Create a custom HTML block",
        "Add script and place in region",
      ],
    },
    {
      name: "Joomla",
      logo: "/placeholder.svg?height=40&width=40",
      category: "CMS",
      difficulty: "Medium",
      steps: [
        "Access Joomla administrator",
        "Go to Extensions > Templates",
        "Edit your active template",
        "Add script to index.php",
      ],
    },
    {
      name: "Ghost",
      logo: "/placeholder.svg?height=40&width=40",
      category: "CMS",
      difficulty: "Easy",
      steps: [
        "Go to Ghost admin panel",
        "Navigate to Settings > Code injection",
        "Add script to Site Header",
        "Save to activate across all pages",
      ],
    },
    {
      name: "Webflow CMS",
      logo: "/placeholder.svg?height=40&width=40",
      category: "CMS",
      difficulty: "Easy",
      steps: [
        "Open Webflow Designer",
        "Go to CMS Collections",
        "Add embed field to collection",
        "Insert script in collection template",
      ],
    },
    {
      name: "Elementor",
      logo: "/placeholder.svg?height=40&width=40",
      category: "Page Builder",
      difficulty: "Easy",
      steps: [
        "Edit page with Elementor",
        "Add HTML widget to page",
        "Paste the embed script",
        "Update page to publish changes",
      ],
    },
    {
      name: "Divi",
      logo: "/placeholder.svg?height=40&width=40",
      category: "Page Builder",
      difficulty: "Easy",
      steps: [
        "Open Divi Builder",
        "Add Code module to your page",
        "Paste script in the code area",
        "Save and view your page",
      ],
    },
    {
      name: "HubSpot",
      logo: "/placeholder.svg?height=40&width=40",
      category: "CRM",
      difficulty: "Medium",
      steps: [
        "Go to HubSpot Settings",
        "Navigate to Website > Pages",
        "Edit your page template",
        "Add script to header HTML",
      ],
    },
  ];

  const steps = [
    {
      title: "Copy the Script",
      description: "Copy the embed script from the code box above",
      icon: Copy,
    },
    {
      title: "Choose Platform",
      description: "Select your preferred platform from our integrations",
      icon: Globe,
    },
    {
      title: "Add to Site",
      description: "Paste the script into your website's HTML",
      icon: Code,
    },
    {
      title: "Go Live",
      description: "Your chatbot is now live and ready to engage users",
      icon: Zap,
    },
  ];

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <div>Please sign in to access the export page.</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight">Export & Integrate</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Seamlessly embed, preview, and integrate across your favorite platforms.
          </p>
        </div>
      </section>

      {/* Embedded Script Box */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Code className="w-5 h-5 text-blue-600" />
                Embed Script
              </CardTitle>
              <CardDescription>Copy this script and add it to your website to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-gray-50 p-4 rounded-lg border text-sm font-mono overflow-x-auto">
                  <code className="text-gray-900">{embedScript}</code>
                </pre>
                <Button
                  onClick={copyToClipboard}
                  size="sm"
                  className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700"
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Implementation Guide */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Implementation Guide
            </h2>
            <p className="text-gray-600 text-lg">
              Follow these simple steps to get your chatbot live
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <Badge variant="secondary" className="mb-3">
                    Step {index + 1}
                  </Badge>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Chatbot Preview */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Live Preview
            </h2>
            <p className="text-gray-600 text-lg">
              See how your chatbot will look on your website
            </p>
          </div>
          <Card className="max-w-md mx-auto shadow-2xl border-gray-200 hover:shadow-3xl transition-all duration-500">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-lg p-3 text-sm">
                      {config.welcome_message}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 justify-end">
                  <div className="flex-1 text-right">
                    <div className="bg-blue-600 text-white rounded-lg p-3 text-sm inline-block">
                      I'd like to learn more about your services
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-xs">👤</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-lg p-3 text-sm">
                      I'd be happy to help! What specific area interests you
                      most?
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Integrations Guide */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Platform Integrations
            </h2>
            <p className="text-gray-600 text-lg">
              Choose your platform and get step-by-step integration instructions
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {integrations.map((integration, index) => (
              <Dialog key={integration.name}>
                <DialogTrigger asChild>
                  <Card
                    className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 border-gray-200"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <CardContent className="p-4 text-center space-y-3">
                      <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                        <img
                          src={integration.logo || "/placeholder.svg"}
                          alt={`${integration.name} logo`}
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {integration.name}
                        </h3>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {integration.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">
                        Click for integration guide
                      </p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                        <img
                          src={integration.logo || "/placeholder.svg"}
                          alt={`${integration.name} logo`}
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                      <div>
                        <DialogTitle className="text-lg font-semibold">
                          {integration.name} Integration
                        </DialogTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {integration.category}
                          </Badge>
                          <Badge
                            variant={
                              integration.difficulty === "Easy"
                                ? "default"
                                : integration.difficulty === "Medium"
                                ? "secondary"
                                : "destructive"
                            }
                            className="text-xs"
                          >
                            {integration.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <DialogDescription className="text-sm text-gray-600">
                      Step-by-step guide to integrate your chatbot with{" "}
                      {integration.name}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <Code className="w-4 h-4" />
                        Instructions
                      </h4>
                    </div>
                    <div className="space-y-3">
                      {integration.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                            {stepIndex + 1}
                          </div>
                          <p className="text-sm text-gray-900 leading-relaxed">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      size="sm"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Visit {integration.name}
                    </Button>
                    <Button
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      size="sm"
                    >
                      Start Integration
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold text-gray-900">
            Ready to Export?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start engaging with your users today. It takes less than 5 minutes
            to get up and running.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <Zap className="w-5 h-5 mr-2" />
            Get Started Now
          </Button>
        </div>
      </section>
    </div>
  );
}
