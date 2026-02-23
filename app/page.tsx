import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import FeaturedProducts from "@/components/FeaturedProducts";
import TrustBar from "@/components/TrustBar";
import PromoBanner from "@/components/PromoBanner";
import ScrollToFeatured from "@/components/ScrollToFeatured"

export default function Home() {
  return (
    <>
      <ScrollToFeatured />
      <Hero />
      <FeaturedProducts />
      <TrustBar />
      <PromoBanner />
    </>
  );
}
