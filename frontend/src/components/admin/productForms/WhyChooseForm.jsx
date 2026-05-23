import {
  FaCertificate,
  FaHeadset,
  FaLeaf,
  FaPlus,
  FaShieldAlt,
  FaSmile,
  FaTrash,
  FaTruck,
  FaHeartbeat,
  FaSeedling,
  FaHandHoldingHeart,
  FaRecycle,
  FaGlassCheers,
  FaSpa,
  FaInfoCircle,
} from "react-icons/fa";
import { useState, useEffect } from "react";

const WhyChooseForm = ({ data, onChange }) => {
  const features = data.whyChooseUs || [];
  const sectionHeadings = data.sectionHeadings || {};
  const orderBanner = data.orderBanner || {};
  
  // বাটন টেক্সটের জন্য লোকাল স্টেট - buttonTexts.whyChooseUs থেকে নিবে
  const [localButtonText, setLocalButtonText] = useState(
    data.buttonTexts?.whyChooseUs || ""
  );

  // ডাটা পরিবর্তন হলে লোকাল স্টেট আপডেট
  useEffect(() => {
    setLocalButtonText(data.buttonTexts?.whyChooseUs || "");
  }, [data.buttonTexts?.whyChooseUs]);

  // বাটন টেক্সট পরিবর্তন হ্যান্ডলার
  const handleButtonTextChange = (e) => {
    const newValue = e.target.value;
    setLocalButtonText(newValue);
    onChange("buttonTexts", { 
      ...data.buttonTexts, 
      whyChooseUs: newValue 
    });
  };

  // আইকন লিস্ট
  const AVAILABLE_ICONS = [
    { name: "FaLeaf", icon: <FaLeaf className="w-6 h-6" />, label: "পাতা" },
    { name: "FaSeedling", icon: <FaSeedling className="w-6 h-6" />, label: "চারা" },
    { name: "FaSpa", icon: <FaSpa className="w-6 h-6" />, label: "স্পা" },
    { name: "FaHeartbeat", icon: <FaHeartbeat className="w-6 h-6" />, label: "হার্ট" },
    { name: "FaHandHoldingHeart", icon: <FaHandHoldingHeart className="w-6 h-6" />, label: "হাত" },
    { name: "FaTruck", icon: <FaTruck className="w-6 h-6" />, label: "ট্রাক" },
    { name: "FaShieldAlt", icon: <FaShieldAlt className="w-6 h-6" />, label: "শিল্ড" },
    { name: "FaSmile", icon: <FaSmile className="w-6 h-6" />, label: "হাসি" },
    { name: "FaHeadset", icon: <FaHeadset className="w-6 h-6" />, label: "হেডসেট" },
    { name: "FaCertificate", icon: <FaCertificate className="w-6 h-6" />, label: "সনদ" },
    { name: "FaRecycle", icon: <FaRecycle className="w-6 h-6" />, label: "রিসাইকেল" },
    { name: "FaGlassCheers", icon: <FaGlassCheers className="w-6 h-6" />, label: "চা" },
  ];

  // হেডিং ফিল্ড আপডেট
  const updateSectionHeading = (field, value) => {
    onChange("sectionHeadings", {
      ...sectionHeadings,
      whyChooseUs: { ...sectionHeadings.whyChooseUs, [field]: value },
    });
  };

  // অর্ডার ব্যানার আপডেট
  const updateOrderBanner = (field, value) => {
    onChange("orderBanner", { ...orderBanner, [field]: value });
  };

  // ফিচার অ্যাড/রিমুভ/আপডেট
  const addFeature = () => {
    onChange("whyChooseUs", [
      ...features,
      { icon: "", title: "", description: "" },
    ]);
  };

  const updateFeature = (index, field, value) => {
    const updated = [...features];
    updated[index][field] = value;
    onChange("whyChooseUs", updated);
  };

  const removeFeature = (index) => {
    const updated = [...features];
    updated.splice(index, 1);
    onChange("whyChooseUs", updated);
  };

  return (
    <div className="space-y-6">
      
      {/* ========== সেকশন হেডিং ========== */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 px-4 py-3 border-b">
          <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
            <FaInfoCircle className="text-rose-500" /> Section Headings
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">এই সেকশনের শিরোনাম ও বিবরণ সেট করুন</p>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600">Title</label>
            <input
              type="text"
              value={sectionHeadings.whyChooseUs?.title || ""}
              onChange={(e) => updateSectionHeading("title", e.target.value)}
              placeholder="কেন বেছে নেবেন আমাদের?"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Highlight Text (যে অংশ রঙিন হবে)</label>
            <input
              type="text"
              value={sectionHeadings.whyChooseUs?.highlightText || ""}
              onChange={(e) => updateSectionHeading("highlightText", e.target.value)}
              placeholder="আমাদের?"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
            />
            <p className="text-xs text-gray-400 mt-1">যে শব্দটি রঙিন করতে চান সেটি লিখুন</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Subtitle</label>
            <textarea
              value={sectionHeadings.whyChooseUs?.subtitle || ""}
              onChange={(e) => updateSectionHeading("subtitle", e.target.value)}
              rows="2"
              placeholder="আমরা চাই আপনাকে সেরা সেবা ও মানসম্মত পণ্য দিতে..."
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition resize-none"
            />
          </div>
        </div>
      </div>

      {/* ========== অর্ডার ব্যানার ========== */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-3 border-b">
          <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
            🎯 Order Banner
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">অর্ডার ব্যানারের কন্টেন্ট সেট করুন</p>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600">Banner Title</label>
            <input
              type="text"
              value={orderBanner.title || ""}
              onChange={(e) => updateOrderBanner("title", e.target.value)}
              placeholder="আজই অর্ডার করুন ও পান বিশেষ ছাড়!"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Banner Subtitle</label>
            <textarea
              value={orderBanner.subtitle || ""}
              onChange={(e) => updateOrderBanner("subtitle", e.target.value)}
              rows="2"
              placeholder="সীমিত সময়ের অফার। দেরি না করে এখনই অর্ডার করুন।"
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
          <p className="text-xs text-gray-500 mt-0.5">অর্ডার বাটনের টেক্সট কাস্টমাইজ করুন</p>
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

      {/* ========== ফিচার লিস্ট ========== */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 px-4 py-3 border-b flex justify-between items-center">
          <div>
            <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
              ✨ Features List
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">কেন বেছে নেবেন - এখানে কার্ড যোগ করুন</p>
          </div>
          <button
            onClick={addFeature}
            className="bg-rose-500 hover:bg-rose-600 text-white text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg transition shadow-sm"
          >
            <FaPlus size={12} /> Add Feature
          </button>
        </div>
        
        <div className="p-4">
          {features.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <FaLeaf className="text-gray-300 text-4xl mx-auto mb-2" />
              <p className="text-gray-400 text-sm">
                No features added. Click "Add Feature" to create one.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-xl p-4 space-y-3 relative bg-white shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    Feature #{idx + 1}
                  </span>
                  <button
                    onClick={() => removeFeature(idx)}
                    className="text-red-400 hover:text-red-600 transition p-1"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600">Icon</label>
                  <select
                    value={feature.icon}
                    onChange={(e) => updateFeature(idx, "icon", e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500"
                  >
                    {AVAILABLE_ICONS.map((icon) => (
                      <option key={icon.name} value={icon.name}>
                        {icon.name} - {icon.label}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 p-2 bg-gray-50 rounded-lg inline-block">
                    {AVAILABLE_ICONS.find((i) => i.name === feature.icon)?.icon}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600">Title *</label>
                  <input
                    type="text"
                    value={feature.title}
                    onChange={(e) => updateFeature(idx, "title", e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
                    placeholder="যেমন: ১০০% খাঁটি পণ্য"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600">Description *</label>
                  <textarea
                    value={feature.description}
                    onChange={(e) => updateFeature(idx, "description", e.target.value)}
                    rows="2"
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition resize-none"
                    placeholder="বিস্তারিত বিবরণ লিখুন"
                  />
                </div>
              </div>
            ))}
          </div>

          {features.length > 0 && (
            <div className="mt-4 text-center">
              <button
                onClick={addFeature}
                className="border border-dashed border-rose-300 text-rose-500 hover:bg-rose-50 text-sm flex items-center gap-1 px-4 py-2 rounded-lg transition mx-auto"
              >
                <FaPlus size={12} /> Add Another Feature
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseForm;