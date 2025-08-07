"use client";

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
import { GradientBars } from "@/components/ui/gradient-bars";
import Navigation from "@/components/Navigation";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
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
  avatar?: string;
}

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  author: string;
}

const templates: Template[] = [
  {
    id: "1",
    name: "News Summarizer",
    description: "AI that summarizes news articles in plain English",
    icon: <FileCode className="w-6 h-6" />,
    category: "Productivity",
  },
  {
    id: "2",
    name: "Code Assistant",
    description: "AI that helps with coding and debugging",
    icon: <Cog className="w-6 h-6" />,
    category: "Development",
  },
  {
    id: "3",
    name: "Content Writer",
    description: "AI that writes engaging content and articles",
    icon: <Monitor className="w-6 h-6" />,
    category: "Content",
  },
  {
    id: "4",
    name: "Data Analyzer",
    description: "AI that analyzes and visualizes data",
    icon: <Search className="w-6 h-6" />,
    category: "Analytics",
  },
  {
    id: "5",
    name: "Customer Support",
    description: "AI that handles customer inquiries",
    icon: <Bot className="w-6 h-6" />,
    category: "Support",
  },
  {
    id: "6",
    name: "Task Manager",
    description: "AI that helps organize and prioritize tasks",
    icon: <FolderOpen className="w-6 h-6" />,
    category: "Productivity",
  },
];

const models = [
  { label: "GPT-3.5 Turbo", value: "gpt-3.5-turbo" },
  { label: "GPT-4", value: "gpt-4" },
  { label: "Claude 3", value: "claude-3" },
  { label: "Mixtral 8x7B", value: "mixtral-8x7b" },
];

const tools: Tool[] = [
  // Communications
  {
    id: "1",
    name: "Send Email via Gmail",
    description: "Send emails through Gmail integration",
    category: "Communications",
    icon: <Search className="w-6 h-6" />,
    author: "Relevance AI",
  },
  {
    id: "2",
    name: "Get Email Content from Gmail",
    description: "Retrieve email content from Gmail",
    category: "Communications",
    icon: <Search className="w-6 h-6" />,
    author: "Relevance AI",
  },
  {
    id: "3",
    name: "Send Direct Message via Microsoft Teams",
    description: "Send messages through Microsoft Teams",
    category: "Communications",
    icon: <Search className="w-6 h-6" />,
    author: "Relevance AI",
  },
  // CRM
  {
    id: "4",
    name: "Create Contact in HubSpot",
    description: "Create new contacts in HubSpot CRM",
    category: "CRM",
    icon: <Search className="w-6 h-6" />,
    author: "Relevance AI",
  },
  {
    id: "5",
    name: "Get Contact Details from HubSpot",
    description: "Retrieve contact information from HubSpot",
    category: "CRM",
    icon: <Search className="w-6 h-6" />,
    author: "Relevance AI",
  },
  {
    id: "6",
    name: "Create Company in HubSpot",
    description: "Create new companies in HubSpot",
    category: "CRM",
    icon: <Search className="w-6 h-6" />,
    author: "Relevance AI",
  },
  // Calendar
  {
    id: "7",
    name: "Create Event in Google Calendar",
    description: "Schedule events in Google Calendar",
    category: "Calendar",
    icon: <Search className="w-6 h-6" />,
    author: "Relevance AI",
  },
  {
    id: "8",
    name: "Get Events from Google Calendar",
    description: "Retrieve calendar events",
    category: "Calendar",
    icon: <Search className="w-6 h-6" />,
    author: "Relevance AI",
  },
  {
    id: "9",
    name: "Check Calendar Availability",
    description: "Check available time slots",
    category: "Calendar",
    icon: <Search className="w-6 h-6" />,
    author: "Relevance AI",
  },
  // Data Scraper
  {
    id: "10",
    name: "Extract Data from Website",
    description: "Scrape data from web pages",
    category: "Data Scraper",
    icon: <Search className="w-6 h-6" />,
    author: "Relevance AI",
  },
  {
    id: "11",
    name: "Extract Company Insights from LinkedIn",
    description: "Get company information from LinkedIn",
    category: "Data Scraper",
    icon: <Search className="w-6 h-6" />,
    author: "Relevance AI",
  },
  {
    id: "12",
    name: "Get Posts from Twitter/X",
    description: "Retrieve posts from Twitter/X",
    category: "Data Scraper",
    icon: <Search className="w-6 h-6" />,
    author: "Relevance AI",
  },
  // Handle Files
  {
    id: "13",
    name: "Read CSV File",
    description: "Read and parse CSV files",
    category: "Handle Files",
    icon: <Search className="w-6 h-6" />,
    author: "Relevance AI",
  },
  {
    id: "14",
    name: "Extract Data from PDF",
    description: "Extract text and data from PDF files",
    category: "Handle Files",
    icon: <Search className="w-6 h-6" />,
    author: "Relevance AI",
  },
  {
    id: "15",
    name: "Upload File to Knowledge Base",
    description: "Upload files to knowledge base",
    category: "Handle Files",
    icon: <Search className="w-6 h-6" />,
    author: "Relevance AI",
  },
  // Knowledge
  {
    id: "16",
    name: "Add Answer to Knowledge Base",
    description: "Add answers to knowledge base",
    category: "Knowledge",
    icon: <Search className="w-6 h-6" />,
    author: "Relevance AI",
  },
  {
    id: "17",
    name: "Retrieve from Knowledge Base",
    description: "Search and retrieve from knowledge base",
    category: "Knowledge",
    icon: <Search className="w-6 h-6" />,
    author: "Relevance AI",
  },
  {
    id: "18",
    name: "Update Knowledge Record",
    description: "Update existing knowledge records",
    category: "Knowledge",
    icon: <Search className="w-6 h-6" />,
    author: "Relevance AI",
  },
];

