import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const ADMIN_STORAGE_KEY = "yaga_admin_session";
const ADMIN_EMAIL = "yagadesigns2026@gmail.com";
const ADMIN_PASSWORD = "Yagadesigns@2026";

export interface AdminUser {
  email: string;
}

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  checkAuth: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AdminUser;
        if (parsed?.email === ADMIN_EMAIL) {
          setUser(parsed);
        } else {
          localStorage.removeItem(ADMIN_STORAGE_KEY);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      throw new Error("Invalid email or password.");
    }
    const adminUser: AdminUser = { email: ADMIN_EMAIL };
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminUser));
    setUser(adminUser);
  };

  const logout = async () => {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    setUser(null);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
