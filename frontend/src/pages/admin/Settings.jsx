import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaLock, FaSave, FaSpinner, 
  FaEye, FaEyeSlash, FaShieldAlt, FaCheckCircle,
  FaUserCircle, FaIdCard, FaCalendarAlt, FaEnvelope, FaUser
} from 'react-icons/fa';
import { adminApi } from '../../api/admin';
import { authApi } from '../../api/auth';

const Settings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await authApi.getProfile();
      setUser(res.data.user || res.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New password and confirm password do not match' });
      setSaving(false);
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      setSaving(false);
      return;
    }
    
    try {
      await adminApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password' });
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
          Account Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account security</p>
      </div>

      {/* মেসেজ */}
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {message.type === 'success' ? <FaCheckCircle /> : <FaShieldAlt />}
          {message.text}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* প্রোফাইল কার্ড - শুধু তথ্য দেখাবে */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-6"
          >
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-6 text-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FaUserCircle className="text-rose-500 text-6xl" />
              </div>
              <h3 className="text-white font-bold text-xl">{user?.name}</h3>
              <p className="text-rose-100 text-sm mt-1 capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <FaEnvelope className="text-gray-400 w-4" />
                <span className="text-gray-700">{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <FaIdCard className="text-gray-400 w-4" />
                <span className="text-gray-500 font-mono text-xs">ID: {user?._id?.slice(-12)}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <FaCalendarAlt className="text-gray-400 w-4" />
                <span className="text-gray-500">Joined: {formatDate(user?.createdAt)}</span>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="text-green-500 text-sm" />
                  <span className="text-xs text-gray-500">Account Status: Active</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* পাসওয়ার্ড চেঞ্জ সেকশন */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <FaLock /> Change Password
              </h2>
              <p className="text-rose-100 text-sm">Update your password to keep your account secure</p>
            </div>
            
            <form onSubmit={handlePasswordChange} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
                    placeholder="Enter current password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Password must be at least 6 characters</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-2.5 rounded-xl flex items-center gap-2 hover:shadow-lg transition disabled:opacity-50 font-medium"
                >
                  {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                  {saving ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;