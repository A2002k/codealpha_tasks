const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");
const sendEmail = require("../utils/sendEmail");



// ADD ORDER + DECREASE STOCK
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {address,phone,couponCode,discountAmount,deliveryFee,finalTotal,paymentMethod,paymentStatus} = req.body;

    const user = await User.findById(req.user.id).populate("cart.productId");

    if (!user || user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalPrice = 0;
    const items = [];

    // 1. Check stock before creating order
    for (const item of user.cart) {
      const product = item.productId;

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      if (Number(product.stock) < Number(item.quantity)) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}. Available: ${product.stock}`,
        });
      }

      totalPrice += Number(product.price) * Number(item.quantity);

      items.push({
        product: product._id,
        quantity: item.quantity,
      });
    }

    // 2. Create order
    const calculatedDiscount = Number(discountAmount || 0);
    const calculatedFinalTotal = Number(finalTotal || totalPrice);

    const order = await Order.create({
      user: user._id,
      items,
      totalPrice,
      couponCode: couponCode || null,
      discountAmount: calculatedDiscount,
      deliveryFee: Number(deliveryFee || 0),
      finalTotal: calculatedFinalTotal,
      paymentMethod: paymentMethod || "Cash on Delivery",
      paymentStatus: paymentStatus || "Pending",
      address,
      phone,
    });

// Send email notification to user
    await sendEmail({
  to: user.email,
  subject: "Order Placed Successfully",
  html: `
    <h2>Thank you for your order, ${user.name} 🎉</h2>
    <p>Your order has been placed successfully.</p>
    <p><strong>Order ID:</strong> #${order._id}</p>
    <p><strong>Subtotal:</strong> $${totalPrice}</p>
    <p><strong>Discount:</strong> -$${calculatedDiscount}</p>
    <p><strong>Delivery:</strong> $${Number(deliveryFee || 0)}</p>
    <p><strong>Total:</strong> $${calculatedFinalTotal}</p>
    <p><strong>Status:</strong> Pending</p>
    <br />
    <p>We will contact you soon for delivery.</p>
    <p>Thank you for shopping with My Store.</p>
  `,
});

    // 3. Decrease stock after order is created
    for (const item of user.cart) {
      await Product.findByIdAndUpdate(item.productId._id, {
        $inc: { stock: -Number(item.quantity) },
      });
    }

    // 4. Clear cart
    user.cart = [];
    await user.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ORDERS FOR USER
router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    }).populate("items.product");

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;