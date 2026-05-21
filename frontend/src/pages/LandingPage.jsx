import BannerCarousel from "../components/landing/BannerCarousel";
import DeliveryInfo from "../components/landing/DeliveryInfo";
import VideoSection from "../components/landing/VideoSection";
import WhyChooseUs from "../components/landing/WhyChooseUs";
import FAQ from "../components/landing/FAQ";
import Reviews from "../components/landing/Reviews";

const LandingPage = () => {
  return (
    <div>
      {/* Banner Carousel */}
      <BannerCarousel />

      {/* Delivery Info Section */}
      <DeliveryInfo />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Video Section */}
      <VideoSection />

      {/* Reviews Section */}
      <Reviews />

      {/* FAQ Section */}
      <FAQ />
    </div>
  );
};

export default LandingPage;