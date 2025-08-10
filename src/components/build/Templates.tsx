"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "phosphor-react";

import { useNavigate } from "react-router-dom";
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

interface Template {
  id: number;
  title: string;
  excerpt: string;
  description: string;
  category?: string;
  date?: string;
  logo?: JSX.Element;
}

const templates: Template[] = [
  {
    id: 1,
    title: "Customer Support Assistant",
    excerpt: "Intelligent assistant for handling customer inquiries",
    description:
      "Helps manage support tickets and answer questions professionally.",
    category: "Chatbots",
    date: "March 15, 2024",
    logo: <Bot />,
  },
  {
    id: 2,
    title: "Sales Assistant",
    excerpt: "AI-powered help for converting leads",
    description:
      "Answers product questions and assists with sales conversions.",
    category: "Assistants",
    date: "March 20, 2024",
    logo: <Bot />,
  },
  {
    id: 3,
    title: "Meeting Prep Team",
    excerpt: "Prepare meeting insights and briefs.",
    description:
      "Gathers and organizes information to help you prepare for meetings.",
    category: "Productivity",
    date: "March 17, 2024",
    logo: <CalendarCheck />,
  },
  {
    id: 4,
    title: "Document Generator",
    excerpt: "Generate polished documents including reports and slides.",
    description:
      "Quickly create well-structured reports, slides, and business documents.",
    category: "Productivity",
    date: "March 18, 2024",
    logo: <FileText />,
  },
  {
    id: 5,
    title: "Crypto Master",
    excerpt: "Get insights on cryptocurrencies, blockchains, and NFTs.",
    description:
      "Provides in-depth analysis of cryptocurrencies, blockchains, and NFTs.",
    category: "Finance",
    date: "March 19, 2024",
    logo: <DollarSign />,
  },
  {
    id: 6,
    title: "Investment Analysis Team",
    excerpt: "Deliver in-depth financial research on companies and sectors.",
    description:
      "Researches and analyzes companies and industries for smart investing.",
    category: "Finance",
    date: "March 20, 2024",
    logo: <LineChart />,
  },
  {
    id: 7,
    title: "Most Traded Stock Finder",
    excerpt: "Find the most active stocks using real-time data.",
    description:
      "Tracks the stock market to identify the most traded assets instantly.",
    category: "Finance",
    date: "March 21, 2024",
    logo: <TrendingUp />,
  },
  {
    id: 8,
    title: "SEO Blog Writer",
    excerpt: "Write SEO-optimized blog posts tailored to your topic.",
    description:
      "Generates high-ranking blog content optimized for search engines.",
    category: "Marketing",
    date: "March 22, 2024",
    logo: <PenTool />,
  },
  {
    id: 9,
    title: "SEO Description Writer",
    excerpt: "Generate keyword-rich descriptions for content or products.",
    description: "Writes keyword-rich descriptions to boost search visibility.",
    category: "Marketing",
    date: "March 23, 2024",
    logo: <StickyNote />,
  },
  {
    id: 10,
    title: "Intro Email Generator",
    excerpt: "Craft warm, professional intro emails.",
    description:
      "Creates professional and friendly email introductions for networking.",
    category: "Marketing",
    date: "March 24, 2024",
    logo: <Mail />,
  },
  {
    id: 11,
    title: "Track Your Competitors",
    excerpt: "Monitor competitors and gain actionable insights.",
    description: "Keeps tabs on competitors to give you a strategic edge.",
    category: "Market Research",
    date: "March 25, 2024",
    logo: <Radar />,
  },
  {
    id: 12,
    title: "Research Team",
    excerpt: "Conduct expert research on any topic.",
    description: "Provides detailed and accurate research for any subject.",
    category: "Market Research",
    date: "March 26, 2024",
    logo: <BookOpenCheck />,
  },
  {
    id: 13,
    title: "AI Fine Print Checker",
    excerpt: "Find sketchy legal terms in contracts and policies.",
    description:
      "Analyzes documents to highlight risky or unusual legal terms.",
    category: "Legal & Compliance",
    date: "March 27, 2024",
    logo: <FileWarning />,
  },
  {
    id: 14,
    title: "Patent Scout",
    excerpt: "Help with patent research and risk assessment.",
    description:
      "Assists in researching patents and identifying potential risks.",
    category: "Legal & Compliance",
    date: "March 28, 2024",
    logo: <Stamp />,
  },
  {
    id: 15,
    title: "ExamPrepMaster",
    excerpt: "Turn PDFs into interactive quiz sessions.",
    description:
      "Transforms study materials into engaging quizzes for exam prep.",
    category: "Education",
    date: "March 29, 2024",
    logo: <FileQuestion />,
  },
  {
    id: 16,
    title: "Is It AI or Human?",
    excerpt: "Reveal if a text was written by a human or AI.",
    description:
      "Detects whether a given text is AI-generated or human-written.",
    category: "Education",
    date: "March 30, 2024",
    logo: <ScanLine />,
  },
  {
    id: 17,
    title: "Let's Play!",
    excerpt: "Interactive quiz agent with instant feedback.",
    description:
      "Hosts fun and interactive quiz games with real-time feedback.",
    category: "Education",
    date: "March 31, 2024",
    logo: <Gamepad />,
  },
  {
    id: 18,
    title: "Emoji Talker",
    excerpt: "Reply to any text using only emojis.",
    description: "Communicates exclusively through emoji responses.",
    category: "Entertainment",
    date: "April 1, 2024",
    logo: <Smile />,
  },
  {
    id: 19,
    title: "Realistic Person Generator",
    excerpt: "Generate photorealistic human portraits.",
    description: "Creates highly realistic images of people using AI.",
    category: "Entertainment",
    date: "April 2, 2024",
    logo: <ImagePlus />,
  },
  {
    id: 20,
    title: "Clara - Personal Growth Coach",
    excerpt: "Emotional check-ins and mindful prompts for self-growth.",
    description:
      "Offers guidance and prompts for personal and emotional growth.",
    category: "Mental Health",
    date: "April 3, 2024",
    logo: <HeartHandshake />,
  },
  {
    id: 21,
    title: "Travel Agency",
    excerpt: "Plan trips, find attractions, and check prices.",
    description:
      "Helps you plan trips with suggestions for attractions and budgets.",
    category: "Travel",
    date: "April 4, 2024",
    logo: <MapPin />,
  },
  {
    id: 22,
    title: "Daily Scheduler",
    excerpt: "Generate daily plans based on your meetings and goals.",
    description:
      "Creates optimized schedules to help you achieve your daily goals.",
    category: "Time Management",
    date: "April 5, 2024",
    logo: <Clock3 />,
  },
  {
    id: 23,
    title: "Focus Timer Coach",
    excerpt: "Guide you through Pomodoro-style focused work sessions.",
    description:
      "Encourages productivity through structured Pomodoro sessions.",
    category: "Time Management",
    date: "April 6, 2024",
    logo: <Timer />,
  },
  {
    id: 24,
    title: "Resume Builder Pro",
    excerpt: "Craft professional resumes tailored to job titles.",
    description: "Builds customized resumes to match your career goals.",
    category: "HR",
    date: "April 7, 2024",
    logo: <FileSignature />,
  },
  {
    id: 25,
    title: "Job Interview Coach",
    excerpt: "Conduct mock interviews and provide personalized feedback.",
    description:
      "Prepares you for interviews with tailored questions and tips.",
    category: "HR",
    date: "April 8, 2024",
    logo: <Mic />,
  },
  {
    id: 26,
    title: "Habit Tracker Assistant",
    excerpt: "Track habits and help you stay consistent daily.",
    description: "Monitors your habits to improve consistency and discipline.",
    category: "Productivity",
    date: "April 9, 2024",
    logo: <Repeat />,
  },
  {
    id: 27,
    title: "Cold Email Generator",
    excerpt: "Write high-converting cold emails in your tone.",
    description: "Creates persuasive cold emails tailored to your style.",
    category: "Sales",
    date: "April 10, 2024",
    logo: <Send />,
  },
  {
    id: 28,
    title: "Support Ticket Summarizer",
    excerpt: "Summarize long support threads and suggest replies.",
    description: "Condenses long conversations into actionable summaries.",
    category: "Customer Support",
    date: "April 11, 2024",
    logo: <MessagesSquare />,
  },
  {
    id: 29,
    title: "KPI Dashboard Agent",
    excerpt: "Fetch and explain your most important metrics.",
    description: "Pulls key performance metrics and explains their meaning.",
    category: "Analytics",
    date: "April 12, 2024",
    logo: <BarChart3 />,
  },
  {
    id: 30,
    title: "Color Palette Generator",
    excerpt: "Generate cohesive color schemes for any brand or UI.",
    description: "Produces professional color palettes for design projects.",
    category: "Design",
    date: "April 13, 2024",
    logo: <Palette />,
  },

  // ... add your other templates here with title, excerpt, description, date, and logo
];

