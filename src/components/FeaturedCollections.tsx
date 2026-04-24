'use client';

import { getProducts } from '@/lib/appwrite';
import { useQuery } from '@tanstack/react-query';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { MouseEvent, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';

/* ─── Google Fonts injected once ─────────────────────────────────── */
const FontInjector = () => {
  if (typeof document !== 'undefined' && !document.getElementById('luxury-fonts')) {
    const link = document.createElement('link');
    link.id = 'luxury-fonts';
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@300&display=swap';
    document.head.appendChild(link);
  }
  return null;
};

/* ─── Data ────────────────────────────────────────────────────────── */
const COLLECTIONS = [
  {
    id: 'Bridal',
    index: '01',
    tag: 'Signature Edit',
    pieces: '124 Pieces',
    gradient: 'radial-gradient(ellipse at 30% 20%, #3d2a0a 0%, #1a0e02 40%, #0a0704 100%)',
    shimmer: 'rgba(212,175,55,0.15)',
    accent: '#D4AF37',
    accentMuted: 'rgba(212,175,55,0.25)',
    description: 'Timeless lehengas & ceremonial gowns crafted for your most sacred chapter.',
    tag2: 'New Season',
  },
  {
    id: 'Engagement',
    index: '02',
    tag: 'Exclusive',
    pieces: '89 Pieces',
    gradient: 'radial-gradient(ellipse at 70% 20%, #1e0a2e 0%, #0d0515 40%, #06030e 100%)',
    shimmer: 'rgba(168,85,247,0.15)',
    accent: '#C084FC',
    accentMuted: 'rgba(192,132,252,0.25)',
    description: 'Elevated silhouettes that frame the beginning of your forever story.',
    tag2: 'Bestseller',
  },
  {
    id: 'Reception',
    index: '03',
    tag: 'Couture',
    pieces: '67 Pieces',
    gradient: 'radial-gradient(ellipse at 50% 10%, #2d0a1a 0%, #120308 40%, #080104 100%)',
    shimmer: 'rgba(244,114,182,0.15)',
    accent: '#F472B6',
    accentMuted: 'rgba(244,114,182,0.25)',
    description: 'Glamorous after-dark designs for an evening the world will not forget.',
    tag2: 'Limited',
  },
];

const STATS_LABELS = {
  DESIGNS: 'Designs',
  YEARS: 'Years of craft',
  HAPPY: 'Happy brides'
};


/* ─── Marquee ─────────────────────────────────────────────────────── */
const MARQUEE_TEXT = Array(8)
  .fill(null)
  .flatMap(() => ['BRIDAL', '✦', 'ENGAGEMENT', '✦', 'RECEPTION', '✦', 'COUTURE', '✦'])
  .join('  ');

/* ─── Magnetic tilt card ──────────────────────────────────────────── */
function TiltCard({
  col,
  index,
}: {
  col: (typeof COLLECTIONS)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 120, damping: 20 });
  const springY = useSpring(y, { stiffness: 120, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-6, 6]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, delay: index * 0.18, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}>
        <Link
          to={`/collections?category=${col.id}`}
          className="group block relative overflow-hidden"
          style={{
            borderRadius: 20,
            background: col.gradient,
            border: `1px solid ${col.accentMuted}`,
            minHeight: 460,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '2rem',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Grain texture overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
              backgroundSize: '200px 200px',
              pointerEvents: 'none',
              borderRadius: 20,
              zIndex: 0,
            }}
          />

          {/* Shimmer sweep on hover */}
          <motion.div
            initial={{ x: '-110%', skewX: -15 }}
            whileHover={{ x: '110%' }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(105deg, transparent 40%, ${col.shimmer} 50%, transparent 60%)`,
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />

          {/* TOP: index + tag */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              position: 'relative',
              zIndex: 2,
            }}
          >
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                color: col.accent,
                letterSpacing: '0.2em',
                opacity: 0.8,
              }}
            >
              {col.index}
            </span>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.45)',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '4px 10px',
                borderRadius: 99,
              }}
            >
              {col.tag}
            </span>
          </div>

          {/* CENTER: large number (decorative) */}
          <div
            style={{
              position: 'absolute',
              right: '-0.5rem',
              top: '50%',
              transform: 'translateY(-50%) rotate(90deg)',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 120,
              fontWeight: 300,
              color: col.accentMuted,
              letterSpacing: '-0.05em',
              lineHeight: 1,
              pointerEvents: 'none',
              zIndex: 0,
              userSelect: 'none',
            }}
          >
            {col.index}
          </div>

          {/* BOTTOM: content block */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            {/* Thin accent line */}
            <motion.div
              initial={{ width: 32 }}
              whileHover={{ width: 64 }}
              transition={{ duration: 0.4 }}
              style={{
                height: 1,
                background: `linear-gradient(90deg, ${col.accent}, transparent)`,
                marginBottom: '1.25rem',
              }}
            />

            <h3
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                fontWeight: 300,
                color: '#FFFFFF',
                letterSpacing: '0.02em',
                lineHeight: 1.1,
                marginBottom: '0.75rem',
              }}
            >
              {col.id}
            </h3>

            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 300,
                color: 'rgba(255,255,255,0.45)',
                lineHeight: 1.65,
                marginBottom: '1.5rem',
                maxWidth: 260,
              }}
            >
              {col.description}
            </p>

            {/* Footer row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: col.accent,
                }}
              >
                <span>Explore</span>
                <motion.svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: 'inline-block' }}
                >
                  <path
                    d="M1 7h12M8 2l5 5-5 5"
                    stroke={col.accent}
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              </div>

              {/* Piece count badge */}
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.35)',
                  letterSpacing: '0.12em',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '3px 8px',
                  borderRadius: 4,
                }}
              >
                {col.pieces}
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main component ──────────────────────────────────────────────── */
export default function FeaturedCollections() {
  const { data: products = [] } = useQuery({
    queryKey: ['products-all'],
    queryFn: () => getProducts(),
  });

  // Calculate real counts per category
  const counts = useMemo(() => {
    return {
      Bridal: products.filter(p => p.category === 'Bridal').length,
      Engagement: products.filter(p => p.category === 'Engagement').length,
      Reception: products.filter(p => p.category === 'Reception' || p.category === 'Party Wear').length,
      Total: products.length
    };
  }, [products]);

  // Merge counts into COLLECTIONS data
  const dynamicCollections = useMemo(() => {
    return COLLECTIONS.map(col => ({
      ...col,
      pieces: `${counts[col.id as keyof typeof counts] || 0} Pieces`
    }));
  }, [counts]);

  const dynamicStats = useMemo(() => [
    { value: `${counts.Total}+`, label: STATS_LABELS.DESIGNS },
    { value: '18', label: STATS_LABELS.YEARS },
    { value: '99%', label: STATS_LABELS.HAPPY },
  ], [counts.Total]);

  return (
    <>

      <FontInjector />

      <section
        style={{
          background: '#060606',
          padding: '7rem 0 0',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Background radial glow */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 600,
            height: 300,
            background:
              'radial-gradient(ellipse, rgba(212,175,55,0.04) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div
          className="container"
          style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}
        >
          {/* ── Section Header ────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{ textAlign: 'center', marginBottom: '5rem' }}
          >
            {/* Ornament */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                marginBottom: '1.5rem',
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 1,
                  background: 'linear-gradient(90deg, transparent, #D4AF37)',
                }}
              />
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  letterSpacing: '0.35em',
                  textTransform: 'uppercase',
                  color: '#D4AF37',
                  opacity: 0.75,
                }}
              >
                Collections
              </span>
              <div
                style={{
                  width: 40,
                  height: 1,
                  background: 'linear-gradient(90deg, #D4AF37, transparent)',
                }}
              />
            </div>

            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
                fontWeight: 300,
                color: '#FFFFFF',
                letterSpacing: '-0.01em',
                lineHeight: 1.05,
                marginBottom: '1.25rem',
              }}
            >
              Find Your{' '}
              <em style={{ color: '#D4AF37', fontStyle: 'italic' }}>Style</em>
            </h2>

            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 300,
                color: 'rgba(255,255,255,0.4)',
                letterSpacing: '0.05em',
                maxWidth: 380,
                margin: '0 auto',
                lineHeight: 1.7,
              }}
            >
              Three curated edits. One unforgettable celebration.
            </p>
          </motion.div>

          {/* ── Stats row ─────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 'clamp(2rem, 6vw, 5rem)',
              marginBottom: '4.5rem',
              paddingBottom: '3rem',
              borderBottom: '1px solid rgba(212,175,55,0.1)',
            }}
          >
            {dynamicStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1 }}
                style={{ textAlign: 'center' }}
              >
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                    fontWeight: 400,
                    color: '#D4AF37',
                    letterSpacing: '-0.01em',
                    lineHeight: 1,
                    marginBottom: 6,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 11,
                    fontWeight: 300,
                    color: 'rgba(255,255,255,0.35)',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                  }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Cards Grid ────────────────────────────────────────── */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.25rem',
              marginBottom: '5rem',
            }}
          >
            {dynamicCollections.map((col, i) => (
              <TiltCard key={col.id} col={col} index={i} />
            ))}
          </div>

          {/* ── View All CTA ──────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            {/* <Link
              to="/collections"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.55)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '14px 36px',
                borderRadius: 4,
                textDecoration: 'none',
                transition: 'all 0.35s ease',
                background: 'transparent',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.color = '#D4AF37';
                (e.currentTarget as HTMLElement).style.borderColor =
                  'rgba(212,175,55,0.5)';
                (e.currentTarget as HTMLElement).style.background =
                  'rgba(212,175,55,0.05)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.color =
                  'rgba(255,255,255,0.55)';
                (e.currentTarget as HTMLElement).style.borderColor =
                  'rgba(255,255,255,0.1)';
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            > */}
            {/* View All Collections
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 7h12M8 2l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg> */}
            {/* </Link> */}
          </motion.div>
        </div>

        {/* ── Marquee strip ─────────────────────────────────────────── */}
        <div
          style={{
            borderTop: '1px solid rgba(212,175,55,0.1)',
            borderBottom: '1px solid rgba(212,175,55,0.1)',
            overflow: 'hidden',
            padding: '14px 0',
            background: 'rgba(212,175,55,0.02)',
          }}
        >
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
            style={{
              display: 'flex',
              whiteSpace: 'nowrap',
              width: 'max-content',
            }}
          >
            {[...Array(2)].map((_, j) => (
              <span
                key={j}
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 12,
                  fontWeight: 300,
                  letterSpacing: '0.45em',
                  textTransform: 'uppercase',
                  color: 'rgba(212,175,55,0.35)',
                  paddingRight: '3rem',
                }}
              >
                {MARQUEE_TEXT}
              </span>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}