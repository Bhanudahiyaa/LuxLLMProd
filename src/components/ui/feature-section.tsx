"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Feature {
  step: string;
  content: string;
  highlight?: string;
}

interface FeatureStepsProps {
  features: Feature[];
  className?: string;
  autoPlayInterval?: number;
  hoveredIndex?: number | null; // 👈 new prop
}

export function FeatureSteps({
  features,
  className,
  autoPlayInterval = 3000,
  hoveredIndex,
}: FeatureStepsProps) {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (progress < 100) {
        setProgress(prev => prev + 100 / (autoPlayInterval / 100));
      } else {
        setCurrentFeature(prev => (prev + 1) % features.length);
        setProgress(0);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [progress, features.length, autoPlayInterval]);

  const activeIndex = hoveredIndex ?? currentFeature;

  return (
    <div className={cn("p-8 md:p-12", className)}>
      <div className="w-full">
        <div className="flex flex-col space-y-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-6 md:gap-8"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: index === activeIndex ? 1 : 0.3 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className={cn(
                  "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2",
                  index === activeIndex
                    ? "bg-primary/80 border-muted/80 text-primary-foreground scale-110"
                    : "bg-muted border-muted-foreground"
                )}
              >
                {index <= activeIndex ? (
                  <span className="text-lg font-thin">✓</span>
                ) : (
                  <span className="text-lg font-thin">{index + 1}</span>
                )}
              </motion.div>

              <div className="flex-1">
                <p className="text-sm md:text-lg text-muted-foreground font-thin text-left">
                  {index === activeIndex && feature.highlight
                    ? feature.content
                        .split(new RegExp(`(${feature.highlight})`, "gi"))
                        .map((part, i) =>
                          part.toLowerCase() ===
                          feature.highlight?.toLowerCase() ? (
                            <span
                              key={i}
                              className="text-primary font-semibold"
                            >
                              {part}
                            </span>
                          ) : (
                            part
                          )
                        )
                    : feature.content}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
