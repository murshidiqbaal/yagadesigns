import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

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

/* ─── Mock Products ───────────────────────────────────────────────── */
const PRODUCTS = [
  { id: "1", name: "Crimson Bridal Lehenga", category: "Bridal", price: "₹1,85,000", tag: "New Arrival", color: "from-[#3d0a0a] to-[#1a0202]", accent: "#E07070", customizable: true, variants: 3 },
  { id: "2", name: "Ivory Pearl Anarkali", category: "Engagement", price: "₹72,000", tag: "Bestseller", color: "from-[#1e1a10] to-[#0e0c06]", accent: "#D4AF37", customizable: true, variants: 2 },
  { id: "3", name: "Midnight Blue Sharara Set", category: "Reception", price: "₹98,500", tag: "Exclusive", color: "from-[#060d2e] to-[#020510]", accent: "#7BA7E0", customizable: false, variants: 1 },
  { id: "4", name: "Rose Gold Tissue Saree", category: "Bridal", price: "₹1,20,000", tag: "Curated", color: "from-[#2d1a1a] to-[#120a0a]", accent: "#E8A0A0", customizable: true, variants: 4 },
  { id: "5", name: "Emerald Velvet Lehenga", category: "Engagement", price: "₹1,42,000", tag: "New Arrival", color: "from-[#071a10] to-[#030c07]", accent: "#6EC49A", customizable: true, variants: 2 },
  { id: "6", name: "Champagne Organza Gown", category: "Reception", price: "₹88,000", tag: "Bestseller", color: "from-[#1f1810] to-[#0e0c08]", accent: "#D4C090", customizable: false, variants: 1 },
  { id: "7", name: "Antique Gold Gharara", category: "Bridal", price: "₹2,10,000", tag: "Limited", color: "from-[#251800] to-[#0f0b00]", accent: "#D4AF37", customizable: true, variants: 3 },
  { id: "8", name: "Dusty Rose Palazzo Set", category: "Reception", price: "₹64,000", tag: "Curated", color: "from-[#2d1520] to-[#12090d]", accent: "#D4A0B8", customizable: true, variants: 2 },
  { id: "9", name: "Cobalt Mirror Work Suit", category: "Engagement", price: "₹56,500", tag: "Exclusive", color: "from-[#071428] to-[#030810]", accent: "#8AB4E8", customizable: false, variants: 1 },
  { id: "10", name: "Ombré Sunset Lehenga", category: "Bridal", price: "₹1,68,000", tag: "New Arrival", color: "from-[#2a1008] to-[#120602]", accent: "#E0A070", customizable: true, variants: 2 },
  { id: "11", name: "Silver Tissue Anarkali", category: "Reception", price: "₹79,000", tag: "Bestseller", color: "from-[#181a1a] to-[#080a0a]", accent: "#C0C8D0", customizable: true, variants: 3 },
  { id: "12", name: "Plum Georgette Saree", category: "Engagement", price: "₹45,000", tag: "Curated", color: "from-[#1a0a2e] to-[#0a0514]", accent: "#C084FC", customizable: false, variants: 1 },
];

const CATEGORIES = ["All", "Bridal", "Engagement", "Reception"];

const TAG_COLORS = {
  "New Arrival": { bg: "rgba(212,175,55,0.12)", text: "#D4AF37", border: "rgba(212,175,55,0.25)" },
  "Bestseller": { bg: "rgba(110,196,154,0.1)", text: "#6EC49A", border: "rgba(110,196,154,0.2)" },
  "Exclusive": { bg: "rgba(192,132,252,0.1)", text: "#C084FC", border: "rgba(192,132,252,0.2)" },
  "Curated": { bg: "rgba(255,255,255,0.06)", text: "rgba(255,255,255,0.5)", border: "rgba(255,255,255,0.12)" },
  "Limited": { bg: "rgba(224,112,112,0.1)", text: "#E07070", border: "rgba(224,112,112,0.2)" },
};

