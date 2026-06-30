import { forwardRef, useImperativeHandle, useState } from "react";
import { Link } from "react-router-dom";
import "./AIchat.css";

const AIChat = forwardRef(({ products }, ref) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [chat, setChat] = useState([
    {
      from: "bot",
      text: "Hi 👋 I'm AK AI. Ask me about products, shipping, returns, payments, or coupons.",
    },
  ]);

  useImperativeHandle(ref, () => ({
    openChat: () => setOpen(true),
  }));

  const findProducts = (text) => {
  const lower = text.toLowerCase();

  let results = [...products];

  // Detect budget: under / less than / below
  const budgetMatch = lower.match(/(?:under|less than|below)\s*\$?(\d+)/);

  if (budgetMatch) {
    const maxPrice = Number(budgetMatch[1]);
    results = results.filter((p) => Number(p.price) <= maxPrice);
  }

  // Detect category/product keywords
  const keywords = lower.split(" ");

  const categoryWords = [
    "laptop",
    "laptops",
    "phone",
    "phones",
    "iphone",
    "ipad",
    "tablet",
    "gaming",
    "fan",
    "accessories",
    "ps5",
    "playstation",
  ];

  const matchedKeyword = categoryWords.find((word) =>
    keywords.includes(word)
  );

  if (matchedKeyword) {
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(matchedKeyword) ||
        p.category?.toLowerCase().includes(matchedKeyword)
    );
  }

  // Cheapest
  if (lower.includes("cheap") || lower.includes("cheapest")) {
    results = results.sort((a, b) => Number(a.price) - Number(b.price));
  }

  return results.slice(0, 3);
};

  const sendMessage = (e, quickText = null) => {
    if (e) e.preventDefault();

    const userMsg = quickText || message;
    if (!userMsg.trim()) return;

    const lower = userMsg.toLowerCase();
    let reply = {
      from: "bot",
      text: "I'm still learning 😊. Try asking about products, shipping, returns, coupons, or payment.",
    };

    if (lower.includes("shipping") || lower.includes("delivery")) {
      reply = {
        from: "bot",
        text: "🚚 Delivery usually takes 2–5 business days. Orders over $50 get free shipping.",
      };
    } else if (lower.includes("return")) {
      reply = {
        from: "bot",
        text: "↩️ You can return products within 30 days if they are in good condition.",
      };
    } else if (lower.includes("coupon") || lower.includes("discount")) {
      reply = {
        from: "bot",
        text: "🎟️ You can apply discount coupons at checkout. Check the promo popup for active coupon codes.",
      };
    } else if (lower.includes("payment") || lower.includes("card")) {
      reply = {
        from: "bot",
        text: "💳 We support Cash on Delivery and demo Credit/Debit Card payment.",
      };
    } else {
      const matchedProducts = findProducts(userMsg);

      if (matchedProducts.length > 0) {
        reply = {
          from: "bot",
          text: "🛍️ I found these products for you:",
          products: matchedProducts,
        };
      }
    }

    setChat((prev) => [
      ...prev,
      { from: "user", text: userMsg },
      reply,
    ]);

    setMessage("");
    setOpen(true);
  };

  return (
    <>
      {open && (
        <div className="ai-chat-box">
          <div className="ai-chat-header">
            <div>
              <strong>✨ AK AI Assistant</strong>
              <span>Online shopping helper</span>
            </div>

            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="quick-actions">
            <button onClick={(e) => sendMessage(e, "Shipping")}>🚚 Shipping</button>
            <button onClick={(e) => sendMessage(e, "Returns")}>↩️ Returns</button>
            <button onClick={(e) => sendMessage(e, "Coupons")}>🎟 Coupons</button>
            <button onClick={(e) => sendMessage(e, "Payment")}>💳 Payment</button>
          </div>

          <div className="ai-chat-messages">
            {chat.map((msg, index) => (
              <div key={index} className={`chat-msg ${msg.from}`}>
                <p>{msg.text}</p>

                {msg.products && (
                  <div className="chat-products">
                    {msg.products.map((p) => (
                      <Link
                        key={p._id}
                        to={`/product/${p._id}`}
                        className="chat-product-card"
                      >
                        <img src={p.image} alt={p.name} />

                        <div>
                          <strong>{p.name}</strong>
                          <span>${Number(p.price).toFixed(2)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <form className="ai-chat-input" onSubmit={sendMessage}>
            <input
              type="text"
              placeholder="Ask AK AI..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button>Send</button>
          </form>
        </div>
      )}

      <button className="ai-chat-toggle" onClick={() => setOpen(!open)}>
        💬
      </button>
    </>
  );
});

export default AIChat;