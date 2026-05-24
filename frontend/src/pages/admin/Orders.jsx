import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaEye, FaTruck, FaCheckCircle, FaTimesCircle, 
  FaSpinner, FaExternalLinkAlt, FaChevronDown, FaChevronUp, 
  FaHistory, FaInfoCircle, FaUserEdit, FaSave, FaTimes,
  FaSearch, FaFilter, FaBox, FaUser, FaPhone, FaMapMarkerAlt,
  FaCalendarAlt, FaMoneyBillWave, FaCreditCard, FaShippingFast
} from 'react-icons/fa';
import { adminApi } from '../../api/admin';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [sendingCourier, setSendingCourier] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterAndSearchOrders();
  }, [orders, filter, searchTerm]);

  const fetchOrders = async () => {
    try {
      const res = await adminApi.getOrders();
      setOrders(res.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSearchOrders = () => {
    let filtered = [...orders];
    
    // ফিল্টার
    if (filter !== 'all') {
      filtered = filtered.filter(order => order.orderStatus === filter);
    }
    
    // সার্চ
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerInfo?.phone?.includes(searchTerm)
      );
    }
    
    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (id, status) => {
    setUpdatingStatus(id);
    try {
      await adminApi.updateOrderStatus(id, status);
      await fetchOrders();
      if (selectedOrder && selectedOrder._id === id) {
        const updatedOrder = orders.find(o => o._id === id);
        if (updatedOrder) setSelectedOrder(updatedOrder);
      }
    } catch (error) {
      console.error('Error updating order:', error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const sendToCourier = async (id, provider) => {
    setSendingCourier(id);
    try {
      await adminApi.sendToCourier(id, provider);
      await fetchOrders();
      if (selectedOrder && selectedOrder._id === id) {
        const updatedOrder = orders.find(o => o._id === id);
        if (updatedOrder) setSelectedOrder(updatedOrder);
      }
    } catch (error) {
      console.error('Error sending to courier:', error);
    } finally {
      setSendingCourier(null);
    }
  };

  const updateUserInfo = async (orderId, updatedInfo) => {
    try {
      const res = await adminApi.updateCustomerInfo(orderId, updatedInfo);
      if (res.data.success) {
        await fetchOrders();
        const updatedOrder = orders.find(o => o._id === orderId);
        if (updatedOrder) {
          setSelectedOrder({
            ...updatedOrder,
            customerInfo: updatedInfo
          });
        }
        setEditingUser(null);
      }
    } catch (error) {
      console.error('Error updating user info:', error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200', icon: <FaSpinner className="text-yellow-500" /> },
      approved: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', icon: <FaCheckCircle className="text-blue-500" /> },
      delivered: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', icon: <FaTruck className="text-green-500" /> },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', icon: <FaTimesCircle className="text-red-500" /> },
    };
    return badges[status] || { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200', icon: null };
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <FaSpinner className="text-yellow-500 animate-spin" />,
      approved: <FaCheckCircle className="text-blue-500" />,
      delivered: <FaTruck className="text-green-500" />,
      cancelled: <FaTimesCircle className="text-red-500" />,
    };
    return icons[status] || null;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(price);
  };

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
            Orders Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage all customer orders</p>
        </div>
        
        {/* সার্চ */}
        <div className="relative w-full md:w-64">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
          />
        </div>
      </div>

      {/* ফিল্টার বাটন */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'pending', 'approved', 'delivered', 'cancelled'].map((status) => (
          <motion.button
            key={status}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all duration-300 ${
              filter === status
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {status === 'all' ? 'All Orders' : status}
            {status !== 'all' && (
              <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                filter === status ? 'bg-white/20' : 'bg-gray-200'
              }`}>
                {orders.filter(o => o.orderStatus === status).length}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {/* ডেস্কটপ টেবিল */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courier</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence>
                {filteredOrders.map((order, index) => {
                  const statusStyle = getStatusBadge(order.orderStatus);
                  return (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FaBox className="text-gray-400 text-xs" />
                          <span className="text-sm font-mono font-medium text-gray-900">{order.orderId}</span>
                        </div>
                       </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-800">{order.customerInfo?.name}</span>
                          <span className="text-xs text-gray-400">{order.customerInfo?.phone}</span>
                        </div>
                       </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">{order.productTitle}</span>
                       </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-rose-600">{formatPrice(order.totalPrice)}</span>
                       </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {statusStyle.icon}
                          <span className={`px-2 py-1 text-xs rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                            {order.orderStatus}
                          </span>
                        </div>
                       </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button
                            onClick={() => sendToCourier(order._id, 'steadfast')}
                            disabled={order.courierInfo?.provider === 'steadfast' || sendingCourier === order._id}
                            className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg disabled:opacity-50 transition"
                          >
                            Steadfast
                          </button>
                          <button
                            onClick={() => sendToCourier(order._id, 'pathao')}
                            disabled={order.courierInfo?.provider === 'pathao' || sendingCourier === order._id}
                            className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded-lg disabled:opacity-50 transition"
                          >
                            Pathao
                          </button>
                        </div>
                        {order.courierInfo?.trackingUrl && (
                          <a 
                            href={order.courierInfo.trackingUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 flex items-center gap-1 mt-1 hover:underline"
                          >
                            Track <FaExternalLinkAlt size={10} />
                          </a>
                        )}
                       </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                        >
                          <FaEye size={16} />
                        </button>
                       </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* মোবাইল/ট্যাবলেট ভিউ - কার্ড */}
      <div className="lg:hidden space-y-4">
        <AnimatePresence>
          {filteredOrders.map((order, index) => {
            const statusStyle = getStatusBadge(order.orderStatus);
            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all overflow-hidden border border-gray-100"
              >
                {/* কার্ড হেডার */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FaBox className="text-rose-400 text-sm" />
                    <span className="font-mono text-sm font-medium text-gray-700">{order.orderId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {statusStyle.icon}
                    <span className={`px-2 py-0.5 text-xs rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* কার্ড কন্টেন্ট */}
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FaUser className="text-gray-400 text-xs" />
                        <h3 className="font-semibold text-gray-800">{order.customerInfo?.name}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FaPhone className="text-gray-400 text-xs" />
                        <span>{order.customerInfo?.phone}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-rose-500">{formatPrice(order.totalPrice)}</p>
                      <p className="text-xs text-gray-400">{order.productTitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FaMapMarkerAlt className="text-gray-400 text-xs" />
                    <span className="truncate">{order.customerInfo?.address}</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-3 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition"
                    >
                      <FaEye size={14} /> View Details
                    </button>
                    <button
                      onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                      className="px-3 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                    >
                      {expandedOrder === order._id ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </div>

                  {/* এক্সপান্ডেড ডিটেইলস */}
                  <AnimatePresence>
                    {expandedOrder === order._id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-3 border-t space-y-3 overflow-hidden"
                      >
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-xs text-gray-400">Delivery Area</p>
                            <p className="font-medium">{order.customerInfo?.deliveryArea === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Delivery Charge</p>
                            <p className="font-medium">৳{order.deliveryCharge}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-xs text-gray-400">Order Date</p>
                            <p className="font-medium">{new Date(order.createdAt).toLocaleString()}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-xs text-gray-400">IP Address</p>
                            <p className="font-mono text-xs">{order.ipAddress || 'N/A'}</p>
                          </div>
                        </div>
                        {order.courierInfo?.provider && (
                          <div className="bg-blue-50 rounded-lg p-2">
                            <p className="text-xs text-gray-600">Courier: {order.courierInfo.provider}</p>
                            {order.courierInfo.trackingUrl && (
                              <a href={order.courierInfo.trackingUrl} target="_blank" className="text-xs text-blue-500 hover:underline">
                                Track Order →
                              </a>
                            )}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* খালি স্টেট */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-md">
          <FaBox className="text-gray-300 text-5xl mx-auto mb-3" />
          <p className="text-gray-500">No orders found</p>
          {(searchTerm || filter !== 'all') && (
            <button
              onClick={() => { setSearchTerm(''); setFilter('all'); }}
              className="mt-4 text-rose-500 hover:text-rose-600 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* অর্ডার ডিটেইলস মোডাল */}
      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
          updateOrderStatus={updateOrderStatus}
          sendToCourier={sendToCourier}
          updateUserInfo={updateUserInfo}
          editingUser={editingUser}
          setEditingUser={setEditingUser}
          editFormData={editFormData}
          setEditFormData={setEditFormData}
        />
      )}
    </div>
  );
};

// Order Details Modal Component
const OrderDetailsModal = ({ 
  order, onClose, updateOrderStatus, sendToCourier,
  updateUserInfo, editingUser, setEditingUser, editFormData, setEditFormData
}) => {
  const [activeTab, setActiveTab] = useState('details');
  const [localOrder, setLocalOrder] = useState(order);

  useEffect(() => {
    setLocalOrder(order);
  }, [order]);

  const startEditing = () => {
    setEditingUser(order._id);
    setEditFormData({
      name: localOrder.customerInfo?.name || '',
      phone: localOrder.customerInfo?.phone || '',
      address: localOrder.customerInfo?.address || '',
      deliveryArea: localOrder.customerInfo?.deliveryArea || 'inside_dhaka',
      note: localOrder.customerInfo?.note || ''
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const saveUserInfo = async () => {
    await updateUserInfo(order._id, editFormData);
    setLocalOrder({
      ...localOrder,
      customerInfo: editFormData
    });
  };

  const handleUpdateStatus = async (status) => {
    await updateOrderStatus(order._id, status);
    setLocalOrder({
      ...localOrder,
      orderStatus: status
    });
    onClose();
  };

  const handleSendToCourier = async (provider) => {
    await sendToCourier(order._id, provider);
    onClose();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(price);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* হেডার */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
            <p className="text-sm text-gray-500 font-mono">{localOrder.orderId}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-2 rounded-full hover:bg-gray-100">
            <FaTimes />
          </button>
        </div>
        
        {/* ট্যাব */}
        <div className="border-b px-6">
          <div className="flex gap-6">
            {['details', 'history'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 transition-all duration-200 flex items-center gap-2 ${
                  activeTab === tab 
                    ? 'border-rose-500 text-rose-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'details' ? <FaInfoCircle /> : <FaHistory />}
                <span className="capitalize font-medium">{tab}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-6">
          {activeTab === 'details' ? (
            <div className="space-y-6">
              {/* অর্ডার তথ্য */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-rose-400" />
                  <div>
                    <p className="text-xs text-gray-500">Order Date</p>
                    <p className="text-sm font-semibold">{new Date(localOrder.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaCreditCard className="text-rose-400" />
                  <div>
                    <p className="text-xs text-gray-500">Payment Method</p>
                    <p className="text-sm font-semibold capitalize">{localOrder.paymentMethod}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaMoneyBillWave className="text-rose-400" />
                  <div>
                    <p className="text-xs text-gray-500">Payment Status</p>
                    <p className={`text-sm font-semibold capitalize ${localOrder.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {localOrder.paymentStatus}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaShippingFast className="text-rose-400" />
                  <div>
                    <p className="text-xs text-gray-500">Delivery Status</p>
                    <p className="text-sm font-semibold capitalize">{localOrder.orderStatus}</p>
                  </div>
                </div>
              </div>

              {/* গ্রাহক তথ্য */}
              <div className="border rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-rose-50 to-pink-50 px-5 py-3 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <FaUser /> Customer Information
                  </h3>
                  {editingUser !== order._id ? (
                    <button
                      onClick={startEditing}
                      className="text-rose-500 hover:text-rose-600 text-sm flex items-center gap-1"
                    >
                      <FaUserEdit /> Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={saveUserInfo} className="text-green-500 hover:text-green-600 text-sm flex items-center gap-1">
                        <FaSave /> Save
                      </button>
                      <button onClick={() => setEditingUser(null)} className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1">
                        <FaTimes /> Cancel
                      </button>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  {editingUser === order._id ? (
                    <div className="space-y-3">
                      <div><label className="text-xs text-gray-500">Name</label><input type="text" name="name" value={editFormData.name} onChange={handleEditChange} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
                      <div><label className="text-xs text-gray-500">Phone</label><input type="text" name="phone" value={editFormData.phone} onChange={handleEditChange} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
                      <div><label className="text-xs text-gray-500">Address</label><textarea name="address" value={editFormData.address} onChange={handleEditChange} rows="2" className="w-full mt-1 px-3 py-2 border rounded-lg text-sm resize-none" /></div>
                      <div><label className="text-xs text-gray-500">Delivery Area</label><select name="deliveryArea" value={editFormData.deliveryArea} onChange={handleEditChange} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"><option value="inside_dhaka">Inside Dhaka</option><option value="outside_dhaka">Outside Dhaka</option></select></div>
                      <div><label className="text-xs text-gray-500">Note</label><textarea name="note" value={editFormData.note} onChange={handleEditChange} rows="2" className="w-full mt-1 px-3 py-2 border rounded-lg text-sm resize-none" /></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <p><span className="text-xs text-gray-500">Name:</span> <span className="font-medium">{localOrder.customerInfo?.name}</span></p>
                      <p><span className="text-xs text-gray-500">Phone:</span> <span className="font-medium">{localOrder.customerInfo?.phone}</span></p>
                      <p className="md:col-span-2"><span className="text-xs text-gray-500">Address:</span> <span className="font-medium">{localOrder.customerInfo?.address}</span></p>
                      <p><span className="text-xs text-gray-500">Delivery Area:</span> <span className="font-medium">{localOrder.customerInfo?.deliveryArea === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}</span></p>
                      <p><span className="text-xs text-gray-500">Delivery Charge:</span> <span className="font-medium">৳{localOrder.deliveryCharge}</span></p>
                      {localOrder.customerInfo?.note && <p className="md:col-span-2"><span className="text-xs text-gray-500">Note:</span> <span className="font-medium">{localOrder.customerInfo.note}</span></p>}
                    </div>
                  )}
                </div>
              </div>

              {/* অর্ডার সামারি */}
              <div className="border rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-5 py-3">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">📦 Order Summary</h3>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex justify-between"><span className="text-gray-500">Product:</span> <span className="font-medium">{localOrder.productTitle}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Product Price:</span> <span className="font-medium">৳{localOrder.productPrice}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Delivery Charge:</span> <span className="font-medium">৳{localOrder.deliveryCharge}</span></div>
                  <div className="border-t pt-2 flex justify-between"><span className="font-bold">Total:</span> <span className="font-bold text-rose-600 text-lg">{formatPrice(localOrder.totalPrice)}</span></div>
                </div>
              </div>

              {/* কুরিয়ার তথ্য */}
              {localOrder.courierInfo?.provider && (
                <div className="border rounded-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-5 py-3">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">🚚 Courier Information</h3>
                  </div>
                  <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <p><span className="text-xs text-gray-500">Provider:</span> <span className="font-medium capitalize">{localOrder.courierInfo.provider}</span></p>
                    <p><span className="text-xs text-gray-500">Tracking ID:</span> <span className="font-medium">{localOrder.courierInfo.trackingId}</span></p>
                    <p className="md:col-span-2"><span className="text-xs text-gray-500">Tracking URL:</span> <a href={localOrder.courierInfo.trackingUrl} target="_blank" className="text-blue-500 hover:underline">Click to track <FaExternalLinkAlt className="inline ml-1" size={10} /></a></p>
                    <p><span className="text-xs text-gray-500">Sent At:</span> <span className="font-medium">{new Date(localOrder.courierInfo.sentAt).toLocaleString()}</span></p>
                    <p><span className="text-xs text-gray-500">Sent By:</span> <span className="font-medium">{localOrder.courierInfo.sentByName}</span></p>
                  </div>
                </div>
              )}

              {/* স্ট্যাটাস আপডেট */}
              <div className="border rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-rose-50 to-pink-50 px-5 py-3">
                  <h3 className="font-semibold text-gray-800">Update Status</h3>
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-2">
                    {['pending', 'approved', 'delivered', 'cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateStatus(status)}
                        className={`px-4 py-2 rounded-xl text-sm capitalize transition-all ${
                          localOrder.orderStatus === status
                            ? 'bg-rose-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* কুরিয়ার বাটন */}
              <div className="border rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-5 py-3">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">Send to Courier</h3>
                </div>
                <div className="p-5">
                  <div className="flex gap-3">
                    <button onClick={() => handleSendToCourier('steadfast')} disabled={localOrder.courierInfo?.provider === 'steadfast'} className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm disabled:opacity-50 hover:bg-blue-600 transition">Steadfast</button>
                    <button onClick={() => handleSendToCourier('pathao')} disabled={localOrder.courierInfo?.provider === 'pathao'} className="px-4 py-2 bg-green-500 text-white rounded-xl text-sm disabled:opacity-50 hover:bg-green-600 transition">Pathao</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {localOrder.history?.map((item, index) => (
                <div key={index} className="border-l-4 border-rose-500 pl-4 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadge(item.status)}`}>{item.status}</span>
                    <span className="text-xs text-gray-400">{new Date(item.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-700">{item.note}</p>
                  {item.changedByName && <p className="text-xs text-gray-500 mt-1">By: {item.changedByName}</p>}
                </div>
              ))}
              {(!localOrder.history || localOrder.history.length === 0) && <p className="text-gray-500 text-center py-4">No history available</p>}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Orders;