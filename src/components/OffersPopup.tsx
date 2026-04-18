import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Zap } from "lucide-react";
import { getActiveOffer, Offer } from "@/lib/appwrite";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export default function OffersPopup() {
  const [offer, setOffer] = useState<Offer | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session storage to see if we've already shown it this session
    const hasShown = sessionStorage.getItem("yaga_offer_shown");
    
    (async () => {
      try {
        const activeOffer = await getActiveOffer();
        if (activeOffer && !hasShown) {
          setOffer(activeOffer);
          // Small delay before showing the popup for better UX
          setTimeout(() => setIsOpen(true), 2500);
        }
      } catch (error) {
        console.error("Popup error:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("yaga_offer_shown", "true");
  };

  if (loading || !offer) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl bg-[#0A0A0A] rounded-[2.5rem] border border-white/10 overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-black/60 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col md:flex-row min-h-[460px]">
              {/* Media Section */}
              <div className="w-full md:w-1/2 relative bg-[#111]">
                {offer.image_url ? (
                  <>
                    <img
                      src={offer.image_url}
                      alt={offer.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden" />
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center text-primary/20">
                    <Zap className="w-24 h-24 mb-4 opacity-10" />
                    <p className="text-[10px] uppercase font-bold tracking-[0.4em]">Seasonal Design</p>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center relative overflow-hidden">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
                    <Zap className="w-3 h-3 fill-primary" />
                    <span className="text-[9px] font-bold uppercase tracking-widest leading-none pt-0.5">Yaga Exclusive</span>
                  </div>

                  <h2 className="text-3xl md:text-5xl font-heading mb-4 leading-[1.1]">
                    {offer.title}
                  </h2>
                  
                  {offer.subtitle && (
                    <p className="text-white/50 text-sm md:text-base mb-10 font-medium tracking-wide leading-relaxed">
                      {offer.subtitle}
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    {offer.link ? (
                      <Button asChild className="h-14 px-8 rounded-xl text-md font-bold group shadow-[0_10px_20px_rgba(212,175,55,0.2)]">
                        <Link to={offer.link} onClick={handleClose}>
                          {offer.button_text || "Discover Collection"}
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    ) : (
                      <Button onClick={handleClose} className="h-14 px-8 rounded-xl text-md font-bold group">
                        {offer.button_text || "Close"}
                      </Button>
                    )}
                    
                    <button 
                      onClick={handleClose}
                      className="h-14 px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 hover:text-white/60 transition-colors"
                    >
                      Maybe Later
                    </button>
                  </div>
                </div>

                {/* Bottom Detail */}
                <div className="mt-12 pt-8 border-t border-white/5">
                  <p className="text-[9px] text-white/20 font-bold uppercase tracking-[0.3em]">
                    Bespoke Bridal Couture • Kerala, India
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
