import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./components/admin/AdminLayout.tsx";
import KeyboardShortcuts from "./components/admin/KeyboardShortcuts.tsx";
import CursorParticles from "./components/CursorParticles.tsx";
import FloatingOffers from "./components/FloatingOffers.tsx";
import MobileBottomNav from "./components/MobileBottomNav.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import SmoothScroll from "./components/SmoothScroll.tsx";
import { FavoritesProvider } from "./context/FavoritesContext.tsx";
import { AuthProvider } from "./hooks/useAuth.tsx";
import About from "./pages/About.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminLogin from "./pages/admin/AdminLogin.tsx";
import AdminOffers from "./pages/admin/AdminOffers.tsx";
import AdminOrders from "./pages/admin/AdminOrders.tsx";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail.tsx";
import AdminProductForm from "./pages/admin/AdminProductForm.tsx";
import AdminProducts from "./pages/admin/AdminProducts.tsx";
import AdminTestimonials from "./pages/admin/AdminTestimonials.tsx";
import Collections from "./pages/Collections.tsx";
import Contact from "./pages/Contact.tsx";
import Favorites from "./pages/Favorites.tsx";
import Index from "./pages/Index.tsx";
import MyOrders from "./pages/MyOrders.tsx";
import NotFound from "./pages/NotFound.tsx";
import Offers from "./pages/Offers.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <FavoritesProvider>
        <TooltipProvider>
          <SmoothScroll>
            <Toaster />
            <Sonner />
            <HashRouter>
              <ScrollToTop />
              <KeyboardShortcuts />
              <CursorParticles />
              <MobileBottomNav />
              <FloatingOffers />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/my-orders" element={<MyOrders />} />
                <Route path="/offers" element={<Offers />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route element={<AdminLayout />}>
                  <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/products" element={<AdminProducts />} />
                  <Route path="/admin/products/new" element={<AdminProductForm />} />
                  <Route path="/admin/products/:id/edit" element={<AdminProductForm />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
                  <Route path="/admin/testimonials" element={<AdminTestimonials />} />
                  <Route path="/admin/offers" element={<AdminOffers />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </HashRouter>
          </SmoothScroll>
        </TooltipProvider>
      </FavoritesProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
