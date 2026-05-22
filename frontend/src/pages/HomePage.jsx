import { useState, useEffect } from "react";
import BannerCarousel from "../components/landing/BannerCarousel";
import DeliveryInfo from "../components/landing/DeliveryInfo";
import VideoSection from "../components/landing/VideoSection";
import WhyChooseUs from "../components/landing/WhyChooseUs";
import FAQ from "../components/landing/FAQ";
import Reviews from "../components/landing/Reviews";
import { productApi } from "../api/product";

const HomePage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // হোমপেজে ডিফল্ট একটি প্রোডাক্ট দেখাবো
    const fetchProduct = async () => {
      try {
        const response = await productApi.getBySlug("herbal-tea");
        setProduct(response.data.product);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <div>
      <BannerCarousel banners={product?.banners || []} />
      <DeliveryInfo features={product?.deliveryFeatures || []} />
      <WhyChooseUs features={product?.whyChooseUs || []} />
      <VideoSection video={product?.video || null} />
      <Reviews reviews={product?.reviews || []} />
      <FAQ faqs={product?.faqs || []} contactInfo={product?.contactInfo || {}} />
    </div>
  );
};

export default HomePage;