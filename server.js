// Express server for handling public chat API and serving embed files
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || "https://cvetvxgzgfmiqdxdimzn.supabase.co",
  process.env.SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR9cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2ZXR2eGd6Z2ZtaXFkeGRpbXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTk0NTYsImV4cCI6MjA2OTk5NTQ1Nn0.pgNeUr3T2LQNL0qno1bxST6HgqbdIrCkJrkb-wOL5SE"
);

// OpenRouter API configuration
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_API_KEY =
  process.env.OPENROUTER_API_KEY ||
  "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";

// Production configuration
const PRODUCTION_URL = "https://lux-llm-prod.vercel.app";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

// Mock embed configuration for testing (when database is not set up)
const MOCK_EMBED_CONFIG = {
  id: "mock-embed-id",
  name: "Test AI Assistant",
  system_prompt:
    "You are a helpful AI assistant that can answer questions about technology, programming, and general knowledge. Keep your responses concise and helpful.",
  is_active: true,
};

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: "*", // Allow all origins for embedded chatbots
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.static("public"));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Real public chat handler with AI integration
async function handlePublicChat(request) {
  try {
    console.log("🔍 Public chat request:", {
      embedCode: request.embedCode,
      sessionId: request.sessionId,
      messageLength: request.message?.length || 0,
    });

    // For testing purposes, accept any embed code and use mock config
    let embedConfig = MOCK_EMBED_CONFIG;
    let embedId = "mock-embed-id";

    // Try to get real embed configuration from database (optional for now)
    try {
      const { data: embed, error: embedError } = await supabase
        .from("public_embeds")
        .select(
          `
          *,
          agents (
            id,
            name,
            system_prompt,
            theme_config
          )
        `
        )
        .eq("embed_code", request.embedCode)
        .eq("is_active", true)
        .single();

      if (!embedError && embed) {
        embedConfig = embed;
        embedId = embed.id;
        console.log("✅ Found real embed configuration:", embed.id);
      } else {
        console.log("⚠️ Using mock embed configuration for testing");
      }
    } catch (error) {
      console.log("⚠️ Database not set up yet, using mock config");
    }

    // Check rate limiting (simplified for testing)
    let rateLimitExceeded = false;
    try {
      const { count: hourlyCount } = await supabase
        .from("public_conversations")
        .select("*", { count: "exact", head: true })
        .eq("embed_id", embedId)
        .gte("created_at", new Date(Date.now() - 60 * 60 * 1000).toISOString());

      if (hourlyCount && hourlyCount >= 100) {
        rateLimitExceeded = true;
        console.warn("⚠️ Hourly rate limit exceeded for embed:", embedId);
      }
    } catch (error) {
      console.log("⚠️ Rate limiting not available, skipping check");
    }

    if (rateLimitExceeded) {
      return {
        message: "Rate limit exceeded. Please try again later.",
        sessionId: request.sessionId,
        error: "Rate limit exceeded",
      };
    }

    // Try to create conversation (optional for testing)
    let conversation = null;
    try {
      const { data: newConversation, error } = await supabase
        .from("public_conversations")
        .insert({
          embed_id: embedId,
          session_id: request.sessionId,
          visitor_ip: request.visitorIp,
          user_agent: request.userAgent,
        })
        .select()
        .single();

      if (!error) {
        conversation = newConversation;
        console.log("✅ Conversation created:", conversation.id);
      }
    } catch (error) {
      console.log(
        "⚠️ Conversation tracking not available, continuing without it"
      );
    }

    // Get system prompt
    const systemPrompt =
      embedConfig.system_prompt || "You are a helpful AI assistant.";

    // Call OpenRouter AI API
    try {
      console.log(
        "🤖 Calling OpenRouter API with prompt:",
        systemPrompt.substring(0, 100) + "..."
      );

      const response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: request.message },
          ],
          temperature: 0.7,
          max_tokens: 800,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ OpenRouter API error:", response.status, errorText);
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      // Try to store messages if conversation exists
      if (conversation) {
        try {
          await supabase.from("public_messages").insert([
            {
              conversation_id: conversation.id,
              role: "user",
              content: request.message,
            },
            {
              conversation_id: conversation.id,
              role: "assistant",
              content: aiResponse,
            },
          ]);
          console.log("✅ Messages stored successfully");
        } catch (error) {
          console.error("Message storage error:", error);
        }
      }

      console.log("✅ AI response generated successfully");
      return {
        message: aiResponse,
        sessionId: request.sessionId,
      };
    } catch (error) {
      console.error("❌ AI API call error:", error);
      // Return fallback response
      return {
        message:
          "I'm sorry, but I'm having trouble processing your request right now. Please try again in a moment.",
        sessionId: request.sessionId,
        error: "AI API error",
      };
    }
  } catch (error) {
    console.error("❌ Public chat error:", error);
    return {
      message:
        "Sorry, I'm experiencing technical difficulties. Please try again later.",
      sessionId: request.sessionId,
      error: "Internal server error",
    };
  }
}

