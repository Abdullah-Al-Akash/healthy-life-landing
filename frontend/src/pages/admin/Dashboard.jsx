import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaShoppingCart, FaBox, FaUsers, FaDollarSign } from 'react-icons/fa';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const [ordersRes, productsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/orders/stats/summary', config),
        axios.get('http://localhost:5000/api/products', config),
      ]);

      setStats({
        totalOrders: ordersRes.data.stats.totalOrders,
        pendingOrders: ordersRes.data.stats.pendingOrders,
        totalProducts: productsRes.data.count,
        totalRevenue: ordersRes.data.stats.totalRevenue,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { title: 'Total Orders', value: stats.totalOrders, icon: <FaShoppingCart />, color: 'bg-blue-500' },
    { title: 'Pending Orders', value: stats.pendingOrders, icon: <FaShoppingCart />, color: 'bg-yellow-500' },
    { title: 'Total Products', value: stats.totalProducts, icon: <FaBox />, color: 'bg-green-500' },
    { title: 'Total Revenue', value: `৳${stats.totalRevenue.toLocaleString()}`, icon: <FaDollarSign />, color: 'bg-rose-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{card.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
              </div>
              <div className={`${card.color} p-3 rounded-full text-white`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;