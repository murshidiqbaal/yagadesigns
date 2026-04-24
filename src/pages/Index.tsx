import CTASection from '@/components/CTASection';
import FeaturedCollections from '@/components/FeaturedCollections';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import HeroScrollAnimation from '@/components/HeroScrollAnimation';
import HeroSection from '@/components/HeroSection';
import OffersPopup from '@/components/OffersPopup';
import SignatureDesigns from '@/components/SignatureDesigns';
import Testimonials from '@/components/Testimonials';
import WhyChooseSection from '@/components/WhyChooseSection';

export default function Index() {
  return (
    <div className="min-h-screen bg-[#050505]">
      <OffersPopup />
      <Header />
      <main>
        <HeroScrollAnimation>
          <HeroSection />
        </HeroScrollAnimation>
        <FeaturedCollections />
        <SignatureDesigns />
        <WhyChooseSection />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
