import { getProducts } from '@/lib/appwrite';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

/* ─── Category Configurations ───────────────────────────────────── */
interface CategoryConfig {
  id: string;
  index: string;
  tag: string;
  gradient: string;
  accent: string;
  accentMuted: string;
  description: string;
  beginnerTag: string;
  displayName: string;
  fallbackImage: string;
}

const CATEGORY_MAP: Record<string, Omit<CategoryConfig, 'id' | 'index' | 'displayName'>> = {
  Bridal: {
    tag: 'Signature Edit',
    gradient: 'radial-gradient(ellipse at 30% 20%, #3d2a0a 0%, #1a0e02 40%, #0a0704 100%)',
    accent: '#D4AF37',
    accentMuted: 'rgba(212,175,55,0.18)',
    description: 'Timeless luxury lehengas & ceremonial gowns crafted for your wedding day.',
    beginnerTag: 'For: The Wedding Ceremony',
    fallbackImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
  },
  Engagement: {
    tag: 'Exclusive Edit',
    gradient: 'radial-gradient(ellipse at 70% 20%, #1e0a2e 0%, #0d0515 40%, #06030e 100%)',
    accent: '#C084FC',
    accentMuted: 'rgba(192,132,252,0.18)',
    description: 'Elevated, modern silhouettes that frame the beginning of your forever story.',
    beginnerTag: 'For: Roka & Ring Ceremony',
    fallbackImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80',
  },
  Reception: {
    tag: 'Couture Glamour',
    gradient: 'radial-gradient(ellipse at 50% 10%, #2d0a1a 0%, #120308 40%, #080104 100%)',
    accent: '#F472B6',
    accentMuted: 'rgba(244,114,182,0.18)',
    description: 'Glamorous after-dark designs for a reception the world will not forget.',
    beginnerTag: 'For: Grand Wedding Reception',
    fallbackImage: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80',
  },
  'Party Wear': {
    tag: 'Modern Festive',
    gradient: 'radial-gradient(ellipse at 30% 70%, #0c2b2a 0%, #051413 40%, #020707 100%)',
    accent: '#2DD4BF',
    accentMuted: 'rgba(45,212,191,0.18)',
    description: 'Chic silhouettes and festive patterns designed for guest of honor style.',
    beginnerTag: 'For: Bridesmaids & Ceremonies',
    fallbackImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
  },
  Lehenga: {
    tag: 'Heritage Craft',
    gradient: 'radial-gradient(ellipse at 50% 50%, #3b1010 0%, #170505 40%, #0b0202 100%)',
    accent: '#F87171',
    accentMuted: 'rgba(248,113,113,0.18)',
    description: 'Heavy pleated heritage lehengas with delicate hand-embroidery.',
    beginnerTag: 'For: Traditional Festivities',
    fallbackImage: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=600&q=80',
  },
  Saree: {
    tag: 'Timeless Drapes',
    gradient: 'radial-gradient(ellipse at 80% 80%, #2e280a 0%, #131003 40%, #090802 100%)',
    accent: '#FACC15',
    accentMuted: 'rgba(250,204,21,0.18)',
    description: 'Exquisite silk and designer sarees adorned with handcrafted borders.',
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
    accent: config?.accent || accColors[idx],
    accentMuted: config?.accentMuted || `rgba(212, 175, 55, 0.18)`,
    description: config?.description || `Beautiful custom handcrafted ${norm.toLowerCase()} designs for your memorable event.`,
    beginnerTag: config?.beginnerTag || `For: Custom ${norm}`,
    displayName: norm,
    fallbackImage: productImage || config?.fallbackImage || defaultFallbacks[index % defaultFallbacks.length]
  };
}

