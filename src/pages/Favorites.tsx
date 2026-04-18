import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, X, MessageCircle, Sparkles } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { getWhatsAppUrl } from '@/lib/constants';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Favorites() {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />
      <main className="pt-28 pb-24">
        <div className="container">
          {/* ── Page Header ──────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-14"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#D4AF37] mb-4 block">
              Saved
            </span>
            <h1 className="font-heading text-5xl md:text-7xl font-medium text-white">
              My Favorites
            </h1>
            <p className="text-white/35 mt-4 text-sm">
              {favorites.length === 0
                ? 'No designs saved yet'
                : `${favorites.length} ${favorites.length === 1 ? 'design' : 'designs'} saved`}
            </p>
          </motion.div>

          {/* ── Empty State ───────────────────────────────────────── */}
          {favorites.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-24 max-w-sm mx-auto"
            >
              <div className="w-20 h-20 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-6">
                <Heart className="w-9 h-9 text-[#D4AF37]/40" />
              </div>
              <h3 className="font-heading text-2xl text-white mb-3">Nothing saved yet</h3>
              <p className="text-white/35 text-sm mb-10 leading-relaxed">
                Explore our collection and tap the{' '}
                <Heart className="inline w-3.5 h-3.5 text-[#D4AF37]" /> on any design to save it here.
              </p>
              <Link
                to="/collections"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#D4AF37] text-black text-sm font-bold uppercase tracking-widest rounded-full hover:bg-[#FFFBD5] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300"
              >
                <Sparkles className="w-4 h-4" />
                Explore Collection
              </Link>
            </motion.div>
          ) : (
            <>
              {/* ── Favorites Grid ──────────────────────────────── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {favorites.map((product, i) => (
                    <motion.div
                      key={product.$id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.4, delay: i * 0.06 }}
                      className="group relative overflow-hidden rounded-2xl bg-[#1A1A1A]/60 border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-500"
                    >
                      {/* Image */}
                      <div className="aspect-[3/4] overflow-hidden">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#1A1A1A] to-[#2A1A0A] flex items-center justify-center">
                            <span className="text-[80px] font-heading italic text-[#D4AF37]/10 select-none">
                              Y
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFavorite(product.$id)}
                        id={`remove-fav-${product.$id}`}
                        title="Remove from favorites"
                        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center border border-white/10 hover:border-red-400/60 hover:bg-red-500/20 transition-all z-10"
                      >
                        <X className="w-4 h-4 text-white/70 hover:text-red-400" />
                      </button>

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-black/70 backdrop-blur-sm border border-[#D4AF37]/25 text-[#D4AF37]">
                          {product.category}
                        </span>
                      </div>

                      {/* Info + Enquire */}
                      <div className="p-5">
                        <h3 className="font-heading text-lg text-white leading-snug mb-1">
                          {product.name}
                        </h3>
                        {product.description && (
                          <p className="text-xs text-white/35 mb-4 line-clamp-1">
                            {product.description}
                          </p>
                        )}
                        <a
                          href={getWhatsAppUrl(product.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#25D366]/20 hover:border-[#25D366]/60 transition-all duration-300"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          Enquire
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Continue Shopping */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center mt-14"
              >
                <Link
                  to="/collections"
                  className="inline-flex items-center gap-2 px-8 py-4 border border-white/10 text-white/60 text-sm font-bold uppercase tracking-widest rounded-full hover:border-[#D4AF37]/40 hover:text-[#D4AF37] transition-all duration-300"
                >
                  Continue Browsing
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
