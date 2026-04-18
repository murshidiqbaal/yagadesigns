import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeaturedCollections from '@/components/FeaturedCollections';
import SignatureDesigns from '@/components/SignatureDesigns';
import WhyChooseSection from '@/components/WhyChooseSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

export default function Index() {
  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />
      <main>
        <HeroSection />
        <FeaturedCollections />
        <SignatureDesigns />
        <WhyChooseSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
