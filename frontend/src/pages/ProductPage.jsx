import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
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
      <div className="min-h-screen flex items-center justify-center bg-rose-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-6">The product you're looking for doesn't exist.</p>
          <a
            href="/"
            className="inline-block px-6 py-2 bg-rose-500 text-white rounded-full font-medium hover:bg-rose-600 transition"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-rose-50"
    >
      <BannerCarousel
        banners={product.banners || []}
        config={product.bannerConfig || {}}
        buttonTexts={product.buttonTexts || {}}
      />

      <WhyChooseUs
        features={product.whyChooseUs || []}
        stats={product.whyChooseUsStats || []}
        heading={product.sectionHeadings?.whyChooseUs}
        orderBanner={product.orderBanner}
        buttonTexts={product.buttonTexts || {}}
        currentProduct={product}
      />

      <VideoSection
        video={product.video || null}
        heading={product.sectionHeadings?.video}
        stats={product.videoStats}
        buttonTexts={product.buttonTexts || {}}
        currentProduct={product}
      />

      <Reviews
        reviews={product.reviews || []}
        heading={product.sectionHeadings?.reviews}
        stats={product.reviewStats}
        buttonTexts={product.buttonTexts || {}}
        currentProduct={product}
      />
<DeliveryInfo features={product.deliveryFeatures || []} />
      <FAQ
        faqs={product.faqs || []}
        contactInfo={product.contactInfo || {}}
        heading={product.sectionHeadings?.faq}
        contactHeading={product.contactHeading}
        buttonTexts={product.buttonTexts || {}}
        currentProduct={product}
        supportHours={product.supportHours}
      />
    </motion.div>
  );
};

export default ProductPage;