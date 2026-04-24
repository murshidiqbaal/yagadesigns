const fs = require('fs');
let content = fs.readFileSync('src/components/SignatureDesigns.tsx', 'utf8');
content = content.replace(
  /export default function ProductPage\(\) \{\r?\n\s*useEffect\(\(\) => \{ injectFonts\(\); \}, \[\]\);\r?\n\r?\n\s*const \[activeCategory, setActiveCategory\] = useState\("All"\);/,
  `export default function SignatureDesigns() {\n  useEffect(() => { injectFonts(); }, []);\n\n  const { data: dbProducts = [], isLoading } = useQuery({\n    queryKey: ['products-home'],\n    queryFn: () => getProducts(),\n  });\n\n  const [activeCategory, setActiveCategory] = useState("All");`
);
fs.writeFileSync('src/components/SignatureDesigns.tsx', content);
console.log('Fixed export and useQuery');
