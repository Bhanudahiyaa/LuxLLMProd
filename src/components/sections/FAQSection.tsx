import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "phosphor-react";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What AI models does LuxLLM support?",
      answer:
        "LuxLLM unifies access to top-performing AI models including GPT-4, Claude, Gemini, LLaMA, Mistral, and more. We continuously integrate the latest models as they are released, so your agents stay ahead of the curve.",
    },
    {
      question: "How does LuxLLM pricing work?",
      answer:
        "Our pricing is based on active AI agent usage and the number of queries per month. All plans include access to multiple models, no-code agent building, and core integrations. You can scale up or down anytime as your needs change.",
    },
    {
      question: "How does LuxLLM handle my data?",
      answer:
        "We use end-to-end encryption for all data in transit and at rest. Your inputs and outputs remain private, are never used for model training without explicit consent, and can be instantly deleted from our systems at your request.",
    },

    {
      question: "Does LuxLLM offer enterprise features?",
      answer:
        "We offer enterprise-ready solutions including role-based access control, SSO/SAML authentication, private deployments, and priority support. Our infrastructure is designed to meet the compliance needs of regulated industries.",
    },
    {
      question: "How fast will my AI agents respond?",
      answer:
        "Most LuxLLM agents respond in under 2 seconds. Pro and Enterprise plans include priority infrastructure to ensure low latency even during peak traffic.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-10 relative">
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
            Everything you need to know about LuxLLM
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
                    opacity: openIndex === index ? 1 : 0,
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
