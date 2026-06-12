import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addPortfolioItem, deletePortfolioItem, getPortfolioItems, PortfolioItem, uploadProductImage } from "@/lib/appwrite";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Layers, Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PortfolioManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [newItem, setNewItem] = useState({
    title: "",
    category: "Weddings",
    description: "",
    imageFile: null as File | null
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const data = await getPortfolioItems();
    setItems(data);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.imageFile) {
      toast.error("Please select a project image");
      return;
    }
    setIsLoading(true);
    try {
      const imageUrl = await uploadProductImage(newItem.imageFile);

      await addPortfolioItem({
        title: newItem.title,
        category: newItem.category,
        description: newItem.description,
        image_url: imageUrl,
        created_at: new Date().toISOString()
      });

      toast.success("Project added to gallery!");
      setNewItem({ title: "", category: "Weddings", description: "", imageFile: null });
      fetchItems();
    } catch (err: any) {
      toast.error(err.message || "Failed to add project");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Remove this project from the showcase?")) return;
    try {
      await deletePortfolioItem(id);
      toast.success("Project removed");
      fetchItems();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete item");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Add Form */}
        <div className="xl:col-span-4">
          <Card className="sticky top-6 border-border/50 bg-secondary/5">
            <CardHeader>
              <CardTitle className="text-xl font-heading">New Project</CardTitle>
              <CardDescription>Capture the essence of your recent work.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Project Title</label>
                  <Input
                    placeholder="Minimalist Royal Wedding..."
                    className="bg-background/50 border-border/50"
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select
                    className="w-full p-2 rounded-md bg-background/50 border border-border/50 text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  >
                    <option>Weddings</option>
                    <option>Corporate</option>
                    <option>Private</option>
                    <option>Destination</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Brief Description</label>
                  <Textarea
                    placeholder="Details about the event..."
                    className="bg-background/50 border-border/50 h-24 resize-none"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Project Image</label>
                  <Input
                    type="file"
                    accept="image/*"
                    className="bg-background/50 cursor-pointer h-10 p-1"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setNewItem({ ...newItem, imageFile: e.target.files[0] });
                      }
                    }}
                    required
                  />
                </div>
                <Button type="submit" className="w-full h-11" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                  Publish to Gallery
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* List */}
        <div className="xl:col-span-8">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-heading text-xl flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              Published Projects ({items.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.$id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="group relative flex flex-col glass border border-border/50 rounded-lg overflow-hidden h-[240px]"
                >
                  <img src={item.image_url} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4">
                    <div className="flex justify-between items-end gap-2">
                      <div className="min-w-0">
                        <span className="text-[10px] text-primary uppercase tracking-[0.2em] font-bold mb-1 block">{item.category}</span>
                        <h4 className="font-heading text-lg text-white truncate">{item.title}</h4>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white/50 hover:text-destructive hover:bg-destructive/20 transition-colors"
                        onClick={() => handleDelete(item.$id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {items.length === 0 && (
              <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-lg bg-secondary/5 text-muted-foreground">
                <Camera className="w-12 h-12 mb-2 opacity-20" />
                <p>No projects published yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
