
import { useLocation } from "react-router-dom";
import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  const { pathname } = useLocation();

  // Hide in Admin views
  if (pathname?.startsWith("/admin")) return null;

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "919999999999";
  const defaultText = "Hello Yaga Designs, I would like to know more about your collection.";
  const href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultText)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 p-3 md:p-4 bg-green-500 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 md:animate-bounce grain-overlay flex items-center justify-center"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 md:w-8 md:h-8" />
    </a>
  );
}

