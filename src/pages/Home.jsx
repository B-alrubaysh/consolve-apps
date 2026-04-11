import { Link } from "react-router-dom";
import { ArrowRight, Shield, Brain, Lock, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection from "../components/AnimatedSection";
import HomeAssessment from "../components/HomeAssessment";
import HeroStatement from "../components/HeroStatement";
import ServiceCatalogue from "../components/ServiceCatalogue";
import { useLanguage } from "../lib/useLanguage";
import t from "../lib/translations";

export default function Home() {
  const { lang, dir } = useLanguage();
  const tx = t[lang];

  const WHY_ITEMS = [
  { icon: Brain, title: tx.why_1_title, desc: tx.why_1_desc },
  { icon: BarChart3, title: tx.why_2_title, desc: tx.why_2_desc },
  { icon: Lock, title: tx.why_3_title, desc: tx.why_3_desc },
  { icon: Shield, title: tx.why_4_title, desc: tx.why_4_desc }];


  const STEPS = [
  { num: tx.how_1_num, title: tx.how_1_title, desc: tx.how_1_desc },
  { num: tx.how_2_num, title: tx.how_2_title, desc: tx.how_2_desc },
  { num: tx.how_3_num, title: tx.how_3_title, desc: tx.how_3_desc },
  { num: tx.how_4_num, title: tx.how_4_title, desc: tx.how_4_desc }];


  return (
    <div dir={dir}>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden -mt-20">
        {/* Animated gradient background image */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}>
          
          <motion.img
            src="https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/df2296388_Cover1.png"
            alt="Hero background"
            className="w-full h-full object-cover"
            animate={{
              scale: [1, 1.04, 1.02, 1.05, 1],
              x: [0, 8, -6, 4, 0],
              y: [0, -6, 4, -3, 0]
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut"
            }} />
          
          <div className="bg-secondary/30 rounded absolute inset-0" />
        </motion.div>
        {/* Large logo watermark at bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <img
            src="https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/4c25434d1_Consolve_identity_compressed_HQai.png"
            alt="Consolve"
            className="w-full object-contain" />
          
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
          <div className="w-px h-16 bg-gradient-to-b from-transparent to-white/30" />
        </div>
      </section>

      {/* Hero Statement + Metrics */}
      <HeroStatement />

      {/* Service Catalogue */}
      <ServiceCatalogue />

      {/* Embedded Assessment */}
      <HomeAssessment />

      {/* Why Consolve */}
      
























      

      {/* How It Works */}
      




























      

      {/* CTA */}
      















      
    </div>);

}