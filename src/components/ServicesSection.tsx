import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Heart, Globe, Briefcase, Sparkles } from 'lucide-react';

const services = [
  { icon: Heart, title: 'Luxury Weddings', desc: 'Exquisite wedding celebrations in Kothamangalam and Ernakulam, crafted with unparalleled attention to detail and elegance.' },
  { icon: Globe, title: 'Destination Weddings', desc: 'Breathtaking destination wedding ceremonies across Kerala and India\'s most stunning exclusive locations.' },
  { icon: Briefcase, title: 'Corporate Events', desc: 'Sophisticated corporate events and business gatherings in Ernakulam that leave lasting professional impressions.' },
  { icon: Sparkles, title: 'Private Celebrations', desc: 'Intimate private celebrations and anniversary events designed to create unforgettable personal memories in Kerala.' },
];

export default function ServicesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="services" className="py-32 grain-overlay">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-primary text-xs tracking-[0.4em] uppercase mb-4">What We Do</p>
          <h2 className="font-heading text-3xl md:text-5xl">
            Premium Event Planning <span className="text-gradient">Services in Kerala</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <motion.article
              key={s.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              className="group relative p-8 border border-border bg-card hover:border-primary/50 transition-all duration-500 cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <s.icon className="w-8 h-8 text-primary mb-6 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
              <h3 className="font-heading text-xl mb-3">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
