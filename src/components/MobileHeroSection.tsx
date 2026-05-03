'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Gem } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

/* ─────────────────────────────────────────────────────────────
   CONSTANTS & HELPERS
───────────────────────────────────────────────────────────── */

const WHATSAPP_URL = 'https://wa.me/1234567890'; // Replace with your actual WhatsApp link

// Rotating hero images
const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&q=85&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=85&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=85&auto=format&fit=crop',
];

const MARQUEE_ITEMS = [
  'Royal Weddings', '✦', 'Handcrafted Silk', '✦',
  'Kerala Couture', '✦', 'Bridal Atelier', '✦',
  'Bespoke Draping', '✦', '500+ Brides', '✦',
];

const ease = [0.16, 1, 0.3, 1] as const;

/* ─────────────────────────────────────────────────────────────
   LETTER-BY-LETTER TITLE ANIMATION
───────────────────────────────────────────────────────────── */
function SplitWord({ word, delay = 0, className = '' }: { word: string; delay?: number; className?: string }) {
  return (
    <span className={`inline-flex overflow-hidden ${className}`} aria-label={word}>
      {word.split('').map((char, i) => (
        <motion.span
          key={i}
          aria-hidden
          initial={{ y: '110%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          transition={{ duration: 0.75, delay: delay + i * 0.045, ease }}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   FLOATING GOLD PARTICLE
───────────────────────────────────────────────────────────── */
function Particle({ x, delay, size }: { x: number; delay: number; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: `${x}%`, bottom: '5%', width: size, height: size, background: '#D4AF37' }}
      animate={{
        y: [0, -(120 + Math.random() * 100)],
        opacity: [0, 0.7, 0.4, 0],
        x: [0, (Math.random() - 0.5) * 30],
        scale: [1, 0.6, 0.3],
      }}
      transition={{ duration: 4 + Math.random() * 3, delay, repeat: Infinity, ease: 'easeOut' }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   MARQUEE STRIP
───────────────────────────────────────────────────────────── */
function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="relative overflow-hidden w-full">
      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />
      <motion.div
        className="flex gap-6 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className="text-[8px] font-bold uppercase tracking-[0.35em] text-white/25 flex-shrink-0"
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SHIMMER BUTTON
───────────────────────────────────────────────────────────── */
function ShimmerButton({ children, className = '', ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { children: React.ReactNode }) {
  return (
    <a
      className={`relative overflow-hidden group ${className}`}
      {...props}
    >
      {/* Shimmer sweep */}
      <motion.div
        className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none"
        initial={{ x: '-150%' }}
        animate={{ x: '250%' }}
        transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
      />
      {children}
    </a>
  );
}

/* ─────────────────────────────────────────────────────────────
   IMAGE CAROUSEL with cross-fade & ken-burns
───────────────────────────────────────────────────────────── */
function HeroBg() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(p => (p + 1) % HERO_IMAGES.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence>
        <motion.img
          key={idx}
          src={HERO_IMAGES[idx]}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover object-top"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1.0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: 'easeInOut' }}
          style={{ willChange: 'opacity, transform' }}
        />
      </AnimatePresence>

      {/* Layered overlays for cinematic depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/70 via-[#050505]/20 to-[#050505]/95" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(212,175,55,0.06) 0%, transparent 70%)' }} />

      {/* Film grain */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none mix-blend-overlay">
        <filter id="fg">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#fg)" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   DECORATIVE CORNER FLOURISH
───────────────────────────────────────────────────────────── */
function CornerFlouish({ side }: { side: 'left' | 'right' }) {
  const flip = side === 'right' ? 'scale(-1,1)' : undefined;
  return (
    <motion.svg
      width="52" height="52" viewBox="0 0 52 52"
      fill="none" className="opacity-25"
      style={{ transform: flip }}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 0.25, scale: 1 }}
      transition={{ duration: 1.2, delay: 1.4, ease }}
    >
      <path d="M2 50 L2 2 L50 2" stroke="#D4AF37" strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d="M2 2 Q10 2 10 10" stroke="#D4AF37" strokeWidth="0.5" fill="none" opacity="0.5" />
      <circle cx="2" cy="2" r="2.5" fill="#D4AF37" fillOpacity="0.6" />
    </motion.svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   COUNT-UP COMPONENT
───────────────────────────────────────────────────────────── */
function CountUp({ target, delay }: { target: string; delay: number }) {
  const num = parseInt(target);
  const suffix = target.replace(/[0-9]/g, '');
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      started.current = true;
      let start = 0;
      const steps = 30;
      const step = num / steps;
      const interval = setInterval(() => {
        start += step;
        if (start >= num) { setDisplay(num); clearInterval(interval); }
        else setDisplay(Math.floor(start));
      }, 40);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [num, delay]);

  return (
    <span
      className="text-[22px] font-serif font-medium text-white/90 leading-none"
      style={{
        background: 'linear-gradient(135deg, #C9A43B 0%, #F0D875 50%, #B8820A 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      {display}{suffix}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
export default function MobileHeroSection() {
  const [showTitle, setShowTitle] = useState(true);

  useEffect(() => {
    // Optional: Hide the main title after 5 seconds to show the background better. 
    // You can remove this useEffect if you want the title to stay permanently.
    const timer = setTimeout(() => {
      setShowTitle(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const particles = Array.from({ length: 12 }, (_, i) => ({
    x: 5 + i * 8,
    delay: i * 0.45,
    size: i % 3 === 0 ? 2 : 1,
  }));

  return (
    <section
      className="relative min-h-screen w-full flex flex-col overflow-x-hidden bg-[#050505]"
      style={{ paddingTop: 'env(safe-area-inset-top)', maxWidth: '100vw' }}
    >
      {/* ── Background image carousel ── */}
      <HeroBg />

      {/* ── Floating particles ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {particles.map((p, i) => <Particle key={i} {...p} />)}
      </div>

      {/* ── Main content ── */}
      <div className="relative z-20 flex flex-col items-center text-center px-6 pt-14 pb-6 min-h-screen">

        {/* ── Top: corner decorations + eyebrow ── */}
        <div className="w-full flex items-start justify-between mb-6">
          <CornerFlouish side="left" />
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease }}
          >
            <span className="inline-flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.4em] text-[#D4AF37]/70 border border-[#D4AF37]/20 px-4 py-1.5 rounded-full"
              style={{ background: 'rgba(212,175,55,0.04)', backdropFilter: 'blur(8px)' }}>
              <Gem className="w-2 h-2 fill-[#D4AF37]/50 text-[#D4AF37]/50" />
              Luxury Bridal Atelier
              <Gem className="w-2 h-2 fill-[#D4AF37]/50 text-[#D4AF37]/50" />
            </span>
          </motion.div>
          <CornerFlouish side="right" />
        </div>

        {/* ── Spacer pushes headline to visual center ── */}
        <div className="flex-1 flex flex-col items-center justify-center w-full">

          {/* ── Brand headline ── */}
          <AnimatePresence>
            {showTitle && (
              <motion.div 
                className="mb-4 w-full overflow-hidden"
                initial={{ opacity: 1, height: 'auto', marginBottom: '1rem' }}
                exit={{ opacity: 0, height: 'auto', marginBottom: '1rem' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* YAGA */}
                <div className="leading-[0.85] tracking-[-0.02em] font-serif" style={{ fontSize: 'clamp(88px, 26vw, 130px)' }}>
                  <SplitWord
                    word="Yaga"
                    delay={0.2}
                    className="text-white font-medium block"
                  />
                </div>

                {/* DESIGNS — gold shimmer gradient */}
                <div className="leading-[0.85] tracking-[-0.02em] font-serif" style={{ fontSize: 'clamp(88px, 26vw, 130px)' }}>
                  <SplitWord
                    word="Designs"
                    delay={0.48}
                    className="italic block gold-text"
                  />
                </div>

                {/* Gold gradient mask on "Designs" text */}
                <style>{`
                  .gold-text {
                    background: linear-gradient(135deg, #C9A84C 0%, #F5E6A3 40%, #D4AF37 60%, #A8782A 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                  }
                `}</style>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ornamental divider */}
          <motion.div
            className="flex items-center gap-3 mb-7"
            initial={{ opacity: 0, scaleX: 0.3 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1.1, delay: 0.9, ease }}
          >
            <div className="h-px flex-1 max-w-[60px]" style={{ background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.5))' }} />
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z" fill="#D4AF37" fillOpacity="0.6" />
            </svg>
            <div className="h-px flex-1 max-w-[60px]" style={{ background: 'linear-gradient(to left, transparent, rgba(212,175,55,0.5))' }} />
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.0, ease }}
            className="text-white/40 text-[13px] leading-[1.9] tracking-wide max-w-[240px] mx-auto mb-10 font-sans"
            style={{ fontWeight: 300 }}
          >
            Where dreams are woven into silk — handcrafted couture for your most&nbsp;cherished&nbsp;moments.
          </motion.p>

          {/* ── CTA Buttons ── */}
          <motion.div
            className="flex flex-col gap-3 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.15, ease }}
          >
            {/* Primary — shimmer gold */}
            <ShimmerButton
              href="/collections"
              className="w-full py-[14px] rounded-full text-[10px] font-bold uppercase tracking-[0.35em] text-[#1a1200] flex items-center justify-center"
              style={{ background: 'linear-gradient(120deg, #C9A43B 0%, #F0D875 45%, #B8820A 100%)' }}
            >
              View Collection
            </ShimmerButton>

            {/* Secondary — outlined */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-[14px] rounded-full text-[10px] font-bold uppercase tracking-[0.35em] text-[#D4AF37] flex items-center justify-center border border-[#D4AF37]/25 transition-colors duration-300 active:scale-[0.97]"
              style={{ background: 'rgba(212,175,55,0.05)', backdropFilter: 'blur(8px)' }}
            >
              Book Consultation
            </a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="grid grid-cols-3 gap-0 mt-10 w-full border border-white/[0.06] rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.3, ease }}
            style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(12px)' }}
          >
            {[
              { num: '500+', label: 'Brides' },
              { num: '12+', label: 'Years' },
              { num: '100%', label: 'Handmade' },
            ].map((s, i) => (
              <div
                key={i}
                className={`flex flex-col items-center py-4 px-2 ${i < 2 ? 'border-r border-white/[0.06]' : ''}`}
              >
                <CountUp target={s.num} delay={1.4 + i * 0.12} />
                <span className="text-[8px] uppercase tracking-[0.25em] text-white/25 mt-0.5 font-sans">
                  {s.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Bottom marquee ── */}
        <motion.div
          className="w-full py-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
        >
          <Marquee />
        </motion.div>

        {/* ── Scroll indicator ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="flex flex-col items-center gap-2 pb-4"
        >
          <div className="w-px h-8 relative overflow-hidden" style={{ background: 'rgba(212,175,55,0.1)' }}>
            <motion.div
              className="absolute top-0 left-0 right-0 h-1/2"
              style={{ background: 'linear-gradient(to bottom, transparent, #D4AF37)' }}
              animate={{ y: ['-100%', '200%'] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          <span className="text-[7px] text-white/20 uppercase tracking-[0.5em]">Scroll</span>
        </motion.div>
      </div>
    </section>
  );
}