import React from "react";
import { motion } from "framer-motion";
import { AnimatedGradient } from "@/components/ui/animated-gradient-with-svg";

interface BentoCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  colors: string[];
  delay: number;
}

const BentoCard: React.FC<BentoCardProps> = ({
  title,
  value,
  subtitle,
  colors,
  delay,
}) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: delay + 0.3 },
    },
  };

  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="relative overflow-hidden h-full bg-background dark:bg-background/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <AnimatedGradient colors={colors} speed={0.05} blur="medium" />
      <motion.div
        className="relative z-10 p-4 sm:p-6 md:p-8 text-foreground backdrop-blur-sm"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.h3 className="text-sm sm:text-base md:text-lg" variants={item}>
          {title}
        </motion.h3>
        <motion.p
          className="text-3xl sm:text-4xl md:text-5xl font-medium mb-3"
          variants={item}
        >
          {value}
        </motion.p>
        {subtitle && (
          <motion.p className="text-sm text-foreground/80" variants={item}>
            {subtitle}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
};

const MissionSection: React.FC = () => {
  return (
    <section id="mission" className="py-10 relative">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl md:text-6xl font-light tracking-tighter">
            Our <span className="text-primary">Mission</span>
          </h2>
          <p className="mt-6 text-lg text-thin text-foreground/70 max-w-xl mx-auto">
            Empower everyone to build AI agents in minutes - code free,
            scalable, and production ready.
          </p>
        </motion.div>

        {/* Bento grid with animated gradients + demo numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
          <div className="md:col-span-2">
            <BentoCard
              title="AI Chatbots Deployed"
              value="22"
              subtitle="Built and launched by our community this year"
              colors={[
                "rgba(6, 194, 16, 0.08)",
                "transparent",
                "rgba(6, 194, 16, 0.06)",
              ]}
              delay={0.2}
            />
          </div>

          <BentoCard
            title="Avg Setup Time"
            value="2.5 min"
            subtitle="From idea to a live AI Chatbot"
            colors={[
              "rgba(6, 194, 16, 0.08)",
              "transparent",
              "rgba(6, 194, 16, 0.06)",
            ]}
            delay={0.35}
          />

          <BentoCard
            title="Customer Satisfaction"
            value="4.8/5"
            subtitle="Rated by hundreds of users"
            colors={[
              "rgba(6, 194, 16, 0.08)",
              "transparent",
              "rgba(6, 194, 16, 0.06)",
            ]}
            delay={0.45}
          />

          <div className="md:col-span-2">
            <BentoCard
              title="Energy Efficiency"
              value="30% Less"
              subtitle="Reduced compute energy usage"
              colors={[
                "rgba(6, 194, 16, 0.08)",
                "transparent",
                "rgba(6, 194, 16, 0.06)",
              ]}
              delay={0.55}
            />
          </div>

          <div className="md:col-span-3">
            <BentoCard
              title="Uptime SLA"
              value="99.9%"
              subtitle="Enterprise‑grade reliability and security"
              colors={[
                "rgba(6, 194, 16, 0.08)",
                "transparent",
                "rgba(6, 194, 16, 0.06)",
              ]}
              delay={0.7}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
