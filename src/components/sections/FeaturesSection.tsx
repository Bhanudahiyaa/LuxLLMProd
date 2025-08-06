"use client";

import { Brain, Zap, Shield, Smartphone, Database, Cpu } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const FeaturesSection = () => {
  return (
    <section id="features" className="py-1 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-light tracking-tighter mb-6">
            Powerful <span className="text-primary">Features</span>
          </h2>
          <p className="text-xl text-foreground/70 font-light max-w-2xl mx-auto">
            Everything you need to harness the power of multiple AI models
          </p>
        </motion.div>

        <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
          <GridItem
            area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
            icon={<Brain className="h-4 w-4" />}
            title="Universal AI Model Access"
            description="Instant access to top LLMs like OpenAI, Anthropic, and Google via a unified abstraction layer."
          />
          <GridItem
            area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
            icon={<Zap className="h-4 w-4" />}
            title="Lightning Fast Performance"
            description="Optimized infrastructure ensures your queries are processed quickly and efficiently across all models."
          />
          <GridItem
            area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
            icon={<Shield className="h-4 w-4" />}
            title="Enterprise Security"
            description="Built with enterprise-grade security and privacy controls to protect your sensitive data and conversations."
          />
          <GridItem
            area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
            icon={<Smartphone className="h-4 w-4" />}
            title="Mobile Ready Design"
            description="Fully responsive interface that works seamlessly across all devices and platforms, all agent components remain mobile accessible and responsive.
"
          />
          <GridItem
            area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
            icon={<Database className="h-4 w-4" />}
            title="Smart Model Routing"
            description="Context-aware router dynamically selects the optimal model per prompt, maximizing relevance and speed."
          />
        </ul>
      </div>
    </section>
  );
};

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={cn("min-h-[14rem] list-none", area)}>
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border border-border bg-white/80 dark:bg-black/20 p-6 shadow-sm glass-card">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border-[0.75px] border-border bg-primary/20 p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="pt-0.5 text-xl leading-[1.375rem] font-light font-sans tracking-tighter md:text-2xl md:leading-[1.875rem] text-balance text-foreground">
                {title}
              </h3>
              <h2 className="font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-foreground/70 font-light">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default FeaturesSection;
