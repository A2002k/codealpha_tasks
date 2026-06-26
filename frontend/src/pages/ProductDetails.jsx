import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import "./css/ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const renderStars = (value) => {
    const rounded = Math.round(Number(value || 0));

    return "★".repeat(rounded) + "☆".repeat(5 - rounded);
  };

  const addToCart = async () => {
    try {
      await API.post("/cart/add", {
        productId: product._id,
        quantity: 1,
      });

      alert("Added to cart 🛒");
    } catch (err) {
      alert(err.response?.data?.message || "Error adding to cart");
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();

    try {
      await API.post(`/products/${id}/reviews`, {
        rating,
        comment,
      });

      alert("Review added successfully ⭐");

      setRating(5);
      setComment("");

      fetchProduct();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding review");
    }
  };

  if (!product) return <h2>Loading...</h2>;

  return (
    <div className="product-details-page">
      <div className="details-card">
        <div className="details-image-wrap">
          <img
            src={product.image}
            alt={product.name}
            className="details-image"
          />
        </div>

        <div className="details-info">
          <p className="details-category">{product.category}</p>

          <h1>{product.name}</h1>

          <div className="rating-summary">
            <span className="stars-text">{renderStars(product.rating)}</span>
            <strong>{product.rating?.toFixed(1) || "0.0"}</strong>
            <span>({product.numReviews || 0} reviews)</span>
          </div>

          <h2>${product.price}</h2>

          <p className="details-description">{product.description}</p>

          <p>
            <strong>Stock:</strong>{" "}
            {Number(product.stock) > 0 ? product.stock : "Out of Stock"}
          </p>

          {Number(product.stock) > 0 ? (
            <button onClick={addToCart} className="details-cart-btn">
              Add to Cart 🛒
            </button>
          ) : (
            <button className="details-out-btn" disabled>
              Out of Stock
            </button>
          )}
        </div>
      </div>

      <div className="reviews-section">
        <div className="reviews-header">
          <div>
            <h2>Customer Reviews</h2>
            <p>
              {product.numReviews || 0} review(s) for this product
            </p>
          </div>

          <div className="average-box">
            <span>{product.rating?.toFixed(1) || "0.0"}</span>
            <small>{renderStars(product.rating)}</small>
          </div>
        </div>

        <form className="review-form" onSubmit={submitReview}>
          <label>Your Rating</label>

          <div className="star-selector">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                className={star <= rating ? "star active-star" : "star"}
                onClick={() => setRating(star)}
              >
                ★
              </button>
            ))}
          </div>

          <label>Your Review</label>

          <textarea
            placeholder="Write your opinion about this product..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />

          <button type="submit">Submit Review</button>
        </form>

        <div className="reviews-list">
          {product.reviews?.length === 0 && (
            <p>No reviews yet. Be the first to review this product.</p>
          )}

          {product.reviews?.map((review) => (
            <div key={review._id} className="review-card">
              <div className="review-header">
                <div>
                  <strong>{review.name}</strong>
                  <div className="review-stars">
                    {renderStars(review.rating)}
                  </div>
                </div>

                <small>
                  {new Date(review.createdAt).toLocaleDateString()}
                </small>
              </div>

              <p>{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;