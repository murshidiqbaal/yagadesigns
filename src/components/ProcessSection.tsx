import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const steps = [
  { num: '01', title: 'Discovery', desc: 'We listen to your vision, dreams, and every detail that matters to you.' },
  { num: '02', title: 'Design', desc: 'Our team crafts a bespoke concept that reflects your unique style and story.' },
  { num: '03', title: 'Planning', desc: 'Every element is meticulously coordinated — from venue to florals to lighting.' },
  { num: '04', title: 'Execution', desc: 'We bring your vision to life flawlessly, so you can enjoy every moment.' },
];

export default function ProcessSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="process" className="py-32 grain-overlay">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-primary text-xs tracking-[0.4em] uppercase mb-4">How We Work</p>
          <h2 className="font-heading text-4xl md:text-6xl tracking-elegant">Our <span className="text-gradient">Process</span></h2>
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              className={`relative flex items-start gap-8 mb-16 ${
                i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-primary bg-background z-10" />
              <div className={`ml-20 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                <span className="text-primary font-heading text-4xl tracking-cinematic">{step.num}</span>
                <h3 className="font-heading text-2xl mt-4 mb-4 tracking-editorial text-[#F5F5F5]">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
