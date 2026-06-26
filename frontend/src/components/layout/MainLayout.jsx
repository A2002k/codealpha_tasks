import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./MainLayout.css";

function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [pendingCount, setPendingCount] = useState(0);
  const [lastPendingCount, setLastPendingCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(sessionStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  const linkClass = (path) =>
    location.pathname === path ? "active-link" : "";

  useEffect(() => {
    if (!isAdmin) return;

    fetchPendingOrders();

    const interval = setInterval(() => {
      fetchPendingOrders();
    }, 10000);

    return () => clearInterval(interval);
  }, [isAdmin]);

  const fetchPendingOrders = async () => {
    try {
      const res = await API.get("/admin/orders/all");

      const pending = res.data.filter(
        (order) => order.status === "Pending"
      ).length;

      if (pending > lastPendingCount && lastPendingCount !== 0) {
        const audio = new Audio("/sounds/notification.mp3");
        audio.play();
      }

      setLastPendingCount(pending);
      setPendingCount(pending);
    } catch (err) {
      console.log("Pending orders error:", err.message);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="main-layout">

      <button className="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)}>
      ☰
    </button>

<div className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
      <div className="logo-section">
        <img
          src="/favicon.png"
          alt="AK Store"
          className="logo-img"
        />

        <div>
          <h2>AK Store</h2>
          
          <span className="logo-tagline">
            E-Commerce Platform
          </span>
        </div>
      </div>

        {user && (
          <div className="sidebar-user">
            <p>{user.name}</p>
            <span>{isAdmin ? "Admin" : "Customer"}</span>
          </div>
        )}
        <br></br>

        <div className="sidebar-links">
          <Link className={linkClass("/")} to="/" onClick={() => setMenuOpen(false)}>
            🏠 Home
          </Link>

          <Link className={linkClass("/cart")} to="/cart" onClick={() => setMenuOpen(false)}>
            🛒 Cart
          </Link>

          <Link className={linkClass("/order")} to="/order" onClick={() => setMenuOpen(false)}>
            📦 Orders
          </Link>

          <Link className={linkClass("/wishlist")} to="/wishlist"onClick={() => setMenuOpen(false)}>
            ❤️ Wishlist
          </Link>

          

          {isAdmin && (
            <>
              <div className="sidebar-section-title">ADMIN</div>

              <Link className={linkClass("/admin")} to="/admin">
                ⚙️ Products Admin
              </Link>

              <Link className={linkClass("/admin/orders")} to="/admin/orders" onClick={() => setMenuOpen(false)}>
                📦 Manage Orders
                {pendingCount > 0 && (
                  <span className="order-badge">{pendingCount}</span>
                )}
              </Link>  
               
               <Link className={linkClass("/admin/dashboard")} to="/admin/dashboard"  onClick={() => setMenuOpen(false)}>
                📊 Dashboard
               </Link>

               <Link className={linkClass("/admin/monthly-revenue")}  to="/admin/monthly-revenue" onClick={() => setMenuOpen(false)}>
               📈 Monthly Revenue
               </Link>

               <Link className={linkClass("/admin/top-products")} to="/admin/top-products" onClick={() => setMenuOpen(false)}>
               🏆 Top Products
               </Link>

              <Link className={linkClass("/admin/coupons")} to="/admin/coupons"  onClick={() => setMenuOpen(false)}>
                🎟️ Coupons
              </Link>
            </>
          )}

          {user ? (
            <button className="logout-btn" onClick={logout}>
              🚪 Logout
            </button>
          ) : (
            <Link className={linkClass("/login")} to="/login" onClick={() => setMenuOpen(false)}>
              🔐 Login
            </Link>
          )}
        </div>
      </div>

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;