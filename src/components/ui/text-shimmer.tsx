"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextShimmerProps {
  children: React.ReactNode;
  className?: string;
  shimmerColor?: string;
  shimmerWidth?: number;
  duration?: number;
}

export const TextShimmer = ({
  children,
  className,
  shimmerColor = "hsl(var(--primary))",
  shimmerWidth = 100,
  duration = 2,
}: TextShimmerProps) => {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`,
          width: `${shimmerWidth}px`,
          transform: "translateX(-100%)",
        }}
        animate={{
          x: ["-100%", "200%"],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

interface LoadingShimmerProps {
  className?: string;
  lines?: number;
  shimmerColor?: string;
}

export const LoadingShimmer = ({
  className,
  lines = 3,
  shimmerColor = "hsl(var(--primary))",
}: LoadingShimmerProps) => {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="h-4 bg-muted rounded animate-pulse"
          style={{
            width: `${80 - index * 10}%`,
            background: "hsl(var(--muted))",
          }}
        >
          <TextShimmer shimmerColor={shimmerColor} className="h-full w-full">
            <div className="h-full w-full" />
          </TextShimmer>
        </div>
      ))}
    </div>
  );
};

interface ProcessLoaderProps {
  message?: string;
  className?: string;
  shimmerColor?: string;
}

export const ProcessLoader = ({
  message = "Processing your request...",
  className,
  shimmerColor = "hsl(var(--primary))",
}: ProcessLoaderProps) => {
  return (
    <div className={cn("flex flex-col items-center space-y-4", className)}>
      <div className="relative">
        <div
          className="w-16 h-16 border-4 border-muted rounded-full"
          style={{ borderColor: "hsl(var(--muted))" }}
        />
        <motion.div
          className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary rounded-full"
          style={{ borderTopColor: shimmerColor }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <TextShimmer
        shimmerColor={shimmerColor}
        className="text-lg font-medium text-center"
      >
        {message}
      </TextShimmer>

      <div className="flex space-x-1">
        <motion.div
          className="w-2 h-2 bg-primary rounded-full"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: 0,
          }}
          style={{ background: shimmerColor }}
        />
        <motion.div
          className="w-2 h-2 bg-primary rounded-full"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: 0.2,
          }}
          style={{ background: shimmerColor }}
        />
        <motion.div
          className="w-2 h-2 bg-primary rounded-full"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: 0.4,
          }}
          style={{ background: shimmerColor }}
        />
      </div>
    </div>
  );
};
