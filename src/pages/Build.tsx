"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { SendHorizonal, FileCode, Cog, Monitor } from "lucide-react";
import { BGPattern } from "@/components/ui/bg-pattern";
import Navigation from "@/components/Navigation";

export default function Build() {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [agentName, setAgentName] = useState("");
  const stepsRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Save the agent name
    setAgentName(input.trim());
    setSubmitted(true);

    // Scroll to steps
    setTimeout(() => {
      stepsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);

    console.log("User prompt:", input);
    setInput("");
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Sticky Navbar */}
      <Navigation />

      {/* Background pattern */}
      <BGPattern
        variant="dots"
        mask="fade-center"
        fill="rgba(0,0,0,0.06)"
        className="absolute inset-0 z-0 dark:fill-[rgba(255,255,255,0.06)]"
        size={20}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background z-0" />

      {/* Main Content */}
      <main className="flex-1 relative z-10 pt-28">
        {/* Prompt Input Section */}
        <section className="flex flex-col items-center px-4 mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-4xl md:text-5xl font-thin tracking-tight mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
          >
            Describe Your AI Agent
          </motion.h1>

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 bg-card border border-border rounded-2xl p-2 shadow-lg w-full max-w-3xl"
          >
            <input
              type="text"
              placeholder="E.g., 'An AI that summarizes news articles in plain English'"
              value={input}
              onChange={e => setInput(e.target.value)}
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition"
              aria-label="Submit prompt"
            >
              <SendHorizonal size={18} />
            </button>
          </form>
        </section>

        {/* Steps Section */}
        <section
          ref={stepsRef}
          className="max-w-5xl mx-auto px-4 grid gap-12 md:grid-cols-3 mb-24"
        >
          {[
            {
              icon: <FileCode className="size-8 text-primary" />,
              title: "Step 1: Environment",
              desc: `We’ll prepare the .env configuration for "${
                agentName || "your agent"
              }" with all required API keys and settings.`,
            },
            {
              icon: <Cog className="size-8 text-primary" />,
              title: "Step 2: Logic",
              desc: `Your agent's core logic for "${
                agentName || "your agent"
              }" will be generated and ready for customization.`,
            },
            {
              icon: <Monitor className="size-8 text-primary" />,
              title: "Step 3: Frontend Demo",
              desc: `Get a ready-to-use frontend demo to interact with "${
                agentName || "your agent"
              }" instantly.`,
            },
          ].map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: submitted ? 1 : 0,
                y: submitted ? 0 : 20,
                scale: submitted ? 1 : 0.95,
              }}
              transition={{
                delay: submitted ? idx * 0.15 : 0,
                duration: 0.5,
              }}
              className={`bg-card border border-border rounded-2xl p-6 shadow-lg transition 
                hover:border-primary/40 ${
                  submitted ? "opacity-100" : "opacity-50"
                }`}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                {step.icon}
                <h3 className="text-lg font-medium">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </section>
      </main>
    </div>
  );
}
