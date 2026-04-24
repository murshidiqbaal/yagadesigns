import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import HeroScrollAnimation from '@/components/HeroScrollAnimation';
import FeaturedCollections from '@/components/FeaturedCollections';
import SignatureDesigns from '@/components/SignatureDesigns';
import WhyChooseSection from '@/components/WhyChooseSection';
import Testimonials from '@/components/Testimonials';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import OffersPopup from '@/components/OffersPopup';

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
