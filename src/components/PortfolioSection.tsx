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
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="text-primary text-xs tracking-[0.4em] uppercase mb-4">Our Work</p>
          <h2 className="font-heading text-3xl md:text-5xl">
            Luxury Event <span className="text-gradient">Portfolio</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-sm">
            Browse our curated collection of luxury weddings and premium events across Kothamangalam, Ernakulam, and Kerala.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 text-xs tracking-widest uppercase border transition-all duration-300 ${
                filter === cat
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.div
                key={item.$id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                onClick={() => setLightbox(item)}
                className="group cursor-pointer break-inside-avoid overflow-hidden relative"
              >
                <img
                  src={item.image_url}
                  alt={`${item.title} - luxury event by Luxevibes in Kerala`}
                  loading="lazy"
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <div>
                    <p className="text-primary text-[10px] tracking-widest uppercase">{item.category}</p>
                    <h3 className="font-heading text-lg mt-1">{item.title}</h3>
                  </div>
                </div>
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
              <img src={lightbox.image_url} alt={`${lightbox.title} - Luxevibes luxury event photography`} className="w-full max-h-[70vh] object-contain" />
              <div className="mt-4 text-center">
                <p className="text-primary text-xs tracking-widest uppercase">{lightbox.category}</p>
                <h3 className="font-heading text-2xl mt-2">{lightbox.title}</h3>
                <p className="text-muted-foreground text-sm mt-2">{lightbox.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
