const express = require("express");
const router = express.Router();
const multer = require("multer");
const Product = require("../models/product");
const authMiddleware = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// CREATE product with image upload
router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log("BODY:", req.body);
console.log("FILE:", req.file);
    const { name, price, description, category, stock } = req.body;

    const imageUrl = req.file
      ? `http://localhost:5000/uploads/${req.file.filename}`
      : "";

      const product = await Product.create({
        name,
        price: Number(price),
        description,
        category,
        stock: Number(stock) || 0,
        image: imageUrl,
      });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE product
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, category, stock } = req.body;

      let updateData = {
      name,
      price: Number(price),
      description,
      category,
      stock: Number(stock) || 0,
    };

    if (req.file) {
      updateData.image = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ADD REVIEW TO PRODUCT
router.post("/:id/reviews", authMiddleware, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user.id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        message: "You already reviewed this product",
      });
    }

    const review = {
      user: req.user.id,
      name: req.user.name || "Customer",
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((sum, item) => sum + item.rating, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({ message: "Review added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;