import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || "https://cvetvxgzgfmiqdxdimzn.supabase.co",
  process.env.SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2ZXR2eGd6Z2ZtaXFkeGRpbXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTk0NTYsImV4cCI6MjA2OTk5NTQ1Nn0.pgNeUr3T2LQNL0qno1bxST6HgqbdIrCkJrkb-wOL5SE"
);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { embedCode } = req.query;
    console.log("📦 Serving embed file for:", embedCode);

    // Set proper headers for JavaScript files
    res.setHeader("Content-Type", "application/javascript");
    res.setHeader("Cache-Control", "public, max-age=3600"); // Cache for 1 hour
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Try to get embed configuration from database
    let embedConfig = null;
    try {
      const { data: embed, error } = await supabase
        .from("public_embeds")
        .select(
          `
          *,
          agents (
            name,
            system_prompt,
            theme_config
          )
        `
        )
        .eq("embed_code", embedCode)
        .eq("is_active", true)
        .single();

      if (!error && embed) {
        embedConfig = embed;
        console.log("✅ Found embed configuration:", embed.id);
      } else {
        console.log("⚠️ Using default configuration for:", embedCode);
      }
    } catch (error) {
      console.log("⚠️ Could not fetch embed config, using defaults");
    }

    // Generate the embed script content
    const scriptContent = generateEmbedScript(embedCode, embedConfig);

    res.status(200).send(scriptContent);
  } catch (error) {
    console.error("❌ Error serving embed file:", error);
    res.status(500).json({ error: "Failed to serve embed file" });
  }
}

