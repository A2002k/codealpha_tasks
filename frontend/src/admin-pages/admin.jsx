import { useEffect, useState } from "react";
import API from "../api/axios";
import "../pages/css/admin.css";

function Admin() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
const [categoryFilter, setCategoryFilter] = useState("All");


  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data);
  };

  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      description: "",
      category: "",
      stock: "",
    });
    setImageFile(null);
    setImagePreview("");
    setEditingId(null);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const submitProduct = async (e) => {
    e.preventDefault();

    try {
      const productData = new FormData();

      productData.append("name", form.name);
      productData.append("price", form.price);
      productData.append("description", form.description);
      productData.append("category", form.category);
      productData.append("stock", form.stock);

      if (imageFile) {
        productData.append("image", imageFile);
      }

      if (editingId) {
        await API.put(`/products/${editingId}`, productData);
        alert("Product updated successfully");
      } else {
        await API.post("/products", productData);
        alert("Product added successfully");
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving product");
    }
  };

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm("Delete this product?");

    if (!confirmDelete) return;

    await API.delete(`/products/${id}`);
    fetchProducts();
  };

  const startEdit = (product) => {
    setEditingId(product._id);

    setForm({
      name: product.name || "",
      price: product.price || "",
      description: product.description || "",
      category: product.category || "",
      stock: product.stock || "",
    });

    setImagePreview(product.image || "");
    setImageFile(null);
  };

  const totalProducts = products.length;

  const totalStock = products.reduce((sum, p) => {
    return sum + Number(p.stock || 0);
  }, 0);

  const totalValue = products.reduce((sum, p) => {
    return sum + Number(p.price || 0) * Number(p.stock || 0);
  }, 0);

  //filtwering products based on search and category
  const categories = [
  "All",
  ...new Set(products.map((p) => p.category).filter(Boolean)),
];

const filteredProducts = products.filter((product) => {
  const matchesSearch =
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.category?.toLowerCase().includes(search.toLowerCase());

  const matchesCategory =
    categoryFilter === "All" || product.category === categoryFilter;

  return matchesSearch && matchesCategory;
});

  return (
    <div className="admin-page">
      <h1 className="admin-title">Admin Dashboard ⚙️</h1>

      <div className="admin-stats">
        <div className="stat-card">
          <span>Total Products</span>
          <h2>{totalProducts}</h2>
        </div>

        <div className="stat-card">
          <span>Total Stock</span>
          <h2>{totalStock}</h2>
        </div>

        <div className="stat-card">
          <span>Inventory Value</span>
          <h2>${totalValue}</h2>
        </div>
      </div>

      <div className="admin-layout">
        <div className="admin-form-card">
          <h2>{editingId ? "Edit Product" : "Add Product"}</h2>

          <form onSubmit={submitProduct}>
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="price"
              min="0"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
            />

            <input
              type="number"
              name="stock"
              min="0"
              placeholder="Stock"
              value={form.stock}
              onChange={handleChange}
            />

            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
            />

            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}
            />

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="admin-preview"
              />
            )}

            <button type="submit" className="save-btn">
              {editingId ? "Update Product" : "Add Product"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-btn"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        
<div className="admin-products-section">
  <div className="admin-filters">
    <input
      type="text"
      placeholder="Search products..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

    <select
      value={categoryFilter}
      onChange={(e) => setCategoryFilter(e.target.value)}
    >
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  </div>

  <div className="admin-table-card">
    <h2>Products List</h2>

    <table className="admin-table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Category</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {filteredProducts.map((p) => (
          <tr key={p._id}>
            <td>
              {p.image ? (
                <img src={p.image} alt={p.name} className="table-img" />
              ) : (
                "No image"
              )}
            </td>

            <td>{p.name}</td>
            <td>${p.price}</td>
            <td>{p.stock}</td>
            <td>{p.category}</td>

            <td>
              <button className="edit-btn" onClick={() => startEdit(p)}>
                Edit
              </button>

              <button className="delete-btn" onClick={() => deleteProduct(p._id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {filteredProducts.length === 0 && (
      <p className="empty-text">No matching products found</p>
    )}
  </div>
</div>
</div>
    </div>
  );
}

export default Admin;