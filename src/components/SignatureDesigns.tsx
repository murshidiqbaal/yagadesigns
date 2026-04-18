import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getProducts } from '@/lib/appwrite';
import ProductCard from './ProductCard';

export default function SignatureDesigns() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products-home'],
    queryFn: () => getProducts(),
    select: data => data.slice(0, 6),
  });

  if (!isLoading && products.length === 0) return null;

  return (
    <section className="py-28 bg-[#050505]">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#D4AF37] mb-4 block">
            Signature
          </span>
          <h2 className="font-heading text-4xl md:text-6xl font-medium text-white">
            Latest Designs
          </h2>
        </motion.div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl bg-[#1A1A1A] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.$id} product={product} index={i} />
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-14"
        >
          <Link
            to="/collections"
            className="inline-flex items-center gap-3 px-10 py-4 border border-[#D4AF37]/35 text-[#D4AF37] text-sm font-bold uppercase tracking-widest rounded-full hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
          >
            View All Designs <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
