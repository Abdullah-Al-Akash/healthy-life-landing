import { 
  FaLeaf, 
  FaTruck, 
  FaShieldAlt, 
  FaSmile, 
  FaHeadset, 
  FaCertificate 
} from "react-icons/fa";
import { useState } from "react";
import CheckoutDrawer from "./CheckoutDrawer";

const WhyChooseUs = ({ features = [], stats = [] }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ডিফল্ট ফিচার (যদি API থেকে না আসে)
  const defaultFeatures = [
    {
      id: 1,
      icon: "FaLeaf",
      title: "১০০% খাঁটি পণ্য",
      description: "প্রাকৃতিক উপাদানে তৈরি, কোনো কেমিক্যাল বা প্রিজারভেটিভ নেই",
    },
    {
      id: 2,
      icon: "FaTruck",
      title: "দ্রুত ডেলিভারি",
      description: "সারাদেশে ২৪-৪৮ ঘণ্টার মধ্যে পণ্য পৌঁছে দিন",
    },
    {
      id: 3,
      icon: "FaShieldAlt",
      title: "নিরাপদ পেমেন্ট",
      description: "ক্যাশ অন ডেলিভারি ও অনলাইন পেমেন্ট সুবিধা",
    },
    {
      id: 4,
      icon: "FaSmile",
      title: "গ্রাহক সন্তুষ্টি",
      description: "৯৮% গ্রাহক আমাদের পণ্য ও সেবায় সন্তুষ্ট",
    },
    {
      id: 5,
      icon: "FaHeadset",
      title: "২৪/৭ সাপোর্ট",
      description: "যেকোনো সমস্যায় আমাদের টিম আপনার পাশে",
    },
    {
      id: 6,
      icon: "FaCertificate",
      title: "সনদপ্রাপ্ত পণ্য",
      description: "গুণগত মানের সার্টিফিকেট প্রাপ্ত ও অনুমোদিত",
    },
  ];

  // ডিফল্ট পরিসংখ্যান
  const defaultStats = [
    { number: "১০,০০০+", label: "খুশি গ্রাহক" },
    { number: "৯৮%", label: "সন্তুষ্টি হার" },
    { number: "২৪/৭", label: "সাপোর্ট" },
    { number: "৫০+", label: "পণ্যলাইন" },
  ];

  const displayFeatures = features.length > 0 ? features : defaultFeatures;
  const displayStats = stats.length > 0 ? stats : defaultStats;

  // আইকন ম্যাপিং
  const getIcon = (iconName) => {
    const icons = {
      FaLeaf: <FaLeaf className="w-6 h-6 md:w-7 md:h-7" />,
      FaTruck: <FaTruck className="w-6 h-6 md:w-7 md:h-7" />,
      FaShieldAlt: <FaShieldAlt className="w-6 h-6 md:w-7 md:h-7" />,
      FaSmile: <FaSmile className="w-6 h-6 md:w-7 md:h-7" />,
      FaHeadset: <FaHeadset className="w-6 h-6 md:w-7 md:h-7" />,
      FaCertificate: <FaCertificate className="w-6 h-6 md:w-7 md:h-7" />,
    };
    return icons[iconName] || <FaLeaf className="w-6 h-6 md:w-7 md:h-7" />;
  };

  const handleOrderClick = () => {
    setSelectedProduct({
      id: "featured-product",
      title: "হারবাল পণ্য প্যাকেজ",
      offerPrice: "৯৯৯",
      image: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=1200",
    });
    setIsDrawerOpen(true);
  };

  return (
    <>
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* সেকশন টাইটেল */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              কেন বেছে নেবেন <span className="text-rose-500">আমাদের?</span>
            </h2>
            <div className="w-24 h-1 bg-rose-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
              আমরা চাই আপনাকে সেরা সেবা ও মানসম্মত পণ্য দিতে। জেনে নিন কেন আমরা সবার প্রথম পছন্দ।
            </p>
          </div>

          {/* ফিচার গ্রিড */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {displayFeatures.map((feature, index) => (
              <div
                key={feature.id || index}
                className="group bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* আইকন */}
                <div className="w-14 h-14 md:w-16 md:h-16 bg-rose-50 rounded-xl flex items-center justify-center mb-5 text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300">
                  {typeof feature.icon === 'string' ? getIcon(feature.icon) : feature.icon}
                </div>
                
                {/* টাইটেল */}
                <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                
                {/* বিবরণ */}
                <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* অর্ডার ব্যানার */}
          <div className="mt-16 bg-gradient-to-r from-rose-500 to-rose-600 rounded-2xl p-8 md:p-10 text-center text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">
              আজই অর্ডার করুন ও পান বিশেষ ছাড়!
            </h3>
            <p className="text-rose-100 mb-6 max-w-2xl mx-auto">
              সীমিত সময়ের অফার। দেরি না করে এখনই অর্ডার করুন।
            </p>
            <button
              onClick={handleOrderClick}
              className="bg-white text-rose-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
            >
              এখনই অর্ডার করুন →
            </button>
          </div>

          {/* পরিসংখ্যান */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {displayStats.map((stat, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl md:text-3xl font-bold text-rose-500">{stat.number}</div>
                <div className="text-gray-600 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CheckoutDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        product={selectedProduct}
      />
    </>
  );
};

export default WhyChooseUs;