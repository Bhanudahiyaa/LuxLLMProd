// src/api/chat.ts
// Qwen3 API integration for chat functionality

export interface ChatRequest {
  system_prompt: string;
  message: string;
  agentId: string; // tells us which template is active
}

export interface ChatResponse {
  message: string;
  error?: string;
}

const QWEN3_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const QWEN3_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

// Validate API key is present
if (!QWEN3_API_KEY) {
  console.error("❌ Missing VITE_OPENROUTER_API_KEY");
  throw new Error("OpenRouter API key is not configured");
} else {
  console.log("✅ OpenRouter API key loaded");
}

// Main chat function
export async function chatWithAgent(
  request: ChatRequest
): Promise<ChatResponse> {
  try {
    const enhancedSystemPrompt = `
${request.system_prompt}

INSTRUCTIONS:
- Keep replies short, natural, and chat-friendly.
- Default: reply in 1–3 sentences or quick steps.
- Only give longer, detailed instructions if user asks for “details”, “step by step”, or “full guide”.
- Stay strictly in your role: ${getRoleFromAgentId(request.agentId)}.
- If asked something unrelated, politely redirect back to your role.

Example:
User: "reset password"
Assistant: "Go to Login → Forgot Password → enter email → follow reset link."
User: "reset password step by step"
Assistant: "Sure, here’s the full guide: (detailed version)"
`;

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
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      console.error("❌ API Error:", await response.text());
      return getMockResponse(request);
    }

    const data = await response.json();
    return { message: data.choices[0].message.content };
  } catch (error) {
    console.error("Chat API error:", error);
    return getMockResponse(request);
  }
}

// Role mapping
function getRoleFromAgentId(agentId: string): string {
  const id = agentId.toLowerCase();
  if (id.includes("support")) return "Customer Support Bot";
  if (id.includes("portfolio")) return "Portfolio Bot";
  if (id.includes("faq")) return "FAQ Bot";
  if (id.includes("feedback")) return "Feedback Bot";
  if (id.includes("sales")) return "Sales Bot";
  if (id.includes("meeting")) return "Meeting Prep Bot";
  if (id.includes("document")) return "Document Generator Bot";
  return "AI Assistant";
}

// Concise mock fallback
function getMockResponse(request: ChatRequest): ChatResponse {
  const role = getRoleFromAgentId(request.agentId);

  const responses: Record<string, string> = {
    "Customer Support Bot":
      "Hi! I can help with login issues, orders, refunds, or troubleshooting. What do you need?",
    "Portfolio Bot":
      "I can show your projects, skills, and experience. Want me to highlight skills or recent work?",
    "FAQ Bot":
      "I can answer quick questions about hours, policies, services, or common issues. What’s on your mind?",
    "Feedback Bot":
      "I’d love your feedback! Tell me what you liked or what could be improved.",
    "Sales Bot":
      "I can share product details, pricing, and recommendations. What would you like to explore?",
    "Meeting Prep Bot":
      "I can help set agendas, notes, or prep materials. Which meeting is this for?",
    "Document Generator Bot":
      "I can create reports, proposals, or templates. What type of document do you need?",
    "AI Assistant":
      "I can help with tasks, questions, or ideas. What would you like to do?",
  };

  return { message: responses[role] || responses["AI Assistant"] };
}

// Express.js handler
export const chatHandler = async (req: { body: ChatRequest }, res: any) => {
  try {
    const { system_prompt, message, agentId } = req.body;
    if (!system_prompt || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const response = await chatWithAgent({ system_prompt, message, agentId });
    res.json(response);
  } catch (error) {
    console.error("Chat handler error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
