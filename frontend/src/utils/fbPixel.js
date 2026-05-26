// src/utils/fbPixel.js

// ফেসবুক পিক্সেল ইভেন্ট ট্র্যাকিং হেল্পার
const fbPixel = {
  // পেজ ভিউ ট্র্যাক
  pageView: () => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
    }
  },

  // প্রোডাক্ট ভিউ ট্র্যাক
  viewContent: (product) => {
    if (typeof window.fbq === 'function' && product) {
      window.fbq('track', 'ViewContent', {
        content_ids: [product.id || product._id],
        content_name: product.navTitle || product.title,
        content_type: 'product',
        value: product.banners?.[0]?.offerPrice || product.offerPrice,
        currency: 'BDT'
      });
    }
  },

  // চেকআউট শুরু ট্র্যাক
  initiateCheckout: () => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'InitiateCheckout');
    }
  },

  // অর্ডার সফল ট্র্যাক
  purchase: (order) => {
    if (typeof window.fbq === 'function' && order) {
      window.fbq('track', 'Purchase', {
        content_ids: [order.productId],
        content_name: order.productTitle,
        content_type: 'product',
        value: order.totalPrice,
        currency: 'BDT',
        order_id: order.orderId
      });
    }
  },

  // লিড ট্র্যাক (ফোন নাম্বার দিলে)
  lead: (data) => {
    if (typeof window.fbq === 'function' && data) {
      window.fbq('track', 'Lead', {
        content_name: data.name || 'Customer',
        phone: data.phone
      });
    }
  },

  // সার্চ ট্র্যাক (অপশনাল)
  search: (query) => {
    if (typeof window.fbq === 'function' && query) {
      window.fbq('track', 'Search', {
        search_string: query
      });
    }
  }
};

export default fbPixel;