export interface ChatbotTemplate {
  id: string
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
  config: {
    name: string
    theme: string
    primaryColor: string
    accentColor: string
    backgroundColor: string
    textColor: string
    borderRadius: number
    fontSize: number
    fontFamily: string
    position: string
    welcomeMessage: string
    systemPrompt: string
    placeholder: string
    avatar: string
    showTypingIndicator: boolean
    enableSounds: boolean
    animationSpeed: string
  }
}

const STORAGE_KEY = "chatbot-templates"

export function saveTemplate(template: Omit<ChatbotTemplate, "id" | "createdAt" | "updatedAt">): ChatbotTemplate {
  const templates = getTemplates()
  const newTemplate: ChatbotTemplate = {
    ...template,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  templates.push(newTemplate)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
  return newTemplate
}

export function getTemplates(): ChatbotTemplate[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []

    const templates = JSON.parse(stored)
    return templates.map((t: any) => ({
      ...t,
      createdAt: new Date(t.createdAt),
      updatedAt: new Date(t.updatedAt),
    }))
  } catch {
    return []
  }
}

export function deleteTemplate(id: string): void {
  const templates = getTemplates().filter((t) => t.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
}

export function updateTemplate(
  id: string,
  updates: Partial<Omit<ChatbotTemplate, "id" | "createdAt">>,
): ChatbotTemplate | null {
  const templates = getTemplates()
  const index = templates.findIndex((t) => t.id === id)

  if (index === -1) return null

  templates[index] = {
    ...templates[index],
    ...updates,
    updatedAt: new Date(),
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
  return templates[index]
}

export function getDefaultTemplates(): ChatbotTemplate[] {
  return [
    {
      id: "default-modern",
      name: "Modern Assistant",
      description: "Clean and contemporary chatbot with blue theme",
      createdAt: new Date(),
      updatedAt: new Date(),
      config: {
        name: "AI Assistant",
        theme: "modern",
        primaryColor: "#3b82f6",
        accentColor: "#8b5cf6",
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
        borderRadius: 12,
        fontSize: 14,
        fontFamily: "Inter",
        position: "bottom-right",
        welcomeMessage: 'Hello! How can I help you today?',
        systemPrompt: 'You are a helpful AI assistant. Answer questions helpfully and concisely.',
        placeholder: 'Type a message...',
        avatar: '/placeholder.svg?height=40&width=40',
        showTypingIndicator: true,
        enableSounds: true,
        animationSpeed: 'normal',
      },
    },
    {
      id: "default-support",
      name: "Customer Support",
      description: "Professional support chatbot with corporate styling",
      createdAt: new Date(),
      updatedAt: new Date(),
      config: {
        name: "Support Agent",
        theme: "corporate",
        primaryColor: "#1e3a8a",
        accentColor: "#d97706",
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
        borderRadius: 6,
        fontSize: 14,
        fontFamily: "Roboto",
        position: "bottom-right",
        welcomeMessage: 'Welcome! I\'m here to help with any questions you may have.',
        systemPrompt: 'You are a professional support agent. Provide helpful and accurate information to assist customers with their inquiries.',
        placeholder: 'How can we assist you?',
        avatar: '/placeholder.svg?height=40&width=40',
        showTypingIndicator: true,
        enableSounds: false,
        animationSpeed: 'normal',
      },
    },
  ]
}
