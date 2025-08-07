"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SendHorizonal, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIPromptBoxProps {
  onSubmit: (prompt: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const AIPromptBox = ({
  onSubmit,
  placeholder = "Describe your AI agent...",
  className,
  disabled = false,
}: AIPromptBoxProps) => {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;

    onSubmit(input.trim());
    setInput("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn("relative w-full max-w-3xl mx-auto", className)}
    >
      <form onSubmit={handleSubmit} className="relative">
        <motion.div
          animate={{
            boxShadow: isFocused
              ? "0 0 0 2px hsl(var(--primary) / 0.2), 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
              : "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          }}
          transition={{ duration: 0.2 }}
          className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-2"
        >
          {/* Gradient border effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="relative flex items-center gap-3">
            {/* Sparkles icon */}
            <div className="pl-3">
              <Sparkles className="size-5 text-primary/60" />
            </div>

            {/* Input field */}
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              disabled={disabled}
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground px-2 py-3 text-base font-medium"
            />

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={!input.trim() || disabled}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "p-3 rounded-xl transition-all duration-200",
                input.trim() && !disabled
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              <SendHorizonal size={18} />
            </motion.button>
          </div>
        </motion.div>
      </form>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            animate={{
              x: [0, 20, 0],
              y: [0, -20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            style={{
              left: `${20 + i * 30}%`,
              top: "50%",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};
