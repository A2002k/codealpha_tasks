import { useEffect, useState } from "react";
import API from "../api/axios";
import "../pages/css/AdminDashboard.css";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const productsRes = await API.get("/products");
      const ordersRes = await API.get("/admin/orders/all");

      setProducts(productsRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      console.log("Dashboard error:", err.response?.data || err.message);
    }
  };

  const totalProducts = products.length;
  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const totalRevenue = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce((sum, order) => sum + Number(order.finalTotal || order.totalPrice || 0), 0);

  const lowStockProducts = products.filter(
    (product) => Number(product.stock || 0) <= 5
  );

  const recentOrders = orders.slice(0, 6);

  const topProducts = {};

  orders
    .filter((order) => order.status !== "Cancelled")
    .forEach((order) => {
      order.items?.forEach((item) => {
        const name = item.product?.name || "Deleted Product";
        topProducts[name] =
          (topProducts[name] || 0) + Number(item.quantity || 0);
      });
    });

  const topProductsList = Object.entries(topProducts)
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  return (
    <div className="admin-dashboard-page">
      <h1 className="dashboard-title">Admin Dashboard 📊</h1>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <span>Total Products</span>
          <h2>{totalProducts}</h2>
        </div>

        <div className="dashboard-card">
          <span>Total Orders</span>
          <h2>{totalOrders}</h2>
        </div>

        <div className="dashboard-card">
          <span>Pending Orders</span>
          <h2>{pendingOrders}</h2>
        </div>

        <div className="dashboard-card">
          <span>Delivered Orders</span>
          <h2>{deliveredOrders}</h2>
        </div>

        <div className="dashboard-card revenue">
          <span>Total Revenue</span>
          <h2>${totalRevenue}</h2>
        </div>

        <div className="dashboard-card warning">
          <span>Low Stock Products</span>
          <h2>{lowStockProducts.length}</h2>
        </div>
      </div>

      <div className="dashboard-main-grid">
        <div className="dashboard-section">
          <h2>Recent Orders</h2>

          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id}>
                  <td>#{order._id.slice(-6)}</td>
                  <td>{order.user?.name || "Unknown"}</td>
                  <td>${order.totalPrice}</td>
                  <td>
                    <span className={`dash-status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {recentOrders.length === 0 && (
            <p className="no-dashboard-data">No recent orders</p>
          )}
        </div>

        <div className="dashboard-section">
          <h2>⚠️ Low Stock Alerts</h2>

          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Stock</th>
              </tr>
            </thead>

            <tbody>
              {lowStockProducts.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>
                    <span className="low-stock-badge">
                      {product.stock}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {lowStockProducts.length === 0 && (
            <p className="no-dashboard-data">All products have good stock</p>
          )}
        </div>
      </div>

      <div className="dashboard-section">
        <h2>🏆 Top Selling Products</h2>

        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Product</th>
              <th>Sold</th>
            </tr>
          </thead>

          <tbody>
            {topProductsList.map((product, index) => (
              <tr key={product.name}>
                <td>#{index + 1}</td>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {topProductsList.length === 0 && (
          <p className="no-dashboard-data">No product sales yet</p>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;