const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,

    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    wishlist: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
      },
    ],
        role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
      },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);