import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/sections/HeroSection";

import TestimonialsSection from "@/components/sections/TestimonialsSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import MissionSection from "@/components/sections/MissionSection";
import PricingSection from "@/components/sections/PricingSection";
import FAQSection from "@/components/sections/FAQSection";
import Footer from "@/components/sections/Footer";

const Index = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Navigation />
      <HeroSection />

      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <MissionSection />
      <FAQSection />
      <Footer />
    </motion.div>
  );
};

export default Index;
