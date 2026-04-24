import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageSquareQuote, ChevronLeft, ChevronRight, User } from "lucide-react";
import { getTestimonials, Testimonial, getImageUrl } from "@/lib/appwrite";
import { Button } from "./ui/button";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getTestimonials();
      // Filter for featured or just take the first 6
      setTestimonials(data.slice(0, 6));
    })();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || testimonials.length === 0) return;
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, testimonials]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (testimonials.length === 0) return null;

  const current = testimonials[currentIndex];

  return (
    <section className="py-32 relative overflow-hidden bg-[#050505]">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6"
          >
            <Star className="w-3.5 h-3.5 text-primary fill-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">Voices of Yaga</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-heading mb-6"
          >
            Client <span className="italic text-primary">Confessions</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/40 max-w-2xl mx-auto text-sm md:text-md uppercase tracking-widest font-medium"
          >
            Discover the experiences of our real brides and couture enthusiasts.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto relative group">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="glass p-10 md:p-16 rounded-[2.5rem] border border-white/5 bg-white/[0.02] text-center"
            >
              <div className="flex justify-center mb-8">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < current.rating ? "fill-primary text-primary" : "text-white/10"}`} />
                  ))}
                </div>
              </div>

              <MessageSquareQuote className="w-12 h-12 text-primary/20 mx-auto mb-8" />

              <blockquote className="text-xl md:text-3xl font-heading leading-relaxed text-white/90 mb-10 italic">
                "{current.content}"
              </blockquote>

              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 p-1">
                   <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center text-primary overflow-hidden">
                      {current.avatar_url ? (
                        <img src={getImageUrl(current.avatar_url)} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-8 h-8 opacity-40" />
                      )}
                   </div>
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-heading tracking-wide">{current.name}</h4>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">Verified Client</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mt-12 bg-[#0A0A0A]">
            <Button
              variant="outline" size="icon" 
              className="rounded-full w-14 h-14 border-white/5 hover:border-primary/50 bg-transparent transition-all"
              onClick={() => { handlePrev(); setIsAutoPlaying(false); }}
            >
              <ChevronLeft className="w-5 h-5 text-white/50" />
            </Button>
            
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrentIndex(i); setIsAutoPlaying(false); }}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${i === currentIndex ? "w-8 bg-primary" : "bg-white/10 hover:bg-white/30"}`}
                />
              ))}
            </div>

            <Button
              variant="outline" size="icon" 
              className="rounded-full w-14 h-14 border-white/5 hover:border-primary/50 bg-transparent transition-all"
              onClick={() => { handleNext(); setIsAutoPlaying(false); }}
            >
              <ChevronRight className="w-5 h-5 text-white/50" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
