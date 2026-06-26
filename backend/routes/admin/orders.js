const express = require("express");
const router = express.Router();
const Order = require("../../models/order");
const Product = require("../../models/product");
const sendEmail = require("../../utils/SendEmail");

// ADMIN: Get all orders
router.get("/all", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN: Update order status + send email + restore stock if cancelled
router.put("/status/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const oldStatus = order.status;

    if (status === oldStatus) {
      return res.json(order);
    }

    if (status === "Cancelled" && oldStatus !== "Cancelled") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product._id, {
          $inc: { stock: Number(item.quantity) },
        });
      }
    }

    if (oldStatus === "Cancelled" && status !== "Cancelled") {
      for (const item of order.items) {
        const product = await Product.findById(item.product._id);

        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }

        if (Number(product.stock) < Number(item.quantity)) {
          return res.status(400).json({
            message: `Not enough stock for ${product.name}`,
          });
        }

        product.stock -= Number(item.quantity);
        await product.save();
      }
    }

    order.status = status;
    await order.save();

    await sendEmail({
      to: order.user.email,
      subject: `Order #${order._id.toString().slice(-6)} Status Updated`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2>🛍️ AK Store</h2>
          <p>Hello ${order.user.name || "Customer"},</p>
          <p>Your order status has been updated.</p>

          <div style="background:#f1f5f9; padding:15px; border-radius:10px; margin:20px 0;">
            <p><strong>Order ID:</strong> #${order._id}</p>
            <p><strong>Previous Status:</strong> ${oldStatus}</p>
            <p><strong>New Status:</strong> ${status}</p>
            <p><strong>Total:</strong> $${order.totalPrice}</p>
          </div>

          <p>Thank you for shopping with us.</p>
        </div>
      `,
    });

    res.json(order);
  } catch (err) {
    console.log("STATUS UPDATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;