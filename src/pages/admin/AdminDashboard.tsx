import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, Tag, Clock, ArrowUpRight, Plus, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getProducts, checkSystemStatus } from "@/lib/appwrite";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dbOnline, setDbOnline] = useState<boolean | null>(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    categories: 0,
    lastUpdate: "—",
  });

  useEffect(() => {
    (async () => {
      try {
        const status = await checkSystemStatus();
        setDbOnline(status.database);

        if (status.database) {
          const products = await getProducts();
          const cats = new Set(products.map(p => p.category)).size;
          const latest = products[0]
            ? new Date(products[0].created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "—";
          setStats({ totalProducts: products.length, categories: cats, lastUpdate: latest });
        }
      } catch {
        toast.error("Could not reach Appwrite — check your connection.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Sparkles className="w-10 h-10 text-primary animate-pulse" />
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground animate-pulse">
          Loading dashboard…
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* ── Welcome ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-heading mb-1">
            Welcome back,
          </h1>
          <p className="text-xl text-primary font-heading italic tracking-tight lowercase">
            {user?.email?.split("@")[0] ?? "admin"}
          </p>
        </div>
        <Button asChild className="w-fit gap-2">
          <Link to="/admin/products">
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </Button>
      </motion.div>

      {/* ── DB Status Banner ─────────────────────────────────── */}
      {dbOnline === false && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex gap-4 items-start">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-1">
              Database Not Found
            </p>
            <p className="text-sm text-muted-foreground">
              Create a database <code className="text-primary">yaga_designs_db</code> with a{" "}
              <code className="text-primary">products</code> collection in your{" "}
              <a className="text-primary underline" href="https://cloud.appwrite.io" target="_blank" rel="noreferrer">
                Appwrite console
              </a>
              , then refresh.
            </p>
          </div>
        </div>
      )}

      {/* ── Stat Cards ───────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6"
      >
        <StatCard
          icon={Package}
          label="Total Products"
          value={stats.totalProducts}
          sub="In your collection"
          color="text-primary"
          link="/admin/products"
        />
        <StatCard
          icon={Tag}
          label="Categories"
          value={stats.categories}
          sub="Distinct styles"
          color="text-blue-400"
        />
        <StatCard
          icon={Clock}
          label="Last Upload"
          value={stats.lastUpdate}
          sub="Most recent product"
          color="text-emerald-400"
        />
      </motion.div>

      {/* ── Quick Actions ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground mb-4 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-primary" /> Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/admin/products"
            className="group flex items-center gap-4 p-5 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-white/8 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-widest group-hover:text-primary transition-colors">
                Manage Products
              </p>
              <p className="text-xs text-muted-foreground">Add, edit or remove designs</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 ml-auto transition-opacity" />
          </Link>

          <a
            href="/#/collections"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 p-5 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-white/8 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-black transition-all">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-widest group-hover:text-primary transition-colors">
                View Live Site
              </p>
              <p className="text-xs text-muted-foreground">See how the public sees your store</p>
            </div>
          </a>
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  link,
}: {
  icon: any;
  label: string;
  value: string | number;
  sub: string;
  color: string;
  link?: string;
}) {
  const content = (
    <Card className="glass border-white/5 bg-[#0A0A0A] hover:border-primary/25 transition-all group h-full">
      <CardContent className="pt-6">
        <div className={`w-10 h-10 rounded-lg bg-white/5 ${color} flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors`}>
          <Icon className="w-5 h-5" />
        </div>
        <p className="text-3xl font-heading mb-1">{value}</p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <p className="text-xs text-muted-foreground mt-3">{sub}</p>
      </CardContent>
    </Card>
  );
  return link ? <Link to={link}>{content}</Link> : content;
}
