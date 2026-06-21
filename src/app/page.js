import HomeBanner from "@/components/home/HomeBanner";
import FeaturedPrompts from "@/components/home/FeaturedPrompts";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import TopCreators from "@/components/home/TopCreators";
import CustomerReviews from "@/components/home/CustomerReviews";
import HowItWorks from "@/components/home/HowItWorks";
import PromptCategories from "@/components/home/PromptCategories";

export default function Home() {
  return (
    <>
      <HomeBanner />
      <FeaturedPrompts />
      <WhyChooseUs />
      <TopCreators />
      <CustomerReviews />
      <HowItWorks />
      <PromptCategories />
    </>
  );
}
