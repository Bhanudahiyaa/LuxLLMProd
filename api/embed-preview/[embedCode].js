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
    const productionUrl = "https://lux-llm-prod.vercel.app";
    const isProduction = process.env.NODE_ENV === "production";
    const baseUrl = isProduction ? productionUrl : "http://localhost:3000";

    // Simple HTML page that will load the chatbot configuration from URL params
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Chatbot Preview - ${embedCode}</title>
        <style>
          body { 
            margin: 0; 
            padding: 20px; 
            font-family: system-ui, -apple-system, sans-serif;
            background: #f5f5f5;
          }
          .preview-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          }
          .preview-header {
            text-align: center;
            margin-bottom: 40px;
          }
          .preview-header h1 {
            color: #1f2937;
            margin-bottom: 10px;
          }
          .preview-header p {
            color: #6b7280;
            margin: 0;
          }
          .embed-info {
            background: #f3f4f6;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
          }
          .embed-info h3 {
            margin-top: 0;
            color: #374151;
          }
          .embed-info code {
            background: #1e293b;
            color: #10b981;
            padding: 8px 12px;
            border-radius: 6px;
            font-family: monospace;
          }
          .test-section {
            text-align: center;
            padding: 40px;
            border: 2px dashed #d1d5db;
            border-radius: 12px;
          }
          .test-section h3 {
            color: #374151;
            margin-bottom: 20px;
          }
          .test-section p {
            color: #6b7280;
            margin-bottom: 30px;
          }
          .test-button {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            transition: background 0.2s;
          }
          .test-button:hover {
            background: #2563eb;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
          }
          .status-active {
            background: #dcfce7;
            color: #166534;
          }
          .production-info {
            background: #dbeafe;
            border: 1px solid #3b82f6;
            color: #1e40af;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="preview-container">
          <div class="preview-header">
            <h1>🤖 Chatbot Preview</h1>
            <p>Testing your embedded chatbot</p>
          </div>
          
          ${
            isProduction
              ? `
          <div class="production-info">
            <strong>🚀 Production Mode:</strong> This embed is running on your production server at ${productionUrl}
          </div>
          `
              : ""
          }
          
          <div class="embed-info">
            <h3>Embed Information</h3>
            <p><strong>Embed Code:</strong> <code>${embedCode}</code></p>
            <p><strong>Status:</strong> <span class="status-badge ${
              isProduction ? "status-active" : "status-testing"
            }">${isProduction ? "✅ Production" : "🔄 Development"}</span></p>
          </div>
          
          <div class="test-section">
            <h3>Test Your Chatbot</h3>
            <p>Click the button below to test your chatbot in action. This will load the actual embed script and show you how it will appear on websites.</p>
            <button class="test-button" onclick="loadChatbot()">Load Chatbot</button>
          </div>
        </div>
        
        <script>
          // Define createBeautifulChatbot function first (global scope)
          function createBeautifulChatbot(config) {
            console.log('Creating beautiful chatbot with config:', config);
            
            // Load fonts from editor settings
            if (config.fontFamily && config.fontFamily !== 'Inter') {
              const fontLink = document.createElement('link');
              fontLink.href = \`https://fonts.googleapis.com/css2?family=\${config.fontFamily.replace(/\s+/g, '+')}:wght@100;300;400;500;600;700&display=swap\`;
              fontLink.rel = 'stylesheet';
              document.head.appendChild(fontLink);
            }

            // Create the main chatbot container
            const chatbotContainer = document.createElement('div');
            chatbotContainer.id = 'luxllm-beautiful-chatbot';
            chatbotContainer.style.cssText = \`
              position: fixed;
              bottom: 20px;
              right: 20px;
              z-index: 10000;
              font-family: \${config.fontFamily || 'Inter'}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            \`;

            // Chat state
            let messages = [
              {
                id: '1',
                text: config.welcomeMessage || 'Hello! How can I help you today?',
                isBot: true,
                timestamp: new Date()
              }
            ];
            let isTyping = false;

            // Create the beautiful chat window
            const chatWindow = document.createElement('div');
            chatWindow.id = 'luxllm-chat-window';
            chatWindow.style.cssText = \`
              width: 350px;
              height: 500px;
              background: linear-gradient(135deg, \${config.backgroundColor} 0%, \${config.backgroundColor}dd 100%);
              border-radius: \${config.borderRadius || 12}px;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3), 0 8px 32px rgba(0,0,0,0.2);
              display: flex;
              flex-direction: column;
              overflow: hidden;
              border: 1px solid \${config.accentColor || '#e5e7eb'};
              backdrop-filter: blur(10px);
            \`;

            // Create header with gradient
            const header = document.createElement('div');
            header.style.cssText = \`
              background: linear-gradient(135deg, \${config.primaryColor} 0%, \${config.primaryColor}dd 100%);
              color: white;
              padding: 16px;
              font-weight: 600;
              display: flex;
              align-items: center;
              gap: 8px;
              position: relative;
              overflow: hidden;
            \`;

            // Add animated background pattern to header
            const headerPattern = document.createElement('div');
            headerPattern.style.cssText = \`
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-image: linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.1) 75%, rgba(255,255,255,0.1));
              background-size: 20px 20px;
              animation: movePattern 20s linear infinite;
              opacity: 0.3;
            \`;

            // Create avatar
            const avatar = document.createElement('div');
            avatar.style.cssText = \`
              width: 32px;
              height: 32px;
              background: rgba(255,255,255,0.2);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 16px;
              backdrop-filter: blur(5px);
            \`;
            avatar.innerHTML = '🤖';

            // Create bot name and status
            const botInfo = document.createElement('div');
            botInfo.innerHTML = \`
              <div style="font-size: 16px; font-weight: 600;">\${config.name || 'AI Assistant'}</div>
              <div style="font-size: 12px; opacity: 0.8; display: flex; align-items: center; gap: 4px;">
                <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; animation: pulse 2s infinite;"></div>
                Online
              </div>
            \`;

            // Create minimize button (like editor)
            const minimizeBtn = document.createElement('button');
            minimizeBtn.innerHTML = '−';
            minimizeBtn.style.cssText = \`
              background: rgba(255,255,255,0.1);
              border: none;
              color: white;
              width: 24px;
              height: 24px;
              border-radius: 50%;
              cursor: pointer;
              font-size: 18px;
              margin-left: auto;
              transition: all 0.2s;
              display: flex;
              align-items: center;
              justify-content: center;
            \`;
            minimizeBtn.onclick = () => {
              chatWindow.style.display = 'none';
              chatButton.style.display = 'flex';
            };

            // Create close button
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '×';
            closeBtn.style.cssText = \`
              background: rgba(255,255,255,0.1);
              border: none;
              color: white;
              width: 24px;
              height: 24px;
              border-radius: 50%;
              cursor: pointer;
              font-size: 18px;
              margin-left: 8px;
              transition: all 0.2s;
              display: flex;
              align-items: center;
              justify-content: center;
            \`;
            closeBtn.onclick = () => {
              chatWindow.style.display = 'none';
              chatButton.style.display = 'flex';
            };

            // Assemble header
            header.appendChild(headerPattern);
            header.appendChild(avatar);
            header.appendChild(botInfo);
            header.appendChild(minimizeBtn);
            header.appendChild(closeBtn);

            // Create messages area
            const messagesArea = document.createElement('div');
            messagesArea.id = 'luxllm-messages';
            messagesArea.style.cssText = \`
              flex: 1;
              padding: 16px;
              overflow-y: auto;
              background: \${config.backgroundColor};
              display: flex;
              flex-direction: column;
              gap: 12px;
            \`;

            // Function to render messages
            function renderMessages() {
              messagesArea.innerHTML = '';
              messages.forEach((message, index) => {
                const messageDiv = document.createElement('div');
                messageDiv.style.cssText = \`
                  display: flex;
                  justify-content: \${message.isBot ? 'flex-start' : 'flex-end'};
                  animation: fadeInUp 0.3s ease-out \${index * 0.1}s both;
                \`;
                
                const messageBubble = document.createElement('div');
                messageBubble.style.cssText = \`
                  max-width: 80%;
                  padding: 12px 16px;
                  border-radius: \${(config.borderRadius || 12) * 0.8}px;
                  font-size: \${config.fontSize || 14}px;
                  line-height: 1.4;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                  color: \${message.isBot ? config.textColor : 'white'};
                  background: \${message.isBot ? 'rgba(255,255,255,0.2)' : config.primaryColor};
                  backdrop-filter: blur(5px);
                \`;
                messageBubble.textContent = message.text;
                
                messageDiv.appendChild(messageBubble);
                messagesArea.appendChild(messageDiv);
              });
            }

            // Function to add typing indicator
            function showTypingIndicator() {
              const typingDiv = document.createElement('div');
              typingDiv.id = 'typing-indicator';
              typingDiv.style.cssText = \`
                display: flex;
                justify-content: flex-start;
                animation: fadeInUp 0.3s ease-out;
              \`;
              
              const typingBubble = document.createElement('div');
              typingBubble.style.cssText = \`
                padding: 12px 16px;
                border-radius: \${(config.borderRadius || 12) * 0.8}px;
                background: rgba(255,255,255,0.2);
                backdrop-filter: blur(5px);
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              \`;
              
              const dots = document.createElement('div');
              dots.style.cssText = \`
                display: flex;
                gap: 4px;
                align-items: center;
              \`;
              
              for (let i = 0; i < 3; i++) {
                const dot = document.createElement('div');
                dot.style.cssText = \`
                  width: 8px;
                  height: 8px;
                  background: \${config.textColor};
                  border-radius: 50%;
                  animation: typingDot 1.4s infinite \${i * 0.2}s;
                \`;
                dots.appendChild(dot);
              }
              
              typingBubble.appendChild(dots);
              typingDiv.appendChild(typingBubble);
              messagesArea.appendChild(typingDiv);
              messagesArea.scrollTop = messagesArea.scrollHeight;
            }

            // Function to hide typing indicator
            function hideTypingIndicator() {
              const typingIndicator = document.getElementById('typing-indicator');
              if (typingIndicator) {
                typingIndicator.remove();
              }
            }

            // Function to send message
            async function sendMessage() {
              const userMessage = input.value.trim();
              if (!userMessage) return;

              // Add user message
              const newUserMessage = {
                id: Date.now().toString(),
                text: userMessage,
                isBot: false,
                timestamp: new Date()
              };
              messages.push(newUserMessage);
              input.value = '';
              renderMessages();
              messagesArea.scrollTop = messagesArea.scrollHeight;

              // Show typing indicator
              isTyping = true;
              showTypingIndicator();

              try {
                // Call the chat API
                const response = await fetch('/api/public-chat', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    message: userMessage,
                    system_prompt: config.systemPrompt || 'You are a helpful AI assistant.',
                    agentId: getAgentIdFromConfig(config)
                  })
                });

                if (!response.ok) {
                  throw new Error(\`HTTP error! status: \${response.status}\`);
                }

                const data = await response.json();
                
                // Hide typing indicator
                hideTypingIndicator();
                isTyping = false;

                // Add bot response
                const botMessage = {
                  id: (Date.now() + 1).toString(),
                  text: data.message,
                  isBot: true,
                  timestamp: new Date()
                };
                messages.push(botMessage);
                renderMessages();
                messagesArea.scrollTop = messagesArea.scrollHeight;

              } catch (error) {
                console.error('Chat API error:', error);
                hideTypingIndicator();
                isTyping = false;
                
                // Add error message
                const errorMessage = {
                  id: (Date.now() + 1).toString(),
                  text: 'I apologize, but I\'m having trouble connecting to the chat service. Please try again in a moment.',
                  isBot: true,
                  timestamp: new Date()
                };
                messages.push(errorMessage);
                renderMessages();
                messagesArea.scrollTop = messagesArea.scrollHeight;
              }
            }

            // Function to get agent ID from config (like editor)
            function getAgentIdFromConfig(config) {
              const systemPrompt = config.systemPrompt || "";
              const lowerPrompt = systemPrompt.toLowerCase();

              if (lowerPrompt.includes("faq") || lowerPrompt.includes("question") || lowerPrompt.includes("assistant")) {
                return "faq-bot";
              } else if (lowerPrompt.includes("customer support") || lowerPrompt.includes("support")) {
                return "customer-support-bot";
              } else if (lowerPrompt.includes("portfolio") || lowerPrompt.includes("resume")) {
                return "portfolio-bot";
              } else if (lowerPrompt.includes("feedback") || lowerPrompt.includes("review")) {
                return "feedback-bot";
              } else if (lowerPrompt.includes("sales") || lowerPrompt.includes("product")) {
                return "sales-bot";
              } else if (lowerPrompt.includes("meeting") || lowerPrompt.includes("prep")) {
                return "meeting-prep-bot";
              } else if (lowerPrompt.includes("document") || lowerPrompt.includes("generator")) {
                return "document-generator-bot";
              } else {
                return "general-assistant-bot";
              }
            }

            // Render initial messages
            renderMessages();

            // Create input area
            const inputArea = document.createElement('div');
            inputArea.style.cssText = \`
              padding: 16px;
              border-top: 1px solid \${config.accentColor || '#e5e7eb'};
              background: \${config.backgroundColor};
              display: flex;
              gap: 8px;
            \`;

            // Create input field
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = config.placeholder || 'Type your message...';
            input.style.cssText = \`
              flex: 1;
              padding: 12px;
              border: 1px solid \${config.accentColor || '#e5e7eb'};
              border-radius: \${(config.borderRadius || 12) * 0.6}px;
              font-size: \${config.fontSize || 14}px;
              outline: none;
              background: \${config.backgroundColor};
              color: \${config.textColor || '#1f2937'};
              transition: all 0.2s;
              font-family: \${config.fontFamily || 'Inter'}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            \`;
            input.onfocus = () => {
              input.style.borderColor = config.primaryColor;
              input.style.boxShadow = \`0 0 0 3px \${config.primaryColor}20\`;
            };
            input.onblur = () => {
              input.style.borderColor = config.accentColor || '#e5e7eb';
              input.style.boxShadow = 'none';
            };

            // Create send button
            const sendBtn = document.createElement('button');
            sendBtn.innerHTML = '➤';
            sendBtn.style.cssText = \`
              padding: 12px 16px;
              background: \${config.primaryColor};
              color: white;
              border: none;
              border-radius: \${(config.borderRadius || 12) * 0.6}px;
              cursor: pointer;
              font-size: \${config.fontSize || 14}px;
              font-weight: 500;
              transition: all 0.2s;
              box-shadow: 0 2px 8px rgba(0,0,0,0.2);
              display: flex;
              align-items: center;
              justify-content: center;
            \`;
            sendBtn.onmouseenter = () => {
              sendBtn.style.transform = 'scale(1.05)';
              sendBtn.style.boxShadow = \`0 4px 16px \${config.primaryColor}40\`;
            };
            sendBtn.onmouseleave = () => {
              sendBtn.style.transform = 'scale(1)';
              sendBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
            };
            sendBtn.onclick = sendMessage;

            // Assemble input area
            inputArea.appendChild(input);
            inputArea.appendChild(sendBtn);

            // Assemble chat window
            chatWindow.appendChild(header);
            chatWindow.appendChild(messagesArea);
            chatWindow.appendChild(inputArea);

            // Create floating chat button
            const chatButton = document.createElement('div');
            chatButton.id = 'luxllm-chat-button';
            chatButton.style.cssText = \`
              width: 60px;
              height: 60px;
              background: linear-gradient(135deg, \${config.primaryColor} 0%, \${config.primaryColor}dd 100%);
              border-radius: 50%;
              display: none;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              box-shadow: 0 8px 32px rgba(0,0,0,0.3);
              transition: all 0.3s ease;
              animation: float 3s ease-in-out infinite;
            \`;
            chatButton.innerHTML = \`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            \`;
            chatButton.onclick = () => {
              chatWindow.style.display = 'flex';
              chatButton.style.display = 'none';
            };

            // Add everything to the page
            chatbotContainer.appendChild(chatWindow);
            chatbotContainer.appendChild(chatButton);
            document.body.appendChild(chatbotContainer);

            // Add enter key support
            input.addEventListener('keypress', (e) => {
              if (e.key === 'Enter') {
                sendMessage();
              }
            });

            // Add enhanced keyframes for animations
            const enhancedStyle = document.createElement('style');
            enhancedStyle.textContent = \`
              @keyframes movePattern {
                0% { background-position: 0 0; }
                100% { background-position: 40px 40px; }
              }
              @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
              }
              @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
              }
              @keyframes fadeInUp {
                from {
                  opacity: 0;
                  transform: translateY(10px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              @keyframes typingDot {
                0%, 60%, 100% {
                  transform: translateY(0);
                }
                30% {
                  transform: translateY(-10px);
                }
              }
            \`;
            document.head.appendChild(enhancedStyle);

            console.log('Beautiful chatbot created with config:', config);
          }

          // Define loadChatbot function (global scope)
          function loadChatbot() {
            // Get configuration from URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            const configParam = urlParams.get('config');
            
            if (configParam) {
              try {
                const config = JSON.parse(decodeURIComponent(configParam));
                console.log('Loading chatbot with config:', config);
                
                // Create a beautiful chatbot that matches the editor preview
                createBeautifulChatbot(config);
                
                // Update button
                const button = document.querySelector('.test-button');
                button.textContent = 'Chatbot Loaded!';
                button.style.background = '#10b981';
                button.disabled = true;
                
                // Show success message
                setTimeout(() => {
                  const successMsg = document.createElement('div');
                  successMsg.style.cssText = 'text-align: center; margin-top: 20px; color: #10b981; font-weight: 500;';
                  successMsg.textContent = '✅ Chatbot loaded successfully! Look for the floating chat button.';
                  document.querySelector('.test-section').appendChild(successMsg);
                }, 1000);
              } catch (error) {
                console.error('Error parsing config:', error);
                alert('Error loading chatbot configuration');
              }
            } else {
              // Fallback without config
              const script = document.createElement('script');
              script.src = \`/api/embed-script/${embedCode}.js\`;
              script.async = true;
              document.body.appendChild(script);
              
              // Update button
              const button = document.querySelector('.test-button');
              button.textContent = 'Chatbot Loaded!';
              button.style.background = '#10b981';
              button.disabled = true;
            }
          }
        </script>
      </body>
      </html>
    `;

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);
  } catch (error) {
    console.error("❌ Error serving embed preview:", error);
    res.status(500).json({ error: "Failed to serve embed preview" });
  }
}
