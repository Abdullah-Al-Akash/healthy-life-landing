import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaHome, FaBox, FaShoppingCart, FaUsers, FaSignOutAlt, FaChartBar,
  FaUserShield, FaClock, FaBan, FaCog, FaBars, FaTimes,
  FaTachometerAlt, FaClipboardList, FaUserCircle, FaMoon, FaSun
} from 'react-icons/fa';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // ডার্ক মোড টগল
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  // মেনু আইটেমস
  const menuItems = [
    { 
      path: '/admin/dashboard', 
      icon: <FaTachometerAlt />, 
      label: 'Dashboard', 
      roles: ['super_admin', 'developer', 'admin'],
      description: 'Overview & Statistics'
    },
    { 
      path: '/admin/products', 
      icon: <FaBox />, 
      label: 'Products', 
      roles: ['super_admin', 'developer', 'admin'],
      description: 'Manage products'
    },
    { 
      path: '/admin/orders', 
      icon: <FaShoppingCart />, 
      label: 'Orders', 
      roles: ['super_admin', 'developer', 'admin'],
      description: 'Track & manage orders'
    },
    { 
      path: '/admin/customers', 
      icon: <FaUsers />, 
      label: 'Customers', 
      roles: ['super_admin', 'developer', 'admin'],
      description: 'Customer management'
    },
    { 
      path: '/admin/incomplete-orders', 
      icon: <FaClock />, 
      label: 'Incomplete Orders', 
      roles: ['super_admin', 'developer', 'admin'],
      description: 'Pending & abandoned'
    },
    { 
      path: '/admin/ip-block', 
      icon: <FaBan />, 
      label: 'IP Block', 
      roles: ['super_admin', 'developer'],
      description: 'Block malicious IPs'
    },
    { 
      path: '/admin/settings', 
      icon: <FaCog />, 
      label: 'Settings', 
      roles: ['super_admin', 'developer'],
      description: 'System configuration'
    },
    { 
      path: '/admin/users', 
      icon: <FaUserShield />, 
      label: 'Users', 
      roles: ['super_admin', 'developer'],
      description: 'Admin management'
    },
  ];

  const allowedMenus = menuItems.filter(item => 
    item.roles.includes(user.role)
  );

  // মোবাইলে সাইডবার বন্ধ করা
  const closeSidebar = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>
      
      {/* মোবাইল হেডার */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md z-20 px-4 py-3 flex justify-between items-center">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
        <h1 className="text-lg font-bold text-gray-800 dark:text-white">Admin Panel</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {darkMode ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-gray-600" />}
          </button>
          <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {user.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {/* ওভারলে (মোবাইলে সাইডবার খোলা থাকলে) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* সাইডবার */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-800 shadow-2xl z-40
        transform transition-transform duration-300 ease-in-out overflow-y-auto
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* সাইডবার হেডার */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl flex items-center justify-center">
              <FaBox className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">Herbal<span className="text-rose-500">Care</span></h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* ইউজার প্রোফাইল */}
        <div className="p-4 mx-4 mt-4 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-gray-700 dark:to-gray-700 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-800 dark:text-white">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role?.replace('_', ' ')}</p>
            </div>
          </div>
        </div>

        {/* নেভিগেশন মেনু */}
        <nav className="flex-1 px-4 py-6">
          <div className="space-y-1">
            {allowedMenus.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                    ${isActive 
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <span className={`text-lg ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-rose-500'}`}>
                    {item.icon}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className={`text-xs ${isActive ? 'text-rose-100' : 'text-gray-400'}`}>
                      {item.description}
                    </p>
                  </div>
                  {isActive && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* সাইডবার ফুটার */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">Theme</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              {darkMode ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-gray-600" />}
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
          >
            <FaSignOutAlt className="text-lg" />
            <span className="font-medium">Logout</span>
          </button>
          <p className="text-xs text-center text-gray-400 mt-4">
            © {new Date().getFullYear()} HerbalCare Admin
          </p>
        </div>
      </aside>

      {/* মেইন কন্টেন্ট */}
      <main className="lg:ml-72 min-h-screen">
        {/* ডেস্কটপ হেডার */}
        <div className="hidden lg:flex sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm px-6 py-4 justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Welcome back, <span className="text-rose-500">{user.name?.split(' ')[0]}</span>
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Here's what's happening with your store today.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              {darkMode ? <FaSun className="text-yellow-500 text-xl" /> : <FaMoon className="text-gray-600 text-xl" />}
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800 dark:text-white">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role?.replace('_', ' ')}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* পেজ কন্টেন্ট */}
        <div className="p-4 md:p-6 pt-20 lg:pt-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;