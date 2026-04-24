const fs = require('fs');
let content = fs.readFileSync('src/components/SignatureDesigns.tsx', 'utf8');

// 1. imports
content = content.replace(
  'import { useEffect, useRef, useState } from "react";',
  'import { useEffect, useRef, useState } from "react";\nimport { useQuery } from "@tanstack/react-query";\nimport { getProducts } from "@/lib/appwrite";\nimport ProductCard from "./ProductCard";'
);

// 2. Remove PRODUCTS and TAG_COLORS
content = content.replace(/\/\* ─── Mock Products ───[\s\S]*?const CATEGORIES = \["All", "Bridal", "Engagement", "Reception"\];[\s\S]*?};\n/g, 'const CATEGORIES = ["All", "Bridal", "Engagement", "Reception"];\n');

// 3. Remove inline ProductCard
content = content.replace(/\/\* ─── Tilt Card ───[\s\S]*?\}\n\n\/\* ─── Process Steps ───/g, '/* ─── Process Steps ───');

// 4. Change ProductPage to SignatureDesigns and add useQuery
content = content.replace(
  'export default function ProductPage() {\n  useEffect(() => { injectFonts(); }, []);\n\n  const [activeCategory, setActiveCategory] = useState("All");',
  `export default function SignatureDesigns() {\n  useEffect(() => { injectFonts(); }, []);\n\n  const { data: dbProducts = [], isLoading } = useQuery({\n    queryKey: ['products-home'],\n    queryFn: () => getProducts(),\n  });\n\n  const [activeCategory, setActiveCategory] = useState("All");`
);

// 5. Replace PRODUCTS with dbProducts
content = content.replace(
  /const filtered = activeCategory === "All"\n    \? PRODUCTS\n    : PRODUCTS\.filter\(\(p\) => p\.category === activeCategory\);/g,
  `const filtered = activeCategory === "All"\n    ? dbProducts\n    : dbProducts.filter((p) => p.category === activeCategory);`
);

// 6. Replace product.id with product.$id in map
content = content.replace(
  /<ProductCard key=\{product\.id\} product=\{product\} index=\{i\} \/>/g,
  `<ProductCard key={product.$id} product={product} index={i} />`
);

// 7. Add Loading state to grid
content = content.replace(
  /<div style=\{\{\n            display: "grid",\n            gridTemplateColumns: "repeat\(auto-fill, minmax\(240px, 1fr\)\)",\n            gap: "1.5rem",\n            marginBottom: "3.5rem",\n          \}\}>\n            <AnimatePresence mode="popLayout">\n              \{visible.map\(\(product, i\) => \(\n                <ProductCard key=\{product\.\$id\} product=\{product\} index=\{i\} \/>\n              \)\)\}\n            <\/AnimatePresence>\n          <\/div>/g,
  `{isLoading ? (\n            <div style={{\n              display: "grid",\n              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",\n              gap: "1.5rem",\n              marginBottom: "3.5rem",\n            }}>\n              {[...Array(INITIAL_COUNT)].map((_, i) => (\n                <div key={i} className="aspect-[4/5.5] rounded-[2.5rem] bg-[#1A1A1A] animate-pulse" />\n              ))}\n            </div>\n          ) : (\n            <div style={{\n              display: "grid",\n              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",\n              gap: "1.5rem",\n              marginBottom: "3.5rem",\n            }}>\n              <AnimatePresence mode="popLayout">\n                {visible.map((product, i) => (\n                  <ProductCard key={product.$id} product={product} index={i} />\n                ))}\n              </AnimatePresence>\n            </div>\n          )}`
);

fs.writeFileSync('src/components/SignatureDesigns.tsx', content);
console.log('Rewrite complete');
