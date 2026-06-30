function Hero({ heroProducts }) {
  return (
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
          <a href="#best-sellers" className="primary-hero-btn">SHOP NOW →</a>
          <a href="#all-products" className="secondary-hero-btn">VIEW COLLECTION</a>
        </div>

        <div className="hero-benefits">
          <div><strong>🏅 Premium Quality</strong><span>Trusted Products</span></div>
          <div><strong>🚚 Fast Delivery</strong><span>Across the Country</span></div>
          <div><strong>🛡️ Secure Payment</strong><span>100% Protected</span></div>
        </div>
      </div>

      <div className="hero-products">
        {heroProducts.map((p) => (
          <img key={p._id} src={p.image} alt={p.name} />
        ))}
      </div>
    </section>
  );
}

export default Hero;