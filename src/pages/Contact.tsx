import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/sections/Footer";
import { EnvelopeSimple, MapPin, Phone, Clock } from "phosphor-react";

const Contact = () => {
  const [emailSent, setEmailSent] = useState(false);
  const contactInfo = [
    {
      icon: <EnvelopeSimple size={32} weight="light" />,
      title: "Email",
      description: "Get in touch with our team",
      value: "LuxLLM69@gmail.com",
      action: "mailto:LuxLLM69@gmail.com",
    },
    {
      icon: <Phone size={32} weight="light" />,
      title: "Phone",
      description: "Call us during business hours",
      value: "+91 9416293757",
      action: "tel:+919416293757",
    },
    {
      icon: <MapPin size={32} weight="light" />,
      title: "Office",
      description: "Visit our headquarters",
      value: "Maharaja Agrasen Institute of Technology",
      action: null,
    },
    {
      icon: <Clock size={32} weight="light" />,
      title: "Hours",
      description: "We're here to help",
      value: "Mon-Fri 9AM-6PM IST",
      action: null,
    },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const subject = formData.get("subject");
    const body = `Name: ${formData.get("firstName")} ${formData.get(
      "lastName"
    )}\nEmail: ${formData.get("email")}\n\nMessage:\n${formData.get(
      "message"
    )}`;
    window.location.href = `mailto:bhanudahiya8@gmail.com?subject=${encodeURIComponent(
      subject as string
    )}&body=${encodeURIComponent(body)}`;
    setEmailSent(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen bg-background"
    >
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-12 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-7xl font-light tracking-tighter mb-6">
              Get in <span className="text-primary">Touch</span>
            </h1>
            <p className="text-xl md:text-2xl text-foreground/70 font-light leading-relaxed">
              Have questions? We'd love to hear from you. Send us a message and
              we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-8 relative">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="glass-card p-8 rounded-3xl"
            >
              <h2 className="text-3xl font-light tracking-tighter mb-8">
                Send us a message
              </h2>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-light text-foreground/70 mb-2"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="w-full px-4 py-3 bg-secondary/50 border border-border/50 rounded-xl text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                      placeholder="First Name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-light text-foreground/70 mb-2"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="w-full px-4 py-3 bg-secondary/50 border border-border/50 rounded-xl text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-light text-foreground/70 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 bg-secondary/50 border border-border/50 rounded-xl text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-light text-foreground/70 mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 bg-secondary/50 border border-border/50 rounded-xl text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-light text-foreground/70 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    className="w-full px-4 py-3 bg-secondary/50 border border-border/50 rounded-xl text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-medium hover:bg-primary/90 transition-all duration-300"
                >
                  Send Message
                </motion.button>
              </form>
              {emailSent && (
                <div className="mt-4 p-4 rounded-lg bg-green-500 text-white text-center">
                  Email sent successfully!
                </div>
              )}
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="glass-card p-8 rounded-3xl">
                <h2 className="text-3xl font-light tracking-tighter mb-8">
                  Contact Information
                </h2>

                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start space-x-4"
                    >
                      <div className="text-primary mt-1">{info.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-lg font-light tracking-tighter mb-1">
                          {info.title}
                        </h3>
                        <p className="text-foreground/70 font-light text-sm mb-2">
                          {info.description}
                        </p>
                        {info.action ? (
                          <a
                            href={info.action}
                            className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-foreground font-medium">
                            {info.value}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="glass-card p-8 rounded-3xl"
              >
                <h3 className="text-xl font-light tracking-tighter mb-4">
                  Enterprise Inquiries
                </h3>
                <p className="text-foreground/70 font-light mb-4">
                  Looking for custom solutions or enterprise pricing? Our
                  business team is ready to help.
                </p>
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href="mailto:bhanudahiya8@gmail.com?subject=Enterprise Inquiry"
                  className="neuro-button px-6 py-3 text-sm font-medium rounded-xl hover:text-primary transition-all duration-300"
                >
                  Contact Sales
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </motion.div>
  );
};

export default Contact;
