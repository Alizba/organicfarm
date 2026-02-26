"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #fafaf9; }
  .fade-in { animation: fadeUp 0.4s ease both; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  .nav-link:hover { color: #0f172a !important; }
  .btn-primary:hover { background: #1e293b !important; }
  .row:hover { background: #f8fafc !important; }
  .input:focus { outline: none; border-color: #0f172a !important; }
`;

export default function ShopkeeperProductsPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState(null);
  const [form, setForm]         = useState({ name: "", price: "", description: "", category: "", stock: "" });

  useEffect(() => {
    if (!loading && (!user || !["shopkeeper", "admin"].includes(user.role))) {
      router.replace("/login");
    }
  }, [user, loading]);

  useEffect(() => {
    if (user) fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/shopkeeper/products");
      setProducts(data.products || []);
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price) return setError("Name and price are required.");
    setSaving(true);
    setError(null);
    try {
      await axios.post("/api/shopkeeper/products", {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock) || 0,
      });
      setForm({ name: "", price: "", description: "", category: "", stock: "" });
      setShowForm(false);
      fetchProducts();
    } catch (e) {
      setError(e?.response?.data?.error || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await axios.delete(`/api/shopkeeper/products?id=${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (e) {
      alert("Failed to delete product.");
    }
  };

  if (loading || !user) return <Loader />;

  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: "100vh", background: "#fafaf9" }}>

        {/* Nav */}
        <nav style={{
          background: "#fff", borderBottom: "1px solid #e5e7eb",
          padding: "0 40px", height: 60,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, zIndex: 50,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, color: "#0f172a" }}>Shopkeeper</span>
            <Link href="/roles/shopkeeper" className="nav-link" style={{ fontSize: 13, fontWeight: 500, color: "#64748b", textDecoration: "none" }}>Dashboard</Link>
            <Link href="/roles/shopkeeper/products" className="nav-link" style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", textDecoration: "none" }}>Products</Link>
            <Link href="/roles/shopkeeper/analytics" className="nav-link" style={{ fontSize: 13, fontWeight: 500, color: "#64748b", textDecoration: "none" }}>Analytics</Link>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 13, color: "#64748b" }}>{user.userName}</span>
            <button onClick={logout} className="btn-primary" style={{
              background: "#0f172a", color: "#fff", border: "none",
              borderRadius: 8, padding: "7px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>Logout</button>
          </div>
        </nav>

        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 40px" }}>

          {/* Header */}
          <div className="fade-in" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
            <div>
              <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, color: "#0f172a", fontWeight: 400 }}>Products</h1>
              <p style={{ color: "#64748b", marginTop: 6, fontSize: 15 }}>Manage your product listings.</p>
            </div>
            <button
              onClick={() => { setShowForm((v) => !v); setError(null); }}
              style={{
                background: "#0f172a", color: "#fff", border: "none",
                borderRadius: 8, padding: "10px 20px", fontSize: 13,
                fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              }}
            >{showForm ? "Cancel" : "+ Add Product"}</button>
          </div>

          {/* Add Product Form */}
          {showForm && (
            <div className="fade-in" style={{
              background: "#fff", border: "1px solid #e5e7eb",
              borderRadius: 12, padding: 28, marginBottom: 28,
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", marginBottom: 20 }}>New Product</div>
              {error && (
                <div style={{ background: "#fef2f2", color: "#dc2626", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
                  {error}
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[
                  { key: "name",        label: "Product Name *", placeholder: "e.g. Handmade Soap" },
                  { key: "price",       label: "Price (Rs.) *",  placeholder: "e.g. 450",           type: "number" },
                  { key: "category",    label: "Category",       placeholder: "e.g. Skincare"       },
                  { key: "stock",       label: "Stock Qty",      placeholder: "e.g. 20",            type: "number" },
                ].map((field) => (
                  <div key={field.key}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>
                      {field.label}
                    </label>
                    <input
                      className="input"
                      type={field.type || "text"}
                      placeholder={field.placeholder}
                      value={form[field.key]}
                      onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      style={{
                        width: "100%", padding: "10px 12px", fontSize: 13,
                        border: "1px solid #e5e7eb", borderRadius: 8,
                        fontFamily: "inherit", background: "#fafaf9",
                        transition: "border-color 0.15s",
                      }}
                    />
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>
                  Description
                </label>
                <textarea
                  className="input"
                  placeholder="Describe your product..."
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  style={{
                    width: "100%", padding: "10px 12px", fontSize: 13,
                    border: "1px solid #e5e7eb", borderRadius: 8,
                    fontFamily: "inherit", background: "#fafaf9", resize: "vertical",
                  }}
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={saving}
                style={{
                  marginTop: 20, background: "#0f172a", color: "#fff",
                  border: "none", borderRadius: 8, padding: "10px 24px",
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                  fontFamily: "inherit", opacity: saving ? 0.6 : 1,
                }}
              >{saving ? "Saving…" : "Save Product"}</button>
            </div>
          )}

          {/* Products Table */}
          <div className="fade-in" style={{
            background: "#fff", border: "1px solid #e5e7eb",
            borderRadius: 12, overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}>
            {fetching ? (
              <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Loading...</div>
            ) : products.length === 0 ? (
              <div style={{ padding: 60, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
                No products yet. Click <strong>+ Add Product</strong> to get started.
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                    {["Product", "Category", "Price", "Stock", "Actions"].map((h) => (
                      <th key={h} style={{
                        padding: "12px 20px", textAlign: "left",
                        fontSize: 11, fontWeight: 700, color: "#94a3b8",
                        textTransform: "uppercase", letterSpacing: 0.5,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => (
                    <tr key={p._id} className="row" style={{
                      borderBottom: i < products.length - 1 ? "1px solid #f8fafc" : "none",
                      background: "#fff", transition: "background 0.15s",
                    }}>
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: "#0f172a" }}>{p.name}</div>
                        {p.description && (
                          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                            {p.description.length > 50 ? p.description.slice(0, 50) + "…" : p.description}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "14px 20px", fontSize: 13, color: "#64748b" }}>{p.category || "—"}</td>
                      <td style={{ padding: "14px 20px", fontSize: 13, fontWeight: 600, color: "#0f172a" }}>Rs. {p.price?.toLocaleString()}</td>
                      <td style={{ padding: "14px 20px" }}>
                        <span style={{
                          background: p.stock > 0 ? "#ecfdf5" : "#fef2f2",
                          color: p.stock > 0 ? "#059669" : "#dc2626",
                          fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 99,
                        }}>{p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}</span>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <button
                          onClick={() => handleDelete(p._id)}
                          style={{
                            background: "#fef2f2", color: "#dc2626", border: "none",
                            borderRadius: 7, padding: "6px 12px", fontSize: 12,
                            fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                          }}
                        >Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Loader() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fafaf9" }}>
      <div style={{ width: 32, height: 32, border: "3px solid #e2e8f0", borderTopColor: "#0f172a", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}