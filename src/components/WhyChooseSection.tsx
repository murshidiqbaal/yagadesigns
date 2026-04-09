import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Award, Users, MapPin, Calendar } from 'lucide-react';

const reasons = [
  { icon: Award, title: 'Award-Winning Design', desc: 'Recognized as top luxury wedding planners in Ernakulam with award-winning event designs.' },
  { icon: Users, title: '500+ Happy Clients', desc: 'Trusted by over 500 families across Kothamangalam, Ernakulam, and Kerala for their most special occasions.' },
  { icon: MapPin, title: 'Local Expertise', desc: 'Deep knowledge of the best venues, vendors, and hidden gems in Kothamangalam and Ernakulam.' },
  { icon: Calendar, title: '12+ Years Experience', desc: 'Over a decade of experience planning luxury weddings and premium events across Kerala and India.' },
];

export default function WhyChooseSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-32 grain-overlay" aria-label="Why choose Luxevibes">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-primary text-xs tracking-[0.4em] uppercase mb-4">Why Us</p>
          <h2 className="font-heading text-3xl md:text-5xl">
            Why Choose <span className="text-gradient">Luxevibes in Ernakulam</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-sm leading-relaxed">
            As the leading wedding planners in Kothamangalam and event planners in Ernakulam,
            we bring unmatched expertise, creativity, and dedication to every celebration in Kerala.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((r, i) => (
            <motion.article
              key={r.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              className="text-center p-8 border border-border bg-card hover:border-primary/50 transition-all duration-500"
            >
              <r.icon className="w-8 h-8 text-primary mx-auto mb-6" aria-hidden="true" />
              <h3 className="font-heading text-lg mb-3">{r.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{r.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
