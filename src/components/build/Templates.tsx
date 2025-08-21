import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Clipboard,
  Calendar,
  X,
  Bot,
  Users,
  Zap,
  HelpCircle,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAgentService } from "@/hooks/agentService";
import { toast } from "sonner";

// Template interface
interface Template {
  id: string;
  name: string;
  title: string;
  category: string;
  description: string;
  excerpt: string;
  avatar_url: string;
  heading: string;
  subheading: string;
  system_prompt: string;
  custom_colors?: {
    chat_bg: string;
    border_color: string;
    user_msg_color: string;
    bot_msg_color: string;
  };
  created_at: string;
  date: string;
  logo: string;
}

// Hardcoded templates array
const TEMPLATES: Template[] = [
  {
    id: "1",
    name: "Customer Support Bot",
    title: "Customer Support Bot",
    category: "Customer Support",
    description:
      "Handle customer queries instantly with a friendly AI assistant that provides 24/7 support.",
    excerpt: "Instant customer support",
    avatar_url: "/avatars/support.png",
    heading: "24/7 Support",
    subheading: "Resolve issues quickly.",
    system_prompt: "You are a helpful customer support assistant.",
    created_at: "March 15, 2025",
    date: "March 15, 2025",
    logo: "👥",
  },
  {
    id: "2",
    name: "Portfolio Bot",
    title: "Portfolio Bot",
    category: "Personal",
    description:
      "Introduce yourself and your work with an interactive portfolio chatbot that showcases your skills.",
    excerpt: "Interactive portfolio guide",
    avatar_url: "/avatars/portfolio.png",
    heading: "Meet My Work",
    subheading: "Your AI-powered portfolio guide.",
    system_prompt: "You are a personal portfolio presenter AI.",
    created_at: "March 16, 2025",
    date: "March 16, 2025",
    logo: "🤖",
  },
  {
    id: "3",
    name: "Request Handler Bot",
    title: "Request Handler Bot",
    category: "Productivity",
    description:
      "Automate form submissions and handle structured requests with intelligent processing.",
    excerpt: "Smart request automation",
    avatar_url: "/avatars/request.png",
    heading: "Smart Request Manager",
    subheading: "Process tasks with ease.",
    system_prompt: "You manage structured requests and provide confirmations.",
    created_at: "March 17, 2025",
    date: "March 17, 2025",
    logo: "⚡",
  },
  {
    id: "4",
    name: "FAQ Assistant",
    title: "FAQ Assistant",
    category: "Knowledge Base",
    description:
      "Answer common questions about your product or service with instant, accurate responses.",
    excerpt: "Instant FAQ responses",
    avatar_url: "/avatars/faq.png",
    heading: "Instant Answers",
    subheading: "Help your users find answers fast.",
    system_prompt: "You are an FAQ answering AI assistant.",
    // Add custom colors for FAQ Assistant
    custom_colors: {
      chat_bg: "#ffffff",
      border_color: "#e5e7eb",
      user_msg_color: "#ec4899", // Pink color
      bot_msg_color: "#1f2937",
    },
    created_at: "March 18, 2025",
    date: "March 18, 2025",
    logo: "❓",
  },
  {
    id: "5",
    name: "Feedback Collector",
    title: "Feedback Collector",
    category: "Analytics",
    description:
      "Collect and organize user feedback conversationally to improve your products and services.",
    excerpt: "Conversational feedback collection",
    avatar_url: "/avatars/feedback.png",
    heading: "Gather Insights",
    subheading: "Understand users better.",
    system_prompt: "You ask for feedback in a polite and structured way.",
    created_at: "March 19, 2025",
    date: "March 19, 2025",
    logo: "💬",
  },
];

export function Templates() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCloning, setIsCloning] = useState(false);

  const { createAgent } = useAgentService();

  const categories = useMemo(() => {
    const all = TEMPLATES.map(t => t.category);
    return Array.from(new Set(all));
  }, []);

  const filteredTemplates = useMemo(() => {
    if (!activeCategory) return TEMPLATES;
    return TEMPLATES.filter(t => t.category === activeCategory);
  }, [activeCategory]);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleCustomizeTemplate = (template: Template) => {
    try {
      localStorage.setItem("selectedTemplate", JSON.stringify(template));
    } catch (e) {
      console.warn("Failed to cache selected template", e);
    }
    setIsModalOpen(false);
    navigate(
      `/editor?template=${encodeURIComponent(JSON.stringify(template))}`
    );
  };

  const handleCloneTemplate = async (template: Template) => {
    setIsCloning(true);
    try {
      const { data, error } = await createAgent({
        name: template.name,
        avatar_url: template.avatar_url,
        heading: template.heading,
        subheading: template.subheading,
        system_prompt: template.system_prompt,
      });

      if (error) {
        toast.error(`Failed to save template: ${error}`);
      } else {
        toast.success("Template saved to My Agents successfully!");
        setIsModalOpen(false);
        // Return to build page instead of editor
        navigate("/build");
      }
    } catch (err) {
      console.error("Error saving template:", err);
      toast.error("Failed to save template");
    } finally {
      setIsCloning(false);
    }
  };

  return (
    <>
      <section className="pb-24 bg-background min-h-screen">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Button
              variant={!activeCategory ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(null)}
              className="rounded-full"
            >
              All
            </Button>
            {categories.map(cat => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat)}
                className="rounded-full"
              >
                {cat}
              </Button>
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
                <div className="flex items-center justify-between mb-4">
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
                <div className="flex items-center justify-between text-xs text-muted-foreground">
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
        </div>
      </section>

      {/* Preview Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-card border-border text-card-foreground max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">
                {selectedTemplate?.name}
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          {selectedTemplate && (
            <div className="space-y-6">
              {/* Category and date */}
              <div className="flex items-center justify-between">
                <Badge
                  variant="secondary"
                  className="bg-muted text-muted-foreground"
                >
                  {selectedTemplate.category}
                </Badge>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{selectedTemplate.created_at}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-medium text-foreground mb-2">
                  Description
                </h4>
                <p className="text-muted-foreground">
                  {selectedTemplate.description}
                </p>
              </div>

              {/* Heading and Subheading */}
              {(selectedTemplate.heading || selectedTemplate.subheading) && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">Preview</h4>
                  <div className="bg-muted/20 rounded-lg p-4 border border-border">
                    {selectedTemplate.heading && (
                      <h5 className="font-semibold text-foreground mb-1">
                        {selectedTemplate.heading}
                      </h5>
                    )}
                    {selectedTemplate.subheading && (
                      <p className="text-muted-foreground text-sm">
                        {selectedTemplate.subheading}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* System Prompt */}
              <div>
                <h4 className="font-medium text-foreground mb-2">
                  System Prompt
                </h4>
                <div className="bg-muted/20 rounded-lg p-4 border border-border">
                  <p className="text-muted-foreground text-sm font-mono">
                    {selectedTemplate.system_prompt}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleCustomizeTemplate(selectedTemplate)}
                  className="border-border"
                >
                  Configure Chatbot
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="border-border text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
