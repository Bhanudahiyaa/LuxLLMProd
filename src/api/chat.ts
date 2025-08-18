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

// GPT-OSS-20B chat API function with role enforcement
export async function chatWithAgent(
  request: ChatRequest
): Promise<ChatResponse> {
  try {
    // FIRST: Check if message is relevant to bot's role
    if (!isMessageRelevantToRole(request.message, request.system_prompt)) {
      console.log("Message rejected by role enforcement:", request.message);
      return getMockResponse(request);
    }

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

  console.log("🔍 Role Enforcement Check:");
  console.log("Message:", message);
  console.log("System Prompt:", systemPrompt);
  console.log("Lower Message:", lowerMessage);
  console.log("Lower Prompt:", lowerPrompt);

  // Define role-specific keywords with comprehensive coverage
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
      "broken",
      "not working",
      "can't",
      "cannot",
      "failed",
      "crash",
      "freeze",
      "slow",
      "performance",
      "quality",
      "defect",
      "fault",
      "glitch",
      "customer service",
      "help desk",
      "support team",
      "technical support",
      "troubleshooting",
      "how to",
      "guide",
      "instruction",
      "manual",
      "documentation",
      "faq",
      "frequently asked",
      "order",
      "product",
      "shipping",
      "delivery",
      "payment",
      "login",
      "password",
      "access",
      "feature",
      "functionality",
      "technical",
      "assistance",
      "troubleshoot",
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
      "achievement",
      "expertise",
      "technology",
      "framework",
      "language",
      "tool",
      "methodology",
      "certification",
      "training",
      "professional",
      "development",
      "design",
      "analysis",
      "strategy",
      "consulting",
      "code",
      "software",
      "application",
      "website",
      "app",
      "program",
      "system",
      "database",
      "api",
      "frontend",
      "backend",
      "fullstack",
      "mobile",
      "web",
      "desktop",
      "cloud",
      "devops",
      "testing",
      "deployment",
      "architecture",
      "algorithm",
      "data structure",
      "optimization",
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
      "asked",
      "information",
      "guide",
      "tutorial",
      "instruction",
      "process",
      "procedure",
      "policy",
      "rule",
      "requirement",
      "eligibility",
      "deadline",
      "timeline",
      "schedule",
      "availability",
      "location",
      "contact",
      "details",
      "explanation",
      "clarification",
      "understanding",
      "learn",
      "study",
      "research",
      "investigation",
      "exploration",
      "discovery",
      "knowledge",
      "fact",
      "truth",
      "reality",
      "situation",
      "circumstance",
      "condition",
      "status",
    ],
    feedback: [
      "feedback",
      "review",
      "opinion",
      "suggestion",
      "rating",
      "comment",
      "evaluation",
      "assessment",
      "impression",
      "experience",
      "satisfaction",
      "improvement",
      "recommendation",
      "complaint",
      "praise",
      "criticism",
      "survey",
      "poll",
      "vote",
      "preference",
      "choice",
      "option",
      "alternative",
      "comparison",
      "analysis",
      "thought",
      "feeling",
      "emotion",
      "like",
      "dislike",
      "love",
      "hate",
      "enjoy",
      "bother",
      "annoy",
      "please",
      "disappoint",
      "exceed",
      "meet",
      "expectation",
      "standard",
      "quality",
      "value",
      "worth",
      "benefit",
    ],
  };

  // Define OFF-TOPIC keywords that should REJECT messages for each role
  const offTopicKeywords: { [key: string]: string[] } = {
    "customer support": [
      "recipe",
      "cooking",
      "food",
      "kitchen",
      "ingredient",
      "chef",
      "restaurant",
      "meal",
      "portfolio",
      "resume",
      "career",
      "skill",
      "project",
      "work",
      "experience",
      "feedback",
      "review",
      "opinion",
      "rating",
      "survey",
      "poll",
    ],
    portfolio: [
      "recipe",
      "cooking",
      "food",
      "kitchen",
      "ingredient",
      "chef",
      "restaurant",
      "meal",
      "customer support",
      "help",
      "bug",
      "error",
      "complaint",
      "refund",
      "billing",
      "feedback",
      "review",
      "opinion",
      "rating",
      "survey",
      "poll",
    ],
    faq: [
      "recipe",
      "cooking",
      "food",
      "kitchen",
      "ingredient",
      "chef",
      "restaurant",
      "meal",
      "portfolio",
      "resume",
      "career",
      "skill",
      "project",
      "work",
      "experience",
      "customer support",
      "help",
      "bug",
      "error",
      "complaint",
      "refund",
      "billing",
    ],
    feedback: [
      "recipe",
      "cooking",
      "food",
      "kitchen",
      "ingredient",
      "chef",
      "restaurant",
      "meal",
      "portfolio",
      "resume",
      "career",
      "skill",
      "project",
      "work",
      "experience",
      "customer support",
      "help",
      "bug",
      "error",
      "complaint",
      "refund",
      "billing",
    ],
  };

  // Determine bot role more intelligently with weighted scoring
  let botRole = "";
  let roleConfidence = 0;

  for (const [role, keywords] of Object.entries(roleKeywords)) {
    let score = 0;
    for (const keyword of keywords) {
      if (lowerPrompt.includes(keyword)) {
        score += 1;
      }
    }
    if (score > roleConfidence) {
      roleConfidence = score;
      botRole = role;
    }
  }

  console.log("🎯 Role Detection Results:");
  console.log("Detected Role:", botRole);
  console.log("Role Confidence:", roleConfidence);

  // If no clear role detected, be more lenient
  if (roleConfidence < 0) {
    console.log("❌ Role confidence too low, rejecting message");
    return false;
  }

  // Additional domain-specific role validation
  if (botRole === "portfolio") {
    // Portfolio bot should have strong technical/professional indicators
    const portfolioIndicators = [
      "portfolio",
      "resume",
      "career",
      "professional",
      "developer",
      "engineer",
      "designer",
    ];
    const hasPortfolioIndicators = portfolioIndicators.some(indicator =>
      lowerPrompt.includes(indicator)
    );
    if (!hasPortfolioIndicators) {
      return false; // Reject if not clearly a portfolio bot
    }
  }

  if (botRole === "customer support") {
    // Customer support bot should have strong support/service indicators
    const supportIndicators = [
      "support",
      "help",
      "customer",
      "service",
      "assist",
      "troubleshoot",
    ];
    const hasSupportIndicators = supportIndicators.some(indicator =>
      lowerPrompt.includes(indicator)
    );
    if (!hasSupportIndicators) {
      return false; // Reject if not clearly a support bot
    }
  }

  // Allow meta questions about the bot/app regardless of role
  const metaChecks: ((text: string) => boolean)[] = [
    t => t.includes("who are you"),
    t => t.includes("what do you do"),
    t => t.includes("what's your role"),
    t => t.includes("what is your role"),
    t => t.includes("what is this app"),
    t => t.includes("what does this app do"),
    t => t.includes("about you"),
    t => t.includes("about this app"),
    t => t.includes("your purpose"),
    t => t.includes("what are you"),
    t => t.includes("policy"),
    t => t.includes("rule"),
    t => t.includes("information"),
    t => t.includes("explain"),
    t => t.includes("tell me"),
    t => t.includes("describe"),
    t => t.includes("what is"),
    t => t.includes("what are"),
    t => t.includes("how does"),
    t => t.includes("can you"),
    t => t.includes("could you"),
  ];
  if (metaChecks.some(fn => fn(lowerMessage))) {
    console.log("ℹ️ Meta question detected - allowing");
    return true;
  }

  // Check if message contains role-relevant keywords
  const relevantKeywords = roleKeywords[botRole];
  const messageRelevance = relevantKeywords.some(keyword =>
    lowerMessage.includes(keyword)
  );

  // If message has any role-relevant keywords, allow it
  if (messageRelevance) {
    console.log("✅ Message contains role-relevant keywords, allowing");
    return true;
  }

  // Check if message contains OFF-TOPIC keywords (should reject)
  const currentOffTopicKeywords = offTopicKeywords[botRole];
  const hasOffTopicContent = currentOffTopicKeywords.some(keyword =>
    lowerMessage.includes(keyword)
  );

  console.log("🚫 Off-Topic Check:");
  console.log("Off-topic keywords for role:", currentOffTopicKeywords);
  console.log("Has off-topic content:", hasOffTopicContent);

  // Only reject if message contains multiple off-topic keywords (more lenient)
  const offTopicCount = currentOffTopicKeywords.filter(keyword =>
    lowerMessage.includes(keyword)
  ).length;
  if (offTopicCount > 2) {
    console.log("❌ Message contains too many off-topic keywords, rejecting");
    return false;
  }

  // Allow basic greetings (will be answered with role summary)
  const hasBasicGreeting =
    lowerMessage.includes("hello") ||
    lowerMessage.includes("hi") ||
    lowerMessage.includes("hey");
  if (hasBasicGreeting) {
    console.log("👋 Greeting detected - allowing");
    return true;
  }

  // Allow help/support requests only if they're role-specific
  if (lowerMessage.includes("help") || lowerMessage.includes("support")) {
    console.log("🔍 Help/Support check - returning:", messageRelevance);
    return messageRelevance;
  }

  console.log("✅ Final result - Message relevant:", messageRelevance);
  return messageRelevance;
}

