"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { Typewriter } from "react-simple-typewriter";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import AIBuilderFlow from "../ai-builder-flow";

const HeroSection = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { isSignedIn } = useUser();
  const { openSignUp } = useClerk();
  const navigate = useNavigate();

  const handleGetStarted = useCallback(() => {
    if (isSignedIn) {
      navigate("/build");
    } else {
      openSignUp({
        afterSignUpUrl: "/build",
        afterSignInUrl: "/build",
      });
    }
  }, [isSignedIn, navigate, openSignUp]);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <section
      id="hero"
      className="relative flex flex-col items-center justify-center min-h-screen text-center"
    >
      {/* Light mode background */}
      <div
        className="absolute inset-0 z-0 dark:hidden pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at center, hsl(var(--background)) 0%, hsl(var(--background)) 35%, rgba(0,0,0,0) 80%),
            linear-gradient(to right, rgba(0,0,0,0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.12) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 48px 48px, 48px 48px",
          backgroundPosition: "0 0, 0 0, 0 0",
        }}
      />

      {/* Dark mode background */}
      <div
        className="absolute inset-0 z-0 hidden dark:block pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at center, hsl(var(--background)) 0%, hsl(var(--background)) 35%, rgba(0,0,0,0) 85%),
            linear-gradient(to right, rgba(255,255,255,0.14) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.14) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 48px 48px, 48px 48px",
          backgroundPosition: "0 0, 0 0, 0 0",
        }}
      />

      <div className="container mx-auto px-6 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-11 flex flex-col items-center justify-center text-center"
        >
          <div className="relative inline-block">
            <Badge
              variant="outline"
              className="absolute top-4 sm:-top-8 left-1/2 -translate-x-1/2 mt-36 sm:mt-44 
              text-[10px] sm:text-sm font-medium px-4 sm:px-5 py-1 rounded-full shadow
              flex items-center gap-1.5 sm:gap-2 max-w-[95%] sm:max-w-fit whitespace-nowrap"
            >
              <span
                className="animate-shimmer"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #333 0%, #777 45%, #ddd 50%, #777 55%, #333 100%)",
                }}
              >
                ✨ Explore AI Chatbots
              </span>

              <a
                href="#link"
                className="flex items-center gap-1 text-primary font-light transition-colors duration-200"
              >
                Learn more
                <ArrowRightIcon className="size-3" />
              </a>
            </Badge>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-8xl md:text-[10rem] font-thin tracking-tighter mt-48 mb-3 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/40 bg-clip-text text-transparent"
            >
              <span>
                <Typewriter
                  words={["LuxLLM"]}
                  loop={1}
                  typeSpeed={180}
                  deleteSpeed={100}
                  delaySpeed={1000}
                />
              </span>
              <br />
              <div className=" mt-7 tracking-tight text-primary text-4xl sm:text-5xl md:text-7xl font-light opacity-80 text-center">
                𝘚𝘦𝘢𝘮𝘭𝘦𝘴𝘴 𝘕𝘰 𝘊𝘰𝘥𝘦 𝘈𝘐 𝘊𝘩𝘢𝘵𝘣𝘰𝘵 𝘧𝘰𝘳{" "}
                <span className="text-white">𝘌𝘷𝘦𝘳𝘺 𝘞𝘦𝘣𝘴𝘪𝘵𝘦</span>
              </div>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg text-foreground/60 font-light leading-relaxed mb-8 max-w-2xl"
          >
            The ultimate platform that lets you seamlessly integrate Chatbot
            into your stack so you can{" "}
            <span className="text-foreground">
              Build Production Ready, AI Chatbots
            </span>{" "}
            with editable UI in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-center space-x-6 mt-2 "
          >
            <InteractiveHoverButton
              onClick={handleGetStarted}
              className="px-10 py-2 text-sm text-foreground rounded-2xl opacity-90"
              aria-label="Get started"
            >
              Get Started
            </InteractiveHoverButton>

            <RainbowButton className="px-8 py-2 text-sm rounded-2xl opacity-90">
              Get Unlimited Access
            </RainbowButton>
          </motion.div>

          <div className="absolute bottom-0 left-0 w-full h-80 bg-gradient-to-t from-background to-transparent z-20 pointer-events-none" />
        </motion.div>

        {/* AI Builder Flow Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="relative w-full h-full rounded-2xl overflow-hidden border border-primary/10  backdrop-blur-lg"
        >
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent" />
          <div className="absolute inset-0 z-10 [mask-image:linear-gradient(to_top,black_40%,transparent_100%)]" />
          <div className="w-full h-full rounded-3xl flex items-center justify-center relative z-20">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-20 left-20 w-32 h-32 bg-primary/20 dark:bg-primary/30 rounded-full blur-2xl animate-pulse" />
              <div className="absolute bottom-20 right-20 w-40 h-40 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl animate-pulse delay-1000" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary/5 to-primary/10 rounded-full blur-3xl animate-pulse delay-500" />
            </div>

            <div className="relative z-30 h-[500px] w-full rounded-2xl border border-gray-400 bg-primary/20 dark:bg-primary/5 p-1 md:p-3 overflow-hidden">
              <AIBuilderFlow />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
