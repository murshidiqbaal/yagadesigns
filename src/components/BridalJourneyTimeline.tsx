import { motion } from 'framer-motion';
const STEPS = [
  { num: '01', title: 'Consultation', desc: 'We listen to your vision and every detail that makes your celebration singular.' },
  { num: '02', title: 'Design', desc: 'Our atelier crafts a bespoke concept that reflects your unique story.' },
  { num: '03', title: 'Refinement', desc: 'Meticulous fitting sessions ensure every thread falls exactly as intended.' },
  { num: '04', title: 'Delivery', desc: 'Your creation arrives in our signature packaging, ready for your moment.' },
];

// const STEPS = [
//   {
//     num: "01",
//     title: "Consultation",
//     desc: "Discuss ideas and inspiration.",
//     icon: MessageSquare
//   },
//   {
//     num: "02",
//     title: "Design Selection",
//     desc: "Choose your dream design.",
//     icon: Sparkles
//   },
//   {
//     num: "03",
//     title: "Measurements",
//     desc: "Personalized fitting process.",
//     icon: Ruler
//   },
//   {
//     num: "04",
//     title: "Stitching",
//     desc: "Expert craftsmanship begins.",
//     icon: Scissors
//   },
//   {
//     num: "05",
//     title: "Final Trial",
//     desc: "Perfect finishing adjustments.",
//     icon: CheckCircle2
//   },
//   {
//     num: "06",
//     title: "Delivery",
//     desc: "Your bridal outfit is ready.",
//     icon: ShoppingBag
//   }
// ];

export default function BridalJourneyTimeline() {
  return (
    <section className="py-24 bg-[#060606] border-y border-white/5 relative overflow-hidden">
      {/* Background radial accent */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none blur-[80px]"
        style={{
          backgroundImage: 'radial-gradient(ellipse, rgba(212,175,55,0.03) 0%, transparent 65%)'
        }}
      />

      <div className="container max-w-6xl px-4 md:px-6 relative z-10 mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-[#D4AF37] opacity-80">
              The Atelier Process
            </span>
            <div className="w-8 h-[1px] bg-gradient-to-r from-[#D4AF37] to-transparent" />
          </div>
          <h2 className="text-4xl md:text-5xl font-heading text-white tracking-tight leading-tight">
            Our Bridal <span className="text-[#D4AF37] italic font-serif">Journey</span>
          </h2>
          <p className="text-sm text-white/40 max-w-md mx-auto leading-relaxed">
            From the initial design spark to the final handover, experience the meticulous artistry behind every bespoke piece.
          </p>
        </div>

        {/* Desktop Layout (Horizontal Timeline) */}
        <div className="hidden md:block relative mt-16 px-6">
          {/* Timeline Connector Line */}
          <div className="absolute top-10 left-12 right-12 h-[2px] bg-white/5" />

          {/* Animated Progress Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute top-10 left-12 right-12 h-[2px] bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37] to-[#D4AF37]/20 origin-left"
          />

          <div className="grid grid-cols-6 gap-6 relative z-10">
            {STEPS.map((step, idx) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="flex flex-col items-center text-center group"
              >
                {/* Node circle */}
                <div className="w-20 h-20 rounded-full bg-[#0c0c0c] border border-white/10 group-hover:border-[#D4AF37] flex items-center justify-center text-white/60 group-hover:text-[#D4AF37] transition-all duration-500 shadow-[0_0_20px_rgba(0,0,0,0.8)] relative">
                  <div className="absolute inset-0.5 rounded-full border border-white/[0.03] group-hover:border-[#D4AF37]/20 transition-all duration-500" />
                  {/* <step.icon className="w-7 h-7 stroke-[1.2] relative z-10 transition-transform duration-500 group-hover:scale-110" /> */}

                  {/* Step Number Badge */}
                  <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-black font-mono font-bold text-[10px] w-6 h-6 rounded-full flex items-center justify-center border border-[#060606] shadow-lg">
                    {step.num}
                  </span>
                </div>

                {/* Content */}
                <div className="mt-8 space-y-2 px-2">
                  <h3 className="font-heading text-lg text-white group-hover:text-[#D4AF37] transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-xs text-white/40 leading-relaxed font-sans font-light">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile Layout (Vertical Timeline) */}
        <div className="block md:hidden relative pl-8 mt-10">
          {/* Vertical Connector Line */}
          <div className="absolute left-4 top-4 bottom-4 w-[2px] bg-white/5" />

          {/* Animated Progress Line */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute left-4 top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#D4AF37] via-[#D4AF37]/80 to-transparent origin-top"
          />

          <div className="space-y-12">
            {STEPS.map((step, idx) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative group flex items-start gap-5"
              >
                {/* Node Dot/Circle */}
                <div className="w-10 h-10 rounded-full bg-[#0c0c0c] border border-white/10 group-hover:border-[#D4AF37] flex items-center justify-center text-white/50 group-hover:text-[#D4AF37] shrink-0 transition-all duration-300 z-10">
                  {/* <step.icon className="w-4 h-4 stroke-[1.5]" /> */}
                </div>

                {/* Step contents */}
                <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#D4AF37]/20 transition-all duration-300 w-full space-y-1.5">
                  <span className="font-mono text-[10px] text-[#D4AF37]/60 tracking-wider font-semibold">
                    STEP {step.num}
                  </span>
                  <h3 className="font-heading text-base text-white group-hover:text-[#D4AF37] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-white/40 leading-relaxed font-sans">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
