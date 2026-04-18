import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getPortfolioItems, type PortfolioItem } from '@/lib/appwrite';

import fallback1 from '@/assets/portfolio-1.jpg';
import fallback2 from '@/assets/portfolio-2.jpg';
import fallback3 from '@/assets/portfolio-3.jpg';
import fallback4 from '@/assets/portfolio-4.jpg';

const fallbackData: PortfolioItem[] = [
  { $id: '1', title: 'Royal Garden Wedding', image_url: fallback1, category: 'Weddings', description: 'A breathtaking garden ceremony in Kothamangalam with ocean views.', created_at: '' },
  { $id: '2', title: 'Emerald Gala Night', image_url: fallback2, category: 'Corporate', description: 'Sophisticated corporate gala in Ernakulam with teal uplighting.', created_at: '' },
  { $id: '3', title: 'Intimate Anniversary', image_url: fallback3, category: 'Private', description: 'A warm, candlelit anniversary celebration in Kerala.', created_at: '' },
  { $id: '4', title: 'Classic White Wedding', image_url: fallback4, category: 'Weddings', description: 'Timeless elegance with white florals in Kothamangalam.', created_at: '' },
];

const categories = ['All', 'Weddings', 'Corporate', 'Private', 'Destination'];

export default function PortfolioSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [items, setItems] = useState<PortfolioItem[]>(fallbackData);
  const [filter, setFilter] = useState('All');
  const [lightbox, setLightbox] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    getPortfolioItems().then((data) => {
      if (data.length > 0) setItems(data);
    });
  }, []);

  const filtered = filter === 'All' ? items : items.filter((i) => i.category === filter);

  return (
    <section id="portfolio" className="py-32 grain-overlay">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p className="text-[#D4AF37] text-[10px] tracking-[0.5em] uppercase mb-6 font-medium">The Archive</p>
          <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl tracking-tighter italic">
            Unforgettable <span className="text-gradient not-italic tracking-normal">Chapters</span>
          </h2>
          <p className="mt-8 text-[#F5F5F5]/60 font-light max-w-3xl mx-auto text-base md:text-lg leading-relaxed tracking-wide">
            A curated anthology of cinematic wedding narratives and royal celebrations crafted across the tapestry of Kerala.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-8 py-3 text-[10px] tracking-[0.3em] uppercase border transition-all duration-700 royal-border ${
                filter === cat
                  ? 'bg-[#D4AF37] text-[#0B0B0B] shadow-[0_0_30px_rgba(212,175,55,0.2)]'
                  : 'text-[#F5F5F5]/40 hover:text-[#F5F5F5] hover:border-[#D4AF37]/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.div
                key={item.$id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setLightbox(item)}
                className="group cursor-pointer break-inside-avoid overflow-hidden relative rounded-sm"
              >
                <img
                  src={item.image_url}
                  alt={`${item.title} - luxury bridal design by Yaga Designs`}
                  loading="lazy"
                  className="w-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1500ms] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-end p-10">
                  <div>
                    <p className="text-[#D4AF37] text-[10px] tracking-[0.5em] uppercase font-medium">{item.category}</p>
                    <h3 className="font-heading text-3xl mt-3 tracking-tighter italic text-[#F5F5F5]">{item.title}</h3>
                  </div>
                </div>
                <div className="absolute inset-0 border border-white/0 group-hover:border-[#D4AF37]/20 transition-all duration-700 pointer-events-none" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setLightbox(null)}
          >
            <button onClick={() => setLightbox(null)} aria-label="Close lightbox" className="absolute top-6 right-6 text-foreground hover:text-primary transition-colors">
              <X className="w-8 h-8" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={lightbox.image_url} alt={`${lightbox.title} - Yaga Designs luxury bridal photography`} className="w-full max-h-[70vh] object-contain" />
              <div className="mt-4 text-center">
                <p className="text-primary text-xs tracking-cinematic uppercase">{lightbox.category}</p>
                <h3 className="font-heading text-3xl mt-4 tracking-elegant text-[#F5F5F5]">{lightbox.title}</h3>
                <p className="text-muted-foreground text-base mt-4 tracking-wide leading-relaxed">{lightbox.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
