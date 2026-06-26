const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// auth routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// product routes
const productRoutes = require("./routes/product");
app.use("/api/products", productRoutes);

// cart routes
const cartRoutes = require("./routes/cart");
app.use("/api/cart", cartRoutes);

// order routes
const orderRoutes = require("./routes/order");
app.use("/api/orders", orderRoutes);

// admin order routes
const adminOrderRoutes = require("./routes/admin/orders");
app.use("/api/admin/orders", adminOrderRoutes);

//coupon routes
const couponRoutes = require("./routes/coupon");
app.use("/api/coupons", couponRoutes);

// wishlist routes
const wishlistRoutes = require("./routes/wishlist");
app.use("/api/wishlist", wishlistRoutes);

// upload images
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

