const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// GET wishlist
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("wishlist");
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD to wishlist
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.body;

    const user = await User.findById(req.user.id);

    const alreadyExists = user.wishlist.some(
      (id) => id.toString() === productId
    );

    if (alreadyExists) {
      return res.status(400).json({ message: "Already in wishlist" });
    }

    user.wishlist.push(productId);
    await user.save();

    res.json({ message: "Added to wishlist" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// REMOVE from wishlist
router.delete("/remove", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.body;

    const user = await User.findById(req.user.id);

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId
    );

    await user.save();

    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;