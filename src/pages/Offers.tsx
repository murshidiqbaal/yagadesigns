import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { getOffers, Offer } from "@/lib/appwrite";
import { Zap, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Offers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const allOffers = await getOffers();
        const active = allOffers.filter((o) => o.isActive);
        setOffers(active);
      } catch (error) {
        console.error("Failed to load offers:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <SEO
        title="Exclusive Offers & Campaigns - Yaga Designs"
        description="Discover active offers, seasonal design showcases, and atelier packages at Yaga Designs."
      />
      <Header />

      <main className="flex-grow container max-w-4xl px-4 pt-28 pb-24">
        {/* Header */}
        <div className="mb-12">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Zap className="text-primary w-6 h-6 animate-pulse" />
            <span className="text-xs text-[#D4AF37] font-bold uppercase tracking-[0.22em]">Atelier Privileges</span>
          </div>
          <h1 className="text-4xl font-heading font-normal tracking-wide mt-1">Special Campaigns</h1>
          <p className="text-xs text-white/50 mt-1">Explore current offers, exclusive seasonal capsules, and tailored bridal services.</p>
        </div>

        {/* Offers Grid/List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Gathering active privileges...</p>
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center py-20 px-6 rounded-3xl bg-white/[0.01] border border-dashed border-white/10 backdrop-blur-md">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
              <Sparkles className="w-6 h-6 text-white/20" />
            </div>
            <h3 className="text-xl font-heading font-normal text-white">No active campaigns</h3>
            <p className="text-sm text-white/40 max-w-xs mx-auto mt-2 leading-relaxed">
              We don't have any active offers at this moment. Please check back later or explore our core collections.
            </p>
            <div className="mt-8">
              <Link to="/collections">
                <Button className="bg-primary text-black font-bold uppercase tracking-wider rounded-xl px-8 py-5 text-xs transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-[1.02] cursor-pointer">
                  Browse Collections
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <AnimatePresence>
              {offers.map((offer, index) => (
                <motion.div
                  key={offer.$id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-[2.5rem] bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5 hover:border-[#D4AF37]/20 transition-all duration-500 overflow-hidden flex flex-col md:flex-row shadow-[0_15px_45px_rgba(0,0,0,0.4)] group"
                >
                  {/* Offer Image */}
                  <div className="w-full md:w-1/2 aspect-video md:aspect-[4/5] bg-white/5 shrink-0 relative overflow-hidden">
                    {offer.image_url ? (
                      <img
                        src={offer.image_url}
                        alt={offer.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-white/10 border-b md:border-b-0 md:border-r border-white/5">
                        <Zap className="w-16 h-16 stroke-[1.2] opacity-30" />
                        <span className="text-[9px] uppercase tracking-[0.3em] font-bold mt-3">Seasonal Gown</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent md:hidden" />
                  </div>

                  {/* Content details */}
                  <div className="flex-1 p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full pointer-events-none" />
                    
                    <div className="space-y-4 z-10">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
                        <Zap className="w-3 h-3 fill-primary animate-pulse" />
                        <span className="text-[8px] font-bold uppercase tracking-widest pt-0.5">Campaign Active</span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-heading leading-tight tracking-wide text-white">
                        {offer.title}
                      </h2>
                      {offer.subtitle && (
                        <p className="text-white/50 text-xs md:text-sm font-medium tracking-wide leading-relaxed">
                          {offer.subtitle}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-white/5 z-10">
                      {offer.link ? (
                        <Button asChild className="h-12 px-6 rounded-xl text-xs font-bold uppercase tracking-wider group bg-primary text-black hover:bg-primary/95 transition-all shadow-[0_5px_15px_rgba(212,175,55,0.15)] cursor-pointer">
                          <Link to={offer.link}>
                            {offer.button_text || "Discover Now"}
                            <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      ) : (
                        <div className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold py-3">
                          Visit our showroom to redeem
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
