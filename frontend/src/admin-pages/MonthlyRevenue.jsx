import { useEffect, useState } from "react";
import API from "../api/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function MonthlyRevenue() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/admin/orders/all");

      const monthlyRevenue = res.data
        .filter((order) => order.status !== "Cancelled")
        .reduce((acc, order) => {
          const month = new Date(order.createdAt).toLocaleString(
            "default",
            {
              month: "short",
            }
          );

          acc[month] =
            (acc[month] || 0) + Number(order.totalPrice || 0);

          return acc;
        }, {});

      const chartData = Object.entries(monthlyRevenue).map(
        ([month, revenue]) => ({
          month,
          revenue,
        })
      );

      setData(chartData);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "18px",
      }}
    >
      <h1>📈 Monthly Revenue</h1>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#2563eb"
            strokeWidth={5}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MonthlyRevenue;