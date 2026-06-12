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

/* ─── Category Types & Configurations ───────────────────────────── */
interface CategoryConfig {
  id: string;
  index: string;
  tag: string;
  gradient: string;
  shimmer: string;
  accent: string;
  accentMuted: string;
  description: string;
  tag2: string;
  beginnerTag: string;
  displayName: string;
  fallbackImage: string;
}

const CATEGORY_MAP: Record<string, Omit<CategoryConfig, 'id' | 'index' | 'displayName'>> = {
  Bridal: {
    tag: 'Signature Edit',
    gradient: 'radial-gradient(ellipse at 30% 20%, #3d2a0a 0%, #1a0e02 40%, #0a0704 100%)',
    shimmer: 'rgba(212,175,55,0.15)',
    accent: '#D4AF37',
    accentMuted: 'rgba(212,175,55,0.25)',
    description: 'Timeless luxury lehengas & ceremonial gowns crafted for your wedding day.',
    tag2: 'New Season',
    beginnerTag: 'For: The Wedding Ceremony',
    fallbackImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
  },
  Engagement: {
    tag: 'Exclusive Edit',
    gradient: 'radial-gradient(ellipse at 70% 20%, #1e0a2e 0%, #0d0515 40%, #06030e 100%)',
    shimmer: 'rgba(168,85,247,0.15)',
    accent: '#C084FC',
    accentMuted: 'rgba(192,132,252,0.25)',
    description: 'Elevated, modern silhouettes that frame the beginning of your forever story.',
    tag2: 'Bestseller',
    beginnerTag: 'For: Roka & Ring Ceremony',
    fallbackImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80',
  },
  Reception: {
    tag: 'Couture Glamour',
    gradient: 'radial-gradient(ellipse at 50% 10%, #2d0a1a 0%, #120308 40%, #080104 100%)',
    shimmer: 'rgba(244,114,182,0.15)',
    accent: '#F472B6',
    accentMuted: 'rgba(244,114,182,0.25)',
    description: 'Glamorous after-dark designs for a reception the world will not forget.',
    tag2: 'Limited Edit',
    beginnerTag: 'For: Grand Wedding Reception',
    fallbackImage: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80',
  },
  'Party Wear': {
    tag: 'Modern Festive',
    gradient: 'radial-gradient(ellipse at 30% 70%, #0c2b2a 0%, #051413 40%, #020707 100%)',
    shimmer: 'rgba(20,184,166,0.15)',
    accent: '#2DD4BF',
    accentMuted: 'rgba(45,212,191,0.25)',
    description: 'Chic silhouettes and festive patterns designed for guest of honor style.',
    tag2: 'Trending',
    beginnerTag: 'For: Bridesmaids & Celebrations',
    fallbackImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
  },
  Lehenga: {
    tag: 'Heritage Craft',
    gradient: 'radial-gradient(ellipse at 50% 50%, #3b1010 0%, #170505 40%, #0b0202 100%)',
    shimmer: 'rgba(239,68,68,0.15)',
    accent: '#F87171',
    accentMuted: 'rgba(248,113,113,0.25)',
    description: 'Heavy pleated heritage lehengas with delicate hand-embroidery.',
    tag2: 'Handcrafted',
    beginnerTag: 'For: Traditional Festivities',
    fallbackImage: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=600&q=80',
  },
  Saree: {
    tag: 'Timeless Drapes',
    gradient: 'radial-gradient(ellipse at 80% 80%, #2e280a 0%, #131003 40%, #090802 100%)',
    shimmer: 'rgba(234,179,8,0.15)',
    accent: '#FACC15',
    accentMuted: 'rgba(250,204,21,0.25)',
    description: 'Exquisite silk and designer sarees adorned with handcrafted borders.',
    tag2: 'Classic Edit',
    beginnerTag: 'For: Elegant Heritage Drapes',
    fallbackImage: 'https://images.unsplash.com/photo-1610030470298-40b8eaecc257?auto=format&fit=crop&w=600&q=80',
  }
};

function getCategoryConfig(catName: string, index: number, productImage?: string): CategoryConfig {
  const norm = catName.trim();
  const config = CATEGORY_MAP[norm];

  const gradients = [
    'radial-gradient(ellipse at 30% 20%, #3d2a0a 0%, #1a0e02 40%, #0a0704 100%)',
    'radial-gradient(ellipse at 70% 20%, #1e0a2e 0%, #0d0515 40%, #06030e 100%)',
    'radial-gradient(ellipse at 50% 10%, #2d0a1a 0%, #120308 40%, #080104 100%)',
    'radial-gradient(ellipse at 30% 70%, #0c2b2a 0%, #051413 40%, #020707 100%)',
    'radial-gradient(ellipse at 50% 50%, #3b1010 0%, #170505 40%, #0b0202 100%)',
    'radial-gradient(ellipse at 80% 80%, #2e280a 0%, #131003 40%, #090802 100%)',
  ];
  const accColors = ['#D4AF37', '#C084FC', '#F472B6', '#2DD4BF', '#F87171', '#FACC15'];
  const shimmerColors = [
    'rgba(212,175,55,0.15)',
    'rgba(168,85,247,0.15)',
    'rgba(244,114,182,0.15)',
    'rgba(20,184,166,0.15)',
    'rgba(239,68,68,0.15)',
    'rgba(234,179,8,0.15)'
  ];

  const idx = index % gradients.length;
  const numStr = String(index + 1).padStart(2, '0');

  const defaultFallbacks = [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=600&q=80',
  ];

  return {
    id: catName,
    index: numStr,
    tag: config?.tag || 'Premium Edit',
    gradient: config?.gradient || gradients[idx],
    shimmer: config?.shimmer || shimmerColors[idx],
    accent: config?.accent || accColors[idx],
    accentMuted: config?.accentMuted || `rgba(212, 175, 55, 0.18)`,
    description: config?.description || `Beautiful custom handcrafted ${norm.toLowerCase()} designs for your memorable event.`,
    tag2: config?.tag2 || 'New Arrival',
    beginnerTag: config?.beginnerTag || `For: Custom ${norm}`,
    displayName: norm,
    fallbackImage: productImage || config?.fallbackImage || defaultFallbacks[index % defaultFallbacks.length]
  };
}

