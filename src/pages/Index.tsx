import CTASection from '@/components/CTASection';
import FeaturedCollections from '@/components/FeaturedCollections';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import HeroScrollAnimation from '@/components/HeroScrollAnimation';
import HeroSection from '@/components/HeroSection';
import MobileCTASection from '@/components/MobileCTASection';
import MobileFeaturedCollections from '@/components/MobileFeaturedCollections';
import MobileHeroSection from '@/components/MobileHeroSection';
import MobileSignatureDesigns from '@/components/MobileSignatureDesigns';
import MobileTestimonials from '@/components/MobileTestimonials';
import OffersPopup from '@/components/OffersPopup';
import SignatureDesigns from '@/components/SignatureDesigns';
import Testimonials from '@/components/Testimonials';
import SEO from '@/components/SEO';
import LocalBusinessSchema from '@/components/LocalBusinessSchema';
import { useEffect, useState } from 'react';

/** Returns true when the viewport is narrower than 768px (mobile). */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
}

export default function Index() {
  const isMobile = useIsMobile();

  return (
    <div className="site-shell min-h-screen">
      <SEO 
        title="Luxury Bridal Designer in Kothamangalam | Yaga Designs"
        description="Yaga Designs offers premium bridal lehengas, custom wedding dresses, and luxury bridal styling in Kothamangalam & Ernakulam. Enquire on WhatsApp."
        keywords="bridal designer Kothamangalam, bridal boutique Ernakulam, wedding lehenga Kerala, custom bridal wear India"
      />
      <LocalBusinessSchema />
      <OffersPopup />
      <Header />
      <main>
        {isMobile ? (
          <>
            {/* ── Mobile layout ──────────────────────────── */}
            <MobileHeroSection />
            <MobileFeaturedCollections />
            <MobileSignatureDesigns />
            <MobileTestimonials />
            <MobileCTASection />
          </>
        ) : (
          <>
            {/* ── Desktop layout ─────────────────────────── */}
            <HeroScrollAnimation>
              <HeroSection />
            </HeroScrollAnimation>
            <FeaturedCollections />
            <SignatureDesigns />
            <Testimonials />
            <CTASection />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
