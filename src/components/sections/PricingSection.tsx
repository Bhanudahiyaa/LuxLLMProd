import { motion } from "framer-motion";
import { Check, Crown } from "phosphor-react";

const PricingSection = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for exploring AI capabilities",
      features: [
        "100 queries per month",
        "Access to 3 AI models",
        "Basic chat interface",
        "Community support",
        "Standard response time",
      ],
      isRecommended: false,
      buttonText: "Get Started",
    },
    {
      name: "Pro",
      price: "$29",
      period: "per month",
      description: "For professionals and growing teams",
      features: [
        "10,000 queries per month",
        "Access to all AI models",
        "Advanced chat interface",
        "Priority support",
        "Faster response times",
        "API access",
        "Custom integrations",
        "Analytics dashboard",
      ],
      isRecommended: true,
      buttonText: "Start Pro Trial",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For large organizations with specific needs",
      features: [
        "Unlimited queries",
        "All AI models + custom models",
        "White-label solution",
        "24/7 dedicated support",
        "SLA guarantees",
        "On-premise deployment",
        "Advanced security features",
        "Custom training",
      ],
      isRecommended: false,
      buttonText: "Contact Sales",
    },
  ];

  return (
    <section id="pricing" className="py-12 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-light tracking-tighter mb-6">
            Simple <span className="text-primary">Pricing</span>
          </h2>
          <p className="text-lg text-foreground/70 font-thin max-w-2xl mx-auto">
            Choose the perfect plan for your AI journey. Upgrade or downgrade at
            any time.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative glass-card p-8 rounded-3xl hover:bg-white/5 transition-all duration-500 ${
                plan.isRecommended ? "border-primary border-2" : ""
              }`}
            >
              {plan.isRecommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                    <Crown size={16} weight="fill" />
                    Recommended
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-light tracking-tighter mb-2">
                  {plan.name}
                </h3>
                <div className="text-4xl font-light tracking-tighter mb-2">
                  {plan.price}
                  <span className="text-lg text-foreground/60 ml-1">
                    /{plan.period}
                  </span>
                </div>
                <p className="text-foreground/70 font-light">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check
                      size={20}
                      weight="bold"
                      className="text-primary mt-0.5 flex-shrink-0"
                    />
                    <span className="text-foreground/80 font-light">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 rounded-2xl font-medium transition-all duration-300 ${
                  plan.isRecommended
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "neuro-button hover:text-primary"
                }`}
              >
                {plan.buttonText}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
