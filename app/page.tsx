import { CTASection, Footer } from "@/components/landing/CTAFooter";
import FeaturesSection from "@/components/landing/FeatureSection";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import Navbar from "@/components/landing/Navbar";
import TemplatesSection from "@/components/landing/TemplateSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TemplatesSection />
        <HowItWorks />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
