import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { FiShoppingBag } from "react-icons/fi";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const products = [
    { id: 1, name: "Herbal Tea", slug: "herbal-tea" },
    { id: 2, name: "Green Coffee", slug: "green-coffee" },
    { id: 3, name: "Aloe Vera", slug: "aloe-vera" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm z-header">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="text-2xl font-bold text-gradient">
            Herbal<span className="text-primary-600">Care</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {products.map((product) => (
              <a
                key={product.id}
                href={`/product/${product.slug}`}
                className="text-neutral-700 hover:text-primary-600 transition-colors duration-300 font-medium"
              >
                {product.name}
              </a>
            ))}
            <button className="btn btn-primary flex items-center gap-2">
              <FiShoppingBag size={18} />
              অর্ডার করুন
            </button>
          </div>

          <button
            className="md:hidden text-neutral-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-fadeIn">
            <div className="flex flex-col gap-3">
              {products.map((product) => (
                <a
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="text-neutral-700 hover:text-primary-600 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {product.name}
                </a>
              ))}
              <button className="btn btn-primary w-full flex items-center justify-center gap-2">
                <FiShoppingBag size={18} />
                অর্ডার করুন
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;