import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Upload, X, Package, ImageOff, Images, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  Product,
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

const FORM_CATEGORIES = CATEGORIES.filter(c => c !== "All");

interface FormData {
  name: string;
  description: string;
  category: string;
  image_url: string;
  image_urls: string[];
  price: string;
  colors: string; // We'll store as CSV for the form but array for DB
  fabric: string;
  embroidery: string;
  occasion: string;
}

const DEFAULT_FORM: FormData = { 
  name: "", 
  description: "", 
  category: "", 
  image_url: "",
  image_urls: [],
  price: "",
  colors: "",
  fabric: "",
  embroidery: "",
  occasion: ""
};

export default function AdminProducts() {
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormData>(DEFAULT_FORM);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Queries ──────────────────────────────────────────────────────────
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => getProducts(),
  });

  const addMut = useMutation({
    mutationFn: (d: Omit<Product, "$id">) => addProduct(d),
    onSuccess: () => {
      invalidate();
      toast.success("Product added successfully!");
      closeModal();
    },
    onError: () => toast.error("Failed to add product. Check Appwrite permissions."),
  });

  const editMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      updateProduct(id, data),
    onSuccess: () => {
      invalidate();
      toast.success("Product updated!");
      closeModal();
    },
    onError: () => toast.error("Failed to update product."),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      invalidate();
      toast.success("Product deleted.");
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
    setNewImageFiles([]);
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ 
      name: p.name, 
      description: p.description, 
      category: p.category, 
      image_url: p.image_url || "",
      image_urls: p.image_urls || [],
      price: p.price || "",
      colors: p.colors?.join(", ") || "",
      fabric: p.fabric || "",
      embroidery: p.embroidery || "",
      occasion: p.occasion || ""
    });
    setNewImageFiles([]);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setForm(DEFAULT_FORM);
    setNewImageFiles([]);
  };

  const onImagesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    // Simple validation
    const validFiles = files.filter(f => {
      if (!f.type.startsWith("image/")) {
        toast.error(`${f.name} is not a valid image file.`);
        return false;
      }
      if (f.size > 10 * 1024 * 1024) {
        toast.error(`${f.name} is too large (>10MB).`);
        return false;
      }
      return true;
    });

    setNewImageFiles(prev => [...prev, ...validFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeExistingImage = (idx: number) => {
    setForm(f => {
      const newUrls = [...f.image_urls];
      newUrls.splice(idx, 1);
      return { ...f, image_urls: newUrls };
    });
  };

  const removeNewImage = (idx: number) => {
    setNewImageFiles(prev => {
      const next = [...prev];
      next.splice(idx, 1);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Product name is required"); return; }
    if (!form.category) { toast.error("Please select a category"); return; }

    setUploading(true);
    let allImageUrls = [...form.image_urls];

    try {
      // 1. Upload new images
      if (newImageFiles.length > 0) {
        const uploadPromises = newImageFiles.map(file => uploadProductImage(file));
        const uploadedUrls = await Promise.all(uploadPromises);
        allImageUrls = [...allImageUrls, ...uploadedUrls];
      }

      // 2. Set main image if not set
      const mainImageUrl = allImageUrls[0] || "";

      // 3. Prepare payload
      const payload: Omit<Product, "$id"> = {
        name: form.name,
        description: form.description,
        category: form.category,
        price: form.price,
        fabric: form.fabric,
        embroidery: form.embroidery,
        occasion: form.occasion,
        image_url: mainImageUrl, // Legacy compatibility
        image_urls: allImageUrls,
        colors: form.colors.split(",").map(c => c.trim()).filter(Boolean),
        created_at: editing?.created_at || new Date().toISOString()
      };

      console.log("Submitting Product Payload:", payload);
      if (editing) {
        editMut.mutate({ id: editing.$id, data: payload });
      } else {
        addMut.mutate(payload);
      }
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Failed to save product. Image upload might have failed.");
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
          <h1 className="text-4xl font-heading">Products</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {products.length} design{products.length !== 1 ? "s" : ""} in your collection
          </p>
        </div>
        <Button id="add-product-btn" onClick={openAdd} className="gap-2 shrink-0 h-12 px-6 rounded-2xl bg-primary hover:bg-[#FFFBD5] text-black transition-all">
          <PlusCircle className="w-5 h-5" /> Add New Design
        </Button>
      </div>

      {/* ── Product List ─────────────────────────────────────── */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-32 bg-white/5 rounded-3xl border border-white/10 border-dashed">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
          <h3 className="font-heading text-2xl mb-2">Empty Gallery</h3>
          <p className="text-muted-foreground text-sm mb-8">
            Start adding your premium bridal collection designs.
          </p>
          <Button onClick={openAdd} variant="outline" className="gap-2 border-white/10 text-white hover:bg-white/5">
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
              className="group flex items-center gap-5 p-4 rounded-2xl bg-[#121212] border border-white/5 hover:border-primary/20 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all"
            >
              {/* Thumbnail Container */}
              <div className="relative w-20 h-24 rounded-xl overflow-hidden shrink-0 bg-[#1A1A1A]">
                {product.image_url ? (
                  <img
                    src={getImageUrl(product.image_url)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageOff className="w-6 h-6 text-white/10" />
                  </div>
                )}
                {product.image_urls && product.image_urls.length > 1 && (
                  <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[8px] font-bold text-white flex items-center gap-1">
                    <Images className="w-2 h-2" /> {product.image_urls.length}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {product.category}
                  </span>
                  {product.price && (
                    <span className="text-[10px] font-semibold text-white/40">
                      • {product.price}
                    </span>
                  )}
                </div>
                <h3 className="font-heading text-xl text-white group-hover:text-primary transition-colors truncate">
                  {product.name}
                </h3>
                <div className="flex items-center gap-4 mt-2 text-xs text-white/30 truncate">
                  <span>{product.fabric || "No fabric"}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="truncate">{product.description || "No description"}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pr-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEdit(product)}
                  className="w-10 h-10 rounded-xl hover:bg-white/10 text-white/70 hover:text-white"
                >
                  <Pencil className="w-4 h-4" />
                </Button>

                {deleteTarget === product.$id ? (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMut.mutate(product.$id)}
                      className="rounded-xl px-4"
                      disabled={deleteMut.isPending}
                    >
                      Delete
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(null)} className="rounded-xl">
                      X
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteTarget(product.$id)}
                    className="w-10 h-10 rounded-xl text-destructive/40 hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Manage Modal ──────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={e => e.target === e.currentTarget && closeModal()}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-[#0D0D0D] rounded-3xl border border-white/10 overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,1)]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
                <div>
                  <h2 className="font-heading text-2xl text-white">
                    {editing ? "Refine Product" : "New Creation"}
                  </h2>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Design Studio Collection</p>
                </div>
                <button
                  onClick={closeModal}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content Scroll Area */}
              <div className="max-h-[70vh] overflow-y-auto p-8 custom-scrollbar">
                <form id="product-form" onSubmit={handleSubmit} className="space-y-10">
                  
                  {/* Gallery Management Section */}
                  <div className="space-y-4">
                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/70">Gallery Images</label>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                      {/* Existing Image URLs */}
                      {form.image_urls.map((url, idx) => (
                        <div key={`exist-${idx}`} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                          <img src={getImageUrl(url)} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(idx)}
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      
                      {/* New Image Previews */}
                      {newImageFiles.map((file, idx) => (
                        <div key={`new-${idx}`} className="relative aspect-square rounded-xl overflow-hidden border-2 border-primary/40 group">
                          <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-primary/20 animate-pulse" />
                          <button
                            type="button"
                            onClick={() => removeNewImage(idx)}
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}

                      {/* Add Image Button */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-xl border-2 border-dashed border-white/10 hover:border-primary/40 flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-all gap-1"
                      >
                        <Plus className="w-5 h-5" />
                        <span className="text-[8px] font-bold uppercase">Add Photo</span>
                      </button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={onImagesSelect}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Basic Info */}
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">Design Name *</label>
                        <Input
                          value={form.name}
                          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                          placeholder="e.g. Royal Gold Lehenga"
                          className="bg-white/5 border-white/10 focus:border-primary/50 rounded-2xl h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">Category *</label>
                        <Select
                          value={form.category}
                          onValueChange={val => setForm(f => ({ ...f, category: val }))}
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 focus:border-primary/50 rounded-2xl h-12">
                            <SelectValue placeholder="Select collection" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#121212] border-white/10">
                            {FORM_CATEGORIES.map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">Price Range</label>
                        <Input
                          value={form.price}
                          onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                          placeholder="e.g. ₹45,000 – ₹80,000"
                          className="bg-white/5 border-white/10 focus:border-primary/50 rounded-2xl h-12"
                        />
                      </div>
                    </div>

                    {/* Specifications */}
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">Fabric Type</label>
                        <Input
                          value={form.fabric}
                          onChange={e => setForm(f => ({ ...f, fabric: e.target.value }))}
                          placeholder="e.g. Pure Georgette"
                          className="bg-white/5 border-white/10 focus:border-primary/50 rounded-2xl h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">Embroidery Style</label>
                        <Input
                          value={form.embroidery}
                          onChange={e => setForm(f => ({ ...f, embroidery: e.target.value }))}
                          placeholder="e.g. Zardosi & Stone Work"
                          className="bg-white/5 border-white/10 focus:border-primary/50 rounded-2xl h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">Occasion</label>
                        <Input
                          value={form.occasion}
                          onChange={e => setForm(f => ({ ...f, occasion: e.target.value }))}
                          placeholder="e.g. Wedding Ceremony"
                          className="bg-white/5 border-white/10 focus:border-primary/50 rounded-2xl h-12"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Colors & Description */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">Color Customizations (Comma separated)</label>
                      <Input
                        value={form.colors}
                        onChange={e => setForm(f => ({ ...f, colors: e.target.value }))}
                        placeholder="e.g. Royal Red, Champagne Gold, Ivory"
                        className="bg-white/5 border-white/10 focus:border-primary/50 rounded-2xl h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">Design Description</label>
                      <Textarea
                        value={form.description}
                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                        placeholder="Describe the craftsmanship and inspiration behind this design..."
                        className="bg-white/5 border-white/10 focus:border-primary/50 rounded-2xl min-h-[120px] resize-none"
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* Modal Footer Actions */}
              <div className="px-8 py-6 border-t border-white/5 flex gap-4 bg-white/2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={closeModal}
                  className="flex-1 h-14 rounded-2xl text-white/40 hover:text-white"
                >
                  Discard
                </Button>
                <Button
                  form="product-form"
                  type="submit"
                  disabled={isSaving}
                  className="flex-[2] h-14 rounded-2xl text-lg font-bold"
                >
                  {uploading
                    ? `Uploading ${newImageFiles.length} images…`
                    : isSaving
                    ? "Saving Masterpiece…"
                    : editing
                    ? "Update Collection"
                    : "Add to Boutique"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
