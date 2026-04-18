import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./components/admin/AdminLayout.tsx";
import KeyboardShortcuts from "./components/admin/KeyboardShortcuts.tsx";
import { AuthProvider } from "./hooks/useAuth.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminLogin from "./pages/admin/AdminLogin.tsx";
import AdminProducts from "./pages/admin/AdminProducts.tsx";
import Index from "./pages/Index.tsx";
import Collections from "./pages/Collections.tsx";
import Favorites from "./pages/Favorites.tsx";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";
import NotFound from "./pages/NotFound.tsx";
import SmoothScroll from "./components/SmoothScroll.tsx";
import CursorParticles from "./components/CursorParticles.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <SmoothScroll>
          <Toaster />
          <Sonner />
          <HashRouter>
            <KeyboardShortcuts />
            <CursorParticles />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<AdminProducts />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        </SmoothScroll>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
