import { motion } from 'framer-motion';
import heroImg from '@/assets/hero-wedding.jpg';

export default function HeroSection() {
  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden grain-overlay">
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="absolute inset-0"
      >
        <img
          src={heroImg}
          alt="Luxury wedding venue"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background z-[2]" />

      <div className="relative z-[3] flex flex-col items-center justify-center h-full text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-primary text-xs tracking-[0.4em] uppercase mb-6"
        >
          Wedding Planners
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="font-heading text-4xl md:text-6xl lg:text-7xl max-w-4xl leading-tight"
        >
          Crafting Unforgettable{' '}
          <span className="text-gradient">Luxury</span> Experiences
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-6 text-muted-foreground max-w-xl text-sm md:text-base leading-relaxed"
        >
          Bespoke weddings & premium events tailored to perfection
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="mt-10 flex flex-wrap gap-4 justify-center"
        >
          <a
            href="#services"
            className="px-8 py-3.5 bg-primary text-primary-foreground text-xs tracking-widest uppercase hover:brightness-110 transition-all duration-300"
          >
            Explore Services
          </a>
          <a
            href="#contact"
            className="px-8 py-3.5 border border-foreground/30 text-foreground text-xs tracking-widest uppercase hover:border-primary hover:text-primary transition-all duration-300"
          >
            Book Consultation
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[3] flex flex-col items-center gap-2"
      >
        <span className="text-muted-foreground text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-primary to-transparent animate-scroll-hint" />
      </motion.div>
    </section>
  );
}
