"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface AIChatProps {
  onSubmit: (message: string) => void;
  messages?: Message[];
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export const AIChat = ({
  onSubmit,
  messages = [],
  isLoading = false,
  placeholder = "Describe your AI agent...",
  className,
}: AIChatProps) => {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    onSubmit(input.trim());
    setInput("");
  };

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      {/* Chat Messages */}
      <div className="mb-6 max-h-96 overflow-y-auto space-y-4">
        {messages.map(message => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex gap-3 p-4 rounded-2xl",
              message.role === "user"
                ? "bg-primary/10 border border-primary/20 ml-12"
                : "bg-card/80 border border-border/50 mr-12"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {message.role === "user" ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground">{message.content}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 p-4 rounded-2xl bg-card/80 border border-border/50 mr-12"
          >
            <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center flex-shrink-0">
              <Bot size={16} />
            </div>
            <div className="flex-1">
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          animate={{
            boxShadow: isFocused
              ? "0 0 0 2px hsl(var(--primary) / 0.2), 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
              : "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          }}
          transition={{ duration: 0.2 }}
          className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-3"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              disabled={isLoading}
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground px-2 py-2 text-base"
              style={{ color: "hsl(var(--foreground))" }}
            />

            <motion.button
              type="submit"
              disabled={!input.trim() || isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "p-2 rounded-xl transition-all duration-200",
                input.trim() && !isLoading
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
              style={{
                background:
                  input.trim() && !isLoading
                    ? "hsl(var(--primary))"
                    : "hsl(var(--muted))",
                color:
                  input.trim() && !isLoading
                    ? "hsl(var(--primary-foreground))"
                    : "hsl(var(--muted-foreground))",
              }}
            >
              <Send size={18} />
            </motion.button>
          </div>
        </motion.div>
      </motion.form>
    </div>
  );
};
