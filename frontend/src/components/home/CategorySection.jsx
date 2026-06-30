function CategorySection({ categoryCards, setCategoryFilter }) {
  return (
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
  );
}

export default CategorySection;