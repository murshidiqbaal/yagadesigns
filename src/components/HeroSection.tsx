import { getWhatsAppUrl } from '@/lib/constants';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  const { scrollY } = useScroll();
  const fadeOutOpacity = useTransform(scrollY, [0, 100], [1, 0]);

  const [vh, setVh] = useState(typeof window !== 'undefined' ? window.innerHeight : 1000);
  useEffect(() => {
    const handleResize = () => setVh(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fade in CTAs before the animation finishes (around 3.2vh to 3.5vh)
  const ctaOpacity = useTransform(scrollY, [vh * 3.2, vh * 3.5], [0, 1], { clamp: true });
  const ctaPointerEvents = useTransform(scrollY, (val) => (val > vh * 3.2 ? 'auto' : 'none'));

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent sticky top-0 z-50" style={{ width: '100%' }}>
      {/* ── Atmospheric Background ─────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep radial gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_60%,rgba(26,18,0,0.1)_0%,rgba(5,5,5,0.7)_70%)]" />
        {/* Outer edge vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_40%,rgba(5,5,5,0.9)_100%)]" />
        {/* Golden glow orbs */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.06, 0.1, 0.06] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(700px,100vw)] h-[min(700px,100vh)] rounded-full bg-[#D4AF37] blur-[140px]"
        />
        <div className="absolute top-16 right-16 w-[200px] h-[200px] rounded-full bg-[#D4AF37]/5 blur-[80px]" />
        <div className="absolute bottom-24 left-12 w-[150px] h-[150px] rounded-full bg-[#D4AF37]/4 blur-[60px]" />
        {/* Thin cross-hair lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]">
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#D4AF37" strokeWidth="0.5" />
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#D4AF37" strokeWidth="0.5" />
        </svg>
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-px rounded-full bg-[#D4AF37]"
            style={{
              left: `${15 + i * 6.5}%`,
              top: `${20 + (i % 4) * 20}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 4 + i * 0.4,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* ── Content ────────────────────────────────────────────── */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Eyebrow */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.45em] text-[#D4AF37] border border-[#D4AF37]/30 px-6 py-2.5 rounded-full bg-[#D4AF37]/5">
            <span className="w-4 h-px bg-[#D4AF37]" />
            Luxury Bridal Atelier
            <span className="w-4 h-px bg-[#D4AF37]" />
          </span>
        </motion.div> */}

        {/* Main Heading */}
        <motion.div style={{ opacity: fadeOutOpacity }}>
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading font-medium leading-[0.9] tracking-tight mb-8"
          >
            <span className="block text-white text-[clamp(58px,10vw,130px)]">Yaga</span>
            <span className="block text-gradient italic text-[clamp(58px,10vw,130px)]">Designs</span>
          </motion.h1>
        </motion.div>

        {/* Tagline */}
        {/* <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="text-white/45 text-lg md:text-xl max-w-lg mx-auto leading-relaxed mb-12 font-body"
        >
          Where dreams are woven into silk. Handcrafted bridal couture for your most cherished moment.
        </motion.p> */}

        {/* CTAs */}
        <motion.div
          style={{ opacity: ctaOpacity, pointerEvents: ctaPointerEvents as any }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/collections"
            id="hero-view-collection"
            className="px-10 py-4 bg-[#D4AF37] text-black text-sm font-bold uppercase tracking-widest rounded-full hover:bg-[#FFFBD5] hover:shadow-[0_0_40px_rgba(212,175,55,0.45)] transition-all duration-300"
          >
            View Collection
          </Link>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-4 border border-white/15 text-white/70 text-sm font-bold uppercase tracking-widest rounded-full hover:border-[#D4AF37]/40 hover:text-[#D4AF37] transition-all duration-300"
          >
            Enquiry Now
          </a>
        </motion.div>
      </div>

      {/* ── Scroll Indicator ───────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-white/25 uppercase tracking-[0.3em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4 text-[#D4AF37]/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
