"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import DisplayCards from "@/components/ui/display-cards";
import { FeatureSteps } from "../ui/feature-section";

const defaultCards = [
  {
    icon: <Sparkles className="size-4 text-primary" />,
    title: "Prompt",
    description: "Describe your agent",
    date: "Just now",
    iconClassName: "text-primary",
    titleClassName: "text-foreground",
    className:
      "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <Sparkles className="size-4 text-primary" />,
    title: "Import",
    description: "Import your agent ",
    date: "2 days ago",
    iconClassName: "text-primary",
    titleClassName: "text-foreground",
    className:
      "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <Sparkles className="size-4 text-primary" />,
    title: "Deploy",
    description: "Deploy your agent",
    date: "Today",
    iconClassName: "text-primary",
    titleClassName: "text-foreground",
    className:
      "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10",
  },
];

const features = [
  {
    step: "Step 1",
    content:
      "Describe your AI agent in plain English and let LuxLLM do the rest.",
    highlight: "AI agent",
  },
  {
    step: "Step 2",
    content:
      "Instantly receive the .env, logic, and demo files to run your agent.",
    highlight: "run your agent",
  },
  {
    step: "Step 3",
    content: "Use your agent in real-time in chat, apps, or anywhere you like.",
    highlight: "real-time",
  },
];

const HowItWorksSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="how-it-works" className="py-16 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-light tracking-tighter mb-4">
            How it <span className="text-primary">Works</span>
          </h2>
          <p className="text-xl text-foreground/70 font-light max-w-2xl mx-auto">
            Explore the key highlights and offerings of LuxLLM
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          {/* Left - Display Cards */}
          <div className="w-full lg:pt-16 lg:w-1/2">
            <DisplayCards
              cards={defaultCards.map((card, index) => ({
                ...card,
                onMouseEnter: () => setHoveredIndex(index),
                onMouseLeave: () => setHoveredIndex(null),
              }))}
            />
          </div>

          {/* Right - Feature Steps */}
          <div className="w-full lg:w-1/2 pt-8 lg:pt-2">
            <FeatureSteps
              features={features}
              autoPlayInterval={4000}
              hoveredIndex={hoveredIndex}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
