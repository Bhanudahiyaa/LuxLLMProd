import { motion } from "framer-motion";
import { Star } from "phosphor-react";
import { useState, useEffect } from "react";

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "AI Researcher at OpenAI",
      company: "OpenAI",
      content: "t3Dotgg has revolutionized how we test and compare different language models. The interface is incredibly intuitive.",
      result: "50% faster model evaluation",
      rating: 5,
      avatar: "👩‍💻"
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO",
      company: "TechFlow Inc",
      content: "The seamless integration of multiple AI models in one platform has saved us countless hours of development time.",
      result: "3x productivity increase",
      rating: 5,
      avatar: "👨‍💼"
    },
    {
      name: "Emily Watson",
      role: "Product Manager",
      company: "InnovateLab",
      content: "Best AI aggregator I've used. The quality of responses and the variety of models available is unmatched.",
      result: "95% query satisfaction",
      rating: 5,
      avatar: "👩‍🔬"
    },
    {
      name: "David Kim",
      role: "Senior Developer",
      company: "StartupX",
      content: "t3Dotgg's API integration is flawless. It's become an essential tool in our development workflow.",
      result: "40% faster deployment",
      rating: 5,
      avatar: "👨‍💻"
    },
    {
      name: "Lisa Park",
      role: "Data Scientist",
      company: "AI Ventures",
      content: "The analytics and insights provided by t3Dotgg help us make better decisions about which models to use.",
      result: "60% better model selection",
      rating: 5,
      avatar: "👩‍🎓"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length;
      visible.push(testimonials[index]);
    }
    return visible;
  };

  return (
    <section id="testimonials" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-light tracking-tighter mb-6">
            Trusted by <span className="text-primary">Innovators</span>
          </h2>
          <p className="text-xl text-foreground/70 font-light max-w-2xl mx-auto">
            See what leading developers and researchers are saying about t3Dotgg
          </p>
        </motion.div>

        <div className="relative overflow-hidden">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-3 gap-8"
          >
            {getVisibleTestimonials().map((testimonial, index) => (
              <motion.div
                key={`${testimonial.name}-${currentIndex}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card p-8 rounded-3xl hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="text-4xl mr-4">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-medium text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-foreground/60">{testimonial.role}</p>
                    <p className="text-sm text-primary">{testimonial.company}</p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} weight="fill" className="text-primary" />
                  ))}
                </div>

                <p className="text-foreground/80 font-light mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                <div className="border-t border-border/50 pt-4">
                  <p className="text-primary font-medium text-sm">
                    Result: {testimonial.result}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-primary' : 'bg-foreground/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;