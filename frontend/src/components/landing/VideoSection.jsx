import { useState } from "react";
import { FiPlay, FiX } from "react-icons/fi";

const VideoSection = () => {
  const [showModal, setShowModal] = useState(false);

  // ডাইনামিক ডাটা - পরে API থেকে আসবে
  const videoData = {
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    videoId: "dQw4w9WgXcQ", // YouTube ভিডিও আইডি
    title: "আমাদের পণ্য সম্পর্কে জানুন",
    description: "কিভাবে আমাদের হারবাল পণ্য আপনার জীবনযাত্রায় পরিবর্তন আনতে পারে তা দেখুন",
  };

  return (
    <section className="section bg-gradient-light">
      <div className="container-custom">
        {/* সেকশন হেডার */}
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
            ভিডিও টিউটোরিয়াল
          </span>
          <h2 className="section-title">পণ্য সম্পর্কে বিস্তারিত জানুন</h2>
          <p className="section-subtitle">
            আমাদের পণ্য如何使用, এর উপকারিতা এবং ব্যবহার পদ্ধতি সম্পর্কে ভিডিওতে দেখুন
          </p>
        </div>

        {/* ভিডিও কার্ড */}
        <div className="max-w-4xl mx-auto">
          <div className="relative group rounded-2xl overflow-hidden shadow-2xl">
            {/* থাম্বনেইল */}
            <div 
              className="relative aspect-video bg-cover bg-center cursor-pointer"
              style={{ backgroundImage: `url(${videoData.thumbnail})` }}
              onClick={() => setShowModal(true)}
            >
              {/* ওভারলে */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                {/* প্লে বাটন */}
                <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <FiPlay size={32} className="text-white ml-1" />
                </div>
              </div>
              
              {/* ভিডিও তথ্য */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3 className="text-white text-xl font-bold mb-1">{videoData.title}</h3>
                <p className="text-white/80 text-sm">{videoData.description}</p>
              </div>
            </div>
          </div>

          {/* ভিডিওর নিচের বর্ণনা */}
          <div className="mt-8 text-center">
            <p className="text-neutral-600">
              ভিডিওটি দেখে জানুন কিভাবে আমাদের পণ্য ব্যবহার করবেন এবং এর উপকারিতা সম্পর্কে
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <span>⏱️ ২:৩০ মিনিট</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <span>👁️ ১০K+ ভিউ</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <span>👍 ৯৫% পছন্দ করেছেন</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* মোডাল পপআপ (ভিডিও দেখানোর জন্য) */}
      {showModal && (
        <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
          {/* ব্যাকড্রপ */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          
          {/* মোডাল কনটেন্ট */}
          <div className="relative bg-white rounded-2xl max-w-4xl w-full overflow-hidden animate-scaleIn">
            {/* হেডার */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold text-neutral-800">{videoData.title}</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-neutral-100 rounded-full transition"
              >
                <FiX size={20} />
              </button>
            </div>
            
            {/* ভিডিও */}
            <div className="aspect-video">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoData.videoId}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default VideoSection;