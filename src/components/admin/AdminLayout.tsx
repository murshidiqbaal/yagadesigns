import logoImg from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  ExternalLink,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  MessageSquareQuote,
  Package,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { icon: Package, label: "Products", path: "/admin/products" },
  { icon: MessageSquareQuote, label: "Testimonials", path: "/admin/testimonials" },
  { icon: Zap, label: "Special Offers", path: "/admin/offers" },
];

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050505]">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground animate-pulse">
            Loading Console…
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const currentLabel =
    NAV_ITEMS.find(i => location.pathname === i.path)?.label ?? "Admin";

  return (
    <div className="min-h-screen bg-[#050505] text-foreground flex">
      {/* ── Desktop Sidebar ─────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 bg-[#080808] fixed inset-y-0 z-50">
        {/* Brand */}
        <div className="px-6 py-5 border-b border-white/5">
          <Link to="/" className="inline-block">
            <img
              src={logoImg}
              alt="Yaga Designs"
              className="h-10 w-auto mix-blend-screen opacity-90 hover:opacity-100 transition-opacity duration-300"
            />
          </Link>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary/60 mt-1 pl-0.5">
            Admin Console
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {NAV_ITEMS.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${active
                    ? "bg-primary/12 text-primary border border-primary/20"
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={`w-4.5 h-4.5 w-5 h-5 ${active ? "text-primary" : "group-hover:text-white"
                      }`}
                  />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {active && <ChevronRight className="w-3.5 h-3.5 text-primary" />}
              </Link>
            );
          })}

          {/* View Site Link */}
          <a
            href="/#/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-white transition-all group mt-2"
          >
            <ExternalLink className="w-5 h-5" />
            <span className="text-sm font-medium">View Live Site</span>
          </a>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-sm font-bold">
              {user.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{user.email?.split("@")[0]}</p>
              <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">
                Online
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all text-sm"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* ── Main Content ────────────────────────────────────── */}
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-40 h-16 border-b border-white/5 bg-[#050505]/90 backdrop-blur-xl flex items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 text-muted-foreground hover:text-white transition-colors"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">
              {currentLabel}
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-sm font-bold">
              {user.email?.[0].toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 lg:p-10 flex-1">
          <Outlet />
        </div>
      </main>

      {/* ── Mobile Sidebar ──────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-[#080808] border-r border-white/5 z-[70] lg:hidden flex flex-col p-6"
            >
              <div className="flex items-center justify-between mb-8">
                <img
                  src={logoImg}
                  alt="Yaga Designs"
                  className="h-8 w-auto mix-blend-screen opacity-90"
                />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-muted-foreground hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 space-y-2">
                {NAV_ITEMS.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all ${location.pathname === item.path
                        ? "bg-primary text-primary-foreground font-bold"
                        : "text-muted-foreground hover:bg-white/5 hover:text-white"
                      }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>

              <Button
                variant="destructive"
                className="w-full mt-auto gap-2"
                onClick={logout}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
