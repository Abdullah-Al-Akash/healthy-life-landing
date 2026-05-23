import { FaPlus, FaTrash, FaHeading, FaInfoCircle, FaFacebook, FaWhatsapp, FaPhoneAlt, FaClock } from "react-icons/fa";
import { useState, useEffect } from "react";

const FaqForm = ({ data, onChange }) => {
  const faqs = data.faqs || [];
  const contactInfo = data.contactInfo || { facebook: "", whatsapp: "", phone: "" };
  const sectionHeadings = data.sectionHeadings || {};
  const contactHeading = data.contactHeading || {};
  
  // বাটন টেক্সটের জন্য লোকাল স্টেট - buttonTexts.faq থেকে নিবে
  const [localButtonText, setLocalButtonText] = useState(
    data.buttonTexts?.faq || ""
  );

  // সাপোর্ট আওয়ারের জন্য লোকাল স্টেট
  const [localSupportHours, setLocalSupportHours] = useState(
    data.supportHours || "সকাল ৯টা - রাত ১০টা (শুক্রবার বন্ধ)"
  );

  // ডাটা পরিবর্তন হলে লোকাল স্টেট আপডেট
  useEffect(() => {
    setLocalButtonText(data.buttonTexts?.faq || "");
  }, [data.buttonTexts?.faq]);

  useEffect(() => {
    setLocalSupportHours(data.supportHours || "সকাল ৯টা - রাত ১০টা (শুক্রবার বন্ধ)");
  }, [data.supportHours]);

  // বাটন টেক্সট পরিবর্তন হ্যান্ডলার
  const handleButtonTextChange = (e) => {
    const newValue = e.target.value;
    setLocalButtonText(newValue);
    onChange("buttonTexts", { 
      ...data.buttonTexts, 
      faq: newValue 
    });
  };

  // সাপোর্ট আওয়ার পরিবর্তন হ্যান্ডলার
  const handleSupportHoursChange = (e) => {
    const newValue = e.target.value;
    setLocalSupportHours(newValue);
    onChange("supportHours", newValue);
  };

  const addFaq = () => {
    onChange("faqs", [...faqs, { question: "", answer: "" }]);
  };

  const updateFaq = (index, field, value) => {
    const updated = [...faqs];
    updated[index][field] = value;
    onChange("faqs", updated);
  };

  const removeFaq = (index) => {
    const updated = [...faqs];
    updated.splice(index, 1);
    onChange("faqs", updated);
  };

  const updateContactInfo = (field, value) => {
    onChange("contactInfo", { ...contactInfo, [field]: value });
  };

  const updateSectionHeading = (section, field, value) => {
    onChange("sectionHeadings", {
      ...sectionHeadings,
      [section]: { ...sectionHeadings[section], [field]: value }
    });
  };

  const updateContactHeading = (field, value) => {
    onChange("contactHeading", { ...contactHeading, [field]: value });
  };

  return (
    <div className="space-y-6">
      
      {/* ========== ১. FAQ সেকশন হেডিং ========== */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 px-4 py-3 border-b">
          <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
            <FaHeading className="text-rose-500" /> FAQ Section Headings
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">FAQ সেকশনের শিরোনাম ও বিবরণ সেট করুন</p>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600">Title</label>
            <input
              type="text"
              value={sectionHeadings.faq?.title || ""}
              onChange={(e) => updateSectionHeading("faq", "title", e.target.value)}
              placeholder="প্রায়শই জিজ্ঞাসিত প্রশ্ন"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Highlight Text (যে অংশ রঙিন হবে)</label>
            <input
              type="text"
              value={sectionHeadings.faq?.highlightText || ""}
              onChange={(e) => updateSectionHeading("faq", "highlightText", e.target.value)}
              placeholder="প্রশ্ন"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
            />
            <p className="text-xs text-gray-400 mt-1">যে শব্দটি রঙিন করতে চান সেটি লিখুন</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Subtitle</label>
            <textarea
              value={sectionHeadings.faq?.subtitle || ""}
              onChange={(e) => updateSectionHeading("faq", "subtitle", e.target.value)}
              rows="2"
              placeholder="আপনার মনে হতে পারে এমন কিছু সাধারণ প্রশ্নের উত্তর জেনে নিন"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition resize-none"
            />
          </div>
        </div>
      </div>

      {/* ========== ২. কন্টাক্ট সেকশন হেডিং ========== */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-3 border-b">
          <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
            <FaInfoCircle className="text-amber-500" /> Contact Section Headings
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">যোগাযোগ সেকশনের শিরোনাম সেট করুন</p>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600">Title</label>
            <input
              type="text"
              value={contactHeading.title || ""}
              onChange={(e) => updateContactHeading("title", e.target.value)}
              placeholder="এখনও প্রশ্ন আছে?"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Subtitle</label>
            <textarea
              value={contactHeading.subtitle || ""}
              onChange={(e) => updateContactHeading("subtitle", e.target.value)}
              rows="2"
              placeholder="আমাদের সাথে সরাসরি যোগাযোগ করুন। আমরা ২৪/৭ ঘন্টা আপনার পাশে আছি।"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Hotline Label</label>
            <input
              type="text"
              value={contactHeading.hotlineLabel || ""}
              onChange={(e) => updateContactHeading("hotlineLabel", e.target.value)}
              placeholder="হটলাইন:"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
            />
          </div>
        </div>
      </div>

      {/* ========== ৩. কন্টাক্ট ইনফো ========== */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 px-4 py-3 border-b">
          <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
            📞 Contact Information
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">সোশ্যাল মিডিয়া ও যোগাযোগের তথ্য দিন</p>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600 flex items-center gap-2">
              <FaFacebook className="text-blue-600" /> Facebook URL
            </label>
            <input
              type="text"
              value={contactInfo.facebook}
              onChange={(e) => updateContactInfo("facebook", e.target.value)}
              placeholder="https://facebook.com/yourpage"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 flex items-center gap-2">
              <FaWhatsapp className="text-green-500" /> WhatsApp URL
            </label>
            <input
              type="text"
              value={contactInfo.whatsapp}
              onChange={(e) => updateContactInfo("whatsapp", e.target.value)}
              placeholder="https://wa.me/8801xxxxxxxxx"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 flex items-center gap-2">
              <FaPhoneAlt className="text-rose-500" /> Phone Number
            </label>
            <input
              type="text"
              value={contactInfo.phone}
              onChange={(e) => updateContactInfo("phone", e.target.value)}
              placeholder="+8801xxxxxxxxx"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 flex items-center gap-2">
              <FaClock className="text-amber-500" /> Support Hours
            </label>
            <input
              type="text"
              value={localSupportHours}
              onChange={handleSupportHoursChange}
              placeholder="সকাল ৯টা - রাত ১০টা (শুক্রবার বন্ধ)"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
            />
            <p className="text-xs text-gray-400 mt-1">খালি রাখলে ডিফল্ট সময় দেখাবে</p>
          </div>
        </div>
      </div>

      {/* ========== ৪. বাটন টেক্সট সেটিংস ========== */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 px-4 py-3 border-b">
          <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
            🔘 Button Settings
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">FAQ সেকশনের অর্ডার বাটনের টেক্সট সেট করুন</p>
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

      {/* ========== ৫. FAQ লিস্ট ========== */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 px-4 py-3 border-b flex justify-between items-center">
          <div>
            <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
              ❓ FAQs List
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">প্রশ্ন ও উত্তর এখানে যোগ করুন</p>
          </div>
          <button
            onClick={addFaq}
            className="bg-rose-500 hover:bg-rose-600 text-white text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg transition shadow-sm"
          >
            <FaPlus size={12} /> Add FAQ
          </button>
        </div>
        
        <div className="p-4">
          {faqs.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 text-sm">No FAQs added. Click "Add FAQ" to create one.</p>
            </div>
          )}

          <div className="space-y-5">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl p-4 space-y-3 relative bg-white shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    FAQ #{idx + 1}
                  </span>
                  <button onClick={() => removeFaq(idx)} className="text-red-400 hover:text-red-600 transition p-1">
                    <FaTrash size={14} />
                  </button>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600">Question *</label>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => updateFaq(idx, "question", e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
                    placeholder="e.g., কিভাবে অর্ডার করবো?"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600">Answer *</label>
                  <textarea
                    value={faq.answer}
                    onChange={(e) => updateFaq(idx, "answer", e.target.value)}
                    rows="3"
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition resize-none"
                    placeholder="বিস্তারিত উত্তর লিখুন"
                  />
                </div>
              </div>
            ))}
          </div>

          {faqs.length > 0 && (
            <div className="mt-4 text-center">
              <button
                onClick={addFaq}
                className="border border-dashed border-rose-300 text-rose-500 hover:bg-rose-50 text-sm flex items-center gap-1 px-4 py-2 rounded-lg transition mx-auto"
              >
                <FaPlus size={12} /> Add Another FAQ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaqForm;