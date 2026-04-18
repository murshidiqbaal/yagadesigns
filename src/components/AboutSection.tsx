import aboutImg from '@/assets/about.jpg';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';



export default function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="relative py-32 grain-overlay">
      <div className="container mx-auto px-6">
        <div ref={ref} className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, clipPath: 'inset(100% 0 0 0)' }}
            whileInView={{ opacity: 1, clipPath: 'inset(0 0 0 0)' }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
            className="relative overflow-hidden group"
          >
            <motion.div
              initial={{ scale: 1.2 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
            >
              <img
                src={aboutImg}
                alt="Yaga Designs luxury bridal wear"
                loading="lazy"
                width={800}
                height={1000}
                className="w-full object-cover aspect-[4/5] grayscale hover:grayscale-0 transition-all duration-1000"
              />
            </motion.div>
            <div className="absolute inset-0 bg-[#D4AF37]/5 mix-blend-overlay pointer-events-none" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border border-[#D4AF37]/30 z-[-1]" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <p className="text-[#D4AF37] text-[10px] tracking-[0.5em] uppercase mb-6 font-medium">The Narrative</p>
            <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl leading-tight mb-10 tracking-tighter italic text-[#F5F5F5]">
              Legacy of <span className="text-gradient not-italic tracking-normal">Extraordinary</span>
            </h2>
            <p className="text-[#F5F5F5]/70 leading-relaxed mb-6 text-base md:text-lg font-light tracking-wide">
              At yaga designgns, we craft more than just garments; we curate legacies. Our philosophy is rooted in cinematic precision, royal elegance, and a deep love for bridal artistry.
            </p>
            <p className="text-[#F5F5F5]/70 leading-relaxed mb-12 text-base md:text-lg font-light tracking-wide">
              Every detail is a brushstroke in a masterpiece uniquely yours, ensuring that your story is told with the grandeur it deserves across the stunning landscapes of Kerala.
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center md:text-left">
                <div className="font-heading text-xl md:text-2xl text-[#D4AF37] uppercase tracking-cinematic">Bespoke</div>
                <p className="mt-2 text-[10px] tracking-widest uppercase text-[#F5F5F5]/40">Tailored Details</p>
              </div>
              <div className="text-center md:text-left">
                <div className="font-heading text-xl md:text-2xl text-[#D4AF37] uppercase tracking-cinematic">Premium</div>
                <p className="mt-2 text-[10px] tracking-widest uppercase text-[#F5F5F5]/40">Top-Tier Quality</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
