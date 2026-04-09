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
            <h3 className="font-heading text-2xl mb-6">Plan Your Dream Wedding in Kothamangalam</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-10">
              Share your vision with us and we'll create something extraordinary together.
              We serve Kothamangalam, Ernakulam, and all of Kerala.
            </p>

            <address className="space-y-6 not-italic">
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-primary" aria-hidden="true" />
                <a href="mailto:luxevibeweddings@gmail.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">luxevibeweddings@gmail.com</a>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-primary" aria-hidden="true" />
                <a href="tel:+919876543210" className="text-sm text-muted-foreground hover:text-primary transition-colors">+91 98765 43210</a>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="w-5 h-5 text-primary" aria-hidden="true" />
                <span className="text-sm text-muted-foreground">Kothamangalam, Ernakulam, Kerala, India</span>
              </div>
            </address>

            <div className="mt-8 overflow-hidden border border-border">
              <iframe
                title="Luxevibes location in Kothamangalam, Ernakulam"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62788.37!2d76.59!3d10.06!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b07e3a1f2b8c8f7%3A0x2e5b8a3d2c2f9a1b!2sKothamangalam%2C%20Kerala!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
                width="100%"
                height="200"
                style={{ border: 0 }}
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
