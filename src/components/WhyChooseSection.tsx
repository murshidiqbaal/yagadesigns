import { motion } from 'framer-motion';
import { Scissors, Star, Heart } from 'lucide-react';

const FEATURES = [
  {
    icon: Scissors,
    title: 'Custom Designs',
    description:
      'Every outfit is uniquely tailored to bring your vision to life. No two pieces are ever alike — your style, your way.',
  },
  {
    icon: Star,
    title: 'Premium Fabrics',
    description:
      'We source only the finest silks, satins, georgettes, and banarasi weaves for an exquisite drape and feel.',
  },
  {
    icon: Heart,
    title: 'Handcrafted Quality',
    description:
      'Each stitch is placed with intention by master artisans. From zardosi to lacework, perfection is our standard.',
  },
];

export default function WhyChooseSection() {
  return (
    <section className="py-28 bg-[#080808] relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#D4AF37]/3 blur-[120px]" />
      </div>

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#D4AF37] mb-4 block">
            Why Us
          </span>
          <h2 className="font-heading text-4xl md:text-6xl font-medium text-white">
            The Yaga Promise
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className="group p-8 rounded-2xl bg-[#111]/60 border border-white/5 hover:border-[#D4AF37]/25 hover:bg-[#111]/90 transition-all duration-500 text-center"
            >
              <div className="w-14 h-14 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-[#D4AF37]/20 group-hover:scale-105 transition-all duration-300">
                <feature.icon className="w-7 h-7 text-[#D4AF37]" />
              </div>
              <h3 className="font-heading text-xl text-white mb-3">{feature.title}</h3>
              <p className="text-sm text-white/45 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