// Public Chat API endpoint
app.post("/api/public-chat", async (req, res) => {
  try {
    console.log("🔍 Public chat request received:", {
      embedCode: req.body.embedCode,
      sessionId: req.body.sessionId,
      messageLength: req.body.message?.length || 0,
    });

    // Get client IP address
    const clientIp =
      req.ip ||
      req.connection.remoteAddress ||
      req.headers["x-forwarded-for"] ||
      "";

    // Call the handlePublicChat function
    const response = await handlePublicChat({
      embedCode: req.body.embedCode,
      message: req.body.message,
      sessionId: req.body.sessionId,
      visitorIp: clientIp,
      userAgent: req.headers["user-agent"],
    });

    // Set CORS headers
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    if (response.error) {
      return res.status(400).json(response);
    }

    res.json(response);
  } catch (error) {
    console.error("❌ Public chat API error:", error);
    res.status(500).json({
      message: "Internal server error",
      sessionId: req.body.sessionId,
      error: "Server error",
    });
  }
});

// Embed file serving endpoint
app.get("/embed/:embedCode.js", async (req, res) => {
  try {
    const { embedCode } = req.params;
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

    // Read the template file
    const templatePath = path.join(__dirname, "public", "embed-template.js");

    if (fs.existsSync(templatePath)) {
      let templateContent = fs.readFileSync(templatePath, "utf8");

      // Replace placeholders with actual values
      const replacements = {
        "{{EMBED_CODE}}": embedCode,
        "{{CHATBOT_NAME}}":
          embedConfig?.agents?.name || embedConfig?.name || "AI Assistant",
        "{{SYSTEM_PROMPT}}":
          embedConfig?.agents?.system_prompt ||
          "You are a helpful AI assistant that can answer questions about technology, programming, and general knowledge.",
        "{{PRIMARY_COLOR}}": "#3b82f6",
        "{{BACKGROUND_COLOR}}": "#ffffff",
        "{{TEXT_COLOR}}": "#1f2937",
        "{{ACCENT_COLOR}}": "#e5e7eb",
        "{{BORDER_RADIUS}}": "12",
        "{{FONT_SIZE}}": "14",
        "{{FONT_FAMILY}}": "Inter",
        "{{POSITION}}": "bottom-right",
        "{{WELCOME_MESSAGE}}":
          "Hello! I'm your AI assistant. How can I help you today?",
        "{{PLACEHOLDER}}": "Type your message...",
        "{{AVATAR_URL}}": "",
        "{{SHOW_TYPING_INDICATOR}}": "true",
        "{{ENABLE_SOUNDS}}": "false",
        "{{ANIMATION_SPEED}}": "normal",
        "{{API_BASE_URL}}": IS_PRODUCTION
          ? PRODUCTION_URL
          : `http://localhost:${PORT}`,
      };

      // Apply all replacements
      Object.entries(replacements).forEach(([placeholder, value]) => {
        templateContent = templateContent.replace(
          new RegExp(placeholder, "g"),
          value
        );
      });

      res.send(templateContent);
    } else {
      res.status(404).json({ error: "Embed template not found" });
    }
  } catch (error) {
    console.error("❌ Error serving embed file:", error);
    res.status(500).json({ error: "Failed to serve embed file" });
  }
});

