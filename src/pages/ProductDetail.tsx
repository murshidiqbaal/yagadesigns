import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { getImageUrl, getProductById, ProductVariant, trackProductEnquiry, trackProductLike } from "@/lib/appwrite";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Heart, MessageCircle, Plus, Scissors, Share2, ShieldCheck, Zap, Play } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Maximize2, X as CloseIcon } from "lucide-react";
import SEO from "@/components/SEO";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  // ── Data Fetching ──────────────────────────────────────────────────
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id!),
    enabled: !!id,
  });

  const variants = useMemo(() => {
    if (!product?.variants) return [];
    return product.variants as ProductVariant[];
  }, [product]);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Set initial variant
  useEffect(() => {
    if (variants.length > 0 && !selectedVariant) {
      setSelectedVariant(variants[0]);
    }
  }, [variants, selectedVariant]);

  // ── Gallery Logic ──────────────────────────────────────────────────
  const images = useMemo(() => {
    const activeVariant = selectedVariant || (variants.length > 0 ? variants[0] : null);
    if (activeVariant?.images?.length) return activeVariant.images;
    if (product?.image_urls?.length) return product.image_urls;
    return product?.image_url ? [product.image_url] : [];
  }, [selectedVariant, product, variants]);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (emblaApi) emblaApi.scrollTo(0);
    setActiveIndex(0);
  }, [images, emblaApi]);

  const scrollTo = (index: number) => emblaApi?.scrollTo(index);

  const liked = product ? isFavorite(product.$id) : false;

  // ── WhatsApp Logic ─────────────────────────────────────────────────
  const handleWhatsAppEnquiry = () => {
    if (!product) return;
    let text = `Hello Yaga Designs,\n\nI am interested in:\nProduct: ${product.name}\n${selectedVariant ? `Color: ${selectedVariant.color}\n` : ""}`;
    if (product.instagram_reel_link) {
      text += `Reel: ${product.instagram_reel_link}\n\n`;
    } else {
      text += `\n`;
    }
    text += `Please share customization options and final pricing.`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    trackProductEnquiry(product.$id);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  // ── Render Helpers ─────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-heading mb-4 text-white">Product Not Found</h2>
        <Button onClick={() => navigate("/collections")} variant="outline">
          Back to Collections
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <SEO 
        title={`${product.name} - Luxury Bridal Wear in Kerala | Yaga Designs`}
        description={`Custom ${product.category} ${product.name} by Yaga Designs. Handcrafted luxury bridal couture available in Kothamangalam, Ernakulam, and throughout Kerala.`}
        keywords={`${product.name}, bridal ${product.category}, custom wedding wear Kerala, bridal boutique Ernakulam`}
        canonical={`https://yagadesigns.in/product/${product.$id}`}
        ogImage={getImageUrl(product.image_url)}
      />
      {/* ── Navigation Header (Mobile Only) ─────────────────────────── */}
      <div className="fixed top-20 left-4 right-4 z-40 flex justify-between items-center md:hidden">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              toggleFavorite(product);
              trackProductLike(product.$id, !liked);
            }}
            className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center"
          >
            <Heart className={`w-5 h-5 transition-colors ${liked ? "fill-primary text-primary" : "text-white"}`} />
          </button>
        </div>
      </div>

      <div className="container px-0 md:px-6 pt-24 md:pt-32 pb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">

          {/* ── Left Column: Gallery ─────────────────────────────────── */}
          <div className="relative group">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedVariant?.color || 'default'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden md:rounded-3xl relative cursor-zoom-in"
                ref={emblaRef}
                onClick={() => setIsZoomed(true)}
              >
                <div className="flex">
                  {images.map((img, idx) => (
                    <div key={idx} className="flex-[0_0_100%] min-w-0 relative aspect-[3/4] md:aspect-[4/5]">
                      <img
                        src={getImageUrl(img)}
                        alt={`${product.name} - View ${idx + 1}`}
                        className="w-full h-full object-cover"
                        loading={idx === 0 ? "eager" : "lazy"}
                      />
                    </div>
                  ))}
                </div>
                <div className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-5 h-5" />
                </div>
                {product.instagram_reel_link && (
                  <a
                    href={product.instagram_reel_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110"
                    style={{
                      background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)'
                    }}
                  >
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </a>
                )}
              </motion.div>
            </AnimatePresence>

            {/* ── Zoom / Lightbox ───────────────────────────────────── */}
            <AnimatePresence>
              {isZoomed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-10"
                  onClick={() => setIsZoomed(false)}
                >
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white z-[110]"
                    onClick={() => setIsZoomed(false)}
                  >
                    <CloseIcon className="w-6 h-6" />
                  </motion.button>

                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative max-w-5xl w-full h-full flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={getImageUrl(images[activeIndex])}
                      alt={product.name}
                      className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                    />
                  </motion.div>

                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4">
                    {images.length > 1 && images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => { e.stopPropagation(); scrollTo(idx); }}
                        className={`w-12 h-16 rounded-lg overflow-hidden border-2 transition-all ${idx === activeIndex ? "border-primary scale-110" : "border-white/10 opacity-40 hover:opacity-100"}`}
                      >
                        <img src={getImageUrl(images[idx])} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination / Dots */}
            {images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollTo(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeIndex ? "w-6 bg-primary" : "w-1.5 bg-white/40"
                      }`}
                  />
                ))}
              </div>
            )}

            {/* Lar            {/* ── Instagram Reel Cards — Desktop Left Column (9:16 ratio) ── */}
            {Array.isArray(product.reels) && product.reels.length > 0 && (
              <div className="hidden md:flex flex-col gap-8 mt-10">
                {product.reels.map((reel, idx) => (
                  reel.thumbnail && (
                    <motion.a
                      key={idx}
                      href={reel.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative rounded-2xl overflow-hidden group cursor-pointer w-full shadow-2xl"
                      style={{ aspectRatio: '9 / 16', width: '200px' }}
                    >
                      <img
                        src={reel.thumbnail}
                        alt={`Instagram Reel ${idx + 1}`}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/60 group-hover:from-black/5 group-hover:via-black/10 group-hover:to-black/50 transition-all duration-500" />
                      {/* Hover border glow */}
                      <div
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ boxShadow: 'inset 0 0 0 2px rgba(220,39,67,0.8)' }}
                      />
                      {/* Center play button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110"
                          style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}
                        >
                          <Play className="w-6 h-6 fill-white ml-0.5" />
                        </div>
                      </div>
                      {/* Top Instagram badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center"
                          style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}
                        >
                          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                          </svg>
                        </div>
                        <span className="text-white text-[10px] font-bold tracking-wider uppercase bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">Reel</span>
                      </div>
                      {/* Bottom label */}
                      <div className="absolute bottom-0 left-0 right-0 px-5 py-5 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-white font-bold text-xs">Watch on Instagram</p>
                      </div>
                    </motion.a>
                  )
                ))}
              </div>
            )}

            {/* Backward compatibility for single reel if no array exists */}
            {!Array.isArray(product.reels) && product.instagram_reel_link && product.reel_thumbnail && (
              <a
                href={product.instagram_reel_link}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:block relative mt-6 rounded-2xl overflow-hidden group cursor-pointer"
                style={{ aspectRatio: '9 / 16', width: '180px' }}
              >
                <img
                  src={product.reel_thumbnail}
                  alt="Instagram Reel"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110"
                    style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}
                  >
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                </div>
              </a>
            )}
          </div>     </svg>
                  </div>
                  <span className="text-white text-xs font-bold tracking-wider uppercase bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">Reel</span>
                </div>
                {/* Bottom label */}
                <div className="absolute bottom-0 left-0 right-0 px-5 py-5 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white font-bold text-sm">Watch Reel on Instagram</p>
                  <p className="text-white/50 text-[11px] mt-0.5">Tap to open in Instagram</p>
                </div>
              </a>
            )}
          </div>

          {/* ── Right Column: Info ──────────────────────────────────── */}
          <div className="px-6 md:px-0 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">
                <span className="w-8 h-px bg-primary/40" />
                {product.category}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading leading-tight mb-4 tracking-tight">
                {product.name}
              </h1>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Investment</span>
                <div className="text-2xl md:text-4xl font-heading text-primary flex items-baseline gap-2">
                  <span className="text-lg md:text-xl font-sans text-white/40 font-medium">Starting from</span>
                  {product.price ? (product.price.startsWith("₹") ? product.price : `₹${product.price}`) : "₹45,000"}
                </div>
                <p className="text-[10px] text-white/30 italic mt-1">*Final price depends on customization and measure</p>
              </div>
            </motion.div>

            {/* Color Swatches */}
            {variants.length > 0 && (
              <div className="space-y-5 pt-4">
                <div className="flex justify-between items-end">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">
                    Heritage Color: <span className="text-white ml-2">{selectedVariant?.color}</span>
                  </h3>
                </div>
                <div className="flex flex-wrap gap-4">
                  {variants.map((v) => (
                    <button
                      key={v.color}
                      onClick={() => setSelectedVariant(v)}
                      className="group relative"
                    >
                      <div
                        className={`w-14 h-14 rounded-full border-2 transition-all duration-500 overflow-hidden ${selectedVariant?.color === v.color
                          ? "border-primary scale-110 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                          : "border-white/10 hover:border-white/40"
                          }`}
                      >
                        {v.thumbnail ? (
                          <img src={getImageUrl(v.thumbnail)} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-white/5 flex items-center justify-center text-[10px] font-bold uppercase">
                            {v.color.substring(0, 2)}
                          </div>
                        )}
                      </div>
                      {selectedVariant?.color === v.color && (
                        <motion.div
                          layoutId="swatch-glow"
                          className="absolute -inset-1 rounded-full border border-primary/20 blur-sm pointer-events-none"
                        />
                      )}
                    </button>
                  ))}

                  {/* Custom Swatch Option */}
                  <button
                    onClick={handleWhatsAppEnquiry}
                    className="flex flex-col items-center justify-center w-14 h-14 rounded-full border-2 border-dashed border-white/20 hover:border-white/40 transition-all text-white/40 hover:text-white"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="text-[8px] font-bold uppercase mt-0.5">Custom</span>
                  </button>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <p className="text-white/60 leading-relaxed text-lg font-light">
                {product.description}
              </p>
            </div>

            {/* Customization Messaging (IMPORTANT) */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Scissors className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-heading text-xl text-white">Fully Customizable Design</h4>
                  <p className="text-sm text-white/50 mt-1">Our artisans can tailor this piece to your specific color preferences and silhouette needs.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-heading text-xl text-white">Made-to-Measure Available</h4>
                  <p className="text-sm text-white/50 mt-1">Get the perfect fit with our bespoke stitching service. Simply share your measurements after booking.</p>
                </div>
              </div>
            </div>

            {/* Product Details Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 pt-4">
              {[
                { label: "Fabric", value: product.fabric },
                { label: "Embroidery", value: product.embroidery },
                { label: "Occasion", value: product.occasion },
                { label: "Stitching", value: "Available" }
              ].map((item, idx) => (
                <div key={idx} className={item.value ? "" : "opacity-30"}>
                  <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1 font-bold">{item.label}</div>
                  <div className="text-sm font-medium text-white/80">{item.value || "Not Specified"}</div>
                </div>
              ))}
            </div>

            {/* Features / Badges */}
            <div className="flex flex-wrap gap-3 pt-6">
              {[
                { icon: ShieldCheck, label: "Handmade" },
                { icon: ShieldCheck, label: "Premium Quality" },
                { icon: ShieldCheck, label: "Custom Fit" }
              ].map((tag, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                  <tag.icon className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white/60">{tag.label}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons (Desktop Only) */}
            <div className="hidden md:flex flex-col gap-4 pt-12">
              <div className="flex gap-4">
                <Button
                  onClick={handleWhatsAppEnquiry}
                  className="flex-1 py-10 rounded-2xl text-xl gap-3 font-bold bg-primary hover:bg-primary/90 text-black shadow-[0_20px_40px_rgba(212,175,55,0.15)] transition-all hover:-translate-y-1 active:scale-[0.98]"
                >
                  <MessageCircle className="w-6 h-6 fill-black" />
                  Enquire via WhatsApp
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    toggleFavorite(product);
                    trackProductLike(product.$id, !liked);
                  }}
                  className={`w-20 h-20 rounded-2xl border-white/10 transition-all ${liked ? "bg-primary/10 border-primary/30" : "hover:bg-white/5"}`}
                >
                  <Heart className={`w-8 h-8 ${liked ? "fill-primary text-primary" : "text-white/60"}`} />
                </Button>
              </div>

              {/* Reel buttons — shown only when no thumbnails in the new reels array */}
              {Array.isArray(product.reels) && product.reels.map((reel, idx) => (
                !reel.thumbnail && reel.link && (
                  <a
                    key={idx}
                    href={reel.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-5 rounded-2xl text-lg font-bold text-white flex items-center justify-center gap-3 transition-all hover:-translate-y-1 active:scale-[0.98] shadow-lg mb-4"
                    style={{
                      background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)'
                    }}
                  >
                    <Play className="w-5 h-5 fill-white" />
                    Watch Reel {idx + 1}
                  </a>
                )
              ))}

              {/* Backward compatibility single reel button */}
              {!Array.isArray(product.reels) && product.instagram_reel_link && !product.reel_thumbnail && (
                <a
                  href={product.instagram_reel_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-5 rounded-2xl text-lg font-bold text-white flex items-center justify-center gap-3 transition-all hover:-translate-y-1 active:scale-[0.98] shadow-lg"
                  style={{
                    background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)'
                  }}
                >
                  <Play className="w-5 h-5 fill-white" />
                  Watch Reel on Instagram
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-8 left-6 right-6 z-50">
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="flex flex-col gap-3"
        >
          {Array.isArray(product.reels) && product.reels.length > 0 && (
            <div className="flex flex-col gap-3 max-h-[30vh] overflow-y-auto no-scrollbar">
              {product.reels.map((reel, idx) => (
                reel.thumbnail ? (
                  /* ── Mobile Reel Preview Card (9:16) ─── */
                  <a
                    key={idx}
                    href={reel.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block rounded-2xl overflow-hidden group w-full shrink-0"
                    style={{ aspectRatio: '9 / 16', maxHeight: '35vh' }}
                  >
                    <img
                      src={reel.thumbnail}
                      alt={`Instagram Reel ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
                    
                    {/* Instagram badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}
                      >
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                        </svg>
                      </div>
                      <span className="text-white text-[10px] font-bold tracking-wider uppercase bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">Reel</span>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center shadow-2xl"
                        style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}
                      >
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/90 to-transparent">
                      <span className="text-white text-xs font-bold">Watch Reel {idx + 1}</span>
                    </div>
                  </a>
                ) : (
                  <a
                    key={idx}
                    href={reel.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 rounded-[2rem] text-white flex items-center justify-center gap-2 font-bold text-sm shadow-lg active:scale-[0.98] transition-transform"
                    style={{
                      background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)'
                    }}
                  >
                    <Play className="w-4 h-4 fill-white" />
                    Watch Instagram Reel {idx + 1}
                  </a>
                )
              ))}
            </div>
          )}

          {/* Fallback for single reel link (backward compatibility) */}
          {!Array.isArray(product.reels) && product.instagram_reel_link && (
            product.reel_thumbnail ? (
              /* ── Mobile Reel Preview Card (9:16) ─── */
              <a
                href={product.instagram_reel_link}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block rounded-2xl overflow-hidden group w-full mb-2"
                style={{ aspectRatio: '9 / 16', maxHeight: '40vh' }}
              >
                <img
                  src={product.reel_thumbnail}
                  alt="Instagram Reel preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
                
                {/* Instagram badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  </div>
                  <span className="text-white text-[10px] font-bold tracking-wider uppercase bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">Reel</span>
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shadow-2xl"
                    style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}
                  >
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/90 to-transparent">
                  <span className="text-white text-xs font-bold">Watch Reel on Instagram</span>
                </div>
              </a>
            ) : (
              /* ── Mobile Gradient Button Fallback ─── */
              <a
                href={product.instagram_reel_link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-[2rem] text-white flex items-center justify-center gap-2 font-bold text-sm shadow-lg active:scale-[0.98] transition-transform"
                style={{
                  background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)'
                }}
              >
                <Play className="w-4 h-4 fill-white" />
                Watch Instagram Reel
              </a>
            )
          )}
          <div className="bg-primary p-1 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
            <Button
              onClick={handleWhatsAppEnquiry}
              className="w-full py-9 rounded-[2.25rem] bg-black text-white hover:bg-[#111] border-none text-lg font-bold gap-3 active:scale-[0.98] transition-transform"
            >
              <MessageCircle className="w-6 h-6 text-primary fill-primary" />
              Enquire on WhatsApp
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
