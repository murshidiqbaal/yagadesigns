import { useState, useEffect } from "react";
import { appwriteConfig, databases, uploadProductImage } from "@/lib/appwrite";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Database, Camera } from "lucide-react";
import { motion } from "framer-motion";

import fallbackImg1 from '@/assets/portfolio-1.jpg';
import fallbackImg2 from '@/assets/portfolio-2.jpg';
import fallbackImg3 from '@/assets/portfolio-3.jpg';
import fallbackImg4 from '@/assets/portfolio-4.jpg';

export default function ServicesManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [servicesData, setServicesData] = useState([
    { id: "s1", title: "", desc: "", imageUrl: "", imageFile: null as File | null },
    { id: "s2", title: "", desc: "", imageUrl: "", imageFile: null as File | null },
    { id: "s3", title: "", desc: "", imageUrl: "", imageFile: null as File | null },
    { id: "s4", title: "", desc: "", imageUrl: "", imageFile: null as File | null },
  ]);

  useEffect(() => {
    fetchServicesData();
  }, []);

  const fetchServicesData = async () => {
    try {
      const dbId = appwriteConfig.databaseId;
      const colId = appwriteConfig.collectionContentId;
      const doc = await databases.getDocument(dbId, colId, "services_section");
      
      if (doc.servicesData) {
        const parsed = JSON.parse(doc.servicesData);
        setServicesData(prev => prev.map((item, i) => ({
          ...item,
          title: parsed[i]?.title || "",
          desc: parsed[i]?.desc || "",
          imageUrl: parsed[i]?.imageUrl || ""
        })));
      }
    } catch (error: any) {
      console.log("No services document found", error);
    }
  };

  const handleServicesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dbId = appwriteConfig.databaseId;
      const colId = appwriteConfig.collectionContentId;
      
      const processedServices = await Promise.all(
        servicesData.map(async (service) => {
          let finalImageUrl = service.imageUrl;
          if (service.imageFile) {
            finalImageUrl = await uploadProductImage(service.imageFile);
          }
          return { id: service.id, title: service.title, desc: service.desc, imageUrl: finalImageUrl };
        })
      );

      const stringifiedData = JSON.stringify(processedServices);
      const dataToSave = {
        elementId: "services_section",
        servicesData: stringifiedData
      };

      try {
        await databases.updateDocument(dbId, colId, "services_section", dataToSave);
      } catch (err) {
        await databases.createDocument(dbId, colId, "services_section", dataToSave);
      }
      
      toast.success("Services section updated!");
      fetchServicesData();
    } catch (err: any) {
      toast.error(err.message || "Failed to save services");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeedDefaults = async () => {
    if (!window.confirm("This will overwrite your existing services with premium defaults. Continue?")) return;
    setIsLoading(true);

    try {
      const defaultServicesTemplate = [
        { id: "s1", title: 'Luxury Weddings', desc: 'Exquisite wedding celebrations crafted with attention to detail and elegance.', imgSrc: fallbackImg1 },
        { id: "s2", title: 'Exclusive Events', desc: 'Breathtaking ceremony planning across the globe\'s most stunning locations.', imgSrc: fallbackImg2 },
        { id: "s3", title: 'Corporate Gala', desc: 'Sophisticated corporate gatherings that leave lasting professional impressions.', imgSrc: fallbackImg3 },
        { id: "s4", title: 'Private Soirée', desc: 'Intimate celebrations and anniversaries designed for unforgettable memories.', imgSrc: fallbackImg4 },
      ];

      const dbId = appwriteConfig.databaseId;
      const colId = appwriteConfig.collectionContentId;

      const processedServices = await Promise.all(
        defaultServicesTemplate.map(async (service, i) => {
          const response = await fetch(service.imgSrc);
          const blob = await response.blob();
          const file = new File([blob], `default_service_${i}.jpg`, { type: blob.type });

          const finalImageUrl = await uploadProductImage(file);

          return { id: service.id, title: service.title, desc: service.desc, imageUrl: finalImageUrl };
        })
      );

      const dataToSave = {
        elementId: "services_section",
        servicesData: JSON.stringify(processedServices)
      };

      await databases.updateDocument(dbId, colId, "services_section", dataToSave).catch(() => 
        databases.createDocument(dbId, colId, "services_section", dataToSave)
      );

      toast.success("Premium services seeded!");
      fetchServicesData();
    } catch (error: any) {
      toast.error("Failed to seed defaults");
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
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-heading mb-1">Services Management</h2>
          <p className="text-sm text-muted-foreground">Customize your premium service offerings.</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleSeedDefaults} disabled={isLoading} className="border-primary/20 hover:bg-primary/10">
          <Database className="w-4 h-4 mr-2" />
          Seed Defaults
        </Button>
      </div>

      <form onSubmit={handleServicesSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {servicesData.map((service, index) => (
            <Card key={service.id} className="overflow-hidden border-border/50 bg-secondary/5">
              <CardHeader className="bg-secondary/10 border-b border-border/50 py-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {index + 1}
                  </span>
                  Service Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    placeholder="Luxury Weddings..."
                    className="bg-background/50 border-border/50"
                    value={service.title}
                    onChange={(e) => {
                      const newServices = [...servicesData];
                      newServices[index].title = e.target.value;
                      setServicesData(newServices);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    className="h-24 bg-background/50 border-border/50 resize-none"
                    value={service.desc}
                    onChange={(e) => {
                      const newServices = [...servicesData];
                      newServices[index].desc = e.target.value;
                      setServicesData(newServices);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Card Image</label>
                  <div className="flex items-start gap-4">
                    <div className="relative w-24 h-24 rounded-md overflow-hidden bg-secondary/20 flex-shrink-0 border border-border/50">
                      {service.imageUrl ? (
                        <img src={service.imageUrl} alt="Service preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Camera className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        className="bg-background/50 h-9 p-1"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const newServices = [...servicesData];
                            newServices[index].imageFile = e.target.files[0];
                            setServicesData(newServices);
                          }
                        }}
                      />
                      <p className="text-[10px] text-muted-foreground italic">Recommended: 800x600px portrait/landscape.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="sticky bottom-6 flex justify-end">
          <Button type="submit" disabled={isLoading} className="shadow-lg shadow-primary/20 px-8 h-12">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Sync All Services
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
