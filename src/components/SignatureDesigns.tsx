import { getProducts } from "@/lib/appwrite";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

/* ─── Font Injection ──────────────────────────────────────────────── */
const injectFonts = () => {
  if (typeof document !== "undefined" && !document.getElementById("lux-fonts")) {
    const l = document.createElement("link");
    l.id = "lux-fonts";
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:wght@200;300;400;500&family=DM+Mono:wght@300;400&display=swap";
    document.head.appendChild(l);
  }
};

const CATEGORIES = ["All", "Bridal", "Engagement", "Reception"];

/* ─── Process Steps ───────────────────────────────────────────────── */
const STEPS = [
  { num: "01", title: "Discovery", desc: "We listen to your vision, dreams, and every detail that makes your celebration singular." },
  { num: "02", title: "Design", desc: "Our atelier crafts a bespoke concept that reflects your unique story and silhouette." },
  { num: "03", title: "Refinement", desc: "Meticulous fitting sessions and handwork ensure every thread falls exactly as intended." },
  { num: "04", title: "Delivery", desc: "Your creation arrives in our signature packaging, ready for the moment you've dreamed of." },
];

function ProcessSection() {
  return (
    <section style={{ padding: "7rem 0", background: "#060606", position: "relative" }}>
      {/* bg accent */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: 700, height: 400,
        background: "radial-gradient(ellipse, rgba(212,175,55,0.03) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 2rem" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          style={{ textAlign: "center", marginBottom: "5rem" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: "1.25rem" }}>
            <div style={{ width: 36, height: 1, background: "linear-gradient(90deg, transparent, #D4AF37)" }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.38em", textTransform: "uppercase", color: "#D4AF37", opacity: 0.7 }}>
              Atelier Process
            </span>
            <div style={{ width: 36, height: 1, background: "linear-gradient(90deg, #D4AF37, transparent)" }} />
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.4rem, 5vw, 4rem)", fontWeight: 300, color: "#FFF", letterSpacing: "-0.01em", lineHeight: 1.1 }}>
            The Making of <em style={{ color: "#D4AF37", fontStyle: "italic" }}>Something Perfect</em>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* vertical line */}
          <div
            className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-[1px] transform -translate-x-1/2"
            style={{
              background: "linear-gradient(to bottom, transparent, rgba(212,175,55,0.25) 15%, rgba(212,175,55,0.25) 85%, transparent)",
            }}
          />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.85, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className={`flex mb-14 relative w-full ${i % 2 === 0 ? 'justify-start' : 'sm:justify-end justify-start'}`}
            >
              {/* Dot on line */}
              <div
                className="absolute left-4 sm:left-1/2 top-5 sm:top-[1.2rem] transform -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-[#D4AF37] bg-[#060606] z-[2]"
                style={{ boxShadow: "0 0 12px rgba(212,175,55,0.3)" }}
              />

              {/* Content block — alternate sides on desktop, right side on mobile */}
              <div className={`w-full sm:w-[43%] pl-10 sm:pl-0 ${i % 2 === 0 ? 'sm:pr-12' : 'sm:pl-12'}`}>
                <div className="bg-white/[0.02] border border-[#D4AF37]/10 rounded-sm p-6 sm:p-7 relative overflow-hidden group hover:border-[#D4AF37]/30 transition-colors duration-500">
                  {/* Step number watermark */}
                  <div
                    className={`absolute bottom-[-0.75rem] font-heading text-6xl font-light text-[#D4AF37]/[0.06] leading-none select-none pointer-events-none ${i % 2 === 0 ? 'right-[-0.5rem]' : 'sm:left-[-0.5rem] right-[-0.5rem]'}`}
                  >
                    {step.num}
                  </div>

                  <span className="font-mono text-[9px] tracking-[0.25em] text-[#D4AF37]/65 block mb-2">
                    {step.num}
                  </span>

                  <h3 className="font-heading text-xl font-normal text-white tracking-wide mb-2.5">
                    {step.title}
                  </h3>

                  <p className="font-sans text-xs font-light text-white/40 leading-relaxed m-0">
                    {step.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────── */
export default function SignatureDesigns() {
  useEffect(() => { injectFonts(); }, []);

  const { data: dbProducts = [], isLoading } = useQuery({
    queryKey: ['products-home'],
    queryFn: () => getProducts(),
  });

  const [activeCategory, setActiveCategory] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const INITIAL_COUNT = 4;

  const filtered = activeCategory === "All"
    ? dbProducts
    : dbProducts.filter((p) => p.category === activeCategory);

  const visible = showAll ? filtered : filtered.slice(0, INITIAL_COUNT);
  const hasMore = filtered.length > INITIAL_COUNT;

  // reset showAll when category changes
  const handleCategory = (cat) => {
    setActiveCategory(cat);
    setShowAll(false);
  };

  return (
    <div style={{ background: "#060606", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Section Header ────────────────────────────────────────── */}
      <section style={{ paddingTop: "6rem", paddingBottom: "0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: "3.5rem" }}
          >
            {/* top label */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem" }}>
              <div style={{ width: 32, height: 1, background: "linear-gradient(90deg, transparent, #D4AF37)" }} />
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 9, letterSpacing: "0.38em",
                textTransform: "uppercase", color: "#D4AF37", opacity: 0.7,
              }}>The Collection</span>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.8rem, 6vw, 5rem)",
                fontWeight: 300,
                color: "#FFF",
                letterSpacing: "-0.01em",
                lineHeight: 1.05,
                margin: 0,
              }}>
                Bridal <em style={{ color: "#D4AF37", fontStyle: "italic" }}>Atelier</em>
              </h1>

              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12, fontWeight: 300,
                color: "rgba(255,255,255,0.38)",
                lineHeight: 1.7,
                maxWidth: 300,
                margin: 0,
              }}>
                Handcrafted couture for your most sacred celebration. Each piece, a lifetime of artistry.
              </p>
            </div>
          </motion.div>

          {/* ── Category filters ──────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{
              display: "flex",
              gap: 8,
              marginBottom: "3rem",
              paddingBottom: "2.5rem",
              borderBottom: "1px solid rgba(212,175,55,0.08)",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategory(cat)}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 10,
                    fontWeight: 500,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    padding: "8px 18px",
                    borderRadius: 2,
                    border: activeCategory === cat
                      ? "1px solid rgba(212,175,55,0.5)"
                      : "1px solid rgba(255,255,255,0.08)",
                    background: activeCategory === cat
                      ? "rgba(212,175,55,0.1)"
                      : "transparent",
                    color: activeCategory === cat ? "#D4AF37" : "rgba(255,255,255,0.35)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >{cat}</button>
              ))}
            </div>

            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.15em",
              color: "rgba(255,255,255,0.2)",
            }}>
              {filtered.length} pieces
            </span>
          </motion.div>

          {/* ── Product Grid ──────────────────────────────────────── */}
          {isLoading ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "1.5rem",
              marginBottom: "3.5rem",
            }}>
              {[...Array(INITIAL_COUNT)].map((_, i) => (
                <div key={i} className="aspect-[4/5.5] rounded-[2.5rem] bg-[#1A1A1A] animate-pulse" />
              ))}
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "1.5rem",
              marginBottom: "3.5rem",
            }}>
              <AnimatePresence mode="popLayout">
                {visible.map((product, i) => (
                  <ProductCard key={product.$id} product={product} index={i} />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* ── View All / Show Less ───────────────────────────────── */}
          {hasMore && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", marginBottom: "5rem" }}
            >
              {/* Decorative line */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, width: "100%", maxWidth: 400 }}>
                <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.2))" }} />
                <button
                  onClick={() => setShowAll(!showAll)}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 10,
                    fontWeight: 500,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.5)",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.1)",
                    padding: "12px 32px",
                    borderRadius: 2,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    transition: "all 0.35s ease",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = "#D4AF37";
                    e.currentTarget.style.borderColor = "rgba(212,175,55,0.45)";
                    e.currentTarget.style.background = "rgba(212,175,55,0.05)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {showAll ? "Show Less" : `View All ${filtered.length} Pieces`}
                  <motion.svg
                    width="13" height="13" viewBox="0 0 13 13" fill="none"
                    animate={{ rotate: showAll ? 180 : 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ flexShrink: 0 }}
                  >
                    <path d="M2 4.5l4.5 4.5 4.5-4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                </button>
                <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(212,175,55,0.2), transparent)" }} />
              </div>

              {!showAll && (
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 9,
                  letterSpacing: "0.2em",
                  color: "rgba(255,255,255,0.18)",
                  textTransform: "uppercase",
                }}>
                  {filtered.length - INITIAL_COUNT} more pieces await
                </span>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Process Section ───────────────────────────────────────── */}
      <ProcessSection />

      {/* ── Bottom CTA ────────────────────────────────────────────── */}
      <section style={{ padding: "6rem 2rem", textAlign: "center", background: "#060606", borderTop: "1px solid rgba(212,175,55,0.07)" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem,4vw,3.2rem)", fontWeight: 300, fontStyle: "italic", color: "rgba(212,175,55,0.7)", marginBottom: "0.75rem" }}>
            "Every stitch, a promise."
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: "2.5rem" }}>
            Book a Private Consultation
          </p>
          <a href="#/consult" style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#060606",
            background: "#D4AF37",
            padding: "14px 40px",
            borderRadius: 2,
            textDecoration: "none",
            display: "inline-block",
            transition: "opacity 0.3s ease",
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            Begin Your Journey
          </a>
        </motion.div>
      </section>
    </div>
  );
}