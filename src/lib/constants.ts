export const SITE_NAME = 'Yaga Designs';

// ✅ Update this with the real WhatsApp number (country code + number, no spaces or +)
export const WHATSAPP_NUMBER = '919633270639';

export const CATEGORIES = ['All', 'Bridal', 'Engagement', 'Reception', 'Party Wear'] as const;
export type Category = typeof CATEGORIES[number];

export function getWhatsAppUrl(productName?: string): string {
  const message = productName
    ? `Hello Yaga Designs, I am interested in ${productName}`
    : `Hello Yaga Designs, I would like to enquire about your bridal collection.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
