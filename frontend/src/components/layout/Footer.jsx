import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { FaFacebook, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white pt-12 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* ব্র্যান্ড সেকশন */}
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-xl font-bold text-rose-500 italic">
                Healthy Life
              </h2>
              <p className="text-xs text-rose-100 ms-6 italic">Since 2022</p>
            </div>
          </div>

          {/* যোগাযোগ সেকশন */}
          <div>
            <h3 className="text-lg font-semibold mb-4">যোগাযোগ</h3>
            <ul className="space-y-3 text-neutral-400 text-sm">
              <li className="flex items-center gap-3">
                <FiPhone className="text-rose-500" size={16} />
                <span>01924512833</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-rose-500" size={16} />
                <span>info@healthylife.com</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMapPin className="text-rose-500" size={16} />
                <span>ঢাকা, বাংলাদেশ</span>
              </li>
            </ul>
          </div>

          {/* সোশ্যাল মিডিয়া */}
          <div>
            <h3 className="text-lg font-semibold mb-4">সোশ্যাল মিডিয়া</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-rose-500 transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <FaFacebook size={18} className="text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-rose-500 transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <FaInstagram size={18} className="text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* কপিরাইট ও ডেভেলপার ক্রেডিট */}
        <div className="border-t border-neutral-800 pt-6 text-center text-neutral-500 text-sm">
          <p>© {new Date().getFullYear()} Healthy Life. All rights reserved.</p>
          <p className="mt-1 text-xs text-neutral-600">
            Developed by{" "}
            <span className="text-rose-500">Abdullah Al Akash</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
