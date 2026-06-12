import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { appwriteConfig, client, databases, getImageUrl, Order } from "@/lib/appwrite";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { Query } from "appwrite";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  FileText,
  HelpCircle,
  Info,
  MessageCircle,
  PhoneCall,
  Scissors,
  Search,
  ShoppingBag,
  Sparkles,
  XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchId, setSearchId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  // Load orders from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("my_orders");
      if (stored) {
        setOrders(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load local orders:", e);
    }
  }, []);

  // Set up real-time subscription to track order updates from Appwrite
  useEffect(() => {
    const unsubscribe = client.subscribe(
      `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.ordersCollectionId}.documents`,
      (response) => {
        const updatedDoc = response.payload as Order;
        const isUpdate = response.events.some((e) => e.includes(".update"));
        const isDelete = response.events.some((e) => e.includes(".delete"));

        if (isUpdate) {
          setOrders((prevOrders) => {
            const exists = prevOrders.some((o) => o.$id === updatedDoc.$id);
            if (exists) {
              const newOrders = prevOrders.map((o) => (o.$id === updatedDoc.$id ? updatedDoc : o));
              localStorage.setItem("my_orders", JSON.stringify(newOrders));
              return newOrders;
            }
            return prevOrders;
          });
        } else if (isDelete) {
          setOrders((prevOrders) => {
            const exists = prevOrders.some((o) => o.$id === updatedDoc.$id);
            if (exists) {
              const newOrders = prevOrders.filter((o) => o.$id !== updatedDoc.$id);
              localStorage.setItem("my_orders", JSON.stringify(newOrders));
              return newOrders;
            }
            return prevOrders;
          });
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Save updated orders array to state & localStorage
  const saveOrders = (updatedOrders: Order[]) => {
    setOrders(updatedOrders);
    try {
      localStorage.setItem("my_orders", JSON.stringify(updatedOrders));
    } catch (e) {
      console.error("Failed to save orders to localStorage:", e);
    }
  };

  // Track / import an order using the Order ID (e.g. YG-123456)
  const handleSearchOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const queryId = searchId.trim().toUpperCase();
    if (!queryId) return;

    setIsSearching(true);
    try {
      // Search by order_id attribute
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.ordersCollectionId,
        [
          Query.equal("order_id", [queryId])
        ]
      );

      if (response.documents.length === 0) {
        toast.error(`Order ID "${queryId}" not found. Please verify the ID.`);
        setIsSearching(false);
        return;
      }

      const foundOrder = response.documents[0] as unknown as Order;

      // Add to list if not already there
      const exists = orders.some(o => o.$id === foundOrder.$id);
      if (exists) {
        // Just update it
        const updated = orders.map(o => o.$id === foundOrder.$id ? foundOrder : o);
        saveOrders(updated);
        toast.success(`Order "${queryId}" status updated.`);
      } else {
        // Insert new order at the beginning
        saveOrders([foundOrder, ...orders]);
        toast.success(`Order "${queryId}" added to your tracking list!`);
      }
      setSearchId("");
    } catch (error: any) {
      console.error("Search order failed:", error);
      toast.error("Could not find order. Make sure the ID is correct.");
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "New":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "Contacted":
        return "bg-sky-500/10 text-sky-400 border-sky-500/30";
      case "In Progress":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      case "Completed":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "Cancelled":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      default:
        return "bg-white/10 text-white border-white/20";
    }
  };

  const handleWhatsAppInquiry = (order: Order) => {
    const message = `Hi Yaga Designs,\n\nI want to check the status of my order:\nOrder ID: ${order.order_id}\nDesign: ${order.product_name}\nSelected Color: ${order.selected_color || "Default"}\nQuantity: ${order.quantity || 1}`;
    const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  // Sort orders latest-first (by created_at string in descending order)
  const sortedOrders = [...orders].sort((a, b) => {
    const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return timeB - timeA;
  });

  // Stats calculation
  const totalEnquiries = orders.length;
  const inProgressCount = orders.filter(o => o.status === "In Progress").length;
  const contactedCount = orders.filter(o => o.status === "Contacted").length;
  const completedCount = orders.filter(o => o.status === "Completed").length;

  const steps = [
    { label: "Enquiry Sent", status: "New", desc: "Enquiry received successfully" },
    { label: "Consultation", status: "Contacted", desc: "Measurements & design options planned" },
    { label: "Handcrafting", status: "In Progress", desc: "Artisans tailoring outfit in our studio" },
    { label: "Completed", status: "Completed", desc: "Couture creation ready for trial/handover" },
  ];

  const getStepIndex = (status: Order["status"]) => {
    switch (status) {
      case "New": return 0;
      case "Contacted": return 1;
      case "In Progress": return 2;
      case "Completed": return 3;
      default: return -1;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <SEO
        title="My Orders - Yaga Designs"
        description="Track your bridal gown and wedding outfit enquiries at Yaga Designs."
      />
      <Header />

      <main className="flex-grow container max-w-4xl px-4 pt-28 pb-24">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-white transition-colors mb-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>
            <h1 className="text-3xl font-heading font-normal tracking-wide mt-1">My Orders</h1>
            <p className="text-xs text-white/50 mt-1">Track and manage your heritage bridal couture enquiries in real-time.</p>
          </div>

          <div className="flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-3 py-1.5 rounded-full self-start sm:self-auto select-none">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Live Syncing</span>
          </div>
        </div>

        {/* Beginner's Atelier Guide Toggle */}
        <div className="mb-6">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-all bg-white/[0.03] hover:bg-white/[0.06] px-4 py-2.5 rounded-xl border border-white/10 active:scale-[0.98] cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{showGuide ? "Hide Atelier Guide" : "New to tracking? Read our Atelier Guide"}</span>
          </button>
        </div>

        {/* Onboarding Guide Content */}
        <AnimatePresence>
          {showGuide && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-6 rounded-3xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-[#D4AF37]/20 backdrop-blur-xl">
                <div className="flex items-center gap-2.5 mb-4">
                  <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="font-heading text-base text-white tracking-wide">Atelier Design & Stitching Guide</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-white/70 leading-relaxed">
                  <div className="space-y-2">
                    <div className="w-7 h-7 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] font-bold text-[10px]">1</div>
                    <h4 className="font-bold text-white uppercase tracking-wider">Place Order</h4>
                    <p className="text-white/50 text-[11px]">
                      Explore our couture collections, select color/custom options, and submit your request. An Order ID is created automatically.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-7 h-7 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] font-bold text-[10px]">2</div>
                    <h4 className="font-bold text-white uppercase tracking-wider">Stylist Consultation</h4>
                    <p className="text-white/50 text-[11px]">
                      Our designers will review details, schedule trials, take sizing measurements, and finalize heritage fabric selections.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-7 h-7 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] font-bold text-[10px]">3</div>
                    <h4 className="font-bold text-white uppercase tracking-wider">Artisan Handcrafting</h4>
                    <p className="text-white/50 text-[11px]">
                      Watch progress live as artisans sew your bridal dress. Once done, we schedule final fittings and deliver your dream gown.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Statistics */}
        {orders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold block mb-1">Total Enquiries</span>
              <span className="text-2xl font-heading text-white">{totalEnquiries}</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold block mb-1">Consultations</span>
              <span className="text-2xl font-heading text-[#38bdf8]">{contactedCount}</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold block mb-1">In Production</span>
              <span className="text-2xl font-heading text-[#c084fc]">{inProgressCount}</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold block mb-1">Atelier Ready</span>
              <span className="text-2xl font-heading text-[#34d399]">{completedCount}</span>
            </div>
          </motion.div>
        )}

        {/* Track Order Search Card */}
        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-xl mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-3">Track another order</h2>
          <form onSubmit={handleSearchOrder} className="flex gap-2">
            <div className="relative flex-grow">
              <input
                type="text"
                required
                placeholder="Enter Order ID (e.g. YG-123456)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-[#D4AF37]/50 focus:outline-none transition-colors text-sm"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            </div>
            <Button
              type="submit"
              disabled={isSearching}
              className="bg-primary text-black font-bold uppercase tracking-wider rounded-xl px-6 h-12 text-xs hover:shadow-[0_0_15px_rgba(212,175,55,0.35)] transition-all cursor-pointer shrink-0"
            >
              {isSearching ? "Searching..." : "Track"}
            </Button>
          </form>

          {/* Beginner Search Helper Text */}
          <p className="text-[10px] text-white/40 mt-3.5 flex items-start gap-2 leading-relaxed">
            <Info className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
            <span>
              <strong>Where is my Order ID?</strong> A unique ID (e.g., YG-123456) is generated and stored in this browser automatically when you enquire on a gown. If you enquired on another device, enter the ID above to sync it.
            </span>
          </p>
        </div>

        {/* Orders List / Empty State */}
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 px-6 rounded-3xl bg-white/[0.01] border border-dashed border-white/10 backdrop-blur-md relative overflow-hidden"
          >
            <div className="w-20 h-20 rounded-full bg-[#D4AF37]/5 border border-[#D4AF37]/10 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-[#D4AF37]/50" />
            </div>
            <h3 className="text-2xl font-heading font-normal text-white">No orders found</h3>
            <p className="text-sm text-white/40 max-w-md mx-auto mt-3 leading-relaxed">
              We couldn't find any enquiries placed on this browser. You can track an existing order above or browse our heritage collections.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link to="/collections">
                <Button className="bg-primary text-black font-bold uppercase tracking-wider rounded-xl px-8 py-6 text-xs transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-[1.02] cursor-pointer">
                  Browse Collections
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {sortedOrders.map((order, index) => {
                const currentStep = getStepIndex(order.status);
                const isCancelled = order.status === "Cancelled";

                return (
                  <motion.div
                    key={order.$id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="rounded-3xl bg-white/[0.02] border border-white/5 hover:border-[#D4AF37]/20 transition-all duration-500 overflow-hidden flex flex-col md:flex-row shadow-[0_10px_35px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.03)] group"
                  >
                    {/* Product Thumbnail */}
                    <div className="w-full md:w-44 aspect-[4/5] bg-white/5 shrink-0 relative overflow-hidden">
                      {order.product_image ? (
                        <img
                          src={getImageUrl(order.product_image)}
                          alt={order.product_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20">
                          <ShoppingBag className="w-10 h-10" />
                        </div>
                      )}
                      {/* Status Overlay for Mobile */}
                      <span className={`md:hidden absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(order.status)} backdrop-blur-md`}>
                        {order.status}
                      </span>
                    </div>

                    {/* Details Section */}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/30">
                              {order.order_id}
                            </span>
                            <h3 className="font-heading text-xl text-white mt-2 font-normal">{order.product_name}</h3>
                          </div>

                          {/* Status Badge for Desktop */}
                          <span className={`hidden md:inline-block px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>

                        {/* Meta info tags */}
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/60">
                          {order.selected_color && (
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#D4AF37" }} />
                              <span>Color: <strong className="text-white">{order.selected_color}</strong></span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>Qty: <strong className="text-white">{order.quantity || 1}</strong></span>
                          </div>
                          {order.wedding_date && (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span>Wedding Date: <strong className="text-white">{order.wedding_date}</strong></span>
                            </div>
                          )}
                        </div>

                        {/* Custom notes */}
                        {order.customization_notes && (
                          <div className="p-3.5 rounded-2xl bg-white/[0.01] border border-white/5 text-xs text-white/60 italic leading-relaxed">
                            &ldquo;{order.customization_notes}&rdquo;
                          </div>
                        )}

                        {/* Production Timeline Stepper */}
                        {isCancelled ? (
                          <div className="mt-6 pt-6 border-t border-rose-500/10">
                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-rose-400">
                              <XCircle className="w-5 h-5 shrink-0" />
                              <div className="text-xs">
                                <p className="font-bold uppercase tracking-wider">Order Cancelled</p>
                                <p className="text-rose-400/70 mt-0.5">This enquiry has been cancelled. Please contact our studio team if you have any questions.</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-6 pt-6 border-t border-white/5">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-4">Atelier Journey</div>

                            {/* Desktop/Wide Tablet Timeline (Horizontal) - Shown on large screens (lg and up) */}
                            <div className="hidden lg:flex justify-between items-center w-full px-2 relative">
                              {/* Connector line */}
                              <div className="absolute left-6 right-6 top-[14px] h-[2px] bg-white/5 -z-10" />
                              <div
                                className="absolute left-6 top-[14px] h-[2px] bg-[#D4AF37] -z-10 transition-all duration-700 ease-in-out"
                                style={{ width: `${(Math.max(0, currentStep) / (steps.length - 1)) * 85}%` }}
                              />

                              {steps.map((step, sIdx) => {
                                const isCompleted = sIdx < currentStep;
                                const isActive = sIdx === currentStep;
                                const isFuture = sIdx > currentStep;

                                return (
                                  <div key={sIdx} className="flex flex-col items-center flex-1 relative group">
                                    <div
                                      className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-500 ${isCompleted
                                          ? "bg-[#D4AF37] border-[#D4AF37] text-black shadow-[0_0_10px_rgba(212,175,55,0.2)]"
                                          : isActive
                                            ? "bg-black border-[#D4AF37] text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.4)] ring-4 ring-[#D4AF37]/10"
                                            : "bg-[#0A0A0A] border-white/10 text-white/30"
                                        }`}
                                    >
                                      {sIdx === 0 && <FileText className="w-3.5 h-3.5" />}
                                      {sIdx === 1 && <PhoneCall className="w-3.5 h-3.5" />}
                                      {sIdx === 2 && <Scissors className="w-3.5 h-3.5" />}
                                      {sIdx === 3 && <CheckCircle2 className="w-3.5 h-3.5" />}
                                    </div>
                                    <span className={`text-[9px] font-bold uppercase tracking-wider mt-2 transition-colors duration-500 text-center ${isActive ? "text-[#D4AF37]" : isCompleted ? "text-white/70" : "text-white/20"
                                      }`}>
                                      {step.label}
                                    </span>
                                    <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bg-black/95 border border-white/10 rounded-xl px-3 py-1.5 text-[10px] text-white/70 whitespace-nowrap z-20 shadow-2xl">
                                      {step.desc}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Mobile/Tablet Timeline (Vertical) - Shown on mobile & tablets (under lg screens) */}
                            <div className="lg:hidden relative pl-4 py-2 space-y-0 text-left">
                              {steps.map((step, sIdx) => {
                                const isCompleted = sIdx < currentStep;
                                const isActive = sIdx === currentStep;
                                const isFuture = sIdx > currentStep;
                                const isLast = sIdx === steps.length - 1;

                                return (
                                  <div key={sIdx} className="flex items-start gap-4 relative pb-6 last:pb-0">
                                    {/* Line connecting to the next step */}
                                    {!isLast && (
                                      <div
                                        className={`absolute left-[11px] top-6 w-[2px] h-[calc(100%-12px)] transition-colors duration-700 ease-in-out ${sIdx < currentStep ? "bg-[#D4AF37]" : "bg-white/5"
                                          }`}
                                      />
                                    )}
                                    <div
                                      className={`w-6 h-6 rounded-full flex items-center justify-center border text-[10px] shrink-0 z-10 transition-all duration-500 ${isCompleted
                                          ? "bg-[#D4AF37] border-[#D4AF37] text-black shadow-[0_0_8px_rgba(212,175,55,0.15)]"
                                          : isActive
                                            ? "bg-black border-[#D4AF37] text-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.35)] ring-4 ring-[#D4AF37]/5"
                                            : "bg-[#0A0A0A] border-white/10 text-white/30"
                                        }`}
                                    >
                                      {sIdx === 0 && <FileText className="w-3.5 h-3.5" />}
                                      {sIdx === 1 && <PhoneCall className="w-3.5 h-3.5" />}
                                      {sIdx === 2 && <Scissors className="w-3.5 h-3.5" />}
                                      {sIdx === 3 && <CheckCircle2 className="w-3.5 h-3.5" />}
                                    </div>
                                    <div className="flex flex-col">
                                      <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-500 ${isActive ? "text-[#D4AF37]" : isCompleted ? "text-white/70" : "text-white/20"
                                        }`}>
                                        {step.label}
                                      </span>
                                      <span className="text-[9px] text-white/40 mt-0.5 leading-relaxed">
                                        {step.desc}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions footer */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-4 border-t border-white/5">
                        <span className="text-[10px] text-white/40">
                          Submitted on: {new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: "medium" })}
                        </span>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleWhatsAppInquiry(order)}
                            className="bg-transparent border border-[#D4AF37]/20 hover:border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/5 font-bold uppercase tracking-wider text-[10px] rounded-xl px-4 py-3.5 gap-2 transition-all h-auto cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-current" />
                            Contact Studio
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
