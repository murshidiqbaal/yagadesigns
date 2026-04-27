import { getWhatsAppUrl } from '@/lib/constants';
import { motion } from 'framer-motion';
import { ChevronDown, Gem, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const STAGGER = 0.12;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] as any },
});

export default function MobileHeroSection() {
  return (
    <section
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-x-hidden bg-[#050505]"
      style={{ paddingTop: 'env(safe-area-inset-top)', maxWidth: '100vw' }}
    >
      {/* ── Atmospheric Background ──────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top golden haze */}
        <div className="absolute top-0 left-0 right-0 h-[55%] bg-[radial-gradient(ellipse_90%_70%_at_50%_0%,rgba(212,175,55,0.13)_0%,transparent_70%)]" />
        {/* Bottom vignette */}
        <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
        {/* Subtle side glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_50%_50%,transparent_50%,rgba(5,5,5,0.85)_100%)]" />

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#D4AF37]"
            style={{
              width: i % 2 === 0 ? '1px' : '2px',
              height: i % 2 === 0 ? '1px' : '2px',
              left: `${12 + i * 10}%`,
              top: `${18 + (i % 4) * 16}%`,
            }}
            animate={{ y: [0, -20, 0], opacity: [0, 0.6, 0] }}
            transition={{
              duration: 3.5 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.4,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Ornamental horizontal rule lines */}
        <div
          className="absolute left-6 right-6"
          style={{ top: '62%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.18), transparent)' }}
        />
      </div>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center px-5 w-full" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>

        {/* Eyebrow badge */}
        <motion.div {...fadeUp(STAGGER * 0)} className="mb-8 max-w-full">
          <span className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] border border-[#D4AF37]/25 px-4 py-2 rounded-full bg-[#D4AF37]/5">
            <Gem className="w-2.5 h-2.5" />
            Luxury Bridal Atelier
            <Gem className="w-2.5 h-2.5" />
          </span>
        </motion.div>

        {/* Brand name */}
        <motion.div {...fadeUp(STAGGER * 1)} className="mb-2">
          <h1
            className="font-heading font-medium leading-[0.88] tracking-tight"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            <span className="block text-white" style={{ fontSize: 'clamp(72px,22vw,110px)' }}>
              Yaga
            </span>
            <span
              className="block italic"
              style={{
                fontSize: 'clamp(72px,22vw,110px)',
                background: 'linear-gradient(135deg, #D4AF37 0%, #FFFBD5 45%, #B8860B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Designs
            </span>
          </h1>
        </motion.div>

        {/* Divider ornament */}
        <motion.div {...fadeUp(STAGGER * 2)} className="flex items-center gap-3 mb-6">
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#D4AF37]/50" />
          <Sparkles className="w-3 h-3 text-[#D4AF37]/60" />
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#D4AF37]/50" />
        </motion.div>

        {/* Tagline */}
        <motion.p
          {...fadeUp(STAGGER * 3)}
          className="text-white/45 text-[13px] leading-[1.85] tracking-wide max-w-[260px] mx-auto mb-10 font-light"
          style={{ fontFamily: '"DM Sans", sans-serif' }}
        >
          Where dreams are woven into silk — handcrafted couture for your most cherished moments.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div {...fadeUp(STAGGER * 4)} className="flex flex-col gap-3 w-full">
          <Link
            to="/collections"
            id="mobile-hero-view-collection"
            className="w-full py-4 rounded-full text-[11px] font-bold uppercase tracking-[0.3em] text-black text-center transition-all duration-300 active:scale-[0.97]"
            style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #FFFBD5 50%, #B8860B 100%)' }}
          >
            View Collection
          </Link>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            id="mobile-hero-enquiry"
            className="w-full py-4 rounded-full text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] text-center border border-[#D4AF37]/30 bg-[#D4AF37]/5 backdrop-blur-sm transition-all duration-300 active:scale-[0.97]"
          >
            Enquiry Now
          </a>
        </motion.div>

        {/* Trust chips */}
        <motion.div
          {...fadeUp(STAGGER * 5)}
          className="flex flex-wrap items-center justify-center gap-3 mt-8"
        >
          {['Royal Weddings', 'Premium Couture', 'Kerala\'s Finest'].map((label) => (
            <span
              key={label}
              className="text-[8px] uppercase tracking-[0.25em] text-white/25 font-medium"
            >
              {label}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── Scroll Indicator ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-1.5 pointer-events-none"
      >
        <span className="text-[8px] text-white/20 uppercase tracking-[0.4em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-3.5 h-3.5 text-[#D4AF37]/35" />
        </motion.div>
      </motion.div>
    </section>
  );
}
