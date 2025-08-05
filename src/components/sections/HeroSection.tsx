"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { Typewriter } from "react-simple-typewriter";
import { BGPattern } from "@/components/ui/bg-pattern";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

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

  const fillColor =
    resolvedTheme === "dark" ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.15)";

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
    >
      <BGPattern
        variant="dots"
        mask="fade-center"
        fill={fillColor}
        size={24}
        className="absolute inset-0 z-[10]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/50 z-[5]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.1),transparent_50%)] z-[5]" />

      <div className="container mx-auto px-4 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto mb-11"
        >
          <div className="relative inline-block">
            <Badge
              variant="outline"
              className="absolute top-4 sm:-top-6 left-1/2 -translate-x-1/2 mt-32 sm:mt-44 text-[10px] sm:text-sm font-medium px-4 sm:px-5 py-1 rounded-full shadow flex items-center gap-1.5 sm:gap-2 animate-shimmer bg-zinc-600 max-w-[95%] sm:max-w-fit whitespace-nowrap"
              style={{
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                backgroundImage:
                  "linear-gradient(90deg, #555 0%, #aaa 45%, #eee 50%, #aaa 55%, #555 100%)",
                backgroundSize: "200% auto",
                animation: "shimmer 4.5s linear infinite",
              }}
            >
              <span className="text-muted-foreground">
                ✨ Explore AI Agents
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
              className="text-8xl md:text-[8rem] font-thin tracking-tighter mt-48 mb-3 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/40 bg-clip-text text-transparent"
            >
              <span>
                <Typewriter
                  words={["LuxLLM"]}
                  loop={2}
                  typeSpeed={190}
                  deleteSpeed={100}
                  delaySpeed={1000}
                />
              </span>
              <br />
              <motion.div>
                <div className="font-italianno mt-7 tracking-tight text-primary text-4xl sm:text-5xl md:text-7xl font-light opacity-80 text-center">
                  𝘊𝘰𝘥𝘦 𝘍𝘳𝘦𝘦 𝘈𝘨𝘦𝘯𝘵 𝘉𝘶𝘪𝘭𝘥𝘪𝘯𝘨,<div>𝘔𝘢𝘥𝘦 𝘌𝘢𝘴𝘺</div>
                </div>
              </motion.div>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg text-foreground/50 font-light leading-relaxed mb-4 max-w-3xl mx-auto text-center tracking-tight px-4"
          >
            The ultimate platform that unifies top AI models so you can
            effortlessly{" "}
            <span>
              build powerful, custom agents from plain language in seconds.
            </span>
          </motion.p>

          <div className="flex justify-center space-x-6 mt-8">
            <InteractiveHoverButton
              onClick={handleGetStarted}
              className="px-10 py-2 text-sm text-foreground rounded-2xl"
              aria-label="Get started"
            >
              Get Started
            </InteractiveHoverButton>

            <RainbowButton className="px-8 py-2 text-sm rounded-2xl">
              Get Unlimited Access
            </RainbowButton>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-80 bg-gradient-to-t from-background to-transparent z-20 pointer-events-none" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="relative w-full h-full rounded-2xl overflow-hidden border border-primary/10 shadow-lg backdrop-blur-lg"
        >
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent" />
          <div className="absolute inset-0 z-10 [mask-image:linear-gradient(to_top,black_40%,transparent_100%)]" />
          <div className="w-full h-full rounded-3xl flex items-center justify-center relative z-20">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-20 left-20 w-32 h-32 bg-primary/20 dark:bg-primary/30 rounded-full blur-2xl animate-pulse" />
              <div className="absolute bottom-20 right-20 w-40 h-40 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl animate-pulse delay-1000" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary/5 to-primary/10 rounded-full blur-3xl animate-pulse delay-500" />
            </div>

            <div className="text-center z-30">
              <div className="h-full w-full overflow-hidden rounded-2xl border border-grey-400 bg-primary/20 dark:bg-primary/5 p-1 md:p-3">
                <img
                  src="/images/interface-preview.png"
                  alt="LLM Interface Preview"
                  className="w-full h-auto max-w-full object-contain rounded-2xl mask-image-fade"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
