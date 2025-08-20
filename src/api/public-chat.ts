// Public Chat API for embedded chatbots
// This endpoint handles chat requests from public embedded widgets

import { createClient } from "@supabase/supabase-js";

// Types
export interface PublicChatRequest {
  embedCode: string;
  message: string;
  sessionId: string;
  visitorIp?: string;
  userAgent?: string;
}

export interface PublicChatResponse {
  message: string;
  sessionId: string;
  error?: string;
}

// Supabase client for public operations
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
);

// OpenRouter API configuration
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

// Validate API key
if (!OPENROUTER_API_KEY) {
  console.error("❌ VITE_OPENROUTER_API_KEY is not set");
  throw new Error("OpenRouter API key is not configured");
}

// Main public chat function
export async function handlePublicChat(
  request: PublicChatRequest
): Promise<PublicChatResponse> {
  try {
    console.log("🔍 Public chat request:", {
      embedCode: request.embedCode,
      sessionId: request.sessionId,
      messageLength: request.message.length,
    });

    // 1. Validate embed code and get embed configuration
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

    if (embedError || !embed) {
      console.error("❌ Embed not found or inactive:", embedError);
      return {
        message: "Chatbot is currently unavailable. Please try again later.",
        sessionId: request.sessionId,
        error: "Embed not found or inactive",
      };
    }

    console.log("✅ Embed found:", embed.id);

    // 2. Check rate limiting
    const rateLimitCheck = await checkRateLimits(embed.id);
    if (!rateLimitCheck.allowed) {
      console.warn("⚠️ Rate limit exceeded for embed:", embed.id);
      return {
        message: "Rate limit exceeded. Please try again later.",
        sessionId: request.sessionId,
        error: "Rate limit exceeded",
      };
    }

    // 3. Get or create conversation
    const conversation = await getOrCreateConversation(
      embed.id,
      request.sessionId,
      request.visitorIp,
      request.userAgent
    );

    // 4. Get agent configuration
    const agent = embed.agents;
    if (!agent) {
      console.error("❌ Agent not found for embed:", embed.id);
      return {
        message: "Chatbot configuration error. Please try again later.",
        sessionId: request.sessionId,
        error: "Agent not found",
      };
    }

    // 5. Call AI API
    const aiResponse = await callAI(
      agent.system_prompt || "You are a helpful AI assistant.",
      request.message,
      embed.id
    );

    // 6. Store messages in database
    await storeMessages(conversation.id, request.message, aiResponse.message);

    // 7. Update analytics
    await updateAnalytics(embed.id, conversation.id);

    console.log("✅ Public chat completed successfully");

    return {
      message: aiResponse.message,
      sessionId: request.sessionId,
    };
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

// Check rate limits for an embed
async function checkRateLimits(
  embedId: string
): Promise<{ allowed: boolean; reason?: string }> {
  try {
    // Get current hour and day
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDayOfYear();

    // Check hourly limit
    const { count: hourlyCount } = await supabase
      .from("public_conversations")
      .select("*", { count: "exact", head: true })
      .eq("embed_id", embedId)
      .gte(
        "created_at",
        new Date(now.getTime() - 60 * 60 * 1000).toISOString()
      );

    if (hourlyCount && hourlyCount >= 100) {
      // Default hourly limit
      return { allowed: false, reason: "Hourly rate limit exceeded" };
    }

    // Check daily limit
    const { count: dailyCount } = await supabase
      .from("public_conversations")
      .select("*", { count: "exact", head: true })
      .eq("embed_id", embedId)
      .gte(
        "created_at",
        new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()
      );

    if (dailyCount && dailyCount >= 1000) {
      // Default daily limit
      return { allowed: false, reason: "Daily rate limit exceeded" };
    }

    return { allowed: true };
  } catch (error) {
    console.error("Rate limit check error:", error);
    // Allow request if rate limit check fails
    return { allowed: true };
  }
}

// Get or create conversation for a session
async function getOrCreateConversation(
  embedId: string,
  sessionId: string,
  visitorIp?: string,
  userAgent?: string
) {
  try {
    // Try to find existing conversation
    let { data: conversation } = await supabase
      .from("public_conversations")
      .select("*")
      .eq("embed_id", embedId)
      .eq("session_id", sessionId)
      .eq("is_active", true)
      .single();

    if (conversation) {
      // Update existing conversation
      const { data: updatedConversation } = await supabase
        .from("public_conversations")
        .update({
          last_message_at: new Date().toISOString(),
          total_messages: conversation.total_messages + 1,
        })
        .eq("id", conversation.id)
        .select()
        .single();

      return updatedConversation || conversation;
    }

    // Create new conversation
    const { data: newConversation, error } = await supabase
      .from("public_conversations")
      .insert({
        embed_id: embedId,
        session_id: sessionId,
        visitor_ip: visitorIp,
        user_agent: userAgent,
      })
      .select()
      .single();

    if (error) throw error;
    return newConversation;
  } catch (error) {
    console.error("Conversation creation error:", error);
    throw error;
  }
}

// Call AI API
async function callAI(
  systemPrompt: string,
  userMessage: string,
  embedId: string
) {
  try {
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
          { role: "user", content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 800,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    return { message: data.choices[0].message.content };
  } catch (error) {
    console.error("AI API call error:", error);
    // Return fallback response
    return {
      message:
        "I'm sorry, but I'm having trouble processing your request right now. Please try again in a moment.",
    };
  }
}

// Store messages in database
async function storeMessages(
  conversationId: string,
  userMessage: string,
  aiMessage: string
) {
  try {
    // Store user message
    await supabase.from("public_messages").insert({
      conversation_id: conversationId,
      role: "user",
      content: userMessage,
    });

    // Store AI message
    await supabase.from("public_messages").insert({
      conversation_id: conversationId,
      role: "assistant",
      content: aiMessage,
    });
  } catch (error) {
    console.error("Message storage error:", error);
    // Don't throw - this is not critical for the chat to work
  }
}

// Update analytics
async function updateAnalytics(embedId: string, conversationId: string) {
  try {
    const today = new Date().toISOString().split("T")[0];

    // Try to update existing analytics record
    const { error: updateError } = await supabase
      .from("public_analytics")
      .update({
        total_messages: supabase.sql`total_messages + 2`, // +2 for user + AI message
        updated_at: new Date().toISOString(),
      })
      .eq("embed_id", embedId)
      .eq("date", today);

    if (updateError) {
      // Create new analytics record if it doesn't exist
      await supabase.from("public_analytics").insert({
        embed_id: embedId,
        date: today,
        total_conversations: 1,
        total_messages: 2,
        total_tokens: 0,
        unique_visitors: 1,
      });
    }
  } catch (error) {
    console.error("Analytics update error:", error);
    // Don't throw - this is not critical for the chat to work
  }
}

// Express.js handler for reference
export const publicChatHandler = async (
  req: { body: PublicChatRequest },
  res: any
) => {
  try {
    const { embedCode, message, sessionId, visitorIp, userAgent } = req.body;

    if (!embedCode || !message || !sessionId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const response = await handlePublicChat({
      embedCode,
      message,
      sessionId,
      visitorIp,
      userAgent,
    });

    res.json(response);
  } catch (error) {
    console.error("Public chat handler error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