// Embed preview endpoint (for testing)
app.get("/embed/:embedCode", (req, res) => {
  const { embedCode } = req.params;
  const baseUrl = IS_PRODUCTION ? PRODUCTION_URL : `http://localhost:${PORT}`;

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
        .status-testing {
          background: #fef3c7;
          color: #92400e;
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
          IS_PRODUCTION
            ? `
        <div class="production-info">
          <strong>🚀 Production Mode:</strong> This embed is running on your production server at ${PRODUCTION_URL}
        </div>
        `
            : ""
        }
        
        <div class="embed-info">
          <h3>Embed Information</h3>
          <p><strong>Embed Code:</strong> <code>${embedCode}</code></p>
          <p><strong>Script URL:</strong> <code>${baseUrl}/embed/${embedCode}.js</code></p>
          <p><strong>Status:</strong> <span class="status-badge ${
            IS_PRODUCTION ? "status-active" : "status-testing"
          }">${IS_PRODUCTION ? "✅ Production" : "🔄 Testing Mode"}</span></p>
          ${
            IS_PRODUCTION
              ? ""
              : "<p><strong>Note:</strong> This is running in testing mode with mock configuration</p>"
          }
        </div>
        
        <div class="test-section">
          <h3>Test Your Chatbot</h3>
          <p>Click the button below to test your chatbot in action. This will load the actual embed script and show you how it will appear on websites.</p>
          <button class="test-button" onclick="loadChatbot()">Load Chatbot</button>
        </div>
      </div>
      
      <script>
        function loadChatbot() {
          // Create script element
          const script = document.createElement('script');
          script.src = '/embed/${embedCode}.js';
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
        }
      </script>
    </body>
    </html>
  `;

  res.send(html);
});

// Analytics endpoint (optional)
app.post("/api/embed-analytics", (req, res) => {
  try {
    const { embedCode, action, url, referrer } = req.body;
    console.log("📊 Analytics event:", { embedCode, action, url, referrer });

    // Here you could store analytics data in your database
    // For now, we'll just log it

    res.json({ success: true });
  } catch (error) {
    console.error("❌ Analytics error:", error);
    res.status(500).json({ error: "Analytics failed" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(
    `📡 Public Chat API: ${
      IS_PRODUCTION ? PRODUCTION_URL : `http://localhost:${PORT}`
    }/api/public-chat`
  );
  console.log(
    `📦 Embed Files: ${
      IS_PRODUCTION ? PRODUCTION_URL : `http://localhost:${PORT}`
    }/embed/[embedCode].js`
  );
  console.log(
    `👀 Health Check: ${
      IS_PRODUCTION ? PRODUCTION_URL : `http://localhost:${PORT}`
    }/health`
  );
  console.log(
    `🔍 Preview: ${
      IS_PRODUCTION ? PRODUCTION_URL : `http://localhost:${PORT}`
    }/embed/[embedCode]`
  );
  console.log(
    `🤖 AI Integration: ${OPENROUTER_API_KEY ? "✅ Enabled" : "❌ Disabled"}`
  );
  console.log(`🗄️ Database: ${supabase ? "✅ Connected" : "❌ Disconnected"}`);
  console.log(
    `🌍 Environment: ${IS_PRODUCTION ? "🚀 Production" : "🧪 Development"}`
  );
  console.log(`🔗 Production URL: ${PRODUCTION_URL}`);
});

export default app;
