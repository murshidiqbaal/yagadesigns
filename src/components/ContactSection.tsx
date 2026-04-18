import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const eventTypes = [
  'Royal Wedding',
  'Bespoke Destination',
  'Signature Gala',
  'Private Soirée',
  'Engagement Party',
  'Anniversary',
  'Other',
];

export default function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = data.get('name') as string;
    const email = data.get('email') as string;
    const eventType = data.get('eventType') as string;
    const message = data.get('message') as string;

    const subject = encodeURIComponent(`New Inquiry from ${name} - ${eventType}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nEvent Type: ${eventType}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:info@yagadesigns.in?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setIsSubmitting(false);
      setSent(true);
      form.reset();
      setTimeout(() => setSent(false), 3000);
    }, 1000);
  };

  return (
    <section id="contact" className="py-32 bg-[#0B0B0B] grain-overlay">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-20 text-center">
            <p className="text-[#D4AF37] text-[10px] tracking-[0.5em] uppercase mb-6 font-medium">The Inquiry</p>
            <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl tracking-tighter italic text-[#F5F5F5]">Schedule a <span className="text-[#D4AF37] not-italic tracking-normal">Private Consultation</span></h2>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="font-heading text-3xl mb-8 tracking-tighter italic text-[#F5F5F5]">Connect Directly</h3>
            <div className="space-y-10">
              <div className="flex items-center gap-8 group cursor-pointer">
                <div className="w-14 h-14 rounded-full border border-[#D4AF37]/20 flex items-center justify-center group-hover:bg-[#D4AF37] transition-all duration-700">
                  <Phone className="w-5 h-5 text-[#D4AF37] group-hover:text-[#0B0B0B] transition-colors duration-700" />
                </div>
                <div>
                  <p className="text-[#D4AF37] text-[10px] tracking-[0.3em] uppercase mb-1">Telephone</p>
                  <p className="text-[#F5F5F5] text-lg font-light">+91 97472 26667</p>
                </div>
              </div>
              <div className="flex items-center gap-8 group cursor-pointer">
                <div className="w-14 h-14 rounded-full border border-[#D4AF37]/20 flex items-center justify-center group-hover:bg-[#D4AF37] transition-all duration-700">
                  <Mail className="w-5 h-5 text-[#D4AF37] group-hover:text-[#0B0B0B] transition-colors duration-700" />
                </div>
                <div>
                  <p className="text-[#D4AF37] text-[10px] tracking-[0.3em] uppercase mb-1">Correspondence</p>
                  <p className="text-[#F5F5F5] text-lg font-light">info@yagadesigns.in</p>
                </div>
              </div>
              <div className="flex items-center gap-8 group cursor-pointer">
                <div className="w-14 h-14 rounded-full border border-[#D4AF37]/20 flex items-center justify-center group-hover:bg-[#D4AF37] transition-all duration-700">
                  <MapPin className="w-5 h-5 text-[#D4AF37] group-hover:text-[#0B0B0B] transition-colors duration-700" />
                </div>
                <div>
                  <p className="text-[#D4AF37] text-[10px] tracking-[0.3em] uppercase mb-1">Estate</p>
                  <p className="text-[#F5F5F5] text-lg font-light">Kothamangalam, Ernakulam, Kerala</p>
                </div>
              </div>
            </div>

            <div className="mt-12 overflow-hidden border border-[#D4AF37]/20">
              <iframe
                title="Yaga Designs location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62788.37!2d76.59!3d10.06!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b07e3a1f2b8c8f7%3A0x2e5b8a3d2c2f9a1b!2sKothamangalam%2C%20Kerala!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
                width="100%"
                height="200"
                style={{ border: 0, filter: 'grayscale(1) invert(1) contrast(0.8)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <input
              name="name"
              required
              placeholder="Your Name"
              className="w-full bg-white/5 border border-white/10 px-6 py-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37] transition-all duration-500"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Your Email"
              className="w-full bg-white/5 border border-white/10 px-6 py-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37] transition-all duration-500"
            />
            <select
              name="eventType"
              required
              defaultValue=""
              className="w-full bg-white/5 border border-white/10 px-6 py-4 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-all duration-500"
            >
              <option value="" disabled className="bg-[#0B0B0B] text-white/30">Select Event Type</option>
              {eventTypes.map((t) => (
                <option key={t} value={t} className="bg-[#0B0B0B] text-white">{t}</option>
              ))}
            </select>
            <textarea
              name="message"
              required
              rows={4}
              placeholder="Tell us about your dream event..."
              className="w-full bg-white/5 border border-white/10 px-6 py-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37] transition-all duration-500 resize-none"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full group relative px-12 py-6 bg-[#D4AF37] text-[#0B0B0B] text-[10px] font-bold tracking-[0.5em] uppercase overflow-hidden transition-all duration-700 hover:shadow-[0_0_50px_rgba(212,175,55,0.3)] disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isSubmitting ? 'Transmitting...' : (
                  <>
                    {sent ? 'Consultation Requested' : 'Request Consultation'}
                    <Send className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
