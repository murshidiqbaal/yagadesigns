import { getWhatsAppUrl } from '@/lib/constants';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-28 bg-[#050505] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.06, 1], opacity: [0.04, 0.08, 0.04] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[min(700px,100vw)] h-[min(500px,80vw)] rounded-full bg-[#D4AF37] blur-[150px]"
        />
      </div>

      <div className="luxe-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Divider ornament */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]/50" />
            <span className="text-[#D4AF37]/50 text-lg">✦</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]/50" />
          </div>

          <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#D4AF37] mb-6">
            Begin Your Journey
          </p>

          <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-medium text-white mb-4">
            Enquire Your
          </h2>
          <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-medium text-gradient italic mb-8">
            Bridal Design
          </h2>

          <p className="text-white/45 max-w-md mx-auto text-base md:text-lg leading-relaxed mb-12">
            Let us create the outfit you've always dreamed of. Reach out for a personal consultation — no obligation.
          </p>

          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            id="cta-whatsapp"
            className="inline-flex items-center gap-3 px-12 py-5 bg-[#25D366] text-white text-sm font-bold uppercase tracking-widest rounded-full hover:bg-[#20BD5C] hover:shadow-[0_0_50px_rgba(37,211,102,0.35)] transition-all duration-300"
          >
            <MessageCircle className="w-5 h-5" />
            Chat on WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}
