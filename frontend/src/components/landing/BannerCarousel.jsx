import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { FiChevronLeft, FiChevronRight, FiShoppingCart } from "react-icons/fi";
import { useState, useEffect } from "react";
import CheckoutDrawer from "./CheckoutDrawer";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const BannerCarousel = ({ banners = [], config = {}, buttonTexts = {} }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [timerEnded, setTimerEnded] = useState(false);

  const defaultConfig = { autoPlayDelay: 5000, showTimer: true, targetDate: null };
  const { autoPlayDelay, showTimer, targetDate } = { ...defaultConfig, ...config };
  
  // 🔥 ব্যানারের বাটন টেক্সট - buttonTexts থেকে নিচ্ছে
  const bannerButtonText = buttonTexts?.banner || "এখনই অর্ডার করুন";
  
  // ডিবাগ করার জন্য কনসোল লগ
  useEffect(() => {
    console.log("🔍 BannerCarousel - buttonTexts:", buttonTexts);
    console.log("🔍 BannerCarousel - banner button text:", bannerButtonText);
  }, [buttonTexts, bannerButtonText]);

  useEffect(() => {
    if (!showTimer || !targetDate) return;
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;
      if (difference <= 0) {
        setTimerEnded(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimerEnded(false);
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      });
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate, showTimer]);

  if (!banners || banners.length === 0) return null;
  const currentBanner = banners[activeIndex];

  const handleOrderClick = () => {
    setSelectedProduct({
      id: currentBanner.id || activeIndex,
      title: currentBanner.title,
      offerPrice: currentBanner.offerPrice,
      originalPrice: currentBanner.originalPrice,
      image: currentBanner.image,
      buttonText: currentBanner.buttonText || bannerButtonText,
    });
    setIsDrawerOpen(true);
  };

  const getButtonText = () => {
    if (currentBanner.buttonText) return currentBanner.buttonText;
    return `${bannerButtonText} - ${currentBanner.offerPrice} টাকায়`;
  };

  const formatNumber = (num) => String(num).padStart(2, '0');

  return (
    <>
      <div className="mb-12">
        <div className="relative">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={0}
            slidesPerView={1}
            autoplay={{ delay: autoPlayDelay, disableOnInteraction: false }}
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
            {banners.map((banner, idx) => (
              <SwiperSlide key={idx}>
                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${banner.image})` }} />
              </SwiperSlide>
            ))}
          </Swiper>
          <button className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 md:p-3 shadow-lg">
            <FiChevronLeft size={20} className="text-neutral-700" />
          </button>
          <button className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 md:p-3 shadow-lg">
            <FiChevronRight size={20} className="text-neutral-700" />
          </button>
        </div>

        <div className="container-custom mt-8 md:mt-12">
          <div className="text-center max-w-3xl mx-auto">
            {currentBanner.discount && (
              <span className="inline-block bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm md:text-base font-semibold mb-4 animate-pulse">
                {currentBanner.discount}
              </span>
            )}
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-neutral-800 mb-4">{currentBanner.title}</h1>
            {currentBanner.subtitle && <p className="text-base md:text-lg text-neutral-600 mb-4">{currentBanner.subtitle}</p>}
            {currentBanner.description && <p className="text-sm md:text-base text-neutral-500 mb-6 max-w-2xl mx-auto">{currentBanner.description}</p>}
            
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="text-2xl md:text-3xl font-bold text-rose-500">৳{currentBanner.offerPrice}</span>
              {currentBanner.originalPrice && <span className="text-base md:text-lg line-through text-neutral-400">৳{currentBanner.originalPrice}</span>}
            </div>

            {showTimer && targetDate && !timerEnded && (
              <div className="mb-6">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-rose-50 to-pink-50 px-6 py-3 rounded-2xl shadow-sm">
                  <div className="text-center"><div className="text-2xl md:text-3xl font-bold text-rose-600">{formatNumber(timeLeft.days)}</div><div className="text-xs text-gray-500">দিন</div></div>
                  <span className="text-2xl font-bold text-rose-400">:</span>
                  <div className="text-center"><div className="text-2xl md:text-3xl font-bold text-rose-600">{formatNumber(timeLeft.hours)}</div><div className="text-xs text-gray-500">ঘন্টা</div></div>
                  <span className="text-2xl font-bold text-rose-400">:</span>
                  <div className="text-center"><div className="text-2xl md:text-3xl font-bold text-rose-600">{formatNumber(timeLeft.minutes)}</div><div className="text-xs text-gray-500">মিনিট</div></div>
                  <span className="text-2xl font-bold text-rose-400">:</span>
                  <div className="text-center"><div className="text-2xl md:text-3xl font-bold text-rose-600">{formatNumber(timeLeft.seconds)}</div><div className="text-xs text-gray-500">সেকেন্ড</div></div>
                </div>
                <p className="text-xs text-gray-400 mt-2">অফার শেষ হতে বাকি</p>
              </div>
            )}

            {showTimer && targetDate && timerEnded && (
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-red-50 px-6 py-3 rounded-2xl shadow-sm">
                  <span className="text-red-500 text-xl">⏰</span>
                  <span className="text-red-600 font-medium">অফার শেষ হয়েছে!</span>
                </div>
              </div>
            )}

            <div className="relative inline-block">
              <div className="absolute -inset-2 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <button onClick={handleOrderClick} className="relative bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 md:px-10 md:py-4 rounded-full font-bold text-base md:text-lg shadow-2xl hover:shadow-rose-500/50 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden group" style={{ animation: "wiggle 0.8s ease-in-out infinite" }}>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                <span className="relative flex items-center gap-3">
                  <FiShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="text-base md:text-lg font-bold tracking-wide">{getButtonText()}</span>
                  <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </div>

            <div className="flex justify-center gap-2 mt-8">
              {banners.map((_, idx) => (
                <button key={idx} className={`transition-all duration-300 rounded-full cursor-pointer ${idx === activeIndex ? "w-8 h-2 bg-gradient-to-r from-rose-500 to-pink-500" : "w-2 h-2 bg-neutral-300 hover:bg-neutral-400"}`} onClick={() => { const swiper = document.querySelector(".swiper")?.swiper; if (swiper) swiper.slideTo(idx); }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <CheckoutDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} product={selectedProduct} />
      <style>{`@keyframes wiggle { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-6px) scale(1.02); } }`}</style>
    </>
  );
};

export default BannerCarousel;