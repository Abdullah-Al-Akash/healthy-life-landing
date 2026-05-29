const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const ipBlocker = require("./middleware/ipBlocker");

dotenv.config();

const app = express();
app.set("trust proxy", true);
app.use(express.json());

// ========== CORS Configuration with Multiple Origins ==========
const allowedOrigins = [
  "http://localhost:5173",
  "https://harbel-healthy-life.netlify.app",
  "https://healthylife-online.com",
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`❌ Blocked origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 86400,
};

app.use(cors(corsOptions));

// ========== রিয়েল আইপি পাওয়ার জন্য কাস্টম মিডলওয়্যার ==========
app.use((req, res, next) => {
  let ip =
    req.headers["x-forwarded-for"] ||
    req.headers["x-real-ip"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.ip;

  if (ip === "::1" || ip === "::ffff:127.0.0.1") {
    ip = "127.0.0.1";
  }

  if (ip && ip.includes(",")) {
    ip = ip.split(",")[0].trim();
  }

  req.realIp = ip;
  next();
});

// ========== IP Blocker Middleware ==========
app.use(ipBlocker);

// ========== রাউটস ==========
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const customerRoutes = require("./routes/customerRoutes");
const ipBlockRoutes = require("./routes/ipBlockRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const incompleteOrderRoutes = require("./routes/incompleteOrderRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/ip-block", ipBlockRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/incomplete-orders", incompleteOrderRoutes);

// ========== হেলথ চেক ==========
app.get("/", (req, res) => {
  res.json({
    message: "API is running...",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// ========== 404 হ্যান্ডলার ==========
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ========== গ্লোবাল এরর হ্যান্ডলার ==========
app.use((err, req, res, next) => {
  console.error("Global error:", err);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS error: Origin not allowed",
    });
  }

  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ========== সার্ভার শুরু করার ফাংশন ==========
const startServer = async () => {
  try {
    // ডাটাবেস কানেক্ট করো
    await connectDB();
    console.log('✅ Database connected successfully');
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📋 Allowed origins: ${allowedOrigins.join(", ")}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// সার্ভার শুরু করো
startServer();