import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "phosphor-react";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What AI models are supported?",
      answer: "t3Dotgg supports all major AI models including GPT-4, Claude, Gemini, LLaMA, and many others. We continuously add new models as they become available."
    },
    {
      question: "How does the pricing work?",
      answer: "Our pricing is based on the number of queries you make per month. Each plan includes access to different AI models and features. You can upgrade or downgrade at any time."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use bank-grade encryption, comply with SOC 2 standards, and follow GDPR regulations. Your conversations and data are never stored longer than necessary."
    },
    {
      question: "Can I integrate t3Dotgg with my existing tools?",
      answer: "Yes! We offer comprehensive API access, webhooks, and integrations with popular platforms like Slack, Discord, and custom applications."
    },
    {
      question: "Do you offer enterprise solutions?",
      answer: "We provide custom enterprise solutions including on-premise deployment, white-label options, and dedicated support with SLA guarantees."
    },
    {
      question: "How fast are the responses?",
      answer: "Most queries receive responses within 1-3 seconds. Pro and Enterprise users get priority access to our infrastructure for even faster response times."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-light tracking-tighter mb-6">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className="text-xl text-foreground/70 font-light max-w-2xl mx-auto">
            Everything you need to know about t3Dotgg
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="mb-4"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full glass-card p-6 rounded-2xl text-left hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-light tracking-tighter pr-4">
                    {faq.question}
                  </h3>
                  <div className="text-primary group-hover:scale-110 transition-transform duration-300">
                    {openIndex === index ? (
                      <Minus size={24} weight="light" />
                    ) : (
                      <Plus size={24} weight="light" />
                    )}
                  </div>
                </div>
                
                <motion.div
                  initial={false}
                  animate={{
                    height: openIndex === index ? "auto" : 0,
                    opacity: openIndex === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="text-foreground/70 font-light leading-relaxed pt-4 border-t border-border/30 mt-4">
                    {faq.answer}
                  </p>
                </motion.div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;