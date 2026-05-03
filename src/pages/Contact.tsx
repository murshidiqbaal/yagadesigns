import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { getWhatsAppUrl } from '@/lib/constants';
import { motion } from 'framer-motion';
import { Clock, Instagram, MapPin, MessageCircle, Phone } from 'lucide-react';
import SEO from '@/components/SEO';

const CONTACT_ITEMS = [
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 96332 70639',
    sub: 'Mon – Sat, 10am – 7pm',
    color: 'text-[#D4AF37]',
    bg: 'bg-[#D4AF37]/10',
    border: 'border-white/5',
    href: 'tel:+919633270639',
  },
  {
    icon: MapPin,
    label: 'Kothamangalam, Kerala',
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
    value: '@yaga_designs',
    sub: 'Follow our latest creations',
    color: 'text-[#F6C67A]',
    bg: 'bg-[#F6C67A]/10',
    border: 'border-white/5',
    href: 'https://instagram.com/yaga_designs',
  },
];

export default function Contact() {
  return (
    <div className="site-shell min-h-screen">
      <SEO 
        title="Contact Yaga Designs | Best Bridal Boutique in Kothamangalam"
        description="Book a consultation with Yaga Designs in Kothamangalam. We offer premium bridal styling and custom lehengas in Ernakulam, Muvattupuzha, and nearby areas."
        keywords="contact bridal designer Kerala, bridal studio Kothamangalam, wedding designer Ernakulam"
        canonical="https://yagadesigns.in/contact"
      />
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

            {/* ── Map Embed ───────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12 rounded-2xl overflow-hidden border border-white/10 h-80 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
            >
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15712.964406184518!2d76.6138676554199!3d10.058782399999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b07e5399c54e539%3A0x954e539c54e539c5!2sKothamangalam%2C%20Kerala!5e0!3m2!1sen!2sin!4v1714763134512!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Yaga Designs Location"
              ></iframe>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
