import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUserPlus, FaEdit, FaTrash, FaUserShield, FaUser, 
  FaCrown, FaEnvelope, FaLock, FaIdCard, FaCalendarAlt,
  FaCheckCircle, FaTimesCircle, FaEye, FaEyeSlash,
  FaSpinner, FaSearch, FaFilter
} from 'react-icons/fa';
import { adminApi } from '../../api/admin';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
  });
  const [errors, setErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    try {
      const res = await adminApi.getUsers();
      const filteredUsers = (res.data.users || []).filter(user => user.role !== 'developer');
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    if (!searchTerm) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password) => {
    if (!password && !editingUser) return 'Password is required';
    if (password && password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const validateName = (name) => {
    if (!name) return 'Name is required';
    if (name.length < 2) return 'Name must be at least 2 characters';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'email') setErrors({ ...errors, email: validateEmail(value) });
    if (name === 'password') setErrors({ ...errors, password: validatePassword(value) });
    if (name === 'name') setErrors({ ...errors, name: validateName(value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
    };
    
    setErrors(newErrors);
    
    if (newErrors.name || newErrors.email || newErrors.password) {
      return;
    }
    
    setSubmitLoading(true);
    
    try {
      if (editingUser) {
        await adminApi.updateUserRole(editingUser._id, formData.role);
      } else {
        await adminApi.createAdmin(formData);
      }
      fetchUsers();
      setShowModal(false);
      resetForm();
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Something went wrong' });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('⚠️ Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await adminApi.deleteUser(id);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'admin' });
    setErrors({});
    setShowPassword(false);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'super_admin': return <FaCrown className="text-yellow-500" />;
      case 'admin': return <FaUserShield className="text-blue-500" />;
      default: return <FaUser className="text-gray-500" />;
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      super_admin: 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white',
      admin: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
    };
    return badges[role] || 'bg-gray-100 text-gray-800';
  };

  const getRoleName = (role) => {
    switch (role) {
      case 'super_admin': return 'Super Admin';
      case 'admin': return 'Admin';
      default: return role;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (currentUser.role !== 'super_admin' && currentUser.role !== 'developer') {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUserShield className="text-red-500 text-2xl" />
          </div>
          <h2 className="text-xl font-semibold text-red-700 mb-2">Access Denied</h2>
          <p className="text-red-600">Only Super Admin can access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* হেডার */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
            Users Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage admin users and their roles</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition"
          >
            <FaUserPlus /> Add Admin
          </button>
        </div>
      </div>

      {/* পরিসংখ্যান কার্ড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Admins</p>
              <p className="text-3xl font-bold">{filteredUsers.length}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <FaUserShield className="text-2xl" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Super Admins</p>
              <p className="text-3xl font-bold">{filteredUsers.filter(u => u.role === 'super_admin').length}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <FaCrown className="text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* ইউজার গ্রিড */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div className={`h-24 ${user.role === 'super_admin' ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 'bg-gradient-to-r from-blue-500 to-blue-600'}`} />
              
              <div className="px-6 pb-6">
                <div className="flex justify-between items-start -mt-10 mb-4">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-2xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 text-white">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${getRoleBadge(user.role)} shadow-sm`}>
                    {getRoleIcon(user.role)}
                    <span className="ml-1">{getRoleName(user.role)}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <h3 className="font-bold text-gray-800 text-lg">{user.name}</h3>
                  <p className="text-gray-500 text-sm flex items-center gap-2">
                    <FaEnvelope className="text-gray-400" /> {user.email}
                  </p>
                  <p className="text-gray-400 text-xs flex items-center gap-2">
                    <FaIdCard className="text-gray-400" /> ID: {user._id?.slice(-12)}
                  </p>
                  <p className="text-gray-400 text-xs flex items-center gap-2">
                    <FaCalendarAlt className="text-gray-400" /> Joined: {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>

                {user._id !== currentUser._id && (
                  <div className="flex gap-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setEditingUser(user);
                        setFormData({ name: user.name, email: user.email, password: '', role: user.role });
                        setShowModal(true);
                      }}
                      className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-xl text-sm flex items-center justify-center gap-2 transition"
                    >
                      <FaEdit size={14} /> Edit Role
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-xl text-sm flex items-center justify-center gap-2 transition"
                    >
                      <FaTrash size={14} /> Delete
                    </button>
                  </div>
                )}
                
                {user._id === currentUser._id && (
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-center text-xs text-gray-400">Current account</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* খালি স্টেট */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-md">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUserShield className="text-gray-400 text-3xl" />
          </div>
          <p className="text-gray-500">No admin users found.</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 text-rose-500 hover:text-rose-600 font-medium"
          >
            + Add your first admin
          </button>
        </div>
      )}

      {/* অ্যাড/এডিট মোডাল */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => { setShowModal(false); resetForm(); }}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-4 rounded-t-2xl">
              <h2 className="text-xl font-bold text-white">
                {editingUser ? 'Edit User Role' : 'Add New Admin'}
              </h2>
              <p className="text-rose-100 text-sm">
                {editingUser ? 'Change user role permissions' : 'Create a new admin user'}
              </p>
            </div>

            <div className="p-6">
              {errors.submit && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
                  <FaTimesCircle /> {errors.submit}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {!editingUser && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="John Doe"
                        />
                      </div>
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="admin@example.com"
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      {!errors.email && formData.email && <p className="text-green-500 text-xs mt-1">✓ Valid email</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-10 py-2 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition ${
                            errors.password ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                      {!errors.password && formData.password && formData.password.length >= 6 && (
                        <p className="text-green-500 text-xs mt-1">✓ Strong password</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">Minimum 6 characters</p>
                    </div>
                  </>
                )}

                {editingUser && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600">User: <span className="font-semibold">{editingUser.name}</span></p>
                    <p className="text-sm text-gray-600">Email: <span className="font-semibold">{editingUser.email}</span></p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
                  >
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                  <p className="text-xs text-gray-400 mt-1">
                    {formData.role === 'super_admin' 
                      ? 'Super Admin can manage all users and settings' 
                      : 'Admin can manage products and orders only'}
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); resetForm(); }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:from-rose-600 hover:to-pink-600 transition disabled:opacity-50"
                  >
                    {submitLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <FaSpinner className="animate-spin" /> Processing...
                      </div>
                    ) : (
                      editingUser ? 'Update Role' : 'Create Admin'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Users;