import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import LandingPage from "./pages/LandingPage";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import PrivateRoute from "./components/PrivateRoute";

// Swiper CSS
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";

function App() {
  return (
    <Router>
      <Routes>
        {/* পাবলিক রাউটস - আগের মতোই */}
        <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
        <Route path="/product/:slug" element={<MainLayout><LandingPage /></MainLayout>} />
        
        {/* অ্যাডমিন লগইন - আলাদা পেজ */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* অ্যাডমিন প্যানেল - প্রটেক্টেড */}
        <Route path="/admin" element={
          <PrivateRoute allowedRoles={['super_admin', 'developer', 'admin']}>
            <AdminLayout />
          </PrivateRoute>
        }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          {/* পরবর্তীতে আরও রাউটস যোগ হবে */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;