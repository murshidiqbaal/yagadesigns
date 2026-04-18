import { motion } from 'framer-motion';
import { MessageCircle, Phone, MapPin, Instagram, Clock } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/constants';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CONTACT_ITEMS = [
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 98765 43210',
    sub: 'Mon – Sat, 10am – 7pm',
    color: 'text-[#D4AF37]',
    bg: 'bg-[#D4AF37]/10',
    border: 'border-white/5',
    href: 'tel:+919876543210',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'India',
    sub: 'Home consultations & studio visits available',
    color: 'text-[#D4AF37]',
    bg: 'bg-[#D4AF37]/10',
    border: 'border-white/5',
    href: null,
  },
  {
    icon: Clock,
    label: 'Working Hours',
    value: 'Mon – Sat',
    sub: '10:00 AM – 7:00 PM IST',
    color: 'text-[#D4AF37]',
    bg: 'bg-[#D4AF37]/10',
    border: 'border-white/5',
    href: null,
  },
  {
    icon: Instagram,
    label: 'Instagram',
    value: '@yagadesigns',
    sub: 'Follow our latest creations',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-white/5',
    href: 'https://instagram.com/yagadesigns',
  },
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />
      <main className="pt-28 pb-24">
        <div className="container">
          {/* ── Page Header ──────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#D4AF37] mb-4 block">
              Get In Touch
            </span>
            <h1 className="font-heading text-5xl md:text-7xl font-medium text-white">
              Contact Us
            </h1>
            <p className="text-white/35 mt-4 max-w-md mx-auto text-sm leading-relaxed">
              We'd love to hear about your dream bridal look. Reach out to us anytime — we're here to help.
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto space-y-5">
            {/* ── Primary WhatsApp CTA ──────────────────────────── */}
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              id="contact-whatsapp"
              className="flex items-center gap-6 p-8 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/15 hover:border-[#25D366]/55 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-xl bg-[#25D366]/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                <MessageCircle className="w-7 h-7 text-[#25D366]" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#25D366]/70 mb-1">
                  WhatsApp — Preferred
                </p>
                <p className="font-heading text-2xl text-white group-hover:text-[#25D366] transition-colors duration-300">
                  Chat with us
                </p>
                <p className="text-sm text-white/35 mt-1">
                  We typically reply within minutes
                </p>
              </div>
              <span className="text-[#25D366]/40 group-hover:text-[#25D366] group-hover:translate-x-1 transition-all duration-300 text-xl">
                →
              </span>
            </motion.a>

            {/* ── Other Contact Items ───────────────────────────── */}
            {CONTACT_ITEMS.map((item, i) => {
              const Wrapper = item.href ? 'a' : 'div';
              const wrapperProps = item.href
                ? { href: item.href, target: '_blank', rel: 'noopener noreferrer' }
                : {};

              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                >
                  <Wrapper
                    {...(wrapperProps as any)}
                    className={`flex items-center gap-6 p-7 rounded-2xl bg-[#111]/60 border ${item.border} hover:border-[#D4AF37]/20 transition-all duration-300 group ${item.href ? 'cursor-pointer' : ''}`}
                  >
                    <div className={`w-13 h-13 w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-1">
                        {item.label}
                      </p>
                      <p className="font-heading text-xl text-white">{item.value}</p>
                      <p className="text-sm text-white/35 mt-0.5">{item.sub}</p>
                    </div>
                  </Wrapper>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
