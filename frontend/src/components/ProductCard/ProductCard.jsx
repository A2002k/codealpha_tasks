import "./ProductCard.css";

function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <h3>{product.name}</h3>

      <p className="price">${product.price}</p>

      <p className="description">
        {product.description || "No description"}
      </p>

      <button
        className="add-btn"
        onClick={() => onAddToCart(product._id)}
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;