export function Templates() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  const categories = useMemo(() => {
    const all = templates.map(t => t.category).filter(Boolean) as string[];
    return Array.from(new Set(all));
  }, []);

  const filteredTemplates = useMemo(() => {
    if (!activeCategory) return templates;
    return templates.filter(t => t.category === activeCategory);
  }, [activeCategory]);

  const handleTemplateSelect = (template: Template) => {
    localStorage.setItem("selectedTemplate", JSON.stringify(template));
    navigate("/build/settings");
  };

  return (
    <section className="pb-24">
      <div className="container mx-auto px-4">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1 text-xs font-thin rounded-full border ${
              !activeCategory
                ? "bg-primary text-white"
                : "text-muted-foreground border-muted"
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 text-xs font-thin rounded-full border ${
                activeCategory === cat
                  ? "bg-primary text-white"
                  : "text-muted-foreground border-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Template cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template, index) => (
            <motion.article
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
              className="group relative rounded-2xl border bg-card/20 text-card-foreground p-6 shadow-sm hover:shadow-md transition cursor-pointer"
            >
              {/* Top badge and icon */}
              <div className="flex items-center justify-between mb-4 ">
                <span className="text-xs bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-full">
                  {template.category}
                </span>
                <div className="text-xl text-muted-foreground transition-colors duration-200 group-hover:text-green-500">
                  {template.logo}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-thin text-foreground mb-3 group-hover:text-primary transition-colors duration-200">
                {template.title}
              </h3>

              {/* Excerpt */}
              <p className="text-sm font-thin text-muted-foreground mb-2">
                {template.excerpt}
              </p>

              {/* Description */}
              <p className="text-sm font-thin text-muted-foreground mb-4">
                {template.description}
              </p>

              {/* Date + Arrow */}
              <div className="flex items-center font-thinjustify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Calendar size={12} />
                  <span>{template.date}</span>
                </div>
                <ArrowRight
                  size={16}
                  className="transition group-hover:text-primary"
                />
              </div>
            </motion.article>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">No templates found</p>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
