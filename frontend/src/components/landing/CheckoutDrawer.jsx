import { useState, useEffect } from "react";
import { FaTimes, FaShoppingBag, FaTruck, FaShieldAlt, FaWhatsapp, FaCopy, FaCheck, FaExternalLinkAlt } from "react-icons/fa";
import { orderApi } from "../../api/order";

const CheckoutDrawer = ({ isOpen, onClose, product }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    deliveryArea: "inside_dhaka",
    note: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [copied, setCopied] = useState(false);

  const deliveryCharge = {
    inside_dhaka: 60,
    outside_dhaka: 120,
  };

  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (product) {
      const productPrice = parseInt(product.offerPrice) || 0;
      const delivery = deliveryCharge[formData.deliveryArea] || 0;
      setTotalPrice(productPrice + delivery);
    }
  }, [product, formData.deliveryArea]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSubmitMessage({ type: "", text: "" });
  };

  const handleClose = () => {
    document.body.style.overflow = "auto";
    onClose();
    setFormData({
      name: "",
      phone: "",
      address: "",
      deliveryArea: "inside_dhaka",
      note: "",
    });
    setSubmitMessage({ type: "", text: "" });
    setShowSuccessModal(false);
    setOrderData(null);
  };

  const copyOrderId = () => {
    if (orderData?.orderId) {
      navigator.clipboard.writeText(orderData.orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage({ type: "", text: "" });

    const orderDataToSend = {
      customerInfo: {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        deliveryArea: formData.deliveryArea,
        note: formData.note,
      },
      productId: product?.id,
      productTitle: product?.title,
      productPrice: product?.offerPrice,
      deliveryCharge: deliveryCharge[formData.deliveryArea],
      totalPrice: totalPrice,
    };

    try {
      const response = await orderApi.create(orderDataToSend);
      
      if (response.data.success) {
        setOrderData(response.data.order);
        setShowSuccessModal(true);
        setSubmitMessage({ type: "success", text: "অর্ডার সফলভাবে সম্পন্ন হয়েছে!" });
        
        // ড্রয়ার বন্ধ করবো না, মোডাল দেখাবো
      } else {
        setSubmitMessage({ type: "error", text: response.data.message || "অর্ডার করতে সমস্যা হয়েছে" });
      }
    } catch (error) {
      console.error("Order error:", error);
      setSubmitMessage({ 
        type: "error", 
        text: error.response?.data?.message || "সার্ভারে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* ব্যাকড্রপ */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300"
        style={{ zIndex: 99999 }}
        onClick={handleClose}
      />

      {/* ড্রয়ার */}
      <div
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl overflow-y-auto"
        style={{ zIndex: 100000, animation: "slideInRight 0.3s ease-out" }}
      >
        {/* হেডার */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
              <FaShoppingBag className="text-rose-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">অর্ডার করুন</h2>
              <p className="text-xs text-gray-500">ক্যাশ অন ডেলিভারি</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full">
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* সাকসেস/এরর মেসেজ */}
        {submitMessage.text && !showSuccessModal && (
          <div className={`m-4 p-3 rounded-lg text-sm ${
            submitMessage.type === "success" 
              ? "bg-green-50 text-green-700 border border-green-200" 
              : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {submitMessage.text}
          </div>
        )}

        {/* প্রোডাক্ট ইনফো */}
        {product && (
          <div className="p-4 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100">
            <div className="flex gap-3">
              <img
                src={product.image || "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=1200"}
                alt={product.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-sm">{product.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-rose-500 font-bold text-lg">৳{product.offerPrice}</span>
                  {product.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">৳{product.originalPrice}</span>
                  )}
                </div>
                <span className="inline-block bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full mt-1">
                  স্টকে আছে
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ফর্ম */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              আপনার নাম <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="আপনার সম্পূর্ণ নাম"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ফোন নম্বর <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="০১XXXXXXXXX"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              সম্পূর্ণ ঠিকানা <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="address"
              required
              rows="2"
              value={formData.address}
              onChange={handleChange}
              placeholder="বাড়ির ঠিকানা, রোড, এলাকা"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ডেলিভারি এলাকা <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition ${
                  formData.deliveryArea === "inside_dhaka"
                    ? "border-rose-500 bg-rose-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="deliveryArea"
                  value="inside_dhaka"
                  checked={formData.deliveryArea === "inside_dhaka"}
                  onChange={handleChange}
                  className="hidden"
                />
                <FaTruck className={formData.deliveryArea === "inside_dhaka" ? "text-rose-500" : "text-gray-400"} />
                <div>
                  <p className="font-medium text-sm">ঢাকার ভিতরে</p>
                  <p className="text-xs text-gray-500">চার্জ: ৬০ টাকা</p>
                </div>
              </label>

              <label
                className={`flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition ${
                  formData.deliveryArea === "outside_dhaka"
                    ? "border-rose-500 bg-rose-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="deliveryArea"
                  value="outside_dhaka"
                  checked={formData.deliveryArea === "outside_dhaka"}
                  onChange={handleChange}
                  className="hidden"
                />
                <FaTruck className={formData.deliveryArea === "outside_dhaka" ? "text-rose-500" : "text-gray-400"} />
                <div>
                  <p className="font-medium text-sm">ঢাকার বাইরে</p>
                  <p className="text-xs text-gray-500">চার্জ: ১২০ টাকা</p>
                </div>
              </label>
            </div>
          </div>

          {/* পেমেন্ট মেথড - COD */}
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="flex items-center gap-2">
              <FaTruck className="text-green-500" />
              <span className="font-medium text-green-700">ক্যাশ অন ডেলিভারি (COD)</span>
            </div>
            <p className="text-xs text-green-600 mt-1">পণ্য হাতে পেয়ে টাকা দিন</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              অতিরিক্ত নোট (যদি থাকে)
            </label>
            <textarea
              name="note"
              rows="2"
              value={formData.note}
              onChange={handleChange}
              placeholder="যেমন: গেট নাম্বার, ফ্ল্যাট নম্বর ইত্যাদি"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition resize-none"
            />
          </div>

          {/* ডেলিভারি তথ্য */}
          <div className="bg-gray-50 rounded-lg p-3 text-sm">
            <div className="flex items-center gap-2 mb-2">
              <FaTruck className="text-rose-500" />
              <span className="font-medium">ডেলিভারি তথ্য</span>
            </div>
            <p className="text-gray-600 text-xs">
              {formData.deliveryArea === "inside_dhaka"
                ? "ঢাকায় ২৪ ঘন্টার মধ্যে ডেলিভারি"
                : "ঢাকার বাইরে ২-৩ কর্মদিবসের মধ্যে ডেলিভারি"}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <FaShieldAlt className="text-rose-500" />
              <span className="font-medium">নিরাপদ পেমেন্ট</span>
            </div>
            <p className="text-gray-600 text-xs">ক্যাশ অন ডেলিভারি সুবিধা</p>
          </div>

          {/* হোয়াটসঅ্যাপ সাপোর্ট */}
          <div className="bg-green-50 rounded-lg p-3 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaWhatsapp className="text-green-500 text-xl" />
              <div>
                <p className="font-medium text-gray-800">হোয়াটসঅ্যাপ সাপোর্ট</p>
                <p className="text-xs text-gray-500">যেকোনো সমস্যায় যোগাযোগ করুন</p>
              </div>
            </div>
            <a href="https://wa.me/8801xxxxxxxxx" className="text-green-600 text-sm font-semibold">
              মেসেজ করুন
            </a>
          </div>

          {/* টোটাল প্রাইস */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">পণ্যের মূল্য:</span>
              <span className="font-semibold">৳{product?.offerPrice}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">ডেলিভারি চার্জ:</span>
              <span className="font-semibold">৳{deliveryCharge[formData.deliveryArea]}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-200">
              <span className="text-gray-800 font-bold">মোট মূল্য:</span>
              <span className="text-xl font-bold text-rose-500">৳{totalPrice}</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">ক্যাশ অন ডেলিভারিতে টাকা দিতে পারবেন</p>
          </div>

          {/* সাবমিট বাটন */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                প্রসেসিং...
              </span>
            ) : (
              `অর্ডার কনফার্ম করুন (৳${totalPrice})`
            )}
          </button>
        </form>
      </div>

      {/* সাকসেস মোডাল */}
      {showSuccessModal && orderData && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[200000] p-4"
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 text-center animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* সাকসেস আইকন */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-2">অর্ডার সফল হয়েছে!</h3>
            <p className="text-gray-500 text-sm mb-4">আপনার অর্ডারটি সফলভাবে সম্পন্ন হয়েছে।</p>

            {/* অর্ডার আইডি */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-500 mb-1">আপনার অর্ডার আইডি</p>
              <div className="flex items-center justify-center gap-2">
                <code className="text-lg font-mono font-bold text-rose-600">{orderData.orderId}</code>
                <button
                  onClick={copyOrderId}
                  className="p-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
                  title="কপি করুন"
                >
                  {copied ? <FaCheck className="text-green-500" size={14} /> : <FaCopy size={14} />}
                </button>
              </div>
              {copied && <p className="text-xs text-green-500 mt-1">কপি হয়েছে!</p>}
            </div>

            {/* ট্র্যাকিং বাটন */}
            <button
              onClick={() => {
                setShowSuccessModal(false);
                window.location.href = `/track-order?orderId=${orderData.orderId}`;
              }}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 mb-3 hover:scale-105 transition"
            >
              <FaExternalLinkAlt size={14} />
              অর্ডার ট্র্যাক করুন
            </button>

            {/* ক্লোজ বাটন */}
            <button
              onClick={() => {
                setShowSuccessModal(false);
                handleClose();
              }}
              className="w-full border border-gray-300 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              ঠিক আছে
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default CheckoutDrawer;