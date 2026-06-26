const express = require("express");
const router = express.Router();
const Coupon = require("../models/coupon");

// CREATE coupon
router.post("/", async (req, res) => {
  try {
    const coupon = await Coupon.create({
      code: req.body.code.toUpperCase(),
      discountPercent: req.body.discountPercent,
      expiryDate: req.body.expiryDate,
      active: req.body.active,
    });

    res.status(201).json(coupon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all coupons
router.get("/", async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// VALIDATE coupon
router.post("/validate", async (req, res) => {
  try {
    const { code } = req.body;

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      active: true,
    });

    if (!coupon) {
      return res.status(400).json({ message: "Invalid coupon" });
    }

    if (new Date() > coupon.expiryDate) {
      return res.status(400).json({ message: "Coupon expired" });
    }

    res.json(coupon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE coupon
router.put("/:id", async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      {
        code: req.body.code.toUpperCase(),
        discountPercent: req.body.discountPercent,
        expiryDate: req.body.expiryDate,
        active: req.body.active,
      },
      { new: true }
    );

    res.json(coupon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE coupon
router.delete("/:id", async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: "Coupon deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;