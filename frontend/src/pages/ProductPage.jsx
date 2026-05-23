import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BannerCarousel from "../components/landing/BannerCarousel";
import DeliveryInfo from "../components/landing/DeliveryInfo";
import VideoSection from "../components/landing/VideoSection";
import WhyChooseUs from "../components/landing/WhyChooseUs";
import FAQ from "../components/landing/FAQ";
import Reviews from "../components/landing/Reviews";
import { productApi } from "../api/product";

const ProductPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await productApi.getBySlug(slug);
        setProduct(response.data.product);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-500">
            The product you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <BannerCarousel
        banners={product.banners || []}
        config={product.bannerConfig || {}}
        buttonTexts={product.buttonTexts || {}} // ← এই লাইন যোগ করো
      />

      <DeliveryInfo features={product.deliveryFeatures || []} />

      <WhyChooseUs
        features={product.whyChooseUs || []}
        stats={product.whyChooseUsStats || []}
        heading={product.sectionHeadings?.whyChooseUs} // ← এই লাইন
        orderBanner={product.orderBanner}
        buttonTexts={product.buttonTexts || {}}
        currentProduct={product}
      />

      <VideoSection
        video={product.video || null}
        heading={product.sectionHeadings?.video}
        stats={product.videoStats}
        buttonTexts={product.buttonTexts || {}} // ← এই লাইন
        currentProduct={product}
      />

      <Reviews
        reviews={product.reviews || []}
        heading={product.sectionHeadings?.reviews}
        stats={product.reviewStats}
        buttonTexts={product.buttonTexts || {}}
        currentProduct={product} // ← যোগ করো
      />

      <FAQ
        faqs={product.faqs || []}
        contactInfo={product.contactInfo || {}}
        heading={product.sectionHeadings?.faq}
        contactHeading={product.contactHeading}
        buttonTexts={product.buttonTexts || {}}
        currentProduct={product} // ← যোগ করো
        supportHours={product.supportHours}
      />
    </div>
  );
};

export default ProductPage;
