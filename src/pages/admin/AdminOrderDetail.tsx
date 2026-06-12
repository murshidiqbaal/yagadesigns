import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  Copy,
  Clock,
  Trash2,
  Loader2,
  Calendar,
  User,
  ShoppingBag,
  Mail,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import {
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  Order,
  getImageUrl,
} from "@/lib/appwrite";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const { data: order, isLoading, error } = useQuery({
    queryKey: ["admin-order", id],
    queryFn: () => getOrderById(id || ""),
    enabled: !!id,
  });

  const updateStatusMut = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: Order["status"] }) =>
      updateOrderStatus(orderId, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-order", id] });
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order status updated.");
    },
    onError: () => toast.error("Failed to update order status."),
  });

  const deleteMut = useMutation({
    mutationFn: (orderId: string) => deleteOrder(orderId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order record permanently removed.");
      navigate("/admin/orders");
    },
    onError: () => toast.error("Failed to delete order."),
  });

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    toast.success("Phone number copied to clipboard!");
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const handleWhatsApp = (o: Order) => {
    const message = `Hello ${o.customer_name},\n\nThank you for contacting Yaga Designs regarding:\n${o.product_name}\n\nOur team is ready to assist you.`;
    const cleanPhone = o.phone_number.replace(/\D/g, "");
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, "_blank");
  };

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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
        <p className="text-sm text-white/40 tracking-wider">Loading Order Details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-6 max-w-xl mx-auto text-center py-20">
        <ShoppingBag className="w-16 h-16 text-white/20 mx-auto" />
        <h2 className="text-2xl font-heading text-white">Order Not Found</h2>
        <p className="text-white/60 text-sm">
          The requested order does not exist or has been deleted from the database.
        </p>
        <Button
          onClick={() => navigate("/admin/orders")}
          variant="outline"
          className="border-white/5 bg-[#0F0F0F] hover:bg-white/5 text-white/80"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Back & Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="space-y-2">
          <button
            onClick={() => navigate("/admin/orders")}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF37] hover:text-[#D4AF37]/80 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to List
          </button>
          <div className="flex flex-wrap items-baseline gap-3">
            <h1 className="text-3xl md:text-4xl font-heading text-white">
              Enquiry Details
            </h1>
            <span className="text-xs font-mono text-white/40 tracking-widest">
              ID: {order.order_id}
            </span>
          </div>
        </div>

        <Badge
          variant="outline"
          className={`text-xs px-4 py-1.5 uppercase font-bold tracking-widest ${getStatusColorClass(
            order.status
          )}`}
        >
          {order.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Client Details & Gown Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Customer Details Card */}
          <Card className="glass border-white/5 bg-[#0F0F0F] rounded-3xl overflow-hidden shadow-xl">
            <CardHeader className="border-b border-white/5 px-6 py-5 flex flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="font-heading text-xl text-white">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 block mb-1">
                    Customer Name
                  </span>
                  <span className="text-base font-semibold text-white">{order.customer_name}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 block mb-1">
                    Phone Number
                  </span>
                  <span className="text-base font-semibold text-white flex items-center gap-2">
                    {order.phone_number}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 block mb-1">
                    Email Address
                  </span>
                  <span className="text-base font-semibold text-white break-all flex items-center gap-2">
                    <Mail className="w-4 h-4 text-white/30 shrink-0" />
                    {order.email || "Not provided"}
                  </span>
                </div>

                {order.wedding_date && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 block mb-1">
                      Wedding / Event Date
                    </span>
                    <span className="text-base font-semibold text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary shrink-0" />
                      {order.wedding_date}
                    </span>
                  </div>
                )}
              </div>

              {/* Quick Action Shortcuts */}
              <div className="flex flex-wrap gap-3 pt-6 border-t border-white/5">
                <Button
                  onClick={() => handleCall(order.phone_number)}
                  variant="outline"
                  className="rounded-xl bg-white/5 border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 text-xs text-white/80 gap-2 px-5 py-5"
                >
                  <Phone className="w-4 h-4 text-blue-400" /> Call Client
                </Button>
                <Button
                  onClick={() => handleWhatsApp(order)}
                  variant="outline"
                  className="rounded-xl bg-white/5 border-white/5 hover:border-green-500/30 hover:bg-green-500/5 text-xs text-white/80 gap-2 px-5 py-5"
                >
                  <MessageCircle className="w-4 h-4 text-green-400 fill-green-400/20" /> WhatsApp Direct
                </Button>
                <Button
                  onClick={() => handleCopyPhone(order.phone_number)}
                  variant="outline"
                  className="rounded-xl bg-white/5 border-white/5 hover:border-primary/30 hover:bg-primary/5 text-xs text-white/80 gap-2 px-5 py-5"
                >
                  <Copy className="w-4 h-4 text-primary" /> Copy Number
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* requested design details */}
          <Card className="glass border-white/5 bg-[#0F0F0F] rounded-3xl overflow-hidden shadow-xl">
            <CardHeader className="border-b border-white/5 px-6 py-5 flex flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="font-heading text-xl text-white">Requested Gown & Design</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-32 h-44 rounded-2xl bg-black overflow-hidden border border-white/5 shrink-0 shadow-lg">
                  {order.product_image ? (
                    <img
                      src={getImageUrl(order.product_image)}
                      alt={order.product_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-white/20" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-2xl font-heading text-white">{order.product_name}</h3>
                    <p className="text-xs text-white/40 mt-1 flex items-center gap-1.5">
                      <span>Product ID: <strong>{order.product_id}</strong></span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs pt-2">
                    <div>
                      <span className="text-[10px] uppercase text-white/30 block mb-0.5">Selected Color</span>
                      <span className="text-sm font-semibold text-white">{order.selected_color || "Default"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-white/30 block mb-0.5">Selected Size</span>
                      <span className="text-sm font-semibold text-white">{order.selected_size || "Standard / Custom"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-white/30 block mb-0.5">Quantity</span>
                      <span className="text-sm font-semibold text-white">{order.quantity || 1} Pc(s)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customization Notes */}
          <Card className="glass border-white/5 bg-[#0F0F0F] rounded-3xl overflow-hidden shadow-xl">
            <CardHeader className="border-b border-white/5 px-6 py-5 flex flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="font-heading text-xl text-white">Customization & Notes</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {order.customization_notes ? (
                <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 text-sm leading-relaxed text-white/80 italic font-light relative pl-8">
                  <span className="absolute left-3 top-4 text-3xl text-primary/40 font-serif leading-none">“</span>
                  {order.customization_notes}
                </div>
              ) : (
                <p className="text-xs text-white/30 italic">No custom design instructions or notes were provided with this enquiry.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Column: Status Control & Delete Action */}
        <div className="space-y-8">
          {/* Status Panel */}
          <Card className="glass border-white/5 bg-[#0F0F0F] rounded-3xl overflow-hidden shadow-xl">
            <CardHeader className="border-b border-white/5 px-6 py-5 flex flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="font-heading text-xl text-white">Workflow Status</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Update Status</p>
                <div className="flex flex-col gap-2">
                  {(["New", "Contacted", "In Progress", "Completed", "Cancelled"] as Order["status"][]).map((st) => (
                    <button
                      key={st}
                      onClick={() => updateStatusMut.mutate({ orderId: order.$id, status: st })}
                      disabled={updateStatusMut.isPending}
                      className={`w-full py-3 px-4 rounded-xl text-xs uppercase font-bold tracking-widest border transition-all text-left flex items-center justify-between ${
                        order.status === st
                          ? "border-[#D4AF37] bg-[#D4AF37]/15 text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.05)]"
                          : "border-white/5 bg-white/5 text-white/40 hover:text-white hover:bg-white/8 hover:border-white/10"
                      }`}
                    >
                      <span>{st}</span>
                      {order.status === st && <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 text-[10px] text-white/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span>Received:</span>
                  <span className="font-medium text-white/50">
                    {new Date(order.created_at).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delete Gown Record */}
          <Card className="border-red-500/10 bg-red-950/5 rounded-3xl overflow-hidden shadow-xl">
            <CardHeader className="border-b border-red-500/15 px-6 py-5 flex flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <CardTitle className="font-heading text-xl text-red-400">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {deleteConfirmation ? (
                <div className="space-y-4">
                  <p className="text-xs text-red-400 leading-relaxed">
                    This action will permanently delete this enquiry from your database. There is no recovery.
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => deleteMut.mutate(order.$id)}
                      disabled={deleteMut.isPending}
                      variant="destructive"
                      className="w-full rounded-xl py-5"
                    >
                      {deleteMut.isPending ? "Removing..." : "Delete Permanently"}
                    </Button>
                    <Button
                      onClick={() => setDeleteConfirmation(false)}
                      variant="outline"
                      className="w-full rounded-xl border-white/10 hover:bg-white/5 text-white"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-white/40 leading-relaxed">
                    Remove this enquiry record once it is no longer required in your leads database.
                  </p>
                  <Button
                    onClick={() => setDeleteConfirmation(true)}
                    variant="outline"
                    className="w-full text-red-400 hover:text-red-300 border-red-500/20 hover:border-red-500/40 bg-red-500/5 hover:bg-red-500/10 rounded-xl py-5 font-bold uppercase tracking-widest text-[10px]"
                  >
                    Delete Record
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
