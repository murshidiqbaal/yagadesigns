import { getTestimonials, getImageUrl, Testimonial } from '@/lib/appwrite';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MessageSquareQuote, Star, User } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function MobileTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getTestimonials();
      setTestimonials(data.slice(0, 6));
    })();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || testimonials.length === 0) return;
    const interval = setInterval(() => handleNext(), 5000);
    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, testimonials]);

  const handleNext = () => setCurrentIndex(prev => (prev + 1) % testimonials.length);
  const handlePrev = () => setCurrentIndex(prev => (prev - 1 + testimonials.length) % testimonials.length);

  if (testimonials.length === 0) return null;

  const current = testimonials[currentIndex];

  return (
    <section className="py-20 relative bg-[#050505]" style={{ overflowX: 'hidden', width: '100%', maxWidth: '100vw' }}>
      {/* Background glow — lightweight on mobile */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[40vw] bg-primary/5 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative z-10 px-5" style={{ width: '100%', boxSizing: 'border-box' }}>
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-5"
          >
            <Star className="w-3 h-3 text-primary fill-primary" />
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/60">Voices of Yaga</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            className="text-[2rem] leading-tight font-light text-white mb-3"
          >
            Client{' '}
            <em className="text-primary italic">Confessions</em>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/35 text-[11px] uppercase tracking-[0.2em] font-medium"
          >
            Real brides. Real stories.
          </motion.p>
        </div>

        {/* ── Carousel card ──────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl p-6 text-center mb-7" style={{ width: '100%', boxSizing: 'border-box' }}
          >
            {/* Stars */}
            <div className="flex justify-center gap-1 mb-5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i < current.rating ? 'fill-primary text-primary' : 'text-white/10'}`} />
              ))}
            </div>

            <MessageSquareQuote className="w-8 h-8 text-primary/20 mx-auto mb-5" />

            <blockquote
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-[1.25rem] font-light leading-relaxed text-white/85 mb-7 italic"
            >
              "{current.content}"
            </blockquote>

            {/* Author */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 p-0.5">
                <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center text-primary overflow-hidden">
                  {current.avatar_url ? (
                    <img src={getImageUrl(current.avatar_url)} className="w-full h-full object-cover" alt={current.name} />
                  ) : (
                    <User className="w-6 h-6 opacity-40" />
                  )}
                </div>
              </div>
              <div>
                <h4 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-base font-light text-white tracking-wide">{current.name}</h4>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary/60 mt-0.5">Verified Client</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Controls ───────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-5">
          <button
            onClick={() => { handlePrev(); setIsAutoPlaying(false); }}
            className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4 text-white/50" />
          </button>

          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrentIndex(i); setIsAutoPlaying(false); }}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? 'w-6 bg-primary' : 'w-1.5 bg-white/15'}`}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => { handleNext(); setIsAutoPlaying(false); }}
            className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4 text-white/50" />
          </button>
        </div>
      </div>
    </section>
  );
}
