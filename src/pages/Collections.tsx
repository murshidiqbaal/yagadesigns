import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import { getProducts } from '@/lib/appwrite';
import { CATEGORIES } from '@/lib/constants';
import ProductCard from '@/components/ProductCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Collections() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get('category') || 'All'
  );

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(),
  });

  // Sync URL param → filter state
  useEffect(() => {
    const cat = searchParams.get('category');
    setActiveCategory(cat || 'All');
  }, [searchParams]);

  const filtered =
    activeCategory === 'All'
      ? products
      : products.filter(p => p.category === activeCategory);

  const handleFilter = (cat: string) => {
    setActiveCategory(cat);
    if (cat === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

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
              Browse
            </span>
            <h1 className="font-heading text-5xl md:text-7xl font-medium text-white">
              Collections
            </h1>
            <p className="text-white/40 mt-4 max-w-md mx-auto text-sm">
              Discover handcrafted bridal designs for every special occasion
            </p>
          </motion.div>

          {/* ── Category Filters ──────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-14"
          >
            <div className="flex items-center gap-2 text-white/30 mr-2">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-xs uppercase tracking-widest font-bold">Filter</span>
            </div>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                id={`filter-${cat.toLowerCase().replace(' ', '-')}`}
                onClick={() => handleFilter(cat)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-[#D4AF37] text-black shadow-[0_0_25px_rgba(212,175,55,0.35)]'
                    : 'border border-white/10 text-white/55 hover:border-[#D4AF37]/40 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* ── Products Count ────────────────────────────────────── */}
          {!isLoading && (
            <p className="text-xs text-white/25 uppercase tracking-widest mb-8">
              {filtered.length} {filtered.length === 1 ? 'design' : 'designs'} found
            </p>
          )}

          {/* ── Grid ─────────────────────────────────────────────── */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-2xl bg-[#1A1A1A] animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <div className="text-6xl mb-5">👗</div>
              <h3 className="font-heading text-2xl text-white mb-2">No designs yet</h3>
              <p className="text-white/35 text-sm">
                Check back soon for new arrivals in this category.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product, i) => (
                <ProductCard key={product.$id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
