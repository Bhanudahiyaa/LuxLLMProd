import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/sections/Footer";
import { Calendar, Clock, ArrowRight } from "phosphor-react";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Future of AI Aggregation: Why One Platform Rules Them All",
      excerpt:
        "Exploring the benefits of unified AI interfaces and how aggregation platforms are changing the landscape of artificial intelligence development.",
      author: "Alex Thompson",
      authorRole: "CEO & Founder",
      date: "March 15, 2024",
      readTime: "5 min read",
      category: "Industry Insights",
      image: "🧠",
      featured: true,
    },
    {
      id: 2,
      title: "Building Better Prompts: A Developer's Guide to AI Optimization",
      excerpt:
        "Learn advanced techniques for crafting effective prompts that get better results from language models. Includes practical examples and best practices.",
      author: "Sarah Chen",
      authorRole: "CTO",
      date: "March 10, 2024",
      readTime: "8 min read",
      category: "Technical Guide",
      image: "💡",
      featured: false,
    },
    {
      id: 3,
      title: "Comparing GPT-4, Claude, and Gemini: A Comprehensive Analysis",
      excerpt:
        "We put the leading AI models head-to-head across various tasks to help you choose the right tool for your specific use case.",
      author: "Emily Watson",
      authorRole: "Head of AI Research",
      date: "March 5, 2024",
      readTime: "12 min read",
      category: "Research",
      image: "📊",
      featured: false,
    },
    {
      id: 4,
      title: "API Integration Made Simple: Getting Started with t3Dotgg",
      excerpt:
        "A step-by-step tutorial on integrating t3Dotgg's API into your applications, with code examples and real-world use cases.",
      author: "Marcus Rodriguez",
      authorRole: "Head of Product",
      date: "February 28, 2024",
      readTime: "6 min read",
      category: "Tutorial",
      image: "⚡",
      featured: false,
    },
  ];

  const categories = [
    "All",
    "Industry Insights",
    "Technical Guide",
    "Research",
    "Tutorial",
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
      <section className="pt-32 pb-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-7xl font-light tracking-tighter mb-6">
              t3Dotgg <span className="text-primary">Blog</span>
            </h1>
            <p className="text-xl md:text-2xl text-foreground/70 font-light leading-relaxed">
              Insights, tutorials, and updates from the world of AI aggregation
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4"
          >
            {categories.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-xl font-light transition-all duration-300 ${
                  index === 0
                    ? "bg-primary text-primary-foreground"
                    : "glass-card hover:bg-white/10 text-foreground/70 hover:text-foreground"
                }`}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          {blogPosts
            .filter(post => post.featured)
            .map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="glass-card p-8 md:p-12 rounded-3xl hover:bg-white/10 transition-all duration-500 group cursor-pointer max-w-5xl mx-auto"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <span className="px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-light">
                      Featured
                    </span>
                    <span className="px-4 py-2 bg-secondary/50 text-foreground/70 rounded-full text-sm font-light">
                      {post.category}
                    </span>
                  </div>
                  <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                    {post.image}
                  </div>
                </div>

                <h2 className="text-3xl md:text-4xl font-light tracking-tighter mb-4 group-hover:text-primary transition-colors duration-300">
                  {post.title}
                </h2>

                <p className="text-lg text-foreground/70 font-light leading-relaxed mb-6">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div>
                      <p className="font-medium text-foreground">
                        {post.author}
                      </p>
                      <p className="text-sm text-foreground/60">
                        {post.authorRole}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-foreground/60">
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} weight="light" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock size={16} weight="light" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ x: 5 }}
                    className="text-primary group-hover:scale-110 transition-all duration-300"
                  >
                    <ArrowRight size={24} weight="light" />
                  </motion.div>
                </div>
              </motion.article>
            ))}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts
              .filter(post => !post.featured)
              .map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card p-6 rounded-3xl hover:bg-white/10 transition-all duration-500 group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-secondary/50 text-foreground/70 rounded-full text-xs font-light">
                      {post.category}
                    </span>
                    <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                      {post.image}
                    </div>
                  </div>

                  <h3 className="text-xl font-light tracking-tighter mb-3 group-hover:text-primary transition-colors duration-300">
                    {post.title}
                  </h3>

                  <p className="text-foreground/70 font-light leading-relaxed mb-4 text-sm">
                    {post.excerpt}
                  </p>

                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        {post.author}
                      </p>
                      <p className="text-xs text-foreground/60">
                        {post.authorRole}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-xs text-foreground/60">
                        <div className="flex items-center space-x-1">
                          <Calendar size={12} weight="light" />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock size={12} weight="light" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>

                      <motion.div
                        whileHover={{ x: 3 }}
                        className="text-primary group-hover:scale-110 transition-all duration-300"
                      >
                        <ArrowRight size={16} weight="light" />
                      </motion.div>
                    </div>
                  </div>
                </motion.article>
              ))}
          </div>
        </div>
      </section>

      <Footer />
    </motion.div>
  );
};

export default Blog;
