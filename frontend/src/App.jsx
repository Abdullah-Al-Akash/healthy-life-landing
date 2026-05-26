import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import Users from "./pages/admin/Users";
import PrivateRoute from "./components/PrivateRoute";
import TrackOrder from "./pages/TrackOrder";
import Customers from "./pages/admin/Customers";
import IpBlock from "./pages/admin/IpBlock";
import Settings from "./pages/admin/Settings";
import IncompleteOrders from "./pages/admin/IncompleteOrders";
import ScrollToTop from "./components/ScrollToTop";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import fbPixel from "./utils/fbPixel";

// পেজ ভিউ ট্র্যাক করার জন্য আলাদা কম্পোনেন্ট
const PageViewTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    // পেজ চেঞ্জ হলে পেজ ভিউ ট্র্যাক
    fbPixel.pageView();
  }, [location]);
  
  return null;
};

function App() {
  return (
    <Router>
      <PageViewTracker />
      <ScrollToTop />
      <Routes>
        {/* পাবলিক রাউটস */}
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/product/:slug" element={<MainLayout><ProductPage /></MainLayout>} />
        <Route path="/track-order" element={<MainLayout><TrackOrder /></MainLayout>} />
        
        {/* অ্যাডমিন লগইন */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* অ্যাডমিন প্যানেল */}
        <Route path="/admin" element={
          <PrivateRoute allowedRoles={['super_admin', 'developer', 'admin']}>
            <AdminLayout />
          </PrivateRoute>
        }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="customers" element={<Customers />} />
          <Route path="ip-block" element={<IpBlock />} />
          <Route path="settings" element={<Settings />} />
          <Route path="incomplete-orders" element={<IncompleteOrders />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;