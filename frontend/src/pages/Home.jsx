import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import "./css/Home.css";
import PromoPopup from "./PromoPopup";

function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const isInStock = (stock) => Number(stock || 0) > 0;

  const addToCart = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await API.post("/cart/add", {
        productId,
        quantity: 1,
      });

      alert("Added to cart 🛒");
    } catch (err) {
      alert("Error adding to cart");
    }
  };

  const categories = [
    "All",
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" || p.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const addToWishlist = async (e, productId) => {
  e.preventDefault();
  e.stopPropagation();

  try {
    await API.post("/wishlist/add", { productId });
    alert("Added to wishlist ❤️");
  } catch (err) {
    alert(err.response?.data?.message || "Error adding to wishlist");
  }
};

  return (
    
    <div>
      <PromoPopup />
      <h1 className="page-title">🛍️ Products</h1>

      <input
        type="text"
        placeholder="🔍 Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />

      <div className="category-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={categoryFilter === cat ? "category-active" : ""}
            onClick={() => setCategoryFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {filteredProducts.map((p) => (
          <Link
            key={p._id}
            to={`/product/${p._id}`}
            className="product-card-link"
          >
            <div className="product-card">
              <img src={p.image} alt={p.name} className="product-image" />

              <button className="wishlist-heart" onClick={(e) => addToWishlist(e, p._id)}>
              ♡
              </button>

              <h3 className="product-name">{p.name}</h3>

              <p className="product-price">${p.price}</p>

              <span className={isInStock(p.stock) ? "stock-badge" : "stock-badge out"}>
                {isInStock(p.stock) ? `In Stock: ${p.stock}` : "Out of Stock"}
              </span>

              <p className="product-desc">
                {p.description || "No description"}
              </p>

              {isInStock(p.stock) ? (
                <button
                  className="add-btn"
                  onClick={(e) => addToCart(e, p._id)}
                >
                  Add to Cart 🛒
                </button>
              ) : (
                <button className="out-stock-btn" disabled>
                  Out of Stock
                </button>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;