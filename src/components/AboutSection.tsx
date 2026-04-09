import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import aboutImg from '@/assets/about.jpg';

function AnimatedCounter({ target, label }: { target: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-heading text-4xl md:text-5xl text-primary">{count}+</div>
      <p className="mt-2 text-xs tracking-widest uppercase text-muted-foreground">{label}</p>
    </div>
  );
}

export default function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="relative py-32 grain-overlay">
      <div className="container mx-auto px-6">
        <div ref={ref} className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="overflow-hidden">
              <img
                src={aboutImg}
                alt="About LuxeVibes"
                loading="lazy"
                width={800}
                height={1000}
                className="w-full object-cover aspect-[4/5]"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-primary/30" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <p className="text-primary text-xs tracking-[0.4em] uppercase mb-4">Our Story</p>
            <h2 className="font-heading text-3xl md:text-5xl leading-tight mb-6">
              Where Dreams Meet <span className="text-gradient">Elegance</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              At LuxeVibes, we believe every celebration deserves to be extraordinary. With years of expertise in luxury event planning, we transform visions into breathtaking realities that leave lasting impressions.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-10">
              From intimate gatherings to grand destination weddings, our team of dedicated professionals ensures every detail is meticulously curated to reflect your unique story and style.
            </p>

            <div className="grid grid-cols-3 gap-6">
              <AnimatedCounter target={250} label="Events" />
              <AnimatedCounter target={12} label="Years" />
              <AnimatedCounter target={500} label="Clients" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
