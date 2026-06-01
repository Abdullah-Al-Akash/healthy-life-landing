import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaLeaf, FaArrowRight, FaBox, FaStar, FaEye, FaTruck, FaHeadset, FaLeaf as FaLeafIcon } from "react-icons/fa";
import { Link } from "react-router-dom";
import { productApi } from "../api/product";
import logo from "../assets/logo.png";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await productApi.getAll();
      setProducts(res.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-rose-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-rose-100 via-white to-rose-50"
    >
      {/* হিরো সেকশন */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 overflow-hidden">
        {/* ডেকোরেটিভ ব্যাকগ্রাউন্ড - রেস্পন্সিভ */}
        <div className="absolute top-20 left-10 w-48 h-48 md:w-72 md:h-72 bg-rose-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 md:w-96 md:h-96 bg-rose-200 rounded-full opacity-20 blur-3xl"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* লোগো/আইকন */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="w-20 h-20 md:w-28 md:h-28 bg-gradient-to-r from-rose-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
          >
            <img src={logo} alt="logo" />
          </motion.div>

          {/* ব্যাজ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-block mb-4"
          >
            <span className="px-3 py-1 md:px-4 md:py-1.5 bg-rose-100 text-rose-600 rounded-full text-xs md:text-sm font-medium">
              🌿 প্রাকৃতিক ও জৈব
            </span>
          </motion.div>

          {/* হেডিং */}
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl md:text-5xl lg:text-7xl font-bold text-gray-800 mb-4 leading-tight"
          >
            Welcome to{" "}
            <span className="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">
              Healthy Life
            </span>
          </motion.h1>

          {/* সাবটাইটেল */}
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-base md:text-lg lg:text-xl text-gray-600 mb-8 max-w-2xl mx-auto px-4"
          >
            প্রকৃতির সেরা উপহার, আপনার সুস্থতার ঠিকানা। 
            ১০০% খাঁটি ও জৈব পণ্যের বিশ্বস্ত ঠিকানা।
          </motion.p>

          {/* বাটন গ্রুপ */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-wrap gap-3 md:gap-4 justify-center"
          >
            <a
              href="#products"
              className="inline-flex items-center gap-2 px-5 py-2.5 md:px-8 md:py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full text-sm md:text-base font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Shop Now <FaArrowRight className="text-xs md:text-sm" />
            </a>
            <a
              href="https://wa.me/8801xxxxxxxxx"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 md:px-8 md:py-3 bg-white text-gray-700 rounded-full text-sm md:text-base font-medium shadow-md hover:shadow-lg transition-all hover:scale-105 border border-gray-200"
            >
              Contact Us
            </a>
          </motion.div>

          {/* ফিচার - রেস্পন্সিভ গ্রিড */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-12 md:mt-16 pt-6 md:pt-8 border-t border-gray-200"
          >
            {[
              { value: "১০০%", label: "খাঁটি ও জৈব", icon: <FaLeafIcon className="text-rose-500 text-base md:text-xl" /> },
              { value: "২৪/৭", label: "সাপোর্ট", icon: <FaHeadset className="text-rose-500 text-base md:text-xl" /> },
              { value: "ফ্রি", label: "হোম ডেলিভারি", icon: <FaTruck className="text-rose-500 text-base md:text-xl" /> },
              { value: "১০K+", label: "খুশি গ্রাহক", icon: <FaStar className="text-rose-500 text-base md:text-xl" /> },
            ].map((item, idx) => (
              <div key={idx} className="text-center p-2 md:p-3 rounded-xl bg-white/50 backdrop-blur-sm">
                <div className="flex justify-center mb-1 md:mb-2">{item.icon}</div>
                <p className="text-lg md:text-2xl font-bold text-rose-500">{item.value}</p>
                <p className="text-xs md:text-sm text-gray-500">{item.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* প্রোডাক্ট গ্রিড সেকশন - রেস্পন্সিভ */}
      <section id="products" className="py-16 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 md:mb-4">
              আমাদের <span className="text-rose-500">পণ্য সমূহ</span>
            </h2>
            <div className="w-16 md:w-24 h-1 bg-rose-500 mx-auto mb-4 md:mb-6 rounded-full"></div>
            <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto px-4">
              প্রকৃতির সেরা উপহার হাতে নিন, সুস্থ থাকুন প্রাকৃতিক উপায়ে
            </p>
          </div>

          {/* রেস্পন্সিভ গ্রিড: মোবাইলে 2, ট্যাবলেটে 2, ডেস্কটপে 3, বড় ডেস্কটপে 4 */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5 lg:gap-6">
            {products.map((product, index) => {
              const firstBanner = product.banners?.[0] || {};
              const avgRating = product.reviews?.length 
                ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
                : null;
              
              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 md:hover:-translate-y-2"
                >
                  {/* ইমেজ - রেস্পন্সিভ উচ্চতা */}
                  <Link to={`/product/${product.slug}`} className="block relative h-40 sm:h-48 md:h-56 lg:h-64 overflow-hidden bg-gradient-to-br from-rose-100 to-pink-100">
                    {firstBanner.image ? (
                      <img
                        src={firstBanner.image}
                        alt={product.navTitle}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaBox className="text-rose-300 text-3xl md:text-5xl" />
                      </div>
                    )}
                    {firstBanner.discount && (
                      <span className="absolute top-2 right-2 md:top-4 md:right-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] md:text-xs font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full shadow-md">
                        {firstBanner.discount}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-2 left-2 right-2 md:bottom-4 md:left-4 md:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="inline-flex items-center gap-1 text-white text-[10px] md:text-sm font-medium bg-black/50 backdrop-blur-sm px-2 py-0.5 md:px-3 md:py-1 rounded-full">
                        <FaEye className="text-xs" /> Quick View
                      </span>
                    </div>
                  </Link>

                  {/* কন্টেন্ট */}
                  <div className="p-3 md:p-4 lg:p-5">
                    <Link to={`/product/${product.slug}`}>
                      <h3 className="text-sm md:text-base lg:text-lg font-bold text-gray-800 mb-1 group-hover:text-rose-500 transition line-clamp-1">
                        {product.navTitle}
                      </h3>
                    </Link>
                    
                    {firstBanner.subtitle && (
                      <p className="text-gray-500 text-xs md:text-sm mb-2 line-clamp-1 md:line-clamp-2">
                        {firstBanner.subtitle}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2 md:mt-3">
                      <div className="flex items-baseline gap-1 md:gap-2">
                        <span className="text-base md:text-xl lg:text-2xl font-bold text-rose-500">
                          ৳{firstBanner.offerPrice}
                        </span>
                        {firstBanner.originalPrice && (
                          <span className="text-[10px] md:text-xs text-gray-400 line-through">
                            ৳{firstBanner.originalPrice}
                          </span>
                        )}
                      </div>
                      <Link
                        to={`/product/${product.slug}`}
                        className="inline-flex items-center gap-1 px-2 py-1 md:px-3 md:py-1.5 bg-rose-50 text-rose-500 rounded-full text-[10px] md:text-xs font-medium hover:bg-rose-500 hover:text-white transition-all duration-300"
                      >
                        Buy Now
                      </Link>
                    </div>

                    {/* রেটিং */}
                    {avgRating && (
                      <div className="flex items-center gap-1 mt-2 md:mt-3 pt-2 md:pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`w-2 h-2 md:w-3 md:h-3 ${i < Math.floor(avgRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] md:text-xs font-medium text-gray-700 ml-1">{avgRating}</span>
                        <span className="text-[8px] md:text-[10px] text-gray-400 ml-0.5">({product.reviews?.length || 0})</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ভিউ অল বাটন */}
          {products.length > 4 && (
            <div className="text-center mt-8 md:mt-12">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 md:px-8 md:py-3 border-2 border-rose-500 text-rose-500 rounded-full text-sm md:text-base font-medium hover:bg-rose-500 hover:text-white transition-all duration-300"
              >
                View All Products <FaArrowRight className="text-xs md:text-sm" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* নিউজলেটার সেকশন - রেস্পন্সিভ */}
      <section className="py-12 md:py-16 px-4 bg-gradient-to-r from-rose-500 to-pink-500">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 md:mb-3">
            Stay Updated with Our Offers
          </h3>
          <p className="text-rose-100 text-sm md:text-base mb-4 md:mb-6 px-4">
            Get the latest updates on new products and exclusive offers
          </p>
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-3 md:px-4 py-2 md:py-3 rounded-full text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-5 md:px-6 py-2 md:py-3 bg-white text-rose-500 rounded-full text-sm md:text-base font-semibold hover:bg-gray-100 transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default HomePage;