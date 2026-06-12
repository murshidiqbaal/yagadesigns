import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Search,
  Clock,
  Calendar,
  ShoppingBag,
  Eye,
  RefreshCw,
} from "lucide-react";
import {
  getOrders,
  Order,
  getImageUrl,
} from "@/lib/appwrite";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminOrders() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("All");

  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => getOrders(),
  });

  // Calculate stats
  const totalOrders = orders.length;
  const newOrders = orders.filter((o) => o.status === "New").length;
  const contactedOrders = orders.filter((o) => o.status === "Contacted").length;
  const inProgressOrders = orders.filter((o) => o.status === "In Progress").length;
  const completedOrders = orders.filter((o) => o.status === "Completed").length;
  const cancelledOrders = orders.filter((o) => o.status === "Cancelled").length;

  // Filter & Search logic
  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === "All" || order.status === activeTab;
    const matchesSearch =
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone_number.includes(searchQuery) ||
      order.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.order_id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusColorClass = (status: Order["status"]) => {
    switch (status) {
      case "New":
        return "border-amber-500/20 bg-amber-500/10 text-amber-400";
      case "Contacted":
        return "border-blue-500/20 bg-blue-500/10 text-blue-400";
      case "In Progress":
        return "border-purple-500/20 bg-purple-500/10 text-purple-400";
      case "Completed":
        return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
      case "Cancelled":
        return "border-red-500/20 bg-red-500/10 text-red-400";
      default:
        return "border-white/10 bg-white/5 text-white/50";
    }
  };

  return (
    <div className="space-y-10">
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-heading text-white">Orders & Enquiries</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your bridal leads, status updates, and customer communications
          </p>
        </div>
        <Button
          onClick={() => refetch()}
          variant="outline"
          className="gap-2 shrink-0 border-white/5 bg-[#0F0F0F] hover:bg-white/5 text-white"
        >
          <RefreshCw className="w-4 h-4" /> Refresh List
        </Button>
      </div>

      {/* ── KPI Cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPIStatCard label="Total Leads" value={totalOrders} color="text-[#D4AF37]" sub="All time enquiries" />
        <KPIStatCard label="New" value={newOrders} color="text-amber-400" sub="Awaiting response" />
        <KPIStatCard label="Contacted" value={contactedOrders} color="text-blue-400" sub="First touch done" />
        <KPIStatCard label="In Progress" value={inProgressOrders} color="text-purple-400" sub="Design & Fit" />
        <KPIStatCard label="Completed" value={completedOrders} color="text-emerald-400" sub="Delivered gowns" />
        <KPIStatCard label="Cancelled" value={cancelledOrders} color="text-red-400" sub="Dropped leads" />
      </div>

      {/* ── Search & Filter Controls ─────────────────────────── */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 p-6 rounded-3xl bg-[#0F0F0F] border border-white/5">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/40" />
          <input
            type="text"
            placeholder="Search by customer name, phone, product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#D4AF37]/50 focus:outline-none transition-colors text-sm"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          {["All", "New", "Contacted", "In Progress", "Completed", "Cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold border transition-all ${
                activeTab === status
                  ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]"
                  : "border-white/5 bg-white/5 text-white/40 hover:text-white hover:border-white/10"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table/List Area ──────────────────────────────────── */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 rounded-3xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-24 rounded-3xl bg-[#0F0F0F] border border-white/5 border-dashed">
          <ShoppingBag className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h3 className="font-heading text-2xl text-white mb-2">No Enquiries Found</h3>
          <p className="text-muted-foreground text-sm">
            Try adjusting your search criteria or status filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredOrders.map((order) => (
            <motion.div
              key={order.$id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#0F0F0F] border border-white/5 hover:border-[#D4AF37]/30 transition-all"
            >
              {/* Product Thumbnail & Client Info */}
              <div className="flex gap-4 min-w-0">
                <div className="w-14 h-18 rounded-xl bg-black overflow-hidden shrink-0 border border-white/5">
                  {order.product_image ? (
                    <img
                      src={getImageUrl(order.product_image)}
                      alt={order.product_name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-white/20" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono tracking-wider text-[#D4AF37] uppercase font-bold">
                      {order.order_id}
                    </span>
                    <Badge variant="outline" className={`text-[8px] px-2 py-px uppercase tracking-wider ${getStatusColorClass(order.status)}`}>
                      {order.status}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-heading text-white truncate">{order.customer_name}</h3>
                  <p className="text-xs text-white/40 truncate">{order.product_name}</p>
                </div>
              </div>

              {/* Middle Info (Wedding Date / Phone) */}
              <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs text-white/50 px-1 sm:px-0">
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-white/30 font-bold mb-0.5">Phone</div>
                  <div className="font-semibold text-white/70">{order.phone_number}</div>
                </div>

                {order.wedding_date && (
                  <div>
                    <div className="text-[9px] uppercase tracking-widest text-white/30 font-bold mb-0.5">Wedding Date</div>
                    <div className="flex items-center gap-1 text-white/70">
                      <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                      {order.wedding_date}
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-[9px] uppercase tracking-widest text-white/30 font-bold mb-0.5">Submitted</div>
                  <div className="flex items-center gap-1 text-white/70">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    {new Date(order.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 justify-end pt-2 sm:pt-0">
                <Button
                  onClick={() => navigate(`/admin/orders/${order.$id}`)}
                  variant="ghost"
                  className="rounded-xl px-4 py-2 border border-white/5 hover:border-[#D4AF37]/30 hover:bg-white/5 gap-2 text-xs text-white/80"
                >
                  <Eye className="w-4 h-4 text-[#D4AF37]" /> Details
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function KPIStatCard({
  label,
  value,
  color,
  sub,
}: {
  label: string;
  value: number;
  color: string;
  sub: string;
}) {
  return (
    <Card className="glass border-white/5 bg-[#0F0F0F] transition-all hover:border-white/10 group h-full">
      <CardContent className="pt-5 pb-5 px-5">
        <p className={`text-4xl font-heading mb-1 transition-transform group-hover:scale-105 ${color}`}>
          {value}
        </p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">
          {label}
        </p>
        <p className="text-[9px] text-white/30 mt-2 font-medium">{sub}</p>
      </CardContent>
    </Card>
  );
}
