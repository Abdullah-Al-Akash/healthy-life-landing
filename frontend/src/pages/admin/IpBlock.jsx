import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBan, FaPlus, FaTrash, FaSearch, FaClock, FaUser,
  FaInfoCircle, FaTimes, FaSave, FaSpinner, FaEye,
  FaShieldAlt, FaExclamationTriangle, FaCalendarAlt
} from 'react-icons/fa';
import { adminApi } from '../../api/admin';

const IpBlock = () => {
  const [blockedIPs, setBlockedIPs] = useState([]);
  const [filteredIPs, setFilteredIPs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIP, setSelectedIP] = useState(null);
  const [ipLogs, setIpLogs] = useState([]);
  const [formData, setFormData] = useState({
    ipAddress: '',
    reason: '',
    expiresAt: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBlockedIPs();
  }, []);

  useEffect(() => {
    filterIPs();
  }, [blockedIPs, searchTerm]);

  const fetchBlockedIPs = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getBlockedIPs();
      setBlockedIPs(res.data.blockedIPs || []);
    } catch (error) {
      console.error('Error fetching blocked IPs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterIPs = () => {
    if (!searchTerm) {
      setFilteredIPs(blockedIPs);
    } else {
      const filtered = blockedIPs.filter(ip => 
        ip.ipAddress?.includes(searchTerm) ||
        ip.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ip.blockedByName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredIPs(filtered);
    }
  };

  const handleBlockIP = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminApi.blockIP(formData);
      fetchBlockedIPs();
      setShowModal(false);
      setFormData({ ipAddress: '', reason: '', expiresAt: '' });
    } catch (error) {
      console.error('Error blocking IP:', error);
      alert(error.response?.data?.message || 'Failed to block IP');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnblockIP = async (id, ipAddress) => {
    if (window.confirm(`Are you sure you want to unblock ${ipAddress}?`)) {
      try {
        await adminApi.unblockIP(id);
        fetchBlockedIPs();
      } catch (error) {
        console.error('Error unblocking IP:', error);
        alert('Failed to unblock IP');
      }
    }
  };

  const viewIPLogs = async (ipAddress) => {
    setSelectedIP(ipAddress);
    try {
      const res = await adminApi.getIPLogs(ipAddress);
      setIpLogs(res.data.logs || []);
      setShowLogsModal(true);
    } catch (error) {
      console.error('Error fetching IP logs:', error);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleString();
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
            IP Block Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">Block and manage malicious IP addresses</p>
        </div>
        
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition"
        >
          <FaPlus /> Block IP
        </button>
      </div>

      {/* স্ট্যাটাস কার্ড */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Blocked IPs</p>
              <p className="text-2xl font-bold text-red-600">{blockedIPs.length}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <FaBan className="text-red-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Permanent Blocks</p>
              <p className="text-2xl font-bold text-gray-800">{blockedIPs.filter(ip => !ip.expiresAt).length}</p>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <FaShieldAlt className="text-gray-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Temporary Blocks</p>
              <p className="text-2xl font-bold text-amber-600">{blockedIPs.filter(ip => ip.expiresAt).length}</p>
            </div>
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <FaClock className="text-amber-500" />
            </div>
          </div>
        </div>
      </div>

      {/* সার্চ */}
      <div className="relative mb-6">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by IP address, reason or blocker..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
        />
      </div>

      {/* ডেস্কটপ টেবিল */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blocked By</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blocked At</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredIPs.map((ip, index) => (
                <motion.tr
                  key={ip._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">
                    <code className="text-sm font-mono font-medium text-gray-800">{ip.ipAddress}</code>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">{ip.reason}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FaUser className="text-gray-400 text-xs" />
                      <span className="text-sm text-gray-600">{ip.blockedByName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-500">{formatDate(ip.blockedAt)}</span>
                  </td>
                  <td className="px-4 py-3">
                    {ip.expiresAt ? (
                      <span className="text-sm text-amber-600">{formatDate(ip.expiresAt)}</span>
                    ) : (
                      <span className="text-sm text-gray-400">Never</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => viewIPLogs(ip.ipAddress)}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                        title="View Logs"
                      >
                        <FaEye size={14} />
                      </button>
                      <button
                        onClick={() => handleUnblockIP(ip._id, ip.ipAddress)}
                        className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition"
                        title="Unblock"
                      >
                        <FaBan size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* মোবাইল ভিউ - কার্ড */}
      <div className="lg:hidden space-y-4">
        {filteredIPs.map((ip) => (
          <div key={ip._id} className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
            <div className="flex justify-between items-start mb-3">
              <code className="text-sm font-mono font-bold text-gray-800">{ip.ipAddress}</code>
              <button
                onClick={() => handleUnblockIP(ip._id, ip.ipAddress)}
                className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition"
              >
                <FaBan />
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">Reason:</span> {ip.reason}</p>
              <p><span className="text-gray-500">Blocked By:</span> {ip.blockedByName}</p>
              <p><span className="text-gray-500">Blocked At:</span> {formatDate(ip.blockedAt)}</p>
              <p><span className="text-gray-500">Expires:</span> {ip.expiresAt ? formatDate(ip.expiresAt) : 'Never'}</p>
            </div>
            <button
              onClick={() => viewIPLogs(ip.ipAddress)}
              className="mt-3 w-full bg-blue-500 text-white py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
            >
              <FaEye size={14} /> View Logs
            </button>
          </div>
        ))}
      </div>

      {/* খালি স্টেট */}
      {filteredIPs.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-md">
          <FaShieldAlt className="text-gray-300 text-5xl mx-auto mb-3" />
          <p className="text-gray-500">No blocked IPs found</p>
        </div>
      )}

      {/* Block IP Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-4 text-white rounded-t-2xl">
              <h2 className="text-xl font-bold">Block IP Address</h2>
              <p className="text-rose-100 text-sm">Prevent access from this IP</p>
            </div>
            
            <form onSubmit={handleBlockIP} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-700">IP Address *</label>
                <input
                  type="text"
                  required
                  value={formData.ipAddress}
                  onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                  placeholder="e.g., 192.168.1.1"
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rose-400 outline-none"
                />
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-700">Reason</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Why is this IP being blocked?"
                  rows="2"
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rose-400 outline-none resize-none"
                />
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-700">Expires At (Optional)</label>
                <input
                  type="datetime-local"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rose-400 outline-none"
                />
                <p className="text-xs text-gray-400 mt-1">Leave empty for permanent block</p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="flex-1 bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition disabled:opacity-50">
                  {submitting ? <FaSpinner className="animate-spin mx-auto" /> : 'Block IP'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* IP Logs Modal */}
      {showLogsModal && selectedIP && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowLogsModal(false)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-4 text-white rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">IP Access Logs</h2>
                  <p className="text-rose-100 text-sm font-mono">{selectedIP}</p>
                </div>
                <button onClick={() => setShowLogsModal(false)} className="text-white hover:text-rose-100 transition">
                  <FaTimes />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {ipLogs.length === 0 ? (
                <div className="text-center py-8">
                  <FaInfoCircle className="text-gray-300 text-4xl mx-auto mb-2" />
                  <p className="text-gray-500">No logs found for this IP</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {ipLogs.map((log, index) => (
                    <div key={index} className="border-l-4 border-rose-500 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-800 capitalize">{log.action}</p>
                          {log.reason && <p className="text-xs text-gray-500 mt-1">{log.reason}</p>}
                          {log.url && <p className="text-xs text-gray-400 mt-1">URL: {log.url}</p>}
                        </div>
                        <p className="text-xs text-gray-400">{formatDate(log.timestamp)}</p>
                      </div>
                      {log.blockedBy && <p className="text-xs text-gray-500 mt-1">By: {log.blockedBy}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default IpBlock;