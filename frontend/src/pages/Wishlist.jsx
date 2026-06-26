import { useEffect, useState } from "react";
import API from "../api/axios";
import "./css/Wishlist.css";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
  try {
    const res = await API.get("/wishlist");

    console.log("Wishlist response:", res.data);

    setWishlist(res.data);
  } catch (err) {
    console.log("Wishlist error:", err.response?.data || err.message);
  }
};

  const removeFromWishlist = async (productId) => {
    await API.delete("/wishlist/remove", {
      data: { productId },
    });

    fetchWishlist();
  };

  const moveToCart = async (productId) => {
    await API.post("/cart/add", {
      productId,
      quantity: 1,
    });

    await removeFromWishlist(productId);

    alert("Moved to cart 🛒");
  };

  return (
    <div className="wishlist-page">
      <h1>❤️ My Wishlist</h1>

      {wishlist.length === 0 ? (
        <p className="empty-wishlist">Your wishlist is empty.</p>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((product) => (
            <div key={product._id} className="wishlist-card">
              <img src={product.image} alt={product.name} />

              <h3>{product.name}</h3>

              <p className="wishlist-price">${product.price}</p>

              <p className="wishlist-desc">
                {product.description || "No description"}
              </p>

              <div className="wishlist-actions">
                <button
                  className="move-cart-btn"
                  onClick={() => moveToCart(product._id)}
                >
                  Move to Cart 🛒
                </button>

                <button
                  className="remove-wishlist-btn"
                  onClick={() => removeFromWishlist(product._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;