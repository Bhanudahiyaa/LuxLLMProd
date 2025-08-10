"use client";
import Sidebar from "@/components/Sidebar";
import { useState, useRef } from "react";
import Navigation from "@/components/Navigation";
import TemplatesSection from "@/components/agent/TemplatesSection";

import ChatSection from "@/components/agent/ChatSection";
import {
  Bot,
  ClipboardList,
  CalendarCheck,
  FileText,
  DollarSign,
  LineChart,
  TrendingUp,
  PenTool,
  StickyNote,
  Mail,
  Radar,
  BookOpenCheck,
  FileWarning,
  Stamp,
  FileQuestion,
  ScanLine,
  Gamepad,
  Smile,
  ImagePlus,
  HeartHandshake,
  MapPin,
  Clock3,
  Timer,
  FileSignature,
  Mic,
  Repeat,
  Send,
  MessagesSquare,
  BarChart3,
  Palette,
} from "lucide-react";

// --- types
interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface Template {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  logo: JSX.Element;
  featured: boolean;
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

// --- templates data (shortened for brevity here, keep your full array)
const templates: Template[] = [
  {
    id: "1",
    title: "AleX",
    excerpt: "Your friendly guide to all things LuxLLM.",
    date: "March 15, 2024",
    category: "Productivity",
    logo: <Bot />,
    featured: false,
  },
  {
    id: "2",
    title: "Office Assistant",
    excerpt: "Create documents like PDF, Word, Excel, and PPT.",
    date: "March 16, 2024",
    category: "Productivity",
    logo: <ClipboardList />,
    featured: false,
  },
  {
    id: "3",
    title: "Meeting Prep Team",
    excerpt: "Prepare meeting insights and briefs.",
    date: "March 17, 2024",
    category: "Productivity",
    logo: <CalendarCheck />,
    featured: false,
  },
  {
    id: "4",
    title: "Document Generator",
    excerpt: "Generate polished documents including reports and slides.",
    date: "March 18, 2024",
    category: "Productivity",
    logo: <FileText />,
    featured: false,
  },
  {
    id: "5",
    title: "Crypto Master",
    excerpt: "Get insights on cryptocurrencies, blockchains, and NFTs.",
    date: "March 19, 2024",
    category: "Finance",
    logo: <DollarSign />,
    featured: false,
  },
  {
    id: "6",
    title: "Investment Analysis Team",
    excerpt: "Deliver in-depth financial research on companies and sectors.",
    date: "March 20, 2024",
    category: "Finance",
    logo: <LineChart />,
    featured: false,
  },
  {
    id: "7",
    title: "Most Traded Stock Finder",
    excerpt: "Find the most active stocks using real-time data.",
    date: "March 21, 2024",
    category: "Finance",
    logo: <TrendingUp />,
    featured: false,
  },
  {
    id: "8",
    title: "SEO Blog Writer",
    excerpt: "Write SEO-optimized blog posts tailored to your topic.",
    date: "March 22, 2024",
    category: "Marketing",
    logo: <PenTool />,
    featured: false,
  },
  {
    id: "9",
    title: "SEO Description Writer",
    excerpt: "Generate keyword-rich descriptions for content or products.",
    date: "March 23, 2024",
    category: "Marketing",
    logo: <StickyNote />,
    featured: false,
  },
  {
    id: "10",
    title: "Intro Email Generator",
    excerpt: "Craft warm, professional intro emails.",
    date: "March 24, 2024",
    category: "Marketing",
    logo: <Mail />,
    featured: false,
  },
  {
    id: "11",
    title: "Track Your Competitors",
    excerpt: "Monitor competitors and gain actionable insights.",
    date: "March 25, 2024",
    category: "Market Research",
    logo: <Radar />,
    featured: false,
  },
  {
    id: "12",
    title: "Research Team",
    excerpt: "Conduct expert research on any topic.",
    date: "March 26, 2024",
    category: "Market Research",
    logo: <BookOpenCheck />,
    featured: false,
  },
  {
    id: "13",
    title: "AI Fine Print Checker",
    excerpt: "Find sketchy legal terms in contracts and policies.",
    date: "March 27, 2024",
    category: "Legal & Compliance",
    logo: <FileWarning />,
    featured: false,
  },
  {
    id: "14",
    title: "Patent Scout",
    excerpt: "Help with patent research and risk assessment.",
    date: "March 28, 2024",
    category: "Legal & Compliance",
    logo: <Stamp />,
    featured: false,
  },
  {
    id: "15",
    title: "ExamPrepMaster",
    excerpt: "Turn PDFs into interactive quiz sessions.",
    date: "March 29, 2024",
    category: "Education",
    logo: <FileQuestion />,
    featured: false,
  },
  {
    id: "16",
    title: "Is It AI or Human?",
    excerpt: "Reveal if a text was written by a human or AI.",
    date: "March 30, 2024",
    category: "Education",
    logo: <ScanLine />,
    featured: false,
  },
  {
    id: "17",
    title: "Let's Play!",
    excerpt: "Interactive quiz agent with instant feedback.",
    date: "March 31, 2024",
    category: "Education",
    logo: <Gamepad />,
    featured: false,
  },
  {
    id: "18",
    title: "Emoji Talker",
    excerpt: "Reply to any text using only emojis.",
    date: "April 1, 2024",
    category: "Entertainment",
    logo: <Smile />,
    featured: false,
  },
  {
    id: "19",
    title: "Realistic Person Generator",
    excerpt: "Generate photorealistic human portraits.",
    date: "April 2, 2024",
    category: "Entertainment",
    logo: <ImagePlus />,
    featured: false,
  },
  {
    id: "20",
    title: "Clara - Personal Growth Coach",
    excerpt: "Emotional check-ins and mindful prompts for self-growth.",
    date: "April 3, 2024",
    category: "Mental Health",
    logo: <HeartHandshake />,
    featured: false,
  },
  {
    id: "21",
    title: "Travel Agency",
    excerpt: "Plan trips, find attractions, and check prices.",
    date: "April 4, 2024",
    category: "Travel",
    logo: <MapPin />,
    featured: false,
  },
  {
    id: "22",
    title: "Daily Scheduler",
    excerpt: "Generate daily plans based on your meetings and goals.",
    date: "April 5, 2024",
    category: "Time Management",
    logo: <Clock3 />,
    featured: false,
  },
  {
    id: "23",
    title: "Focus Timer Coach",
    excerpt: "Guide you through Pomodoro-style focused work sessions.",
    date: "April 6, 2024",
    category: "Time Management",
    logo: <Timer />,
    featured: false,
  },
  {
    id: "24",
    title: "Resume Builder Pro",
    excerpt: "Craft professional resumes tailored to job titles.",
    date: "April 7, 2024",
    category: "HR",
    logo: <FileSignature />,
    featured: false,
  },
  {
    id: "25",
    title: "Job Interview Coach",
    excerpt: "Conduct mock interviews and provide personalized feedback.",
    date: "April 8, 2024",
    category: "HR",
    logo: <Mic />,
    featured: false,
  },
  {
    id: "26",
    title: "Habit Tracker Assistant",
    excerpt: "Track habits and help you stay consistent daily.",
    date: "April 9, 2024",
    category: "Productivity",
    logo: <Repeat />,
    featured: false,
  },
  {
    id: "27",
    title: "Cold Email Generator",
    excerpt: "Write high-converting cold emails in your tone.",
    date: "April 10, 2024",
    category: "Sales",
    logo: <Send />,
    featured: false,
  },
  {
    id: "28",
    title: "Support Ticket Summarizer",
    excerpt: "Summarize long support threads and suggest replies.",
    date: "April 11, 2024",
    category: "Customer Support",
    logo: <MessagesSquare />,
    featured: false,
  },
  {
    id: "29",
    title: "KPI Dashboard Agent",
    excerpt: "Fetch and explain your most important metrics.",
    date: "April 12, 2024",
    category: "Analytics",
    logo: <BarChart3 />,
    featured: false,
  },
  {
    id: "30",
    title: "Color Palette Generator",
    excerpt: "Generate cohesive color schemes for any brand or UI.",
    date: "April 13, 2024",
    category: "Design",
    logo: <Palette />,
    featured: false,
  },
];

// --- main component
export default function Build() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("templates");

  const [prompt, setPrompt] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [agents, setAgents] = useState<Agent[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedToolCategory, setSelectedToolCategory] = useState("All tools");

  const [searchQuery, setSearchQuery] = useState("");

  // handle template click → go to playground
  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setPrompt(template.excerpt);
    setActiveTab("agents");
  };

  const filteredTemplates = templates.filter(
    t =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen flex">
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-primary/5 via-transparent to-transparent shadow-[0_-20px_80px_20px_rgba(34,197,94,0.1)]" />
      <Navigation />
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <main
        className={`relative z-[2] pt-20 transition-all duration-300 ${
          sidebarOpen ? "ml-64 max-w-6xl mx-auto p-6" : "ml-16 w-full p-6"
        }`}
      >
        {/* Templates Tab */}
        {activeTab === "templates" && (
          <>
            <div className="mb-5 ml-4 mr-4">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="w-full px-3 py-1 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <TemplatesSection
              templates={filteredTemplates}
              handleTemplateSelect={handleTemplateSelect}
            />
          </>
        )}

        {/* Agents Tab → Builder Playground */}
        {activeTab === "builder-playground" && <BuilderPlayground />}

        {/* Chat Section if messages exist */}
        {messages.length > 0 && <ChatSection messages={messages} />}
      </main>
    </div>
  );
}
