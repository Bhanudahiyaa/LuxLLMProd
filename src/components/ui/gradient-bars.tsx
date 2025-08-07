"use client";

import { motion } from "framer-motion";

interface GradientBarsProps {
  bars?: number;
  colors?: string[];
}

export const GradientBars = ({
  bars = 20,
  colors = ["hsl(var(--primary))", "rgba(34, 197, 94, 0.1)"],
}: GradientBarsProps) => {
  const gradientStyle = `linear-gradient(to top, ${colors.join(", ")})`;

  console.log("GradientBars rendering with:", { bars, colors, gradientStyle });

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="flex h-full w-full items-end">
        {Array.from({ length: bars }).map((_, index) => {
          const position = index / (bars - 1);
          const center = 0.5;
          const distance = Math.abs(position - center);
          const scale = 0.3 + 0.7 * Math.pow(distance * 2, 1.2);

          return (
            <motion.div
              key={`bg-bar-${index}`}
              className="flex-1 origin-bottom"
              style={{
                background: gradientStyle,
                opacity: 0.8, // Make bars more visible
                height: `${scale * 100}%`,
              }}
              animate={{
                scaleY: [scale, scale + 0.1, scale],
                opacity: [0.8, 0.6, 0.8],
              }}
              transition={{
                duration: 3,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror",
                delay: index * 0.5,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
