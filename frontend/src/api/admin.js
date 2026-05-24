import { privateApi } from "./client";

export const adminApi = {
  // ========== Products ==========
  getProducts: () => privateApi.get("/products"),
  getProductById: (id) => privateApi.get(`/products/id/${id}`),
  createProduct: (data) => privateApi.post("/products", data),
  updateProduct: (id, data) => privateApi.put(`/products/${id}`, data),
  deleteProduct: (id) => privateApi.delete(`/products/${id}`),
  toggleProduct: (id) => privateApi.patch(`/products/${id}/toggle`),

  // ========== Orders ==========
  getOrders: () => privateApi.get("/orders"),
  getOrderById: (id) => privateApi.get(`/orders/${id}`),
  updateOrderStatus: (id, status) =>
    privateApi.put(`/orders/${id}/status`, { status }),
  sendToCourier: (id, provider) =>
    privateApi.post(`/orders/${id}/courier`, { provider }),
  updateCustomerInfo: (id, customerInfo) =>
    privateApi.put(`/orders/${id}/customer`, { customerInfo }),

  // ========== Users (Admin only) ==========
  getUsers: () => privateApi.get("/auth/users"),
  createAdmin: (data) => privateApi.post("/auth/users/admin", data),
  updateUserRole: (id, role) =>
    privateApi.put(`/auth/users/${id}/role`, { role }),
  deleteUser: (id) => privateApi.delete(`/auth/users/${id}`),

  // ========== Customers ==========
  getCustomers: () => privateApi.get("/customers"),
  getCustomerByPhone: (phone) => privateApi.get(`/customers/${phone}`),
  getCustomerOrders: (phone) => privateApi.get(`/customers/${phone}/orders`),
  updateCustomerStatus: (id, data) =>
    privateApi.put(`/customers/${id}/status`, data),
  updateCustomer: (id, data) => privateApi.put(`/customers/${id}`, data),
  deleteCustomer: (id) => privateApi.delete(`/customers/${id}`),

  // ========== IP Block ==========
  getBlockedIPs: () => privateApi.get("/ip-block"),
  blockIP: (data) => privateApi.post("/ip-block", data),
  unblockIP: (id) => privateApi.delete(`/ip-block/${id}`),
  getIPLogs: (ip) => privateApi.get(`/ip-block/logs?ip=${ip}`),

  // ========== Profile & Settings ==========
  updateProfile: (data) => privateApi.put("/auth/profile", data),
  changePassword: (data) => privateApi.put("/auth/change-password", data),

  // Dashboard
  getDashboardStats: (params) => privateApi.get("/dashboard/stats", { params }),
  getOrderSummary: () => privateApi.get("/dashboard/orders/summary"),

  // Incomplete Orders
  getIncompleteOrders: () => privateApi.get("/incomplete-orders"),
  deleteIncompleteOrder: (id) => privateApi.delete(`/incomplete-orders/${id}`),
};
