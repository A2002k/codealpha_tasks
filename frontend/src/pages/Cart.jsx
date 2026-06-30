import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "./css/Cart.css";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [cardInfo, setCardInfo] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await API.get("/cart");
      setCart(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCardChange = (e) => {
    setCardInfo({
      ...cardInfo,
      [e.target.name]: e.target.value,
    });
  };

  const increaseQty = async (productId) => {
    await API.post("/cart/add", {
      productId,
      quantity: 1,
    });

    fetchCart();
  };

  const decreaseQty = async (productId) => {
    const item = cart.find((i) => i.productId._id === productId);

    if (item.quantity <= 1) {
      await removeItem(productId);
      return;
    }

    await API.post("/cart/add", {
      productId,
      quantity: -1,
    });

    fetchCart();
  };

  const removeItem = async (productId) => {
    await API.delete("/cart/remove", {
      data: { productId },
    });

    fetchCart();
  };

  const totalPrice = cart.reduce((sum, item) => {
    return sum + item.productId.price * item.quantity;
  }, 0);

  const getDeliveryFee = () => {
    if (totalPrice >= 100) return 0;
    if (totalPrice >= 50) return 5;
    return 8;
  };

  const deliveryFee = getDeliveryFee();
  const finalTotal = totalPrice - discountAmount + deliveryFee;

  const applyCoupon = async () => {
    try {
      const res = await API.post("/coupons/validate", {
        code: couponCode,
      });

      const discount =
        (totalPrice * Number(res.data.discountPercent)) / 100;

      setCoupon(res.data);
      setDiscountAmount(discount);

      alert(`Coupon applied: ${res.data.discountPercent}% off`);
    } catch (err) {
      setCoupon(null);
      setDiscountAmount(0);
      alert(err.response?.data?.message || "Invalid coupon");
    }
  };

  const checkout = async () => {
    try {
      if (!address || !phone) {
        alert("Please enter your address and phone number");
        return;
      }

      if (paymentMethod === "Card") {
        if (
          !cardInfo.cardName ||
          cardInfo.cardNumber.length < 12 ||
          !cardInfo.expiry ||
          cardInfo.cvv.length < 3
        ) {
          alert("Please enter valid card information");
          return;
        }
      }

      await API.post("/orders", {
        address,
        phone,
        couponCode: coupon?.code || null,
        discountAmount,
        deliveryFee,
        finalTotal,
        paymentMethod,
        paymentStatus: paymentMethod === "Card" ? "Paid" : "Pending",
      });

      

         setCart([]);
        setCoupon(null);
        setCouponCode("");
        setDiscountAmount(0);
        setAddress("");
        setPhone("");
        setCardInfo({
          cardName: "",
          cardNumber: "",
          expiry: "",
          cvv: "",
        });

        alert("Order placed successfully 🎉");

        setTimeout(() => {
          navigate("/order");
        }, 500);
    } catch (err) {
      alert(err.response?.data?.message || "Checkout failed");
    }
  };

  return (
    <>
      <h1 className="cart-title">Shopping Cart 🛒</h1>

      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <div className="cart-container">
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item._id} className="cart-card">
                <h3>{item.productId.name}</h3>

                <p>${item.productId.price}</p>

                <p>Quantity: {item.quantity}</p>

                <div className="quantity-controls">
                  <button
                    className="qty-btn"
                    onClick={() => decreaseQty(item.productId._id)}
                  >
                    ➖
                  </button>

                  <button
                    className="qty-btn"
                    onClick={() => increaseQty(item.productId._id)}
                  >
                    ➕
                  </button>

                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.productId._id)}
                  >
                    🗑️ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="summary-card">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            {coupon && (
              <div className="summary-row discount-row">
                <span>Discount ({coupon.code})</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="summary-row">
              <span>Delivery</span>
              <span>
                {deliveryFee === 0 ? "FREE 🚚" : `$${deliveryFee.toFixed(2)}`}
              </span>
            </div>

            <div className="summary-row total-row">
              <span>Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>

            <div className="coupon-box">
              <input
                className="checkout-input"
                type="text"
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              />

              <button className="coupon-btn" onClick={applyCoupon}>
                Apply
              </button>
            </div>

            <input
              className="checkout-input"
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <input
              className="checkout-input"
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <div className="payment-box">
              <h3>💳 Payment Method</h3>

              <label className="payment-option">
                <input
                  type="radio"
                  value="Cash on Delivery"
                  checked={paymentMethod === "Cash on Delivery"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                💵 Cash on Delivery
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  value="Card"
                  checked={paymentMethod === "Card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                💳 Credit / Debit Card
              </label>

              {paymentMethod === "Card" && (
                <div className="card-payment-form">
                  <input
                    type="text"
                    name="cardName"
                    placeholder="Cardholder Name"
                    value={cardInfo.cardName}
                    onChange={handleCardChange}
                  />

                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="Card Number"
                    maxLength="16"
                    value={cardInfo.cardNumber}
                    onChange={handleCardChange}
                  />

                  <div className="card-row">
                    <input
                      type="text"
                      name="expiry"
                      placeholder="MM/YY"
                      maxLength="5"
                      value={cardInfo.expiry}
                      onChange={handleCardChange}
                    />

                    <input
                      type="password"
                      name="cvv"
                      placeholder="CVV"
                      maxLength="4"
                      value={cardInfo.cvv}
                      onChange={handleCardChange}
                    />
                  </div>

                  <p className="demo-payment-note">
                    Demo payment only — no real money is charged.
                  </p>
                </div>
              )}
            </div>

            <button className="checkout-btn" onClick={checkout}>
              Checkout 💳
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Cart;