// Mock response fallback function with role enforcement
function getMockResponse(request: ChatRequest): ChatResponse {
  // Since this function is called when role enforcement has already failed,
  // we know the message is NOT relevant, so we can directly provide the rejection response
  let roleDescription = "my intended purpose";
  let roleName = "AI Assistant";

  if (request.system_prompt.toLowerCase().includes("customer support")) {
    roleDescription = "customer support and technical assistance";
    roleName = "Customer Support Bot";
  } else if (request.system_prompt.toLowerCase().includes("portfolio")) {
    roleDescription = "showcasing portfolio and professional experience";
    roleName = "Portfolio Bot";
  } else if (request.system_prompt.toLowerCase().includes("faq")) {
    roleDescription = "answering frequently asked questions";
    roleName = "FAQ Bot";
  } else if (request.system_prompt.toLowerCase().includes("feedback")) {
    roleDescription = "collecting and managing feedback";
    roleName = "Feedback Bot";
  }

  return {
    message: `I'm sorry, but I'm a ${roleName} and I can only help with ${roleDescription}. 

For example:
${getRoleExamples(request.system_prompt)}

Please ask me questions related to my specific role. How can I assist you with that?`,
  };

  let response = "I'm a helpful AI assistant. How can I help you today?";

  if (request.system_prompt.toLowerCase().includes("customer support")) {
    response =
      "Thank you for contacting our support team. I'm here to help resolve your issue quickly and efficiently. What technical problem or customer service issue can I assist you with today?";
  } else if (request.system_prompt.toLowerCase().includes("portfolio")) {
    response =
      "Welcome to my portfolio! I'm excited to share my work and experience with you. What would you like to know about my projects, skills, or professional background?";
  } else if (request.system_prompt.toLowerCase().includes("faq")) {
    response =
      "I'm here to answer your frequently asked questions. What information would you like to know?";
  } else if (request.system_prompt.toLowerCase().includes("feedback")) {
    response =
      "I'd love to hear your thoughts and feedback. What would you like to share with me?";
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

// Helper function to provide role-specific examples
function getRoleExamples(systemPrompt: string): string {
  const lowerPrompt = systemPrompt.toLowerCase();

  if (lowerPrompt.includes("customer support")) {
    return `• "I'm having trouble logging into my account"
• "My order hasn't arrived yet"
• "There's a bug in the app"
• "How do I request a refund?"`;
  } else if (lowerPrompt.includes("portfolio")) {
    return `• "What projects have you worked on?"
• "What technologies do you know?"
• "Tell me about your experience"
• "What are your skills?"`;
  } else if (lowerPrompt.includes("faq")) {
    return `• "What are your business hours?"
• "How do I contact support?"
• "What's your return policy?"
• "Where are you located?"`;
  } else if (lowerPrompt.includes("feedback")) {
    return `• "I love your product!"
• "Here's what could be improved"
• "What do you think of our service?"
• "Rate your experience with us"`;
  }

  return "• Ask me questions related to my specific purpose";
}

// Express.js API route handler (for reference)
export const chatHandler = async (
  req: { body: ChatRequest },
  res: {
    status: (code: number) => { json: (data: unknown) => void };
    json: (data: unknown) => void;
  }
) => {
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
