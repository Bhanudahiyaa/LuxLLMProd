"use client";
import Sidebar from "@/components/Sidebar";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  FileCode,
  Cog,
  Monitor,
  Search,
  FolderOpen,
  Bot,
  Wrench,
  BookOpen,
  Sparkles,
  Zap,
  ChevronLeft,
  ChevronRight,
  Mic,
  Plus,
  MoreHorizontal,
} from "lucide-react";
import Navigation from "@/components/Navigation";

import TemplatesSection from "@/components/agent/TemplatesSection";
import AgentsSection from "@/components/agent/AgentsSection";
import ToolsSection from "@/components/agent/ToolsSection";
import ChatSection from "@/components/agent/ChatSection";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface Template {
  id: string;
  title: string;
  description: string;
}

interface Agent {
  id: string;
  name: string;
  description: string;
  model: string;
  prompt: string;
  tools: string[];
  lastRun: string;
  lastModified: string;
  created: string;
  tasksDone: number;
}

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
}

const models = [
  { label: "GPT-3.5 Turbo", value: "gpt-3.5-turbo" },
  { label: "GPT-4", value: "gpt-4" },
  { label: "Claude 3", value: "claude-3" },
  { label: "Mixtral 8x7B", value: "mixtral-8x7b" },
];

export default function Build() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("custom-ai-agent");
  const [selectedModel, setSelectedModel] = useState(models[0].value);
  const [prompt, setPrompt] = useState("");
  const [agentName, setAgentName] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [agents, setAgents] = useState<Agent[]>([]);
  const stepsRef = useRef<HTMLDivElement>(null);
  const [selectedToolCategory, setSelectedToolCategory] = useState("All tools");

  const handleCreateAgent = async () => {
    if (!prompt.trim()) return;
    const newAgent: Agent = {
      id: Date.now().toString(),
      name: `Agent ${agents.length + 1}`,
      description: prompt,
      model: models.find(m => m.value === selectedModel)?.label || "GPT-3.5",
      prompt: prompt,
      tools: [],
      lastRun: "Never",
      lastModified: "Just now",
      created: "Just now",
      tasksDone: 0,
    };
    setAgents(prev => [newAgent, ...prev]);
    setAgentName(prompt);
    setIsProcessing(true);
    const userMessage: Message = {
      id: Date.now().toString(),
      content: prompt,
      role: "user",
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Agent created with model: ${
          models.find(m => m.value === selectedModel)?.label
        }.\nPrompt: ${prompt}`,
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsProcessing(false);
      setPrompt("");
    }, 2000);
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setPrompt(template.description);
  };

  const templates: Template[] = [
    {
      id: "1",
      title: "Customer Support Bot",
      description: "Responds to common support queries.",
    },
    {
      id: "2",
      title: "Marketing Copy Generator",
      description: "Writes product descriptions and ads.",
    },
  ];

  const tools: Tool[] = [
    {
      id: "1",
      name: "Web Search",
      description: "Search the internet",
      category: "Search",
    },
    {
      id: "2",
      name: "Code Interpreter",
      description: "Run code in-browser",
      category: "Development",
    },
  ];

  return (
    <div className="relative min-h-screen flex">
      {/* Subtle Green Glow Gradient Background */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-primary/5 via-transparent to-transparent shadow-[0_-20px_80px_20px_rgba(34,197,94,0.1)]" />
      <Navigation />
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {/* Main Content */}
      <main className="flex-1 relative z-[2] pt-20 ml-16 sm:ml-64 transition-all duration-300">
        <div className="max-w-6xl mx-auto p-6">
          {activeTab === "templates" && (
            <TemplatesSection
              templates={templates}
              handleTemplateSelect={handleTemplateSelect}
            />
          )}
          {activeTab === "agents" && <AgentsSection agents={agents} />}
          {activeTab === "tools" && (
            <ToolsSection
              tools={tools}
              selectedToolCategory={selectedToolCategory}
              setSelectedToolCategory={setSelectedToolCategory}
            />
          )}
          {messages.length > 0 && <ChatSection messages={messages} />}
        </div>
      </main>
    </div>
  );
}
