import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, CheckCircle2, MessageCircle, Sparkles, AlertTriangle, Palette, Ruler, Scissors, Milestone } from "lucide-react";

interface TimelineMilestone {
  title: string;
  description: string;
  icon: any;
  dateStr: string;
  urgency: boolean;
}

export default function WeddingDatePlanner() {
  const [weddingDate, setWeddingDate] = useState<string>('');
  const [milestones, setMilestones] = useState<TimelineMilestone[]>([]);
  const [isUrgent, setIsUrgent] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);

  // Helper date calculation functions
  const subtractMonths = (date: Date, months: number): Date => {
    const d = new Date(date);
    d.setMonth(d.getMonth() - months);
    return d;
  };

  const subtractDays = (date: Date, days: number): Date => {
    const d = new Date(date);
    d.setDate(d.getDate() - days);
    return d;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const formatMonthName = (date: Date): string => {
    return date.toLocaleDateString("en-IN", { month: "long" });
  };

  useEffect(() => {
    if (!weddingDate) {
      setMilestones([]);
      setIsUrgent(false);
      setIsCalculated(false);
      return;
    }

    const wDate = new Date(weddingDate);
    const today = new Date();

    // Check urgency (less than 4 months away or in the past)
    const fourMonthsFromNow = new Date();
    fourMonthsFromNow.setMonth(fourMonthsFromNow.getMonth() + 4);
    const urgentMode = wDate <= fourMonthsFromNow;
    setIsUrgent(urgentMode);

    // Calculate dates
    const consultDate = subtractMonths(wDate, 4);
    const designDate = subtractMonths(wDate, 3);
    const measureDate = subtractDays(wDate, 75); // 2.5 months
    const stitchStart = subtractMonths(wDate, 2);
    const stitchEnd = subtractMonths(wDate, 1);
    const trialDate = subtractDays(wDate, 7); // 1 week before

    // Build timeline milestones
    const list: TimelineMilestone[] = [
      {
        title: "Initial Consultation",
        description: "Sit down with Yaga designers to discuss your vision, themes, and sketches.",
        icon: Calendar,
        dateStr: `Before ${formatDate(consultDate)}`,
        urgency: consultDate < today
      },
      {
        title: "Design Finalization",
        description: "Approve custom sketches, finalize heritage fabrics, color shades, and hand embroideries.",
        icon: Palette,
        dateStr: `Before ${formatDate(designDate)}`,
        urgency: designDate < today
      },
      {
        title: "Bespoke Measurements",
        description: "Visit our Kerala studio or connect online for precise made-to-measure records.",
        icon: Ruler,
        dateStr: `Before ${formatDate(measureDate)}`,
        urgency: measureDate < today
      },
      {
        title: "Artisan Stitching",
        description: "Our skilled tailors handcraft, embroider, and construct your boutique lehenga or gown.",
        icon: Scissors,
        dateStr: `${formatMonthName(stitchStart)}-${formatMonthName(stitchEnd)} ${stitchEnd.getFullYear()}`,
        urgency: stitchStart < today
      },
      {
        title: "Final Trial & Handover",
        description: "Ensure impeccable drape and fit during your final trial one week before your big day.",
        icon: Milestone,
        dateStr: formatDate(trialDate),
        urgency: trialDate < today
      }
    ];

    setMilestones(list);
    setIsCalculated(true);

    // Analytics: Save selected date event
    try {
      const raw = localStorage.getItem('yaga_inspiration_analytics');
      const analytics = raw ? JSON.parse(raw) : { savesCount: 0, whatsappSendsCount: 0, savesDetail: [] };
      analytics.savesCount += 1;
      analytics.savesDetail.push({
        type: 'WeddingDateSelect',
        name: weddingDate,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('yaga_inspiration_analytics', JSON.stringify(analytics));
      console.log(`[Analytics] Wedding date selected: ${weddingDate}`);
    } catch (e) {
      console.error('Failed to log wedding date selection:', e);
    }

  }, [weddingDate]);

  const handleWhatsAppInquiry = () => {
    if (!weddingDate) return;

    // Analytics: Log WhatsApp click
    try {
      const raw = localStorage.getItem('yaga_inspiration_analytics');
      const analytics = raw ? JSON.parse(raw) : { savesCount: 0, whatsappSendsCount: 0, savesDetail: [] };
      analytics.whatsappSendsCount += 1;
      localStorage.setItem('yaga_inspiration_analytics', JSON.stringify(analytics));
      console.log('[Analytics] Planner WhatsApp click');
    } catch (e) {
      console.error('Failed to log whatsapp click:', e);
    }

    const formattedDate = new Date(weddingDate).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    const text = `Hello Yaga Designs,\n\nMy wedding date is:\n${formattedDate}\n\nI would like a bridal consultation.`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <section className="py-24 bg-[#080808] border-y border-white/5 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="container max-w-5xl px-4 md:px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 animate-pulse" />
            Plan Your Bridal Journey
          </span>
          <h2 className="text-4xl md:text-5xl font-heading leading-tight tracking-tight text-white">
            Custom Bridal Timeline
          </h2>
          <p className="text-sm text-white/40 max-w-md mx-auto leading-relaxed">
            Handcrafting luxury bridal outfits requires care, time, and heritage artistry. Enter your wedding date to calculate your design timeline.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Panel: Date Input Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-[2rem] bg-[#0C0C0C] border border-white/5 shadow-2xl relative overflow-hidden group hover:border-primary/20 transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
              
              <div className="space-y-6 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <Calendar className="w-5 h-5" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-heading text-white">When is your wedding?</h3>
                  <p className="text-xs text-white/40">Select your wedding date to mapping your preparation steps.</p>
                </div>

                <div className="space-y-4">
                  <input
                    type="date"
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    className="w-full h-14 px-4 bg-white/5 border border-white/10 focus:border-primary/50 text-white rounded-2xl outline-none font-medium tracking-wide transition-all [color-scheme:dark]"
                  />

                  {weddingDate && (
                    <Button
                      onClick={handleWhatsAppInquiry}
                      className="w-full h-14 rounded-2xl font-bold bg-primary hover:bg-primary/90 text-black shadow-lg flex items-center justify-center gap-3 transition-transform active:scale-[0.98]"
                    >
                      <MessageCircle className="w-5 h-5 fill-black" />
                      Book Bridal Consultation
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Urgency Warn Banner */}
            <AnimatePresence>
              {isUrgent && isCalculated && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex gap-4 items-start"
                >
                  <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-amber-500">Urgent Preparation Mode</h4>
                    <p className="text-xs text-white/50 mt-1 leading-relaxed">
                      Your wedding is less than 4 months away! Our handcrafting calendar is booking up. We recommend securing your initial consultation immediately to fast-track your bespoke bridal attire.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Panel: Interactive Timeline */}
          <div className="lg:col-span-7">
            {!isCalculated ? (
              /* Prompt state */
              <div className="h-[400px] border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center text-center p-6 bg-white/[0.01]">
                <Milestone className="w-12 h-12 text-white/10 mb-4 animate-bounce" />
                <h4 className="text-lg font-heading text-white/60 mb-2">Build your timeline</h4>
                <p className="text-xs text-white/30 max-w-xs leading-relaxed">
                  Enter your wedding date on the left to see the recommended preparation milestones.
                </p>
              </div>
            ) : (
              /* Timeline active state */
              <div className="relative pl-8 md:pl-12 space-y-10 py-2">
                {/* Vertical Line */}
                <div className="absolute left-4 md:left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-white/5" />

                {milestones.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="relative group"
                  >
                    {/* Timeline Node Point */}
                    <div className={`absolute -left-12 md:-left-16 top-1.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border ${
                      item.urgency
                        ? "bg-amber-500/20 border-amber-500 text-amber-400"
                        : "bg-black border-primary text-primary shadow-[0_0_15px_rgba(212,175,55,0.2)] group-hover:scale-110"
                    }`}>
                      <item.icon className="w-3.5 h-3.5" />
                    </div>

                    {/* Card Content */}
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all duration-300 hover:bg-white/[0.03] space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h4 className="text-lg font-heading text-white font-medium group-hover:text-primary transition-colors">
                          {item.title}
                        </h4>
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full font-sans max-w-max border ${
                          item.urgency
                            ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                            : "bg-primary/10 border-primary/25 text-primary"
                        }`}>
                          {item.dateStr}
                        </span>
                      </div>
                      <p className="text-xs text-white/50 leading-relaxed max-w-xl">
                        {item.description}
                      </p>
                      {item.urgency && (
                        <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider text-amber-500 font-bold mt-1">
                          <AlertTriangle className="w-3 h-3" /> Overdue / Urgent
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
