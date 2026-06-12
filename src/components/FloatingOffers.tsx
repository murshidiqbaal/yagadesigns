import { Zap } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getActiveOffer } from "@/lib/appwrite";

export default function FloatingOffers() {
  const { pathname } = useLocation();
  const [hasActiveOffer, setHasActiveOffer] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const activeOffer = await getActiveOffer();
        if (activeOffer) {
          setHasActiveOffer(true);
        }
      } catch (e) {
        console.error("Failed to check active offer for floating icon:", e);
      }
    })();
  }, []);

  // Hide in Admin views
  if (pathname?.startsWith("/admin")) return null;
  // If there are no active offers, hide it
  if (!hasActiveOffer) return null;

  return (
    <Link
      to="/offers"
      className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 p-4 bg-primary text-black rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
      aria-label="View Active Campaigns & Offers"
    >
      <Zap className="w-6 h-6 md:w-7 md:h-7 fill-black animate-pulse" />
      {/* Tooltip */}
      <span className="absolute right-full mr-3 bg-black/90 border border-[#D4AF37]/30 text-[#D4AF37] font-bold text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-2xl">
        Active Offers Live
      </span>
    </Link>
  );
}
