import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "Yaga Designs | Luxury Bridal Designer in Kothamangalam",
  description = "Yaga Designs offers premium bridal lehengas, custom wedding dresses, and luxury bridal styling in Kothamangalam & Ernakulam. Enquire on WhatsApp.",
  keywords = "bridal designer Kothamangalam, bridal boutique Ernakulam, wedding lehenga Kerala, custom bridal wear India",
  canonical = "https://yagadesigns.in",
  ogTitle,
  ogDescription,
  ogImage = "/favicon.png",
  ogType = "website",
  twitterCard = "summary_large_image",
  twitterTitle,
  twitterDescription,
  twitterImage,
}) => {
  const siteTitle = title;
  const siteDescription = description;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />

      {/* OpenGraph Meta Tags */}
      <meta property="og:title" content={ogTitle || siteTitle} />
      <meta property="og:description" content={ogDescription || siteDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Yaga Designs" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={twitterTitle || ogTitle || siteTitle} />
      <meta name="twitter:description" content={twitterDescription || ogDescription || siteDescription} />
      <meta name="twitter:image" content={twitterImage || ogImage} />

      {/* Geo Tags for Local SEO */}
      <meta name="geo.region" content="IN-KL" />
      <meta name="geo.placename" content="Kothamangalam, Ernakulam" />
    </Helmet>
  );
};

export default SEO;