export default function MobileFeaturedCollections() {
  const { data: products = [] } = useQuery({
    queryKey: ['products-all'],
    queryFn: () => getProducts(),
  });

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
      const match = products.find((p: any) => p.category === cat && p.image_url);
      const categoryProductsCount = counts[cat] || 0;

      const config = getCategoryConfig(cat, idx, match?.image_url);

      return {
        ...config,
        pieces: `${categoryProductsCount} Pieces`
      };
    });
  }, [products, counts]);

  const stats = [
    { value: `${counts.Total || 0}+`, label: 'Designs' },
    { value: '18', label: 'Years' },
    { value: '99%', label: 'Happy Brides' },
  ];

  return (
    <section
      style={{
        background: '#060606',
        padding: '4rem 0 0',
        overflowX: 'hidden',
        width: '100%',
        maxWidth: '100vw',
        boxSizing: 'border-box' as any,
      }}
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{ padding: '0 1.25rem', marginBottom: '2.5rem', boxSizing: 'border-box', width: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Kicker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
            <div style={{ width: 28, height: 1, background: 'linear-gradient(90deg, transparent, #D4AF37)' }} />
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 9,
                letterSpacing: '0.38em',
                textTransform: 'uppercase',
                color: '#D4AF37',
                opacity: 0.75,
              }}
            >
              Collections
            </span>
          </div>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2.4rem, 10vw, 3.6rem)',
              fontWeight: 300,
              color: '#FFF',
              letterSpacing: '-0.01em',
              lineHeight: 1.08,
              marginBottom: '0.85rem',
            }}
          >
            Find Your <em style={{ color: '#D4AF37', fontStyle: 'italic' }}>Style</em>
          </h2>

          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              fontWeight: 300,
              color: 'rgba(255,255,255,0.38)',
              lineHeight: 1.65,
            }}
          >
            Explore our collection of custom tailored couture edits. Beautifully crafted for every luxury celebration.
          </p>
        </motion.div>
      </div>

      {/* ── Stats chips ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.15 }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          padding: '1.25rem 1.25rem 2rem',
          borderBottom: '1px solid rgba(212,175,55,0.1)',
          marginBottom: '2rem',
        }}
      >
        {stats.map((s) => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.6rem',
                fontWeight: 400,
                color: '#D4AF37',
                lineHeight: 1,
                marginBottom: 4,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 9,
                fontWeight: 300,
                color: 'rgba(255,255,255,0.32)',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </motion.div>

      {/* ── Collection Cards (horizontal row/carousel) ───────── */}
      <div
        style={{
          padding: '0 1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'row',
          gap: '1.25rem',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          marginBottom: '3rem',
          boxSizing: 'border-box',
          width: '100%',
          scrollSnapType: 'x mandatory',
        }}
        className="scrollbar-none"
      >
        {dynamicCollections.map((col, i) => (
          <motion.div
            key={col.id}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ flexShrink: 0, width: '270px', scrollSnapAlign: 'start' }}
          >
            <Link
              to={`/collections?category=${col.id}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: col.gradient,
                border: `1px solid ${col.accentMuted}`,
                borderRadius: 20,
                padding: '1.25rem',
                textDecoration: 'none',
                position: 'relative',
                overflow: 'hidden',
                minHeight: 360,
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              {/* Grain overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 20,
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
                  pointerEvents: 'none',
                }}
              />

              {/* TOP: Image */}
              <div
                style={{
                  width: '100%',
                  height: 160,
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.08)',
                  marginBottom: '1rem',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <img
                  src={col.fallbackImage}
                  alt={col.id}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />

                {/* Piece count overlaid on image */}
                <span
                  style={{
                    position: 'absolute',
                    bottom: '0.5rem',
                    right: '0.5rem',
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 8.5,
                    color: '#FFFFFF',
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(2px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    padding: '2px 6px',
                    borderRadius: 4,
                  }}
                >
                  {col.pieces}
                </span>
              </div>

              {/* BOTTOM: content details */}
              <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  {/* Header row: Index & tag */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 10,
                        color: col.accent,
                        letterSpacing: '0.15em',
                        fontWeight: 500,
                      }}
                    >
                      {col.index}
                    </span>
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 8,
                        color: 'rgba(255,255,255,0.4)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {col.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '1.6rem',
                      fontWeight: 300,
                      color: '#FFF',
                      letterSpacing: '0.02em',
                      lineHeight: 1.15,
                      marginBottom: 4,
                    }}
                  >
                    {col.displayName}
                  </h3>

                  {/* Beginner Occasion Tag */}
                  <div
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 9,
                      fontWeight: 500,
                      color: col.accent,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      marginBottom: 8,
                    }}
                  >
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: col.accent, display: 'inline-block' }} />
                    <span>{col.beginnerTag}</span>
                  </div>
                </div>

                {/* Footer link */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 9,
                    fontWeight: 500,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: col.accent,
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    paddingTop: '0.75rem',
                    marginTop: 'auto',
                  }}
                >
                  <span>Explore</span>
                  <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                    <path d="M1 7h12M8 2l5 5-5 5" stroke={col.accent} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
