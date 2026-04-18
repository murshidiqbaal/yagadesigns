import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Product, getImageUrl } from '@/lib/appwrite';
import { useFavorites } from '@/hooks/useFavorites';
import { getWhatsAppUrl } from '@/lib/constants';

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
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: '-50px' }}
      className="group relative overflow-hidden rounded-2xl bg-[#1A1A1A]/60 backdrop-blur-sm border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-500 cursor-pointer"
    >
      {/* Image Area */}
      <a
        href={getWhatsAppUrl(product.name)}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        id={`product-${product.$id}`}
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          {product.image_url ? (
            <img
              src={getImageUrl(product.image_url)}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1A1A1A] to-[#2A1A0A] flex items-center justify-center">
              <span className="text-[80px] font-heading italic text-[#D4AF37]/10 select-none">Y</span>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
            <div className="w-full py-3 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-widest rounded-xl text-center hover:bg-[#FFFBD5] transition-colors">
              Enquire Now
            </div>
          </div>
        </div>
      </a>

      {/* Favorite Button */}
      <button
        onClick={() => toggleFavorite(product)}
        id={`fav-${product.$id}`}
        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-white/10 hover:border-[#D4AF37]/50 transition-all z-10 group/heart"
        title={liked ? 'Remove from favorites' : 'Save to favorites'}
      >
        <Heart
          className={`w-4 h-4 transition-all duration-300 group-hover/heart:scale-110 ${
            liked ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-white'
          }`}
        />
      </button>

      {/* Category Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-black/70 backdrop-blur-sm border border-[#D4AF37]/25 text-[#D4AF37]">
          {product.category}
        </span>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-heading text-lg text-white group-hover:text-[#D4AF37] transition-colors duration-300 leading-snug">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-sm text-white/40 mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}
      </div>
    </motion.div>
  );
}
