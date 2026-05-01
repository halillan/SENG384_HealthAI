import { motion, useScroll, useTransform } from 'framer-motion';
import AuthGateway from './AuthGateway';

export default function Landing() {
  const { scrollY } = useScroll();
  
  // Transform hero content as the user scrolls downwards
  const heroScale = useTransform(scrollY, [0, 800], [1, 3]); 
  const textBlur = useTransform(scrollY, [0, 400], ["blur(0px)", "blur(20px)"]);
  const textOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const bgScale = useTransform(scrollY, [0, 1000], [1, 1.2]);

  return (
    <div className="relative w-full bg-slate-950 overflow-x-hidden">
      
      {/* Global Background Layer - Locked for 100% consistency */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.img 
          src="/hero-bg.png" 
          alt="Global Background" 
          style={{ scale: bgScale }}
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-slate-950/60" />
      </div>

      {/* Hero Content Section */}
      <div className="h-screen w-full flex flex-col items-center justify-center sticky top-0 z-10 overflow-hidden">
        <motion.div 
          style={{ scale: heroScale, filter: textBlur, opacity: textOpacity }}
          className="text-center px-6"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.1, ease: "easeOut" }}
            className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-white tracking-tight mb-6 drop-shadow-2xl"
          >
            HealthAI
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            className="text-xl sm:text-2xl text-blue-100 font-medium tracking-wide drop-shadow-md max-w-2xl mx-auto"
          >
            Where Healthcare Innovation Meets Engineering Excellence.
          </motion.p>
        </motion.div>
      </div>

      {/* 
        The Auth Component Section 
        Centered and animated to appear on scroll
      */}
      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 w-full bg-transparent flex justify-center items-center min-h-screen"
      >
        <AuthGateway />
      </motion.div>
      
    </div>
  );
}
