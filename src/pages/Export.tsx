import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, ExternalLink, Code, Globe, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { integrations, type Integration } from "@/lib/integrations";
import { IntegrationModal } from "@/components/IntegrationModal";
import { AppSidebar } from "@/components/layout/AppSidebar";
import Navigation from "@/components/Navigation";
import { useAgentService, type Agent } from "@/hooks/agentService";

export default function Export() {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [selectedIntegration, setSelectedIntegration] =
    useState<Integration | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showFullCode, setShowFullCode] = useState(false);
  const [showFullHtmlCode, setShowFullHtmlCode] = useState(false);

  const { getAgentsByUser } = useAgentService();

  // Fetch user's agents and check eligibility
  useEffect(() => {
    let isMounted = true;
    const checkEligibility = async () => {
      try {
        if (isMounted) setLoading(true);

        // Check if we have preview data in localStorage (from editor)
        const previewData = localStorage.getItem("chatbotPreviewData");
        if (previewData && !agentId) {
          try {
            const parsedData = JSON.parse(previewData);
            if (isMounted) {
              setAgent(parsedData);
              setIsPreviewMode(true);
              setLoading(false);
            }
            return;
          } catch (e) {
            console.error("Failed to parse preview data:", e);
            localStorage.removeItem("chatbotPreviewData");
          }
        }

        // If specific agentId is provided, try to fetch that agent
        if (agentId) {
          const agents = await getAgentsByUser();
          const selectedAgent = agents.data?.find(a => a.id === agentId);

          if (selectedAgent) {
            if (isMounted) {
              setAgent(selectedAgent);
              setLoading(false);
            }
            return;
          }
        }

        // If no specific agent or agent not found, check if user has any agents
        const agents = await getAgentsByUser();

        if (!agents.data || agents.data.length === 0) {
          // No agents found, redirect to templates
          toast.info("Please create a chatbot first");
          if (isMounted) setLoading(false);
          navigate("/build/templates", { replace: true });
          return;
        }

        // User has agents but no specific one selected, use the first one
        if (isMounted) {
          setAgent(agents.data[0]);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking eligibility:", error);
        toast.error("Failed to load chatbot data");
        if (isMounted) setLoading(false);
        navigate("/build/templates", { replace: true });
      }
    };

    void checkEligibility();
    return () => {
      isMounted = false;
    };
  }, [agentId, navigate]);

  // Cleanup preview data when component unmounts
  useEffect(() => {
    return () => {
      if (isPreviewMode) {
        localStorage.removeItem("chatbotPreviewData");
      }
    };
  }, [isPreviewMode]);

  // Redirect if no agent
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading chatbot data...</p>
        </div>
      </div>
    );
  }

  if (!agent) {
    return null; // Will redirect in useEffect
  }

  // Helper function to truncate code
  const truncateCode = (code: string, maxLines: number = 8) => {
    const lines = code.split("\n");
    if (lines.length <= maxLines) return code;

    const truncatedLines = lines.slice(0, maxLines);
    return truncatedLines.join("\n") + "\n...";
  };

  // Generate functional embed codes based on actual agent data
  const embedCode = `<script>
(function() {
  // Chatbot configuration for ${agent.name}
  const chatbotConfig = {
    agentId: '${agent.id}',
    name: '${agent.name || "AI Assistant"}',
    avatar: '${agent.avatar_url || ""}',
    systemPrompt: '${agent.system_prompt || "You are a helpful assistant."}',
    colors: {
      background: '${agent.chat_bg_color || "#ffffff"}',
      border: '${agent.chat_border_color || "#e5e7eb"}',
      userMessage: '${agent.user_msg_color || "#3b82f6"}',
      botMessage: '${agent.bot_msg_color || "#f3f4f6"}'
    }
  };

  // Create and inject the chatbot widget
  function createChatbot() {
    // Check if chatbot already exists
    if (document.getElementById('chatbot-widget-${agent.id}')) {
      return;
    }

    // Create container
    const container = document.createElement('div');
    container.id = 'chatbot-widget-${agent.id}';
    container.className = 'chatbot-container';
    document.body.appendChild(container);

    // Create widget
    const widget = document.createElement('div');
    widget.style.cssText = \`
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 350px;
      height: 500px;
      background: \${chatbotConfig.colors.background};
      border: 2px solid \${chatbotConfig.colors.border};
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      font-family: system-ui, -apple-system, sans-serif;
      z-index: 1000;
      display: flex;
      flex-direction: column;
    \`;

    // Header
    const header = document.createElement('div');
    header.style.cssText = \`
      padding: 16px;
      border-bottom: 1px solid \${chatbotConfig.colors.border};
      display: flex;
      align-items: center;
      gap: 8px;
      background: \${chatbotConfig.colors.background};
      border-radius: 12px 12px 0 0;
    \`;

    const avatar = document.createElement('div');
    if (chatbotConfig.avatar) {
      avatar.innerHTML = \`<img src="\${chatbotConfig.avatar}" alt="Avatar" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">\`;
    } else {
      avatar.innerHTML = '<div style="width: 32px; height: 32px; border-radius: 50%; background: #e5e7eb; display: flex; align-items: center; justify-content: center; font-size: 14px;">🤖</div>';
    }

    const title = document.createElement('div');
    title.textContent = chatbotConfig.name;
    title.style.cssText = 'margin: 0; font-size: 16px; font-weight: 600; color: #374151;';

    header.appendChild(avatar);
    header.appendChild(title);

    // Messages container
    const messagesContainer = document.createElement('div');
    messagesContainer.id = 'chat-messages-\${agent.id}';
    messagesContainer.style.cssText = \`
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      background: \${chatbotConfig.colors.background};
    \`;

    // Welcome message
    const welcomeMsg = document.createElement('div');
    welcomeMsg.style.cssText = \`
      background: \${chatbotConfig.colors.botMessage};
      color: #374151;
      padding: 8px 12px;
      border-radius: 8px;
      margin-bottom: 8px;
      max-width: 80%;
      font-size: 14px;
    \`;
    welcomeMsg.textContent = 'Hello! I\\'m ' + chatbotConfig.name + '. How can I help you today?';
    messagesContainer.appendChild(welcomeMsg);

    // Input area
    const inputArea = document.createElement('div');
    inputArea.style.cssText = \`
      padding: 16px;
      border-top: 1px solid \${chatbotConfig.colors.border};
      background: \${chatbotConfig.colors.background};
      border-radius: 0 0 12px 12px;
    \`;

    const inputContainer = document.createElement('div');
    inputContainer.style.cssText = 'display: flex; gap: 8px;';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Type your message...';
    input.style.cssText = \`
      flex: 1;
      padding: 8px 12px;
      border: 1px solid \${chatbotConfig.colors.border};
      border-radius: 6px;
      outline: none;
      font-size: 14px;
    \`;

    const sendButton = document.createElement('button');
    sendButton.textContent = 'Send';
    sendButton.style.cssText = \`
      background: \${chatbotConfig.colors.userMessage};
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
    \`;

    inputContainer.appendChild(input);
    inputContainer.appendChild(sendButton);
    inputArea.appendChild(inputContainer);

    // Assemble widget
    widget.appendChild(header);
    widget.appendChild(messagesContainer);
    widget.appendChild(inputArea);
    container.appendChild(widget);

    // Chat functionality
    let isTyping = false;

    function addMessage(text, isUser = false) {
      const messageDiv = document.createElement('div');
      messageDiv.style.cssText = \`
        background: \${isUser ? chatbotConfig.colors.userMessage : chatbotConfig.colors.botMessage};
        color: \${isUser ? 'white' : '#374151'};
        padding: 8px 12px;
        border-radius: 8px;
        margin-bottom: 8px;
        max-width: 80%;
        margin-left: \${isUser ? 'auto' : '0'};
        margin-right: \${isUser ? '0' : 'auto'};
        font-size: 14px;
        word-wrap: break-word;
      \`;
      messageDiv.textContent = text;
      messagesContainer.appendChild(messageDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async function sendMessage() {
      const message = input.value.trim();
      if (!message || isTyping) return;

      // Add user message
      addMessage(message, true);
      input.value = '';

      // Show typing indicator
      isTyping = true;
      const typingDiv = document.createElement('div');
      typingDiv.id = 'typing-\${agent.id}';
      typingDiv.style.cssText = \`
        background: \${chatbotConfig.colors.botMessage};
        color: #374151;
        padding: 8px 12px;
        border-radius: 8px;
        margin-bottom: 8px;
        max-width: 80%;
        font-size: 14px;
        font-style: italic;
      \`;
      typingDiv.textContent = 'Typing...';
      messagesContainer.appendChild(typingDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;

      try {
        // Send message to your API
        const response = await fetch('https://your-api.com/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            agentId: chatbotConfig.agentId,
            message: message,
            systemPrompt: chatbotConfig.systemPrompt
          })
        });

        const data = await response.json();
        
        // Remove typing indicator
        const typing = document.getElementById('typing-\${agent.id}');
        if (typing) typing.remove();

        // Add bot response
        addMessage(data.response || 'Sorry, I couldn\\'t process your request.');
      } catch (error) {
        // Remove typing indicator
        const typing = document.getElementById('typing-\${agent.id}');
        if (typing) typing.remove();

        // Add error message
        addMessage('Sorry, there was an error processing your request.');
      }

      isTyping = false;
    }

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') sendMessage();
    });

    // Close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.cssText = \`
      position: absolute;
      top: 8px;
      right: 8px;
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #6b7280;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    \`;
    closeButton.addEventListener('click', function() {
      widget.style.display = 'none';
    });
    widget.appendChild(closeButton);
  }

  // Initialize chatbot when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createChatbot);
  } else {
    createChatbot();
  }
})();
</script>`;

  // Complete functional HTML/JS widget
  const htmlEmbedCode = `<div id="chatbot-widget-${
    agent.id
  }" class="chatbot-container"></div>
<script>
(function() {
  // Chatbot configuration
  const config = {
    agentId: '${agent.id}',
    name: '${agent.name || "AI Assistant"}',
    avatar: '${agent.avatar_url || ""}',
    systemPrompt: '${agent.system_prompt || "You are a helpful assistant."}',
    colors: {
      background: '${agent.chat_bg_color || "#ffffff"}',
      border: '${agent.chat_border_color || "#e5e7eb"}',
      userMessage: '${agent.user_msg_color || "#3b82f6"}',
      botMessage: '${agent.bot_msg_color || "#f3f4f6"}'
    }
  };

  // Create chatbot widget
  function createChatbot() {
    const container = document.getElementById('chatbot-widget-${agent.id}');
    if (!container) return;

    const widget = document.createElement('div');
    widget.style.cssText = \`
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 350px;
      height: 500px;
      background: \${config.colors.background};
      border: 2px solid \${config.colors.border};
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      font-family: system-ui, -apple-system, sans-serif;
      z-index: 1000;
      display: flex;
      flex-direction: column;
    \`;

    // Header
    const header = document.createElement('div');
    header.style.cssText = \`
      padding: 16px;
      border-bottom: 1px solid \${config.colors.border};
      display: flex;
      align-items: center;
      gap: 8px;
      background: \${config.colors.background};
      border-radius: 12px 12px 0 0;
    \`;

    const avatar = document.createElement('div');
    if (config.avatar) {
      avatar.innerHTML = \`<img src="\${config.avatar}" alt="Avatar" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">\`;
    } else {
      avatar.innerHTML = '<div style="width: 32px; height: 32px; border-radius: 50%; background: #e5e7eb; display: flex; align-items: center; justify-content: center; font-size: 14px;">🤖</div>';
    }

    const title = document.createElement('div');
    title.textContent = config.name;
    title.style.cssText = 'margin: 0; font-size: 16px; font-weight: 600; color: #374151;';

    header.appendChild(avatar);
    header.appendChild(title);

    // Messages container
    const messagesContainer = document.createElement('div');
    messagesContainer.id = 'chat-messages-\${agent.id}';
    messagesContainer.style.cssText = \`
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      background: \${config.colors.background};
    \`;

    // Welcome message
    const welcomeMsg = document.createElement('div');
    welcomeMsg.style.cssText = \`
      background: \${config.colors.botMessage};
      color: #374151;
      padding: 8px 12px;
      border-radius: 8px;
      margin-bottom: 8px;
      max-width: 80%;
      font-size: 14px;
    \`;
    welcomeMsg.textContent = 'Hello! I\\'m ' + config.name + '. How can I help you today?';
    messagesContainer.appendChild(welcomeMsg);

    // Input area
    const inputArea = document.createElement('div');
    inputArea.style.cssText = \`
      padding: 16px;
      border-top: 1px solid \${config.colors.border};
      background: \${config.colors.background};
      border-radius: 0 0 12px 12px;
    \`;

    const inputContainer = document.createElement('div');
    inputContainer.style.cssText = 'display: flex; gap: 8px;';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Type your message...';
    input.style.cssText = \`
      flex: 1;
      padding: 8px 12px;
      border: 1px solid \${config.colors.border};
      border-radius: 6px;
      outline: none;
      font-size: 14px;
    \`;

    const sendButton = document.createElement('button');
    sendButton.textContent = 'Send';
    sendButton.style.cssText = \`
      background: \${config.colors.userMessage};
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
    \`;

    inputContainer.appendChild(input);
    inputContainer.appendChild(sendButton);
    inputArea.appendChild(inputContainer);

    // Assemble widget
    widget.appendChild(header);
    widget.appendChild(messagesContainer);
    widget.appendChild(inputArea);
    container.appendChild(widget);

    // Chat functionality
    let isTyping = false;

    function addMessage(text, isUser = false) {
      const messageDiv = document.createElement('div');
      messageDiv.style.cssText = \`
        background: \${isUser ? config.colors.userMessage : config.colors.botMessage};
        color: \${isUser ? 'white' : '#374151'};
        color: \${isUser ? 'white' : '#374151'};
        padding: 8px 12px;
        border-radius: 8px;
        margin-bottom: 8px;
        max-width: 80%;
        margin-left: \${isUser ? 'auto' : '0'};
        margin-right: \${isUser ? '0' : 'auto'};
        font-size: 14px;
        word-wrap: break-word;
      \`;
      messageDiv.textContent = text;
      messagesContainer.appendChild(messageDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async function sendMessage() {
      const message = input.value.trim();
      if (!message || isTyping) return;

      // Add user message
      addMessage(message, true);
      input.value = '';

      // Show typing indicator
      isTyping = true;
      const typingDiv = document.createElement('div');
      typingDiv.id = 'typing-\${agent.id}';
      typingDiv.style.cssText = \`
        background: \${config.colors.botMessage};
        color: #374151;
        padding: 8px 12px;
        border-radius: 8px;
        margin-bottom: 8px;
        max-width: 80%;
        font-size: 14px;
        font-style: italic;
      \`;
      typingDiv.textContent = 'Typing...';
      messagesContainer.appendChild(typingDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;

      try {
        // Send message to your API
        const response = await fetch('https://your-api.com/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            agentId: config.agentId,
            message: message,
            systemPrompt: config.systemPrompt
          })
        });

        const data = await response.json();
        
        // Remove typing indicator
        const typing = document.getElementById('typing-\${agent.id}');
        if (typing) typing.remove();

        // Add bot response
        addMessage(data.response || 'Sorry, I couldn\\'t process your request.');
      } catch (error) {
        // Remove typing indicator
        const typing = document.getElementById('typing-\${agent.id}');
        if (typing) typing.remove();

        // Add error message
        addMessage('Sorry, there was an error processing your request.');
      }

      isTyping = false;
    }

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') sendMessage();
    });

    // Close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.cssText = \`
      position: absolute;
      top: 8px;
      right: 8px;
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #6b7280;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    \`;
    closeButton.addEventListener('click', function() {
      widget.style.display = 'none';
    });
    widget.appendChild(closeButton);
  }

  // Initialize chatbot when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createChatbot);
    createChatbot();
  } else {
    createChatbot();
  }
})();
</script>`;

  const copyToClipboard = async (code: string, type: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success(`${type} copied to clipboard!`);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy code");
    }
  };

  const openIntegrationModal = (integration: Integration) => {
    setSelectedIntegration(integration);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedIntegration(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <AppSidebar />

      <main className="md:ml-48 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Export {agent.name}
            </h1>
            <p className="text-xl text-muted-foreground">
              Embed your customized AI assistant on any website or platform
            </p>
          </motion.div>

          {/* Embed Code Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12 space-y-6"
          >
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Code className="w-5 h-5" />
                  Primary Embed Code
                  {isPreviewMode && (
                    <Badge variant="secondary" className="ml-2">
                      Preview Mode
                    </Badge>
                  )}
                </CardTitle>
                <p className="text-muted-foreground">
                  Fully functional script with your chatbot's customization.
                  Copy this code and paste it into your website.
                  {isPreviewMode && " (Based on your current configuration)"}
                </p>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-lg p-4 border border-border font-mono text-sm relative overflow-hidden">
                  <pre className="text-foreground overflow-x-auto">
                    <code>
                      {showFullCode ? embedCode : truncateCode(embedCode, 8)}
                    </code>
                  </pre>

                  {/* Blur overlay when code is truncated */}
                  {!showFullCode && (
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-muted/50 to-transparent pointer-events-none" />
                  )}

                  {/* Copy button */}
                  <Button
                    onClick={() =>
                      copyToClipboard(embedCode, "Primary embed code")
                    }
                    size="sm"
                    className="absolute top-2 right-2 bg-background hover:bg-muted"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>

                  {/* View Full Code button */}
                  {!showFullCode && (
                    <Button
                      onClick={() => setShowFullCode(true)}
                      size="sm"
                      variant="outline"
                      className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-background hover:bg-muted border-border"
                    >
                      View Full Code
                    </Button>
                  )}

                  {/* Collapse button when showing full code */}
                  {showFullCode && (
                    <Button
                      onClick={() => setShowFullCode(false)}
                      size="sm"
                      variant="outline"
                      className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-background hover:bg-muted border-border"
                    >
                      Collapse Code
                    </Button>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="w-4 h-4" />
                  <span>This code will load your chatbot from our servers</span>
                </div>
              </CardContent>
            </Card>

            {/* Alternative Embed Code */}
            <Card className="bg-gradient-to-r from-secondary/5 to-secondary/10 border-secondary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Code className="w-5 h-5" />
                  Alternative Embed Code
                </CardTitle>
                <p className="text-muted-foreground">
                  Complete HTML/JS widget for platforms with strict CSP
                  policies. Includes all functionality.
                </p>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-lg p-4 border border-border font-mono text-sm relative overflow-hidden">
                  <pre className="text-foreground overflow-x-auto">
                    <code>
                      {showFullHtmlCode
                        ? htmlEmbedCode
                        : truncateCode(htmlEmbedCode, 8)}
                    </code>
                  </pre>

                  {/* Blur overlay when code is truncated */}
                  {!showFullHtmlCode && (
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-muted/50 to-transparent pointer-events-none" />
                  )}

                  {/* Copy button */}
                  <Button
                    onClick={() =>
                      copyToClipboard(htmlEmbedCode, "Alternative embed code")
                    }
                    size="sm"
                    className="absolute top-2 right-2 bg-background hover:bg-muted"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>

                  {/* View Full Code button */}
                  {!showFullHtmlCode && (
                    <Button
                      onClick={() => setShowFullHtmlCode(true)}
                      size="sm"
                      variant="outline"
                      className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-background hover:bg-muted border-border"
                    >
                      View Full Code
                    </Button>
                  )}

                  {/* Collapse button when showing full code */}
                  {showFullHtmlCode && (
                    <Button
                      onClick={() => setShowFullHtmlCode(false)}
                      size="sm"
                      variant="outline"
                      className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-background hover:bg-muted border-border"
                    >
                      Collapse Code
                    </Button>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="w-4 h-4" />
                  <span>
                    This code includes both HTML and JavaScript for better
                    compatibility
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* API Configuration Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="mb-12"
          >
            <Card className="bg-gradient-to-r from-amber-500/5 to-amber-500/10 border-amber-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Code className="w-5 h-5" />
                  API Configuration Required
                </CardTitle>
                <p className="text-muted-foreground">
                  To make your chatbot fully functional, you need to configure
                  the API endpoint
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    The exported scripts currently point to{" "}
                    <code className="bg-muted px-1 rounded">
                      https://your-api.com/chat
                    </code>
                    . You need to:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>
                      Replace{" "}
                      <code className="bg-muted px-1 rounded">
                        https://your-api.com/chat
                      </code>{" "}
                      with your actual API endpoint
                    </li>
                    <li>
                      Ensure your API accepts POST requests with the required
                      format
                    </li>
                    <li>Handle CORS if embedding on external domains</li>
                  </ol>
                  <div className="bg-muted/50 rounded-lg p-3 border border-border">
                    <p className="text-xs font-mono text-foreground">
                      Required API format: POST to /chat with body: {"{"}
                      "agentId": "string", "message": "string", "systemPrompt":
                      "string"{"}"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Chatbot Configuration Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-12"
          >
            <Card className="bg-gradient-to-r from-blue-500/5 to-blue-500/10 border-blue-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Globe className="w-5 h-5" />
                  Chatbot Configuration
                </CardTitle>
                <p className="text-muted-foreground">
                  This is what your exported chatbot will look like
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">
                        Basic Info
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Name:</span>
                          <span className="text-foreground font-medium">
                            {agent.name}
                          </span>
                        </div>
                        {agent.heading && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Heading:
                            </span>
                            <span className="text-foreground font-medium">
                              {agent.heading}
                            </span>
                          </div>
                        )}
                        {agent.system_prompt && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              System Prompt:
                            </span>
                            <span
                              className="text-foreground font-medium max-w-xs truncate"
                              title={agent.system_prompt}
                            >
                              {agent.system_prompt.length > 30
                                ? agent.system_prompt.substring(0, 30) + "..."
                                : agent.system_prompt}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">
                        Visual Settings
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            Background:
                          </span>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded border"
                              style={{
                                backgroundColor:
                                  agent.chat_bg_color || "#ffffff",
                              }}
                            />
                            <span className="text-foreground font-medium">
                              {agent.chat_bg_color || "#ffffff"}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Border:</span>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded border"
                              style={{
                                backgroundColor:
                                  agent.chat_border_color || "#e5e7eb",
                              }}
                            />
                            <span className="text-foreground font-medium">
                              {agent.chat_border_color || "#e5e7eb"}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            User Messages:
                          </span>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded border"
                              style={{
                                backgroundColor:
                                  agent.user_msg_color || "#3b82f6",
                              }}
                            />
                            <span className="text-foreground font-medium">
                              {agent.user_msg_color || "#3b82f6"}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            Bot Messages:
                          </span>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded border"
                              style={{
                                backgroundColor:
                                  agent.bot_msg_color || "#f3f4f6",
                              }}
                            />
                            <span className="text-foreground font-medium">
                              {agent.bot_msg_color || "#f3f4f6"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Integration Platforms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Platform Integrations
              </h2>
              <p className="text-muted-foreground">
                Click on any platform below to see detailed setup instructions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {integrations.map((integration, index) => (
                <motion.div
                  key={integration.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.02 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 border-border hover:border-primary/30 bg-card hover:bg-card/80"
                    onClick={() => openIntegrationModal(integration)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-center gap-4">
                        {(() => {
                          const logoDomainMap: Record<string, string> = {
                            wordpress: "wordpress.com",
                            shopify: "shopify.com",
                            wix: "wix.com",
                            squarespace: "squarespace.com",
                            godaddy: "godaddy.com",
                            "google-sites": "google.com",
                            joomla: "joomla.org",
                            drupal: "drupal.org",
                            bigcommerce: "bigcommerce.com",
                            weebly: "weebly.com",
                            unbounce: "unbounce.com",
                            framer: "framer.com",
                            duda: "duda.co",
                            ghost: "ghost.org",
                            blogger: "blogger.com",
                            tumblr: "tumblr.com",
                            yola: "yola.com",
                            cargo: "cargo.site",
                            piwigo: "piwigo.org",
                            livejournal: "livejournal.com",
                            jigsy: "jigsy.com",
                            "im-creator": "imcreator.com",
                          };
                          const domain = logoDomainMap[integration.id];
                          const url = domain
                            ? `https://logo.clearbit.com/${domain}`
                            : "";
                          return (
                            <div className="flex-shrink-0 w-12 h-12 rounded-md bg-muted/50 border border-border flex items-center justify-center overflow-hidden">
                              {url ? (
                                <img
                                  src={url}
                                  alt={`${integration.name} logo`}
                                  className="w-10 h-10 object-contain"
                                  onError={e => {
                                    // Fallback to emoji icon on error
                                    (
                                      e.currentTarget as HTMLImageElement
                                    ).style.display = "none";
                                    const parent =
                                      e.currentTarget.parentElement;
                                    if (parent)
                                      parent.textContent =
                                        integration.icon || "";
                                  }}
                                />
                              ) : (
                                <span className="text-2xl">
                                  {integration.icon}
                                </span>
                              )}
                            </div>
                          );
                        })()}

                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground text-lg">
                            {integration.name}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {integration.description}
                          </p>
                          <Badge variant="secondary" className="mt-2">
                            Click for instructions
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <Card className="bg-muted/30 border-border">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Need Help?
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">
                      Custom Integration
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      If your platform isn't listed above, you can still embed
                      the chatbot by adding the HTML code to any website that
                      supports custom HTML.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">
                      Technical Support
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      Having trouble with the integration? Our support team is
                      here to help with any technical questions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Integration Modal */}
      <IntegrationModal
        integration={selectedIntegration}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}
