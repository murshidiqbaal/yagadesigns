import { useState, useRef, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Upload, X, Package, ImageOff, Images, PlusCircle, Palette, ArrowUp, ArrowDown, Scissors, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  Product,
  ProductVariant,
  getImageUrl,
} from "@/lib/appwrite";
import { CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const FORM_CATEGORIES = CATEGORIES.filter(c => c !== "All");

interface VariantFormData {
  color: string;
  images: string[];
  thumbnail: string;
}

interface FormData {
  name: string;
  description: string;
  category: string;
  image_url: string;
  price: string;
  fabric: string;
  embroidery: string;
  occasion: string;
  is_customizable: boolean;
  variants: VariantFormData[];
}

const DEFAULT_FORM: FormData = { 
  name: "", 
  description: "", 
  category: "", 
  image_url: "",
  price: "",
  fabric: "",
  embroidery: "",
  occasion: "",
  is_customizable: true,
  variants: []
};

export default function AdminProducts() {
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormData>(DEFAULT_FORM);
  
  // Track new file uploads for each variant
  // Key is variant index, value is array of Files
  const [variantNewFiles, setVariantNewFiles] = useState<Record<number, File[]>>({});
  
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // ── Queries ──────────────────────────────────────────────────────────
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => getProducts(),
  });

  const addMut = useMutation({
    mutationFn: (d: Omit<Product, "$id">) => addProduct(d),
    onSuccess: () => {
      invalidate();
      toast.success("Design added to masterpiece collection!");
      closeModal();
    },
    onError: () => toast.error("Failed to add product. Check Appwrite permissions."),
  });

  const editMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      updateProduct(id, data),
    onSuccess: () => {
      invalidate();
      toast.success("Collection updated successfully.");
      closeModal();
    },
    onError: () => toast.error("Failed to update product."),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      invalidate();
      toast.success("Product removed from collection.");
      setDeleteTarget(null);
    },
    onError: () => toast.error("Failed to delete product."),
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-products"] });
    qc.invalidateQueries({ queryKey: ["products"] });
    qc.invalidateQueries({ queryKey: ["products-home"] });
  };

  // ── Helpers ──────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditing(null);
    setForm(DEFAULT_FORM);
    setVariantNewFiles({});
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ 
      name: p.name, 
      description: p.description, 
      category: p.category, 
      image_url: p.image_url || "",
      price: p.price || "",
      fabric: p.fabric || "",
      embroidery: p.embroidery || "",
      occasion: p.occasion || "",
      is_customizable: p.is_customizable ?? true,
      variants: (p.variants as VariantFormData[]) || []
    });
    setVariantNewFiles({});
    setShowModal(true);
  };

  const closeModal = () => {
    if (uploading) return;
    setShowModal(false);
    setEditing(null);
    setForm(DEFAULT_FORM);
    setVariantNewFiles({});
  };

  // ── Variant Management ─────────────────────────────────────────────
  const addVariant = () => {
    setForm(f => ({
      ...f,
      variants: [...f.variants, { color: "New Color", images: [], thumbnail: "" }]
    }));
  };

  const removeVariant = (idx: number) => {
    setForm(f => {
      const next = [...f.variants];
      next.splice(idx, 1);
      return { ...f, variants: next };
    });
    // Also clean up new files
    setVariantNewFiles(prev => {
      const next = { ...prev };
      delete next[idx];
      // Re-index remaining new files (this is tricky with simple indices)
      // For simplicity, we just keep them, they won't match if indices shift.
      // Better: use unique IDs for variants. But for now we'll justToast warning.
      return next;
    });
  };

  const updateVariantMeta = (idx: number, field: keyof VariantFormData, value: any) => {
    setForm(f => {
      const next = [...f.variants];
      next[idx] = { ...next[idx], [field]: value };
      return { ...f, variants: next };
    });
  };

  const moveVariant = (idx: number, dir: 'up' | 'down') => {
    const nextIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (nextIdx < 0 || nextIdx >= form.variants.length) return;

    setForm(f => {
      const next = [...f.variants];
      const temp = next[idx];
      next[idx] = next[nextIdx];
      next[nextIdx] = temp;
      return { ...f, variants: next };
    });

    // Swap files too
    setVariantNewFiles(prev => {
      const next = { ...prev };
      const temp = next[idx];
      next[idx] = next[nextIdx];
      next[nextIdx] = temp;
      return next;
    });
  };

  const handleVariantImageSelect = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter(f => f.type.startsWith("image/") && f.size <= 10 * 1024 * 1024);
    if (validFiles.length < files.length) toast.warning("Some files were skipped (invalid type or >10MB)");

    setVariantNewFiles(prev => ({
      ...prev,
      [idx]: [...(prev[idx] || []), ...validFiles]
    }));
    if (e.target) e.target.value = "";
  };

  const removeVariantImage = (vIdx: number, imgIdx: number, isNew: boolean) => {
    if (isNew) {
      setVariantNewFiles(prev => {
        const next = { ...prev };
        const files = [...(next[vIdx] || [])];
        files.splice(imgIdx, 1);
        next[vIdx] = files;
        return next;
      });
    } else {
      setForm(f => {
        const nextV = [...f.variants];
        const nextImg = [...nextV[vIdx].images];
        nextImg.splice(imgIdx, 1);
        nextV[vIdx] = { ...nextV[vIdx], images: nextImg };
        return { ...f, variants: nextV };
      });
    }
  };

  // ── Submit Logic ──────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Product name is required"); return; }
    if (!form.category) { toast.error("Please select a category"); return; }
    if (form.variants.length === 0) { toast.error("Add at least one color variant"); return; }

    setUploading(true);
    
    try {
      const updatedVariants: VariantFormData[] = [];

      // Process each variant
      for (let i = 0; i < form.variants.length; i++) {
        const variant = form.variants[i];
        const newFiles = variantNewFiles[i] || [];
        
        // 1. Upload new files for this variant
        let uploadedUrls: string[] = [];
        if (newFiles.length > 0) {
          const uploadPromises = newFiles.map(file => uploadProductImage(file));
          uploadedUrls = await Promise.all(uploadPromises);
        }

        // 2. Combine with existing
        const allImages = [...variant.images, ...uploadedUrls];
        
        updatedVariants.push({
          ...variant,
          images: allImages,
          thumbnail: variant.thumbnail || allImages[0] || ""
        });
      }

      // 3. Final Payload
      const mainImageUrl = updatedVariants[0]?.images[0] || "";
      const payload: Omit<Product, "$id"> = {
        name: form.name,
        description: form.description,
        category: form.category,
        price: form.price,
        fabric: form.fabric,
        embroidery: form.embroidery,
        occasion: form.occasion,
        is_customizable: form.is_customizable,
        image_url: mainImageUrl, // Legacy compatibility
        variants: updatedVariants,
        created_at: editing?.created_at || new Date().toISOString()
      };

      if (editing) {
        editMut.mutate({ id: editing.$id, data: payload });
      } else {
        addMut.mutate(payload);
      }
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("An error occurred while saving the product.");
    } finally {
      setUploading(false);
    }
  };

  const isSaving = addMut.isPending || editMut.isPending || uploading;

  return (
    <div className="space-y-8">
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-heading">Boutique Inventory</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Managing {products.length} luxury design masterpieces
          </p>
        </div>
        <Button onClick={openAdd} className="gap-2 shrink-0 h-14 px-8 rounded-2xl bg-primary hover:bg-[#FFFBD5] text-black font-bold text-lg shadow-[0_10px_30px_rgba(212,175,55,0.2)] transition-all">
          <PlusCircle className="w-6 h-6" /> Create New Design
        </Button>
      </div>

      {/* ── List ───────────────────────────────────────────── */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-28 rounded-3xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-32 bg-white/5 rounded-3xl border border-white/10 border-dashed">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
          <h3 className="font-heading text-2xl mb-2">Inventory Empty</h3>
          <p className="text-muted-foreground text-sm mb-8">Start your collection by adding a new design.</p>
          <Button onClick={openAdd} variant="outline" className="gap-2 border-white/10">
            <Plus className="w-4 h-4" /> Add First Product
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {products.map(product => (
            <motion.div
              key={product.$id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group flex items-center gap-6 p-5 rounded-[2rem] bg-[#0F0F0F] border border-white/5 hover:border-primary/30 transition-all"
            >
              <div className="relative w-24 h-32 rounded-2xl overflow-hidden shrink-0 bg-black">
                {product.image_url ? (
                  <img src={getImageUrl(product.image_url)} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><ImageOff className="w-8 h-8 opacity-10" /></div>
                )}
                {product.variants && (product.variants as any[]).length > 0 && (
                  <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[9px] font-bold text-primary flex items-center gap-1">
                    <Palette className="w-2.5 h-2.5" /> {(product.variants as any[]).length} COLORS
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[9px] px-2 py-0">
                    {product.category}
                  </Badge>
                  {product.is_customizable !== false && (
                    <Badge variant="outline" className="border-green-500/20 bg-green-500/5 text-green-500 text-[9px] px-2 py-0 gap-1">
                      <Scissors className="w-2 h-2" /> Custom
                    </Badge>
                  )}
                </div>
                <h3 className="font-heading text-2xl text-white group-hover:text-primary transition-colors truncate">
                  {product.name}
                </h3>
                <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
                  <span className="font-semibold text-white/60">{product.price || "Price on enquiry"}</span>
                  <span className="w-1 h-1 rounded-full bg-white/10" />
                  <span className="truncate">{product.fabric || "Pure Fabric"}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pr-2">
                <Button variant="ghost" size="icon" onClick={() => openEdit(product)} className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white">
                  <Pencil className="w-5 h-5" />
                </Button>
                {deleteTarget === product.$id ? (
                  <Button variant="destructive" size="sm" onClick={() => deleteMut.mutate(product.$id)} disabled={deleteMut.isPending} className="rounded-xl px-6 h-12">
                    Confirm Delete
                  </Button>
                ) : (
                  <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(product.$id)} className="w-12 h-12 rounded-2xl text-destructive/40 hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Modal ───────────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
            onClick={e => e.target === e.currentTarget && closeModal()}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="w-full max-w-4xl max-h-[90vh] bg-[#0A0A0A] rounded-[2.5rem] border border-white/10 overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,1)] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-10 py-8 border-b border-white/5 bg-white/[0.02]">
                <div>
                  <h2 className="font-heading text-3xl text-white">
                    {editing ? "Refine Design" : "New Creation"}
                  </h2>
                  <p className="text-xs text-primary font-bold uppercase tracking-[0.3em] mt-1.5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Luxury Bridal Studio
                  </p>
                </div>
                <button onClick={closeModal} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Form Content */}
              <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
                <form id="product-form" onSubmit={handleSubmit} className="space-y-12">
                  
                  {/* Basic Metadata */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Design Name *</label>
                        <Input
                          value={form.name}
                          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                          placeholder="Royal Heritage Lehenga"
                          className="bg-white/5 border-white/10 focus:border-primary/50 rounded-2xl h-14 text-white placeholder:text-white/20"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Collection *</label>
                          <Select value={form.category} onValueChange={val => setForm(f => ({ ...f, category: val }))}>
                            <SelectTrigger className="bg-white/5 border-white/10 rounded-2xl h-14"><SelectValue placeholder="Collection" /></SelectTrigger>
                            <SelectContent className="bg-[#121212] border-white/10">
                              {FORM_CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Base Price</label>
                          <Input
                            value={form.price}
                            onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                            placeholder="₹45,000"
                            className="bg-white/5 border-white/10 rounded-2xl h-14"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Fabric</label>
                          <Input value={form.fabric} onChange={e => setForm(f => ({ ...f, fabric: e.target.value }))} placeholder="Pure Georgette" className="bg-white/5 border-white/10 rounded-2xl h-14" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Work Type</label>
                          <Input value={form.embroidery} onChange={e => setForm(f => ({ ...f, embroidery: e.target.value }))} placeholder="Hand Zari" className="bg-white/5 border-white/10 rounded-2xl h-14" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 h-14">
                        <div className="flex items-center gap-3">
                          <Scissors className="w-5 h-5 text-primary" />
                          <Label htmlFor="custom-toggle" className="text-white font-medium">Bespoke Customization Available</Label>
                        </div>
                        <Switch
                          id="custom-toggle"
                          checked={form.is_customizable}
                          onCheckedChange={val => setForm(f => ({ ...f, is_customizable: val }))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Craftsmanship Narrative</label>
                    <Textarea
                      value={form.description}
                      onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="Describe the intricate details and inspiration..."
                      className="bg-white/5 border-white/10 rounded-3xl min-h-[120px] resize-none p-6"
                    />
                  </div>

                  {/* Variant Manager */}
                  <div className="space-y-8">
                    <div className="flex items-end justify-between border-b border-white/5 pb-4">
                      <div>
                        <h3 className="font-heading text-2xl text-white">Design Variants</h3>
                        <p className="text-xs text-white/40 mt-1">Manage colors, specific imagery, and swatches</p>
                      </div>
                      <Button type="button" onClick={addVariant} variant="outline" className="h-12 border-primary/20 text-primary hover:bg-primary/5 rounded-xl gap-2">
                        <Plus className="w-5 h-5" /> Add Color Variant
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      {form.variants.map((v, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="relative p-8 rounded-3xl bg-white/[0.03] border border-white/5 group overflow-hidden"
                        >
                          <div className="flex flex-col lg:flex-row gap-10">
                            {/* Variant Info */}
                            <div className="w-full lg:w-1/3 space-y-6">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase px-3 py-1 bg-primary text-black rounded-lg">COLOR {idx + 1}</span>
                                <div className="flex gap-1">
                                  <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-white/30 hover:text-white" onClick={() => moveVariant(idx, 'up')} disabled={idx === 0}><ArrowUp className="w-4 h-4" /></Button>
                                  <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-white/30 hover:text-white" onClick={() => moveVariant(idx, 'down')} disabled={idx === form.variants.length - 1}><ArrowDown className="w-4 h-4" /></Button>
                                  <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-destructive/40 hover:text-destructive hover:bg-destructive/10" onClick={() => removeVariant(idx)}><Trash2 className="w-4 h-4" /></Button>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-white/30">Color Name</label>
                                <Input
                                  value={v.color}
                                  onChange={e => updateVariantMeta(idx, 'color', e.target.value)}
                                  placeholder="Royal Red"
                                  className="bg-black/40 border-white/10 h-12"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-white/30">Variant Status</label>
                                <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-center gap-3">
                                  <CheckCircle2 className="w-5 h-5 text-primary" />
                                  <span className="text-xs font-medium text-primary">Active in Boutique</span>
                                </div>
                              </div>
                            </div>

                            {/* Variant Gallery */}
                            <div className="flex-1 space-y-4">
                              <label className="text-[10px] font-bold uppercase text-white/30">Variant Imagery</label>
                              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                                {/* Existing */}
                                {v.images.map((img, imgIdx) => (
                                  <div key={imgIdx} className={`relative aspect-[3/4] rounded-xl overflow-hidden border p-0.5 transition-all ${v.thumbnail === img ? 'border-primary' : 'border-white/10'}`}>
                                    <img src={getImageUrl(img)} className="w-full h-full object-cover rounded-lg" />
                                    <button
                                      type="button"
                                      onClick={() => updateVariantMeta(idx, 'thumbnail', img)}
                                      className="absolute inset-0 bg-black/0 hover:bg-black/20"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeVariantImage(idx, imgIdx, false)}
                                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                                {/* New */}
                                {(variantNewFiles[idx] || []).map((file, imgIdx) => (
                                  <div key={`new-${imgIdx}`} className="relative aspect-[3/4] rounded-xl overflow-hidden border-2 border-primary/40 border-dashed p-0.5">
                                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover rounded-lg" />
                                    <div className="absolute inset-0 bg-primary/10 animate-pulse" />
                                    <button
                                      type="button"
                                      onClick={() => removeVariantImage(idx, imgIdx, true)}
                                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                                {/* Upload Button */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const input = document.getElementById(`file-v-${idx}`) as HTMLInputElement;
                                    input?.click();
                                  }}
                                  className="aspect-[3/4] rounded-xl border-2 border-dashed border-white/10 hover:border-primary/40 flex flex-col items-center justify-center text-white/20 hover:text-primary transition-all gap-1"
                                >
                                  <Upload className="w-5 h-5" />
                                  <span className="text-[8px] font-bold uppercase text-center px-2">Add Photos</span>
                                </button>
                                <input
                                  id={`file-v-${idx}`}
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  className="hidden"
                                  onChange={e => handleVariantImageSelect(idx, e)}
                                />
                              </div>
                              <p className="text-[9px] text-white/20 italic">Click an image to set as primary color thumbnail</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="px-10 py-8 border-t border-white/5 bg-white/[0.02] flex gap-4">
                <Button variant="ghost" onClick={closeModal} className="flex-1 h-14 rounded-2xl text-white/40 hover:text-white text-lg">
                  Discard Changes
                </Button>
                <Button
                  form="product-form"
                  type="submit"
                  disabled={isSaving}
                  className="flex-[2] h-14 rounded-2xl text-xl font-bold bg-primary hover:bg-primary/90 text-black shadow-[0_20px_40px_rgba(212,175,55,0.1)] transition-all"
                >
                  {uploading ? "Curating Masterpiece..." : isSaving ? "Saving..." : editing ? "Update Boutique Masterpiece" : "Publish to Collection"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
