import logoImg from '@/assets/logo.png';
import { getWhatsAppUrl, SITE_NAME } from '@/lib/constants';
import { Heart, Instagram, MessageCircle, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const NAV = [
  ['Home', '/'],
  ['Collections', '/collections'],
  ['Favorites', '/favorites'],
  ['About', '/about'],
  ['Contact', '/contact'],
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#070707] pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-white/5">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <img
                src={logoImg}
                alt="Yaga Designs"
                className="h-14 w-auto mix-blend-screen opacity-80 hover:opacity-100 transition-opacity duration-300"
              />
            </Link>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              Luxury bridal couture crafted with devotion. Every piece tells a story of love, elegance, and artistry.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/25 mb-5">
              Navigate
            </p>
            <div className="flex flex-col gap-3">
              {NAV.map(([label, to]) => (
                <Link
                  key={to}
                  to={to}
                  className="text-sm text-white/50 hover:text-[#D4AF37] transition-colors duration-300"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/25 mb-5">
              Connect
            </p>
            <div className="flex flex-col gap-3">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/25 text-[#25D366] text-sm font-bold hover:bg-[#25D366]/20 hover:border-[#25D366]/50 transition-all duration-300"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Enquiry
              </a>
              <a 
                href="tel:+919633270639"
                className="flex items-center gap-3 text-sm text-white/40 px-1 mt-1 hover:text-[#D4AF37] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#D4AF37]/60" />
                <span>+91 96332 70639</span>
              </a>
              <a 
                href="https://www.instagram.com/yaga_designs/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-white/40 px-1 hover:text-[#D4AF37] transition-colors"
              >
                <Instagram className="w-4 h-4 text-[#D4AF37]/60" />
                <span>@yaga_designs</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/25 uppercase tracking-widest">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-white/20 flex items-center gap-1.5">
            Crafted with{' '}
            <Heart className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
            {' '}for your perfect moment
          </p>
        </div>
      </div>
    </footer>
  );
}
