const fs = require('fs');
let content = fs.readFileSync('src/components/SignatureDesigns.tsx', 'utf8');

// 1. Delete from Mock Products to end of Tilt Card
let startMock = content.indexOf('/* ─── Mock Products ───────────────────────────────────────────────── */');
let endTiltCard = content.indexOf('/* ─── Process Steps ───────────────────────────────────────────────── */');
if (startMock !== -1 && endTiltCard !== -1) {
  content = content.substring(0, startMock) + 'const CATEGORIES = ["All", "Bridal", "Engagement", "Reception"];\n\n' + content.substring(endTiltCard);
}

// 2. Main Page changes
let startMainPage = content.indexOf('export default function ProductPage() {');
if (startMainPage !== -1) {
  content = content.replace(
    'export default function ProductPage() {\n  useEffect(() => { injectFonts(); }, []);\n\n  const [activeCategory, setActiveCategory] = useState("All");',
    `export default function SignatureDesigns() {\n  useEffect(() => { injectFonts(); }, []);\n\n  const { data: dbProducts = [], isLoading } = useQuery({\n    queryKey: ['products-home'],\n    queryFn: () => getProducts(),\n  });\n\n  const [activeCategory, setActiveCategory] = useState("All");`
  );
}

// 3. PRODUCTS -> dbProducts
content = content.replace(
  /const filtered = activeCategory === "All"\n    \? PRODUCTS\n    : PRODUCTS\.filter\(\(p\) => p\.category === activeCategory\);/g,
  `const filtered = activeCategory === "All"\n    ? dbProducts\n    : dbProducts.filter((p) => p.category === activeCategory);`
);

// 4. product.id -> product.$id
content = content.replace(
  /<ProductCard key=\{product\.id\} product=\{product\} index=\{i\} \/>/g,
  `<ProductCard key={product.$id} product={product} index={i} />`
);

// 5. Grid mapping Loading state
content = content.replace(
  /<div style=\{\{\n            display: "grid",\n            gridTemplateColumns: "repeat\(auto-fill, minmax\(240px, 1fr\)\)",\n            gap: "1\.5rem",\n            marginBottom: "3\.5rem",\n          \}\}>\n            <AnimatePresence mode="popLayout">\n              \{visible\.map\(\(product, i\) => \(\n                <ProductCard key=\{product\.\$id\} product=\{product\} index=\{i\} \/>\n              \)\)\}\n            <\/AnimatePresence>\n          <\/div>/g,
  `{isLoading ? (
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
          )}`
);

fs.writeFileSync('src/components/SignatureDesigns.tsx', content);
console.log('Rewrite complete');
