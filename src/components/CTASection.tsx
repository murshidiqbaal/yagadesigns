import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-32 relative grain-overlay">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center max-w-3xl mx-auto"
        >
          <p className="text-primary text-xs tracking-[0.4em] uppercase mb-4">Let's Create Magic</p>
          <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl leading-tight mb-6">
            Plan Your <span className="text-gradient">Dream Wedding in Kerala</span>
          </h2>
          <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
            Every extraordinary celebration begins with a conversation. Whether in Kothamangalam, Ernakulam, or anywhere in Kerala — let us bring your vision to life.
          </p>
          <a
            href="#contact"
            className="inline-flex px-10 py-4 bg-primary text-primary-foreground text-xs tracking-widest uppercase hover:brightness-110 transition-all duration-300"
          >
            Start Your Journey
          </a>
        </motion.div>
      </div>
    </section>
  );
}
