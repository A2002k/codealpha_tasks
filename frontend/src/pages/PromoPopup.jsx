import { useEffect, useState } from "react";
import API from "../api/axios";
import "./css/PromoPopup.css";

function PromoPopup() {
  const [coupons, setCoupons] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem("couponPopupSeen");

    if (!alreadySeen) {
      fetchCoupons();
    }
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await API.get("/coupons");

      const activeCoupons = res.data.filter((coupon) => {
        return coupon.active && new Date(coupon.expiryDate) > new Date();
      });

      if (activeCoupons.length > 0) {
        setCoupons(activeCoupons);
        setShowPopup(true);
        sessionStorage.setItem("couponPopupSeen", "true");
      }
    } catch (err) {
      console.log("Coupon popup error:", err);
    }
  };

  const copyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Coupon ${code} copied!`);
  };

  if (!showPopup) return null;

  return (
    <div className="promo-overlay">
      <div className="promo-popup">
        <button
          className="promo-close"
          onClick={() => setShowPopup(false)}
        >
          ✕
        </button>

        <h2>🎁 Special Offers</h2>
        <p className="promo-subtitle">
          Use these coupons at checkout and save money.
        </p>

        <div className="promo-coupons">
          {coupons.map((coupon) => (
            <div key={coupon._id} className="promo-coupon-card">
              <div>
                <h3>{coupon.code}</h3>
                <p>{coupon.discountPercent}% OFF</p>
                <small>
                  Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
                </small>
              </div>

              <button onClick={() => copyCoupon(coupon.code)}>
                Copy
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PromoPopup;