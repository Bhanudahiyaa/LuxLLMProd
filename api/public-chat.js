import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || "https://cvetvxgzgfmiqdxdimzn.supabase.co",
  process.env.SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2ZXR2eGd6Z2ZtaXFkeGRpbXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTk0NTYsImV4cCI6MjA2OTk5NTQ1Nn0.pgNeUr3T2LQNL0qno1bxST6HgqbdIrCkJrkb-wOL5SE"
);

// OpenRouter API configuration
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Log environment variable status (for debugging)
console.log("🔑 Environment check:", {
  hasOpenRouterKey: !!OPENROUTER_API_KEY,
  keyLength: OPENROUTER_API_KEY ? OPENROUTER_API_KEY.length : 0,
  nodeEnv: process.env.NODE_ENV,
  supabaseUrl: !!process.env.SUPABASE_URL,
  supabaseKey: !!process.env.SUPABASE_ANON_KEY
});

if (!OPENROUTER_API_KEY) {
  console.error("❌ CRITICAL: OPENROUTER_API_KEY is not set!");
}

// Mock embed configuration for testing
const MOCK_EMBED_CONFIG = {
  id: "mock-embed-id",
  name: "Test AI Assistant",
  system_prompt:
    "You are a helpful AI assistant that can answer questions about technology, programming, and general knowledge. Keep your responses concise and helpful.",
  is_active: true,
};

// Handle public chat with AI integration
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

    // Try to get real embed configuration from database
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

    // Check rate limiting
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

    // Try to create conversation
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
      embedConfig?.agents?.system_prompt || embedConfig.system_prompt || "You are a helpful AI assistant.";

    // Call OpenRouter AI API
    try {
      if (!OPENROUTER_API_KEY) {
        throw new Error("OpenRouter API key is not configured");
      }

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
        throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
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
      return {
        message:
          "I'm sorry, but I'm having trouble processing your request right now. Please try again in a moment.",
        sessionId: request.sessionId,
        error: "AI API error",
        details: error.message
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

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("🔍 Public chat request received:", {
      embedCode: req.body.embedCode,
      sessionId: req.body.sessionId,
      messageLength: req.body.message?.length || 0,
    });

    // Get client IP address
    const clientIp =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress || "";

    // Call the handlePublicChat function
    const response = await handlePublicChat({
      embedCode: req.body.embedCode,
      message: req.body.message,
      sessionId: req.body.sessionId,
      visitorIp: clientIp,
      userAgent: req.headers["user-agent"],
    });

    if (response.error) {
      return res.status(400).json(response);
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("❌ Public chat API error:", error);
    res.status(500).json({
      message: "Internal server error",
      sessionId: req.body.sessionId,
      error: "Server error",
    });
  }
}