const STATS_LABELS = {
  DESIGNS: 'Designs',
  YEARS: 'Years of craft',
  HAPPY: 'Happy brides'
};

const MARQUEE_TEXT = Array(8)
  .fill(null)
  .flatMap(() => ['BRIDAL', '✦', 'ENGAGEMENT', '✦', 'RECEPTION', '✦', 'COUTURE', '✦'])
  .join('  ');

/* ─── Magnetic tilt card ──────────────────────────────────────────── */
function TiltCard({
  col,
  index,
}: {
  col: CategoryConfig & { pieces: string };
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
            borderRadius: 24,
            background: col.gradient,
            border: `1px solid ${col.accentMuted}`,
            minHeight: 520,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '1.75rem',
            transformStyle: 'preserve-3d',
            transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = col.accent;
            e.currentTarget.style.boxShadow = `0 10px 30px -10px ${col.accent}33`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = col.accentMuted;
            e.currentTarget.style.boxShadow = 'none';
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
              borderRadius: 24,
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

          {/* TOP: index + tag badge */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative',
              zIndex: 2,
              marginBottom: '1rem',
            }}
          >
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 12,
                color: col.accent,
                letterSpacing: '0.2em',
                fontWeight: 500,
              }}
            >
              {col.index}
            </span>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 9,
                fontWeight: 500,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                background: `${col.accent}20`,
                border: `1px solid ${col.accent}40`,
                padding: '4px 12px',
                borderRadius: 99,
              }}
            >
              {col.tag}
            </span>
          </div>

          {/* DYNAMIC IMAGE: high-fashion category display */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: 200,
              borderRadius: 16,
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.06)',
              marginBottom: '1.25rem',
              zIndex: 2,
            }}
          >
            <img
              src={col.fallbackImage}
              alt={col.id}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
              }}
              className="group-hover:scale-110"
            />
            {/* Elegant overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
              }}
            />

            {/* Piece count badge overlaid on image */}
            <span
              style={{
                position: 'absolute',
                bottom: '0.75rem',
                right: '0.75rem',
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                color: '#FFFFFF',
                background: 'rgba(0,0,0,0.65)',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255,255,255,0.15)',
                padding: '3px 8px',
                borderRadius: 6,
              }}
            >
              {col.pieces}
            </span>
          </div>

          {/* BOTTOM: content block */}
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
            <div>
              {/* Category Name */}
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '2.1rem',
                  fontWeight: 300,
                  color: '#FFFFFF',
                  letterSpacing: '0.02em',
                  lineHeight: 1.1,
                  marginBottom: '0.35rem',
                }}
              >
                {col.displayName}
              </h3>

              {/* Beginner-friendly Occasion Pill */}
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 10,
                  fontWeight: 500,
                  color: col.accent,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: col.accent, display: 'inline-block' }} />
                <span>{col.beginnerTag}</span>
              </div>

              {/* Description */}
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12.5,
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.45)',
                  lineHeight: 1.6,
                  marginBottom: '1.25rem',
                }}
              >
                {col.description}
              </p>
            </div>

            {/* Footer row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                paddingTop: '1rem',
                marginTop: 'auto',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 10,
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

              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 9,
                  color: 'rgba(255,255,255,0.3)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {col.tag2}
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

  // Calculate real counts per category dynamically
  const counts = useMemo(() => {
    const total = products.length;
    const result: Record<string, number> = { Total: total };
    products.forEach((p: any) => {
      if (p.category) {
        result[p.category] = (result[p.category] || 0) + 1;
      }
    });
    return result;
  }, [products]);

  // Merge categories and products dynamically
  const dynamicCollections = useMemo(() => {
    // 1. Get unique categories from products
    const dbCategories = Array.from(new Set(products.map((p: any) => p.category))).filter(Boolean) as string[];

    // 2. Fall back to standard set if empty
    const finalCategories = dbCategories.length > 0
      ? dbCategories
      : ['Bridal', 'Engagement', 'Reception', 'Party Wear', 'Lehenga', 'Saree'];

    return finalCategories.map((cat, idx) => {
      // Find the first product in this category with an image
      const match = products.find((p: any) => p.category === cat && p.image_url);
      const categoryProductsCount = counts[cat] || 0;

      const config = getCategoryConfig(cat, idx, match?.image_url);

      return {
        ...config,
        pieces: `${categoryProductsCount} Pieces`
      };
    });
  }, [products, counts]);

  const dynamicStats = useMemo(() => [
    { value: `${counts.Total || 0}+`, label: STATS_LABELS.DESIGNS },
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
                maxWidth: 420,
                margin: '0 auto',
                lineHeight: 1.7,
              }}
            >
              Explore our collection of custom tailored couture edits. Beautifully crafted for every luxury celebration.
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
              marginBottom: '5rem',
            }}
          >
            {dynamicCollections.map((col, i) => (
              <TiltCard key={col.id} col={col} index={i} />
            ))}
          </div>
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