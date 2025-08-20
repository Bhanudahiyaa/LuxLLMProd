import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageCircle, Send, Minimize2, X, Sparkles } from "lucide-react";

export interface ChatbotConfig {
  name: string;
  theme: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: number;
  fontSize: number;
  fontFamily: string;
  position: string;
  welcomeMessage: string;
  systemPrompt: string;
  placeholder: string;
  avatar: string;
  showTypingIndicator: boolean;
  enableSounds: boolean;
  animationSpeed: string;
}

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatbotPreviewProps {
  config: ChatbotConfig;
}

export function ChatbotPreview({ config }: ChatbotPreviewProps) {
  console.log("ChatbotPreview received config:", config);
  console.log("ChatbotPreview config.name:", config.name);
  console.log("Text color:", config.textColor);

  // Helper function to derive agentId from config for role detection
  const getAgentIdFromConfig = (config: ChatbotConfig): string => {
    const systemPrompt = config.systemPrompt || "";
    const lowerPrompt = systemPrompt.toLowerCase();

    if (
      lowerPrompt.includes("faq") ||
      lowerPrompt.includes("question") ||
      lowerPrompt.includes("assistant")
    ) {
      return "faq-bot";
    } else if (
      lowerPrompt.includes("customer support") ||
      lowerPrompt.includes("support")
    ) {
      return "customer-support-bot";
    } else if (
      lowerPrompt.includes("portfolio") ||
      lowerPrompt.includes("resume")
    ) {
      return "portfolio-bot";
    } else if (
      lowerPrompt.includes("feedback") ||
      lowerPrompt.includes("review")
    ) {
      return "feedback-bot";
    } else if (
      lowerPrompt.includes("sales") ||
      lowerPrompt.includes("product")
    ) {
      return "sales-bot";
    } else if (
      lowerPrompt.includes("meeting") ||
      lowerPrompt.includes("prep")
    ) {
      return "meeting-prep-bot";
    } else if (
      lowerPrompt.includes("document") ||
      lowerPrompt.includes("generator")
    ) {
      return "document-generator-bot";
    } else {
      return "general-assistant-bot";
    }
  };

  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: config.welcomeMessage,
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [audio] = useState<HTMLAudioElement | null>(() =>
    typeof window !== "undefined"
      ? new Audio(
          "data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQACcQAAAAAAAGF1ZGlvZGF0YQAAAAA="
        )
      : null
  );

  // Update welcome message when config changes
  useEffect(() => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === "1" ? { ...msg, text: config.welcomeMessage } : msg
      )
    );
  }, [config.welcomeMessage]);

  const handleSendMessage = async () => {
    const userMessage = inputValue.trim();
    if (!userMessage) return;

    // Add user message to chat
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: userMessage,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const { chatWithAgent } = await import("@/api/chat");

      const response = await chatWithAgent({
        system_prompt: config.systemPrompt || "You are a helpful AI assistant.",
        message: userMessage,
        agentId: getAgentIdFromConfig(config),
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        isBot: true,
        timestamp: new Date(),
      };

      // Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));

      setMessages(prev => [...prev, botMessage]);
      if (config.enableSounds && audio) {
        try {
          await audio.play();
        } catch (e) {
          // ignore autoplay restrictions
        }
      }
    } catch (error) {
      console.error("Chat API error:", error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble connecting to the chat service. Please try again in a moment.",
        isBot: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const animationDuration =
    config.animationSpeed === "fast"
      ? 0.2
      : config.animationSpeed === "slow"
      ? 0.5
      : 0.3;

  return (
    <div className="relative h-[600px] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.3),transparent_50%)]" />
        <motion.div
          className="absolute top-10 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-16 h-16 bg-purple-400/20 rounded-full blur-xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Chatbot Widget */}
      <div
        className={`absolute ${
          config.position === "bottom-left"
            ? "bottom-4 left-4"
            : "bottom-4 right-4"
        }`}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{
                duration: animationDuration,
                type: "spring",
                stiffness: 300,
              }}
              whileHover={{ y: -2 }}
            >
              <Card
                className="w-80 h-96 flex flex-col backdrop-blur-md border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300"
                style={{
                  backgroundColor: config.backgroundColor + "E6",
                  borderRadius: `${config.borderRadius}px`,
                  color: config.textColor,
                  fontSize: `${config.fontSize}px`,
                  fontFamily: config.fontFamily,
                }}
              >
                {/* Header */}
                <motion.div
                  className="flex items-center justify-between p-4 border-b border-white/10 relative overflow-hidden"
                  style={{ backgroundColor: config.primaryColor + "20" }}
                  whileHover={{ backgroundColor: config.primaryColor + "30" }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="absolute inset-0 opacity-20"
                    animate={{
                      backgroundPosition: ["0% 0%", "100% 100%"],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    style={{
                      backgroundImage: `linear-gradient(45deg, ${config.primaryColor}20 25%, transparent 25%, transparent 75%, ${config.primaryColor}20 75%, ${config.primaryColor}20)`,
                      backgroundSize: "20px 20px",
                    }}
                  />

                  <div className="flex items-center gap-3 relative z-10">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Avatar className="h-8 w-8 ring-2 ring-white/30">
                        <AvatarImage
                          src={config.avatar || "/placeholder.svg"}
                        />
                        <AvatarFallback
                          style={{ backgroundColor: config.primaryColor }}
                        >
                          <Sparkles className="h-4 w-4 text-white" />
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-sm">{config.name}</h3>
                      <motion.div
                        className="flex items-center gap-1"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      >
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <p
                          className="text-xs opacity-70"
                          style={{ color: config.textColor }}
                        >
                          Online
                        </p>
                      </motion.div>
                    </div>
                  </div>
                  <div className="flex gap-1 relative z-10">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-white/10"
                        onClick={() => setIsOpen(false)}
                      >
                        <Minimize2 className="h-3 w-3" />
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-white/10"
                        onClick={() => setIsOpen(false)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  <AnimatePresence>
                    {messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          duration: animationDuration,
                          delay: index * 0.1,
                          type: "spring",
                          stiffness: 300,
                        }}
                        className={`flex ${
                          message.isBot ? "justify-start" : "justify-end"
                        }`}
                        whileHover={{ scale: 1.02 }}
                      >
                        <motion.div
                          className={`max-w-[80%] p-3 rounded-lg shadow-lg ${
                            message.isBot
                              ? "bg-white/20 backdrop-blur-sm"
                              : "text-white"
                          }`}
                          style={{
                            backgroundColor: message.isBot
                              ? "rgba(255, 255, 255, 0.2)"
                              : config.primaryColor,
                            borderRadius: `${config.borderRadius * 0.8}px`,
                            color: message.isBot ? config.textColor : "white",
                          }}
                          whileHover={{
                            boxShadow: `0 8px 25px ${
                              message.isBot
                                ? "rgba(255, 255, 255, 0.3)"
                                : config.primaryColor + "40"
                            }`,
                          }}
                        >
                          <p
                            className="text-sm"
                            style={{
                              color: message.isBot ? config.textColor : "white",
                            }}
                          >
                            {message.text}
                          </p>
                        </motion.div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Typing Indicator */}
                  <AnimatePresence>
                    {config.showTypingIndicator && isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex justify-start"
                      >
                        <motion.div
                          className="bg-white/20 backdrop-blur-sm p-3 rounded-lg"
                          animate={{ scale: [1, 1.02, 1] }}
                          transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                          }}
                          style={{ color: config.textColor }}
                        >
                          <div className="flex space-x-1">
                            <motion.div
                              className="w-2 h-2 bg-current rounded-full"
                              animate={{ y: [0, -4, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Number.POSITIVE_INFINITY,
                                delay: 0,
                              }}
                            />
                            <motion.div
                              className="w-2 h-2 bg-current rounded-full"
                              animate={{ y: [0, -4, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Number.POSITIVE_INFINITY,
                                delay: 0.2,
                              }}
                            />
                            <motion.div
                              className="w-2 h-2 bg-current rounded-full"
                              animate={{ y: [0, -4, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Number.POSITIVE_INFINITY,
                                delay: 0.4,
                              }}
                            />
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Input */}
                <motion.div
                  className="p-4 border-t border-white/10"
                  whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.02)" }}
                >
                  <div className="flex gap-2">
                    <motion.div className="flex-1" whileFocus={{ scale: 1.02 }}>
                      <Input
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        placeholder={config.placeholder}
                        className="bg-white/10 border-white/20 backdrop-blur-sm focus:bg-white/20 transition-all duration-300"
                        style={
                          {
                            borderRadius: `${config.borderRadius * 0.6}px`,
                            color: config.textColor,
                            "--placeholder-color": config.textColor + "80",
                          } as React.CSSProperties
                        }
                        onKeyPress={e =>
                          e.key === "Enter" && handleSendMessage()
                        }
                      />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={handleSendMessage}
                        size="sm"
                        className="text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        style={{
                          backgroundColor: config.primaryColor,
                          borderRadius: `${config.borderRadius * 0.6}px`,
                        }}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Button */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="h-14 w-14 rounded-full shadow-2xl text-white hover:shadow-3xl transition-all duration-300"
              style={{ backgroundColor: config.primaryColor }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <MessageCircle className="h-6 w-6" />
              </motion.div>
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
