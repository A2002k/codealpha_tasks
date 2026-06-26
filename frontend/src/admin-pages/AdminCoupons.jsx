import { useEffect, useState } from "react";
import API from "../api/axios";
import "../pages/css/AdminCoupons.css";

function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);

  const [form, setForm] = useState({
    code: "",
    discountPercent: "",
    expiryDate: "",
    active: true,
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    const res = await API.get("/coupons");
    setCoupons(res.data);
  };

  const resetForm = () => {
    setForm({
      code: "",
      discountPercent: "",
      expiryDate: "",
      active: true,
    });
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const submitCoupon = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await API.put(`/coupons/${editingId}`, form);
        alert("Coupon updated successfully");
      } else {
        await API.post("/coupons", form);
        alert("Coupon created successfully");
      }

      resetForm();
      fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving coupon");
    }
  };

  const deleteCoupon = async (id) => {
    const confirmDelete = window.confirm("Delete this coupon?");
    if (!confirmDelete) return;

    await API.delete(`/coupons/${id}`);
    fetchCoupons();
  };

  const startEdit = (coupon) => {
    setEditingId(coupon._id);

    setForm({
      code: coupon.code,
      discountPercent: coupon.discountPercent,
      expiryDate: coupon.expiryDate?.slice(0, 10),
      active: coupon.active,
    });
  };

  return (
    <div className="coupons-page">
      <h1>🎟️ Coupon Management</h1>

      <div className="coupons-layout">
        <div className="coupon-form-card">
          <h2>{editingId ? "Edit Coupon" : "Create Coupon"}</h2>

          <form onSubmit={submitCoupon}>
            <input
              type="text"
              name="code"
              placeholder="Coupon Code e.g. AK10"
              value={form.code}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="discountPercent"
              min="0"
              max="100"
              placeholder="Discount Percentage"
              value={form.discountPercent}
              onChange={handleChange}
              required
            />

            <input
              type="date"
              name="expiryDate"
              value={form.expiryDate}
              onChange={handleChange}
              required
            />

            <label className="coupon-check">
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
              />
              Active Coupon
            </label>

            <button className="coupon-save-btn" type="submit">
              {editingId ? "Update Coupon" : "Create Coupon"}
            </button>

            {editingId && (
              <button
                type="button"
                className="coupon-cancel-btn"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        <div className="coupons-table-card">
          <h2>Coupons List</h2>

          <table className="coupons-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Expires</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon._id}>
                  <td>
                    <strong>{coupon.code}</strong>
                  </td>

                  <td>{coupon.discountPercent}%</td>

                  <td>
                    {new Date(coupon.expiryDate).toLocaleDateString()}
                  </td>

                  <td>
                    <span
                      className={
                        coupon.active
                          ? "coupon-status active"
                          : "coupon-status inactive"
                      }
                    >
                      {coupon.active ? "Active" : "Disabled"}
                    </span>
                  </td>

                  <td>
                    <button
                      className="coupon-edit-btn"
                      onClick={() => startEdit(coupon)}
                    >
                      Edit
                    </button>

                    <button
                      className="coupon-delete-btn"
                      onClick={() => deleteCoupon(coupon._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {coupons.length === 0 && <p>No coupons found</p>}
        </div>
      </div>
    </div>
  );
}

export default AdminCoupons;