import BannerCarousel from "../components/landing/BannerCarousel";
import DeliveryInfo from "../components/landing/DeliveryInfo";
import VideoSection from "../components/landing/VideoSection";
import WhyChooseUs from "../components/landing/WhyChooseUs";
import FAQ from "../components/landing/FAQ";
import Reviews from "../components/landing/Reviews";

const LandingPage = () => {
  return (
    <div>
      <BannerCarousel />
      <DeliveryInfo />
      <WhyChooseUs />
      <VideoSection />
      <Reviews />
      <FAQ />
    </div>
  );
};

export default LandingPage;