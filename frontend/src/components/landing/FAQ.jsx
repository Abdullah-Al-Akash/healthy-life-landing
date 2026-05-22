import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { FaFacebook, FaWhatsapp, FaPhoneAlt } from "react-icons/fa";
import { useState as useStateHook } from "react";
import CheckoutDrawer from "./CheckoutDrawer";

const FAQ = ({ faqs = [], contactInfo = {} }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useStateHook(false);
  const [selectedProduct, setSelectedProduct] = useStateHook(null);

  // ডিফল্ট FAQ (যদি API থেকে না আসে)
  const defaultFaqs = [
    {
      id: 1,
      question: "কিভাবে অর্ডার করবো?",
      answer: "আমাদের ওয়েবসাইটে পণ্য সিলেক্ট করে 'অর্ডার করুন' বাটনে ক্লিক করুন। তারপর আপনার নাম, ঠিকানা ও ফোন নম্বর দিন। অর্ডার কনফার্ম হওয়ার পর আমাদের টিম আপনার সাথে যোগাযোগ করবে।",
    },
    {
      id: 2,
      question: "পেমেন্ট এর পদ্ধতি কি কি?",
      answer: "আমরা ক্যাশ অন ডেলিভারি (COD), বিকাশ, নগদ, রকেট ও ব্যাংক ট্রান্সফার সুবিধা প্রদান করি। অর্ডার করার সময় আপনার পছন্দের পদ্ধতি সিলেক্ট করতে পারবেন।",
    },
    {
      id: 3,
      question: "ডেলিভারি কতদিন লাগে?",
      answer: "ঢাকা শহরে অর্ডার করার ২৪ ঘন্টার মধ্যে এবং ঢাকার বাইরে ২-৩ কর্মদিবসের মধ্যে ডেলিভারি সম্পন্ন হয়।",
    },
    {
      id: 4,
      question: "প্রোডাক্ট রিটার্ন বা রিফান্ড নীতি কি?",
      answer: "পণ্য ডেলিভারির ৭ দিনের মধ্যে যদি কোনো সমস্যা হয় তাহলে আপনি রিটার্ন করতে পারবেন। পণ্য অক্ষত অবস্থায় ফেরত দিলে আমরা টাকা রিফান্ড করে দেবো।",
    },
    {
      id: 5,
      question: "পণ্যের কোয়ালিটি কেমন?",
      answer: "আমাদের সব পণ্য ১০০% খাঁটি ও জৈব। প্রতিটি পণ্য মান নিয়ন্ত্রণ বিভাগ দ্বারা পরীক্ষিত হয়ে ডেলিভারি দেওয়া হয়।",
    },
    {
      id: 6,
      question: "বাল্ক অর্ডার করলে ডিসকাউন্ট পাওয়া যাবে?",
      answer: "হ্যাঁ, ১০ পিসের বেশি অর্ডার করলে বিশেষ ডিসকাউন্ট দেওয়া হবে। বিস্তারিত জানতে আমাদের হটলাইনে যোগাযোগ করুন।",
    },
  ];

  // ডিফল্ট যোগাযোগ তথ্য
  const defaultContactInfo = {
    facebook: "https://facebook.com/herbalcare",
    whatsapp: "https://wa.me/8801xxxxxxxxx",
    phone: "+8801xxxxxxxxx",
  };

  const displayFaqs = faqs.length > 0 ? faqs : defaultFaqs;
  const displayContactInfo = Object.keys(contactInfo).length > 0 ? contactInfo : defaultContactInfo;

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleOrderClick = () => {
    setSelectedProduct({
      id: "faq-product",
      title: "সেরা হারবাল পণ্য",
      offerPrice: "২৯৯",
      image: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=1200",
    });
    setIsDrawerOpen(true);
  };

  return (
    <>
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* সেকশন টাইটেল */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              প্রায়শই জিজ্ঞাসিত <span className="text-rose-500">প্রশ্ন</span>
            </h2>
            <div className="w-24 h-1 bg-rose-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
              আপনার মনে হতে পারে এমন কিছু সাধারণ প্রশ্নের উত্তর জেনে নিন
            </p>
          </div>

          {/* FAQ লিস্ট */}
          <div className="space-y-4">
            {displayFaqs.map((faq, index) => (
              <div
                key={faq.id || index}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
              >
                {/* প্রশ্ন (হেডার) */}
                <button
                  className="w-full px-6 py-4 md:px-8 md:py-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="text-base md:text-lg font-semibold text-gray-800">
                    {faq.question}
                  </span>
                  <span className="text-rose-500 ml-4">
                    {openIndex === index ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                  </span>
                </button>

                {/* উত্তর (কন্টেন্ট) */}
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  } overflow-hidden`}
                >
                  <div className="px-6 pb-4 md:px-8 md:pb-5">
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* যোগাযোগ সেকশন */}
          <div className="mt-12 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-6 md:p-10">
            <div className="text-center mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                এখনও প্রশ্ন আছে?
              </h3>
              <p className="text-gray-600">
                আমাদের সাথে সরাসরি যোগাযোগ করুন। আমরা ২৪/৭ ঘন্টা আপনার পাশে আছি।
              </p>
            </div>

            {/* সোশ্যাল ও কন্টাক্ট আইকন */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              {/* ফেসবুক */}
              <a
                href={displayContactInfo.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-[#1877F2] rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-300">
                  <FaFacebook className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <span className="text-xs md:text-sm text-gray-600 group-hover:text-[#1877F2] transition-colors">
                  ফেসবুক
                </span>
              </a>

              {/* হোয়াটসঅ্যাপ */}
              <a
                href={displayContactInfo.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-300">
                  <FaWhatsapp className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <span className="text-xs md:text-sm text-gray-600 group-hover:text-[#25D366] transition-colors">
                  হোয়াটসঅ্যাপ
                </span>
              </a>

              {/* ফোন */}
              <a
                href={`tel:${displayContactInfo.phone}`}
                className="group flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-rose-500 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-300">
                  <FaPhoneAlt className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <span className="text-xs md:text-sm text-gray-600 group-hover:text-rose-500 transition-colors">
                  ফোন করুন
                </span>
              </a>
            </div>

            {/* ফোন নাম্বার টেক্সট */}
            <div className="text-center mt-6">
              <p className="text-gray-500 text-sm">
                হটলাইন: <span className="font-semibold text-rose-600">{displayContactInfo.phone}</span>
              </p>
              <p className="text-gray-400 text-xs mt-1">
                সকাল ৯টা - রাত ১০টা (শুক্রবার বন্ধ)
              </p>
            </div>

            {/* অর্ডার বাটন */}
            <div className="text-center mt-6">
              <button
                onClick={handleOrderClick}
                className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
              >
                এখনই অর্ডার করুন
              </button>
            </div>
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

export default FAQ;