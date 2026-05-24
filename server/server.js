const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const ipBlocker = require("./middleware/ipBlocker");

dotenv.config();
connectDB();

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// রিয়েল আইপি পাওয়ার জন্য কাস্টম মিডলওয়্যার
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

// 🔥 IP Blocker Middleware (সব রিকোয়েস্টের আগে)
app.use(ipBlocker);

// রাউটস
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const customerRoutes = require('./routes/customerRoutes');
const ipBlockRoutes = require('./routes/ipBlockRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const incompleteOrderRoutes = require('./routes/incompleteOrderRoutes');


app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/ip-block', ipBlockRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/incomplete-orders', incompleteOrderRoutes);


app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});