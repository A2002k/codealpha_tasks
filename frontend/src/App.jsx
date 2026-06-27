import { Routes, Route } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Order from "./pages/Order";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./admin-pages/admin";
import ProductDetails from "./pages/ProductDetails";
import AdminOrders from "./admin-pages/AdminOrders";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./admin-pages/AdminDashboard";
import MonthlyRevenue from "./admin-pages/MonthlyRevenue";
import TopSellingProducts from "./admin-pages/TopSellingProducts";
import AdminCoupons from "./admin-pages/AdminCoupons";
import Wishlist from "./pages/Wishlist.jsx";


function App() {
  return (
    <Routes>

      {/* ALL PAGES WRAPPED INSIDE LAYOUT */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<Order />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/admin" element={ <AdminRoute> <Admin /></AdminRoute>}/>
        <Route path="/admin/orders" element={<AdminRoute> <AdminOrders /> </AdminRoute>}/>  
        <Route path="/admin/dashboard" element={<AdminRoute> <AdminDashboard /></AdminRoute>}/>
        <Route path="/admin/monthly-revenue"element={ <AdminRoute><MonthlyRevenue /></AdminRoute>}/>
        <Route path="/admin/top-products" element={ <AdminRoute> <TopSellingProducts /> </AdminRoute>}/>
        <Route path="/admin/coupons" element={ <AdminRoute> <AdminCoupons /> </AdminRoute>}/>
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/payment-success" element={<h1>✅ Order placed successfully</h1>} />
        </Route>

      {/* AUTH PAGES (NO SIDEBAR) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

    </Routes>
  );
}

export default App;