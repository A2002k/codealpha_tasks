import { useEffect, useState } from "react";

function Hero({ heroProducts }) {
  const slides = [
    {
      label: "NEW TECH COLLECTION",
      title: "Power Your Digital Lifestyle",
      desc: "Discover laptops, smartphones, headphones, gaming consoles, and premium tech accessories in one place.",
      image: heroProducts[0]?.image,
      primary: "SHOP NOW →",
      secondary: "VIEW COLLECTION",
    },
   
    {
      label: "PREMIUM AUDIO",
      title: "Feel Every Beat and Deep Bass",
      desc: "Upgrade your sound with wireless headphones, speakers, and audio accessories for everyday entertainment.",
      image: heroProducts[8]?.image || heroProducts[0]?.image,
      primary: "SHOP AUDIO →",
      secondary: "ALL PRODUCTS",
    },
    {
      label: "GAMING ESSENTIALS",
      title: "Level Up Your Gaming Setup",
      desc: "Explore PlayStation consoles, gaming devices, controllers, and accessories built for next-level entertainment.",
      image: heroProducts[2]?.image || heroProducts[0]?.image,
      primary: "EXPLORE GAMING →",
      secondary: "BEST SELLERS",
    },

  ];

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const slide = slides[activeSlide];

  return (
    <section className="hero-section" id="home">
      <button
        className="hero-arrow hero-arrow-left"
        onClick={() =>
          setActiveSlide((prev) =>
            prev === 0 ? slides.length - 1 : prev - 1
          )
        }
      >
        ‹
      </button>

      <div className="hero-content">
        <span className="hero-label">{slide.label}</span>

        <h1>{slide.title}</h1>

        <p>{slide.desc}</p>

        <div className="hero-buttons">
          <a href="#all-products" className="primary-hero-btn">
            {slide.primary}
          </a>

          <a href="#best-sellers" className="secondary-hero-btn">
            {slide.secondary}
          </a>
        </div>

        <div className="hero-benefits">
          <div>
            <strong>Premium Tech</strong>
            <span>Trusted products</span>
          </div>

          <div>
            <strong>Fast Delivery</strong>
            <span>Quick shipping</span>
          </div>

          <div>
            <strong>Secure Checkout</strong>
            <span>Protected payments</span>
          </div>
        </div>

        <div className="hero-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={activeSlide === index ? "active-dot" : ""}
              onClick={() => setActiveSlide(index)}
            ></button>
          ))}
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-glow"></div>

        {slide.image && (
          <img
            key={activeSlide}
            src={slide.image}
            alt={slide.title}
            className="hero-main-image"
          />
        )}

        <div className="floating-card card-one">
          <strong>Best Seller</strong>
          <span>Top rated tech</span>
        </div>

        <div className="floating-card card-two">
          <strong>Fast Shipping</strong>
          <span>2–5 business days</span>
        </div>
      </div>

      <button
        className="hero-arrow hero-arrow-right"
        onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
      >
        ›
      </button>
    </section>
  );
}

export default Hero;