import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Package, ImageOff, PlusCircle, Palette, Scissors } from "lucide-react";
import { toast } from "sonner";
import {
  getProducts,
  deleteProduct,
  Product,
  getImageUrl,
} from "@/lib/appwrite";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";



export default function AdminProducts() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => getProducts(),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["products-home"] });
      toast.success("Product removed from collection.");
      setDeleteTarget(null);
    },
    onError: () => toast.error("Failed to delete product."),
  });



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
        <Button onClick={() => navigate("/admin/products/new")} className="gap-2 shrink-0 h-14 px-8 rounded-2xl bg-primary hover:bg-[#FFFBD5] text-black font-bold text-lg shadow-[0_10px_30px_rgba(212,175,55,0.2)] transition-all">
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
          <Button onClick={() => navigate("/admin/products/new")} variant="outline" className="gap-2 border-white/10">
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
                  <span className="font-semibold text-white/60">
                    {product.price ? (product.price.startsWith("₹") ? product.price : `₹${product.price}`) : "Price on enquiry"}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/10" />
                  <span className="truncate">{product.fabric || "Pure Fabric"}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pr-2">
                <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/products/${product.$id}/edit`)} className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white">
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
    </div>
  );
}