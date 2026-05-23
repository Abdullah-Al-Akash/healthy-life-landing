import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaEye, FaTruck, FaCheckCircle, FaTimesCircle, 
  FaSpinner, FaShippingFast, FaExternalLinkAlt,
  FaChevronDown, FaChevronUp, FaHistory, FaInfoCircle
} from 'react-icons/fa';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filter, setFilter] = useState('all');
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [sendingCourier, setSendingCourier] = useState(null);

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders', config);
      setOrders(res.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id, status) => {
    setUpdatingStatus(id);
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}/status`, { status }, config);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const sendToCourier = async (id, provider) => {
    setSendingCourier(id);
    try {
      // এখানে কুরিয়ার এপিআই কল হবে
      const trackingId = `${provider.toUpperCase()}-${Date.now()}`;
      const trackingUrl = `https://${provider}.com/track/${trackingId}`;
      
      await axios.post(`http://localhost:5000/api/orders/${id}/courier`, 
        { provider, trackingId, trackingUrl }, 
        config
      );
      fetchOrders();
    } catch (error) {
      console.error('Error sending to courier:', error);
    } finally {
      setSendingCourier(null);
    }
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaSpinner className="text-yellow-500" />;
      case 'approved': return <FaCheckCircle className="text-blue-500" />;
      case 'delivered': return <FaTruck className="text-green-500" />;
      case 'cancelled': return <FaTimesCircle className="text-red-500" />;
      default: return null;
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.orderStatus === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* হেডার */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Orders Management</h1>
        
        {/* ফিল্টার বাটন */}
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'approved', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-lg text-sm capitalize transition ${
                filter === status
                  ? 'bg-rose-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status === 'all' ? 'All Orders' : status}
            </button>
          ))}
        </div>
      </div>

      {/* অর্ডার কার্ড (মোবাইল) ও টেবিল (ডেস্কটপ) */}
      <div className="block md:hidden space-y-4">
        {filteredOrders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-bold text-gray-800">{order.orderId}</p>
                <p className="text-sm text-gray-500">{order.customerInfo?.name}</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(order.orderStatus)}
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
              </div>
            </div>
            
            <div className="text-sm space-y-1 mb-3">
              <p><span className="text-gray-500">Product:</span> {order.productTitle}</p>
              <p><span className="text-gray-500">Total:</span> ৳{order.totalPrice}</p>
              <p><span className="text-gray-500">Phone:</span> {order.customerInfo?.phone}</p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedOrder(order)}
                className="flex-1 bg-rose-500 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2"
              >
                <FaEye /> View
              </button>
              <button
                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                className="bg-gray-200 px-3 py-2 rounded-lg text-sm"
              >
                {expandedOrder === order._id ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>
            
            {/* এক্সপান্ডেড ডিটেইলস */}
            {expandedOrder === order._id && (
              <div className="mt-4 pt-3 border-t space-y-3">
                <div>
                  <p className="font-semibold text-sm">Customer Info</p>
                  <p className="text-sm">Address: {order.customerInfo?.address}</p>
                  <p className="text-sm">Area: {order.customerInfo?.deliveryArea === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}</p>
                </div>
                <div>
                  <p className="font-semibold text-sm">IP Address</p>
                  <p className="text-sm">{order.ipAddress || 'N/A'}</p>
                </div>
                {order.courierInfo?.provider && (
                  <div>
                    <p className="font-semibold text-sm">Courier Info</p>
                    <p className="text-sm">Provider: {order.courierInfo.provider}</p>
                    <p className="text-sm">Tracking: {order.courierInfo.trackingId}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ডেস্কটপ টেবিল */}
      <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Courier</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <React.Fragment key={order._id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.orderId}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {order.customerInfo?.name}
                      <div className="text-xs text-gray-500">{order.customerInfo?.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {order.productTitle}
                     </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      ৳{order.totalPrice}
                     </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {order.ipAddress || 'N/A'}
                     </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        disabled={updatingStatus === order._id}
                        className={`px-2 py-1 text-xs rounded-full border-0 focus:ring-2 focus:ring-rose-500 ${getStatusBadge(order.orderStatus)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                     </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => sendToCourier(order._id, 'steadfast')}
                          disabled={order.courierInfo?.provider === 'steadfast' || sendingCourier === order._id}
                          className="px-2 py-1 bg-blue-600 text-white text-xs rounded disabled:opacity-50"
                        >
                          Steadfast
                        </button>
                        <button
                          onClick={() => sendToCourier(order._id, 'pathao')}
                          disabled={order.courierInfo?.provider === 'pathao' || sendingCourier === order._id}
                          className="px-2 py-1 bg-green-600 text-white text-xs rounded disabled:opacity-50"
                        >
                          Pathao
                        </button>
                      </div>
                      {order.courierInfo?.trackingId && (
                        <a href={order.courierInfo.trackingUrl} target="_blank" className="text-xs text-blue-500 flex items-center gap-1 mt-1">
                          Track <FaExternalLinkAlt size={10} />
                        </a>
                      )}
                     </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-rose-600 hover:text-rose-800"
                      >
                        <FaEye size={18} />
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* খালি স্টেট */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">No orders found.</p>
        </div>
      )}

      {/* অর্ডার ডিটেইলস মোডাল */}
      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
          updateOrderStatus={updateOrderStatus}
          sendToCourier={sendToCourier}
        />
      )}
    </div>
  );
};

// অর্ডার ডিটেইলস মোডাল কম্পোনেন্ট
const OrderDetailsModal = ({ order, onClose, updateOrderStatus, sendToCourier }) => {
  const [activeTab, setActiveTab] = useState('details');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* হেডার */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>
        
        {/* ট্যাব */}
        <div className="border-b px-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-2 px-1 border-b-2 transition ${activeTab === 'details' ? 'border-rose-500 text-rose-600' : 'border-transparent text-gray-500'}`}
            >
              <FaInfoCircle className="inline mr-1" /> Details
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-1 border-b-2 transition ${activeTab === 'history' ? 'border-rose-500 text-rose-600' : 'border-transparent text-gray-500'}`}
            >
              <FaHistory className="inline mr-1" /> History
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {activeTab === 'details' ? (
            <div className="space-y-6">
              {/* অর্ডার তথ্য */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><p className="text-sm text-gray-500">Order ID</p><p className="font-semibold">{order.orderId}</p></div>
                <div><p className="text-sm text-gray-500">Date</p><p className="font-semibold">{new Date(order.createdAt).toLocaleString()}</p></div>
                <div><p className="text-sm text-gray-500">Payment Method</p><p className="font-semibold capitalize">{order.paymentMethod}</p></div>
                <div><p className="text-sm text-gray-500">Payment Status</p><p className={`font-semibold capitalize ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>{order.paymentStatus}</p></div>
                <div><p className="text-sm text-gray-500">IP Address</p><p className="font-semibold">{order.ipAddress || 'N/A'}</p></div>
                <div><p className="text-sm text-gray-500">User Agent</p><p className="text-xs text-gray-500 break-all">{order.userAgent || 'N/A'}</p></div>
              </div>

              {/* গ্রাহক তথ্য */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-800 mb-3">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <p><span className="text-gray-500">Name:</span> {order.customerInfo?.name}</p>
                  <p><span className="text-gray-500">Phone:</span> {order.customerInfo?.phone}</p>
                  <p className="md:col-span-2"><span className="text-gray-500">Address:</span> {order.customerInfo?.address}</p>
                  <p><span className="text-gray-500">Delivery Area:</span> {order.customerInfo?.deliveryArea === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}</p>
                  <p><span className="text-gray-500">Delivery Charge:</span> ৳{order.deliveryCharge}</p>
                  {order.customerInfo?.note && <p className="md:col-span-2"><span className="text-gray-500">Note:</span> {order.customerInfo.note}</p>}
                </div>
              </div>

              {/* অর্ডার সামারি */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-gray-500">Product:</span> <span>{order.productTitle}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Product Price:</span> <span>৳{order.productPrice}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Delivery Charge:</span> <span>৳{order.deliveryCharge}</span></div>
                  <div className="flex justify-between border-t pt-2 mt-2"><span className="font-bold">Total:</span> <span className="font-bold text-rose-600">৳{order.totalPrice}</span></div>
                </div>
              </div>

              {/* কুরিয়ার তথ্য */}
              {order.courierInfo?.provider && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Courier Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <p><span className="text-gray-500">Provider:</span> <span className="capitalize">{order.courierInfo.provider}</span></p>
                    <p><span className="text-gray-500">Tracking ID:</span> {order.courierInfo.trackingId}</p>
                    <p className="md:col-span-2"><span className="text-gray-500">Tracking URL:</span> <a href={order.courierInfo.trackingUrl} target="_blank" className="text-blue-500">Click to track</a></p>
                    <p><span className="text-gray-500">Sent At:</span> {new Date(order.courierInfo.sentAt).toLocaleString()}</p>
                    <p><span className="text-gray-500">Sent By:</span> {order.courierInfo.sentByName}</p>
                  </div>
                </div>
              )}

              {/* স্ট্যাটাস আপডেট */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-800 mb-3">Update Status</h3>
                <div className="flex flex-wrap gap-2">
                  {['pending', 'approved', 'delivered', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        updateOrderStatus(order._id, status);
                        onClose();
                      }}
                      className={`px-3 py-1 rounded-lg text-sm capitalize transition ${
                        order.orderStatus === status
                          ? 'bg-rose-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* কুরিয়ার বাটন */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-800 mb-3">Send to Courier</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => sendToCourier(order._id, 'steadfast')}
                    disabled={order.courierInfo?.provider === 'steadfast'}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50"
                  >
                    Steadfast
                  </button>
                  <button
                    onClick={() => sendToCourier(order._id, 'pathao')}
                    disabled={order.courierInfo?.provider === 'pathao'}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm disabled:opacity-50"
                  >
                    Pathao
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // ইতিহাস ট্যাব
            <div className="space-y-4">
              {order.history?.map((item, index) => (
                <div key={index} className="border-l-4 border-rose-500 pl-4 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                    <span className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-700">{item.note}</p>
                  {item.changedByName && (
                    <p className="text-xs text-gray-500 mt-1">By: {item.changedByName}</p>
                  )}
                </div>
              ))}
              {(!order.history || order.history.length === 0) && (
                <p className="text-gray-500 text-center py-4">No history available</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
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

export default Orders;