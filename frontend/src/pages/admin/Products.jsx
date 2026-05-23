import { useState, useEffect } from "react";
import { 
  FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, 
  FaTimes, FaArrowLeft, FaArrowRight, FaSave, FaSpinner 
} from "react-icons/fa";
import { adminApi } from "../../api/admin";
import BasicInfoForm from "../../components/admin/productForms/BasicInfoForm";
import BannerForm from "../../components/admin/productForms/BannerForm";
import WhyChooseForm from "../../components/admin/productForms/WhyChooseForm";
import VideoForm from "../../components/admin/productForms/VideoForm";
import FaqForm from "../../components/admin/productForms/FaqForm";
import ReviewForm from "../../components/admin/productForms/ReviewForm";

// ContactForm ইম্পোর্ট করো না - দরকার নেই

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);

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
    buttonText: "এখনই অর্ডার করুন",
    productInfo: { id: "", title: "", offerPrice: "", image: "" }
  });

  useEffect(() => {
    fetchProducts();
  }, []);

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
        video: { badge: "ভিডিও টিউটোরিয়াল", title: "পণ্য সম্পর্কে বিস্তারিত জানুন", highlightText: "বিস্তারিত জানুন", subtitle: "আমাদের পণ্য如何使用, এর উপকারিতা এবং ব্যবহার পদ্ধতি সম্পর্কে ভিডিওতে দেখুন" },
        reviews: { badge: "গ্রাহকদের মতামত", title: "তারা যা বলছেন", highlightText: "বলছেন", subtitle: "১০,০০০+ খুশি গ্রাহক আমাদের মূল্যায়ন করেছেন" },
        faq: { title: "প্রায়শই জিজ্ঞাসিত প্রশ্ন", highlightText: "প্রশ্ন", subtitle: "আপনার মনে হতে পারে এমন কিছু সাধারণ প্রশ্নের উত্তর জেনে নিন" }
      },
      orderBanner: product.orderBanner || { title: "আজই অর্ডার করুন ও পান বিশেষ ছাড়!", subtitle: "সীমিত সময়ের অফার। দেরি না করে এখনই অর্ডার করুন。" },
      buttonText: product.buttonText || "এখনই অর্ডার করুন",
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
        whyChooseUs: { title: "কেন বেছে নেবেন আমাদের?", highlightText: "আমাদের?", subtitle: "আমরা চাই আপনাকে সেরা সেবা ও মানসম্মত পণ্য দিতে।" },
        video: { badge: "ভিডিও টিউটোরিয়াল", title: "পণ্য সম্পর্কে বিস্তারিত জানুন", highlightText: "বিস্তারিত জানুন", subtitle: "আমাদের পণ্য如何使用, এর উপকারিতা এবং ব্যবহার পদ্ধতি সম্পর্কে ভিডিওতে দেখুন" },
        reviews: { badge: "গ্রাহকদের মতামত", title: "তারা যা বলছেন", highlightText: "বলছেন", subtitle: "১০,০০০+ খুশি গ্রাহক আমাদের মূল্যায়ন করেছেন" },
        faq: { title: "প্রায়শই জিজ্ঞাসিত প্রশ্ন", highlightText: "প্রশ্ন", subtitle: "আপনার মনে হতে পারে এমন কিছু সাধারণ প্রশ্নের উত্তর জেনে নিন" }
      },
      orderBanner: { title: "আজই অর্ডার করুন ও পান বিশেষ ছাড়!", subtitle: "সীমিত সময়ের অফার। দেরি না করে এখনই অর্ডার করুন。" },
      buttonText: "এখনই অর্ডার করুন",
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

  const totalSteps = 6; // এখন 6 স্টেপ (কারণ 5 & 7 একই)
  const progress = (currentStep / totalSteps) * 100;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-rose-500 text-3xl" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products Management</h1>
        <button onClick={handleCreate} className="bg-rose-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <FaPlus /> Add Product
        </button>
      </div>

      {/* টেবিল */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">SL</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Title</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Slug</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={p._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{i + 1}</td>
                <td className="px-4 py-3 text-sm">{p.navTitle}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{p.slug}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${p.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {p.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(p)} className="text-blue-500"><FaEdit /></button>
                    <button onClick={() => handleToggle(p._id)} className={p.isActive ? "text-green-500" : "text-gray-400"}><FaToggleOn size={18} /></button>
                    <button onClick={() => handleDelete(p._id)} className="text-red-500"><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* মোডাল */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* হেডার */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">{editingProduct ? "Edit Product" : "New Product"}</h2>
                <p className="text-sm text-gray-500">Step {currentStep} of {totalSteps}</p>
              </div>
              <button onClick={() => setShowModal(false)}><FaTimes className="text-gray-400" /></button>
            </div>

            {/* প্রগ্রেস বার */}
            <div className="px-6 pt-4">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 transition-all" style={{ width: `${progress}%` }}></div>
              </div>
            </div>

            {/* স্টেপ কন্টেন্ট */}
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

            {/* বাটন */}
            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-between">
              <button
                onClick={() => setCurrentStep(p => p - 1)}
                disabled={currentStep === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                ← Previous
              </button>
              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                {currentStep === totalSteps ? (
                  <button onClick={handleSave} className="bg-rose-500 text-white px-6 py-2 rounded-lg flex items-center gap-2">
                    {saving ? <FaSpinner className="animate-spin" /> : <FaSave />} Save
                  </button>
                ) : (
                  <button onClick={() => setCurrentStep(p => p + 1)} className="bg-rose-500 text-white px-6 py-2 rounded-lg">
                    Next →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;