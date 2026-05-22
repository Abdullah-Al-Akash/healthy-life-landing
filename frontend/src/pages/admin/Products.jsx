import { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaPlus, FaEdit, FaTrash, FaEye, FaToggleOn, FaToggleOff, 
  FaArrowLeft, FaArrowRight, FaSave, FaTimes, FaImage,
  FaYoutube, FaFacebook, FaWhatsapp, FaPhone, FaStar,
  FaLeaf, FaTruck, FaShieldAlt, FaSmile, FaHeadset, FaCertificate,
  FaCheck, FaSpinner
} from "react-icons/fa";

// উপলব্ধ আইকন লিস্ট
const AVAILABLE_ICONS = [
  { name: "FaLeaf", icon: <FaLeaf /> },
  { name: "FaTruck", icon: <FaTruck /> },
  { name: "FaShieldAlt", icon: <FaShieldAlt /> },
  { name: "FaSmile", icon: <FaSmile /> },
  { name: "FaHeadset", icon: <FaHeadset /> },
  { name: "FaCertificate", icon: <FaCertificate /> },
];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);

  const [formData, setFormData] = useState({
    slug: "",
    navTitle: "",
    isActive: true,
    banners: [],
    whyChooseUs: [],
    video: {
      videoId: "",
      title: "",
      description: "",
    },
    faqs: [],
    reviews: [],
    contactInfo: {
      facebook: "",
      whatsapp: "",
      phone: "",
    },
  });

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // অটো সেভ ফাংশন
  const autoSave = async () => {
    if (!editingProduct || !showModal) return;
    
    setSaving(true);
    try {
      await axios.put(
        `http://localhost:5000/api/products/${editingProduct._id}`,
        formData,
        config
      );
      setSaveMessage("✓ Draft saved");
      setTimeout(() => setSaveMessage(""), 2000);
    } catch (error) {
      console.error("Auto-save error:", error);
    } finally {
      setSaving(false);
    }
  };

  // ডিবাউন্সড অটো সেভ
  useEffect(() => {
    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    const timer = setTimeout(() => {
      if (editingProduct && showModal) {
        autoSave();
      }
    }, 3000);
    setAutoSaveTimer(timer);
    
    return () => clearTimeout(timer);
  }, [formData, currentStep]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products", config);
      setProducts(res.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`, config);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/products/${id}/toggle`, {}, config);
      fetchProducts();
    } catch (error) {
      console.error("Error toggling product:", error);
    }
  };

  const handleEdit = async (product) => {
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
    });
    setCurrentStep(1);
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingProduct) {
        await axios.put(
          `http://localhost:5000/api/products/${editingProduct._id}`,
          formData,
          config
        );
        alert("Product updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/products", formData, config);
        alert("Product created successfully!");
      }
      fetchProducts();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  // ব্যানার অ্যাড/রিমুভ/আপডেট
  const addBanner = () => {
    setFormData({
      ...formData,
      banners: [
        ...formData.banners,
        { image: "", title: "", subtitle: "", offerPrice: "", originalPrice: "", discount: "", description: "" },
      ],
    });
  };

  const updateBanner = (index, field, value) => {
    const updated = [...formData.banners];
    updated[index][field] = value;
    setFormData({ ...formData, banners: updated });
  };

  const removeBanner = (index) => {
    const updated = [...formData.banners];
    updated.splice(index, 1);
    setFormData({ ...formData, banners: updated });
  };

  // হোয়াই চুজ আস অ্যাড/রিমুভ/আপডেট
  const addWhyChoose = () => {
    setFormData({
      ...formData,
      whyChooseUs: [...formData.whyChooseUs, { icon: "FaLeaf", title: "", description: "" }],
    });
  };

  const updateWhyChoose = (index, field, value) => {
    const updated = [...formData.whyChooseUs];
    updated[index][field] = value;
    setFormData({ ...formData, whyChooseUs: updated });
  };

  const removeWhyChoose = (index) => {
    const updated = [...formData.whyChooseUs];
    updated.splice(index, 1);
    setFormData({ ...formData, whyChooseUs: updated });
  };

  // FAQ অ্যাড/রিমুভ/আপডেট
  const addFaq = () => {
    setFormData({
      ...formData,
      faqs: [...formData.faqs, { question: "", answer: "" }],
    });
  };

  const updateFaq = (index, field, value) => {
    const updated = [...formData.faqs];
    updated[index][field] = value;
    setFormData({ ...formData, faqs: updated });
  };

  const removeFaq = (index) => {
    const updated = [...formData.faqs];
    updated.splice(index, 1);
    setFormData({ ...formData, faqs: updated });
  };

  // রিভিউ অ্যাড/রিমুভ/আপডেট
  const addReview = () => {
    setFormData({
      ...formData,
      reviews: [...formData.reviews, { name: "", location: "", rating: 5, comment: "", date: new Date().toLocaleDateString(), avatar: "" }],
    });
  };

  const updateReview = (index, field, value) => {
    const updated = [...formData.reviews];
    updated[index][field] = value;
    setFormData({ ...formData, reviews: updated });
  };

  const removeReview = (index) => {
    const updated = [...formData.reviews];
    updated.splice(index, 1);
    setFormData({ ...formData, reviews: updated });
  };

  // ইউটিউব থাম্বনেইল URL জেনারেট
  const getYouTubeThumbnail = (videoId) => {
    if (!videoId) return "";
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  const totalSteps = 7;
  const progress = (currentStep / totalSteps) * 100;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* হেডার */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products Management</h1>
        <button
          onClick={handleCreate}
          className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <FaPlus /> Add New Product
        </button>
      </div>

      {/* প্রোডাক্ট টেবিল - রেস্পন্সিভ */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SL</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nav Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product, index) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{product.navTitle}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{product.slug}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${product.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-800">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleToggle(product._id, product.isActive)} className={product.isActive ? "text-green-600" : "text-gray-600"}>
                        {product.isActive ? <FaToggleOn size={18} /> : <FaToggleOff size={18} />}
                      </button>
                      <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-800">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* অ্যাড/এডিট মোডাল */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* হেডার */}
            <div className="sticky top-0 bg-white border-b px-4 md:px-6 py-4 flex flex-wrap justify-between items-center gap-2">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <p className="text-sm text-gray-500">Step {currentStep} of {totalSteps}</p>
              </div>
              <div className="flex items-center gap-3">
                {saveMessage && <span className="text-xs text-green-500">{saveMessage}</span>}
                {saving && <FaSpinner className="animate-spin text-rose-500" />}
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            {/* প্রগ্রেস বার */}
            <div className="px-4 md:px-6 pt-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
            </div>

            {/* স্টেপ কন্টেন্ট */}
            <div className="p-4 md:p-6">
              {/* স্টেপ 1: বেসিক ইনফো */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s/g, "-") })}
                      placeholder="e.g., herbal-tea"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">URL friendly name (auto-generated from title)</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nav Title *</label>
                    <input
                      type="text"
                      value={formData.navTitle}
                      onChange={(e) => setFormData({ ...formData, navTitle: e.target.value })}
                      placeholder="e.g., Herbal Tea"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 text-rose-500 rounded"
                    />
                    <label htmlFor="isActive" className="text-sm text-gray-700">Product Active</label>
                  </div>
                </div>
              )}

              {/* স্টেপ 2: ব্যানার সেকশন */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <h3 className="text-lg font-semibold text-gray-800">Banners</h3>
                    <button onClick={addBanner} className="text-rose-500 hover:text-rose-600 text-sm flex items-center gap-1">
                      <FaPlus size={12} /> Add Banner
                    </button>
                  </div>
                  
                  {formData.banners.map((banner, idx) => (
                    <div key={idx} className="border rounded-lg p-4 space-y-3 relative bg-gray-50">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Banner #{idx + 1}</span>
                        <button onClick={() => removeBanner(idx)} className="text-red-500 hover:text-red-700">
                          <FaTrash size={14} />
                        </button>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Image URL</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={banner.image}
                            onChange={(e) => updateBanner(idx, "image", e.target.value)}
                            placeholder="https://..."
                            className="flex-1 px-3 py-2 border rounded-lg text-sm"
                          />
                          {banner.image && (
                            <div className="w-12 h-12 bg-cover bg-center rounded border" style={{ backgroundImage: `url(${banner.image})` }} />
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Title</label>
                        <input
                          type="text"
                          value={banner.title}
                          onChange={(e) => updateBanner(idx, "title", e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                          placeholder="Banner title"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Subtitle</label>
                        <input
                          type="text"
                          value={banner.subtitle}
                          onChange={(e) => updateBanner(idx, "subtitle", e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                          placeholder="Banner subtitle"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm text-gray-600">Offer Price</label>
                          <input
                            type="text"
                            value={banner.offerPrice}
                            onChange={(e) => updateBanner(idx, "offerPrice", e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                            placeholder="299"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Original Price</label>
                          <input
                            type="text"
                            value={banner.originalPrice}
                            onChange={(e) => updateBanner(idx, "originalPrice", e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                            placeholder="499"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Discount Badge</label>
                        <input
                          type="text"
                          value={banner.discount}
                          onChange={(e) => updateBanner(idx, "discount", e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                          placeholder="40% OFF"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Description</label>
                        <textarea
                          value={banner.description}
                          onChange={(e) => updateBanner(idx, "description", e.target.value)}
                          rows="2"
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                          placeholder="Product description"
                        />
                      </div>
                    </div>
                  ))}
                  
                  {formData.banners.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed">
                      <FaImage className="text-gray-400 text-3xl mx-auto mb-2" />
                      <p className="text-gray-400">No banners added. Click "Add Banner"</p>
                    </div>
                  )}
                </div>
              )}

              {/* স্টেপ 3: হোয়াই চুজ আস */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <h3 className="text-lg font-semibold text-gray-800">Why Choose Us</h3>
                    <button onClick={addWhyChoose} className="text-rose-500 hover:text-rose-600 text-sm flex items-center gap-1">
                      <FaPlus size={12} /> Add Feature
                    </button>
                  </div>
                  
                  {formData.whyChooseUs.map((feature, idx) => (
                    <div key={idx} className="border rounded-lg p-4 space-y-3 relative bg-gray-50">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Feature #{idx + 1}</span>
                        <button onClick={() => removeWhyChoose(idx)} className="text-red-500 hover:text-red-700">
                          <FaTrash size={14} />
                        </button>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Icon</label>
                        <select
                          value={feature.icon}
                          onChange={(e) => updateWhyChoose(idx, "icon", e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                        >
                          {AVAILABLE_ICONS.map((icon) => (
                            <option key={icon.name} value={icon.name}>
                              {icon.name}
                            </option>
                          ))}
                        </select>
                        <div className="mt-2 text-rose-500">
                          {AVAILABLE_ICONS.find(i => i.name === feature.icon)?.icon}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Title</label>
                        <input
                          type="text"
                          value={feature.title}
                          onChange={(e) => updateWhyChoose(idx, "title", e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                          placeholder="Feature title"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Description</label>
                        <textarea
                          value={feature.description}
                          onChange={(e) => updateWhyChoose(idx, "description", e.target.value)}
                          rows="2"
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                          placeholder="Feature description"
                        />
                      </div>
                    </div>
                  ))}
                  
                  {formData.whyChooseUs.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed">
                      <p className="text-gray-400">No features added. Click "Add Feature"</p>
                    </div>
                  )}
                </div>
              )}

              {/* স্টেপ 4: ভিডিও সেকশন */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Video Section</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Video ID</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.video.videoId}
                        onChange={(e) => setFormData({ ...formData, video: { ...formData.video, videoId: e.target.value } })}
                        placeholder="e.g., dQw4w9WgXcQ"
                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500"
                      />
                      <FaYoutube className="text-red-500 text-2xl self-center" />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Thumbnail will be auto-generated from YouTube</p>
                  </div>
                  {formData.video.videoId && (
                    <div className="mt-2">
                      <img 
                        src={getYouTubeThumbnail(formData.video.videoId)} 
                        alt="YouTube Thumbnail" 
                        className="w-full max-w-xs rounded-lg border"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Video Title</label>
                    <input
                      type="text"
                      value={formData.video.title}
                      onChange={(e) => setFormData({ ...formData, video: { ...formData.video, title: e.target.value } })}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="Video title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Video Description</label>
                    <textarea
                      value={formData.video.description}
                      onChange={(e) => setFormData({ ...formData, video: { ...formData.video, description: e.target.value } })}
                      rows="2"
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="Video description"
                    />
                  </div>
                </div>
              )}

              {/* স্টেপ 5: FAQ */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <h3 className="text-lg font-semibold text-gray-800">FAQs</h3>
                    <button onClick={addFaq} className="text-rose-500 hover:text-rose-600 text-sm flex items-center gap-1">
                      <FaPlus size={12} /> Add FAQ
                    </button>
                  </div>
                  
                  {formData.faqs.map((faq, idx) => (
                    <div key={idx} className="border rounded-lg p-4 space-y-3 relative bg-gray-50">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">FAQ #{idx + 1}</span>
                        <button onClick={() => removeFaq(idx)} className="text-red-500 hover:text-red-700">
                          <FaTrash size={14} />
                        </button>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Question</label>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => updateFaq(idx, "question", e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                          placeholder="Frequently asked question"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Answer</label>
                        <textarea
                          value={faq.answer}
                          onChange={(e) => updateFaq(idx, "answer", e.target.value)}
                          rows="2"
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                          placeholder="Answer to the question"
                        />
                      </div>
                    </div>
                  ))}
                  
                  {formData.faqs.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed">
                      <p className="text-gray-400">No FAQs added. Click "Add FAQ"</p>
                    </div>
                  )}
                </div>
              )}

              {/* স্টেপ 6: রিভিউ */}
              {currentStep === 6 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <h3 className="text-lg font-semibold text-gray-800">Reviews</h3>
                    <button onClick={addReview} className="text-rose-500 hover:text-rose-600 text-sm flex items-center gap-1">
                      <FaPlus size={12} /> Add Review
                    </button>
                  </div>
                  
                  {formData.reviews.map((review, idx) => (
                    <div key={idx} className="border rounded-lg p-4 space-y-3 relative bg-gray-50">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Review #{idx + 1}</span>
                        <button onClick={() => removeReview(idx)} className="text-red-500 hover:text-red-700">
                          <FaTrash size={14} />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm text-gray-600">Name</label>
                          <input
                            type="text"
                            value={review.name}
                            onChange={(e) => updateReview(idx, "name", e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                            placeholder="Customer name"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Location</label>
                          <input
                            type="text"
                            value={review.location}
                            onChange={(e) => updateReview(idx, "location", e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                            placeholder="Dhaka"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Rating</label>
                        <div className="flex gap-1 items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => updateReview(idx, "rating", star)}
                              className="focus:outline-none"
                            >
                              <FaStar className={`${star <= review.rating ? "text-yellow-400" : "text-gray-300"} text-xl`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Comment</label>
                        <textarea
                          value={review.comment}
                          onChange={(e) => updateReview(idx, "comment", e.target.value)}
                          rows="2"
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                          placeholder="Customer review comment"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Avatar URL (optional)</label>
                        <input
                          type="text"
                          value={review.avatar}
                          onChange={(e) => updateReview(idx, "avatar", e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                          placeholder="https://randomuser.me/api/portraits/..."
                        />
                      </div>
                    </div>
                  ))}
                  
                  {formData.reviews.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed">
                      <p className="text-gray-400">No reviews added. Click "Add Review"</p>
                    </div>
                  )}
                </div>
              )}

              {/* স্টেপ 7: কন্টাক্ট ইনফো */}
              {currentStep === 7 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                    <div className="flex gap-2">
                      <FaFacebook className="text-blue-600 text-xl self-center" />
                      <input
                        type="text"
                        value={formData.contactInfo.facebook}
                        onChange={(e) => setFormData({ ...formData, contactInfo: { ...formData.contactInfo, facebook: e.target.value } })}
                        placeholder="https://facebook.com/yourpage"
                        className="flex-1 px-4 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp URL</label>
                    <div className="flex gap-2">
                      <FaWhatsapp className="text-green-500 text-xl self-center" />
                      <input
                        type="text"
                        value={formData.contactInfo.whatsapp}
                        onChange={(e) => setFormData({ ...formData, contactInfo: { ...formData.contactInfo, whatsapp: e.target.value } })}
                        placeholder="https://wa.me/8801xxxxxxxxx"
                        className="flex-1 px-4 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <div className="flex gap-2">
                      <FaPhone className="text-rose-500 text-xl self-center" />
                      <input
                        type="text"
                        value={formData.contactInfo.phone}
                        onChange={(e) => setFormData({ ...formData, contactInfo: { ...formData.contactInfo, phone: e.target.value } })}
                        placeholder="+8801xxxxxxxxx"
                        className="flex-1 px-4 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ফুটার বাটন */}
            <div className="sticky bottom-0 bg-white border-t px-4 md:px-6 py-4 flex justify-between flex-wrap gap-3">
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                disabled={currentStep === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 flex items-center gap-2 hover:bg-gray-50"
              >
                <FaArrowLeft size={14} /> Previous
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                {currentStep === totalSteps ? (
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-rose-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 hover:bg-rose-600"
                  >
                    {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                    {saving ? "Saving..." : "Save Product"}
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="bg-rose-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-rose-600"
                  >
                    Next <FaArrowRight size={14} />
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