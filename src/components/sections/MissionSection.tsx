import { motion } from "framer-motion";

const MissionSection = () => {
  return (
    <section id="mission" className="py-24 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
      
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-light tracking-tighter mb-8"
          >
            Our <span className="text-primary">Mission</span>
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="glass-card p-12 rounded-3xl"
          >
            <p className="text-2xl md:text-3xl font-light leading-relaxed text-foreground/90 mb-8">
              "We believe that artificial intelligence should be accessible, 
              transparent, and empowering for everyone."
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="text-lg font-medium mb-2">Democratize AI</h3>
                <p className="text-foreground/70 font-light">
                  Making cutting-edge AI accessible to creators, developers, and businesses worldwide.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl mb-4">🔬</div>
                <h3 className="text-lg font-medium mb-2">Drive Innovation</h3>
                <p className="text-foreground/70 font-light">
                  Pushing the boundaries of what's possible with collaborative AI development.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-lg font-medium mb-2">Shape the Future</h3>
                <p className="text-foreground/70 font-light">
                  Building the foundation for the next generation of intelligent applications.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionSection;