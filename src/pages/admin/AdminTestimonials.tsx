import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial, Testimonial, uploadProductImage, getImageUrl } from "@/lib/appwrite";
import { Edit2, MessageSquareQuote, Plus, Trash2, Star, User, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ImagePlus, Upload } from "lucide-react";

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    content: "",
    rating: 5,
    avatar_url: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  async function fetchTestimonials() {
    setLoading(true);
    const data = await getTestimonials();
    setTestimonials(data);
    setLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.content) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSaving(true);
    try {
      let avatarUrl = form.avatar_url;
      
      if (selectedFile) {
        avatarUrl = await uploadProductImage(selectedFile);
      }

      if (editingId) {
        await updateTestimonial(editingId, {
          ...form,
          avatar_url: avatarUrl
        });
        toast.success("Testimonial updated!");
      } else {
        await createTestimonial({
          ...form,
          avatar_url: avatarUrl
        });
        toast.success("Testimonial added!");
      }
      
      handleCloseModal();
      fetchTestimonials();
    } catch (error) {
      toast.error("Failed to save testimonial.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (t: Testimonial) => {
    setForm({
      name: t.name,
      content: t.content,
      rating: t.rating,
      avatar_url: t.avatar_url || "",
    });
    setEditingId(t.$id);
    setPreviewUrl(t.avatar_url ? getImageUrl(t.avatar_url) : null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm({ name: "", content: "", rating: 5, avatar_url: "" });
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this review?")) return;
    try {
      await deleteTestimonial(id);
      toast.success("Review removed.");
      fetchTestimonials();
    } catch (error) {
      toast.error("Failed to delete.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading mb-1 flex items-center gap-3">
            <MessageSquareQuote className="text-primary w-8 h-8" /> Client Testimonials
          </h1>
          <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">
            Manage your boutique's reputation
          </p>
        </div>
        <Button onClick={() => { setEditingId(null); setIsModalOpen(true); }} className="gap-2 h-12 px-6 rounded-xl">
          <Plus className="w-4 h-4" /> Add Review
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Gathering words of praise...</p>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-20 bg-white/[0.02] border border-dashed border-white/5 rounded-[2rem]">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquareQuote className="w-8 h-8 text-white/10" />
          </div>
          <h3 className="text-xl font-heading text-white">No testimonials yet</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">Share the love from your clients by adding your first review manually.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <motion.div
              key={t.$id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 group relative"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 overflow-hidden">
                    {t.avatar_url ? <img src={getImageUrl(t.avatar_url)} className="w-full h-full object-cover" /> : <User className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-heading text-lg">{t.name}</h4>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < t.rating ? "fill-primary text-primary" : "text-white/10"}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="opacity-0 group-hover:opacity-100 hover:bg-white/5 transition-all"
                    onClick={() => handleEdit(t)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
                    onClick={() => handleDelete(t.$id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed italic">"{t.content}"</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-2xl font-heading">{editingId ? "Edit Testimonial" : "New Testimonial"}</h3>
                <button onClick={handleCloseModal} className="text-muted-foreground hover:text-white transition-colors"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                      {previewUrl ? (
                        <img src={previewUrl} className="w-full h-full object-cover" />
                      ) : (
                        <ImagePlus className="w-8 h-8 text-white/20" />
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Client Photo</label>
                      <label className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors w-max">
                        <Upload className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium">Select Image</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mr-1">Client Name</label>
                  <Input 
                    value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    placeholder="E.g. Sophia Loren"
                    className="h-12 bg-white/5 border-white/10 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button 
                        key={star} type="button" onClick={() => setForm({...form, rating: star})}
                        className={`p-2 rounded-lg transition-all ${form.rating >= star ? "bg-primary/20 text-primary" : "bg-white/5 text-white/20"}`}
                      >
                        <Star className={`w-5 h-5 ${form.rating >= star ? "fill-primary" : ""}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">The Review</label>
                  <Textarea 
                    value={form.content} onChange={e => setForm({...form, content: e.target.value})}
                    placeholder="Describe their experience..."
                    className="min-h-[120px] bg-white/5 border-white/10 rounded-xl resize-none"
                  />
                </div>
                <Button type="submit" disabled={isSaving} className="w-full h-14 text-lg font-bold">
                  {isSaving ? "Saving..." : editingId ? "Update Testimonial" : "Publish Testimonial"}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
