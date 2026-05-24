import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, 
  FaTimes, FaArrowLeft, FaArrowRight, FaSave, FaSpinner,
  FaSearch, FaFilter, FaEye, FaCopy, FaCheck,
  FaBox, FaStar, FaImage, FaChartLine
} from "react-icons/fa";
import { adminApi } from "../../api/admin";
import BasicInfoForm from "../../components/admin/productForms/BasicInfoForm";
import BannerForm from "../../components/admin/productForms/BannerForm";
import WhyChooseForm from "../../components/admin/productForms/WhyChooseForm";
import VideoForm from "../../components/admin/productForms/VideoForm";
import FaqForm from "../../components/admin/productForms/FaqForm";
import ReviewForm from "../../components/admin/productForms/ReviewForm";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [copiedId, setCopiedId] = useState(null);

  const [formData, setFormData] = useState({
    slug: "",
    navTitle: "",
    isActive: true,
    banners: [],
    whyChooseUs: [],
    video: { videoId: "", title: "", description: "" },
    faqs: [],
    reviews: [],
    contactInfo: { facebook: "", whatsapp: "", phone: "" },
    sectionHeadings: {
      whyChooseUs: { title: "", highlightText: "", subtitle: "" },
      video: { badge: "", title: "", highlightText: "", subtitle: "" },
      reviews: { badge: "", title: "", highlightText: "", subtitle: "" },
      faq: { title: "", highlightText: "", subtitle: "" }
    },
    orderBanner: { title: "", subtitle: "" },
    buttonTexts: {
      banner: "এখনই অর্ডার করুন",
      whyChooseUs: "এখনই অর্ডার করুন",
      video: "এখনই অর্ডার করুন",
      reviews: "এখনই অর্ডার করুন",
      faq: "এখনই অর্ডার করুন"
    },
    productInfo: { id: "", title: "", offerPrice: "", image: "" }
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, statusFilter]);

  const fetchProducts = async () => {
    try {
      const res = await adminApi.getProducts();
      setProducts(res.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.navTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.slug?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(p => 
        statusFilter === "active" ? p.isActive : !p.isActive
      );
    }
    
    setFilteredProducts(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await adminApi.deleteProduct(id);
      fetchProducts();
    }
  };

  const handleToggle = async (id) => {
    await adminApi.toggleProduct(id);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      slug: product.slug || "",
      navTitle: product.navTitle || "",
      isActive: product.isActive !== false,
      banners: product.banners || [],
      whyChooseUs: product.whyChooseUs || [],
      video: product.video || { videoId: "", title: "", description: "" },
      faqs: product.faqs || [],
      reviews: product.reviews || [],
      contactInfo: product.contactInfo || { facebook: "", whatsapp: "", phone: "" },
      sectionHeadings: product.sectionHeadings || {
        whyChooseUs: { title: "কেন বেছে নেবেন আমাদের?", highlightText: "আমাদের?", subtitle: "আমরা চাই আপনাকে সেরা সেবা ও মানসম্মত পণ্য দিতে।" },
        video: { badge: "ভিডিও টিউটোরিয়ал", title: "পণ্য সম্পর্কে বিস্তারিত জানুন", highlightText: "বিস্তারিত জানুন", subtitle: "আমাদের পণ্য如何使用, এর উপকারিতা এবং ব্যবহার পদ্ধতি সম্পর্কে ভিডিওতে দেখুন" },
        reviews: { badge: "গ্রাহকদের মতামত", title: "তারা যা বলছেন", highlightText: "বলছেন", subtitle: "১০,০০০+ খুশি গ্রাহক আমাদের মূল্যায়ন করেছেন" },
        faq: { title: "প্রায়শই জিজ্ঞাসিত প্রশ্ন", highlightText: "প্রশ্ন", subtitle: "আপনার মনে হতে পারে এমন কিছু সাধারণ প্রশ্নের উত্তর জেনে নিন" }
      },
      orderBanner: product.orderBanner || { title: "আজই অর্ডার করুন ও পান বিশেষ ছাড়!", subtitle: "সীমিত সময়ের অফার। দেরি না করে এখনই অর্ডার করুন。" },
      buttonTexts: product.buttonTexts || {
        banner: "এখনই অর্ডার করুন",
        whyChooseUs: "এখনই অর্ডার করুন",
        video: "এখনই অর্ডার করুন",
        reviews: "এখনই অর্ডার করুন",
        faq: "এখনই অর্ডার করুন"
      },
      productInfo: product.productInfo || { id: "", title: "", offerPrice: "", image: "" }
    });
    setCurrentStep(1);
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setFormData({
      slug: "",
      navTitle: "",
      isActive: true,
      banners: [],
      whyChooseUs: [],
      video: { videoId: "", title: "", description: "" },
      faqs: [],
      reviews: [],
      contactInfo: { facebook: "", whatsapp: "", phone: "" },
      sectionHeadings: {
        whyChooseUs: { title: "কেন বেছে নেবেন আমাদের?", highlightText: "আমাদের?", subtitle: "আমরা চাই আপনাকে সেরা সেবা ও মানসম্মত পণ্য দিতে。" },
        video: { badge: "ভিডিও টিউটোরিয়াল", title: "পণ্য সম্পর্কে বিস্তারিত জানুন", highlightText: "বিস্তারিত জানুন", subtitle: "আমাদের পণ্য如何使用, এর উপকারিতা এবং ব্যবহার পদ্ধতি সম্পর্কে ভিডিওতে দেখুন" },
        reviews: { badge: "গ্রাহকদের মতামত", title: "তারা যা বলছেন", highlightText: "বলছেন", subtitle: "১০,০০০+ খুশি গ্রাহক আমাদের মূল্যায়ন করেছেন" },
        faq: { title: "প্রায়শই জিজ্ঞাসিত প্রশ্ন", highlightText: "প্রশ্ন", subtitle: "আপনার মনে হতে পারে এমন কিছু সাধারণ প্রশ্নের উত্তর জেনে নিন" }
      },
      orderBanner: { title: "আজই অর্ডার করুন ও পান বিশেষ ছাড়!", subtitle: "সীমিত সময়ের অফার। দেরি না করে এখনই অর্ডার করুন。" },
      buttonTexts: {
        banner: "এখনই অর্ডার করুন",
        whyChooseUs: "এখনই অর্ডার করুন",
        video: "এখনই অর্ডার করুন",
        reviews: "এখনই অর্ডার করুন",
        faq: "এখনই অর্ডার করুন"
      },
      productInfo: { id: "", title: "", offerPrice: "", image: "" }
    });
    setCurrentStep(1);
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingProduct) {
        await adminApi.updateProduct(editingProduct._id, formData);
        alert("Product updated successfully!");
      } else {
        await adminApi.createProduct(formData);
        alert("Product created successfully!");
      }
      fetchProducts();
      setShowModal(false);
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const copySlug = async (slug) => {
    await navigator.clipboard.writeText(slug);
    setCopiedId(slug);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

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
            Products Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage your product catalog</p>
        </div>
        
        <button 
          onClick={handleCreate} 
          className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
        >
          <FaPlus /> Add Product
        </button>
      </div>

      {/* স্ট্যাটাস কার্ড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Products</p>
              <p className="text-2xl font-bold">{products.length}</p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <FaBox className="text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Active Products</p>
              <p className="text-2xl font-bold">{products.filter(p => p.isActive).length}</p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <FaCheck className="text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm">Inactive Products</p>
              <p className="text-2xl font-bold">{products.filter(p => !p.isActive).length}</p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <FaTimes className="text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Banners</p>
              <p className="text-2xl font-bold">{products.reduce((sum, p) => sum + (p.banners?.length || 0), 0)}</p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <FaImage className="text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* সার্চ ও ফিল্টার */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              statusFilter === "all" 
                ? "bg-rose-500 text-white shadow-md" 
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter("active")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              statusFilter === "active" 
                ? "bg-green-500 text-white shadow-md" 
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setStatusFilter("inactive")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              statusFilter === "inactive" 
                ? "bg-gray-500 text-white shadow-md" 
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Inactive
          </button>
        </div>
      </div>

      {/* টেবিল ভিউ */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SL</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Banners</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Reviews</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence>
                {filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <FaBox className="text-white text-xs" />
                        </div>
                        <span className="font-medium text-gray-800">{product.navTitle}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div 
                        className="flex items-center gap-2 cursor-pointer group"
                        onClick={() => copySlug(product.slug)}
                      >
                        <code className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded group-hover:bg-rose-50 transition">
                          {product.slug}
                        </code>
                        {copiedId === product.slug ? (
                          <FaCheck className="text-green-500 text-xs" />
                        ) : (
                          <FaCopy className="text-gray-400 group-hover:text-rose-500 text-xs" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
                        <FaImage size={12} /> {product.banners?.length || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm">
                        <FaStar size={12} /> {product.reviews?.length || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggle(product._id)}
                        className={`px-3 py-1 text-xs rounded-full transition ${
                          product.isActive 
                            ? "bg-green-100 text-green-700 hover:bg-green-200" 
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                          title="Edit"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleToggle(product._id)}
                          className={`p-1.5 rounded-lg transition ${
                            product.isActive 
                              ? "text-green-500 hover:bg-green-50" 
                              : "text-gray-400 hover:bg-gray-100"
                          }`}
                          title={product.isActive ? "Deactivate" : "Activate"}
                        >
                          {product.isActive ? <FaToggleOn size={14} /> : <FaToggleOff size={14} />}
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                    </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* খালি স্টেট */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-md mt-6">
          <FaBox className="text-gray-300 text-5xl mx-auto mb-3" />
          <p className="text-gray-500">No products found</p>
          <button
            onClick={handleCreate}
            className="mt-4 text-rose-500 hover:text-rose-600 font-medium"
          >
            + Add your first product
          </button>
        </div>
      )}

      {/* অ্যাড/এডিট মোডাল */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-4 text-white rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">{editingProduct ? "Edit Product" : "Create New Product"}</h2>
                  <p className="text-rose-100 text-sm">Step {currentStep} of {totalSteps}</p>
                </div>
                <button onClick={() => setShowModal(false)} className="text-white hover:text-rose-100 transition">
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="px-6 pt-4">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 transition-all" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span className={currentStep >= 1 ? "text-rose-500" : ""}>Basic</span>
                <span className={currentStep >= 2 ? "text-rose-500" : ""}>Banner</span>
                <span className={currentStep >= 3 ? "text-rose-500" : ""}>Why Choose</span>
                <span className={currentStep >= 4 ? "text-rose-500" : ""}>Video</span>
                <span className={currentStep >= 5 ? "text-rose-500" : ""}>FAQ</span>
                <span className={currentStep >= 6 ? "text-rose-500" : ""}>Reviews</span>
              </div>
            </div>

            <div className="p-6">
              {currentStep === 1 && (
                <BasicInfoForm data={formData} onChange={(field, value) => setFormData({ ...formData, [field]: value })} />
              )}
              {currentStep === 2 && (
                <BannerForm data={formData} onChange={(field, value) => setFormData({ ...formData, [field]: value })} />
              )}
              {currentStep === 3 && (
                <WhyChooseForm data={formData} onChange={(field, value) => setFormData({ ...formData, [field]: value })} />
              )}
              {currentStep === 4 && (
                <VideoForm data={formData} onChange={(field, value) => setFormData({ ...formData, [field]: value })} />
              )}
              {currentStep === 5 && (
                <FaqForm data={formData} onChange={(field, value) => setFormData({ ...formData, [field]: value })} />
              )}
              {currentStep === 6 && (
                <ReviewForm data={formData} onChange={(field, value) => setFormData({ ...formData, [field]: value })} />
              )}
            </div>

            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-between">
              <button
                onClick={() => setCurrentStep(p => p - 1)}
                disabled={currentStep === 1}
                className="px-4 py-2 border border-gray-300 rounded-xl disabled:opacity-50 hover:bg-gray-50 transition"
              >
                ← Previous
              </button>
              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition">
                  Cancel
                </button>
                {currentStep === totalSteps ? (
                  <button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-2 rounded-xl flex items-center gap-2 disabled:opacity-50 hover:from-rose-600 hover:to-pink-600 transition">
                    {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                    {saving ? 'Saving...' : 'Save Product'}
                  </button>
                ) : (
                  <button onClick={() => setCurrentStep(p => p + 1)} className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-2 rounded-xl flex items-center gap-2 hover:from-rose-600 hover:to-pink-600 transition">
                    Next → <FaArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Products;