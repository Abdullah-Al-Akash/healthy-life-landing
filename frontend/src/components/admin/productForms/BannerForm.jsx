import {
  FaPlus,
  FaTrash,
  FaImage,
  FaTag,
  FaDollarSign,
  FaAlignLeft,
  FaHeading,
  FaParagraph,
  FaArrowRight,
  FaClock,
} from "react-icons/fa";

const BannerForm = ({ data, onChange }) => {
  const banners = data.banners || [];
  
  // চেক করা ইউজার ডেভেলপার কিনা
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isDeveloper = currentUser.role === "developer";

  const addBanner = () => {
    onChange("banners", [
      ...banners,
      {
        image: "",
        title: "",
        subtitle: "",
        offerPrice: "",
        originalPrice: "",
        discount: "",
        description: "",
        buttonText: "",
      },
    ]);
  };

  const updateBanner = (index, field, value) => {
    const updated = [...banners];
    updated[index][field] = value;
    onChange("banners", updated);
  };

  const removeBanner = (index) => {
    const updated = [...banners];
    updated.splice(index, 1);
    onChange("banners", updated);
  };

  return (
    <div className="space-y-4">
      {/* হেডার */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-md font-semibold text-gray-800">Banners</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            এক বা একাধিক ব্যানার স্লাইডার হিসেবে দেখাবে
          </p>
        </div>
        <button
          onClick={addBanner}
          className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-sm flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition"
        >
          <FaPlus size={12} /> Add Banner
        </button>
      </div>

      {/* খালি স্টেট */}
      {banners.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <FaImage className="text-gray-300 text-4xl mx-auto mb-2" />
          <p className="text-gray-400 text-sm">
            No banners added. Click "Add Banner" to create one.
          </p>
        </div>
      )}

      {/* টাইমার কনফিগ সেকশন - শুধু ডেভেলপার দেখবে */}
      {isDeveloper && (
        <div className="bg-amber-50 p-4 rounded-xl mb-4 border border-amber-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <FaClock className="text-rose-500" /> ⚙️ Developer Settings - Countdown Timer
            </h3>
            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
              Developer Only
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            অফার শেষ হওয়ার তারিখ দিন, বাকি সময় স্বয়ংক্রিয়ভাবে কাউন্টডাউন হবে
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-600">Offer End Date</label>
              <input
                type="datetime-local"
                value={data.bannerConfig?.targetDate || ""}
                onChange={(e) =>
                  onChange("bannerConfig", {
                    ...data.bannerConfig,
                    targetDate: e.target.value,
                  })
                }
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400"
              />
              <p className="text-xs text-gray-400 mt-1">
                খালি রাখলে টাইমার দেখাবে না
              </p>
            </div>
            <div className="flex items-center gap-3 pt-5">
              <input
                type="checkbox"
                id="showTimer"
                checked={data.bannerConfig?.showTimer !== false}
                onChange={(e) =>
                  onChange("bannerConfig", {
                    ...data.bannerConfig,
                    showTimer: e.target.checked,
                  })
                }
                className="w-4 h-4 text-rose-500 rounded"
              />
              <label htmlFor="showTimer" className="text-sm text-gray-600">
                Show Countdown Timer
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ডেভেলপার না হলে হালকা নোটিশ */}
      {!isDeveloper && data.bannerConfig?.showTimer && (
        <div className="bg-gray-50 p-3 rounded-lg mb-4 text-center">
          <p className="text-xs text-gray-400">
            ⏱️ টাইমার সেটিংস শুধুমাত্র ডেভেলপার দেখতে পারেন
          </p>
        </div>
      )}

      {/* ব্যানার লিস্ট */}
      <div className="space-y-5">
        {banners.map((banner, idx) => (
          <div
            key={idx}
            className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition"
          >
            {/* ব্যানার হেডার */}
            <div className="bg-gray-50 px-4 py-2 flex justify-between items-center border-b">
              <span className="text-sm font-medium text-gray-600">
                Banner #{idx + 1}
              </span>
              <button
                onClick={() => removeBanner(idx)}
                className="text-red-400 hover:text-red-600 transition p-1"
              >
                <FaTrash size={14} />
              </button>
            </div>

            {/* ফর্ম ফিল্ড */}
            <div className="p-4 space-y-4">
              {/* ইমেজ ফিল্ড */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-1">
                  <FaImage className="text-rose-400" /> Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={banner.image}
                    onChange={(e) => updateBanner(idx, "image", e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
                  />
                  {banner.image && (
                    <div
                      className="w-12 h-12 bg-cover bg-center rounded-lg border"
                      style={{ backgroundImage: `url(${banner.image})` }}
                    />
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  ব্যানারের ছবির লিংক দিন
                </p>
              </div>

              {/* টাইটেল ফিল্ড */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-1">
                  <FaHeading className="text-rose-400" /> Title
                </label>
                <input
                  type="text"
                  value={banner.title}
                  onChange={(e) => updateBanner(idx, "title", e.target.value)}
                  placeholder="যেমন: প্রাকৃতিক হারবাল চা"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
                />
              </div>

              {/* সাবটাইটেল ফিল্ড */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-1">
                  <FaParagraph className="text-rose-400" /> Subtitle
                </label>
                <input
                  type="text"
                  value={banner.subtitle}
                  onChange={(e) =>
                    updateBanner(idx, "subtitle", e.target.value)
                  }
                  placeholder="যেমন: সুস্থ থাকুন প্রকৃতির ছোঁয়ায়"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
                />
              </div>

              {/* প্রাইস রো */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-1">
                    <FaDollarSign className="text-rose-400" /> Offer Price
                  </label>
                  <input
                    type="text"
                    value={banner.offerPrice}
                    onChange={(e) =>
                      updateBanner(idx, "offerPrice", e.target.value)
                    }
                    placeholder="যেমন: ২৯৯"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-1">
                    <FaDollarSign className="text-gray-400" /> Original Price
                  </label>
                  <input
                    type="text"
                    value={banner.originalPrice}
                    onChange={(e) =>
                      updateBanner(idx, "originalPrice", e.target.value)
                    }
                    placeholder="যেমন: ৪৯৯"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
                  />
                </div>
              </div>

              {/* ডিসকাউন্ট ব্যাজ */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-1">
                  <FaTag className="text-rose-400" /> Discount Badge
                </label>
                <input
                  type="text"
                  value={banner.discount}
                  onChange={(e) =>
                    updateBanner(idx, "discount", e.target.value)
                  }
                  placeholder="যেমন: ৪০% ছাড়"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
                />
                <p className="text-xs text-gray-400 mt-1">
                  ব্যানারের উপরে দেখানো ব্যাজ (খালি রাখলে দেখাবে না)
                </p>
              </div>

              {/* বিবরণ */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-1">
                  <FaAlignLeft className="text-rose-400" /> Description
                </label>
                <textarea
                  value={banner.description}
                  onChange={(e) =>
                    updateBanner(idx, "description", e.target.value)
                  }
                  rows="2"
                  placeholder="পণ্য সম্পর্কে বিস্তারিত বিবরণ"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition resize-none"
                />
              </div>

              {/* কাস্টম বাটন টেক্সট */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-1">
                  <FaArrowRight className="text-rose-400" /> Custom Button Text
                </label>
                <input
                  type="text"
                  value={banner.buttonText}
                  onChange={(e) =>
                    updateBanner(idx, "buttonText", e.target.value)
                  }
                  placeholder="যেমন: এখনই অর্ডার করুন - ২৯৯ টাকায়"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
                />
                <p className="text-xs text-gray-400 mt-1">
                  খালি রাখলে ডিফল্ট টেক্সট ব্যবহার হবে
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BannerForm;