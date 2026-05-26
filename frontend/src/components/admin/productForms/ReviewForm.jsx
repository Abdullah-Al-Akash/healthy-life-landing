import { FaPlus, FaTrash, FaStar, FaHeading, FaInfoCircle, FaChartBar } from "react-icons/fa";
import { useState, useEffect } from "react";

const ReviewForm = ({ data, onChange }) => {
  const reviews = data.reviews || [];
  const sectionHeadings = data.sectionHeadings || {};
  const reviewStats = data.reviewStats || {};
  
  // বাটন টেক্সটের জন্য লোকাল স্টেট - buttonTexts.reviews থেকে নিবে
  const [localButtonText, setLocalButtonText] = useState(
    data.buttonTexts?.reviews || ""
  );

  // ডাটা পরিবর্তন হলে লোকাল স্টেট আপডেট
  useEffect(() => {
    setLocalButtonText(data.buttonTexts?.reviews || "");
  }, [data.buttonTexts?.reviews]);

  // বাটন টেক্সট পরিবর্তন হ্যান্ডলার
  const handleButtonTextChange = (e) => {
    const newValue = e.target.value;
    setLocalButtonText(newValue);
    onChange("buttonTexts", { 
      ...data.buttonTexts, 
      reviews: newValue 
    });
  };

  // সেকশন হেডিং আপডেট
  const updateSectionHeading = (field, value) => {
    onChange("sectionHeadings", {
      ...sectionHeadings,
      reviews: { ...sectionHeadings.reviews, [field]: value },
    });
  };

  // রিভিউ স্ট্যাট আপডেট
  const updateReviewStats = (field, value) => {
    onChange("reviewStats", { ...reviewStats, [field]: value });
  };

  const addReview = () => {
    onChange("reviews", [
      ...reviews,
      {
        name: "",
        location: "",
        rating: 5,
        comment: "",
        date: new Date().toLocaleDateString("bn-BD"),
        avatar: "",
      },
    ]);
  };

  const updateReview = (index, field, value) => {
    const updated = [...reviews];
    updated[index][field] = value;
    onChange("reviews", updated);
  };

  const removeReview = (index) => {
    const updated = [...reviews];
    updated.splice(index, 1);
    onChange("reviews", updated);
  };

  return (
    <div className="space-y-6">
      
      {/* ========== ১. সেকশন হেডিং ========== */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 px-4 py-3 border-b">
          <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
            <FaHeading className="text-rose-500" /> Section Headings
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">রিভিউ সেকশনের শিরোনাম ও বিবরণ সেট করুন</p>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600">Badge</label>
            <input
              type="text"
              value={sectionHeadings.reviews?.badge || ""}
              onChange={(e) => updateSectionHeading("badge", e.target.value)}
              placeholder="গ্রাহকদের মতামত"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Title</label>
            <input
              type="text"
              value={sectionHeadings.reviews?.title || ""}
              onChange={(e) => updateSectionHeading("title", e.target.value)}
              placeholder="তারা যা বলছেন"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Highlight Text (যে অংশ রঙিন হবে)</label>
            <input
              type="text"
              value={sectionHeadings.reviews?.highlightText || ""}
              onChange={(e) => updateSectionHeading("highlightText", e.target.value)}
              placeholder="বলছেন"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
            />
            <p className="text-xs text-gray-400 mt-1">যে শব্দটি রঙিন করতে চান সেটি লিখুন</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Subtitle</label>
            <textarea
              value={sectionHeadings.reviews?.subtitle || ""}
              onChange={(e) => updateSectionHeading("subtitle", e.target.value)}
              rows="2"
              placeholder="{totalCustomers}+ খুশি গ্রাহক আমাদের মূল্যায়ন করেছেন"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">{`{totalCustomers} ব্যবহার করলে সেটি ডাইনামিকভাবে প্রতিস্থাপিত হবে`}</p>
          </div>
        </div>
      </div>

      {/* ========== ২. রেটিং স্ট্যাটাস ========== */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-3 border-b">
          <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
            <FaChartBar className="text-amber-500" /> Rating Stats
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">রেটিং সম্পর্কিত পরিসংখ্যান সেট করুন</p>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600">Total Customers Label</label>
            <input
              type="text"
              value={reviewStats.totalCustomers || ""}
              onChange={(e) => updateReviewStats("totalCustomers", e.target.value)}
              placeholder="১০,০০০+"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
            />
            <p className="text-xs text-gray-400 mt-1">সাবটাইটেলের {`{totalCustomers}`} এর জায়গায় এটি বসবে</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Average Rating Label</label>
            <input
              type="text"
              value={reviewStats.averageRatingLabel || ""}
              onChange={(e) => updateReviewStats("averageRatingLabel", e.target.value)}
              placeholder="টি রিভিউ"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Distribution Heading</label>
            <input
              type="text"
              value={reviewStats.distributionHeading || ""}
              onChange={(e) => updateReviewStats("distributionHeading", e.target.value)}
              placeholder="রেটিং ডিস্ট্রিবিউশন"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
            />
          </div>
        </div>
      </div>

      {/* ========== ৩. বাটন টেক্সট সেটিংস ========== */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 px-4 py-3 border-b">
          <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
            🔘 Button Settings
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">রিভিউ সেকশনের অর্ডার বাটনের টেক্সট সেট করুন</p>
        </div>
        <div className="p-4">
          <div>
            <label className="text-xs font-medium text-gray-600">Button Text</label>
            <input
              type="text"
              value={localButtonText}
              onChange={handleButtonTextChange}
              placeholder="এখনই অর্ডার করুন (খালি রাখতে পারেন)"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
            />
            <p className="text-xs text-gray-400 mt-1">
              খালি রাখলে ডিফল্ট "এখনই অর্ডার করুন" দেখাবে
            </p>
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-2">প্রিভিউ:</p>
              <button className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-1.5 rounded-full text-xs font-semibold">
                {localButtonText || "এখনই অর্ডার করুন"} →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========== ৪. রিভিউ লিস্ট ========== */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 px-4 py-3 border-b flex justify-between items-center">
          <div>
            <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
              ✨ Reviews List
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">গ্রাহকদের রিভিউ এখানে যোগ করুন</p>
          </div>
          <button
            onClick={addReview}
            className="bg-rose-500 hover:bg-rose-600 text-white text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg transition shadow-sm"
          >
            <FaPlus size={12} /> Add Review
          </button>
        </div>
        
        <div className="p-4">
          {reviews.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 text-sm">No reviews added. Click "Add Review" to create one.</p>
            </div>
          )}

          <div className="space-y-5">
  {reviews.map((review, idx) => (
    <div key={idx} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-white shadow-sm">
      {/* relative ক্লাস সরানো হয়েছে */}
      
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          Review #{idx + 1}
        </span>
        <button
          onClick={() => removeReview(idx)}
          className="text-red-400 hover:text-red-600 transition p-1"
        >
          <FaTrash size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-500">Name *</label>
          <input
            type="text"
            value={review.name}
            onChange={(e) => updateReview(idx, "name", e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            placeholder="Customer name"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">Location</label>
          <input
            type="text"
            value={review.location}
            onChange={(e) => updateReview(idx, "location", e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            placeholder="e.g., Dhaka"
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-500">Rating</label>
        <div className="flex gap-1 mt-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => updateReview(idx, "rating", star)}
              className="focus:outline-none"
            >
              <FaStar className={`${star <= review.rating ? "text-yellow-400" : "text-gray-300"} text-xl`} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-500">Comment *</label>
        <textarea
          value={review.comment}
          onChange={(e) => updateReview(idx, "comment", e.target.value)}
          rows="2"
          className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
          placeholder="Customer review comment"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-500">Date</label>
          <input
            type="text"
            value={review.date}
            onChange={(e) => updateReview(idx, "date", e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            placeholder="১৫ মার্চ, ২০২৪"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">Avatar URL</label>
          <input
            type="text"
            value={review.avatar}
            onChange={(e) => updateReview(idx, "avatar", e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            placeholder="https://randomuser.me/api/portraits/..."
          />
        </div>
      </div>
    </div>
  ))}
</div>

          {reviews.length > 0 && (
            <div className="mt-4 text-center">
              <button
                onClick={addReview}
                className="border border-dashed border-rose-300 text-rose-500 hover:bg-rose-50 text-sm flex items-center gap-1 px-4 py-2 rounded-lg transition mx-auto"
              >
                <FaPlus size={12} /> Add Another Review
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;