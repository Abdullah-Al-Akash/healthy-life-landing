const axios = require("axios");

/**
 * Steadfast API এর মাধ্যমে অর্ডার পাঠানো
 * ডকুমেন্টেশন: https://portal.packzy.com/api/v1
 */
const sendToSteadfast = async (orderData) => {
  console.log("📦 Sending to Steadfast (Packzy)...");
  console.log("Order Data:", JSON.stringify(orderData, null, 2));
  
  try {
    // ✅ সঠিক Base URL
    const baseUrl = "https://portal.packzy.com/api/v1";
    const url = `${baseUrl}/create_order`;
    
    // ✅ ডকুমেন্টেশন অনুযায়ী পেলোড
    const payload = {
      invoice: orderData.orderId,
      recipient_name: orderData.customerInfo.name,
      recipient_phone: orderData.customerInfo.phone,
      recipient_address: orderData.customerInfo.address,
      cod_amount: parseFloat(orderData.totalPrice),
      note: orderData.customerInfo.note || "",
    };

    console.log("📤 URL:", url);
    console.log("📤 Payload:", JSON.stringify(payload, null, 2));

    // ✅ ডকুমেন্টেশন অনুযায়ী হেডার
    const response = await axios.post(url, payload, {
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        "Api-Key": process.env.STEADFAST_API_KEY,
        "Secret-Key": process.env.STEADFAST_SECRET_KEY,
      },
    });

    console.log("📥 Response Status:", response.status);
    console.log("📥 Response Data:", JSON.stringify(response.data, null, 2));

    // ✅ ডকুমেন্টেশন অনুযায়ী রেসপন্স চেক
    if (response.data && response.data.status === 200 && response.data.consignment) {
      return {
        success: true,
        trackingId: response.data.consignment.consignment_id,
        trackingCode: response.data.consignment.tracking_code,
        trackingUrl: `https://steadfast.com.bd/tracking/${response.data.consignment.tracking_code}`,
        message: response.data.message || "Order sent to Steadfast successfully",
        consignment: response.data.consignment,
      };
    } else {
      return {
        success: false,
        message: response.data?.message || "Unknown error from Steadfast",
        fullResponse: response.data,
      };
    }
    
  } catch (error) {
    console.error("❌ Steadfast API Error:", error.message);
    
    // বিস্তারিত এরর লগ
    if (error.response) {
      console.error("Error Response Data:", error.response.data);
      console.error("Error Response Status:", error.response.status);
    } else if (error.request) {
      console.error("No response received from server");
    }
    
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to send to Steadfast",
      error: error.response?.data || error.message,
    };
  }
};

/**
 * Pathao এ অর্ডার পাঠানো (যদি পরে লাগে)
 */
const sendToPathao = async (orderData) => {
  console.log("📦 Sending to Pathao...");
  // Pathao এর কোড পরে যোগ করবো
  return {
    success: false,
    message: "Pathao integration coming soon",
  };
};

/**
 * মেইন ফাংশন - প্রোভাইডার অনুযায়ী অর্ডার পাঠানো
 */
const sendOrderToCourier = async (provider, orderData) => {
  console.log(`🚀 sendOrderToCourier called with provider: ${provider}`);
  
  if (provider === "steadfast") {
    return await sendToSteadfast(orderData);
  } else if (provider === "pathao") {
    return await sendToPathao(orderData);
  } else {
    throw new Error(`Unsupported courier provider: ${provider}`);
  }
};

module.exports = {
  sendOrderToCourier,
  sendToSteadfast,
  sendToPathao,
};