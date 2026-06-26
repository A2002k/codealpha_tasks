import { useEffect, useState } from "react";
import API from "../api/axios";
import "../pages/css/TopSellingProducts.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";


function TopSellingProducts() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/admin/orders/all");

      const productSales = {};

      res.data
        .filter((order) => order.status !== "Cancelled")
        .forEach((order) => {
          order.items?.forEach((item) => {
            const productName = item.product?.name || "Deleted Product";

            productSales[productName] =
              (productSales[productName] || 0) + Number(item.quantity || 0);
          });
        });

      const chartData = Object.entries(productSales)
        .map(([name, quantity]) => ({
          name,
          quantity,
        }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 10);

      setData(chartData);
    } catch (err) {
      console.log("Top products error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="top-products-page">
      <h1>🏆 Top Selling Products</h1>

      <div className="top-products-card">
        {data.length === 0 ? (
          <p>No sales data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={420}>
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis type="number" />

              <YAxis
                type="category"
                dataKey="name"
                width={160}
              />

              <Tooltip />

              <Bar
                dataKey="quantity"
                fill="#2563eb"
                radius={[0, 10, 10, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          
        )}

                <div className="top-ranking-table">
          <h2>🏆 Product Ranking</h2>

          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Product</th>
                <th>Quantity Sold</th>
              </tr>
            </thead>

            <tbody>
              {data.map((product, index) => (
                <tr key={product.name}>
                  <td>#{index + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TopSellingProducts;