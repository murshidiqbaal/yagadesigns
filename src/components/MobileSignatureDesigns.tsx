import { getImageUrl, getProducts, Product } from '@/lib/appwrite';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '@/hooks/useFavorites';

const CATEGORIES = ['All', 'Bridal', 'Engagement', 'Reception'];

const STEPS = [
  { num: '01', title: 'Discovery', desc: 'We listen to your vision and every detail that makes your celebration singular.' },
  { num: '02', title: 'Design', desc: 'Our atelier crafts a bespoke concept that reflects your unique story.' },
  { num: '03', title: 'Refinement', desc: 'Meticulous fitting sessions ensure every thread falls exactly as intended.' },
  { num: '04', title: 'Delivery', desc: 'Your creation arrives in our signature packaging, ready for your moment.' },
];

/* ── Mobile Product Card ───────────────────────────────────────── */
function MobileProductCard({ product, index }: { product: Product; index: number }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(product.$id);
  const imageUrl = getImageUrl(product.image_url);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      layout
    >
      <Link to={`/product/${product.$id}`} className="block relative group">
        {/* Image */}
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#1A1A1A] mb-2.5">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Fav button */}
          <button
            onClick={e => { e.preventDefault(); toggleFavorite(product); }}
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center active:scale-90 transition-transform"
            aria-label={fav ? 'Remove from favourites' : 'Add to favourites'}
          >
            <Heart className={`w-4 h-4 ${fav ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-white/70'}`} />
          </button>

          {/* Category badge */}
          <span className="absolute bottom-2.5 left-2.5 text-[8px] uppercase tracking-[0.2em] font-medium text-white/60 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>

        {/* Info */}
        <div>
          <h3
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            className="text-[1rem] font-light text-white leading-snug mb-0.5 truncate"
          >
            {product.name}
          </h3>
          {product.price && (
            <p className="text-[11px] text-[#D4AF37] font-medium tracking-wide">{product.price}</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

/* ── Mobile Process Timeline ───────────────────────────────────── */
function MobileProcess() {
  return (
    <section style={{ padding: '4rem 1.25rem', background: '#060606', position: 'relative', overflowX: 'hidden', width: '100%', maxWidth: '100vw', boxSizing: 'border-box' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', marginBottom: '3rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: '1rem' }}>
          <div style={{ width: 28, height: 1, background: 'linear-gradient(90deg, transparent, #D4AF37)' }} />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.38em', textTransform: 'uppercase', color: '#D4AF37', opacity: 0.7 }}>
            Atelier Process
          </span>
          <div style={{ width: 28, height: 1, background: 'linear-gradient(90deg, #D4AF37, transparent)' }} />
        </div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 7vw, 2.6rem)', fontWeight: 300, color: '#FFF', lineHeight: 1.1 }}>
          The Making of{' '}
          <em style={{ color: '#D4AF37', fontStyle: 'italic' }}>Something Perfect</em>
        </h2>
      </motion.div>

      {/* Vertical timeline */}
      <div style={{ position: 'relative' }}>
        {/* Vertical line */}
        <div style={{
          position: 'absolute', left: 20, top: 0, bottom: 0, width: 1,
          background: 'linear-gradient(to bottom, transparent, rgba(212,175,55,0.22) 15%, rgba(212,175,55,0.22) 85%, transparent)',
        }} />

        {STEPS.map((step, i) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'flex', marginBottom: i < STEPS.length - 1 ? '1.75rem' : 0, position: 'relative' }}
          >
            {/* Dot */}
            <div style={{
              position: 'absolute', left: 16, top: 18,
              width: 9, height: 9, borderRadius: '50%',
              border: '1px solid #D4AF37', background: '#060606',
              boxShadow: '0 0 10px rgba(212,175,55,0.25)',
              zIndex: 2,
            }} />

            {/* Card */}
            <div style={{
              marginLeft: 44, flex: 1,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(212,175,55,0.1)',
              borderRadius: 8, padding: '1rem 1.1rem',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Watermark number */}
              <span style={{
                position: 'absolute', bottom: -8, right: 4,
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 56, fontWeight: 300,
                color: 'rgba(212,175,55,0.05)', lineHeight: 1,
                userSelect: 'none', pointerEvents: 'none',
              }}>{step.num}</span>

              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.25em', color: 'rgba(212,175,55,0.6)', display: 'block', marginBottom: 5 }}>
                {step.num}
              </span>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.15rem', fontWeight: 300, color: '#FFF', marginBottom: 5, letterSpacing: '0.04em' }}>
                {step.title}
              </h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.38)', lineHeight: 1.6, margin: 0 }}>
                {step.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ── Main Component ────────────────────────────────────────────── */
export default function MobileSignatureDesigns() {
  const { data: dbProducts = [], isLoading } = useQuery({
    queryKey: ['products-home'],
    queryFn: () => getProducts(),
  });

  const [activeCategory, setActiveCategory] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const INITIAL_COUNT = 4;

  const filtered = activeCategory === 'All'
    ? dbProducts
    : dbProducts.filter(p => p.category === activeCategory);

  const visible = showAll ? filtered : filtered.slice(0, INITIAL_COUNT);
  const hasMore = filtered.length > INITIAL_COUNT;

  const handleCategory = (cat: string) => {
    setActiveCategory(cat);
    setShowAll(false);
  };

  return (
    <div style={{ background: '#060606', overflowX: 'hidden', width: '100%', maxWidth: '100vw', boxSizing: 'border-box' }}>

      {/* ── Section Header ──────────────────────────────────── */}
      <section style={{ paddingTop: '4rem', paddingBottom: '0', overflowX: 'hidden' }}>
        <div style={{ padding: '0 1.25rem', boxSizing: 'border-box', width: '100%' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: '2rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.1rem' }}>
              <div style={{ width: 28, height: 1, background: 'linear-gradient(90deg, transparent, #D4AF37)' }} />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.38em', textTransform: 'uppercase', color: '#D4AF37', opacity: 0.7 }}>
                The Collection
              </span>
            </div>

            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem, 9vw, 3rem)', fontWeight: 300, color: '#FFF', letterSpacing: '-0.01em', lineHeight: 1.05, marginBottom: '0.6rem' }}>
              Bridal <em style={{ color: '#D4AF37', fontStyle: 'italic' }}>Atelier</em>
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.35)', lineHeight: 1.65 }}>
              Handcrafted couture for your most sacred celebration.
            </p>
          </motion.div>

          {/* ── Category pills — horizontal scroll ──────────── */}
          <div style={{
            display: 'flex', gap: 7, overflowX: 'auto', overflowY: 'hidden',
            paddingBottom: '1rem', marginBottom: '1.5rem',
            WebkitOverflowScrolling: 'touch' as any,
            scrollbarWidth: 'none', msOverflowStyle: 'none',
            maxWidth: '100%',
          }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 10, fontWeight: 500,
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  padding: '7px 16px', borderRadius: 20,
                  border: activeCategory === cat ? '1px solid rgba(212,175,55,0.5)' : '1px solid rgba(255,255,255,0.1)',
                  background: activeCategory === cat ? 'rgba(212,175,55,0.1)' : 'transparent',
                  color: activeCategory === cat ? '#D4AF37' : 'rgba(255,255,255,0.4)',
                  cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                  transition: 'all 0.25s ease',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* ── Piece count ─────────────────────────────────── */}
          <div style={{ marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(212,175,55,0.07)' }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>
              {filtered.length} pieces
            </span>
          </div>

          {/* ── Product Grid (2-col) ─────────────────────────── */}
          {isLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '2rem' }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-2xl bg-[#1A1A1A] animate-pulse" />
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '2rem' }}>
              <AnimatePresence mode="popLayout">
                {visible.map((product, i) => (
                  <MobileProductCard key={product.$id} product={product} index={i} />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* ── Show more / less ────────────────────────────── */}
          {hasMore && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}
            >
              <button
                onClick={() => setShowAll(!showAll)}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 10, fontWeight: 500,
                  letterSpacing: '0.25em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.45)',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '11px 28px', borderRadius: 4,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                {showAll ? 'Show Less' : `View All ${filtered.length} Pieces`}
                <motion.div
                  animate={{ rotate: showAll ? 180 : 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </motion.div>
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Process Section ─────────────────────────────────── */}
      <MobileProcess />

      {/* ── Bottom CTA ──────────────────────────────────────── */}
      <section style={{ padding: '4rem 1.25rem', textAlign: 'center', background: '#060606', borderTop: '1px solid rgba(212,175,55,0.07)', boxSizing: 'border-box', width: '100%', overflowX: 'hidden' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.4rem, 6vw, 2rem)', fontWeight: 300, fontStyle: 'italic', color: 'rgba(212,175,55,0.7)', marginBottom: '0.6rem' }}>
            "Every stitch, a promise."
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: '2rem' }}>
            Book a Private Consultation
          </p>
          <a
            href="#/consult"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10, fontWeight: 500,
              letterSpacing: '0.28em', textTransform: 'uppercase',
              color: '#060606', background: '#D4AF37',
              padding: '13px 36px', borderRadius: 2,
              textDecoration: 'none', display: 'inline-block',
            }}
          >
            Begin Your Journey
          </a>
        </motion.div>
      </section>
    </div>
  );
}
