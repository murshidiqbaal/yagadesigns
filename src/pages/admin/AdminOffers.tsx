import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Plus, Trash2, Eye, EyeOff, Loader2, X, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import { getOffers, createOffer, deleteOffer, updateOffer, Offer, uploadProductImage } from "@/lib/appwrite";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AdminOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    image_url: "",
    button_text: "Discover Now",
    link: "",
    isActive: true,
  });

  useEffect(() => {
    fetchOffers();
  }, []);

  async function fetchOffers() {
    setLoading(true);
    const data = await getOffers();
    setOffers(data);
    setLoading(false);
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadProductImage(file);
      setForm({ ...form, image_url: url });
      toast.success("Design uploaded successfully");
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) {
      toast.error("Please provide a title for the offer.");
      return;
    }

    setIsSaving(true);
    try {
      await createOffer(form);
      toast.success("Offer campaign created!");
      setIsModalOpen(false);
      setForm({
        title: "",
        subtitle: "",
        image_url: "",
        button_text: "Discover Now",
        link: "",
        isActive: true,
      });
      fetchOffers();
    } catch (error) {
      toast.error("Failed to save offer.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleOfferStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateOffer(id, { isActive: !currentStatus });
      toast.success(`Offer ${!currentStatus ? "activated" : "deactivated"}`);
      fetchOffers();
    } catch (error) {
      toast.error("Update failed.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this promotional campaign?")) return;
    try {
      await deleteOffer(id);
      toast.success("Campaign removed.");
      fetchOffers();
    } catch (error) {
      toast.error("Delete failed.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading mb-1 flex items-center gap-3">
            <Zap className="text-primary w-8 h-8" /> Special Offers
          </h1>
          <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">
            Manage your boutique's promotional popups
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 h-12 px-6 rounded-xl shadow-[0_10px_20px_rgba(212,175,55,0.15)]">
          <Plus className="w-4 h-4" /> Create Campaign
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Preparing seasonal offers...</p>
        </div>
      ) : offers.length === 0 ? (
        <div className="text-center py-24 bg-white/[0.02] border border-dashed border-white/5 rounded-[2.5rem]">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-white/5" />
          </div>
          <h3 className="text-xl font-heading text-white">No active campaigns</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">Create a popup offer to welcome your boutique visitors.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {offers.map((offer) => (
            <motion.div
              key={offer.$id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-6 rounded-[2rem] border transition-all duration-500 ${offer.isActive ? "bg-primary/[0.03] border-primary/20" : "bg-white/[0.02] border-white/5"}`}
            >
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {offer.image_url ? (
                  <div className="w-full md:w-48 aspect-video md:aspect-[4/5] rounded-[1.5rem] overflow-hidden bg-black/40 border border-white/10 shrink-0">
                    <img src={offer.image_url} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-full md:w-48 aspect-video md:aspect-[4/5] rounded-[1.5rem] bg-white/5 flex items-center justify-center shrink-0 border border-dashed border-white/10">
                    <ImageIcon className="text-white/10 w-8 h-8" />
                  </div>
                )}
                
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${offer.isActive ? "bg-primary text-black" : "bg-white/10 text-white/40"}`}>
                          {offer.isActive ? "Live" : "Inactive"}
                        </span>
                        <span className="text-[10px] text-white/20 font-medium">Created {new Date(offer.created_at || "").toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-2xl font-heading">{offer.title}</h3>
                      <p className="text-white/40 text-sm mt-1">{offer.subtitle}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" size="icon" className="rounded-xl border-white/10 hover:border-primary/50 text-white/50 hover:text-primary transition-all"
                        onClick={() => toggleOfferStatus(offer.$id, offer.isActive)}
                      >
                        {offer.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button 
                        variant="outline" size="icon" className="rounded-xl border-white/10 hover:border-destructive/50 text-white/50 hover:text-destructive transition-all"
                        onClick={() => handleDelete(offer.$id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary/60"><Zap className="w-4 h-4" /></div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-white/20">Button</p>
                        <p className="text-xs font-bold text-white/80">{offer.button_text}</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary/60"><LinkIcon className="w-4 h-4" /></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-white/20">Target Link</p>
                        <p className="text-xs font-bold text-white/80 truncate">{offer.link || "None"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Campaign Loader Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-2xl font-heading">New Offer Campaign</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-white transition-colors"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Media */}
                  <div className="space-y-4">
                    <div className="aspect-[4/5] bg-white/5 rounded-2xl border-2 border-dashed border-white/10 relative overflow-hidden flex items-center justify-center group">
                      {form.image_url ? (
                        <>
                          <img src={form.image_url} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button type="button" variant="outline" className="text-white border-white/20" onClick={() => document.getElementById('offer-img')?.click()}>Replace Offer Image</Button>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-6 transition-all group-hover:scale-105">
                           <ImageIcon className="w-10 h-10 text-white/10 mx-auto mb-3" />
                           <p className="text-xs text-white/40 font-bold uppercase">Add Campaign Media</p>
                           <Button type="button" variant="ghost" className="mt-4 text-primary" onClick={() => document.getElementById('offer-img')?.click()}>
                             {uploading ? <Loader2 className="animate-spin" /> : "Upload Artwork"}
                           </Button>
                        </div>
                      )}
                      <input id="offer-img" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </div>
                  </div>

                  {/* Right Column: Content */}
                  <div className="space-y-5">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Main Title</label>
                       <Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="E.g. Lunar Sale Is Live" className="bg-white/5 border-white/10 h-12" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Subtitle</label>
                       <Input value={form.subtitle} onChange={e => setForm({...form, subtitle: e.target.value})} placeholder="Up to 40% off on all bridal wear" className="bg-white/5 border-white/10 h-12" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Button Label</label>
                       <Input value={form.button_text} onChange={e => setForm({...form, button_text: e.target.value})} className="bg-white/5 border-white/10 h-12" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Redirect URL (Optional)</label>
                       <Input value={form.link} onChange={e => setForm({...form, link: e.target.value})} placeholder="/collections" className="bg-white/5 border-white/10 h-12" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${form.isActive ? "bg-primary" : "bg-white/10"}`} onClick={() => setForm({...form, isActive: !form.isActive})}>
                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${form.isActive ? "right-1" : "left-1"}`} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-white/60">Live upon publishing</span>
                   </div>
                   <Button type="submit" disabled={isSaving || uploading} className="px-10 h-14 rounded-xl text-lg font-bold">
                    {isSaving ? "Publishing campaign..." : "Publish Campaign"}
                   </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
