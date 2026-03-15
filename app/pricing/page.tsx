import PricingSection from "@/components/landing/PricingSection";
import Navbar from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/CTAFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — ResumeVerse",
  description:
    "Simple, honest pricing. Start free, upgrade when you need the full AI toolkit.",
};

export default function PricingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--rv-paper)" }}>
      <Navbar />
      <div style={{ paddingTop: "80px" }}>
        <PricingSection />
      </div>
      <Footer />
    </div>
  );
}
