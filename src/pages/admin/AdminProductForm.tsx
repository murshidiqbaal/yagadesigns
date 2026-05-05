import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Product,
  addProduct,
  getImageUrl,
  getProducts,
  updateProduct,
  uploadProductImage
} from "@/lib/appwrite";
import { CATEGORIES } from "@/lib/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2, ChevronLeft,
  Loader2,
  Plus,
  Save,
  Scissors,
  Trash2, Upload, X
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const BASE_FORM_CATEGORIES = CATEGORIES.filter((c) => c !== "All");
const CUSTOM_CAT_KEY = "__custom__";

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
interface Reel {
  link: string;
  thumbnail: string;
}

export default function AdminProductForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditing = !!id;
  const qc = useQueryClient();

  // Load existing product list to find the one being edited
  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => getProducts(),
    enabled: isEditing,
  });

  const existingProduct = isEditing ? products.find((p) => p.$id === id) ?? null : null;

  // ── Form State ─────────────────────────────────────────────────────
  const [form, setForm] = useState<FormData>(() => {
    if (existingProduct) {
      return {
        name: existingProduct.name,
        description: existingProduct.description,
        category: existingProduct.category,
        image_url: existingProduct.image_url || "",
        price: existingProduct.price || "",
        fabric: existingProduct.fabric || "",
        embroidery: existingProduct.embroidery || "",
        occasion: existingProduct.occasion || "",
        is_customizable: existingProduct.is_customizable ?? true,
        instagram_reel_link: existingProduct.instagram_reel_link || "",
        reel_thumbnail: existingProduct.reel_thumbnail || "",
        variants: (existingProduct.variants as VariantFormData[]) || [],
      };
    }
    return DEFAULT_FORM;
  });

  // Sync form when product loads from query (edit mode)
  const [formSynced, setFormSynced] = useState(false);
  if (isEditing && existingProduct && !formSynced) {
    setFormSynced(true);
    setForm({
      name: existingProduct.name,
      description: existingProduct.description,
      category: existingProduct.category,
      image_url: existingProduct.image_url || "",
      price: existingProduct.price || "",
      fabric: existingProduct.fabric || "",
      embroidery: existingProduct.embroidery || "",
      occasion: existingProduct.occasion || "",
      is_customizable: existingProduct.is_customizable ?? true,
      instagram_reel_link: existingProduct.instagram_reel_link || "",
      reel_thumbnail: existingProduct.reel_thumbnail || "",
      variants: (existingProduct.variants as VariantFormData[]) || [],
    });
  }

  const [variantNewFiles, setVariantNewFiles] = useState<Record<number, File[]>>({});
  const [uploading, setUploading] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState<number | null>(null);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [showCustomCatInput, setShowCustomCatInput] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  const allFormCategories = [...BASE_FORM_CATEGORIES, ...customCategories];

  const handleCategoryChange = (val: string) => {
    if (val === CUSTOM_CAT_KEY) {
      setShowCustomCatInput(true);
    } else {
      setShowCustomCatInput(false);
      setForm((f) => ({ ...f, category: val }));
    }
  };

  const confirmCustomCategory = () => {
    const trimmed = newCatName.trim();
    if (!trimmed) return;
    if (!customCategories.includes(trimmed)) {
      setCustomCategories((prev) => [...prev, trimmed]);
    }
    setForm((f) => ({ ...f, category: trimmed }));
    setShowCustomCatInput(false);
    setNewCatName("");
  };

  // ── Mutations ──────────────────────────────────────────────────────
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-products"] });
    qc.invalidateQueries({ queryKey: ["products"] });
    qc.invalidateQueries({ queryKey: ["products-home"] });
  };

  const addMut = useMutation({
    mutationFn: (d: Omit<Product, "$id">) => addProduct(d),
    onSuccess: () => {
      invalidate();
      toast.success("Design added to masterpiece collection!");
      navigate("/admin/products");
    },
    onError: () => toast.error("Failed to add product. Check Appwrite permissions."),
  });

  const editMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      updateProduct(id, data),
    onSuccess: () => {
      invalidate();
      toast.success("Collection updated successfully.");
      navigate("/admin/products");
    },
    onError: () => toast.error("Failed to update product."),
  });

  const isSaving = addMut.isPending || editMut.isPending || uploading;

  // ── Reel Helpers ──────────────────────────────────────────────────
  const addReel = () => {
    setForm(f => ({
      ...f,
      reels: [...(Array.isArray(f.reels) ? f.reels : []), { link: "", thumbnail: "" }]
    }));
  };

  const removeReel = (index: number) => {
    setForm(f => ({
      ...f,
      reels: (Array.isArray(f.reels) ? f.reels : []).filter((_, i) => i !== index)
    }));
  };

  const updateReel = (index: number, data: Partial<Reel>) => {
    setForm(f => ({
      ...f,
      reels: (Array.isArray(f.reels) ? f.reels : []).map((r, i) => i === index ? { ...r, ...data } : r)
    }));
  };

  // ── Reel Thumbnail Upload ──────────────────────────────────────────
  const handleReelThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error("Image must be under 10MB"); return; }
    
    setUploadingThumbnail(index);
    try {
      const url = await uploadProductImage(file);
      updateReel(index, { thumbnail: url });
      toast.success("Thumbnail uploaded and optimized!");
    } catch (err) {
      toast.error("Failed to upload thumbnail");
    } finally {
      setUploadingThumbnail(null);
      if (e.target) e.target.value = "";
    }
  };

  // ── Variant Helpers ────────────────────────────────────────────────
  const addVariant = () =>
    setForm((f) => ({
      ...f,
      variants: [...f.variants, { color: "New Color", images: [], thumbnail: "" }],
    }));

  const removeVariant = (idx: number) =>
    setForm((f) => {
      const next = [...f.variants];
      next.splice(idx, 1);
      return { ...f, variants: next };
    });

  const updateVariantMeta = (idx: number, field: keyof VariantFormData, value: any) =>
    setForm((f) => {
      const next = [...f.variants];
      next[idx] = { ...next[idx], [field]: value };
      return { ...f, variants: next };
    });

  const moveVariant = (idx: number, dir: "up" | "down") => {
    const nextIdx = dir === "up" ? idx - 1 : idx + 1;
    if (nextIdx < 0 || nextIdx >= form.variants.length) return;
    setForm((f) => {
      const next = [...f.variants];
      [next[idx], next[nextIdx]] = [next[nextIdx], next[idx]];
      return { ...f, variants: next };
    });
    setVariantNewFiles((prev) => {
      const next = { ...prev };
      [next[idx], next[nextIdx]] = [next[nextIdx], next[idx]];
      return next;
    });
  };

  const handleVariantImageSelect = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const valid = files.filter((f) => f.type.startsWith("image/") && f.size <= 10 * 1024 * 1024);
    if (valid.length < files.length) toast.warning("Some files skipped (invalid type or >10MB)");
    setVariantNewFiles((prev) => ({ ...prev, [idx]: [...(prev[idx] || []), ...valid] }));
    if (e.target) e.target.value = "";
  };

  const removeVariantImage = (vIdx: number, imgIdx: number, isNew: boolean) => {
    if (isNew) {
      setVariantNewFiles((prev) => {
        const next = { ...prev };
        const files = [...(next[vIdx] || [])];
        files.splice(imgIdx, 1);
        next[vIdx] = files;
        return next;
      });
    } else {
      setForm((f) => {
        const nextV = [...f.variants];
        const nextImg = [...nextV[vIdx].images];
        nextImg.splice(imgIdx, 1);
        nextV[vIdx] = { ...nextV[vIdx], images: nextImg };
        return { ...f, variants: nextV };
      });
    }
  };

  // ── Submit ─────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Product name is required"); return; }
    if (!form.category) { toast.error("Please select a category"); return; }
    if (form.variants.length === 0) { toast.error("Add at least one color variant"); return; }
    if (form.instagram_reel_link && !form.instagram_reel_link.includes("instagram.com/reel")) {
      toast.error("Instagram Reel link must contain 'instagram.com/reel'");
      return;
    }

    setUploading(true);
    try {
      const updatedVariants: VariantFormData[] = [];
      for (let i = 0; i < form.variants.length; i++) {
        const variant = form.variants[i];
        const newFiles = variantNewFiles[i] || [];
        let uploadedUrls: string[] = [];
        if (newFiles.length > 0) {
          uploadedUrls = await Promise.all(newFiles.map((f) => uploadProductImage(f)));
        }
        const allImages = [...variant.images, ...uploadedUrls];
        updatedVariants.push({
          ...variant,
          images: allImages,
          thumbnail: variant.thumbnail || allImages[0] || "",
        });
      }

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
        image_url: mainImageUrl,
        instagram_reel_link: form.instagram_reel_link.trim() || undefined,
        reel_thumbnail: form.reel_thumbnail.trim() || undefined,
        variants: updatedVariants,
        created_at: existingProduct?.created_at || new Date().toISOString(),
      };

      if (isEditing && existingProduct) {
        editMut.mutate({ id: existingProduct.$id, data: payload });
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

  // ── Loading state (edit mode waiting for product list) ─────────────
  if (isEditing && loadingProducts) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isEditing && !existingProduct && !loadingProducts) {
    return (
      <div className="text-center py-32">
        <p className="text-white/40">Product not found.</p>
        <Button onClick={() => navigate("/admin/products")} className="mt-6">Back to Products</Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-5xl mx-auto space-y-8"
    >
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => navigate("/admin/products")}
          className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all shrink-0"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-4xl font-heading">
            {isEditing ? "Refine Design" : "New Creation"}
          </h1>
          <p className="text-xs text-primary font-bold uppercase tracking-[0.3em] mt-1.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Luxury Bridal Studio
          </p>
        </div>
      </div>

      {/* ── Form ────────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="space-y-10">

        {/* Basic Metadata */}
        <section className="p-8 rounded-[2rem] bg-[#0F0F0F] border border-white/5 space-y-8">
          <h2 className="text-xl font-heading text-white/80 border-b border-white/5 pb-4">Design Details</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Design Name *</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Royal Heritage Lehenga"
                  className="bg-white/5 border-white/10 focus:border-primary/50 rounded-2xl h-14 text-white placeholder:text-white/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Collection *</label>
                  <Select
                    value={showCustomCatInput ? CUSTOM_CAT_KEY : form.category}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 rounded-2xl h-14"><SelectValue placeholder="Collection" /></SelectTrigger>
                    <SelectContent className="bg-[#121212] border-white/10">
                      {allFormCategories.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                      <SelectItem value={CUSTOM_CAT_KEY} className="text-primary font-bold">＋ Add New Category…</SelectItem>
                    </SelectContent>
                  </Select>
                  {showCustomCatInput && (
                    <div className="flex gap-2 mt-2">
                      <Input
                        autoFocus
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), confirmCustomCategory())}
                        placeholder="New category name…"
                        className="bg-white/5 border-primary/40 rounded-xl h-11 flex-1"
                      />
                      <Button type="button" onClick={confirmCustomCategory} className="h-11 px-4 rounded-xl bg-primary text-black font-bold text-sm">Add</Button>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Base Price</label>
                  <Input
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    placeholder="₹45,000"
                    className="bg-white/5 border-white/10 rounded-2xl h-14"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Fabric</label>
                  <Input value={form.fabric} onChange={(e) => setForm((f) => ({ ...f, fabric: e.target.value }))} placeholder="Pure Georgette" className="bg-white/5 border-white/10 rounded-2xl h-14" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Work Type</label>
                  <Input value={form.embroidery} onChange={(e) => setForm((f) => ({ ...f, embroidery: e.target.value }))} placeholder="Hand Zari" className="bg-white/5 border-white/10 rounded-2xl h-14" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Occasion</label>
                  <Input value={form.occasion} onChange={(e) => setForm((f) => ({ ...f, occasion: e.target.value }))} placeholder="Bridal, Reception…" className="bg-white/5 border-white/10 rounded-2xl h-14" />
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
                  onCheckedChange={(val) => setForm((f) => ({ ...f, is_customizable: val }))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Craftsmanship Narrative</label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Describe the intricate details and inspiration..."
              className="bg-white/5 border-white/10 rounded-3xl min-h-[120px] resize-none p-6"
            />
          </div>

          {/* Instagram Reels Section */}
          <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.02] space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white/70">Instagram Reels</h3>
                  <p className="text-[10px] text-white/30">Add multiple reels to showcase this design</p>
                </div>
              </div>
              <Button
                type="button"
                onClick={addReel}
                variant="outline"
                className="rounded-xl h-9 px-4 border-white/10 hover:bg-white/5 text-xs font-bold gap-2"
              >
                <Plus className="w-3.5 h-3.5" /> Add Reel
              </Button>
            </div>

            <div className="space-y-8">
              {(Array.isArray(form.reels) ? form.reels : []).map((reel, index) => (
                <div key={index} className="p-5 rounded-2xl border border-white/5 bg-white/[0.01] relative group animate-in fade-in slide-in-from-top-4 duration-300">
                  <button
                    type="button"
                    onClick={() => removeReel(index)}
                    className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-red-500 transition-colors z-10"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Reel Link</label>
                      <Input
                        value={reel.link}
                        onChange={(e) => updateReel(index, { link: e.target.value })}
                        placeholder="https://www.instagram.com/reel/..."
                        className="bg-white/5 border-white/10 focus:border-[#E1306C]/50 rounded-xl h-11 text-sm"
                      />
                      {reel.link.includes("instagram.com/reel") && (
                        <p className="text-[10px] text-green-500 mt-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Valid Reel Link
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Reel Thumbnail (WebP Optimized)</label>
                      {!reel.thumbnail ? (
                        <div className="space-y-3">
                          <button
                            type="button"
                            disabled={uploadingThumbnail === index}
                            onClick={() => (document.getElementById(`reel-thumb-${index}`) as HTMLInputElement)?.click()}
                            className="w-full h-24 rounded-xl border-2 border-dashed border-white/10 hover:border-[#E1306C]/30 flex flex-col items-center justify-center gap-2 text-white/20 hover:text-white/40 transition-all disabled:opacity-50"
                          >
                            {uploadingThumbnail === index ? (
                              <Loader2 className="w-6 h-6 animate-spin text-[#E1306C]" />
                            ) : (
                              <>
                                <Upload className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Upload Thumbnail</span>
                              </>
                            )}
                          </button>
                          <input
                            id={`reel-thumb-${index}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleReelThumbnailUpload(e, index)}
                          />
                          <Input
                            value={reel.thumbnail}
                            onChange={(e) => updateReel(index, { thumbnail: e.target.value })}
                            placeholder="...or paste URL"
                            className="bg-white/5 border-white/10 rounded-xl h-10 text-xs"
                          />
                        </div>
                      ) : (
                        <div className="relative rounded-xl overflow-hidden border border-white/10 aspect-video">
                          <img
                            src={reel.thumbnail}
                            alt={`Reel ${index + 1} thumbnail`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/20" />
                          <button
                            type="button"
                            onClick={() => updateReel(index, { thumbnail: "" })}
                            className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 rounded-md text-[9px] font-bold uppercase text-white hover:bg-red-500 transition-colors"
                          >
                            Change
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {(Array.isArray(form.reels) ? form.reels : []).length === 0 && (
                <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl">
                  <Play className="w-8 h-8 text-white/10 mb-3" />
                  <p className="text-sm text-white/20 font-medium">No reels added yet</p>
                  <Button
                    type="button"
                    onClick={addReel}
                    variant="link"
                    className="text-primary text-xs font-bold uppercase tracking-widest mt-2"
                  >
                    + Add your first reel
                  </Button>
                </div>
              )}
            </div>
          </div>

        </section>

        {/* Variant Manager */}
        <section className="p-8 rounded-[2rem] bg-[#0F0F0F] border border-white/5 space-y-8">
          <div className="flex items-end justify-between border-b border-white/5 pb-4">
            <div>
              <h2 className="font-heading text-2xl text-white">Design Variants</h2>
              <p className="text-xs text-white/40 mt-1">Manage colors, specific imagery, and swatches</p>
            </div>
            <Button type="button" onClick={addVariant} variant="outline" className="h-12 border-primary/20 text-primary hover:bg-primary/5 rounded-xl gap-2">
              <Plus className="w-5 h-5" /> Add Color Variant
            </Button>
          </div>

          {form.variants.length === 0 && (
            <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-3xl">
              <p className="text-white/20 text-sm">No variants yet   add at least one color.</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6">
            {form.variants.map((v, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative p-8 rounded-3xl bg-white/[0.03] border border-white/5 group overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row gap-10">
                  {/* Variant Info */}
                  <div className="w-full lg:w-1/3 space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase px-3 py-1 bg-primary text-black rounded-lg">COLOR {idx + 1}</span>
                      <div className="flex gap-1">
                        <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-white/30 hover:text-white" onClick={() => moveVariant(idx, "up")} disabled={idx === 0}><ArrowUp className="w-4 h-4" /></Button>
                        <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-white/30 hover:text-white" onClick={() => moveVariant(idx, "down")} disabled={idx === form.variants.length - 1}><ArrowDown className="w-4 h-4" /></Button>
                        <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-destructive/40 hover:text-destructive hover:bg-destructive/10" onClick={() => removeVariant(idx)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-white/30">Color Name</label>
                      <Input value={v.color} onChange={(e) => updateVariantMeta(idx, "color", e.target.value)} placeholder="Royal Red" className="bg-black/40 border-white/10 h-12" />
                    </div>
                    <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      <span className="text-xs font-medium text-primary">Active in Boutique</span>
                    </div>
                  </div>

                  {/* Variant Gallery */}
                  <div className="flex-1 space-y-4">
                    <label className="text-[10px] font-bold uppercase text-white/30">Variant Imagery</label>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                      {v.images.map((img, imgIdx) => (
                        <div key={imgIdx} className={`relative aspect-[3/4] rounded-xl overflow-hidden border p-0.5 transition-all ${v.thumbnail === img ? "border-primary" : "border-white/10"}`}>
                          <img src={getImageUrl(img)} className="w-full h-full object-cover rounded-lg" />
                          <button type="button" onClick={() => updateVariantMeta(idx, "thumbnail", img)} className="absolute inset-0 bg-black/0 hover:bg-black/20" />
                          <button type="button" onClick={() => removeVariantImage(idx, imgIdx, false)} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {(variantNewFiles[idx] || []).map((file, imgIdx) => (
                        <div key={`new-${imgIdx}`} className="relative aspect-[3/4] rounded-xl overflow-hidden border-2 border-primary/40 border-dashed p-0.5">
                          <img src={URL.createObjectURL(file)} className="w-full h-full object-cover rounded-lg" />
                          <div className="absolute inset-0 bg-primary/10 animate-pulse" />
                          <button type="button" onClick={() => removeVariantImage(idx, imgIdx, true)} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => (document.getElementById(`file-v-${idx}`) as HTMLInputElement)?.click()}
                        className="aspect-[3/4] rounded-xl border-2 border-dashed border-white/10 hover:border-primary/40 flex flex-col items-center justify-center text-white/20 hover:text-primary transition-all gap-1"
                      >
                        <Upload className="w-5 h-5" />
                        <span className="text-[8px] font-bold uppercase text-center px-2">Add Photos</span>
                      </button>
                      <input id={`file-v-${idx}`} type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleVariantImageSelect(idx, e)} />
                    </div>
                    <p className="text-[9px] text-white/20 italic">Click an image to set as primary color thumbnail</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Action Bar ───────────────────────────────────────────── */}
        <div className="flex gap-4 pb-16">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/admin/products")}
            className="flex-1 h-14 rounded-2xl text-white/40 hover:text-white text-lg"
          >
            Discard Changes
          </Button>
          <Button
            type="submit"
            disabled={isSaving}
            className="flex-[2] h-14 rounded-2xl text-xl font-bold bg-primary hover:bg-primary/90 text-black shadow-[0_20px_40px_rgba(212,175,55,0.1)] transition-all gap-3"
          >
            {isSaving ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> {uploading ? "Uploading images…" : "Saving…"}</>
            ) : (
              <><Save className="w-5 h-5" /> {isEditing ? "Update Boutique Masterpiece" : "Publish to Collection"}</>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
