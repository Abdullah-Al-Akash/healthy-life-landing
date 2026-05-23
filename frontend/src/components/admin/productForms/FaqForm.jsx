import { FaPlus, FaTrash } from "react-icons/fa";

const FaqForm = ({ data, onChange }) => {
  const faqs = data.faqs || [];
  const contactInfo = data.contactInfo || { facebook: "", whatsapp: "", phone: "" };
  const sectionHeadings = data.sectionHeadings || {};
  const contactHeading = data.contactHeading || {};
  const buttonText = data.buttonText || "এখনই অর্ডার করুন";
  const supportHours = data.supportHours || "সকাল ৯টা - রাত ১০টা (শুক্রবার বন্ধ)";

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
      
      {/* FAQ লিস্ট */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-md font-semibold text-gray-800">FAQs</h3>
          <button
            onClick={addFaq}
            className="text-rose-500 hover:text-rose-600 text-sm flex items-center gap-1 px-3 py-1.5 border border-rose-200 rounded-lg hover:bg-rose-50 transition"
          >
            <FaPlus size={12} /> Add FAQ
          </button>
        </div>

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
                <button onClick={() => removeFaq(idx)} className="text-red-400 hover:text-red-600">
                  <FaTrash size={14} />
                </button>
              </div>

              <div>
                <label className="text-xs text-gray-500">Question *</label>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => updateFaq(idx, "question", e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  placeholder="e.g., কিভাবে অর্ডার করবো?"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">Answer *</label>
                <textarea
                  value={faq.answer}
                  onChange={(e) => updateFaq(idx, "answer", e.target.value)}
                  rows="3"
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
                  placeholder="Detailed answer to the question"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ সেকশন হেডিং */}
      <div className="border-t pt-4">
        <h3 className="text-md font-semibold text-gray-800 mb-3">FAQ Section Headings</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500">Title</label>
            <input
              type="text"
              value={sectionHeadings.faq?.title || ""}
              onChange={(e) => updateSectionHeading("faq", "title", e.target.value)}
              placeholder="প্রায়শই জিজ্ঞাসিত প্রশ্ন"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Highlight Text (যে অংশ রঙিন হবে)</label>
            <input
              type="text"
              value={sectionHeadings.faq?.highlightText || ""}
              onChange={(e) => updateSectionHeading("faq", "highlightText", e.target.value)}
              placeholder="প্রশ্ন"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Subtitle</label>
            <textarea
              value={sectionHeadings.faq?.subtitle || ""}
              onChange={(e) => updateSectionHeading("faq", "subtitle", e.target.value)}
              rows="2"
              placeholder="আপনার মনে হতে পারে এমন কিছু সাধারণ প্রশ্নের উত্তর জেনে নিন"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
            />
          </div>
        </div>
      </div>

      {/* কন্টাক্ট সেকশন হেডিং */}
      <div className="border-t pt-4">
        <h3 className="text-md font-semibold text-gray-800 mb-3">Contact Section Headings</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500">Title</label>
            <input
              type="text"
              value={contactHeading.title || ""}
              onChange={(e) => updateContactHeading("title", e.target.value)}
              placeholder="এখনও প্রশ্ন আছে?"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Subtitle</label>
            <textarea
              value={contactHeading.subtitle || ""}
              onChange={(e) => updateContactHeading("subtitle", e.target.value)}
              rows="2"
              placeholder="আমাদের সাথে সরাসরি যোগাযোগ করুন। আমরা ২৪/৭ ঘন্টা আপনার পাশে আছি।"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Hotline Label</label>
            <input
              type="text"
              value={contactHeading.hotlineLabel || ""}
              onChange={(e) => updateContactHeading("hotlineLabel", e.target.value)}
              placeholder="হটলাইন:"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      {/* কন্টাক্ট ইনফো */}
      <div className="border-t pt-4">
        <h3 className="text-md font-semibold text-gray-800 mb-3">Contact Information</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500">Facebook URL</label>
            <input
              type="text"
              value={contactInfo.facebook}
              onChange={(e) => updateContactInfo("facebook", e.target.value)}
              placeholder="https://facebook.com/yourpage"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">WhatsApp URL</label>
            <input
              type="text"
              value={contactInfo.whatsapp}
              onChange={(e) => updateContactInfo("whatsapp", e.target.value)}
              placeholder="https://wa.me/8801xxxxxxxxx"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Phone Number</label>
            <input
              type="text"
              value={contactInfo.phone}
              onChange={(e) => updateContactInfo("phone", e.target.value)}
              placeholder="+8801xxxxxxxxx"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Support Hours</label>
            <input
              type="text"
              value={supportHours}
              onChange={(e) => onChange("supportHours", e.target.value)}
              placeholder="সকাল ৯টা - রাত ১০টা (শুক্রবার বন্ধ)"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      {/* বাটন টেক্সট */}
      <div className="border-t pt-4">
        <h3 className="text-md font-semibold text-gray-800 mb-3">Button Settings</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500">Button Text</label>
            <input
              type="text"
              value={buttonText}
              onChange={(e) => onChange("buttonText", e.target.value)}
              placeholder="এখনই অর্ডার করুন"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqForm;