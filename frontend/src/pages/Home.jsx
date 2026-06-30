import { useEffect, useRef, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import "./css/home.css";
import PromoPopup from "./PromoPopup";
import AIChat from "../components/AIChat/AIChat";

function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const chatRef = useRef(null);

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

  const addToCart = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await API.post("/cart/add", { productId, quantity: 1 });
      alert("Added to cart 🛒");
    } catch (err) {
      alert(err.response?.data?.message || "Error adding to cart");
    }
  };

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

  const isInStock = (stock) => Number(stock || 0) > 0;

  const categories = [
    "All",
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || p.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const categoryCards = categories
    .filter((c) => c !== "All")
    .slice(0, 5)
    .map((cat) => {
      const product = products.find((p) => p.category === cat);
      return { cat, product };
    });

  const heroProducts = products.slice(0, 3);
  const bestSellers = products.filter((p) => p.isBestSeller === true);
  const allProducts = filteredProducts;

  return (
    <div className="modern-home">
      <PromoPopup />

      <div className="top-strip">
        <span>🚚 Free Shipping on orders over $50</span>
        <span>↩️ 30-Day Return Policy</span>
        <span>📦 Track Order</span>
        <button className="help-support-btn" onClick={() => chatRef.current?.openChat()}>
            ❔ Help & Support
          </button>
      </div>

      <header className="store-navbar">
        <div className="brand-logo">
          <span>AK</span>
          <strong>Store</strong>
        </div>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#categories">Shop</a>
          <a href="#best-sellers">Best Sellers</a>
          <a href="#new">New Arrivals</a>
          <a href="#sale">Sale</a>
        </nav>

        <div className="nav-icons">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Link to="/wishlist">♡</Link>
          <Link to="/cart">🛒</Link>
        </div>
      </header>

      <section className="hero-section" id="home">
        <div className="hero-content">
          <span className="hero-label">NEW COLLECTION</span>
          <h1>
            Elevate Your Style <br />
            Own Every Moment
          </h1>
          <p>
            Discover premium products for every lifestyle. Shop the latest
            arrivals, best sellers, and exclusive deals.
          </p>

          <div className="hero-buttons">
            <a href="#best-sellers" className="primary-hero-btn">
              SHOP NOW →
            </a>
            <a href="#categories" className="secondary-hero-btn">
              VIEW COLLECTION
            </a>
          </div>

          <div className="hero-benefits">
            <div>
              <strong>🏅 Premium Quality</strong>
              <span>Trusted Products</span>
            </div>
            <div>
              <strong>🚚 Fast Delivery</strong>
              <span>Across the Country</span>
            </div>
            <div>
              <strong>🛡️ Secure Payment</strong>
              <span>100% Protected</span>
            </div>
          </div>
        </div>

        <div className="hero-products">
          {heroProducts.map((p) => (
            <img key={p._id} src={p.image} alt={p.name} />
          ))}
        </div>
      </section>

      <section className="category-section" id="categories">
        {categoryCards.map(({ cat, product }) => (
          <button
            key={cat}
            className="category-card"
            onClick={() => setCategoryFilter(cat)}
          >
            {product && <img src={product.image} alt={cat} />}
            <div>
              <h3>{cat}</h3>
              <p>Starting at ${product?.price || "9.99"}</p>
              <span>SHOP NOW →</span>
            </div>
          </button>
        ))}
      </section>

      <section className="products-section" id="best-sellers">
        <div className="section-heading">
          <h2>BEST SELLERS</h2>

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
        </div>

        <div className="product-grid">
          {bestSellers.map((p, index) => (
            <Link
              key={p._id}
              to={`/product/${p._id}`}
              className="product-card-link"
            >
              <div className="product-card">
                {index < 5 && <span className="sale-badge">-{10 + index * 5}%</span>}

                <button
                  className="wishlist-heart"
                  onClick={(e) => addToWishlist(e, p._id)}
                >
                  ♡
                </button>

                <div className="product-image-box">
                  <img src={p.image} alt={p.name} className="product-image" />
                </div>

                <div className="product-info">
                  <h3>{p.name}</h3>

                  <p className="product-price">${Number(p.price).toFixed(2)}</p>

                  <div className="rating-row">
                    <span>★★★★★</span>
                    <small>({p.numReviews || 0})</small>
                  </div>

                  <span
                    className={
                      isInStock(p.stock) ? "stock-badge" : "stock-badge out"
                    }
                  >
                    {isInStock(p.stock) ? `In Stock: ${p.stock}` : "Out of Stock"}
                  </span>

                  {isInStock(p.stock) ? (
                    <button className="add-btn" onClick={(e) => addToCart(e, p._id)}>
                      ADD TO CART
                    </button>
                  ) : (
                    <button className="out-stock-btn" disabled>
                      OUT OF STOCK
                    </button>
                  )}
                </div>
              </div>
            </Link>
            
          ))}
        </div>
      </section>

      <section className="products-section" id="all-products">
  <div className="section-heading">
    <h2>ALL PRODUCTS</h2>

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
  </div>

  <div className="product-grid">
    {allProducts.map((p, index) => (
      <Link
        key={p._id}
        to={`/product/${p._id}`}
        className="product-card-link"
      >
        <div className="product-card">
          {p.isBestSeller && <span className="sale-badge">BEST</span>}

          <button
            type="button"
            className="wishlist-heart"
            onClick={(e) => addToWishlist(e, p._id)}
          >
            ♡
          </button>

          <div className="product-image-box">
            <img src={p.image} alt={p.name} className="product-image" />
          </div>

          <div className="product-info">
            <h3>{p.name}</h3>

            <p className="product-price">
              ${Number(p.price).toFixed(2)}
            </p>

            <div className="rating-row">
              <span>★★★★★</span>
              <small>({p.numReviews || 0})</small>
            </div>

            <span
              className={
                isInStock(p.stock) ? "stock-badge" : "stock-badge out"
              }
            >
              {isInStock(p.stock)
                ? `In Stock: ${p.stock}`
                : "Out of Stock"}
            </span>

            {isInStock(p.stock) ? (
              <button
                className="add-btn"
                onClick={(e) => addToCart(e, p._id)}
              >
                ADD TO CART
              </button>
            ) : (
              <button className="out-stock-btn" disabled>
                OUT OF STOCK
              </button>
            )}
          </div>
        </div>
      </Link>
    ))}
  </div>
</section>

      <section className="service-row">
        <div>🚚 <strong>Free Shipping</strong><span>On orders over $50</span></div>
        <div>🔄 <strong>30-Day Returns</strong><span>Money back guarantee</span></div>
        <div>🛡️ <strong>Secure Payment</strong><span>100% protected</span></div>
        <div>🎧 <strong>24/7 Support</strong><span>Dedicated support</span></div>
      </section>

      <section className="newsletter">
        <div>
          <h2>Get 10% Off Your First Order</h2>
          <p>Join our newsletter and be the first to know about new arrivals.</p>
        </div>

        <div className="newsletter-form">
          <input type="email" placeholder="Enter your email" />
          <button>SUBSCRIBE</button>
        </div>
      </section>
      <AIChat ref={chatRef} products={products} />
    </div>
    
  );
}

export default Home;