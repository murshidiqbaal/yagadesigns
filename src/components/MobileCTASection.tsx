import { getWhatsAppUrl } from '@/lib/constants';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function MobileCTASection() {
  return (
    <section className="py-20 bg-[#050505] relative" style={{ overflowX: 'hidden', width: '100%', maxWidth: '100vw' }}>
      {/* Lightweight static glow — no animation for mobile perf */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[80vw] h-[50vw] rounded-full bg-[#D4AF37]/6 blur-[90px]" />
      </div>

      <div className="relative z-10 px-5" style={{ width: '100%', boxSizing: 'border-box' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85 }}
          className="text-center"
        >
          {/* Ornament */}
          <div className="flex items-center justify-center gap-3 mb-7">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#D4AF37]/45" />
            <span className="text-[#D4AF37]/45 text-base">✦</span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#D4AF37]/45" />
          </div>

          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4AF37] mb-5">
            Begin Your Journey
          </p>

          <h2
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            className="text-[2.4rem] leading-[1.05] font-light text-white mb-1"
          >
            Enquire Your
          </h2>
          <h2
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            className="text-[2.4rem] leading-[1.05] font-light text-gradient italic mb-7"
          >
            Bridal Design
          </h2>

          <p className="text-white/40 text-[13px] leading-relaxed mb-10 max-w-xs mx-auto">
            Let us create the outfit you've always dreamed of. Reach out for a personal consultation — no obligation.
          </p>

          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            id="mobile-cta-whatsapp"
            className="flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] text-white text-[11px] font-bold uppercase tracking-widest rounded-full active:scale-[0.97] transition-transform duration-200"
          >
            <MessageCircle className="w-4 h-4" />
            Chat on WhatsApp
          </a>

          {/* Sub-note */}
          <p className="text-white/20 text-[9px] uppercase tracking-[0.3em] mt-5">
            Free consultation · No commitment
          </p>
        </motion.div>
      </div>
    </section>
  );
}
