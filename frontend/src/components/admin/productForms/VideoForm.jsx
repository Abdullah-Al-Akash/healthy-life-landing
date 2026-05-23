import { useState, useEffect } from "react";
import { FaYoutube, FaHeading, FaParagraph, FaClock, FaEye, FaThumbsUp } from "react-icons/fa";

const VideoForm = ({ data, onChange }) => {
  const video = data.video || { videoId: "", title: "", description: "" };
  const sectionHeadings = data.sectionHeadings || {};
  const videoStats = data.videoStats || {};
  
  // বাটন টেক্সটের জন্য লোকাল স্টেট - buttonTexts.video থেকে নিবে
  const [localButtonText, setLocalButtonText] = useState(
    data.buttonTexts?.video || ""
  );

  // ডাটা পরিবর্তন হলে লোকাল স্টেট আপডেট
  useEffect(() => {
    setLocalButtonText(data.buttonTexts?.video || "");
  }, [data.buttonTexts?.video]);

  // বাটন টেক্সট পরিবর্তন হ্যান্ডলার
  const handleButtonTextChange = (e) => {
    const newValue = e.target.value;
    setLocalButtonText(newValue);
    onChange("buttonTexts", { 
      ...data.buttonTexts, 
      video: newValue 
    });
  };

  // YouTube থাম্বনেইল URL জেনারেট - সঠিক URL ফরম্যাট
  const getYouTubeThumbnail = (videoId) => {
    if (!videoId) return "";
    // maxresdefault না থাকলে hqdefault ব্যবহার করবে
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  // থাম্বনেইল ইমেজ লোড না হলে hqdefault ব্যবহারের জন্য
  const [thumbnailError, setThumbnailError] = useState(false);
  
  const getThumbnailUrl = (videoId) => {
    if (!videoId) return "";
    if (thumbnailError) {
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  const updateVideo = (field, value) => {
    onChange("video", { ...video, [field]: value });
    // ভিডিও আইডি পরিবর্তন হলে থাম্বনেইল এরর রিসেট করো
    if (field === "videoId") {
      setThumbnailError(false);
    }
  };

  const updateSectionHeading = (field, value) => {
    onChange("sectionHeadings", {
      ...sectionHeadings,
      video: { ...sectionHeadings.video, [field]: value },
    });
  };

  const updateVideoStats = (field, value) => {
    onChange("videoStats", { ...videoStats, [field]: value });
  };

  return (
    <div className="space-y-6">
      
      {/* ========== ভিডিও সেকশন হেডিং ========== */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 px-4 py-3 border-b">
          <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
            <FaHeading className="text-rose-500" /> Video Section Headings
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">ভিডিও সেকশনের শিরোনাম ও বিবরণ সেট করুন</p>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600">Badge</label>
            <input
              type="text"
              value={sectionHeadings.video?.badge || ""}
              onChange={(e) => updateSectionHeading("badge", e.target.value)}
              placeholder="ভিডিও টিউটোরিয়াল"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Title</label>
            <input
              type="text"
              value={sectionHeadings.video?.title || ""}
              onChange={(e) => updateSectionHeading("title", e.target.value)}
              placeholder="পণ্য সম্পর্কে বিস্তারিত জানুন"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Highlight Text (যে অংশ রঙিন হবে)</label>
            <input
              type="text"
              value={sectionHeadings.video?.highlightText || ""}
              onChange={(e) => updateSectionHeading("highlightText", e.target.value)}
              placeholder="বিস্তারিত জানুন"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
            />
            <p className="text-xs text-gray-400 mt-1">যে শব্দটি রঙিন করতে চান সেটি লিখুন</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Subtitle</label>
            <textarea
              value={sectionHeadings.video?.subtitle || ""}
              onChange={(e) => updateSectionHeading("subtitle", e.target.value)}
              rows="2"
              placeholder="আমাদের পণ্য如何使用, এর উপকারিতা এবং ব্যবহার পদ্ধতি সম্পর্কে ভিডিওতে দেখুন"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition resize-none"
            />
          </div>
        </div>
      </div>

      {/* ========== ভিডিও স্ট্যাটাস ========== */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-3 border-b">
          <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
            <FaClock className="text-amber-500" /> Video Stats
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">ভিডিওর ভিউ, লাইক ইত্যাদি তথ্য দিন</p>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600 flex items-center gap-2">
              <FaClock /> Duration
            </label>
            <input
              type="text"
              value={videoStats.duration || ""}
              onChange={(e) => updateVideoStats("duration", e.target.value)}
              placeholder="২:৩০ মিনিট"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 flex items-center gap-2">
              <FaEye /> Views
            </label>
            <input
              type="text"
              value={videoStats.views || ""}
              onChange={(e) => updateVideoStats("views", e.target.value)}
              placeholder="১০K+ ভিউ"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 flex items-center gap-2">
              <FaThumbsUp /> Likes Percentage
            </label>
            <input
              type="text"
              value={videoStats.likes || ""}
              onChange={(e) => updateVideoStats("likes", e.target.value)}
              placeholder="৯৫% পছন্দ করেছেন"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
            />
          </div>
        </div>
      </div>

      {/* ========== ভিডিও কন্টেন্ট ========== */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 px-4 py-3 border-b">
          <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
            <FaYoutube className="text-red-500" /> Video Content
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">ইউটিউব ভিডিওর তথ্য দিন</p>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600">YouTube Video ID</label>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={video.videoId || ""}
                onChange={(e) => updateVideo("videoId", e.target.value)}
                placeholder="e.g., dQw4w9WgXcQ"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
              />
              {video.videoId && (
                <img
                  src={getThumbnailUrl(video.videoId)}
                  alt="YouTube Thumbnail"
                  className="w-16 h-12 object-cover rounded-lg border"
                  onError={() => setThumbnailError(true)}
                />
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              ⓘ YouTube ভিডিওর আইডি দিন (URL থেকে শেষ অংশ)
            </p>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 flex items-center gap-2">
              <FaHeading className="text-rose-400" /> Video Title
            </label>
            <input
              type="text"
              value={video.title || ""}
              onChange={(e) => updateVideo("title", e.target.value)}
              placeholder="e.g., আমাদের পণ্য সম্পর্কে জানুন"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 flex items-center gap-2">
              <FaParagraph className="text-rose-400" /> Video Description
            </label>
            <textarea
              value={video.description || ""}
              onChange={(e) => updateVideo("description", e.target.value)}
              rows="3"
              placeholder="ভিডিও সম্পর্কে সংক্ষিপ্ত বিবরণ"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition resize-none"
            />
          </div>
        </div>
      </div>

      {/* ========== বাটন টেক্সট সেটিংস ========== */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 px-4 py-3 border-b">
          <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
            🔘 Button Settings
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">ভিডিও সেকশনের অর্ডার বাটনের টেক্সট সেট করুন</p>
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
            
            {/* প্রিভিউ */}
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-2">প্রিভিউ:</p>
              <button className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-1.5 rounded-full text-xs font-semibold">
                {localButtonText || "এখনই অর্ডার করুন"} →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoForm;