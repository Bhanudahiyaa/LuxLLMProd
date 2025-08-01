"use client";
import React from "react";
import { motion } from "motion/react";

const testimonials = [
  {
    text: "t3Dotgg has revolutionized how we test and compare different language models. The interface is incredibly intuitive and saves us hours daily.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Sarah Chen",
    role: "AI Researcher at OpenAI",
  },
  {
    text: "The seamless integration of multiple AI models in one platform has saved us countless hours of development time. Incredible efficiency boost.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "Marcus Rodriguez",
    role: "CTO at TechFlow Inc",
  },
  {
    text: "Best AI aggregator I've used. The quality of responses and the variety of models available is unmatched in the industry.",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    name: "Emily Watson",
    role: "Product Manager",
  },
  {
    text: "t3Dotgg's API integration is flawless. It's become an essential tool in our development workflow, improving our deployment speed significantly.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    name: "David Kim",
    role: "Senior Developer",
  },
  {
    text: "The analytics and insights provided help us make better decisions about which models to use for specific tasks. Game changer for our team.",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    name: "Lisa Park",
    role: "Data Scientist",
  },
  {
    text: "Implementation was smooth and quick. The customizable, user-friendly interface made team training effortless across our organization.",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    name: "Aliza Khan",
    role: "Business Analyst",
  },
  {
    text: "The support team is exceptional, guiding us through setup and providing ongoing assistance, ensuring our complete satisfaction.",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    name: "Farhan Siddiqui",
    role: "Marketing Director",
  },
  {
    text: "This platform delivered a solution that exceeded expectations, understanding our needs and significantly enhancing our operations.",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    name: "Sana Sheikh",
    role: "Sales Manager",
  },
  {
    text: "Using t3Dotgg, our AI model evaluation and deployment processes have significantly improved, boosting overall business performance.",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    name: "Hassan Ali",
    role: "AI Operations Manager",
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
        className="flex flex-col gap-6 pb-6 bg-background"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div className="glass-card p-10 rounded-3xl border border-border/20 shadow-lg shadow-primary/10 max-w-xs w-full" key={i}>
                  <div className="text-foreground/80 font-light leading-relaxed">{text}</div>
                  <div className="flex items-center gap-2 mt-5">
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      className="h-10 w-10 rounded-full border border-border/20"
                    />
                    <div className="flex flex-col">
                      <div className="font-medium tracking-tight leading-5 text-foreground">{name}</div>
                      <div className="leading-5 opacity-60 tracking-tight text-foreground/60">{role}</div>
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
    <section className="bg-background my-20 relative">
      <div className="container z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <div className="flex justify-center">
            <div className="border border-border/20 py-1 px-4 rounded-lg text-foreground/60 text-sm">Testimonials</div>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light tracking-tighter mt-5 text-center">
            Trusted by <span className="text-primary">Innovators</span>
          </h2>
          <p className="text-center mt-5 opacity-75 text-foreground/70 font-light">
            See what leading developers and researchers are saying about t3Dotgg
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;