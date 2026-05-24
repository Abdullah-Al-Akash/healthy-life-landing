import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPhone, FaUser, FaMapMarkerAlt, FaBox, FaClock, 
  FaEye, FaTrash, FaWhatsapp, FaBell, FaSpinner,
  FaCheckCircle, FaTimesCircle, FaArrowLeft, FaArrowRight,
  FaSearch, FaFilter, FaExclamationTriangle
} from 'react-icons/fa';
import { adminApi } from '../../api/admin';
import { incompleteOrderApi } from '../../api/incompleteOrder';

const IncompleteOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    fetchIncompleteOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm]);

  const fetchIncompleteOrders = async () => {
    setLoading(true);
    try {
      const res = await incompleteOrderApi.getAll();
      setOrders(res.data.orders || []);
    } catch (error) {
      console.error('Error fetching incomplete orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    if (!searchTerm) {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(order => 
        order.phone?.includes(searchTerm) ||
        order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.productTitle?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  };

  const deleteIncompleteOrder = async (id) => {
    if (window.confirm('Are you sure you want to delete this incomplete order record?')) {
      try {
        await incompleteOrderApi.delete(id);
        fetchIncompleteOrders();
      } catch (error) {
        console.error('Error deleting:', error);
      }
    }
  };

  const sendReminder = (order) => {
    // WhatsApp reminder
    const message = `হ্যালো ${order.name || ''}, আপনি আপনার অর্ডারটি সম্পন্ন করেননি। 
অর্ডার করতে এখানে ক্লিক করুন: ${window.location.origin}/product/${order.productId}
পণ্য: ${order.productTitle}
মূল্য: ৳${order.offerPrice}`;
    
    window.open(`https://wa.me/${order.phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const getStepLabel = (step) => {
    switch (step) {
      case 'phone_filled': return '📞 শুধু ফোন দিয়েছে';
      case 'name_filled': return '✍️ নাম দিয়েছে';
      case 'address_filled': return '📍 ঠিকানা দিয়েছে';
      default: return '📝 শুরু করেছে';
    }
  };

  const getStepColor = (step) => {
    switch (step) {
      case 'phone_filled': return 'bg-gray-100 text-gray-600';
      case 'name_filled': return 'bg-blue-100 text-blue-600';
      case 'address_filled': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const diff = Math.floor((new Date() - new Date(date)) / (1000 * 60));
    if (diff < 60) return `${diff} minutes ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return new Date(date).toLocaleDateString();
  };

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* হেডার */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
            Incomplete Orders
          </h1>
          <p className="text-sm text-gray-500 mt-1">Orders where customers started but didn't complete</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by phone, name or product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
          />
        </div>
      </div>

      {/* স্ট্যাটাস কার্ড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm">Total Incomplete</p>
              <p className="text-2xl font-bold">{orders.length}</p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <FaExclamationTriangle className="text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Address Filled</p>
              <p className="text-2xl font-bold">{orders.filter(o => o.step === 'address_filled').length}</p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <FaMapMarkerAlt className="text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Last 24 Hours</p>
              <p className="text-2xl font-bold">{orders.filter(o => new Date(o.updatedAt) > new Date(Date.now() - 24*60*60*1000)).length}</p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <FaClock className="text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* ডেস্কটপ টেবিল */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Step</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Activity</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence>
                {paginatedOrders.map((order, index) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-800">{order.name || 'N/A'}</p>
                        <p className="text-sm text-gray-500">{order.phone}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-700">{order.productTitle}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-rose-600">৳{order.offerPrice}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStepColor(order.step)}`}>
                        {getStepLabel(order.step)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <FaClock size={12} />
                        {formatDate(order.updatedAt)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => { setSelectedOrder(order); setShowModal(true); }}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                          title="View Details"
                        >
                          <FaEye size={14} />
                        </button>
                        <button
                          onClick={() => sendReminder(order)}
                          className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition"
                          title="Send WhatsApp Reminder"
                        >
                          <FaWhatsapp size={14} />
                        </button>
                        <button
                          onClick={() => deleteIncompleteOrder(order._id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* মোবাইল ভিউ - কার্ড */}
      <div className="lg:hidden space-y-4">
        {paginatedOrders.map((order) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-md p-4 border border-gray-100"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-bold text-gray-800">{order.name || 'Anonymous'}</p>
                <p className="text-sm text-gray-500">{order.phone}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${getStepColor(order.step)}`}>
                {getStepLabel(order.step)}
              </span>
            </div>
            
            <div className="space-y-2 text-sm mb-3">
              <p><span className="text-gray-500">Product:</span> {order.productTitle}</p>
              <p><span className="text-gray-500">Price:</span> <span className="font-semibold text-rose-600">৳{order.offerPrice}</span></p>
              <p><span className="text-gray-500">Last activity:</span> {formatDate(order.updatedAt)}</p>
            </div>
            
            <div className="flex gap-2 pt-2 border-t">
              <button
                onClick={() => { setSelectedOrder(order); setShowModal(true); }}
                className="flex-1 bg-blue-500 text-white py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
              >
                <FaEye size={14} /> Details
              </button>
              <button
                onClick={() => sendReminder(order)}
                className="flex-1 bg-green-500 text-white py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
              >
                <FaWhatsapp size={14} /> Remind
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* পেজিনেশন */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100 transition"
          >
            <FaArrowLeft />
          </button>
          <span className="px-4 py-2 text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100 transition"
          >
            <FaArrowRight />
          </button>
        </div>
      )}

      {/* খালি স্টেট */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-md">
          <FaExclamationTriangle className="text-gray-300 text-5xl mx-auto mb-3" />
          <p className="text-gray-500">No incomplete orders found</p>
        </div>
      )}

      {/* ডিটেইলস মোডাল */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4 rounded-t-2xl">
              <h2 className="text-xl font-bold text-white">Incomplete Order Details</h2>
              <p className="text-amber-100 text-sm">Customer started but didn't complete</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="font-semibold">{selectedOrder.name || 'Not provided'}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-semibold">{selectedOrder.phone}</p>
                </div>
                <div className="col-span-2 p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="font-semibold">{selectedOrder.address || 'Not provided'}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">Product</p>
                  <p className="font-semibold">{selectedOrder.productTitle}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">Price</p>
                  <p className="font-semibold text-rose-600">৳{selectedOrder.offerPrice}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">Step Completed</p>
                  <p className="font-semibold">{getStepLabel(selectedOrder.step)}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">Last Activity</p>
                  <p className="font-semibold">{new Date(selectedOrder.updatedAt).toLocaleString()}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">Created At</p>
                  <p className="font-semibold">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => sendReminder(selectedOrder)}
                  className="flex-1 bg-green-500 text-white py-2 rounded-xl flex items-center justify-center gap-2"
                >
                  <FaWhatsapp /> Send Reminder
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-300 py-2 rounded-xl hover:bg-gray-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default IncompleteOrders;