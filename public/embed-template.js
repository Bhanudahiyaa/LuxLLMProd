// Dynamic Embed Script Template
// This file will be processed to generate unique embed scripts for each chatbot

(function() {
  'use strict';

  // Configuration - will be replaced during generation
  const CONFIG = {
    embedCode: '{{EMBED_CODE}}',
    name: '{{CHATBOT_NAME}}',
    systemPrompt: '{{SYSTEM_PROMPT}}',
    theme: {
      primaryColor: '{{PRIMARY_COLOR}}',
      backgroundColor: '{{BACKGROUND_COLOR}}',
      textColor: '{{TEXT_COLOR}}',
      accentColor: '{{ACCENT_COLOR}}',
      borderRadius: {{BORDER_RADIUS}},
      fontSize: {{FONT_SIZE}},
      fontFamily: '{{FONT_FAMILY}}'
    },
    position: '{{POSITION}}',
    welcomeMessage: '{{WELCOME_MESSAGE}}',
    placeholder: '{{PLACEHOLDER}}',
    avatar: '{{AVATAR_URL}}',
    showTypingIndicator: {{SHOW_TYPING_INDICATOR}},
    enableSounds: {{ENABLE_SOUNDS}},
    animationSpeed: '{{ANIMATION_SPEED}}'
  };

  // Generate unique session ID
  const sessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

  // Create chatbot widget
  function createChatbotWidget() {
    // Create main container
    const widget = document.createElement('div');
    widget.id = 'lux-chatbot-' + CONFIG.embedCode;
    widget.className = 'lux-chatbot-widget';
    widget.style.cssText = `
      position: fixed;
      ${CONFIG.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
      ${CONFIG.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
      width: 350px;
      height: 500px;
      background: ${CONFIG.theme.backgroundColor};
      border: 2px solid ${CONFIG.theme.accentColor};
      border-radius: ${CONFIG.theme.borderRadius}px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      font-family: ${CONFIG.theme.fontFamily}, system-ui, -apple-system, sans-serif;
      z-index: 10000;
      display: none;
      flex-direction: column;
      overflow: hidden;
    `;

    // Create header
    const header = document.createElement('div');
    header.className = 'chatbot-header';
    header.style.cssText = `
      padding: 16px;
      background: ${CONFIG.theme.primaryColor}20;
      border-bottom: 1px solid ${CONFIG.theme.accentColor}20;
      display: flex;
      align-items: center;
      gap: 12px;
    `;

    // Avatar
    const avatar = document.createElement('img');
    avatar.src = CONFIG.avatar || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiM2QjcyOEEiLz4KPHBhdGggZD0iTTE2IDhDMTguMjA5MSA4IDIwIDkuNzkwODYgMjAgMTJDMjAgMTQuMjA5MSAxOC4yMDkxIDE2IDE2IDE2QzEzLjc5MDkgMTYgMTIgMTQuMjA5MSAxMiAxMkMxMiA5Ljc5MDg2IDEzLjc5MDkgOCAxNiA4WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTE2IDI0QzE5LjMxMzcgMjQgMjIgMjEuMzEzNyAyMiAxOEgyMEMyMCAxOS4xMDQ2IDE5LjEwNDYgMjAgMTggMjBIMTRDMTIuODk1NCAyMCAxMiAxOS4xMDQ2IDEyIDE4SDEwQzEwIDIxLjMxMzcgMTIuNjg2MyAyNCAxNiAyNFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=';
    avatar.style.cssText = `
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
    `;

    // Name and status
    const headerText = document.createElement('div');
    headerText.innerHTML = `
      <div style="font-weight: 600; color: ${CONFIG.theme.textColor}; font-size: ${CONFIG.theme.fontSize}px;">
        ${CONFIG.name}
      </div>
      <div style="font-size: 12px; color: ${CONFIG.theme.textColor}80; display: flex; align-items: center; gap: 6px;">
        <div style="width: 8px; height: 8px; background: #10B981; border-radius: 50%;"></div>
        Online
      </div>
    `;

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
      margin-left: auto;
      background: none;
      border: none;
      font-size: 24px;
      color: ${CONFIG.theme.textColor};
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background 0.2s;
    `;
    closeBtn.onmouseover = () => closeBtn.style.background = CONFIG.theme.primaryColor + '20';
    closeBtn.onmouseout = () => closeBtn.style.background = 'transparent';
    closeBtn.onclick = () => widget.style.display = 'none';

    header.appendChild(avatar);
    header.appendChild(headerText);
    header.appendChild(closeBtn);

    // Create messages container
    const messagesContainer = document.createElement('div');
    messagesContainer.className = 'chatbot-messages';
    messagesContainer.style.cssText = `
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    `;

    // Add welcome message
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'message bot-message';
    welcomeMessage.style.cssText = `
      background: ${CONFIG.theme.primaryColor}20;
      color: ${CONFIG.theme.textColor};
      padding: 12px 16px;
      border-radius: 18px;
      border-bottom-left-radius: 6px;
      max-width: 80%;
      align-self: flex-start;
      font-size: ${CONFIG.theme.fontSize}px;
      line-height: 1.4;
    `;
    welcomeMessage.textContent = CONFIG.welcomeMessage;
    messagesContainer.appendChild(welcomeMessage);

    // Create input container
    const inputContainer = document.createElement('div');
    inputContainer.className = 'chatbot-input';
    inputContainer.style.cssText = `
      padding: 16px;
      border-top: 1px solid ${CONFIG.theme.accentColor}20;
      display: flex;
      gap: 8px;
      align-items: center;
    `;

    // Input field
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = CONFIG.placeholder;
    input.style.cssText = `
      flex: 1;
      padding: 12px 16px;
      border: 1px solid ${CONFIG.theme.accentColor}40;
      border-radius: 24px;
      background: ${CONFIG.theme.backgroundColor};
      color: ${CONFIG.theme.textColor};
      font-size: ${CONFIG.theme.fontSize}px;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s;
    `;
    input.onfocus = () => input.style.borderColor = CONFIG.theme.primaryColor;
    input.onblur = () => input.style.borderColor = CONFIG.theme.accentColor + '40';

    // Send button
    const sendBtn = document.createElement('button');
    sendBtn.innerHTML = '→';
    sendBtn.style.cssText = `
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: ${CONFIG.theme.primaryColor};
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      transition: transform 0.2s;
    `;
    sendBtn.onmouseover = () => sendBtn.style.transform = 'scale(1.1)';
    sendBtn.onmouseout = () => sendBtn.style.transform = 'scale(1)';

    // Send message function
    async function sendMessage() {
      const message = input.value.trim();
      if (!message) return;

      // Clear input
      input.value = '';

      // Add user message
      addMessage(message, 'user');

      // Show typing indicator
      if (CONFIG.showTypingIndicator) {
        showTypingIndicator();
      }

      try {
        // Send to API
        const response = await fetch('https://lux-llm-prod.vercel.app/api/public-chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            embedCode: CONFIG.embedCode,
            message: message,
            sessionId: sessionId,
            visitorIp: '', // Will be set by server
            userAgent: navigator.userAgent
          })
        });

        if (!response.ok) {
          throw new Error('API request failed');
        }

        const data = await response.json();

        // Hide typing indicator
        hideTypingIndicator();

        // Add bot response
        addMessage(data.message, 'assistant');

        // Play sound if enabled
        if (CONFIG.enableSounds) {
          playNotificationSound();
        }

      } catch (error) {
        console.error('Chat error:', error);
        hideTypingIndicator();
        addMessage('Sorry, I\'m having trouble right now. Please try again.', 'assistant');
      }
    }

    // Add message to chat
    function addMessage(content, role) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${role}-message`;
      messageDiv.style.cssText = `
        background: ${role === 'user' ? CONFIG.theme.primaryColor : CONFIG.theme.primaryColor + '20'};
        color: ${role === 'user' ? 'white' : CONFIG.theme.textColor};
        padding: 12px 16px;
        border-radius: 18px;
        ${role === 'user' ? 'border-bottom-right-radius: 6px; align-self: flex-end;' : 'border-bottom-left-radius: 6px; align-self: flex-start;'}
        max-width: 80%;
        font-size: ${CONFIG.theme.fontSize}px;
        line-height: 1.4;
        word-wrap: break-word;
      `;
      messageDiv.textContent = content;

      // Remove typing indicator if present
      const typingIndicator = messagesContainer.querySelector('.typing-indicator');
      if (typingIndicator) {
        typingIndicator.remove();
      }

      messagesContainer.appendChild(messageDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Show typing indicator
    function showTypingIndicator() {
      const typingDiv = document.createElement('div');
      typingDiv.className = 'typing-indicator';
      typingDiv.style.cssText = `
        background: ${CONFIG.theme.primaryColor}20;
        color: ${CONFIG.theme.textColor};
        padding: 12px 16px;
        border-radius: 18px;
        border-bottom-left-radius: 6px;
        max-width: 80%;
        align-self: flex-start;
        font-size: ${CONFIG.theme.fontSize}px;
        display: flex;
        align-items: center;
        gap: 4px;
      `;
      typingDiv.innerHTML = `
        <div style="display: flex; gap: 2px;">
          <div class="typing-dot" style="width: 6px; height: 6px; background: currentColor; border-radius: 50%; animation: typing 1.4s infinite ease-in-out;"></div>
          <div class="typing-dot" style="width: 6px; height: 6px; background: currentColor; border-radius: 50%; animation: typing 1.4s infinite ease-in-out 0.2s;"></div>
          <div class="typing-dot" style="width: 6px; height: 6px; background: currentColor; border-radius: 50%; animation: typing 1.4s infinite ease-in-out 0.4s;"></div>
        </div>
      `;
      messagesContainer.appendChild(typingDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Hide typing indicator
    function hideTypingIndicator() {
      const typingIndicator = messagesContainer.querySelector('.typing-indicator');
      if (typingIndicator) {
        typingIndicator.remove();
      }
    }

    // Play notification sound
    function playNotificationSound() {
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
        audio.volume = 0.3;
        audio.play();
      } catch (e) {
        // Ignore audio errors
      }
    }

    // Event listeners
    sendBtn.onclick = sendMessage;
    input.onkeypress = (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    };

    inputContainer.appendChild(input);
    inputContainer.appendChild(sendBtn);

    // Assemble widget
    widget.appendChild(header);
    widget.appendChild(messagesContainer);
    widget.appendChild(inputContainer);

    return widget;
  }

  // Create floating button
  function createFloatingButton() {
    const button = document.createElement('button');
    button.className = 'lux-chatbot-button';
    button.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    button.style.cssText = `
      position: fixed;
      ${CONFIG.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
      ${CONFIG.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: ${CONFIG.theme.primaryColor};
      color: white;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s, box-shadow 0.2s;
    `;
    button.onmouseover = () => {
      button.style.transform = 'scale(1.1)';
      button.style.boxShadow = '0 6px 25px rgba(0,0,0,0.2)';
    };
    button.onmouseout = () => {
      button.style.transform = 'scale(1)';
      button.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
    };

    return button;
  }

  // Add CSS animations
  function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes typing {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-10px); }
      }
      
      .lux-chatbot-widget {
        animation: slideIn 0.3s ease-out;
      }
      
      @keyframes slideIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }

  // Initialize chatbot
  function init() {
    // Add styles
    addStyles();

    // Create elements
    const widget = createChatbotWidget();
    const button = createFloatingButton();

    // Add to page
    document.body.appendChild(widget);
    document.body.appendChild(button);

    // Toggle widget visibility
    button.onclick = () => {
      if (widget.style.display === 'none' || !widget.style.display) {
        widget.style.display = 'flex';
        button.style.display = 'none';
        // Focus input
        setTimeout(() => {
          const input = widget.querySelector('input');
          if (input) input.focus();
        }, 100);
      } else {
        widget.style.display = 'none';
        button.style.display = 'flex';
      }
    };

    // Close widget when clicking outside
    document.addEventListener('click', (e) => {
      if (!widget.contains(e.target) && !button.contains(e.target)) {
        widget.style.display = 'none';
        button.style.display = 'flex';
      }
    });

    console.log('LuxLLM Chatbot initialized:', CONFIG.name);
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
