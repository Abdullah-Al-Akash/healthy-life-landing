import { useState } from "react";
import { FiPlay, FiX, FiShoppingCart } from "react-icons/fi";
import CheckoutDrawer from "./CheckoutDrawer";

const VideoSection = ({ 
  video = null, 
  heading = {}, 
  buttonText = "এখনই অর্ডার করুন",
  stats = {} 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // ডিফল্ট হেডিং
  const defaultHeading = {
    badge: "ভিডিও টিউটোরিয়াল",
    title: "পণ্য সম্পর্কে বিস্তারিত জানুন",
    highlightText: "বিস্তারিত জানুন",
    subtitle: "আমাদের পণ্য如何使用, এর উপকারিতা এবং ব্যবহার পদ্ধতি সম্পর্কে ভিডিওতে দেখুন"
  };

  // ডিফল্ট স্ট্যাটাস
  const defaultStats = {
    duration: "২:৩০ মিনিট",
    views: "১০K+ ভিউ",
    likes: "৯৫% পছন্দ করেছেন"
  };

  const { badge, title, highlightText, subtitle } = heading || defaultHeading;
  const { duration, views, likes } = stats || defaultStats;

  // ডিফল্ট ভিডিও ডাটা (যদি API থেকে না আসে)
  const defaultVideo = {
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    videoId: "dQw4w9WgXcQ",
    title: "আমাদের পণ্য সম্পর্কে জানুন",
    description: "কিভাবে আমাদের হারবাল পণ্য আপনার জীবনযাত্রায় পরিবর্তন আনতে পারে তা দেখুন",
  };

  const currentVideo = video || defaultVideo;

  // প্রোডাক্ট ডাটা (ভিডিও সেকশনের জন্য)
  const product = {
    id: "video-product",
    title: currentVideo.title || "ভিডিওতে দেখা পণ্য",
    offerPrice: "২৯৯",
    originalPrice: "৪৯৯",
    image: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=1200",
  };

  // হাইলাইট টেক্সট সহ টাইটেল রেন্ডার
  const renderTitle = () => {
    if (!highlightText) {
      return <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{title}</h2>;
    }
    
    const parts = title.split(highlightText);
    return (
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
        {parts[0]}
        <span className="text-rose-500">{highlightText}</span>
        {parts[1]}
      </h2>
    );
  };

  return (
    <>
      <section className="section bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* সেকশন হেডার - ডাইনামিক */}
          <div className="text-center mb-12 md:mb-16">
            {badge && (
              <span className="inline-block px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-sm font-semibold mb-4">
                {badge}
              </span>
            )}
            {renderTitle()}
            <div className="w-24 h-1 bg-rose-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>

          {/* ভিডিও কার্ড */}
          <div className="max-w-4xl mx-auto">
            <div className="relative group rounded-2xl overflow-hidden shadow-2xl">
              {/* থাম্বনেইল */}
              <div
                className="relative aspect-video bg-cover bg-center cursor-pointer"
                style={{ backgroundImage: `url(${currentVideo.thumbnail})` }}
                onClick={() => setShowModal(true)}
              >
                {/* ওভারলে */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                  {/* প্লে বাটন */}
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-rose-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <FiPlay size={28} className="text-white ml-1" />
                  </div>
                </div>

                {/* ভিডিও তথ্য */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 md:p-6">
                  <h3 className="text-white text-lg md:text-xl font-bold mb-1">
                    {currentVideo.title}
                  </h3>
                  <p className="text-white/80 text-xs md:text-sm">
                    {currentVideo.description}
                  </p>
                </div>
              </div>
            </div>

            {/* ভিডিওর নিচের তথ্য */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 text-sm md:text-base">
                {subtitle || defaultHeading.subtitle}
              </p>
              
              {/* ভিউ ও স্ট্যাটাস - ডাইনামিক */}
              <div className="flex flex-wrap justify-center gap-4 mt-4 mb-8">
                {duration && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>⏱️ {duration}</span>
                  </div>
                )}
                {views && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>👁️ {views}</span>
                  </div>
                )}
                {likes && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>👍 {likes}</span>
                  </div>
                )}
              </div>

              {/* নাচুয়ে অর্ডার বাটন - ডাইনামিক টেক্সট */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-full font-bold text-sm md:text-base shadow-lg hover:shadow-rose-500/50 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto"
                style={{
                  animation: "wiggle 0.8s ease-in-out infinite",
                }}
              >
                <FiShoppingCart className="text-base md:text-lg" />
                <span>{buttonText} - ৳{product.offerPrice}</span>
                <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* মোডাল পপআপ - ভিডিও দেখানোর জন্য */}
        {showModal && (
          <div
            className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <div
              className="relative bg-white rounded-2xl max-w-4xl w-full overflow-hidden animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="font-semibold text-gray-800">
                  {currentVideo.title}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition"
                >
                  <FiX size={20} />
                </button>
              </div>
              <div className="aspect-video">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${currentVideo.videoId}?autoplay=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}
      </section>

      <CheckoutDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        product={product}
      />

      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-5px) scale(1.02); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn { animation: scaleIn 0.2s ease-out; }
      `}</style>
    </>
  );
};

export default VideoSection;