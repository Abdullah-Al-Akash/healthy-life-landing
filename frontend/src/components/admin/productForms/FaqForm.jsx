import {
  FaPlus,
  FaTrash,
  FaHeading,
  FaInfoCircle,
  FaFacebook,
  FaWhatsapp,
  FaPhoneAlt,
  FaClock,
} from "react-icons/fa";
import { useState, useEffect } from "react";

const FaqForm = ({ data, onChange }) => {
  // কম্পোনেন্টের শুরুতে
  console.log("Received FAQ data:", data);
  const faqs = data.faqs || [];
  const contactInfo = data.contactInfo || {
    facebook: "",
    whatsapp: "",
    phone: "",
  };
  const sectionHeadings = data.sectionHeadings || {};
  const contactHeading = data.contactHeading || {};

  // লোকাল স্টেট - সব ফিল্ডের জন্য
  const [localButtonText, setLocalButtonText] = useState("");
  const [localSupportHours, setLocalSupportHours] = useState("");
  const [localContactHeading, setLocalContactHeading] = useState({
    title: "",
    subtitle: "",
    hotlineLabel: "",
  });
  const [localContactInfo, setLocalContactInfo] = useState({
    facebook: "",
    whatsapp: "",
    phone: "",
  });
  const [localSectionHeadingFaq, setLocalSectionHeadingFaq] = useState({
    title: "",
    highlightText: "",
    subtitle: "",
  });

  // 🔥 সব ডাটা আপডেট করার জন্য useEffect
  useEffect(() => {
    // বাটন টেক্সট
    setLocalButtonText(data.buttonTexts?.faq || "");

    // সাপোর্ট আওয়ার
    setLocalSupportHours(data.supportHours || "");

    // কন্টাক্ট হেডিং
    if (data.contactHeading) {
      setLocalContactHeading({
        title: data.contactHeading.title || "",
        subtitle: data.contactHeading.subtitle || "",
        hotlineLabel: data.contactHeading.hotlineLabel || "",
      });
    }

    // কন্টাক্ট ইনফো
    if (data.contactInfo) {
      setLocalContactInfo({
        facebook: data.contactInfo.facebook || "",
        whatsapp: data.contactInfo.whatsapp || "",
        phone: data.contactInfo.phone || "",
      });
    }

    // FAQ সেকশন হেডিং
    if (data.sectionHeadings?.faq) {
      setLocalSectionHeadingFaq({
        title: data.sectionHeadings.faq.title || "",
        highlightText: data.sectionHeadings.faq.highlightText || "",
        subtitle: data.sectionHeadings.faq.subtitle || "",
      });
    }
  }, [
    data.buttonTexts?.faq,
    data.supportHours,
    data.contactHeading,
    data.contactInfo,
    data.sectionHeadings?.faq,
  ]);

  // বাটন টেক্সট পরিবর্তন
  const handleButtonTextChange = (e) => {
    const newValue = e.target.value;
    setLocalButtonText(newValue);
    onChange("buttonTexts", {
      ...data.buttonTexts,
      faq: newValue,
    });
  };

  // সাপোর্ট আওয়ার পরিবর্তন
  const handleSupportHoursChange = (e) => {
    const newValue = e.target.value;
    setLocalSupportHours(newValue);
    onChange("supportHours", newValue);
  };

  // কন্টাক্ট হেডিং পরিবর্তন
  const handleContactHeadingChange = (field, value) => {
    const updated = { ...localContactHeading, [field]: value };
    setLocalContactHeading(updated);
    onChange("contactHeading", updated);
  };

  // কন্টাক্ট ইনফো পরিবর্তন
  const handleContactInfoChange = (field, value) => {
    const updated = { ...localContactInfo, [field]: value };
    setLocalContactInfo(updated);
    onChange("contactInfo", updated);
  };

  // FAQ সেকশন হেডিং পরিবর্তন
  const handleSectionHeadingFaqChange = (field, value) => {
    const updated = { ...localSectionHeadingFaq, [field]: value };
    setLocalSectionHeadingFaq(updated);
    onChange("sectionHeadings", {
      ...data.sectionHeadings,
      faq: updated,
    });
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

  return (
    <div className="space-y-6">
      {/* ========== ১. FAQ সেকশন হেডিং ========== */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 px-4 py-3 border-b">
          <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
            <FaHeading className="text-rose-500" /> FAQ Section Headings
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            FAQ সেকশনের শিরোনাম ও বিবরণ সেট করুন
          </p>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600">Title</label>
            <input
              type="text"
              value={localSectionHeadingFaq.title}
              onChange={(e) =>
                handleSectionHeadingFaqChange("title", e.target.value)
              }
              placeholder="প্রায়শই জিজ্ঞাসিত প্রশ্ন"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">
              Highlight Text
            </label>
            <input
              type="text"
              value={localSectionHeadingFaq.highlightText}
              onChange={(e) =>
                handleSectionHeadingFaqChange("highlightText", e.target.value)
              }
              placeholder="প্রশ্ন"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">
              Subtitle
            </label>
            <textarea
              value={localSectionHeadingFaq.subtitle}
              onChange={(e) =>
                handleSectionHeadingFaqChange("subtitle", e.target.value)
              }
              rows="2"
              placeholder="আপনার মনে হতে পারে এমন কিছু সাধারণ প্রশ্নের উত্তর জেনে নিন"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
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
          <p className="text-xs text-gray-500 mt-0.5">
            যোগাযোগ সেকশনের শিরোনাম সেট করুন
          </p>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600">Title</label>
            <input
              type="text"
              value={localContactHeading.title}
              onChange={(e) =>
                handleContactHeadingChange("title", e.target.value)
              }
              placeholder="এখনও প্রশ্ন আছে?"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">
              Subtitle
            </label>
            <textarea
              value={localContactHeading.subtitle}
              onChange={(e) =>
                handleContactHeadingChange("subtitle", e.target.value)
              }
              rows="2"
              placeholder="আমাদের সাথে সরাসরি যোগাযোগ করুন। আমরা ২৪/৭ ঘন্টা আপনার পাশে আছি।"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">
              Hotline Label
            </label>
            <input
              type="text"
              value={localContactHeading.hotlineLabel}
              onChange={(e) =>
                handleContactHeadingChange("hotlineLabel", e.target.value)
              }
              placeholder="হটলাইন:"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
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
          <p className="text-xs text-gray-500 mt-0.5">
            সোশ্যাল মিডিয়া ও যোগাযোগের তথ্য দিন
          </p>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600 flex items-center gap-2">
              <FaFacebook className="text-blue-600" /> Facebook URL
            </label>
            <input
              type="text"
              value={localContactInfo.facebook}
              onChange={(e) =>
                handleContactInfoChange("facebook", e.target.value)
              }
              placeholder="https://facebook.com/yourpage"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 flex items-center gap-2">
              <FaWhatsapp className="text-green-500" /> WhatsApp URL
            </label>
            <input
              type="text"
              value={localContactInfo.whatsapp}
              onChange={(e) =>
                handleContactInfoChange("whatsapp", e.target.value)
              }
              placeholder="https://wa.me/8801xxxxxxxxx"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 flex items-center gap-2">
              <FaPhoneAlt className="text-rose-500" /> Phone Number
            </label>
            <input
              type="text"
              value={localContactInfo.phone}
              onChange={(e) => handleContactInfoChange("phone", e.target.value)}
              placeholder="+8801xxxxxxxxx"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
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
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      {/* ========== ৪. বাটন টেক্সট সেটিংস ========== */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 px-4 py-3 border-b">
          <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
            🔘 Button Settings
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            FAQ সেকশনের অর্ডার বাটনের টেক্সট সেট করুন
          </p>
        </div>
        <div className="p-4">
          <div>
            <label className="text-xs font-medium text-gray-600">
              Button Text
            </label>
            <input
              type="text"
              value={localButtonText}
              onChange={handleButtonTextChange}
              placeholder="এখনই অর্ডার করুন"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
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
            <p className="text-xs text-gray-500 mt-0.5">
              প্রশ্ন ও উত্তর এখানে যোগ করুন
            </p>
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
              <p className="text-gray-400 text-sm">
                No FAQs added. Click "Add FAQ" to create one.
              </p>
            </div>
          )}

          <div className="space-y-5">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-xl p-4 space-y-3 relative bg-white shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    FAQ #{idx + 1}
                  </span>
                  <button
                    onClick={() => removeFaq(idx)}
                    className="text-red-400 hover:text-red-600 transition p-1"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600">
                    Question *
                  </label>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => updateFaq(idx, "question", e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    placeholder="e.g., কিভাবে অর্ডার করবো?"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600">
                    Answer *
                  </label>
                  <textarea
                    value={faq.answer}
                    onChange={(e) => updateFaq(idx, "answer", e.target.value)}
                    rows="3"
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
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
