import { FiTruck, FiShield, FiClock, FiRefreshCw } from "react-icons/fi";

const DeliveryInfo = () => {
  // ডাইনামিক ডাটা - পরে API থেকে আসবে
  const deliveryFeatures = [
    {
      id: 1,
      icon: <FiTruck size={32} />,
      title: "ফ্রি ডেলিভারি",
      description: "সারাদেশে ৫০০ টাকার অর্ডারে ফ্রি ডেলিভারি",
    },
    {
      id: 2,
      icon: <FiClock size={32} />,
      title: "দ্রুত ডেলিভারি",
      description: "অর্ডার করার ২৪-৪৮ ঘন্টার মধ্যে ডেলিভারি",
    },
    {
      id: 3,
      icon: <FiShield size={32} />,
      title: "নিরাপদ পেমেন্ট",
      description: "ক্যাশ অন ডেলিভারি ও অনলাইন পেমেন্ট",
    },
    {
      id: 4,
      icon: <FiRefreshCw size={32} />,
      title: "সহজ রিটার্ন",
      description: "৭ দিনের মধ্যে টাকা ফেরতের গ্যারান্টি",
    },
  ];

  return (
    <section className="section">
      <div className="container-custom">
        {/* সেকশন হেডার */}
        <div className="text-center mb-12">
          <h2 className="section-title">ডেলিভারি ও সেবা তথ্য</h2>
          <p className="section-subtitle">
            আমরা চাই আপনাকে সেরা সেবা দিতে। জেনে নিন আমাদের ডেলিভারি ও সার্ভিস সম্পর্কে।
          </p>
        </div>

        {/* ফিচার গ্রিড */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {deliveryFeatures.map((feature) => (
            <div
              key={feature.id}
              className="card text-center p-6 group hover:-translate-y-2 transition-all duration-300"
            >
              {/* আইকন */}
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary-50 rounded-full text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
              </div>
              
              {/* টাইটেল */}
              <h3 className="text-xl font-bold text-neutral-800 mb-2">
                {feature.title}
              </h3>
              
              {/* বিবরণ */}
              <p className="text-neutral-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* অতিরিক্ত ডেলিভারি তথ্য */}
        <div className="mt-12 p-6 bg-white rounded-2xl shadow-md border border-primary-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary-100 p-2 rounded-full">
                <FiTruck className="text-primary-600" size={24} />
              </div>
              <div>
                <p className="font-semibold text-neutral-800">ঢাকা সিটি কর্পোরেশন এলাকায়</p>
                <p className="text-sm text-neutral-600">অর্ডার করার ২৪ ঘন্টার মধ্যে ডেলিভারি</p>
              </div>
            </div>
            <div className="w-px h-8 bg-neutral-300 hidden md:block"></div>
            <div className="flex items-center gap-3">
              <div className="bg-primary-100 p-2 rounded-full">
                <FiClock className="text-primary-600" size={24} />
              </div>
              <div>
                <p className="font-semibold text-neutral-800">ঢাকার বাইরে</p>
                <p className="text-sm text-neutral-600">অর্ডার করার ৪৮-৭২ ঘন্টার মধ্যে ডেলিভারি</p>
              </div>
            </div>
            <div className="w-px h-8 bg-neutral-300 hidden md:block"></div>
            <div className="flex items-center gap-3">
              <div className="bg-primary-100 p-2 rounded-full">
                <FiShield className="text-primary-600" size={24} />
              </div>
              <div>
                <p className="font-semibold text-neutral-800">কুরিয়ার সার্ভিস</p>
                <p className="text-sm text-neutral-600">Steadfast, Pathao, Sundarban, RedX</p>
              </div>
            </div>
          </div>
        </div>

        {/* স্ট্যাটাস বার */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-center text-sm text-neutral-500">
          <span>✅ ১০,০০০+ সফল ডেলিভারি</span>
          <span>⭐ ৪.৮ রেটিং (১০০০+ রিভিউ)</span>
          <span>🏆 বাংলাদেশের সেরা অনলাইন স্টোর ২০২৪</span>
        </div>
      </div>
    </section>
  );
};

export default DeliveryInfo;