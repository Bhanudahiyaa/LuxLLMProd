// src/api/chat.ts
// Qwen3 API integration for chat functionality

export interface ChatRequest {
  system_prompt: string;
  message: string;
  agentId: string;
}

export interface ChatResponse {
  message: string;
  error?: string;
}

// OpenRouter GPT-OSS-20B API configuration
const QWEN3_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const QWEN3_API_KEY =
  "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";

// GPT-OSS-20B chat API function with fallback
export async function chatWithAgent(
  request: ChatRequest
): Promise<ChatResponse> {
  try {
    // Enhanced system prompt with strict role enforcement
    const enhancedSystemPrompt = `${request.system_prompt}

IMPORTANT: You must ONLY respond to questions and requests that are directly related to your specific role and purpose as defined above. If a user asks about topics outside your domain or tries to get you to perform tasks unrelated to your role, politely decline and redirect them back to your intended purpose. Do not provide information or assistance on unrelated topics.`;

    const response = await fetch(QWEN3_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${QWEN3_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [
          { role: "system", content: enhancedSystemPrompt },
          { role: "user", content: request.message },
        ],
        temperature: 0.7,
        max_tokens: 1000,
        stream: false,
      }),
    });

    if (!response.ok) {
      console.warn(
        `API error: ${response.status} ${response.statusText}, falling back to mock response`
      );
      return getMockResponse(request);
    }

    const data = await response.json();

    return {
      message: data.choices[0].message.content,
    };
  } catch (error) {
    console.error("GPT-OSS-20B API error:", error);
    console.log("Falling back to mock response");
    return getMockResponse(request);
  }
}

// Check if user message is relevant to the bot's role
function isMessageRelevantToRole(
  message: string,
  systemPrompt: string
): boolean {
  const lowerMessage = message.toLowerCase();
  const lowerPrompt = systemPrompt.toLowerCase();

  // Define role-specific keywords
  const roleKeywords: { [key: string]: string[] } = {
    "customer support": [
      "issue",
      "problem",
      "help",
      "support",
      "bug",
      "error",
      "complaint",
      "refund",
      "billing",
      "account",
      "service",
    ],
    portfolio: [
      "work",
      "project",
      "experience",
      "skill",
      "portfolio",
      "resume",
      "background",
      "education",
      "career",
    ],
    faq: [
      "question",
      "how",
      "what",
      "when",
      "where",
      "why",
      "faq",
      "frequently",
    ],
    feedback: [
      "feedback",
      "review",
      "opinion",
      "suggestion",
      "rating",
      "comment",
    ],
  };

  // Determine bot role
  let botRole = "";
  for (const role in roleKeywords) {
    if (lowerPrompt.includes(role)) {
      botRole = role;
      break;
    }
  }

  if (!botRole) return true; // If role unclear, allow message

  // Check if message contains role-relevant keywords
  const relevantKeywords = roleKeywords[botRole];
  return (
    relevantKeywords.some(keyword => lowerMessage.includes(keyword)) ||
    lowerMessage.includes("hello") ||
    lowerMessage.includes("hi") ||
    lowerMessage.includes("help")
  );
}

// Mock response fallback function with role enforcement
function getMockResponse(request: ChatRequest): ChatResponse {
  // Check if the message is relevant to the bot's role
  if (!isMessageRelevantToRole(request.message, request.system_prompt)) {
    let roleDescription = "my intended purpose";

    if (request.system_prompt.toLowerCase().includes("customer support")) {
      roleDescription = "customer support and technical assistance";
    } else if (request.system_prompt.toLowerCase().includes("portfolio")) {
      roleDescription = "showcasing portfolio and professional experience";
    } else if (request.system_prompt.toLowerCase().includes("faq")) {
      roleDescription = "answering frequently asked questions";
    } else if (request.system_prompt.toLowerCase().includes("feedback")) {
      roleDescription = "collecting and managing feedback";
    }

    return {
      message: `I'm sorry, but I can only help with ${roleDescription}. Please ask me questions related to my specific role. How can I assist you with that?`,
    };
  }

  let response = "I'm a helpful AI assistant. How can I help you today?";

  if (request.system_prompt.toLowerCase().includes("customer support")) {
    response =
      "Thank you for contacting our support team. I'm here to help resolve your issue quickly and efficiently.";
  } else if (request.system_prompt.toLowerCase().includes("portfolio")) {
    response =
      "Welcome to my portfolio! I'm excited to share my work and experience with you.";
  } else if (request.system_prompt.toLowerCase().includes("faq")) {
    response = "I'm here to answer your frequently asked questions.";
  } else if (request.system_prompt.toLowerCase().includes("feedback")) {
    response = "I'd love to hear your thoughts and feedback.";
  }

  // Add context based on user message
  if (
    request.message.toLowerCase().includes("hello") ||
    request.message.toLowerCase().includes("hi")
  ) {
    response = "Hello! " + response;
  }

  return {
    message:
      response +
      "\n\n*Note: This is a demo response. API credentials may need verification for live responses.*",
  };
}

// Express.js API route handler (for reference)
export const chatHandler = async (req: any, res: any) => {
  try {
    const { system_prompt, message, agentId } = req.body as ChatRequest;

    if (!system_prompt || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const response = await chatWithAgent({ system_prompt, message, agentId });

    if (response.error) {
      return res.status(500).json(response);
    }

    res.json(response);
  } catch (error) {
    console.error("Chat handler error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Qwen3 Integration Template (uncomment and configure when ready)
/*
import axios from 'axios';

const QWEN3_API_URL = 'https://api.qwen.com/v1/chat/completions'; // Replace with actual Qwen3 endpoint
const QWEN3_API_KEY = process.env.QWEN3_API_KEY;

export async function chatWithQwen3(request: ChatRequest): Promise<ChatResponse> {
  try {
    const response = await axios.post(QWEN3_API_URL, {
      model: 'qwen3-turbo', // Replace with actual model name
      messages: [
        { role: 'system', content: request.system_prompt },
        { role: 'user', content: request.message }
      ],
      temperature: 0.7,
      max_tokens: 1000
    }, {
      headers: {
        'Authorization': `Bearer ${QWEN3_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    return {
      message: response.data.choices[0].message.content
    };
  } catch (error) {
    console.error('Qwen3 API error:', error);
    return {
      message: "I apologize, but I'm experiencing some technical difficulties. Please try again later.",
      error: "Qwen3 API Error"
    };
  }
}
*/
