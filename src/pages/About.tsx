import { motion } from 'framer-motion';
import { Sparkles, Heart, Star } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PILLARS = [
  {
    icon: Sparkles,
    title: 'Our Vision',
    description:
      "To become India's most loved bridal design house — where every bride leaves with confidence, elegance, and a piece of art she will cherish forever.",
  },
  {
    icon: Heart,
    title: 'Our Values',
    description:
      'Love is in every stitch. We believe in honest craftsmanship, joyful collaboration, and creating garments that carry the emotions of your most precious moments.',
  },
  {
    icon: Star,
    title: 'Craftsmanship',
    description:
      'Our master artisans bring decades of expertise to every design. From intricate zardosi embroidery to delicate lace work, perfection is our only standard.',
  },
];

const STATS = [
  { value: '200+', label: 'Happy Brides' },
  { value: '500+', label: 'Designs Created' },
  { value: '5+', label: 'Years of Craft' },
];

export default function About() {
  return (
    <div className="site-shell min-h-screen">
      <Header />
      <main>
        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="pt-36 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-[#D4AF37]/5 blur-[120px]" />
          </div>
          <div className="container relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#D4AF37] mb-6 block">
                Our Story
              </span>
              <h1 className="font-heading text-5xl md:text-7xl font-medium text-white mb-6">
                Born From a
                <br />
                <span className="text-gradient italic">Bride's Dream</span>
              </h1>
              <p className="text-white/45 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                Yaga Designs was founded with a single belief — that every bride deserves to feel
                extraordinary on her most special day.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Story Section ─────────────────────────────────────── */}
        <section className="py-20 bg-[#080808]">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Visual */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9 }}
              >
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-[#1A1200] to-[#0A0A0A] border border-[#D4AF37]/10">
                  {/* Decorative */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-heading text-[250px] text-[#D4AF37]/[0.04] italic select-none leading-none">
                      Y
                    </span>
                  </div>
                  {/* Ornament lines */}
                  <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-[#D4AF37]/25" />
                  <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-[#D4AF37]/25" />
                  {/* Quote */}
                  <div className="absolute bottom-0 inset-x-0 px-8 pb-8 pt-20 bg-gradient-to-t from-black/90 to-transparent">
                    <p className="font-heading text-xl text-white/90 italic leading-snug">
                      "Crafting dreams, one stitch at a time."
                    </p>
                    <p className="text-xs text-[#D4AF37]/60 uppercase tracking-widest mt-2">
                      — Yaga Designs
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Text */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9 }}
                className="space-y-7"
              >
                <div>
                  <h2 className="font-heading text-3xl md:text-4xl text-white mb-4">
                    The Brand Story
                  </h2>
                  <p className="text-white/45 leading-relaxed">
                    Yaga Designs began as a passion project — born out of a founder's desire to create
                    bridal wear that speaks to the soul. We saw brides compromising on their vision due
                    to limited choices, and we decided to change that.
                  </p>
                </div>
                <p className="text-white/45 leading-relaxed">
                  Today, every piece we create is a labour of love. From the first sketch to the final
                  fitting, we walk alongside each bride to ensure her outfit is nothing short of
                  perfection — because you deserve nothing less.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-2">
                  {STATS.map(stat => (
                    <div
                      key={stat.label}
                      className="text-center p-5 rounded-2xl bg-[#111]/60 border border-white/5 hover:border-[#D4AF37]/20 transition-all duration-300"
                    >
                      <div className="font-heading text-2xl text-[#D4AF37]">{stat.value}</div>
                      <div className="text-[10px] text-white/35 uppercase tracking-widest mt-1.5">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Vision, Values, Craftsmanship ─────────────────────── */}
        <section className="py-20 bg-[#050505]">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#D4AF37] mb-4 block">
                What We Stand For
              </span>
              <h2 className="font-heading text-4xl md:text-5xl font-medium text-white">
                Our Pillars
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PILLARS.map((pillar, i) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.15 }}
                  className="group p-8 rounded-2xl bg-[#111]/50 border border-white/5 hover:border-[#D4AF37]/25 transition-all duration-500"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center mb-6 group-hover:bg-[#D4AF37]/20 transition-all duration-300">
                    <pillar.icon className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <h3 className="font-heading text-xl text-white mb-3">{pillar.title}</h3>
                  <p className="text-sm text-white/45 leading-relaxed">{pillar.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
