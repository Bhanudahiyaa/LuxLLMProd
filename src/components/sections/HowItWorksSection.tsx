import { motion } from "framer-motion";
import { Gear, ChatCircle } from "phosphor-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <Gear size={48} weight="light" />,
      title: "Set up your AI assistant",
      description: "Connect your preferred AI models and customize your workspace in minutes. Our intuitive setup process makes it effortless.",
      image: "🤖"
    },
    {
      icon: <ChatCircle size={48} weight="light" />,
      title: "Ask anything",
      description: "Start conversations with multiple AI models simultaneously. Compare responses, get diverse perspectives, and find the best solutions.",
      image: "💬"
    }
  ];

  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-light tracking-tighter mb-6">
            How it <span className="text-primary">Works</span>
          </h2>
          <p className="text-xl text-foreground/70 font-light max-w-2xl mx-auto">
            Get started with t3Dotgg in just two simple steps
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="glass-card p-8 rounded-3xl hover:bg-white/10 transition-all duration-500 h-full">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
                  {index + 1}
                </div>

                {/* Image/Emoji */}
                <div className="text-8xl mb-8 text-center group-hover:scale-110 transition-transform duration-300">
                  {step.image}
                </div>

                {/* Icon */}
                <div className="text-primary mb-6 flex justify-center">
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-light tracking-tighter mb-4 text-center">
                  {step.title}
                </h3>
                <p className="text-foreground/70 font-light leading-relaxed text-center">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Connection Line */}
        <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-px h-32 bg-gradient-to-b from-primary/50 to-transparent"></div>
      </div>
    </section>
  );
};

export default HowItWorksSection;