function generateEmbedScript(embedCode, embedConfig) {
  const productionUrl = "https://lux-llm-prod.vercel.app";
  const isProduction = process.env.NODE_ENV === "production";
  const apiBaseUrl = isProduction ? productionUrl : "http://localhost:3000";

  // Escape any single quotes in the config values to prevent syntax errors
  const escapedName = (embedConfig?.agents?.name || embedConfig?.name || "AI Assistant").replace(/'/g, "\\'");
  const escapedPrompt = (embedConfig?.agents?.system_prompt || "You are a helpful AI assistant that can answer questions about technology, programming, and general knowledge.").replace(/'/g, "\\'");

  return `// LuxLLM Chatbot Embed Script
// Generated for: ${embedCode}
// Environment: ${isProduction ? "production" : "development"}

(function() {
  'use strict';
  
  // Configuration
  const config = {
    embedCode: '${embedCode}',
    chatbotName: '${escapedName}',
    systemPrompt: '${escapedPrompt}',
    primaryColor: '#3b82f6',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    accentColor: '#e5e7eb',
    borderRadius: 12,
    fontSize: 14,
    fontFamily: 'Inter',
    position: 'bottom-right',
    welcomeMessage: 'Hello! I\\'m your AI assistant. How can I help you today?',
    placeholder: 'Type your message...',
    avatarUrl: '',
    showTypingIndicator: true,
    enableSounds: false,
    animationSpeed: 'normal',
    apiBaseUrl: '${apiBaseUrl}'
  };

  // Chatbot HTML
  const chatbotHTML = \`
    <div id="luxllm-chatbot-\${config.embedCode}" style="
      position: fixed;
      \${config.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
      \${config.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    ">
      <!-- Chat Button -->
      <div id="luxllm-chat-button" style="
        width: 60px;
        height: 60px;
        background: \${config.primaryColor};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        transition: transform 0.2s ease;
      " onclick="toggleChat()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </div>

      <!-- Chat Window -->
      <div id="luxllm-chat-window" style="
        position: absolute;
        \${config.position.includes('bottom') ? 'bottom: 80px;' : 'top: 80px;'}
        \${config.position.includes('right') ? 'right: 0;' : 'left: 0;'}
        width: 350px;
        height: 500px;
        background: \${config.backgroundColor};
        border-radius: \${config.borderRadius}px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        display: none;
        flex-direction: column;
        overflow: hidden;
        border: 1px solid \${config.accentColor};
      ">
        <!-- Header -->
        <div style="
          background: \${config.primaryColor};
          color: white;
          padding: 16px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        ">
          <div style="
            width: 32px;
            height: 32px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <span>\${config.chatbotName}</span>
        </div>

        <!-- Messages Container -->
        <div id="luxllm-messages" style="
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        ">
          <!-- Welcome message -->
          <div style="
            background: \${config.accentColor};
            padding: 12px 16px;
            border-radius: 12px;
            font-size: \${config.fontSize}px;
            color: \${config.textColor};
            max-width: 80%;
            align-self: flex-start;
          ">
            \${config.welcomeMessage}
          </div>
        </div>

        <!-- Input Area -->
        <div style="
          padding: 16px;
          border-top: 1px solid \${config.accentColor};
          display: flex;
          gap: 8px;
        ">
          <input id="luxllm-input" type="text" placeholder="\${config.placeholder}" style="
            flex: 1;
            padding: 12px 16px;
            border: 1px solid \${config.accentColor};
            border-radius: 8px;
            font-size: \${config.fontSize}px;
            outline: none;
            font-family: inherit;
          " onkeypress="handleKeyPress(event)">
          <button onclick="sendMessage()" style="
            background: \${config.primaryColor};
            color: white;
            border: none;
            padding: 12px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-size: \${config.fontSize}px;
            font-family: inherit;
          ">
            Send
          </button>
        </div>
      </div>
    </div>
  \`;

  // Add chatbot to page
  document.body.insertAdjacentHTML('beforeend', chatbotHTML);

  // Chat state
  let isOpen = false;
  let sessionId = generateSessionId();

  // Functions
  function toggleChat() {
    const chatWindow = document.getElementById('luxllm-chat-window');
    const chatButton = document.getElementById('luxllm-chat-button');
    
    if (isOpen) {
      chatWindow.style.display = 'none';
      chatButton.style.transform = 'scale(1)';
    } else {
      chatWindow.style.display = 'flex';
      chatButton.style.transform = 'scale(1.1)';
    }
    
    isOpen = !isOpen;
  }

  function generateSessionId() {
    return 'session_' + Math.random().toString(36).substr(2, 9);
  }

  function addMessage(content, isUser = false) {
    const messagesContainer = document.getElementById('luxllm-messages');
    const messageDiv = document.createElement('div');
    
    messageDiv.style.cssText = \`
      background: \${isUser ? config.primaryColor : config.accentColor};
      color: \${isUser ? 'white' : config.textColor};
      padding: 12px 16px;
      border-radius: 12px;
      margin-bottom: 12px;
      font-size: \${config.fontSize}px;
      max-width: 80%;
      align-self: \${isUser ? 'flex-end' : 'flex-start'};
      margin-left: \${isUser ? 'auto' : '0'};
    \`;
    
    messageDiv.textContent = content;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      sendMessage();
    }
  }

  async function sendMessage() {
    const input = document.getElementById('luxllm-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage(message, true);
    input.value = '';
    
    // Show typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.style.cssText = \`
      background: \${config.accentColor};
      padding: 12px 16px;
      border-radius: 12px;
      margin-bottom: 12px;
      font-size: \${config.fontSize}px;
      color: \${config.textColor};
      max-width: 80%;
      align-self: flex-start;
    \`;
    typingDiv.textContent = 'Typing...';
    document.getElementById('luxllm-messages').appendChild(typingDiv);
    
    try {
      const response = await fetch(\`\${config.apiBaseUrl}/api/public-chat\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          embedCode: config.embedCode,
          message: message,
          sessionId: sessionId
        })
      });

      if (response.ok) {
        const data = await response.json();
        addMessage(data.message);
      } else {
        addMessage('Sorry, I\\'m having trouble connecting. Please try again later.');
      }
    } catch (error) {
      console.error('Chat error:', error);
      
      // Remove typing indicator
      const typingIndicator = document.getElementById('typing-indicator');
      if (typingIndicator) {
        typingIndicator.remove();
      }
      
      addMessage('Sorry, I\\'m having trouble connecting. Please try again later.');
    }
  }

  // Make functions globally available
  window.toggleChat = toggleChat;
  window.sendMessage = sendMessage;
  window.handleKeyPress = handleKeyPress;
})();`;
}
