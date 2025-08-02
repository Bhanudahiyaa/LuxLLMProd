import { motion } from "framer-motion";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.1),transparent_50%)]" />

      <div className="container mx-auto px-4 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto mb-14"
        >
          <div className="relative inline-block">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white mt-44 text-xs font-semibold px-2 py-1 rounded-full shadow">
              BETA
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-8xl md:text-[8rem] font-light tracking-tighter mt-48 mb-4 bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent"
            >
              LuxLLM
              <br />
              <motion.div>
                <div className=" font-italianno mt-7 tracking-tighter text-primary text-4xl md:text-7xl font-light ">
                  𝘊𝘰𝘥𝘦-𝘍𝘳𝘦𝘦 𝘈𝘨𝘦𝘯𝘵 𝘉𝘶𝘪𝘭𝘥𝘪𝘯𝘨,<div> 𝘔𝘢𝘥𝘦 𝘌𝘢𝘴𝘺</div>
                </div>
              </motion.div>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-s md:text-xl text-foreground/70 font-light leading-relaxed mb-1 max-w-3xl mx-auto"
          >
            The ultimate platform that brings together all major AI models in
            one seamless interface. Experience the future of artificial
            intelligence today.
          </motion.p>

          <div className="flex justify-center space-x-6 mt-8">
            <InteractiveHoverButton className="px-10 py-2 text-sm  text-foreground rounded-2xl">
              Get Started
            </InteractiveHoverButton>
            <RainbowButton className=" px-8 py-2 text-sm  text-foreground rounded-2xl">
              Get Unlimited Access
            </RainbowButton>
          </div>
        </motion.div>

        {/* Background Pattern */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="relative w-full h-[600px] glass-card rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent z-10" />
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-3xl flex items-center justify-center relative">
            {/* Floating AI Interface Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-20 left-20 w-32 h-32 bg-primary/30 rounded-full blur-2xl animate-pulse" />
              <div className="absolute bottom-20 right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse delay-1000" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full blur-3xl animate-pulse delay-500" />
            </div>
            <div className="text-center z-10  ">
              <img
                src="/images/interface-preview.png"
                alt="LLM Interface Preview"
                className="w-full h-auto max-w-full object-contain rounded-3xl mask-image-fade"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
