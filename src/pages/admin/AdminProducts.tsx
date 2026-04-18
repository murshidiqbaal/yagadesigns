import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Upload, X, Package, ImageOff } from "lucide-react";
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

const FORM_CATEGORIES = CATEGORIES.filter(c => c !== "All");

interface FormData {
  name: string;
  description: string;
  category: string;
  image_url: string;
}

const DEFAULT_FORM: FormData = { name: "", description: "", category: "", image_url: "" };

export default function AdminProducts() {
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormData>(DEFAULT_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
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
    setImageFile(null);
    setImagePreview("");
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description, category: p.category, image_url: p.image_url });
    setImagePreview(getImageUrl(p.image_url) || "");
    setImageFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setForm(DEFAULT_FORM);
    setImageFile(null);
    setImagePreview("");
  };

  const onImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10 MB.");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Product name is required"); return; }
    if (!form.category) { toast.error("Please select a category"); return; }

    let image_url = form.image_url;

    if (imageFile) {
      setUploading(true);
      try {
        image_url = await uploadProductImage(imageFile);
        console.log("Image uploaded successfully, ID/URL received:", image_url);
      } catch (err) {
        console.error("Image upload error:", err);
        toast.error("Image upload failed. Check your Appwrite storage bucket permissions.");
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    const payload = { ...form, image_url, created_at: new Date().toISOString() };
    console.log("Submitting Product Payload:", payload);
    if (editing) {
      editMut.mutate({ id: editing.$id, data: payload });
    } else {
      addMut.mutate(payload);
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
        <Button id="add-product-btn" onClick={openAdd} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" /> Add Product
        </Button>
      </div>

      {/* ── Product List ─────────────────────────────────────── */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-heading text-2xl mb-2">No products yet</h3>
          <p className="text-muted-foreground text-sm mb-8">
            Add your first bridal design to get started.
          </p>
          <Button onClick={openAdd} className="gap-2">
            <Plus className="w-4 h-4" /> Add First Product
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map(product => (
            <motion.div
              key={product.$id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all group"
            >
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-white/5 border border-white/5">
                {product.image_url ? (
                  <img
                    src={getImageUrl(product.image_url)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageOff className="w-5 h-5 text-muted-foreground/30" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-heading text-lg truncate">{product.name}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/15">
                    {product.category}
                  </span>
                  {product.description && (
                    <span className="text-xs text-muted-foreground truncate hidden sm:block">
                      {product.description}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEdit(product)}
                  title="Edit product"
                >
                  <Pencil className="w-4 h-4" />
                </Button>

                {deleteTarget === product.$id ? (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMut.mutate(product.$id)}
                      disabled={deleteMut.isPending}
                    >
                      {deleteMut.isPending ? "Deleting…" : "Confirm"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(null)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteTarget(product.$id)}
                    title="Delete product"
                    className="text-destructive/60 hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Add / Edit Modal ──────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
            onClick={e => e.target === e.currentTarget && closeModal()}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 24 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-md bg-[#101010] rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                <h2 className="font-heading text-xl">
                  {editing ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Image Upload */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                    Product Image
                  </label>
                  <label className="block cursor-pointer" htmlFor="product-image-input">
                    <div
                      className={`relative rounded-xl overflow-hidden border-2 border-dashed transition-colors ${
                        imagePreview
                          ? "border-primary/40"
                          : "border-white/10 hover:border-primary/30"
                      }`}
                    >
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-44 object-cover"
                        />
                      ) : (
                        <div className="h-44 flex flex-col items-center justify-center text-muted-foreground gap-2">
                          <Upload className="w-8 h-8 opacity-50" />
                          <span className="text-xs uppercase tracking-widest">
                            Click to upload image
                          </span>
                          <span className="text-[10px] text-muted-foreground/50">
                            JPG, PNG, WebP — max 10 MB
                          </span>
                        </div>
                      )}
                    </div>
                    <input
                      id="product-image-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onImageSelect}
                    />
                  </label>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => { setImageFile(null); setImagePreview(""); setForm(f => ({ ...f, image_url: "" })); }}
                      className="mt-2 text-xs text-muted-foreground hover:text-destructive transition-colors"
                    >
                      Remove image
                    </button>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                    Name *
                  </label>
                  <Input
                    id="product-name"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Royal Bridal Lehenga"
                    required
                    className="bg-white/5 border-white/10 focus:border-primary/50 rounded-xl h-11"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                    Category *
                  </label>
                  <Select
                    value={form.category}
                    onValueChange={val => setForm(f => ({ ...f, category: val }))}
                  >
                    <SelectTrigger
                      id="product-category"
                      className="bg-white/5 border-white/10 focus:border-primary/50 rounded-xl h-11"
                    >
                      <SelectValue placeholder="Select category…" />
                    </SelectTrigger>
                    <SelectContent>
                      {FORM_CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                    Description
                  </label>
                  <Input
                    id="product-description"
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Brief description of the design…"
                    className="bg-white/5 border-white/10 focus:border-primary/50 rounded-xl h-11"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={closeModal}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    id="modal-save-btn"
                    type="submit"
                    disabled={isSaving}
                    className="flex-1"
                  >
                    {uploading
                      ? "Uploading image…"
                      : addMut.isPending || editMut.isPending
                      ? "Saving…"
                      : editing
                      ? "Save Changes"
                      : "Add Product"}
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
