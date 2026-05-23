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

  if (!product) return null;

  return (
    <div>
      <BannerCarousel 
        banners={product.banners || []} 
      />
      
      <DeliveryInfo 
        features={product.deliveryFeatures || []} 
      />
      
      <WhyChooseUs 
        features={product.whyChooseUs || []} 
        stats={product.whyChooseUsStats || []}
        heading={product.sectionHeadings?.whyChooseUs}
        orderBanner={product.orderBanner}
        buttonText={product.buttonText}
      />
      
      <VideoSection 
        video={product.video || null} 
        heading={product.sectionHeadings?.video}
        stats={product.videoStats}
        buttonText={product.buttonText}
      />
      
      <Reviews 
        reviews={product.reviews || []} 
        heading={product.sectionHeadings?.reviews}
        stats={product.reviewStats}
        buttonText={product.buttonText}
        productInfo={product.productInfo}
      />
      
      <FAQ 
        faqs={product.faqs || []} 
        contactInfo={product.contactInfo || {}}
        heading={product.sectionHeadings?.faq}
        contactHeading={product.contactHeading}
        buttonText={product.buttonText}
        productInfo={product.productInfo}
        supportHours={product.supportHours}
      />
    </div>
  );
};

export default HomePage;