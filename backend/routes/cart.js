const express = require("express");
const router = express.Router();
const User = require("../models/user");
const authMiddleware = require("../middleware/authMiddleware");

// ADD TO CART
router.post("/add", authMiddleware, async (req, res) => {
 
  try {
    const userId = req.user.id; // from token
    const { productId, quantity } = req.body;

    const user = await User.findById(userId);

    const index = user.cart.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (index > -1) {
      user.cart[index].quantity += quantity;
    } else {
      user.cart.push({ productId, quantity });
    }

    await user.save();

    res.json(user.cart);
  } catch (err) {
    res.status(500).json(err.message);
  }
});


module.exports = router;

// GET CART
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.productId");
    res.json(user.cart);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

//Delete cart
router.delete("/remove", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.cart = user.cart.filter(
      (item) => item.productId.toString() !== req.body.productId
    );

    await user.save();

    res.json(user.cart);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

