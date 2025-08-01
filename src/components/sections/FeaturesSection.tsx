import { motion } from "framer-motion";
import { Brain, Lightning, Shield, DeviceMobile } from "phosphor-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Brain size={48} weight="light" />,
      title: "Multi-Model Intelligence",
      description: "Access GPT-4, Claude, Gemini, and more AI models from a single interface. Compare responses and choose the best solution."
    },
    {
      icon: <Lightning size={48} weight="light" />,
      title: "Lightning Fast",
      description: "Optimized infrastructure ensures sub-second response times. Get instant results from multiple AI models simultaneously."
    },
    {
      icon: <Shield size={48} weight="light" />,
      title: "Enterprise Security",
      description: "Bank-grade encryption and privacy controls. Your data stays secure with SOC 2 compliance and GDPR protection."
    },
    {
      icon: <DeviceMobile size={48} weight="light" />,
      title: "Cross-Platform",
      description: "Seamless experience across web, mobile, and API integrations. Access your AI tools anywhere, anytime."
    }
  ];

  return (
    <section id="features" className="py-24 relative">
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
            Everything you need to harness the full power of artificial intelligence
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-8 rounded-3xl hover:bg-white/10 transition-all duration-500 group"
            >
              <div className="text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-light tracking-tighter mb-4">
                {feature.title}
              </h3>
              <p className="text-foreground/70 font-light leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;