import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { FaFacebook, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white pt-12 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-gradient">HerbalCare</h3>
            <p className="text-neutral-400 text-sm">
              প্রকৃতির ডাক, আপনার সুস্থতার ঠিকানা। ১০০% খাঁটি ও জৈব পণ্য।
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">দ্রুত লিংক</h3>
            <ul className="space-y-2 text-neutral-400 text-sm">
              <li><a href="#" className="hover:text-primary-400 transition">হোম</a></li>
              <li><a href="#" className="hover:text-primary-400 transition">পণ্য</a></li>
              <li><a href="#" className="hover:text-primary-400 transition">অর্ডার ট্র্যাক</a></li>
              <li><a href="#" className="hover:text-primary-400 transition">যোগাযোগ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">যোগাযোগ</h3>
            <ul className="space-y-2 text-neutral-400 text-sm">
              <li className="flex items-center gap-2"><FiPhone size={16} /> ০১৭××-××××××</li>
              <li className="flex items-center gap-2"><FiMail size={16} /> info@herbalcare.com</li>
              <li className="flex items-center gap-2"><FiMapPin size={16} /> ঢাকা, বাংলাদেশ</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">সোশ্যাল মিডিয়া</h3>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-neutral-800 rounded-full hover:bg-primary-600 transition">
                <FaFacebook size={18} />
              </a>
              <a href="#" className="p-2 bg-neutral-800 rounded-full hover:bg-primary-600 transition">
                <FaInstagram size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-6 text-center text-neutral-500 text-sm">
          © {new Date().getFullYear()} HerbalCare. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;