import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { FaStar, FaStarHalfAlt, FaRegStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState } from "react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import CheckoutDrawer from "./CheckoutDrawer";

const Reviews = ({ 
  reviews = [], 
  heading = {}, 
  stats = {},
  buttonTexts = {},
  currentProduct = null
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // রিভিউ সেকশনের বাটন টেক্সট buttonTexts.reviews থেকে নিচ্ছে
  const reviewsButtonText = buttonTexts?.reviews || "এখনই অর্ডার করুন";

  // ডিফল্ট হেডিং
  const defaultHeading = {
    badge: "গ্রাহকদের মতামত",
    title: "তারা যা বলছেন",
    highlightText: "বলছেন",
    subtitle: "{totalCustomers}+ খুশি গ্রাহক আমাদের মূল্যায়ন করেছেন"
  };

  // ডিফল্ট পরিসংখ্যান
  const defaultStats = {
    totalCustomers: "১০,০০০+",
    averageRatingLabel: "টি রিভিউ",
    distributionHeading: "রেটিং ডিস্ট্রিবিউশন"
  };

  const { badge, title, highlightText, subtitle } = heading || defaultHeading;
  const { totalCustomers, averageRatingLabel, distributionHeading } = stats || defaultStats;

  // ডিফল্ট রিভিউ (যদি API থেকে না আসে)
  const defaultReviews = [
    {
      id: 1,
      name: "মাহমুদা বেগম",
      location: "ঢাকা",
      rating: 5,
      comment: "হারবাল চা ব্যবহার করে খুব ভালো ফল পেয়েছি। আমার শরীর অনেক ভালো বোধ করছে। ডেলিভারিও সময়মতো পেয়েছি। ধন্যবাদ HerbalCare টিমকে।",
      date: "১৫ মার্চ, ২০২৪",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
      id: 2,
      name: "রাকিব হাসান",
      location: "চট্টগ্রাম",
      rating: 5,
      comment: "গ্রিন কফি এক্সট্রাক্ট অসাধারণ! ১ মাস ব্যবহার করে ওজন কমতে শুরু করেছে। প্রোডাক্ট ১০০% অরিজিনাল। সবাইকে রেকমেন্ড করবো।",
      date: "১০ ফেব্রুয়ারি, ২০২৪",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      id: 3,
      name: "ফারজানা আক্তার",
      location: "সিলেট",
      rating: 4,
      comment: "অ্যালোভেরা জেল খুবই ভালো। ত্বকের জন্য দারুণ উপকারী। শিপিং ছিল দ্রুত। শুধু প্যাকেজিং আরও ভালো হতে পারে।",
      date: "৫ জানুয়ারি, ২০২৪",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    },
    {
      id: 4,
      name: "সাদমান সাকিব",
      location: "রাজশাহী",
      rating: 5,
      comment: "পণ্যের মান অসাধারণ। দামও যুক্তিসঙ্গত। সার্ভিস ছিল চমৎকার। আবার অর্ডার করবো ইনশাআল্লাহ।",
      date: "২৮ ডিসেম্বর, ২০২৩",
      avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    },
    {
      id: 5,
      name: "নাসরিন সুলতানা",
      location: "খুলনা",
      rating: 5,
      comment: "আমি নিয়মিত তাদের হারবাল চা ব্যবহার করি। খুবই উপকার পাচ্ছি। সবার জন্য রেকমেন্ড করবো।",
      date: "২০ ফেব্রুয়ারি, ২০২৪",
      avatar: "https://randomuser.me/api/portraits/women/5.jpg",
    },
    {
      id: 6,
      name: "ইমরান হোসেন",
      location: "বরিশাল",
      rating: 4,
      comment: "পণ্য ভালো, ডেলিভারি সময়মতো পেয়েছি। মূল্য একটু বেশি মনে হচ্ছে তবে মান ভালো।",
      date: "১ মার্চ, ২০২৪",
      avatar: "https://randomuser.me/api/portraits/men/6.jpg",
    },
  ];

  const displayReviews = reviews.length > 0 ? reviews : defaultReviews;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    return stars;
  };

  const totalReviews = displayReviews.length;
  const averageRating = totalReviews > 0 ? (displayReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1) : 0;
  
  const ratingDistribution = {
    5: displayReviews.filter(r => r.rating === 5).length,
    4: displayReviews.filter(r => r.rating === 4).length,
    3: displayReviews.filter(r => r.rating === 3).length,
    2: displayReviews.filter(r => r.rating === 2).length,
    1: displayReviews.filter(r => r.rating === 1).length,
  };

  const renderTitle = () => {
    if (!highlightText || !title.includes(highlightText)) {
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

  const renderSubtitle = () => {
    if (!subtitle) return null;
    return subtitle.replace('{totalCustomers}', totalCustomers);
  };

  const handleOrderClick = () => {
    if (!currentProduct) return;
    
    const firstBanner = currentProduct.banners?.[0] || {};
    
    setSelectedProduct({
      id: currentProduct._id,
      title: currentProduct.navTitle || firstBanner.title || "হারবাল পণ্য",
      offerPrice: firstBanner.offerPrice || "২৯৯",
      originalPrice: firstBanner.originalPrice,
      image: firstBanner.image,
    });
    setIsDrawerOpen(true);
  };

  return (
    <>
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12 md:mb-16">
            {badge && (
              <span className="inline-block px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-sm font-semibold mb-4">
                {badge}
              </span>
            )}
            {renderTitle()}
            <div className="w-24 h-1 bg-rose-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
              {renderSubtitle()}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="text-center p-6 bg-white rounded-2xl shadow-md">
              <div className="text-5xl md:text-6xl font-bold text-rose-500 mb-2">
                {averageRating}
              </div>
              <div className="flex justify-center gap-1 mb-2">
                {renderStars(parseFloat(averageRating))}
              </div>
              <div className="text-gray-500 text-sm">
                {totalReviews} {averageRatingLabel || "টি রিভিউ"}
              </div>
            </div>

            <div className="col-span-2 p-6 bg-white rounded-2xl shadow-md">
              <h3 className="font-semibold text-gray-800 mb-3">{distributionHeading || "রেটিং ডিস্ট্রিবিউশন"}</h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-2">
                    <div className="w-16 text-sm text-gray-600">{star} স্টার</div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-rose-500 rounded-full transition-all duration-500"
                        style={{ width: `${totalReviews > 0 ? (ratingDistribution[star] / totalReviews) * 100 : 0}%` }}
                      />
                    </div>
                    <div className="w-12 text-sm text-gray-500">{ratingDistribution[star]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              pagination={{
                clickable: true,
                bulletClass: "swiper-pagination-bullet !bg-gray-300 !w-2 !h-2 md:!w-2.5 md:!h-2.5",
                bulletActiveClass: "!bg-rose-500",
              }}
              navigation={{
                nextEl: ".review-button-next",
                prevEl: ".review-button-prev",
              }}
              loop={true}
              className="review-swiper pb-12"
            >
              {displayReviews.map((review) => (
                <SwiperSlide key={review.id}>
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full border border-gray-100">
                    <div className="mb-4">
                      <FaQuoteLeft className="text-rose-200 text-2xl" />
                    </div>
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4 line-clamp-4">
                      "{review.comment}"
                    </p>
                    <div className="flex gap-1 mb-4">
                      {renderStars(review.rating)}
                    </div>
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <h4 className="font-semibold text-gray-800 text-sm">{review.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span>{review.location}</span>
                          <span>•</span>
                          <span>{review.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <button className="review-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-rose-500 hover:text-white transition-all duration-300 -ml-4 md:-ml-5">
              <FaChevronLeft size={18} />
            </button>
            <button className="review-button-next absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-rose-500 hover:text-white transition-all duration-300 -mr-4 md:-mr-5">
              <FaChevronRight size={18} />
            </button>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={handleOrderClick}
              className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
            >
              {reviewsButtonText}
            </button>
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

export default Reviews;