import { Link } from "react-router-dom";

function ProductSection({
  title,
  products,
  categories,
  categoryFilter,
  setCategoryFilter,
  isInStock,
  addToCart,
  addToWishlist,
  showCategoryTabs = true,
}) {
  return (
    <section className="products-section">
      <div className="section-heading">
        <h2>{title}</h2>

        {showCategoryTabs && (
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
        )}
      </div>

      <div className="product-grid">
        {products.map((p, index) => (
          <Link key={p._id} to={`/product/${p._id}`} className="product-card-link">
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

                <p className="product-price">${Number(p.price).toFixed(2)}</p>

                <div className="rating-row">
                  <span>★★★★★</span>
                  <small>({p.numReviews || 0})</small>
                </div>

                <span className={isInStock(p.stock) ? "stock-badge" : "stock-badge out"}>
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
  );
}

export default ProductSection;