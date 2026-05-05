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
        title="Yaga Designs | Best Bridal Designer in Kothamangalam & Ernakulam"
        description="Looking for the best bridal designer in Kothamangalam or bridal lehenga in Kothamangalam? Yaga Designs offers custom wedding dresses, nighty wholesale in Ernakulam, and bridal blouse stitching near me."
        keywords="bridal designer in Kothamangalam, bridal boutique Ernakulam, custom bridal dress Kothamangalam, affordable bridal boutique near me, nighty wholesale shop Ernakulam, best lehenga shop near Kottayam, where to buy bridal lehenga in Kerala, who makes wedding dresses in Kothamangalam"
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