const toolCategories = [
  "All tools",
  "Communications",
  "CRM",
  "Calendar",
  "Data Scraper",
  "Handle Files",
  "Knowledge",
];

export default function Build() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("templates");
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

  const sidebarItems = [
    {
      id: "templates",
      label: "Explore All Templates",
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      id: "workspace",
      label: "Workspace",
      icon: <FolderOpen className="w-5 h-5" />,
    },
    {
      id: "agents",
      label: "Your Custom AI Agents",
      icon: <Bot className="w-5 h-5" />,
    },
    { id: "tools", label: "Tools", icon: <Wrench className="w-5 h-5" /> },
    {
      id: "knowledge",
      label: "Knowledge",
      icon: <BookOpen className="w-5 h-5" />,
    },
  ];

  return (
    <div className="relative min-h-screen flex">
      {/* Gradient Bars Background */}
      <GradientBars
        bars={25}
        colors={["hsl(var(--primary))", "rgba(34, 197, 94, 0.1)"]}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/60 z-[1]" />
      <Navigation />
      {/* Sidebar */}
      <aside
        className={`relative z-[2] bg-card/80 backdrop-blur-sm border-r border-border/50 min-h-screen pt-20 transition-all duration-300 ${
          sidebarOpen ? "w-80" : "w-16"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 p-2">
            {/* Collapse Button */}
            <button
              className="absolute -right-4 top-24 z-10 bg-card border border-border/50 rounded-full p-1 shadow hover:bg-muted transition"
              onClick={() => setSidebarOpen(v => !v)}
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
            </button>
            {/* Credits Box */}
            <div
              className={`bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6 ${
                sidebarOpen ? "block" : "hidden"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-primary">
                  Credits
                </span>
                <Zap className="w-4 h-4 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">1,247</div>
              <div className="text-xs text-muted-foreground">
                Available credits
              </div>
            </div>
            {/* Navigation Items */}
            <nav className="space-y-2">
              {sidebarItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  } ${sidebarOpen ? "justify-start" : "justify-center px-2"}`}
                  title={sidebarOpen ? undefined : item.label}
                >
                  {item.icon}
                  {sidebarOpen && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 relative z-[2] pt-20">
        <div className="max-w-6xl mx-auto p-6">
          {/* AI Input Box at Top */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="w-full max-w-2xl">
              <div className="bg-card/90 rounded-2xl shadow-lg border border-border/40 flex flex-col items-stretch p-0">
                <div className="flex items-center px-6 pt-6 pb-2">
                  <h2 className="text-2xl font-bold text-foreground flex-1">
                    Hi, Bhanu pratap singh.
                  </h2>
                </div>
                <div className="flex items-center px-6 pb-6">
                  <span className="text-3xl font-light text-muted-foreground flex-1">
                    What do you want to build?
                  </span>
                </div>
                <form
                  className="flex items-center gap-2 px-6 pb-6"
                  onSubmit={e => {
                    e.preventDefault();
                    handleCreateAgent();
                  }}
                >
                  <input
                    className="flex-1 bg-transparent border-none outline-none text-lg placeholder:text-muted-foreground px-0 py-4"
                    style={{ minWidth: 0 }}
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="What can I help you with?"
                    disabled={isProcessing}
                  />
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-muted border border-border/50 rounded-lg px-3 py-1 text-sm font-medium gap-2">
                      <span className="text-primary font-semibold">
                        {models.find(m => m.value === selectedModel)?.label}
                      </span>
                      <select
                        className="bg-transparent outline-none border-none text-primary font-semibold"
                        value={selectedModel}
                        onChange={e => setSelectedModel(e.target.value)}
                        disabled={isProcessing}
                      >
                        {models.map(model => (
                          <option key={model.value} value={model.value}>
                            {model.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="button"
                      className="bg-primary/10 text-primary rounded-lg p-2 hover:bg-primary/20 transition"
                      tabIndex={-1}
                      disabled
                    >
                      <Mic className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          {/* Model and Prompt Summary */}
          <div className="text-xs text-muted-foreground mt-2">
            <span className="font-medium text-foreground">Model:</span>{" "}
            {models.find(m => m.value === selectedModel)?.label} &nbsp; | &nbsp;
            <span className="font-medium text-foreground">Prompt:</span>{" "}
            {prompt || <span className="italic">(none)</span>}
          </div>
          {/* Processing Section */}
          {isProcessing && (
            <div className="flex justify-center py-8">
              <span className="text-primary animate-pulse">
                Creating your agent...
              </span>
            </div>
          )}
          {/* Templates Grid */}
          {activeTab === "templates" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {templates.map(template => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:border-primary/40 hover:shadow-lg"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      {template.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {template.name}
                      </h3>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        {template.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {template.description}
                  </p>
                  <button className="w-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors py-2 rounded-lg text-sm font-medium">
                    Use Template
                  </button>
                </motion.div>
              ))}
            </div>
          )}
          {/* Custom AI Agents Section */}
          {activeTab === "agents" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Agents</h2>
                <div className="flex items-center gap-3">
                  <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition">
                    + New Agent
                  </button>
                  <button className="bg-muted text-foreground px-4 py-2 rounded-lg font-medium hover:bg-muted/80 transition">
                    + New Folder
                  </button>
                  <button className="bg-muted text-foreground px-4 py-2 rounded-lg font-medium hover:bg-muted/80 transition flex items-center gap-2">
                    Sort: Last modified
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 bg-muted border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              {/* Agents Table */}
              <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium text-muted-foreground">
                          Agent name
                        </th>
                        <th className="text-left p-4 font-medium text-muted-foreground">
                          Description
                        </th>
                        <th className="text-left p-4 font-medium text-muted-foreground">
                          Tools
                        </th>
                        <th className="text-left p-4 font-medium text-muted-foreground">
                          Last run
                        </th>
                        <th className="text-left p-4 font-medium text-muted-foreground">
                          Last modified
                        </th>
                        <th className="text-left p-4 font-medium text-muted-foreground">
                          Created
                        </th>
                        <th className="text-left p-4 font-medium text-muted-foreground">
                          Tasks done
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {agents.map((agent, index) => (
                        <tr
                          key={agent.id}
                          className="border-t border-border/50 hover:bg-muted/30 transition"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Bot className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium text-foreground">
                                  {agent.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {agent.model}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="max-w-xs truncate text-sm text-muted-foreground">
                              {agent.description}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-muted-foreground">
                              {agent.tools.length > 0
                                ? agent.tools.join(", ")
                                : "No tools"}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-muted-foreground">
                              {agent.lastRun}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-muted-foreground">
                              {agent.lastModified}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-muted-foreground">
                              {agent.created}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-muted-foreground">
                              {agent.tasksDone}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {agents.length === 0 && (
                        <tr>
                          <td
                            colSpan={7}
                            className="p-8 text-center text-muted-foreground"
                          >
                            No agents created yet. Create your first agent
                            above!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {/* Agent Profile Card View */}
          {activeTab === "agents" && agents.length > 0 && (
            <div className="mt-8 space-y-6">
              <h3 className="text-xl font-semibold text-foreground">
                Agent Details
              </h3>
              {agents.map(agent => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-6"
                >
                  {/* Agent Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Bot className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-foreground mb-1">
                        {agent.name}
                      </h4>
                      <p className="text-muted-foreground mb-2">
                        {agent.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {agent.model}
                        </span>
                        <span className="text-muted-foreground">
                          Created: {agent.created}
                        </span>
                        <span className="text-muted-foreground">
                          Tasks: {agent.tasksDone}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition">
                        Run Agent
                      </button>
                      <button className="bg-muted text-foreground px-4 py-2 rounded-lg font-medium hover:bg-muted/80 transition">
                        Edit
                      </button>
                    </div>
                  </div>

                  {/* Agent Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Main Prompt */}
                    <div>
                      <h5 className="font-semibold text-foreground mb-2">
                        Main Prompt
                      </h5>
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-sm text-foreground">
                          {agent.prompt}
                        </p>
                      </div>
                    </div>

                    {/* Tools */}
                    <div>
                      <h5 className="font-semibold text-foreground mb-2">
                        Tools
                      </h5>
                      <div className="bg-muted/50 rounded-lg p-3">
                        {agent.tools.length > 0 ? (
                          <div className="space-y-1">
                            {agent.tools.map((tool, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 text-sm"
                              >
                                <div className="w-2 h-2 bg-primary rounded-full" />
                                <span className="text-foreground">{tool}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No tools added yet
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Agent Stats */}
                  <div className="mt-6 pt-6 border-t border-border/50">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-primary">
                          {agent.tasksDone}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Tasks Completed
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary">
                          {agent.lastRun === "Never" ? "0" : "1"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Times Run
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary">
                          {agent.tools.length}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Tools Connected
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          {/* Tools Section */}
          {activeTab === "tools" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Tools</h2>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition">
                  + New tool
                </button>
              </div>
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search 9,000+ tools..."
                  className="w-full pl-10 pr-4 py-2 bg-muted border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              {/* Tools Content */}
              <div className="flex gap-6">
                {/* Left Sidebar */}
                <div className="w-64 space-y-6">
                  {/* Categories */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">
                      Tools
                    </h3>
                    <div className="space-y-1">
                      {toolCategories.slice(0, 3).map(category => (
                        <button
                          key={category}
                          onClick={() => setSelectedToolCategory(category)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                            selectedToolCategory === category
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* By use case */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">
                      By use case
                    </h3>
                    <div className="space-y-1">
                      {toolCategories.slice(3).map(category => (
                        <button
                          key={category}
                          onClick={() => setSelectedToolCategory(category)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                            selectedToolCategory === category
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* By apps */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">
                      By apps
                    </h3>
                    <div className="space-y-1">
                      {["Gmail", "Google Calendar", "HubSpot"].map(app => (
                        <button
                          key={app}
                          className="w-full text-left px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition flex items-center gap-2"
                        >
                          <div className="w-4 h-4 bg-primary/10 rounded" />
                          {app}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Right Content */}
                <div className="flex-1">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      {selectedToolCategory === "All tools"
                        ? "All tools"
                        : selectedToolCategory}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedToolCategory === "All tools"
                        ? "Your tools and tool templates from the community"
                        : `Tools for ${selectedToolCategory.toLowerCase()}`}
                    </p>
                  </div>
                  {/* Tools Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tools
                      .filter(
                        tool =>
                          selectedToolCategory === "All tools" ||
                          tool.category === selectedToolCategory
                      )
                      .map(tool => (
                        <div
                          key={tool.id}
                          className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-4 hover:bg-muted/30 transition cursor-pointer group"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                {tool.icon}
                              </div>
                              <div>
                                <h4 className="font-medium text-foreground">
                                  {tool.name}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  by {tool.author}
                                </p>
                              </div>
                            </div>
                            <button className="opacity-0 group-hover:opacity-100 bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm font-medium hover:bg-primary/20 transition">
                              Add
                            </button>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {tool.description}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* AI Chat Section */}
          {messages.length > 0 && (
            <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Agent Conversation
                </h2>
                <p className="text-muted-foreground">
                  This is your conversation with the agent you just created.
                </p>
              </div>
              {/* Message List */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {messages.map(message => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 p-4 rounded-2xl ${
                      message.role === "user"
                        ? "bg-primary/10 border border-primary/20 ml-12"
                        : "bg-card/80 border border-border/50 mr-12"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {message.role === "user" ? (
                        <Bot size={16} />
                      ) : (
                        <Sparkles size={16} />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">
                        {message.content}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
