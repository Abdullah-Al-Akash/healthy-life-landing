import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaTruck, FaCheckCircle, FaSpinner, FaBox, FaMapMarkerAlt, FaCalendarAlt, FaMobileAlt, FaCopy, FaCheck, FaSearch, FaPhone, FaHashtag } from "react-icons/fa";
import { orderApi } from "../api/order";

const TrackOrder = () => {
  const [searchParams] = useSearchParams();
  const initialOrderId = searchParams.get("orderId") || "";
  
  const [query, setQuery] = useState(initialOrderId);
  const [searchType, setSearchType] = useState("orderId"); // orderId or phone
  const [order, setOrder] = useState(null);
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError("Please enter an Order ID or Phone number");
      return;
    }

    setLoading(true);
    setError(null);
    setOrder(null);
    setOrders(null);
    setSelectedOrder(null);

    try {
      const response = await orderApi.search(query);
      if (response.data.success) {
        if (response.data.type === "single") {
          setOrder(response.data.order);
        } else {
          setOrders(response.data.orders);
        }
      }
    } catch (err) {
      console.error("Search error:", err);
      setError(err.response?.data?.message || "No results found. Please check your input.");
    } finally {
      setLoading(false);
    }
  };

  const copyOrderId = (id) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <FaSpinner className="text-yellow-500 text-2xl" />;
      case "approved": return <FaCheckCircle className="text-blue-500 text-2xl" />;
      case "delivered": return <FaCheckCircle className="text-green-500 text-2xl" />;
      case "cancelled": return <FaCheckCircle className="text-red-500 text-2xl" />;
      default: return <FaBox className="text-gray-500 text-2xl" />;
    }
  };

  const getStatusText = (status) => {
    const texts = {
      pending: "Pending",
      approved: "Approved",
      delivered: "Delivered",
      cancelled: "Cancelled",
    };
    return texts[status] || status;
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-blue-100 text-blue-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  };

  const getStepIndex = (status) => {
    const steps = ["pending", "approved", "delivered"];
    return steps.indexOf(status);
  };

  const statusSteps = [
    { key: "pending", label: "Order Placed", icon: "📦", description: "অর্ডার গ্রহণ করা হয়েছে" },
    { key: "approved", label: "Order Approved", icon: "✅", description: "অর্ডার অনুমোদন করা হয়েছে" },
    { key: "delivered", label: "Delivered", icon: "🚚", description: "পণ্য ডেলিভারি সম্পন্ন" },
  ];

  // অর্ডার ডিটেইলস কম্পোনেন্ট
  const OrderDetails = ({ order, showCopy = true }) => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-gray-100">
          <div>
            <p className="text-sm text-gray-500">Order ID</p>
            <div className="flex items-center gap-2">
              <code className="text-xl font-mono font-bold text-gray-800">{order.orderId}</code>
              {showCopy && (
                <button
                  onClick={() => copyOrderId(order.orderId)}
                  className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  {copied ? <FaCheck className="text-green-500" size={14} /> : <FaCopy size={14} />}
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(order.orderStatus)}
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(order.orderStatus)}`}>
              {getStatusText(order.orderStatus)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="flex items-center gap-3">
            <FaCalendarAlt className="text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Order Date</p>
              <p className="text-sm font-medium">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaMobileAlt className="text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Payment Method</p>
              <p className="text-sm font-medium capitalize">{order.paymentMethod}</p>
            </div>
          </div>
        </div>
      </div>

      {/* স্ট্যাটাস ট্র্যাকার */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-6">Order Status</h3>
        <div className="relative">
          <div className="absolute left-6 top-8 right-6 h-0.5 bg-gray-200 hidden md:block" />
          <div className="flex flex-col md:flex-row justify-between gap-4">
            {statusSteps.map((step, index) => {
              const currentStep = getStepIndex(order.orderStatus);
              const isCompleted = index <= currentStep;
              const isCurrent = index === currentStep;
              
              return (
                <div key={step.key} className="flex-1 text-center relative">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-all duration-300 ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-400"
                    } ${isCurrent ? "ring-4 ring-rose-200" : ""}`}
                  >
                    <span className="text-xl">{step.icon}</span>
                  </div>
                  <p className={`font-medium text-sm ${isCompleted ? "text-gray-800" : "text-gray-400"}`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {order.orderStatus === "cancelled" && (
          <div className="mt-6 p-4 bg-red-50 rounded-xl text-center">
            <p className="text-red-600">This order has been cancelled.</p>
          </div>
        )}
      </div>

      {/* প্রোডাক্ট এবং কাস্টমার ইনফো */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaBox className="text-rose-500" /> Product Information
          </h3>
          <div className="space-y-3">
            <p><span className="text-gray-500 text-sm">Product:</span> <span className="font-medium">{order.productTitle}</span></p>
            <p><span className="text-gray-500 text-sm">Price:</span> <span className="font-medium">৳{order.productPrice}</span></p>
            <p><span className="text-gray-500 text-sm">Delivery Charge:</span> <span className="font-medium">৳{order.deliveryCharge}</span></p>
            <div className="border-t pt-2 mt-2">
              <p><span className="text-gray-500 text-sm">Total Paid:</span> <span className="font-bold text-rose-600 text-lg">৳{order.totalPrice}</span></p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaMapMarkerAlt className="text-rose-500" /> Delivery Information
          </h3>
          <div className="space-y-3">
            <p><span className="text-gray-500 text-sm">Name:</span> <span className="font-medium">{order.customerInfo?.name}</span></p>
            <p><span className="text-gray-500 text-sm">Phone:</span> <span className="font-medium">{order.customerInfo?.phone}</span></p>
            <p><span className="text-gray-500 text-sm">Address:</span> <span className="font-medium">{order.customerInfo?.address}</span></p>
            <p><span className="text-gray-500 text-sm">Delivery Area:</span> <span className="font-medium capitalize">{order.customerInfo?.deliveryArea === "inside_dhaka" ? "Inside Dhaka" : "Outside Dhaka"}</span></p>
          </div>
        </div>
      </div>

      {/* কুরিয়ার তথ্য */}
      {order.courierInfo?.provider && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaTruck className="text-rose-500" /> Courier Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p><span className="text-gray-500 text-sm">Provider:</span> <span className="font-medium capitalize">{order.courierInfo.provider}</span></p>
            <p><span className="text-gray-500 text-sm">Tracking ID:</span> <span className="font-medium">{order.courierInfo.trackingId}</span></p>
            {order.courierInfo.trackingUrl && (
              <p className="md:col-span-2">
                <a href={order.courierInfo.trackingUrl} target="_blank" className="text-rose-500 hover:text-rose-600 flex items-center gap-1">
                  Track with Courier <span>→</span>
                </a>
              </p>
            )}
          </div>
        </div>
      )}

      {/* টাইমলাইন */}
      {order.history && order.history.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Order Timeline</h3>
          <div className="space-y-4">
            {order.history.map((item, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-3 h-3 bg-rose-500 rounded-full mt-1.5"></div>
                  {index !== order.history.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-200 ml-1.5"></div>
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <p className="font-medium text-gray-800 capitalize">{item.status}</p>
                    <p className="text-xs text-gray-400">{new Date(item.timestamp).toLocaleString()}</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{item.note}</p>
                  {item.changedByName && (
                    <p className="text-xs text-gray-400 mt-1">By: {item.changedByName}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* হেডার */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-100 rounded-full mb-4">
            <FaTruck className="text-rose-500 text-2xl" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Track Your Order
          </h1>
          <p className="text-gray-500">
            Search by Order ID or Phone Number
          </p>
        </div>

        {/* সার্চ ফর্ম */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          {/* সার্চ টাইপ সিলেক্ট */}
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setSearchType("orderId")}
              className={`flex-1 py-2 rounded-xl font-medium transition flex items-center justify-center gap-2 ${
                searchType === "orderId"
                  ? "bg-rose-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <FaHashtag size={16} /> Order ID
            </button>
            <button
              type="button"
              onClick={() => setSearchType("phone")}
              className={`flex-1 py-2 rounded-xl font-medium transition flex items-center justify-center gap-2 ${
                searchType === "phone"
                  ? "bg-rose-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <FaPhone size={16} /> Phone Number
            </button>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchType === "orderId" ? "Enter Order ID (e.g., ORD-...)" : "Enter Phone Number (e.g., 017xxxxxxxx)"}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </span>
              ) : (
                <>
                  <FaSearch /> Search
                </>
              )}
            </button>
          </form>
        </div>

        {/* লোডিং */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
            <p className="text-gray-500 mt-4">Searching orders...</p>
          </div>
        )}

        {/* এরর */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <svg className="w-16 h-16 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-red-700 mb-2">No Results Found</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* সিঙ্গেল অর্ডার রেজাল্ট */}
        {order && !loading && !error && (
          <OrderDetails order={order} showCopy={true} />
        )}

        {/* মাল্টিপল অর্ডার রেজাল্ট (ফোন নাম্বার দিয়ে সার্চ করলে) */}
        {orders && !loading && !error && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-2">
                Found {orders.length} order{orders.length > 1 ? "s" : ""}
              </h3>
              <p className="text-gray-500 text-sm mb-4">Click on any order to view details</p>
              
              <div className="space-y-3">
                {orders.map((ord) => (
                  <div
                    key={ord._id}
                    onClick={() => setSelectedOrder(selectedOrder?._id === ord._id ? null : ord)}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <code className="font-mono font-bold text-gray-800">{ord.orderId}</code>
                        <p className="text-sm text-gray-500 mt-1">{ord.productTitle}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(ord.orderStatus)}`}>
                          {getStatusText(ord.orderStatus)}
                        </span>
                        <p className="text-sm font-semibold text-gray-800">৳{ord.totalPrice}</p>
                      </div>
                    </div>
                    
                    {selectedOrder?._id === ord._id && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <OrderDetails order={ord} showCopy={false} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;