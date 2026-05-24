// src/components/WhatsAppFloating.jsx

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { X, MessageCircle, Phone, Send } from "lucide-react";

export default function WhatsAppFloating({ 
  phoneNumber = "+8801924512833", 
  message = "Hi, I need help with your product" 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Function to check if any drawer is open
    const checkDrawerState = () => {
      // Check for drawer with data-drawer attribute
      const drawer = document.querySelector('[data-drawer="true"]');
      if (drawer) {
        const isOpenAttr = drawer.getAttribute('data-drawer-open');
        if (isOpenAttr === 'true') {
          setIsDrawerOpen(true);
          return;
        }
      }
      
      // Check for body class
      if (document.body.classList.contains('drawer-open')) {
        setIsDrawerOpen(true);
        return;
      }
      
      // Check for any element with class drawer-open or active
      const anyDrawer = document.querySelector('.drawer-open, .drawer.active, [data-drawer-open="true"]');
      if (anyDrawer) {
        setIsDrawerOpen(true);
        return;
      }
      
      setIsDrawerOpen(false);
    };

    // Initial check
    checkDrawerState();

    // Listen for custom drawer events
    const handleDrawerOpen = () => setIsDrawerOpen(true);
    const handleDrawerClose = () => setIsDrawerOpen(false);
    
    window.addEventListener('drawer:open', handleDrawerOpen);
    window.addEventListener('drawer:close', handleDrawerClose);

    // Create a MutationObserver to watch for DOM changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' || mutation.type === 'childList') {
          checkDrawerState();
        }
      });
    });

    // Start observing
    observer.observe(document.body, { 
      attributes: true, 
      childList: true, 
      subtree: true,
      attributeFilter: ['class', 'data-drawer-open']
    });

    // Also observe the document for class changes
    const bodyObserver = new MutationObserver(() => {
      checkDrawerState();
    });
    
    bodyObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Cleanup
    return () => {
      window.removeEventListener('drawer:open', handleDrawerOpen);
      window.removeEventListener('drawer:close', handleDrawerClose);
      observer.disconnect();
      bodyObserver.disconnect();
    };
  }, []);

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`, '_blank');
    setIsOpen(false);
  };

  // Don't show if drawer is open
  if (isDrawerOpen) return null;

  return (
    <>
      {/* Floating Button with FAB Animation */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          delay: 0.5
        }}
        className="fixed bottom-6 right-6 z-40"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Ripple Effect */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1.4, 1.2, 1],
            opacity: [0.6, 0.4, 0.2, 0.4, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-green-500 rounded-full"
          style={{ filter: 'blur(8px)' }}
        />
        
        {/* Main Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative group"
          animate={{
            boxShadow: isHovered 
              ? "0 0 20px rgba(34, 197, 94, 0.6)" 
              : "0 0 10px rgba(34, 197, 94, 0.3)"
          }}
        >
          <div className="absolute inset-0 bg-green-500 rounded-full blur-lg opacity-50 group-hover:opacity-70 transition-opacity animate-pulse" />
          <div className="relative w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-2xl flex items-center justify-center hover:shadow-xl transition-all duration-300">
            <motion.div
              animate={{ 
                rotate: isOpen ? 90 : 0,
                scale: isHovered ? 1.1 : 1
              }}
              transition={{ duration: 0.3 }}
            >
              {isOpen ? (
                <X className="w-7 h-7 md:w-8 md:h-8 text-white" />
              ) : (
                <FaWhatsapp className="w-7 h-7 md:w-8 md:h-8 text-white" />
              )}
            </motion.div>
          </div>
        </motion.button>

        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg pointer-events-none hidden md:block"
        >
          <motion.span
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            💬 WhatsApp এ যোগাযোগ করুন
          </motion.span>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 w-2 h-2 bg-gray-900" />
        </motion.div>

        {/* Floating Dots */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
        />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}
          className="absolute -top-2 -right-2 w-2 h-2 bg-green-300 rounded-full"
        />
      </motion.div>

      {/* Chat Drawer - keep the same as before */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 300,
                mass: 0.8
              }}
              className="fixed bottom-24 right-6 z-50 w-[350px] md:w-[400px] bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <FaWhatsapp className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">WhatsApp Support</h3>
                      <p className="text-xs opacity-90 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                        Online | সাধারণত ৫ মিনিটের মধ্যে রিপ্লাই দেয়
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="mb-4">
                  <div className="bg-gray-100 rounded-2xl p-3 max-w-[80%]">
                    <p className="text-sm text-gray-800">
                      👋 হ্যালো! আপনার কী সাহায্য needed?
                    </p>
                    <span className="text-xs text-gray-500 mt-1 block">
                      সাধারণত ৫ মিনিটের মধ্যে রিপ্লাই পাবেন
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-xs text-gray-500 font-medium mb-2">দ্রুত উত্তর:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { text: "পণ্য সম্পর্কে জানতে চাই", icon: MessageCircle },
                      { text: "অর্ডার করতে চাই", icon: Send },
                      { text: "ডেলিভারি status", icon: Phone },
                      { text: "প্রোডাক্টের details", icon: MessageCircle }
                    ].map((reply, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          const encodedMsg = encodeURIComponent(reply.text);
                          window.open(`https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMsg}`, '_blank');
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition-colors"
                      >
                        <reply.icon size={12} />
                        <span>{reply.text}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleWhatsAppClick}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <FaWhatsapp size={18} />
                    <span>WhatsApp এ মেসেজ করুন</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      window.location.href = `tel:${phoneNumber.replace(/[^0-9]/g, '')}`;
                      setIsOpen(false);
                    }}
                    className="w-full border-2 border-green-500 text-green-600 py-3 rounded-xl font-semibold hover:bg-green-50 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Phone size={18} />
                    <span>কল করুন</span>
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 text-center">
                  <p className="text-xs text-gray-400">
                    ⏰ সাপ্তাহিক ৭ দিন, সকাল ৯টা - রাত ৯টা
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    💬 সাধারণত ৫ মিনিটের মধ্যে রিপ্লাই পান
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </>
  );
}