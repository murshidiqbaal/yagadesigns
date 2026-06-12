
import { useFavorites } from "@/hooks/useFavorites";
import { Grid, Heart, Home, Mail, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function MobileBottomNav() {
  const pathname = useLocation().pathname;
  const { favorites } = useFavorites();
  const { user } = useAuth();


  // Hide in Admin views
  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass border-t border-white/10 pb-safe">
      <div className="flex items-center justify-around px-2 py-3">
        <Link to="/" className="flex flex-col items-center gap-1 group">
          <Home className={`w-5 h-5 transition-colors ${pathname === "/" ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} strokeWidth={pathname === "/" ? 2.5 : 2} />
          <span className={`text-[10px] font-medium tracking-wide ${pathname === "/" ? "text-primary" : "text-muted-foreground"}`}>Home</span>
        </Link>
        <Link to="/collections" className="flex flex-col items-center gap-1 group">
          <Grid className={`w-5 h-5 transition-colors ${pathname === "/collections" ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} strokeWidth={pathname === "/collections" ? 2.5 : 2} />
          <span className={`text-[10px] font-medium tracking-wide ${pathname === "/collections" ? "text-primary" : "text-muted-foreground"}`}>Collections</span>
        </Link>
        <Link to="/my-orders" className="flex flex-col items-center gap-1 group">
          <ShoppingBag className={`w-5 h-5 transition-colors ${pathname === "/my-orders" ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} strokeWidth={pathname === "/my-orders" ? 2.5 : 2} />
          <span className={`text-[10px] font-medium tracking-wide ${pathname === "/my-orders" ? "text-primary" : "text-muted-foreground"}`}>Orders</span>
        </Link>
        <Link to="/favorites" className="flex flex-col items-center gap-1 group relative">
          <Heart className={`w-5 h-5 transition-colors ${pathname === "/favorites" ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} strokeWidth={pathname === "/favorites" ? 2.5 : 2} />
          {favorites.length > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-primary text-primary-foreground text-[8px] font-bold px-1.5 py-0.5 rounded-full min-w-4 text-center">
              {favorites.length}
            </span>
          )}
          <span className={`text-[10px] font-medium tracking-wide ${pathname === "/favorites" ? "text-primary" : "text-muted-foreground"}`}>Favorites</span>
        </Link>
        <Link to="/contact" className="flex flex-col items-center gap-1 group">
          <Mail className={`w-5 h-5 transition-colors ${pathname === "/contact" ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} strokeWidth={pathname === "/contact" ? 2.5 : 2} />
          <span className={`text-[10px] font-medium tracking-wide ${pathname === "/contact" ? "text-primary" : "text-muted-foreground"}`}>Contact</span>
        </Link>
      </div>
    </nav>
  );
}


