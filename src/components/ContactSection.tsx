import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const eventTypes = [
  'Luxury Wedding',
  'Destination Wedding',
  'Corporate Event',
  'Private Celebration',
  'Engagement Party',
  'Anniversary',
  'Other',
];

export default function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = data.get('name') as string;
    const email = data.get('email') as string;
    const eventType = data.get('eventType') as string;
    const message = data.get('message') as string;

    const subject = encodeURIComponent(`New Enquiry from ${name} - ${eventType}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nEvent Type: ${eventType}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:luxevibeweddings@gmail.com?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setSending(false);
      setSent(true);
      form.reset();
      setTimeout(() => setSent(false), 3000);
    }, 1000);
  };

  return (
    <section id="contact" className="py-32 grain-overlay">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-xs tracking-[0.4em] uppercase mb-4">Get In Touch</p>
          <h2 className="font-heading text-3xl md:text-5xl">
            Contact <span className="text-gradient">Us</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="font-heading text-2xl mb-6">Let's Start Planning</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-10">
              Share your vision with us and we'll create something extraordinary together.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">luxevibeweddings@gmail.com</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">India & Worldwide</span>
              </div>
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-5"
          >
            <input
              name="name"
              required
              placeholder="Your Name"
              className="w-full bg-card border border-border px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Your Email"
              className="w-full bg-card border border-border px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <select
              name="eventType"
              required
              defaultValue=""
              className="w-full bg-card border border-border px-5 py-3.5 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
            >
              <option value="" disabled className="text-muted-foreground">Select Event Type</option>
              {eventTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <textarea
              name="message"
              required
              rows={4}
              placeholder="Tell us about your dream event..."
              className="w-full bg-card border border-border px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
            />
            <button
              type="submit"
              disabled={sending}
              className="w-full py-3.5 bg-primary text-primary-foreground text-xs tracking-widest uppercase hover:brightness-110 transition-all duration-300 disabled:opacity-50"
            >
              {sent ? '✓ Opening Email Client' : sending ? 'Sending...' : 'Send Enquiry'}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
