export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { embedCode, config } = req.query;
    console.log("📦 Serving embed file for:", embedCode);
    console.log("📦 With config:", config);

    // Set proper headers for JavaScript files
    res.setHeader("Content-Type", "application/javascript");
    res.setHeader("Cache-Control", "public, max-age=3600"); // Cache for 1 hour
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Parse the configuration from query params
    let chatbotConfig = null;
    if (config) {
      try {
        chatbotConfig = JSON.parse(decodeURIComponent(config));
        console.log("✅ Using provided chatbot config:", chatbotConfig);
      } catch (error) {
        console.log("❌ Error parsing config:", error);
      }
    }

    // Generate the embed script with the provided configuration
    const scriptContent = generateEmbedScript(embedCode, chatbotConfig);

    res.status(200).send(scriptContent);
  } catch (error) {
    console.error("❌ Error serving embed file:", error);
    res.status(500).json({ error: "Failed to serve embed file" });
  }
}

function generateEmbedScript(embedCode, chatbotConfig) {
  const productionUrl = "https://lux-llm-prod.vercel.app";
  const isProduction = process.env.NODE_ENV === "production";
  const apiBaseUrl = isProduction ? productionUrl : "http://localhost:3000";

  // Use the provided chatbot configuration or fallback to defaults
  const config = {
    embedCode: embedCode,
    chatbotName: chatbotConfig?.name || "AI Assistant",
    systemPrompt:
      chatbotConfig?.systemPrompt || "You are a helpful AI assistant.",
    primaryColor: chatbotConfig?.userMsgColor || "#3b82f6",
    backgroundColor: chatbotConfig?.chatBgColor || "#ffffff",
    textColor: chatbotConfig?.botMsgColor || "#1f2937",
    accentColor: chatbotConfig?.chatBorderColor || "#e5e7eb",
    chatBgColor: chatbotConfig?.chatBgColor || "#ffffff",
    chatBorderColor: chatbotConfig?.chatBorderColor || "#e5e7eb",
    borderRadius: chatbotConfig?.borderRadius || 12,
    fontSize: chatbotConfig?.fontSize || 14,
    fontFamily: chatbotConfig?.fontFamily || "Inter",
    position: "bottom-right",
    welcomeMessage:
      chatbotConfig?.welcomeMessage || "Hello! How can I help you today?",
    placeholder: chatbotConfig?.placeholder || "Type your message...",
    avatarUrl: chatbotConfig?.avatar || "",
    showTypingIndicator: true,
    enableSounds: false,
    animationSpeed: "normal",
    apiBaseUrl: apiBaseUrl,
  };

  return `// LuxLLM Chatbot Embed Script
// Generated for: ${embedCode}
// Environment: ${isProduction ? "production" : "development"}

(function() {
  'use strict';
  
  // Configuration with EXACT customizations from editor
  const config = {
    embedCode: '${config.embedCode}',
    chatbotName: '${config.chatbotName.replace(/'/g, "\\'")}',
    systemPrompt: '${config.systemPrompt.replace(/'/g, "\\'")}',
    primaryColor: '${config.primaryColor}',
    backgroundColor: '${config.backgroundColor}',
    textColor: '${config.textColor}',
    accentColor: '${config.accentColor}',
    chatBgColor: '${config.chatBgColor}',
    chatBorderColor: '${config.chatBorderColor}',
    borderRadius: ${config.borderRadius},
    fontSize: ${config.fontSize},
    fontFamily: '${config.fontFamily}',
    position: '${config.position}',
    welcomeMessage: '${config.welcomeMessage.replace(/'/g, "\\'")}',
    placeholder: '${config.placeholder.replace(/'/g, "\\'")}',
    avatarUrl: '${config.avatarUrl}',
    showTypingIndicator: ${config.showTypingIndicator},
    enableSounds: ${config.enableSounds},
    animationSpeed: '${config.animationSpeed}',
    apiBaseUrl: '${config.apiBaseUrl}'
  };

  console.log('LuxLLM Chatbot loaded with config:', config);

  // Chatbot HTML with EXACT customizations
  const chatbotHTML = \`
    <div id="luxllm-chatbot-\${config.embedCode}" style="
      position: fixed;
      \${config.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
      \${config.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
      z-index: 10000;
      font-family: \${config.fontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
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
        \${config.avatarUrl ? \`<img src="\${config.avatarUrl}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;" alt="Chatbot Avatar">\` : \`
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>\`}
      </div>

      <!-- Chat Window -->
      <div id="luxllm-chat-window" style="
        position: absolute;
        \${config.position.includes('bottom') ? 'bottom: 80px;' : 'top: 80px;'}
        \${config.position.includes('right') ? 'right: 0;' : 'left: 0;'}
        width: 350px;
        height: 500px;
        background: \${config.chatBgColor};
        border-radius: \${config.borderRadius}px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        display: none;
        flex-direction: column;
        overflow: hidden;
        border: 1px solid \${config.chatBorderColor};
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
          \${config.avatarUrl ? \`<img src="\${config.avatarUrl}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;" alt="Chatbot Avatar">\` : \`
          <div style="
            width: 32px;
            height: 32px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
          ">🤖</div>\`}
          <span>\${config.chatbotName}</span>
        </div>

        <!-- Messages -->
        <div id="luxllm-chat-messages" style="
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          background: \${config.chatBgColor};
        ">
          <div style="
            padding: 12px 16px;
            background: \${config.accentColor};
            border-radius: 8px;
            color: \${config.textColor};
            font-size: 14px;
            line-height: 1.4;
            max-width: 80%;
          ">\${config.welcomeMessage}</div>
        </div>

        <!-- Input -->
        <div style="
          padding: 16px;
          border-top: 1px solid \${config.chatBorderColor};
          background: \${config.chatBgColor};
        ">
          <div style="display: flex; gap: 8px;">
            <input type="text" id="luxllm-chat-input" placeholder="\${config.placeholder}" style="
              flex: 1;
              padding: 12px;
              border: 1px solid \${config.chatBorderColor};
              border-radius: 6px;
              font-size: 14px;
              outline: none;
              background: \${config.chatBgColor};
              color: \${config.textColor};
            ">
            <button onclick="sendMessage()" style="
              padding: 12px 16px;
              background: \${config.primaryColor};
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
  };

  window.sendMessage = async function() {
    const input = document.getElementById('luxllm-chat-input');
    const message = input.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, 'user');
    input.value = '';

    // Show typing indicator
    if (config.showTypingIndicator) {
      addTypingIndicator();
    }

    try {
      // Send to API
      const response = await fetch(\`\${config.apiBaseUrl}/api/public-chat\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message,
          embedCode: config.embedCode,
          sessionId: 'session-' + Date.now()
        })
      });

      const data = await response.json();
      
      // Remove typing indicator
      if (config.showTypingIndicator) {
        removeTypingIndicator();
      }
      
      // Add bot response
      if (data.message) {
        addMessage(data.message, 'bot');
      } else {
        addMessage('Sorry, I encountered an error. Please try again.', 'bot');
      }
    } catch (error) {
      if (config.showTypingIndicator) {
        removeTypingIndicator();
      }
      addMessage('Sorry, I encountered an error. Please try again.', 'bot');
    }
  };

  function addMessage(text, sender) {
    const messages = document.getElementById('luxllm-chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = \`
      margin: 8px 0;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      line-height: 1.4;
      max-width: 80%;
      \${sender === 'user' 
        ? \`background: \${config.primaryColor}; color: white; margin-left: auto;\`
        : \`background: \${config.accentColor}; color: \${config.textColor};\`
      }
    \`;
    messageDiv.textContent = text;
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
  }

  function addTypingIndicator() {
    const messages = document.getElementById('luxllm-chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.style.cssText = \`
      margin: 8px 0;
      padding: 12px 16px;
      background: \${config.accentColor};
      color: \${config.textColor};
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
    if (e.key === 'Enter' && document.activeElement.id === 'luxllm-chat-input') {
      sendMessage();
    }
  });

  console.log('LuxLLM Chatbot loaded:', config);
})();
`;

  return scriptContent;
}
