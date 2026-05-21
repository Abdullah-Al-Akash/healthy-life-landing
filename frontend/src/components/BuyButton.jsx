import { useState, useEffect } from "react";
import { FiShoppingCart } from "react-icons/fi";
import CheckoutDrawer from "./landing/CheckoutDrawer";

const BuyButton = ({ product, variant = "primary", size = "lg", children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base",
    xl: "px-10 py-4 text-lg",
  };

  const variantClasses = {
    primary: "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg hover:shadow-rose-500/50",
    outline: "bg-transparent border-2 border-white text-white hover:bg-white/10",
  };

  const handleClick = () => {
    console.log("বাটনে ক্লিক হয়েছে", product);
    setIsDrawerOpen(true);
  };

  const buttonText = children || product?.buttonText || `অর্ডার করুন - ৳${product?.offerPrice}`;

  return (
    <>
      <button
        onClick={handleClick}
        className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-full font-bold transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto`}
        style={{
          animation: "wiggle 0.8s ease-in-out infinite",
        }}
      >
        <FiShoppingCart className="text-lg" />
        {buttonText}
      </button>

      {/* ড্রয়ার - সর্বোচ্চ z-index সহ */}
      <CheckoutDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        product={product}
      />

      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-4px) scale(1.02); }
        }
      `}</style>
    </>
  );
};

export default BuyButton;