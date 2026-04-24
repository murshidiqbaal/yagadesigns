// import { motion, useInView } from 'framer-motion';
// import { useRef, useState, useEffect } from 'react';
// import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
// import { getTestimonials, type Testimonial } from '@/lib/appwrite';

// const fallbackTestimonials: Testimonial[] = [
//   { $id: '1', name: 'Priya & Arjun', message: 'Yaga Designs created the most breathtaking bridal lehenga for us. Every single detail was perfection — truly the best bridal designers we could have chosen!', rating: 5 },
//   { $id: '2', name: 'Meera & Rahul', message: 'We searched for premium bridal wear and found Yaga Designs. Their attention to detail and creativity exceeded all our expectations. Truly world-class craftsmanship.', rating: 5 },
//   { $id: '3', name: 'Ananya & Dev', message: 'My bridal gown from Yaga Designs was absolutely breathtaking. The team handled everything flawlessly — the best luxury bridal designers I have ever worked with.', rating: 5 },
// ];

// export default function TestimonialsSection() {
//   const ref = useRef(null);
//   const inView = useInView(ref, { once: true, margin: '-100px' });
//   const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);
//   const [current, setCurrent] = useState(0);

//   useEffect(() => {
//     getTestimonials().then((data) => {
//       if (data.length > 0) setTestimonials(data);
//     });
//   }, []);

//   const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
//   const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

//   const t = testimonials[current];

//   return (
//     <section className="py-32 grain-overlay" aria-label="Client testimonials">
//       <div className="container mx-auto px-6">
//         <motion.div
//           ref={ref}
//           initial={{ opacity: 0, y: 30 }}
//           animate={inView ? { opacity: 1, y: 0 } : {}}
//           transition={{ duration: 0.8 }}
//           className="text-center mb-16"
//         >
//           <p className="text-[#D4AF37] text-[10px] tracking-[0.5em] uppercase mb-6 font-medium">The Testimonials</p>
//           <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl tracking-tighter italic">Voices of <span className="text-gradient not-italic tracking-normal">Elegance</span></h2>
//         </motion.div>

//         <div className="max-w-3xl mx-auto text-center">
//           <motion.div key={current} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
//             <div className="flex justify-center gap-1.5 mb-10">
//               {Array.from({ length: t.rating }).map((_, i) => (
//                 <Star key={i} className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]/50" />
//               ))}
//             </div>
//             <blockquote className="font-heading text-3xl md:text-4xl lg:text-5xl italic leading-tight mb-12 text-[#F5F5F5] tracking-tight">
//               "{t.message}"
//             </blockquote>
//             <div className="w-12 h-px bg-[#D4AF37]/40 mx-auto mb-6" />
//             <p className="text-[#D4AF37] text-[11px] tracking-[0.5em] uppercase font-medium">{t.name}</p>
//           </motion.div>

//           <div className="flex justify-center gap-4 mt-10">
//             <button onClick={prev} aria-label="Previous testimonial" className="p-3 border border-border hover:border-primary text-muted-foreground hover:text-primary transition-all">
//               <ChevronLeft className="w-5 h-5" />
//             </button>
//             <button onClick={next} aria-label="Next testimonial" className="p-3 border border-border hover:border-primary text-muted-foreground hover:text-primary transition-all">
//               <ChevronRight className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
