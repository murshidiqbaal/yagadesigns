import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  addTestimonial, deleteTestimonial,
  getTestimonials,
  Testimonial
} from "@/lib/appwrite";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Plus, Quote, Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TestimonialsManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<Testimonial[]>([]);
  const [newItem, setNewItem] = useState({
    name: "",
    message: "",
    rating: 5
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const data = await getTestimonials();
    setItems(data);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addTestimonial(newItem);
      toast.success("Testimonial added!");
      setNewItem({ name: "", message: "", rating: 5 });
      fetchItems();
    } catch (err: any) {
      toast.error(err.message || "Failed to add testimonial");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await deleteTestimonial(id);
      toast.success("Testimonial removed");
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
              <CardTitle className="text-xl font-heading">New Testimonial</CardTitle>
              <CardDescription>Share your clients' valuable experiences.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Client Name & Location</label>
                  <Input
                    placeholder="Priya & Arjun, Ernakulam..."
                    className="bg-background/50 border-border/50"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rating</label>
                  <div className="flex gap-3">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setNewItem({ ...newItem, rating: num })}
                        className={`p-1 transition-all hover:scale-110 ${newItem.rating >= num ? 'text-primary' : 'text-muted-foreground/30'}`}
                      >
                        <Star className={`w-8 h-8 ${newItem.rating >= num ? 'fill-primary' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">The Experience</label>
                  <Textarea
                    placeholder="Describe their experience with Yaga Designs..."
                    className="bg-background/50 border-border/50 h-32 resize-none"
                    value={newItem.message}
                    onChange={(e) => setNewItem({ ...newItem, message: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full h-11" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                  Publish Review
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* List */}
        <div className="xl:col-span-8">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-heading text-xl">Published Reviews ({items.length})</h3>
          </div>
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((t) => (
                <motion.div
                  key={t.$id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-6 glass border border-border/50 rounded-lg relative group"
                >
                  <Quote className="absolute top-4 right-4 w-12 h-12 text-primary/5 -z-0" />
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? 'fill-primary text-primary' : 'text-muted-foreground/20'}`} />
                          ))}
                        </div>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Verified Client</span>
                      </div>
                      <p className="font-heading text-lg">{t.name}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed italic">"{t.message}"</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10 shrink-0"
                      onClick={() => handleDelete(t.$id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Remove Review
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {items.length === 0 && (
              <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-lg bg-secondary/5 text-muted-foreground text-center">
                <Quote className="w-12 h-12 mb-2 opacity-10" />
                <p>No client testimonials gathered yet. <br /> Success starts with your first happy couple!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
