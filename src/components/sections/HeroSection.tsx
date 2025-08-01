import { motion } from "framer-motion";
import { Suspense, lazy } from "react";

// Lazy load Spline component
const Spline = lazy(() => import('@splinetool/react-spline'));

const HeroSection = () => {
  return (
    <section id="hero" className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.1),transparent_50%)]" />
      
      <div className="container mx-auto px-4 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto mb-16"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-light tracking-tighter mb-6 bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent"
          >
            AI LLM
            <br />
            <span className="text-primary">Aggregator</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-foreground/70 font-light leading-relaxed mb-12 max-w-2xl mx-auto"
          >
            The ultimate platform that brings together all major AI models in one seamless interface. 
            Experience the future of artificial intelligence today.
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="neuro-button px-12 py-4 text-lg font-medium text-foreground rounded-2xl hover:text-primary transition-all duration-300"
          >
            Get Started
          </motion.button>
        </motion.div>

        {/* Spline 3D Model */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="relative w-full h-[600px] glass-card rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent z-10" />
          <Suspense fallback={
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-transparent rounded-3xl animate-pulse flex items-center justify-center">
              <div className="text-foreground/50 text-lg">Loading 3D Experience...</div>
            </div>
          }>
            <Spline scene="https://prod.spline.design/6Wq8RtCRzSBQnhar/scene.splinecode" />
          </Suspense>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;