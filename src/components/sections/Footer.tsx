import { useState } from "react";
import { motion } from "framer-motion";
import {
  TwitterLogo,
  GithubLogo,
  LinkedinLogo,
  DiscordLogo,
} from "phosphor-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };
  const socialLinks = [
    {
      icon: <TwitterLogo size={24} weight="light" />,
      href: "https://x.com/iBhanuDahiya",
      label: "Twitter",
    },
    {
      icon: <GithubLogo size={24} weight="light" />,
      href: "https://github.com/Bhanudahiyaa",
      label: "GitHub",
    },
    {
      icon: <LinkedinLogo size={24} weight="light" />,
      href: "https://www.linkedin.com/in/bhanupratap1/",
      label: "LinkedIn",
    },
    {
      icon: <DiscordLogo size={24} weight="light" />,
      href: "#",
      label: "Discord",
    },
  ];

  const quickLinks = [
    { label: "Build AI Chabots", href: "/build" },
    { label: "Templates", href: "/build" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
  ];

  const companyLinks = [
    { label: "About", href: "/about" },

    { label: "Contact", href: "/contact" },
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
  ];

  return (
    <footer className="py-24 border-t border-border/30 relative">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="col-span-1"
          >
            <div className="font-bold text-2xl tracking-tighter mb-4">
              <span className="text-primary">Lux</span>
              <span className="text-foreground">LLM</span>
            </div>
            <p className="text-foreground/70 font-light leading-relaxed mb-6">
              Generate and Import Fully Customisable AI Chatbots.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/60 hover:text-primary transition-colors duration-300"
                  aria-label={link.label}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-light tracking-tighter mb-6">
              Product
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-foreground/70 hover:text-primary transition-colors duration-300 font-light"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-light tracking-tighter mb-6">
              Company
            </h4>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-foreground/70 hover:text-primary transition-colors duration-300 font-light"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-light tracking-tighter mb-6">
              Stay Updated
            </h4>
            <p className="text-foreground/70 font-light mb-4">
              Get the latest updates on new AI models and features.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-secondary/50 border border-border/50 rounded-xl text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubscribe}
                className="w-full neuro-button py-3 text-sm font-medium rounded-xl hover:text-primary transition-all duration-300"
              >
                Subscribe
              </motion.button>
              {subscribed && (
                <div className="mt-2 text-green-500 text-sm">
                  Successfully subscribed!
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-foreground/60 font-light mb-4 md:mb-0">
            © 2025 LuxLLM ❤️. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
