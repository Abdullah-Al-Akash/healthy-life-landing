import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaShoppingCart, FaBox, FaUsers, FaDollarSign, 
  FaCalendarAlt, FaChartLine, FaTruck, FaCheckCircle,
  FaTimesCircle, FaSpinner, FaUserGraduate, FaMedal,
  FaTrophy, FaStar, FaEye, FaArrowUp, FaArrowDown
} from 'react-icons/fa';
import { adminApi } from '../../api/admin';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    approvedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    totalCustomers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('month');
  const [customDate, setCustomDate] = useState({ start: '', end: '' });
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [orderStats, setOrderStats] = useState([]);
  const [dailyOrders, setDailyOrders] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange, customDate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      let params = {};
      
      if (showCustomDate && customDate.start && customDate.end) {
        params = { startDate: customDate.start, endDate: customDate.end };
      } else {
        params = { range: dateRange };
      }
      
      const res = await adminApi.getDashboardStats(params);
      const data = res.data;
      
      setStats(data.stats);
      setOrderStats(data.orderStatusDistribution || []);
      setDailyOrders(data.dailyOrders || []);
      setTopCustomers(data.topCustomers || { byAmount: [], byOrders: [] });
      setTopProducts(data.topProducts || { byCount: [], byRevenue: [] });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusChartData = {
    labels: orderStats.map(s => s.label),
    datasets: [
      {
        data: orderStats.map(s => s.value),
        backgroundColor: orderStats.map(s => s.color),
        borderWidth: 0,
      },
    ],
  };

  // লাইন চার্ট ডাটা (ডেইলি অর্ডার ট্রেন্ড)
  const lineChartData = {
    labels: dailyOrders.map(d => d.date),
    datasets: [
      {
        label: 'Orders',
        data: dailyOrders.map(d => d.orders),
        borderColor: '#f43f5e',
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const cards = [
    { title: 'Total Orders', value: stats.totalOrders, icon: <FaShoppingCart />, color: 'from-blue-500 to-blue-600' },
    { title: 'Pending Orders', value: stats.pendingOrders, icon: <FaSpinner />, color: 'from-yellow-500 to-yellow-600' },
    { title: 'Approved Orders', value: stats.approvedOrders, icon: <FaCheckCircle />, color: 'from-indigo-500 to-indigo-600' },
    { title: 'Delivered Orders', value: stats.deliveredOrders, icon: <FaTruck />, color: 'from-green-500 to-green-600' },
    { title: 'Cancelled Orders', value: stats.cancelledOrders, icon: <FaTimesCircle />, color: 'from-red-500 to-red-600' },
    { title: 'Total Revenue', value: `৳${stats.totalRevenue.toLocaleString()}`, icon: <FaDollarSign />, color: 'from-rose-500 to-pink-600' },
    { title: 'Total Products', value: stats.totalProducts, icon: <FaBox />, color: 'from-purple-500 to-purple-600' },
    { title: 'Total Customers', value: stats.totalCustomers, icon: <FaUsers />, color: 'from-cyan-500 to-cyan-600' },
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* হেডার */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* ডেট রেঞ্জ ফিল্টার */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => { setDateRange('week'); setShowCustomDate(false); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
            dateRange === 'week' && !showCustomDate
              ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          This Week
        </button>
        <button
          onClick={() => { setDateRange('month'); setShowCustomDate(false); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
            dateRange === 'month' && !showCustomDate
              ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          This Month
        </button>
        <button
          onClick={() => { setDateRange('year'); setShowCustomDate(false); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
            dateRange === 'year' && !showCustomDate
              ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          This Year
        </button>
        <button
          onClick={() => setShowCustomDate(!showCustomDate)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
            showCustomDate
              ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <FaCalendarAlt /> Custom Range
        </button>
      </div>

      {/* কাস্টম ডেট রেঞ্জ */}
      {showCustomDate && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-3 mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100 items-end"
        >
          <div>
            <label className="text-xs text-gray-500 block mb-1">Start Date</label>
            <input
              type="date"
              value={customDate.start}
              onChange={(e) => setCustomDate({ ...customDate, start: e.target.value })}
              className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-rose-400 outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">End Date</label>
            <input
              type="date"
              value={customDate.end}
              onChange={(e) => setCustomDate({ ...customDate, end: e.target.value })}
              className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-rose-400 outline-none"
            />
          </div>
          <button
            onClick={() => fetchDashboardData()}
            className="px-4 py-2 bg-rose-500 text-white rounded-lg text-sm hover:bg-rose-600 transition"
          >
            Apply Filter
          </button>
        </motion.div>
      )}

      {/* স্ট্যাটাস কার্ড গ্রিড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 mb-8">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className={`bg-gradient-to-r ${card.color} rounded-2xl p-4 text-white shadow-lg hover:shadow-xl transition-all`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/80 text-xs uppercase tracking-wide">{card.title}</p>
                <p className="text-xl font-bold mt-1">{card.value}</p>
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                {card.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* চার্ট সেকশন */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* অর্ডার ট্রেন্ড লাইন চার্ট */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaChartLine className="text-rose-500" /> Order Trend (Last 7 Days)
          </h3>
          <div className="h-64">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </motion.div>

        {/* অর্ডার স্ট্যাটাস ডোনাট চার্ট */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaChartLine className="text-rose-500" /> Order Status Distribution
          </h3>
          <div className="h-64">
            <Doughnut data={statusChartData} options={chartOptions} />
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {orderStats.map((stat, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stat.color }}></div>
                <span className="text-sm text-gray-600">{stat.label}: {stat.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* টপ কাস্টমার সেকশন */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* টপ কাস্টমার বাই অ্যামাউন্ট */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaTrophy className="text-yellow-500" /> Top Customers by Amount
          </h3>
          <div className="space-y-3">
            {topCustomers.byAmount?.map((customer, index) => (
              <div key={customer._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-600' : 'bg-rose-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{customer.name || 'N/A'}</p>
                    <p className="text-xs text-gray-400">{customer.phone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-rose-600">{formatPrice(customer.totalSpent)}</p>
                  <p className="text-xs text-gray-400">{customer.totalOrders} orders</p>
                </div>
              </div>
            ))}
            {(!topCustomers.byAmount || topCustomers.byAmount.length === 0) && (
              <p className="text-center text-gray-400 py-4">No customer data available</p>
            )}
          </div>
        </motion.div>

        {/* টপ কাস্টমার বাই অর্ডার কাউন্ট */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaMedal className="text-blue-500" /> Top Customers by Orders
          </h3>
          <div className="space-y-3">
            {topCustomers.byOrders?.map((customer, index) => (
              <div key={customer._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-600' : 'bg-rose-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{customer.name || 'N/A'}</p>
                    <p className="text-xs text-gray-400">{customer.phone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-rose-600">{customer.totalOrders} orders</p>
                  <p className="text-xs text-gray-400">{formatPrice(customer.totalSpent)}</p>
                </div>
              </div>
            ))}
            {(!topCustomers.byOrders || topCustomers.byOrders.length === 0) && (
              <p className="text-center text-gray-400 py-4">No customer data available</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* টপ প্রোডাক্ট সেকশন */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* টপ প্রোডাক্ট বাই কাউন্ট */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaStar className="text-yellow-500" /> Top Products by Order Count
          </h3>
          <div className="space-y-3">
            {topProducts.byCount?.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-600' : 'bg-rose-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-xs text-gray-400">{product.count} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-rose-600">{formatPrice(product.revenue)}</p>
                </div>
              </div>
            ))}
            {(!topProducts.byCount || topProducts.byCount.length === 0) && (
              <p className="text-center text-gray-400 py-4">No product data available</p>
            )}
          </div>
        </motion.div>

        {/* টপ প্রোডাক্ট বাই রেভিনিউ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaDollarSign className="text-green-500" /> Top Products by Revenue
          </h3>
          <div className="space-y-3">
            {topProducts.byRevenue?.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-600' : 'bg-rose-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-xs text-gray-400">{product.count} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-rose-600">{formatPrice(product.revenue)}</p>
                </div>
              </div>
            ))}
            {(!topProducts.byRevenue || topProducts.byRevenue.length === 0) && (
              <p className="text-center text-gray-400 py-4">No product data available</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;