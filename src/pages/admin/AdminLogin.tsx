import logoImg from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, loading, checkAuth } = useAuth();

  // Auto-redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate("/admin/dashboard");
    }
  }, [user, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Simulate professional loading delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (email === "yagadesigns2026@gmail.com" && password === "YagaDesigns@2026") {
        localStorage.setItem("admin_session", "true");
        await checkAuth();
        toast.success("Welcome to Yaga Designs Admin");
        navigate("/admin/dashboard");
      } else {
        toast.error("Invalid email or password.");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#D4AF37]/5 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <img
            src={logoImg}
            alt="Yaga Designs"
            className="h-16 w-auto mx-auto mb-5 opacity-90"
          />
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center">
              <Lock className="w-4 h-4 text-[#D4AF37]" />
            </div>
          </div>
          <p className="text-white/35 text-sm uppercase tracking-widest text-xs">
            Admin Console   Restricted Access
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[#0F0F0F] border border-white/8 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-white/40">
                Email
              </label>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@yagadesigns.com"
                required
                className="bg-white/5 border-white/10 focus:border-[#D4AF37]/50 h-12 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-white/40">
                Password
              </label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 focus:border-[#D4AF37]/50 h-12 rounded-xl pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              id="admin-login-btn"
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#D4AF37] text-black hover:bg-[#FFFBD5] font-bold uppercase tracking-widest rounded-xl text-sm transition-all duration-300 hover:shadow-[0_0_25px_rgba(212,175,55,0.4)]"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Sign In
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
