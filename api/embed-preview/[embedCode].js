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
                
                // Create script element with configuration passed via URL
                const script = document.createElement('script');
                script.src = \`/api/embed-script/${embedCode}.js?config=\${encodeURIComponent(configParam)}\`;
                script.async = true;
                
                // Add to page
                document.body.appendChild(script);
                
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
