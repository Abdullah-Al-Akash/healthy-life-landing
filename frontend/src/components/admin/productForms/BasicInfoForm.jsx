const BasicInfoForm = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange(field, value);
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Slug <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.slug || ""}
          onChange={(e) => handleChange("slug", e.target.value.toLowerCase().replace(/\s/g, "-"))}
          placeholder="e.g., herbal-tea"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
        />
        <p className="text-xs text-gray-400 mt-1.5">
          ⓘ URL friendly name. শুধু ছোট হাতের অক্ষর, সংখ্যা এবং হাইফেন ব্যবহার করুন
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Navigation Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.navTitle || ""}
          onChange={(e) => handleChange("navTitle", e.target.value)}
          placeholder="e.g., Herbal Tea"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
        />
        <p className="text-xs text-gray-400 mt-1.5">
          ⓘ ন্যাভবার এবং পেজের টাইটেলে এটি দেখাবে
        </p>
      </div>

      <div className="flex items-center gap-3 pt-3">
        <input
          type="checkbox"
          id="isActive"
          checked={data.isActive !== false}
          onChange={(e) => handleChange("isActive", e.target.checked)}
          className="w-5 h-5 text-rose-500 rounded-md focus:ring-rose-500 cursor-pointer"
        />
        <label htmlFor="isActive" className="text-sm text-gray-700 cursor-pointer">
          Product Active
        </label>
        <p className="text-xs text-gray-400 ml-auto">
          ইন্যাক্টিভ করলে ওয়েবসাইটে পণ্যটি দেখাবে না
        </p>
      </div>
    </div>
  );
};

export default BasicInfoForm;