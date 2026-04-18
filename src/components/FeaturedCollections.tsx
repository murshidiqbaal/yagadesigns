import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const COLLECTIONS = [
  {
    id: 'Bridal',
    emoji: '👰',
    color: 'from-[#8B6914]/20 to-[#D4AF37]/10',
    border: 'hover:border-[#D4AF37]/40',
    accent: 'text-[#D4AF37]',
    description: 'Timeless lehengas & gowns for your dream wedding day',
  },
  {
    id: 'Engagement',
    emoji: '💍',
    color: 'from-[#6B21A8]/20 to-[#A855F7]/10',
    border: 'hover:border-purple-400/40',
    accent: 'text-purple-400',
    description: 'Elegant outfits to celebrate your love story',
  },
  {
    id: 'Reception',
    emoji: '✨',
    color: 'from-[#991B1B]/20 to-[#EC4899]/10',
    border: 'hover:border-pink-400/40',
    accent: 'text-pink-400',
    description: 'Glamorous designs for an unforgettable night',
  },
];

export default function FeaturedCollections() {
  return (
    <section className="py-28 bg-[#080808]">
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#D4AF37] mb-4 block">
            Collections
          </span>
          <h2 className="font-heading text-4xl md:text-6xl font-medium text-white">
            Find Your Style
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLLECTIONS.map((col, i) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
            >
              <Link
                to={`/collections?category=${col.id}`}
                id={`collection-${col.id.toLowerCase()}`}
                className={`group block relative overflow-hidden rounded-3xl bg-[#111]/80 border border-white/5 ${col.border} transition-all duration-500 p-10 min-h-[300px]`}
              >
                {/* Gradient bg */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${col.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />
                {/* Content */}
                <div className="relative z-10">
                  <div className="text-5xl mb-6">{col.emoji}</div>
                  <h3 className={`font-heading text-3xl text-white mb-3 group-hover:${col.accent} transition-colors duration-300`}>
                    {col.id}
                  </h3>
                  <p className="text-sm text-white/45 leading-relaxed mb-8">
                    {col.description}
                  </p>
                  <div className={`flex items-center gap-2 ${col.accent} text-xs font-bold uppercase tracking-widest`}>
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
