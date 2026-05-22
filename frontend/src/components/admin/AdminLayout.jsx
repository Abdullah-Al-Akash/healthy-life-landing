import { Outlet, Link, useNavigate } from 'react-router-dom';
import { FaHome, FaBox, FaShoppingCart, FaUsers, FaSignOutAlt, FaChartBar } from 'react-icons/fa';

const AdminLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: <FaChartBar />, label: 'Dashboard', roles: ['super_admin', 'developer', 'admin'] },
    { path: '/admin/products', icon: <FaBox />, label: 'Products', roles: ['super_admin', 'developer', 'admin'] },
    { path: '/admin/orders', icon: <FaShoppingCart />, label: 'Orders', roles: ['super_admin', 'developer', 'admin'] },
    { path: '/admin/users', icon: <FaUsers />, label: 'Users', roles: ['super_admin', 'developer'] },
  ];

  const allowedMenus = menuItems.filter(item => 
    item.roles.includes(user.role)
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* সাইডবার */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 shadow-lg z-10">
        <div className="flex flex-col h-full">
          {/* লোগো */}
          <div className="flex items-center justify-center h-16 bg-gray-800">
            <h1 className="text-white font-bold text-xl">Admin Panel</h1>
          </div>

          {/* মেনু */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {allowedMenus.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors duration-200"
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* ফুটার */}
          <div className="p-4 border-t border-gray-800">
            <div className="mb-4 text-sm text-gray-400">
              <p>Logged in as:</p>
              <p className="font-semibold text-white">{user.name}</p>
              <p className="text-xs capitalize">{user.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors duration-200"
            >
              <FaSignOutAlt className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* মেইন কন্টেন্ট */}
      <div className="ml-64">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;