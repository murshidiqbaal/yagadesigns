import React from 'react';
import { Helmet } from 'react-helmet-async';

const LocalBusinessSchema: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "name": "Yaga Designs",
    "image": "https://yagadesigns.in/favicon.png",
    "@id": "https://yagadesigns.in/",
    "url": "https://yagadesigns.in/",
    "telephone": "+91 98765 43210", // Should be updated with real number if available
    "priceRange": "$$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Kothamangalam",
      "addressLocality": "Ernakulam",
      "addressRegion": "Kerala",
      "postalCode": "686691",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 10.0601,
      "longitude": 76.6267
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "10:00",
      "closes": "19:00"
    },
    "sameAs": [
      "https://www.instagram.com/yagadesigns",
      "https://www.facebook.com/yagadesigns"
    ],
    "areaServed": [
      "Kothamangalam",
      "Ernakulam",
      "Muvattupuzha",
      "Perumbavoor",
      "Aluva",
      "Thodupuzha",
      "Kottayam"
    ],
    "description": "Luxury Bridal Designer in Kothamangalam offering premium bridal lehengas, custom wedding dresses, and luxury bridal styling in Kerala."
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export default LocalBusinessSchema;
