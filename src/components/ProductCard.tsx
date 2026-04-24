import { useFavorites } from '@/hooks/useFavorites';
import { Product, getImageUrl } from '@/lib/appwrite';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const liked = isFavorite(product.$id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: '-50px' }}
      className="group relative overflow-hidden rounded-[2.5rem] bg-[#0A0A0A] border border-white/5 hover:border-[#D4AF37]/20 transition-all duration-700 cursor-pointer"
    >
      {/* Image Area */}
      <a
        href={`#/product/${product.$id}`}
        className="block"
        id={`product-${product.$id}`}
      >
        <div className="relative aspect-[4/5.5] overflow-hidden">
          {product.image_url ? (
            <img
              src={getImageUrl(product.image_url)}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#0A0A0A] to-[#1A0A05] flex items-center justify-center">
              <span className="text-[60px] font-heading italic text-[#D4AF37]/5 select-none font-light">Y</span>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-700 backdrop-blur-[2px] flex items-center justify-center text-center">
            <div className="px-6 py-3 border border-[#D4AF37]/30 bg-black/60 backdrop-blur-md rounded-full text-[#D4AF37] text-[9px] font-bold uppercase tracking-[0.3em] scale-90 group-hover:scale-100 transition-transform duration-500">
              Discover Piece
            </div>
          </div>
        </div>
      </a>

      {/* Favorite Button */}
      <button
        onClick={() => toggleFavorite(product)}
        id={`fav-${product.$id}`}
        className="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/5 hover:border-[#D4AF37]/50 transition-all z-10 group/heart"
        title={liked ? 'Remove from favorites' : 'Save to favorites'}
      >
        <Heart
          className={`w-3.5 h-3.5 transition-all duration-300 group-hover/heart:scale-110 ${liked ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-white/50 group-hover/heart:text-white'
            }`}
        />
      </button>

      {/* Category Badge */}
      <div className="absolute top-5 left-5 z-10">
        <span className="text-[8px] font-bold uppercase tracking-[0.25em] px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/5 text-white/50">
          {product.category}
        </span>
      </div>

      {/* Info */}
      <div className="p-5 pt-6 pb-7">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-heading text-lg text-white group-hover:text-[#D4AF37] transition-colors duration-500 leading-tight truncate flex-1 tracking-tight font-light">
            {product.name}
          </h3>
          {product.variants && (product.variants as any[]).length > 1 && (
            <div className="flex gap-1 mt-1.5 shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/20" />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {product.price && (
              <span className="text-xs font-bold tracking-[0.15em] text-[#D4AF37]">
                {product.price}
              </span>
            )}
            {product.is_customizable !== false && (
              <div className="w-1 h-1 rounded-full bg-green-500/40" />
            )}
          </div>
          <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/10 group-hover:text-[#D4AF37]/40 transition-colors">
            Details
          </span>
        </div>
      </div>
    </motion.div>
  );
}
