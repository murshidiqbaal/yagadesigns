import { getProducts } from '@/lib/appwrite';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const COLLECTIONS = [
  {
    id: 'Bridal',
    index: '01',
    tag: 'Signature Edit',
    gradient: 'radial-gradient(ellipse at 30% 20%, #3d2a0a 0%, #1a0e02 40%, #0a0704 100%)',
    accent: '#D4AF37',
    accentMuted: 'rgba(212,175,55,0.18)',
    description: 'Timeless lehengas & ceremonial gowns crafted for your most sacred chapter.',
  },
  {
    id: 'Engagement',
    index: '02',
    tag: 'Exclusive',
    gradient: 'radial-gradient(ellipse at 70% 20%, #1e0a2e 0%, #0d0515 40%, #06030e 100%)',
    accent: '#C084FC',
    accentMuted: 'rgba(192,132,252,0.18)',
    description: 'Elevated silhouettes that frame the beginning of your forever story.',
  },
  {
    id: 'Reception',
    index: '03',
    tag: 'Couture',
    gradient: 'radial-gradient(ellipse at 50% 10%, #2d0a1a 0%, #120308 40%, #080104 100%)',
    accent: '#F472B6',
    accentMuted: 'rgba(244,114,182,0.18)',
    description: 'Glamorous after-dark designs for an evening the world will not forget.',
  },
];

export default function MobileFeaturedCollections() {
  const { data: products = [] } = useQuery({
    queryKey: ['products-all'],
    queryFn: () => getProducts(),
  });

  const counts = {
    Bridal: products.filter(p => p.category === 'Bridal').length,
    Engagement: products.filter(p => p.category === 'Engagement').length,
    Reception: products.filter(p => p.category === 'Reception' || p.category === 'Party Wear').length,
  };

  const stats = [
    { value: `${products.length}+`, label: 'Designs' },
    { value: '18', label: 'Years' },
    { value: '99%', label: 'Happy Brides' },
  ];

  return (
    <section
      style={{ background: '#060606', padding: '4rem 0 0', overflowX: 'hidden', width: '100%', maxWidth: '100vw', boxSizing: 'border-box' as any }}
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
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 9, letterSpacing: '0.38em',
              textTransform: 'uppercase', color: '#D4AF37', opacity: 0.75,
            }}>Collections</span>
          </div>

          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2.4rem, 10vw, 3.6rem)',
            fontWeight: 300, color: '#FFF',
            letterSpacing: '-0.01em', lineHeight: 1.08,
            marginBottom: '0.85rem',
          }}>
            Find Your{' '}
            <em style={{ color: '#D4AF37', fontStyle: 'italic' }}>Style</em>
          </h2>

          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13, fontWeight: 300,
            color: 'rgba(255,255,255,0.38)', lineHeight: 1.65,
          }}>
            Three curated edits. One unforgettable celebration.
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
          display: 'flex', justifyContent: 'center', gap: '2rem',
          padding: '1.25rem 1.25rem 2rem',
          borderBottom: '1px solid rgba(212,175,55,0.1)',
          marginBottom: '2rem',
        }}
      >
        {stats.map((s, i) => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.6rem', fontWeight: 400,
              color: '#D4AF37', lineHeight: 1, marginBottom: 4,
            }}>{s.value}</div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 9, fontWeight: 300,
              color: 'rgba(255,255,255,0.32)',
              letterSpacing: '0.18em', textTransform: 'uppercase',
            }}>{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* ── Collection Cards (vertical stack) ───────────────── */}
      <div style={{ padding: '0 1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem', boxSizing: 'border-box', width: '100%' }}>
        {COLLECTIONS.map((col, i) => (
          <motion.div
            key={col.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              to={`/collections?category=${col.id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: col.gradient,
                border: `1px solid ${col.accentMuted}`,
                borderRadius: 16,
                padding: '1.2rem 1rem',
                textDecoration: 'none',
                position: 'relative',
                overflow: 'hidden',
                minHeight: 110,
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              {/* Grain overlay */}
              <div style={{
                position: 'absolute', inset: 0, borderRadius: 16,
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
                pointerEvents: 'none',
              }} />

              {/* Left: index + title + desc */}
              <div style={{ position: 'relative', zIndex: 1, flex: 1, paddingRight: '1rem' }}>
                <span style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 9,
                  color: col.accent, letterSpacing: '0.2em', opacity: 0.75,
                  display: 'block', marginBottom: 6,
                }}>{col.index}</span>

                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.6rem', fontWeight: 300,
                  color: '#FFF', letterSpacing: '0.02em',
                  lineHeight: 1.1, marginBottom: 6,
                }}>{col.id}</h3>

                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11, fontWeight: 300,
                  color: 'rgba(255,255,255,0.4)', lineHeight: 1.55,
                }}>{col.description}</p>
              </div>

              {/* Right: piece count + arrow */}
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, flexShrink: 0 }}>
                <span style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 10,
                  color: 'rgba(255,255,255,0.3)',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '3px 8px', borderRadius: 4,
                  whiteSpace: 'nowrap',
                }}>
                  {counts[col.id as keyof typeof counts] || 0} Pieces
                </span>

                <div style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 10, fontWeight: 500,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: col.accent,
                }}>
                  <span>Explore</span>
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
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
