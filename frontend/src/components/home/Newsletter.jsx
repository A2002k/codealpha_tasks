function Newsletter() {
  return (
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
  );
}

export default Newsletter;