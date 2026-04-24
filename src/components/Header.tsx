import logoImg from '@/assets/logoyaga.png';
import { useFavorites } from '@/hooks/useFavorites';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Collections', to: '/collections' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { favorites } = useFavorites();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? 'bg-black/10 backdrop-blur-md border-b border-white/10 py-4 shadow-sm'
          : 'bg-transparent py-6'
        }`}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative h-10 w-10 overflow-hidden flex items-center justify-center rounded-sm">
            <img
              src={logoImg}
              alt="Yaga Designs"
              className="absolute top-[-6px] h-12 w-auto max-w-none mix-blend-screen opacity-95 group-hover:opacity-100 transition-opacity duration-300"
            />
          </div>
          <div className="flex flex-col justify-center mt-1">
            <span
              className="text-[28px] leading-none uppercase font-normal"
              style={{
                fontFamily: '"Optima", "Segoe UI", "Helvetica Neue", sans-serif',
                background: 'linear-gradient(180deg, #FBF5B7 0%, #D4AF37 45%, #8B6914 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.5))'
              }}
            >
              Yaga
            </span>
            <div className="w-full flex justify-between items-center mt-[2px] px-[1px]">
              {"DESIGNING STUDIO".split('').map((char, i) => (
                <span
                  key={i}
                  className="text-[5px] uppercase font-semibold"
                  style={{
                    background: char !== ' ' ? 'linear-gradient(180deg, #FFFFFF 0%, #D4AF37 100%)' : 'none',
                    WebkitBackgroundClip: char !== ' ' ? 'text' : 'border-box',
                    WebkitTextFillColor: char !== ' ' ? 'transparent' : 'currentColor',
                    filter: char !== ' ' ? 'drop-shadow(0px 1px 1px rgba(0,0,0,0.8))' : 'none'
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-xs font-bold uppercase tracking-widest transition-colors duration-300 relative group ${isActive(link.to) ? 'text-[#D4AF37]' : 'text-white/60 hover:text-white'
                }`}
            >
              {link.label}
              <span
                className={`absolute -bottom-1 left-0 h-px bg-[#D4AF37] transition-all duration-300 ${isActive(link.to) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
              />
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/favorites"
            id="nav-favorites"
            className="relative p-2 group"
            title="My Favorites"
          >
            <motion.div
              animate={{ scale: favorites.length > 0 ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              <Heart
                className={`w-5 h-5 transition-all duration-300 ${favorites.length > 0
                  ? 'fill-[#D4AF37] text-[#D4AF37]'
                  : 'text-white/60 group-hover:text-[#D4AF37]'
                  }`}
              />
            </motion.div>
            <AnimatePresence>
              {favorites.length > 0 && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D4AF37] text-black text-[10px] font-bold flex items-center justify-center leading-none"
                >
                  {favorites.length}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          <button
            id="nav-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#0B0B0B]/98 backdrop-blur-xl border-t border-white/5"
          >
            <div className="container py-6 flex flex-col gap-1">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-bold uppercase tracking-widest py-3 border-b border-white/5 transition-colors ${isActive(link.to) ? 'text-[#D4AF37]' : 'text-white/60'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/favorites"
                className="text-sm font-bold uppercase tracking-widest py-3 text-white/60 flex items-center gap-2"
              >
                <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'fill-[#D4AF37] text-[#D4AF37]' : ''}`} />
                Favorites
                {favorites.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#D4AF37] text-black text-[10px] font-bold">
                    {favorites.length}
                  </span>
                )}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
