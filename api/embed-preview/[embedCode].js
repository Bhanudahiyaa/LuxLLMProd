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

          function createBeautifulChatbot(config) {
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

            // Add keyframes for animation
            const style = document.createElement('style');
            style.textContent = \`
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
            \`;
            document.head.appendChild(style);

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
              margin-left: auto;
              transition: all 0.2s;
            \`;
            closeBtn.onclick = () => {
              chatWindow.style.display = 'none';
              chatButton.style.display = 'flex';
            };

            // Assemble header
            header.appendChild(headerPattern);
            header.appendChild(avatar);
            header.appendChild(botInfo);
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

            // Add welcome message
            const welcomeMsg = document.createElement('div');
            welcomeMsg.style.cssText = \`
              padding: 12px 16px;
              background: \${config.accentColor || '#f3f4f6'};
              border-radius: 8px;
              color: \${config.textColor || '#1f2937'};
              font-size: 14px;
              line-height: 1.4;
              max-width: 80%;
              align-self: flex-start;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            \`;
            welcomeMsg.textContent = config.welcomeMessage || 'Hello! How can I help you today?';
            messagesArea.appendChild(welcomeMsg);

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
              border-radius: 6px;
              font-size: 14px;
              outline: none;
              background: \${config.backgroundColor};
              color: \${config.textColor || '#1f2937'};
              transition: all 0.2s;
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
              border-radius: 6px;
              cursor: pointer;
              font-size: 14px;
              font-weight: 500;
              transition: all 0.2s;
              box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            \`;
            sendBtn.onmouseenter = () => {
              sendBtn.style.transform = 'scale(1.05)';
              sendBtn.style.boxShadow = \`0 4px 16px \${config.primaryColor}40\`;
            };
            sendBtn.onmouseleave = () => {
              sendBtn.style.transform = 'scale(1)';
              sendBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
            };

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
                // Handle send message
                console.log('Send message:', input.value);
                input.value = '';
              }
            });

            console.log('Beautiful chatbot created with config:', config);
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
