const fs = require('fs');
let content = fs.readFileSync('src/components/SignatureDesigns.tsx', 'utf8');

const replacement = `
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
`;

// Find where to insert (after useQuery)
content = content.replace(/queryFn: \(\) => getProducts\(\),\r?\n\s*\}\);\r?\n/, `queryFn: () => getProducts(),\n  });\n${replacement}\n`);

fs.writeFileSync('src/components/SignatureDesigns.tsx', content);
console.log('Final fix applied');
