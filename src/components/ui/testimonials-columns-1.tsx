"use client";
import React from "react";
import { motion } from "motion/react";

const testimonials = [
  {
    text: "LuxLLM gave us a zero-code way to spin up multimodal agents with full frontend integration. Total game changer.",
    image: "https://randomuser.me/api/portraits/men/10.jpg",
    name: "Ankit Verma",
    role: "Founding Engineer at SynapseAI",
  },
  {
    text: "We went from prompt to fully deployable agent logic in under 5 minutes. LuxLLM makes agent workflows effortless.",
    image: "https://randomuser.me/api/portraits/women/11.jpg",
    name: "Priya Narayan",
    role: "CTO at NeuraTech",
  },
  {
    text: "Auto model-switching and mobile-responsiveness make LuxLLM perfect for dynamic enterprise-grade apps.",
    image: "https://randomuser.me/api/portraits/men/12.jpg",
    name: "Karan Malhotra",
    role: "Product Architect at AlgoPulse",
  },
  {
    text: "LuxLLM handles secure data fetching and generates optimized agent logic that’s plug-and-play ready.",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    name: "Sneha Iyer",
    role: "Lead AI Engineer, CognitiveCore",
  },
  {
    text: "From .env to logic to frontend, LuxLLM’s structured output saved us weeks of manual integration.",
    image: "https://randomuser.me/api/portraits/men/13.jpg",
    name: "Aditya Rao",
    role: "Founder, Autogen Tools",
  },
  {
    text: "The platform lets our team ship LLM features 5x faster with secure, reliable and composable agent logic.",
    image: "https://randomuser.me/api/portraits/women/13.jpg",
    name: "Rhea Kapoor",
    role: "VP of Engineering at DeepStack",
  },
  {
    text: "LuxLLM’s unified interface and multi-model orchestration streamlined how our team builds smart workflows.",
    image: "https://randomuser.me/api/portraits/men/14.jpg",
    name: "Arjun Desai",
    role: "LLM DevOps Lead at Nexa Systems",
  },
  {
    text: "No-code agent deployment with full code control. LuxLLM hit the sweet spot for our engineering team.",
    image: "https://randomuser.me/api/portraits/women/14.jpg",
    name: "Meera Joshi",
    role: "Technical PM, NovaAI",
  },
  {
    text: "Best enterprise-grade agent generation tool we've used—reliable, extensible, and incredibly well-designed.",
    image: "https://randomuser.me/api/portraits/men/15.jpg",
    name: "Rahul Chatterjee",
    role: "AI Solutions Director, Brainnova",
  },
];

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: typeof testimonials;
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-glass"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div
                  className="glass-card p-10 rounded-3xl border border-border/20 shadow-lg shadow-primary/80 max-w-xs w-full"
                  key={i}
                >
                  <div className="text-foreground/75 font-thin leading-relaxed">
                    {text}
                  </div>
                  <div className="flex items-center gap-2 mt-5">
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      className="h-10 w-10 rounded-full border border-border/20"
                    />
                    <div className="flex flex-col">
                      <div className="font-medium tracking-tight leading-5 text-foreground">
                        {name}
                      </div>
                      <div className="leading-5 opacity-60 tracking-tight text-foreground/60">
                        {role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const Testimonials = () => {
  return (
    <section className="bg-background my-5 relative">
      <div className="container z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <div className="flex justify-center">
            <div className="border border-border/20 py-1 px-4 rounded-lg text-foreground/60 text-sm">
              Testimonials
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light tracking-tighter mt-5 text-center">
            Trusted by <span className="text-primary">Innovators</span>
          </h2>
          <p className="text-center mt-5 opacity-75 text-foreground/70 font-light">
            See what leading developers and researchers are saying about LuxLLM
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-12 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={17}
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
