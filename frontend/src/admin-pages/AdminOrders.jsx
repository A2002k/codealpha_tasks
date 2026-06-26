import { useEffect, useState } from "react";
import API from "../api/axios";
import "../pages/css/AdminOrders.css";
import * as XLSX from "xlsx";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("Active");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/admin/orders/all");
      setOrders(res.data);
    } catch (err) {
      console.log("Admin orders error:", err.response?.data || err.message);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/admin/orders/status/${id}`, { status });
      fetchOrders();
    } catch (err) {
      alert("Error updating order");
    }
  };

  const totalOrders = orders.length;

  const totalRevenue = orders.reduce((sum, order) => {
    return sum + Number(order.totalPrice || 0);
  }, 0);

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  //search and filter logic
  const filteredOrders = orders.filter((order) => {
  const customerName = order.user?.name?.toLowerCase() || "";
  const customerEmail = order.user?.email?.toLowerCase() || "";
  const phone = order.phone || "";

  const matchesSearch =
    customerName.includes(search.toLowerCase()) ||
    customerEmail.includes(search.toLowerCase()) ||
    phone.includes(search);

 const matchesStatus =
  statusFilter === "All"
    ? true
    : statusFilter === "Active"
    ? order.status === "Pending" || order.status === "Processing"
    : order.status === statusFilter;

    return matchesSearch && matchesStatus;
});

const deliveredOrders = orders.filter(
  (order) => order.status === "Delivered"
).length;

const cancelledOrders = orders.filter(
  (order) => order.status === "Cancelled"
).length;

const exportOrders = () => {
  const exportData = filteredOrders.map((order) => ({
    OrderID: order._id,
    Customer: order.user?.name || "Unknown",
    Email: order.user?.email || "No email",
    Phone: order.phone || "-",
    Address: order.address || "-",
    Subtotal: order.totalPrice || 0,
    Coupon: order.couponCode || "-",
    Discount: order.discountAmount || 0,
    DeliveryFee: order.deliveryFee || 0,
    FinalTotal: order.finalTotal || order.totalPrice || 0,
    PaymentMethod: order.paymentMethod || "Cash on Delivery",
    PaymentStatus: order.paymentStatus || "Pending",
    Status: order.status,
    Date: new Date(order.createdAt).toLocaleString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

  XLSX.writeFile(workbook, "AK-Store-Orders.xlsx");
};

  return (
    <div className="admin-orders-page">
      <h1 className="admin-orders-title">Order Management 📦</h1>

      <div className="orders-stats">
        <div className="orders-stat-card">
          <span>Total Orders</span>
          <h2>{totalOrders}</h2>
        </div>

        <div className="orders-stat-card">
          <span>Total Revenue</span>
          <h2>${totalRevenue}</h2>
        </div>

        <div className="orders-stat-card">
          <span>Pending Orders</span>
          <h2>{pendingOrders}</h2>
        </div>
     

      <div className="orders-stat-card">
      <span>Delivered Orders</span>
      <h2>{deliveredOrders}</h2>
      </div>

     <div className="orders-stat-card">
     <span>Cancelled Orders</span>
     <h2>{cancelledOrders}</h2>
     </div>
      </div>

     <div className="orders-controls">
  <input
    type="text"
    placeholder="Search by customer, email, or phone..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
  >
   <option value="Active">Active Orders</option>
   <option value="All">All Orders</option>
   <option value="Pending">Pending</option>
   <option value="Processing">Processing</option>
   <option value="Delivered">Delivered</option>
   <option value="Cancelled">Cancelled</option>
  </select>
</div>
        <button className="export-btn" onClick={exportOrders}>
        📥 Export Orders
        </button>
      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Total</th>
              <th>Status</th>
              <th>Details</th>
              <th>Update</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) =>  (
              <tr key={order._id}>
                <td>
                  <strong>#{order._id.slice(-6)}</strong>
                  <br />
                  <small>{new Date(order.createdAt).toLocaleDateString()}</small>
                </td>

                <td>{order.user?.name || "Unknown"}</td>
                <td>{order.user?.email || "No email"}</td>
                <td>{order.phone || "-"}</td>
                <td>{order.address || "-"}</td>

                 
                

                <td>
                  <strong>${order.finalTotal || order.totalPrice}</strong>
                </td>

                <td>
                  <span className={`order-status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>

                 <td>
                <button
                  className="view-btn"
                  onClick={() => setSelectedOrder(order)}> 👁 View </button>
                </td>

                <td>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

       {filteredOrders.length === 0 && (
  <p className="no-orders">No matching orders found</p>
)}
      </div>
      {selectedOrder && (
  <div className="modal-overlay">
    <div className="order-modal">
      <button
        className="modal-close"
        onClick={() => setSelectedOrder(null)}
      >
        ✕
      </button>

      <h2>Order #{selectedOrder._id.slice(-6)}</h2>

      <div className="modal-section">
        <p><strong>Customer:</strong> {selectedOrder.user?.name || "Unknown"}</p>
        <p><strong>Email:</strong> {selectedOrder.user?.email || "No email"}</p>
        <p><strong>Phone:</strong> {selectedOrder.phone}</p>
        <p><strong>Address:</strong> {selectedOrder.address}</p>
        <p><strong>Status:</strong> {selectedOrder.status}</p>
        <p><strong>Total:</strong> ${selectedOrder.finalTotal || selectedOrder.totalPrice}</p>
      </div>

      <h3>Products</h3>

      <div className="modal-items">
        {selectedOrder.items.map((item, index) => (
          <div key={index} className="modal-item">
            <span>{item.product?.name || "Deleted Product"}</span>
            <span>x{item.quantity}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
)}
    </div>
    
  );
 
}

export default AdminOrders;