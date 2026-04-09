import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { getTestimonials, type Testimonial } from '@/lib/appwrite';

const fallbackTestimonials: Testimonial[] = [
  { $id: '1', name: 'Priya & Arjun', message: 'LuxeVibes transformed our wedding into a fairy tale. Every single detail was perfection. We couldn\'t have dreamed of anything more beautiful.', rating: 5 },
  { $id: '2', name: 'Sarah Mitchell', message: 'The most incredible event planning experience. Their attention to detail and creativity exceeded all our expectations. Truly world-class.', rating: 5 },
  { $id: '3', name: 'James & Elena', message: 'Our destination wedding in Santorini was absolutely breathtaking. The LuxeVibes team handled everything flawlessly from start to finish.', rating: 5 },
];

export default function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    getTestimonials().then((data) => {
      if (data.length > 0) setTestimonials(data);
    });
  }, []);

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  const t = testimonials[current];

  return (
    <section className="py-32 grain-overlay">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-xs tracking-[0.4em] uppercase mb-4">Testimonials</p>
          <h2 className="font-heading text-3xl md:text-5xl">Words of <span className="text-gradient">Love</span></h2>
        </motion.div>

        <div className="max-w-3xl mx-auto text-center">
          <motion.div key={current} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex justify-center gap-1 mb-6">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-primary text-primary" />
              ))}
            </div>
            <blockquote className="font-heading text-xl md:text-2xl italic leading-relaxed mb-8 text-foreground/90">
              "{t.message}"
            </blockquote>
            <p className="text-primary text-sm tracking-widest uppercase">{t.name}</p>
          </motion.div>

          <div className="flex justify-center gap-4 mt-10">
            <button onClick={prev} className="p-3 border border-border hover:border-primary text-muted-foreground hover:text-primary transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={next} className="p-3 border border-border hover:border-primary text-muted-foreground hover:text-primary transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
