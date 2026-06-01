import { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { FiTruck, FiHeadphones, FiChevronRight } from "react-icons/fi";
import { FaWhatsapp, FaLeaf, FaHome, FaBox } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { productApi } from "../../api/product";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const contactInfo = {
    whatsapp: "https://wa.me/8801924512833?text=Hello%20Healthy%20Life!%20I%20have%20a%20question%20about%20your%20products.",
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productApi.getAll();
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([
        { id: 1, navTitle: "Herbal Tea", slug: "herbal-tea" },
        { id: 2, navTitle: "Green Coffee", slug: "green-coffee" },
        { id: 3, navTitle: "Aloe Vera", slug: "aloe-vera" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // সাইডবার ভেরিয়েন্টস
  const sidebarVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, duration: 0.3 },
    }),
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white/98 backdrop-blur-md shadow-md z-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* লোগো */}
            <a href="/" className="group flex items-center gap-2">
              {/* <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                <FaLeaf className="text-white text-xl" />
              </div> */}
              <div>
                <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">
                  <img src={logo} className="w-2/3" alt="logo" />
                </span>
              </div>
            </a>

            {/* ডেস্কটপ মেনু */}
            <div className="hidden md:flex items-center gap-8">
              {/* হোম */}
              <a
                href="/"
                className="text-gray-600 hover:text-rose-500 transition-colors duration-300 font-medium flex items-center gap-1"
              >
                <FaHome size={14} />
                Home
              </a>

              {/* প্রোডাক্টস ড্রপডাউন */}
              <div className="relative group">
                <button className="text-gray-600 hover:text-rose-500 transition-colors duration-300 font-medium flex items-center gap-1">
                  <FaBox size={14} />
                  Products
                  <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-gray-100">
                  <div className="py-2">
                    {loading ? (
                      <div className="px-4 py-2 text-sm text-gray-400">Loading...</div>
                    ) : (
                      products.map((product) => (
                        <a
                          key={product._id || product.id}
                          href={`/product/${product.slug}`}
                          className="block px-4 py-2 text-sm text-gray-600 hover:bg-rose-50 hover:text-rose-500 transition"
                        >
                          {product.navTitle || product.name}
                        </a>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* অর্ডার ট্র্যাক */}
              <a
                href="/track-order"
                className="text-gray-600 hover:text-rose-500 transition-colors duration-300 font-medium flex items-center gap-1"
              >
                <FiTruck size={14} />
                Track Order
              </a>

              {/* কন্টাক্ট */}
              <a
                href={contactInfo.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <FaWhatsapp size={14} />
                Contact Us
              </a>
            </div>

            {/* মোবাইল মেনু বাটন */}
            <button
              className="md:hidden text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition"
              onClick={() => setIsMenuOpen(true)}
            >
              <HiMenu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* মোবাইল সাইড ড্রয়ার */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* ব্যাকড্রপ */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* সাইডবার */}
            <motion.div
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50 md:hidden overflow-y-auto"
            >
              {/* সাইডবার হেডার */}
              <div className="bg-gradient-to-r from-rose-500 to-amber-500 p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-white italic">Healthy Life</h2>
                      <p className="text-xs text-rose-100 ms-6 italic">Since 2022</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 text-white hover:bg-white/20 rounded-lg transition"
                  >
                    <HiX size={20} />
                  </button>
                </div>
              </div>

              {/* সাইডবার মেনু */}
              <div className="p-4 space-y-1">
                {/* হোম */}
                <motion.a
                  href="/"
                  custom={0}
                  variants={menuItemVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-rose-50 hover:text-rose-500 rounded-xl transition group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaHome className="text-gray-400 group-hover:text-rose-500" />
                  <span className="flex-1">Home</span>
                  <FiChevronRight className="text-gray-400 group-hover:text-rose-500" size={16} />
                </motion.a>

                {/* প্রোডাক্টস (এক্সপান্ডেবল) */}
                <div className="space-y-1">
                  <div className="px-4 py-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Products</p>
                  </div>
                  {loading ? (
                    <div className="px-4 py-2 text-sm text-gray-400">Loading...</div>
                  ) : (
                    products.map((product, idx) => (
                      <motion.a
                        key={product._id || product.id}
                        href={`/product/${product.slug}`}
                        custom={idx + 1}
                        variants={menuItemVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex items-center gap-3 px-4 py-3 ml-4 text-gray-600 hover:bg-rose-50 hover:text-rose-500 rounded-xl transition group"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FaBox size={14} className="text-gray-400 group-hover:text-rose-500" />
                        <span className="flex-1 text-sm">{product.navTitle || product.name}</span>
                        <FiChevronRight className="text-gray-400 group-hover:text-rose-500" size={14} />
                      </motion.a>
                    ))
                  )}
                </div>

                {/* অর্ডার ট্র্যাক */}
                <motion.a
                  href="/track-order"
                  custom={10}
                  variants={menuItemVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-rose-50 hover:text-rose-500 rounded-xl transition group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiTruck className="text-gray-400 group-hover:text-rose-500" />
                  <span className="flex-1">Track Order</span>
                  <FiChevronRight className="text-gray-400 group-hover:text-rose-500" size={16} />
                </motion.a>

                {/* কন্টাক্ট */}
                <motion.a
                  href={contactInfo.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  custom={11}
                  variants={menuItemVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-500 rounded-xl transition group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaWhatsapp className="text-gray-400 group-hover:text-green-500" />
                  <span className="flex-1">Contact Us</span>
                  <FiChevronRight className="text-gray-400 group-hover:text-green-500" size={16} />
                </motion.a>
              </div>

              {/* সাইডবার ফুটার */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
                <p className="text-center text-xs text-gray-400">
                  © 2024 Healthy Life. All rights reserved.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;