/* ─── Tilt Card ───────────────────────────────────────────────────── */
function ProductCard({ product, index }) {
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 150, damping: 25 });
  const sy = useSpring(my, { stiffness: 150, damping: 25 });
  const rotX = useTransform(sy, [-0.5, 0.5], [5, -5]);
  const rotY = useTransform(sx, [-0.5, 0.5], [-5, 5]);
  const tag = TAG_COLORS[product.tag] || TAG_COLORS["Curated"];

  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); setHovered(false); };

  return (
    <motion.div
      ref={ref}
      style={{ perspective: 900 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseEnter={() => setHovered(true)}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.85, delay: (index % 4) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="cursor-pointer"
    >
      <motion.div style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}>
        <a href={`#/product/${product.id}`} style={{ display: "block", textDecoration: "none" }}>
          <div style={{
            position: "relative",
            background: "#0A0A0A",
            border: `1px solid ${hovered ? "rgba(212,175,55,0.2)" : "rgba(255,255,255,0.05)"}`,
            borderRadius: 2,
            overflow: "hidden",
            transition: "border-color 0.5s ease",
          }}>
            {/* Image Area */}
            <div style={{ position: "relative", aspectRatio: "3/4.2", overflow: "hidden" }}>
              {/* Gradient placeholder (swap with <img> for real images) */}
              <div style={{
                width: "100%", height: "100%",
                background: `radial-gradient(ellipse at 40% 30%, ${product.color.replace("from-[", "").replace("]", "").split(" to-[")[0].replace("from-", "")} 0%, ${product.color.split("to-[")[1]?.replace("]", "") || "#060606"} 100%)`,
                transition: "transform 1s ease",
                transform: hovered ? "scale(1.06)" : "scale(1)",
              }}>
                {/* Decorative inner lines */}
                <div style={{
                  position: "absolute", inset: 0,
                  backgroundImage: `repeating-linear-gradient(135deg, transparent, transparent 60px, rgba(255,255,255,0.015) 60px, rgba(255,255,255,0.015) 61px)`,
                }} />
                {/* Center monogram */}
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 80,
                    fontWeight: 300,
                    fontStyle: "italic",
                    color: `${product.accent}08`,
                    userSelect: "none",
                    lineHeight: 1,
                    letterSpacing: "-0.05em",
                  }}>
                    {product.name.charAt(0)}
                  </span>
                </div>
              </div>

              {/* Hover overlay — slides up */}
              <motion.div
                initial={false}
                animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 12 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
                  display: "flex", flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: "1.25rem",
                }}
              >
                <div style={{
                  display: "inline-flex",
                  alignSelf: "center",
                  alignItems: "center",
                  gap: 8,
                  padding: "9px 22px",
                  border: `1px solid rgba(212,175,55,0.45)`,
                  borderRadius: 2,
                  background: "rgba(0,0,0,0.5)",
                  backdropFilter: "blur(8px)",
                }}>
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 9,
                    fontWeight: 500,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: "#D4AF37",
                  }}>View Piece</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 6h10M7 2l4 4-4 4" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </motion.div>

              {/* Shimmer sweep */}
              <motion.div
                initial={{ x: "-110%", skewX: -15 }}
                animate={hovered ? { x: "120%" } : { x: "-110%" }}
                transition={{ duration: 0.65, ease: "easeInOut" }}
                style={{
                  position: "absolute", inset: 0,
                  background: `linear-gradient(105deg, transparent 35%, ${product.accent}18 50%, transparent 65%)`,
                  pointerEvents: "none",
                }}
              />

              {/* Tag badge — top right */}
              <div style={{ position: "absolute", top: 12, right: 12, zIndex: 10 }}>
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 8,
                  fontWeight: 400,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: tag.text,
                  background: tag.bg,
                  border: `1px solid ${tag.border}`,
                  padding: "4px 9px",
                  borderRadius: 2,
                  backdropFilter: "blur(6px)",
                }}>{product.tag}</span>
              </div>

              {/* Category badge — top left */}
              <div style={{ position: "absolute", top: 12, left: 12, zIndex: 10 }}>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 8,
                  fontWeight: 400,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.35)",
                  background: "rgba(0,0,0,0.5)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  padding: "4px 9px",
                  borderRadius: 2,
                  backdropFilter: "blur(6px)",
                }}>{product.category}</span>
              </div>
            </div>

            {/* Card Info */}
            <div style={{ padding: "1rem 1.1rem 1.25rem" }}>
              {/* Thin accent line */}
              <div style={{
                height: 1,
                marginBottom: "0.9rem",
                background: `linear-gradient(90deg, ${product.accent}50, transparent)`,
                transform: hovered ? "scaleX(1)" : "scaleX(0.4)",
                transformOrigin: "left",
                transition: "transform 0.5s ease",
              }} />

              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1rem, 1.5vw, 1.15rem)",
                fontWeight: 400,
                color: hovered ? "#D4AF37" : "#FFFFFF",
                letterSpacing: "0.02em",
                lineHeight: 1.2,
                marginBottom: "0.65rem",
                transition: "color 0.4s ease",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>{product.name}</h3>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 11,
                    fontWeight: 400,
                    letterSpacing: "0.08em",
                    color: "#D4AF37",
                  }}>{product.price}</span>
                  {product.customizable && (
                    <span style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 8,
                      letterSpacing: "0.15em",
                      color: "rgba(110,196,154,0.8)",
                      textTransform: "uppercase",
                      background: "rgba(110,196,154,0.08)",
                      border: "1px solid rgba(110,196,154,0.15)",
                      padding: "2px 6px",
                      borderRadius: 2,
                    }}>Custom</span>
                  )}
                </div>

                {/* Variants dots */}
                {product.variants > 1 && (
                  <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
                    {Array.from({ length: Math.min(product.variants, 4) }).map((_, vi) => (
                      <div key={vi} style={{
                        width: vi === 0 ? 5 : 4,
                        height: vi === 0 ? 5 : 4,
                        borderRadius: "50%",
                        background: vi === 0 ? `${product.accent}70` : `${product.accent}30`,
                      }} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </a>

        {/* Favorite button — outside the <a> */}
        <button
          onClick={() => setLiked(!liked)}
          style={{
            position: "absolute",
            top: 46,
            right: 12,
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(8px)",
            border: liked ? "1px solid rgba(212,175,55,0.5)" : "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
            zIndex: 20,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill={liked ? "#D4AF37" : "none"}>
            <path d="M6.5 11.5S1 7.8 1 4.5A2.5 2.5 0 0 1 6.5 3 2.5 2.5 0 0 1 12 4.5C12 7.8 6.5 11.5 6.5 11.5z"
              stroke={liked ? "#D4AF37" : "rgba(255,255,255,0.4)"} strokeWidth="1" strokeLinejoin="round" />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );
}

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
        <div style={{ position: "relative" }}>
          {/* vertical line */}
          <div style={{
            position: "absolute", left: "50%", top: 0, bottom: 0,
            width: 1,
            background: "linear-gradient(to bottom, transparent, rgba(212,175,55,0.25) 15%, rgba(212,175,55,0.25) 85%, transparent)",
            transform: "translateX(-50%)",
          }} />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.85, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: "flex",
                justifyContent: i % 2 === 0 ? "flex-start" : "flex-end",
                marginBottom: "3.5rem",
                position: "relative",
              }}
            >
              {/* Dot on line */}
              <div style={{
                position: "absolute", left: "50%", top: "1.2rem",
                transform: "translate(-50%,-50%)",
                width: 10, height: 10,
                borderRadius: "50%",
                border: "1px solid #D4AF37",
                background: "#060606",
                boxShadow: "0 0 12px rgba(212,175,55,0.3)",
                zIndex: 2,
              }} />

              {/* Content block — alternate sides */}
              <div style={{ width: "43%", padding: i % 2 === 0 ? "0 3rem 0 0" : "0 0 0 3rem" }}>
                <div style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(212,175,55,0.1)",
                  borderRadius: 2,
                  padding: "1.5rem 1.75rem",
                  position: "relative",
                  overflow: "hidden",
                }}>
                  {/* Step number watermark */}
                  <div style={{
                    position: "absolute",
                    right: i % 2 === 0 ? "-0.5rem" : "auto",
                    left: i % 2 !== 0 ? "-0.5rem" : "auto",
                    bottom: "-0.75rem",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 64,
                    fontWeight: 300,
                    color: "rgba(212,175,55,0.06)",
                    lineHeight: 1,
                    userSelect: "none",
                    pointerEvents: "none",
                  }}>{step.num}</div>

                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 9,
                    letterSpacing: "0.25em",
                    color: "#D4AF37",
                    opacity: 0.65,
                    display: "block",
                    marginBottom: "0.6rem",
                  }}>{step.num}</span>

                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.4rem",
                    fontWeight: 400,
                    color: "#FFF",
                    letterSpacing: "0.02em",
                    marginBottom: "0.65rem",
                  }}>{step.title}</h3>

                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 12,
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.38)",
                    lineHeight: 1.7,
                    margin: 0,
                  }}>{step.desc}</p>
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
export default function ProductPage() {
  useEffect(() => { injectFonts(); }, []);

  const [activeCategory, setActiveCategory] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const INITIAL_COUNT = 4;

  const filtered = activeCategory === "All"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeCategory);

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
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "1.5rem",
            marginBottom: "3.5rem",
          }}>
            <AnimatePresence mode="popLayout">
              {visible.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </AnimatePresence>
          </div>

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