import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { FiChevronLeft, FiChevronRight, FiShoppingCart } from "react-icons/fi";
import { useState } from "react";
import CheckoutDrawer from "./CheckoutDrawer";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const BannerCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const banners = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=1200",
      title: "প্রাকৃতিক হারবাল চা",
      subtitle: "সুস্থ থাকুন প্রকৃতির ছোঁয়ায়",
      offerPrice: "২৯৯",
      originalPrice: "৪৯৯",
      discount: "৪০% ছাড়",
      description: "প্রাকৃতিক উপাদানে তৈরি হারবাল চা। কোনো প্রিজারভেটিভ মুক্ত, ১০০% খাঁটি ও জৈব।",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=1200",
      title: "গ্রিন কফি এক্সট্রাক্ট",
      subtitle: "ওজন নিয়ন্ত্রণে কার্যকরী সমাধান",
      offerPrice: "৩৯৯",
      originalPrice: "৬৯৯",
      discount: "৪৩% ছাড়",
      description: "প্রাকৃতিক গ্রিন কফি এক্সট্রাক্ট যা মেটাবলিজম বাড়াতে সহায়তা করে।",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1615485500814-4f3c9f5b8b6b?w=1200",
      title: "অ্যালোভেরা জেল",
      subtitle: "ত্বকের যত্নে প্রাকৃতিক উপাদান",
      offerPrice: "৪৯৯",
      originalPrice: "৭৯৯",
      discount: "৩৮% ছাড়",
      description: "ত্বকের আর্দ্রতা বজায় রাখতে এবং ত্বকের সমস্যা দূর করতে অ্যালোভেরা জেল।",
    },
  ];

  const currentBanner = banners[activeIndex];

  const handleOrderClick = () => {
    setSelectedProduct({
      title: currentBanner.title,
      price: currentBanner.offerPrice,
    });
    setIsDrawerOpen(true);
  };

  return (
    <div className="mb-12">
      {/* ইমেজ ক্যারোজেল */}
      <div className="relative">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet !bg-neutral-400 !w-2 !h-2 md:!w-3 md:!h-3",
            bulletActiveClass: "!bg-rose-500 !w-4 md:!w-6",
          }}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          loop={true}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden"
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${banner.image})` }}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* নেভিগেশন বাটন */}
        <button className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-lg">
          <FiChevronLeft size={20} />
        </button>
        <button className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-lg">
          <FiChevronRight size={20} />
        </button>
      </div>

      {/* কন্টেন্ট */}
      <div className="container-custom mt-8 text-center max-w-3xl mx-auto">
        {/* ডিসকাউন্ট ব্যাজ */}
        <span className="inline-block bg-rose-500 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4 animate-pulse">
          {currentBanner.discount}
        </span>

        {/* টাইটেল */}
        <h1 className="text-3xl md:text-5xl font-bold text-neutral-800 mb-4">
          {currentBanner.title}
        </h1>

        {/* সাবটাইটেল */}
        <p className="text-lg text-neutral-600 mb-4">{currentBanner.subtitle}</p>

        {/* বিবরণ */}
        <p className="text-neutral-500 mb-6">{currentBanner.description}</p>

        {/* প্রাইস */}
        <div className="flex justify-center gap-3 mb-8">
          <span className="text-3xl font-bold text-rose-500">৳{currentBanner.offerPrice}</span>
          <span className="text-lg line-through text-neutral-400">৳{currentBanner.originalPrice}</span>
        </div>

        {/* 🎯 নাচুয়ে অর্ডার বাটন */}
        <button
          onClick={handleOrderClick}
          className="group relative bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
          style={{
            animation: "wiggle 0.8s ease-in-out infinite",
          }}
        >
          {/* শাইন ইফেক্ট */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

          <span className="relative flex items-center gap-2">
            <FiShoppingCart className="text-xl" />
            এখনই অর্ডার করুন - {currentBanner.offerPrice} টাকায়
            <svg className="w-5 h-5 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </button>

        {/* অফার টাইমার */}
        <div className="mt-6 inline-flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full border border-amber-200 text-sm">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute h-full w-full rounded-full bg-red-400"></span>
            <span className="relative h-3 w-3 rounded-full bg-red-500"></span>
          </span>
          <span className="text-amber-700">সীমিত সময়ের অফার! আজই অর্ডার করুন</span>
          <span className="text-red-500 animate-pulse">🔥</span>
        </div>

        {/* স্লাইড ইন্ডিকেটর */}
        <div className="flex justify-center gap-2 mt-8">
          {banners.map((_, idx) => (
            <button
              key={idx}
              className={`transition-all rounded-full ${
                idx === activeIndex
                  ? "w-8 h-2 bg-rose-500"
                  : "w-2 h-2 bg-neutral-300"
              }`}
              onClick={() => {
                const swiper = document.querySelector(".swiper").swiper;
                swiper.slideTo(idx);
              }}
            />
          ))}
        </div>
      </div>

      {/* চেকআউট ড্রয়ার */}
      <CheckoutDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        product={selectedProduct}
      />

      {/* অ্যানিমেশন স্টাইল */}
      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-6px) scale(1.02); }
        }
      `}</style>
    </div>
  );
};

export default BannerCarousel;