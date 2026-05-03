import { getImageUrl, getTestimonials, Testimonial } from "@/lib/appwrite";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* ─── Staggered word animation ─── */
function AnimatedQuote({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <motion.blockquote
      className="text-2xl md:text-[2.1rem] font-heading leading-[1.4] text-white/90 italic relative z-10"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } }, exit: {} }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.28em]"
          variants={{
            hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
            exit: { opacity: 0, y: -10, filter: "blur(4px)", transition: { duration: 0.2 } },
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.blockquote>
  );
}

/* ─── Orbital timer ring around nav button ─── */
function TimerRing({ progress }: { progress: number }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  return (
    <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      <circle
        cx="32" cy="32" r={r}
        fill="none"
        stroke="var(--primary, #c9a96e)"
        strokeWidth="1.5"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - progress)}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.3s linear" }}
      />
    </svg>
  );
}

/* ─── Tilt card wrapper ─── */
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]), { stiffness: 200, damping: 30 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-4, 4]), { stiffness: 200, damping: 30 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current!.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d", perspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Main component ─── */
export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [timerProgress, setTimerProgress] = useState(0);
  const DURATION = 6000;

  useEffect(() => {
    (async () => {
      const data = await getTestimonials();
      setTestimonials(data.slice(0, 6));
    })();
  }, []);

  /* Timer tick */
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length === 0) return;
    setTimerProgress(0);
    const step = 50;
    const inc = step / DURATION;
    let p = 0;
    const tick = setInterval(() => {
      p += inc;
      setTimerProgress(Math.min(p, 1));
      if (p >= 1) {
        setDir(1);
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        p = 0;
        setTimerProgress(0);
      }
    }, step);
    return () => clearInterval(tick);
  }, [currentIndex, isAutoPlaying, testimonials]);

  const navigate = (newDir: number) => {
    setDir(newDir);
    setIsAutoPlaying(false);
    setTimerProgress(0);
    setCurrentIndex((prev) => (prev + newDir + testimonials.length) % testimonials.length);
  };

  if (testimonials.length === 0) return null;

  const current = testimonials[currentIndex];
  const prev = testimonials[(currentIndex - 1 + testimonials.length) % testimonials.length];
  const next = testimonials[(currentIndex + 1) % testimonials.length];

  const slideVariants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 60 : -60, scale: 0.97 }),
    center: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -60 : 60, scale: 0.97, transition: { duration: 0.4, ease: [0.7, 0, 0.8, 0] } }),
  };

  return (
    <section className="py-32 relative overflow-hidden bg-[#050505]">
      {/* ── Atmospheric layers ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grain overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
        {/* Radial glows */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/[0.04] blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-white/[0.02] blur-[80px]" />
        {/* Thin horizontal rule */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* ── Section header ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-primary/60" />
              <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-primary/70">Client Voices</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-heading leading-[0.95] tracking-tight">
              What They<br />
              <span className="italic text-white/30">Whisper</span>
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-white/30 text-sm md:text-base max-w-xs leading-relaxed"
          >
            Real words from brides and couture devotees who trusted Yaga with their most extraordinary moments.
          </motion.p>
        </div>

        {/* ── Three-card stage ── */}
        <div className="relative flex items-center gap-4 lg:gap-8">

          {/* Ghost prev card */}
          <motion.div
            key={`prev-${currentIndex}`}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
            className="hidden lg:block flex-shrink-0 w-64 relative cursor-pointer group"
            onClick={() => navigate(-1)}
          >
            <div className="p-6 rounded-3xl border border-white/[0.04] bg-white/[0.015] backdrop-blur-sm h-52 flex flex-col justify-between overflow-hidden group-hover:border-white/10 transition-colors duration-300">
              <div className="text-4xl font-heading text-primary/10 leading-none">"</div>
              <p className="text-white/20 text-sm line-clamp-4 font-heading italic">{prev.content}</p>
              <p className="text-[10px] uppercase tracking-widest text-white/15">{prev.name}</p>
            </div>
            {/* Fade mask */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent to-[#050505]/80 pointer-events-none" />
          </motion.div>

          {/* ── Center hero card ── */}
          <TiltCard className="flex-1 min-w-0">
            <div className="relative rounded-[2rem] border border-white/[0.06] bg-white/[0.025] backdrop-blur-md overflow-hidden">
              {/* Card inner glow on top edge */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

              {/* Giant decorative " */}
              <div
                className="absolute -top-6 -left-4 text-[200px] font-heading text-primary/[0.04] leading-none select-none pointer-events-none"
                style={{ fontStyle: "italic" }}
              >
                "
              </div>

              <div className="p-8 md:p-14 lg:p-16 relative">
                {/* Stars */}
                <div className="flex gap-1 mb-10">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.05 * i, duration: 0.3, type: "spring" }}
                    >
                      <svg viewBox="0 0 14 14" className={`w-3.5 h-3.5 ${i < (current.rating ?? 5) ? "fill-primary text-primary" : "fill-white/10 text-white/10"}`}>
                        <path d="M7 0l1.76 4.73H14l-4.12 2.97 1.56 4.72L7 9.48l-4.44 2.94 1.56-4.72L0 4.73h5.24z" />
                      </svg>
                    </motion.div>
                  ))}
                </div>

                {/* Animated quote */}
                <div className="min-h-[160px] md:min-h-[140px] mb-10">
                  <AnimatePresence mode="wait" custom={dir}>
                    <motion.div
                      key={currentIndex}
                      custom={dir}
                      // variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                    >
                      <AnimatedQuote text={current.content} />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Divider */}
                <motion.div
                  initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="h-px bg-gradient-to-r from-primary/30 via-white/10 to-transparent mb-8 origin-left"
                />

                {/* Author row */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`author-${currentIndex}`}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                    className="flex items-center gap-5"
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 rounded-full ring-1 ring-white/10 overflow-hidden bg-primary/10 flex items-center justify-center">
                        {current.avatar_url ? (
                          <img src={getImageUrl(current.avatar_url)} className="w-full h-full object-cover" alt={current.name} />
                        ) : (
                          <User className="w-6 h-6 text-primary/40" />
                        )}
                      </div>
                      {/* Pulse ring */}
                      <div className="absolute inset-0 rounded-full ring-1 ring-primary/20 animate-ping opacity-30 pointer-events-none" />
                    </div>
                    <div>
                      <h4 className="text-base font-heading tracking-wide text-white/90">{current.name}</h4>
                      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary/50 mt-0.5">Verified Client</p>
                    </div>

                    {/* Counter */}
                    <div className="ml-auto text-right">
                      <span className="text-[11px] text-white/20 font-mono tabular-nums">
                        {String(currentIndex + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </TiltCard>

          {/* Ghost next card */}
          <motion.div
            key={`next-${currentIndex}`}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
            className="hidden lg:block flex-shrink-0 w-64 relative cursor-pointer group"
            onClick={() => navigate(1)}
          >
            <div className="p-6 rounded-3xl border border-white/[0.04] bg-white/[0.015] backdrop-blur-sm h-52 flex flex-col justify-between overflow-hidden group-hover:border-white/10 transition-colors duration-300">
              <div className="text-4xl font-heading text-primary/10 leading-none">"</div>
              <p className="text-white/20 text-sm line-clamp-4 font-heading italic">{next.content}</p>
              <p className="text-[10px] uppercase tracking-widest text-white/15">{next.name}</p>
            </div>
            {/* Fade mask */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-l from-transparent to-[#050505]/80 pointer-events-none" />
          </motion.div>
        </div>

        {/* ── Controls row ── */}
        <div className="flex items-center justify-between mt-10 px-0 lg:px-[17.5rem]">
          {/* Prev */}
          <div className="relative w-16 h-16">
            <TimerRing progress={isAutoPlaying ? 0 : 0} />
            <button
              onClick={() => navigate(-1)}
              className="absolute inset-1 rounded-full border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.07] hover:border-primary/30 transition-all duration-300 flex items-center justify-center group"
            >
              <ChevronLeft className="w-4 h-4 text-white/40 group-hover:text-white/80 transition-colors" />
            </button>
          </div>

          {/* Progress track */}
          <div className="flex items-center gap-1.5">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrentIndex(i); setDir(i > currentIndex ? 1 : -1); setIsAutoPlaying(false); }}
                className="relative h-0.5 rounded-full overflow-hidden transition-all duration-500"
                style={{ width: i === currentIndex ? 40 : 12 }}
              >
                <div className="absolute inset-0 bg-white/10" />
                {i === currentIndex && (
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-primary rounded-full"
                    style={{ width: `${timerProgress * 100}%` }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Next with timer ring */}
          <div className="relative w-16 h-16">
            <TimerRing progress={isAutoPlaying ? timerProgress : 0} />
            <button
              onClick={() => navigate(1)}
              className="absolute inset-1 rounded-full border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.07] hover:border-primary/30 transition-all duration-300 flex items-center justify-center group"
            >
              <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white/80 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}