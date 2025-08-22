import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/sections/Footer";
import { Heart, Users, Rocket, Target } from "phosphor-react";

const About = () => {
  const values = [
    {
      icon: <Heart size={48} weight="light" />,
      title: "User-Centric",
      description:
        "Every decision we make is guided by what's best for our users and their success.",
    },
    {
      icon: <Users size={48} weight="light" />,
      title: "Collaborative",
      description:
        "We believe in the power of community and open collaboration to drive innovation.",
    },
    {
      icon: <Rocket size={48} weight="light" />,
      title: "Innovative",
      description:
        "We constantly push boundaries and explore new possibilities in AI technology.",
    },
    {
      icon: <Target size={48} weight="light" />,
      title: "Focused",
      description:
        "We maintain laser focus on building the best AI Chatbot platform possible.",
    },
  ];

  const team = [
    {
      name: "Bhanu Pratap Singh",
      role: " Founder",
      bio: "Former Backend Developer at FirstContact with 3+ years of experience in web development, AI and building products.",
      avatar: "👨‍💻",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen bg-background"
    >
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-8 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-7xl font-light tracking-tighter mb-6">
              About <span className="text-primary">LuxLLM</span>
            </h1>
            <p className="text-lg md:text-lg text-foreground/70 font-thin leading-relaxed">
              Lux LLM is powering the evolution of AI chatbots faster, smarter,
              limitless.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-4 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="glass-card p-12 rounded-3xl mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-light tracking-tighter mb-8 text-center">
                Our Story
              </h2>
              <div className="space-y-6 text-lg text-foreground/80 font-thin leading-relaxed">
                <p>
                  Lux LLM was built to remove the complexity of AI chatbot
                  deployment. Instead of juggling fragmented tools and heavy
                  integrations, you get customizable, intelligent chatbots that
                  drop into any website with a simple script tag.
                </p>
                <p>
                  Backed by experience from leading AI companies, we designed
                  Lux LLM to be powerful, flexible, and developer friendly so
                  you can focus on creating great user experiences, not managing
                  infrastructure.
                </p>
                <p>
                  Today, teams of all sizes from startups to global enterprises
                  rely on Lux LLM to launch smarter chatbots, accelerate
                  customer engagement, and shape the future of AI-driven
                  conversations.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-0 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-light tracking-tighter mb-6">
              Our Values
            </h2>
            <p className="text-lg text-foreground/70 font-light max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-8 rounded-3xl text-center hover:bg-white/10 transition-all duration-500"
              >
                <div className="text-primary mb-6 flex justify-center">
                  {value.icon}
                </div>
                <h3 className="text-xl font-light tracking-tighter mb-4">
                  {value.title}
                </h3>
                <p className="text-foreground/70 font-light">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-light tracking-tighter mb-6">
              Meet the Team
            </h2>
            <p className="text-lg text-foreground/70 font-thin max-w-2xl mx-auto">
              The brilliant mind behind LuxLLM
            </p>
          </motion.div>

          <div className="flex justify-center md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-8 rounded-3xl text-center hover:bg-muted/10 transition-all duration-500"
              >
                <div className="text-6xl mb-6">{member.avatar}</div>
                <h3 className="text-xl font-light tracking-tighter mb-2">
                  {member.name}
                </h3>
                <p className="text-primary font-medium mb-4">{member.role}</p>
                <p className="text-foreground/70 font-light text-sm leading-relaxed">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </motion.div>
  );
};

export default About;
