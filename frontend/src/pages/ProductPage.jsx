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
  const { slug } = useParams(); // URL থেকে slug নিবে
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-500">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <BannerCarousel banners={product.banners || []} />
      <DeliveryInfo features={product.deliveryFeatures || []} />
      <WhyChooseUs features={product.whyChooseUs || []} />
      <VideoSection video={product.video || null} />
      <Reviews />
      {/* <Reviews reviews={product.reviews || []} /> */}
      <FAQ faqs={product.faqs || []} contactInfo={product.contactInfo || {}} />
    </div>
  );
};

export default ProductPage;