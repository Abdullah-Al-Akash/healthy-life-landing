import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUsers, FaSearch, FaEye, FaEdit, FaTrash, FaBan, FaCheckCircle,
  FaPhone, FaMapMarkerAlt, FaShoppingBag, FaMoneyBillWave, FaCalendarAlt,
  FaTimes, FaSave, FaUserEdit, FaSpinner, FaArrowLeft, FaArrowRight,
  FaFilter, FaDownload, FaEnvelope
} from 'react-icons/fa';
import { adminApi } from '../../api/admin';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, searchTerm]);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchTerm]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getCustomers();
      setCustomers(res.data.customers || []);
      setTotalPages(Math.ceil((res.data.customers?.length || 0) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    if (!searchTerm) {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(c => 
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.includes(searchTerm) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  };

  const updateCustomerStatus = async (id, isActive) => {
    try {
      await adminApi.updateCustomerStatus(id, { isActive: !isActive });
      fetchCustomers();
    } catch (error) {
      console.error('Error updating customer status:', error);
    }
  };

  const updateCustomer = async () => {
    try {
      await adminApi.updateCustomer(editingCustomer._id, editFormData);
      setEditingCustomer(null);
      fetchCustomers();
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  const deleteCustomer = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await adminApi.deleteCustomer(id);
        fetchCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  const viewCustomerDetails = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const startEditing = (customer) => {
    setEditingCustomer(customer);
    setEditFormData({
      name: customer.name || '',
      email: customer.email || '',
      address: customer.address || '',
      notes: customer.notes || '',
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(price);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('bn-BD', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // পেজিনেশন
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
            Customer Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage all registered customers</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, phone or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80 pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
            />
          </div>
          <button className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
            <FaDownload className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* স্ট্যাটাস কার্ড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Customers</p>
              <p className="text-2xl font-bold text-gray-800">{customers.length}</p>
            </div>
            <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
              <FaUsers className="text-rose-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Customers</p>
              <p className="text-2xl font-bold text-green-600">{customers.filter(c => c.isActive !== false).length}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FaCheckCircle className="text-green-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-800">{customers.reduce((sum, c) => sum + c.totalOrders, 0)}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaShoppingBag className="text-blue-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-rose-600">{formatPrice(customers.reduce((sum, c) => sum + c.totalSpent, 0))}</p>
            </div>
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <FaMoneyBillWave className="text-amber-500" />
            </div>
          </div>
        </div>
      </div>

      {/* ডেস্কটপ টেবিল */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Order</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence>
                {paginatedCustomers.map((customer, index) => (
                  <motion.tr
                    key={customer._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <FaUsers className="text-white text-xs" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{customer.name || 'N/A'}</p>
                          <p className="text-xs text-gray-400">Joined: {formatDate(customer.createdAt)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-800">{customer.phone}</span>
                        {customer.email && <span className="text-xs text-gray-400">{customer.email}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
                        <FaShoppingBag size={12} /> {customer.totalOrders}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-semibold text-rose-600">{formatPrice(customer.totalSpent)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-600">{formatDate(customer.lastOrderDate)}</span>
                        {customer.lastOrderDate && (
                          <span className="text-xs text-gray-400">{new Date(customer.lastOrderDate).toLocaleDateString()}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => updateCustomerStatus(customer._id, customer.isActive)}
                        className={`px-2 py-1 text-xs rounded-full transition ${
                          customer.isActive !== false 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {customer.isActive !== false ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => viewCustomerDetails(customer)}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                          title="View Details"
                        >
                          <FaEye size={14} />
                        </button>
                        <button
                          onClick={() => startEditing(customer)}
                          className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg transition"
                          title="Edit"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => deleteCustomer(customer._id)}
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

      {/* মোবাইল/ট্যাবলেট ভিউ - কার্ড */}
      <div className="lg:hidden space-y-4">
        {paginatedCustomers.map((customer, index) => (
          <motion.div
            key={customer._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl shadow-md p-4 border border-gray-100"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <FaUsers className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{customer.name || 'N/A'}</h3>
                  <p className="text-xs text-gray-400">{customer.phone}</p>
                </div>
              </div>
              <button
                onClick={() => updateCustomerStatus(customer._id, customer.isActive)}
                className={`px-2 py-1 text-xs rounded-full ${
                  customer.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {customer.isActive !== false ? 'Active' : 'Inactive'}
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              <div>
                <p className="text-xs text-gray-400">Total Orders</p>
                <p className="font-semibold">{customer.totalOrders}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Total Spent</p>
                <p className="font-semibold text-rose-600">{formatPrice(customer.totalSpent)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-400">Last Order</p>
                <p className="text-sm">{formatDate(customer.lastOrderDate)}</p>
              </div>
            </div>
            
            <div className="flex gap-2 pt-2 border-t">
              <button
                onClick={() => viewCustomerDetails(customer)}
                className="flex-1 bg-blue-500 text-white py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
              >
                <FaEye size={14} /> Details
              </button>
              <button
                onClick={() => startEditing(customer)}
                className="flex-1 bg-amber-500 text-white py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
              >
                <FaEdit size={14} /> Edit
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
      {paginatedCustomers.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-md">
          <FaUsers className="text-gray-300 text-5xl mx-auto mb-3" />
          <p className="text-gray-500">No customers found</p>
        </div>
      )}

      {/* কাস্টমার ডিটেইলস মোডাল */}
      {showModal && selectedCustomer && (
        <CustomerDetailsModal
          customer={selectedCustomer}
          onClose={() => setShowModal(false)}
          formatPrice={formatPrice}
          formatDate={formatDate}
        />
      )}

      {/* এডিট কাস্টমার মোডাল */}
      {editingCustomer && (
        <EditCustomerModal
          customer={editingCustomer}
          editFormData={editFormData}
          setEditFormData={setEditFormData}
          onSave={updateCustomer}
          onClose={() => setEditingCustomer(null)}
        />
      )}
    </div>
  );
};

// Customer Details Modal Component
const CustomerDetailsModal = ({ customer, onClose, formatPrice, formatDate }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [customer.phone]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await adminApi.getCustomerOrders(customer.phone);
      setOrders(res.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoadingOrders(false);
    }
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
        <div className="sticky top-0 bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Customer Details</h2>
              <p className="text-rose-100 text-sm">{customer.phone}</p>
            </div>
            <button onClick={onClose} className="text-white hover:text-rose-100 transition">
              <FaTimes />
            </button>
          </div>
        </div>

        {/* ট্যাব */}
        <div className="border-b px-6">
          <div className="flex gap-6">
            {['info', 'orders'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 border-b-2 transition-all capitalize ${
                  activeTab === tab 
                    ? 'border-rose-500 text-rose-600' 
                    : 'border-transparent text-gray-500'
                }`}
              >
                {tab === 'info' ? 'Information' : `Orders (${orders.length})`}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'info' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">Full Name</p>
                  <p className="font-semibold">{customer.name || 'N/A'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">Phone Number</p>
                  <p className="font-semibold">{customer.phone}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-semibold">{customer.email || 'N/A'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="font-semibold">{customer.address || 'N/A'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">Total Orders</p>
                  <p className="font-semibold text-2xl text-rose-500">{customer.totalOrders}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">Total Spent</p>
                  <p className="font-semibold text-2xl text-green-600">{formatPrice(customer.totalSpent)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">First Order</p>
                  <p className="font-semibold">{formatDate(customer.firstOrderDate)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">Last Order</p>
                  <p className="font-semibold">{formatDate(customer.lastOrderDate)}</p>
                </div>
              </div>
              {customer.notes && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">Notes</p>
                  <p className="text-sm">{customer.notes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {loadingOrders ? (
                <div className="flex justify-center py-8"><FaSpinner className="animate-spin text-rose-500 text-2xl" /></div>
              ) : orders.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No orders found</p>
              ) : (
                orders.map((order) => (
                  <div key={order._id} className="border rounded-xl p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-mono text-sm font-semibold text-gray-800">{order.orderId}</p>
                        <p className="text-sm text-gray-600 mt-1">{order.productTitle}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-rose-600">{formatPrice(order.totalPrice)}</p>
                        <p className={`text-xs px-2 py-0.5 rounded-full mt-1 ${
                          order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                          order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.orderStatus}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Edit Customer Modal
const EditCustomerModal = ({ customer, editFormData, setEditFormData, onSave, onClose }) => {
  const handleChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-4 text-white rounded-t-2xl">
          <h2 className="text-xl font-bold">Edit Customer</h2>
          <p className="text-rose-100 text-sm">{customer.phone}</p>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs text-gray-500">Name</label>
            <input
              type="text"
              name="name"
              value={editFormData.name}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rose-400 outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Email</label>
            <input
              type="email"
              name="email"
              value={editFormData.email}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rose-400 outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Address</label>
            <textarea
              name="address"
              value={editFormData.address}
              onChange={handleChange}
              rows="2"
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rose-400 outline-none resize-none"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Notes</label>
            <textarea
              name="notes"
              value={editFormData.notes}
              onChange={handleChange}
              rows="2"
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rose-400 outline-none resize-none"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button onClick={onClose} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition">
              Cancel
            </button>
            <button onClick={onSave} className="flex-1 bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition">
              Save Changes
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Customers;