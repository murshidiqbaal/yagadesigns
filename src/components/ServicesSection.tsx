import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { databases, appwriteConfig } from '@/lib/appwrite';
import { Heart, Globe, Briefcase, Sparkles, Loader2 } from 'lucide-react';

const serviceIcons = [Heart, Globe, Briefcase, Sparkles];

const fallbackServices = [
  { title: 'Royal Weddings', desc: 'Exquisite wedding celebrations curated with unparalleled attention to royal elegance and refined details.', imageUrl: '' },
  { title: 'Bespoke Destinations', desc: 'Breathtaking ceremonies across Kerala\'s most stunning and exclusive luxury locations.', imageUrl: '' },
  { title: 'Signature Galas', desc: 'Sophisticated corporate events and business gatherings that leave a lasting, professional impression.', imageUrl: '' },
  { title: 'Private Soirées', desc: 'Intimate celebrations designed to create unforgettable personal memories within a royal setting.', imageUrl: '' },
];

export default function ServicesSection() {
  const { data: dbServices, isLoading } = useQuery({
    queryKey: ['servicesSection'],
    queryFn: async () => {
      try {
        const doc = await databases.getDocument(
          appwriteConfig.databaseId,
          appwriteConfig.collectionContentId,
          'services_section'
        );
        if (doc.servicesData) {
          return JSON.parse(doc.servicesData);
        }
        return null;
      } catch (error) {
        return null; // Document likely doesn't exist yet
      }
    }
  });

  const activeServices = dbServices && Array.isArray(dbServices) && dbServices.length === 4 ? dbServices : fallbackServices;



  return (
    <section id="services" className="py-32 grain-overlay">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <p className="text-[#D4AF37] text-[10px] tracking-[0.5em] uppercase mb-6 font-medium">The Offerings</p>
          <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl tracking-tighter italic">
            Royal <span className="text-gradient not-italic tracking-normal">Signature</span> Services
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {activeServices.map((s: any, i: number) => {
            const Icon = serviceIcons[i] || Sparkles;
            return (
              <motion.article
                key={s.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="group relative h-full min-h-[400px] p-12 glass hover:-translate-y-4 hover:shadow-[0_20px_60px_-15px_rgba(212,175,55,0.2)] hover:border-[#D4AF37]/40 transition-all duration-700 cursor-pointer overflow-hidden rounded-none royal-border flex flex-col justify-end"
              >
                {s.imageUrl && (
                  <img
                    src={s.imageUrl}
                    alt={s.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-1000 ease-out z-[-2]"
                  />
                )}
                {/* Image darkening gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent z-[-1]" />
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0" />
                
                <div className="relative z-10 mt-auto">
                  <Icon className="stroke-[1px] w-12 h-12 text-[#D4AF37] mb-8 group-hover:scale-110 transition-transform duration-700" aria-hidden="true" />
                  <h3 className="font-heading text-3xl mb-4 tracking-tighter italic text-[#F5F5F5]">{s.title}</h3>
                  <p className="text-[#F5F5F5]/60 font-light text-base leading-relaxed tracking-wide group-hover:text-[#F5F5F5]/90 transition-colors duration-500">{s.desc}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
