import { useEffect, useState } from "react";
import API from "../api/axios";
import "./css/Orders.css";


function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
  <div>
    <h1 className="orders-title">My Orders 📦</h1>

    {orders.length === 0 ? (
      <p>No orders found</p>
    ) : (
      <div className="orders-container">
        {orders.map((order) => (
          <div key={order._id} className="order-card">

            <div className="order-header">
              <div>
                <h3>Order</h3>
                <p className="order-id">
                  {order._id}
                </p>
              </div>

              <span
                className={`status-badge status-${order.status.toLowerCase()}`}
              >
                {order.status}
              </span>
            </div>

            <div className="order-details">
              <p className="order-info">
                📍 {order.address}
              </p>

              <p className="order-info">
                📞 {order.phone}
              </p>

              <p className="order-info">
                💰 Total: ${order.finalTotal || order.totalPrice}
              </p>

              <p className="order-info">
                📅 {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="items-list">
              <h4>Items</h4>

              {order.items.map((item, index) => (
                <div key={index} className="item-row">
                  <span>
                    {item.product?.name || "Deleted Product"}
                  </span>

                  <span>
                    x{item.quantity}
                  </span>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>
    )}
  </div>
);
}

export default Orders;