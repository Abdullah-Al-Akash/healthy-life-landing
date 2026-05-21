import { 
  FaLeaf, 
  FaTruck, 
  FaShieldAlt, 
  FaSmile, 
  FaHeadset, 
  FaCertificate 
} from "react-icons/fa";

const WhyChooseUs = () => {
  // ডাইনামিক ডাটা - পরে API থেকে আসবে
  const features = [
    {
      id: 1,
      icon: <FaLeaf className="w-6 h-6 md:w-7 md:h-7" />,
      title: "১০০% খাঁটি পণ্য",
      description: "প্রাকৃতিক উপাদানে তৈরি, কোনো কেমিক্যাল বা প্রিজারভেটিভ নেই",
    },
    {
      id: 2,
      icon: <FaTruck className="w-6 h-6 md:w-7 md:h-7" />,
      title: "দ্রুত ডেলিভারি",
      description: "সারাদেশে ২৪-৪৮ ঘণ্টার মধ্যে পণ্য পৌঁছে দিন",
    },
    {
      id: 3,
      icon: <FaShieldAlt className="w-6 h-6 md:w-7 md:h-7" />,
      title: "নিরাপদ পেমেন্ট",
      description: "ক্যাশ অন ডেলিভারি ও অনলাইন পেমেন্ট সুবিধা",
    },
    {
      id: 4,
      icon: <FaSmile className="w-6 h-6 md:w-7 md:h-7" />,
      title: "গ্রাহক সন্তুষ্টি",
      description: "৯৮% গ্রাহক আমাদের পণ্য ও সেবায় সন্তুষ্ট",
    },
    {
      id: 5,
      icon: <FaHeadset className="w-6 h-6 md:w-7 md:h-7" />,
      title: "২৪/৭ সাপোর্ট",
      description: "যেকোনো সমস্যায় আমাদের টিম আপনার পাশে",
    },
    {
      id: 6,
      icon: <FaCertificate className="w-6 h-6 md:w-7 md:h-7" />,
      title: "সনদপ্রাপ্ত পণ্য",
      description: "গুণগত মানের সার্টিফিকেট প্রাপ্ত ও অনুমোদিত",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* সেকশন টাইটেল */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            কেন বেছে নেবেন <span className="text-rose-500">আমাদের?</span>
          </h2>
          <div className="w-24 h-1 bg-rose-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            আমরা চাই আপনাকে সেরা সেবা ও মানসম্মত পণ্য দিতে। জেনে নিন কেন আমরা সবার প্রথম পছন্দ।
          </p>
        </div>

        {/* ফিচার গ্রিড */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className="group bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* আইকন */}
              <div className="w-14 h-14 md:w-16 md:h-16 bg-rose-50 rounded-xl flex items-center justify-center mb-5 text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300">
                {feature.icon}
              </div>
              
              {/* টাইটেল */}
              <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              
              {/* বিবরণ */}
              <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* অর্ডার ব্যানার */}
        <div className="mt-16 bg-gradient-to-r from-rose-500 to-rose-600 rounded-2xl p-8 md:p-10 text-center text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">
            আজই অর্ডার করুন ও পান বিশেষ ছাড়!
          </h3>
          <p className="text-rose-100 mb-6 max-w-2xl mx-auto">
            সীমিত সময়ের অফার। দেরি না করে এখনই অর্ডার করুন।
          </p>
          <button className="bg-white text-rose-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
            এখনই অর্ডার করুন →
          </button>
        </div>

        {/* পরিসংখ্যান */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-2xl md:text-3xl font-bold text-rose-500">১০,০০০+</div>
            <div className="text-gray-600 text-sm mt-1">খুশি গ্রাহক</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-2xl md:text-3xl font-bold text-rose-500">৯৮%</div>
            <div className="text-gray-600 text-sm mt-1">সন্তুষ্টি হার</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-2xl md:text-3xl font-bold text-rose-500">২৪/৭</div>
            <div className="text-gray-600 text-sm mt-1">সাপোর্ট</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-2xl md:text-3xl font-bold text-rose-500">৫০+</div>
            <div className="text-gray-600 text-sm mt-1">পণ্যলাইন</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;