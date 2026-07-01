import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/axios";
import "./css/home.css";
import PromoPopup from "./PromoPopup";
import AIChat from "../components/AIchat/AIchat";
import Hero from "../components/home/Hero";
import CategorySection from "../components/home/CategorySection";
import ProductSection from "../components/home/ProductSection";
import ServiceSection from "../components/home/ServiceSection";
import Newsletter from "../components/home/Newsletter";

function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const chatRef = useRef(null);
  const navigate = useNavigate();

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

    toast.success("🛒 Product added to cart!");
  } catch (err) {
    if (
      err.response?.status === 401 ||
      err.response?.data?.message?.toLowerCase().includes("token")
    ) {
      toast.warning("🔒 Please login first to add products to your cart.");

      setTimeout(() => {
        navigate("/login");
      }, 1800);

      return;
    }

    toast.error(
      err.response?.data?.message || "Error adding product to cart"
    );
  }
};

  const addToWishlist = async (e, productId) => {
  e.preventDefault();
  e.stopPropagation();

  try {
    await API.post("/wishlist/add", { productId });

    toast.success("❤️ Product added to wishlist!");
  } catch (err) {
    if (
      err.response?.status === 401 ||
      err.response?.data?.message?.toLowerCase().includes("token")
    ) {
      toast.warning("🔒 Please login first to use your wishlist.");

      setTimeout(() => {
        navigate("/login");
      }, 1800);

      return;
    }

    toast.error(
      err.response?.data?.message || "Error adding to wishlist"
    );
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

  const heroProducts = products.slice(0, 10);
  const bestSellers = products.filter((p) => p.isBestSeller === true);
  const allProducts = filteredProducts;

  return (
    <div className="modern-home">
      <PromoPopup />

      <div className="top-strip">
        <span>🚚 Free Shipping on orders over $100</span>
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
          <a href="#all-products">Shop</a>
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

      <Hero heroProducts={heroProducts} />

<CategorySection
  categoryCards={categoryCards}
  setCategoryFilter={setCategoryFilter}
/>

<ProductSection
  id="best-sellers"
  title="BEST SELLERS"
  products={bestSellers}
  categories={categories}
  categoryFilter={categoryFilter}
  setCategoryFilter={setCategoryFilter}
  isInStock={isInStock}
  addToCart={addToCart}
  addToWishlist={addToWishlist}
/>

<ProductSection
  id="all-products"
  title="ALL PRODUCTS"
  products={allProducts}
  categories={categories}
  categoryFilter={categoryFilter}
  setCategoryFilter={setCategoryFilter}
  isInStock={isInStock}
  addToCart={addToCart}
  addToWishlist={addToWishlist}
/>
<ServiceSection />

<Newsletter />

      <AIChat ref={chatRef} products={products} />
    </div>
  );
}
export default Home;