import { motion } from "framer-motion";

const FeaturedSection = () => {
  const publications = [
    { name: "TechCrunch", logo: "🚀" },
    { name: "Wired", logo: "⚡" },
    { name: "The Verge", logo: "🔥" },
    { name: "MIT Technology Review", logo: "🧠" },
    { name: "VentureBeat", logo: "💎" },
    { name: "Ars Technica", logo: "🔬" },
  ];

  return (
    <section id="featured" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-lg font-light tracking-tighter text-foreground/60 mb-8">
            Featured in leading publications
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, staggerChildren: 0.1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center"
        >
          {publications.map((pub, index) => (
            <motion.div
              key={pub.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-6 rounded-2xl hover:bg-white/10 transition-all duration-300 text-center group"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                {pub.logo}
              </div>
              <p className="text-sm font-light text-foreground/70">{pub.name}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedSection;