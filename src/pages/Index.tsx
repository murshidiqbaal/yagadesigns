import CTASection from '@/components/CTASection';
import FeaturedCollections from '@/components/FeaturedCollections';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import HeroScrollAnimation from '@/components/HeroScrollAnimation';
import HeroSection from '@/components/HeroSection';
import MobileHeroSection from '@/components/MobileHeroSection';
import OffersPopup from '@/components/OffersPopup';
import SignatureDesigns from '@/components/SignatureDesigns';
import Testimonials from '@/components/Testimonials';
import { useEffect, useState } from 'react';
// import WhyChooseSection from '@/components/WhyChooseSection';\

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
      <OffersPopup />
      <Header />
      <main>
        {isMobile ? (
          /* ── Mobile: simple static hero, no canvas animation ── */
          <MobileHeroSection />
        ) : (
          /* ── Desktop: cinematic scroll-driven animation ── */
          <HeroScrollAnimation>
            <HeroSection />
          </HeroScrollAnimation>
        )}
        <FeaturedCollections />
        {/* <InstagramShowcaseSection /> */}
        <SignatureDesigns />
        {/* <WhyChooseSection /> */}
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
