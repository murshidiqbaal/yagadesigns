import { useState, useEffect } from "react";
import { appwriteConfig, databases, ID, uploadProductImage } from "@/lib/appwrite";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [heroData, setHeroData] = useState({
    title: "",
    subtitle: "",
    buttonText: "",
    imageFile: null as File | null,
    imageUrl: ""
  });

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      const dbId = appwriteConfig.databaseId;
      const colId = appwriteConfig.collectionContentId;
      const doc = await databases.getDocument(dbId, colId, "hero_section");
      setHeroData({
        ...heroData,
        title: doc.title || "",
        subtitle: doc.subtitle || "",
        buttonText: doc.buttonText || "",
        imageUrl: doc.imageUrl || "",
      });
    } catch (error: any) {
      console.log("No hero document found", error);
    }
  };

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let finalImageUrl = heroData.imageUrl;

      if (heroData.imageFile) {
        finalImageUrl = await uploadProductImage(heroData.imageFile);
      }

      const dbId = appwriteConfig.databaseId;
      const colId = appwriteConfig.collectionContentId;

      const dataToSave = {
        elementId: "hero_section",
        title: heroData.title,
        subtitle: heroData.subtitle,
        buttonText: heroData.buttonText,
        imageUrl: finalImageUrl,
      };

      try {
        await databases.updateDocument(dbId, colId, "hero_section", dataToSave);
      } catch (err) {
        await databases.createDocument(dbId, colId, "hero_section", dataToSave);
      }

      toast.success("Hero section updated successfully!");
      fetchHeroData();
    } catch (error: any) {
      toast.error(error.message || "Failed to save Hero section");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="text-2xl font-heading">Hero Management</CardTitle>
          <CardDescription>Update the landing page main visual and text content.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleHeroSubmit} className="space-y-6 max-w-3xl">
            <div className="grid gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Main Title</label>
                <Textarea
                  placeholder="Cinematic Storytellers..."
                  className="min-h-[100px] bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
                  value={heroData.title}
                  onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Subtitle</label>
                <Textarea
                  placeholder="Capturing life's most precious moments..."
                  className="min-h-[80px] bg-background/50 border-border/50"
                  value={heroData.subtitle}
                  onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Background Image</label>
                <div className="flex flex-col gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    className="bg-background/50 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setHeroData({ ...heroData, imageFile: e.target.files[0] });
                      }
                    }}
                  />
                  {heroData.imageUrl && (
                    <div className="relative group w-full max-w-md aspect-video rounded-lg overflow-hidden border border-border/50">
                      <img 
                        src={heroData.imageUrl} 
                        alt="Hero preview" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-medium uppercase tracking-widest">Current Active Image</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full md:w-auto min-w-[200px] h-12">
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Publish Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
