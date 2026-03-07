"use client";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import ShopkeeperSidebar from "@/components/shopkeeper/ShopkeeperSidebar";
import axios from "axios";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #fafaf9; }
  .fade-in { animation: fadeUp 0.4s ease both; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  .row:hover { background: #f8fafc !important; }
  .input:focus { outline: none; border-color: #0f172a !important; }
  .upload-area:hover { border-color: #0f172a !important; background: #f8fafc !important; }
`;

const EMPTY_FORM = {
  name: "", price: "", originalPrice: "", description: "",
  category: "", weight: "", stock: "", isVegetarian: false,
};

export default function ShopkeeperProductsPage() {
  const { user, loading } = useAuth();
  const router  = useRouter();
  const fileRef = useRef(null);

  const [products, setProducts]             = useState([]);
  const [fetching, setFetching]             = useState(true);
  const [showForm, setShowForm]             = useState(false);
  const [saving, setSaving]                 = useState(false);
  const [error, setError]                   = useState(null);
  const [form, setForm]                     = useState(EMPTY_FORM);
  const [imageFile, setImageFile]           = useState(null);
  const [imagePreview, setImagePreview]     = useState(null);
  const [categories, setCategories]         = useState([]); 
  const [catLoading, setCatLoading]         = useState(false);
  const [showCustom, setShowCustom]         = useState(false);
  const [customLabel, setCustomLabel]       = useState("");

  useEffect(() => {
    if (!loading && (!user || !["shopkeeper", "admin"].includes(user.role))) {
      router.replace("/login");
    }
  }, [user, loading]);

  useEffect(() => {
    if (user) { fetchProducts(); fetchCategories(); }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/shopkeeper/products");
      setProducts(data.products || []);
    } catch (e) { console.error(e); }
    finally { setFetching(false); }
  };

  const fetchCategories = async () => {
    setCatLoading(true);
    try {
      const { data } = await axios.get("/api/shopkeeper/categories");
      setCategories(data.categories || []); 
    } catch (e) { console.error(e); }
    finally { setCatLoading(false); }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setError("Image must be under 2MB."); return; }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImageFile(null); setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price) return setError("Name and price are required.");
    setSaving(true); setError(null);
    try {
      let imageBase64 = null;
      if (imageFile) {
        imageBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror  = reject;
          reader.readAsDataURL(imageFile);
        });
      }

      let categoryId = form.category; 
      if (showCustom && customLabel.trim()) {
        const slug = customLabel.toLowerCase().trim().replace(/\s+/g, "-");
        const catRes = await axios.post("/api/shopkeeper/categories", {
          name:  slug,
          label: customLabel.trim(),
        });
        categoryId = catRes.data.category._id;
        await fetchCategories(); 
      }

      await axios.post("/api/shopkeeper/products", {
        ...form,
        category:      categoryId,
        price:         parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
        stock:         parseInt(form.stock) || 0,
        image:         imageBase64,
      });

      setForm(EMPTY_FORM); setCustomLabel(""); setShowCustom(false);
      clearImage(); setShowForm(false);
      fetchProducts();
    } catch (e) {
      setError(e?.response?.data?.error || "Failed to save product.");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await axios.delete(`/api/shopkeeper/products?id=${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch { alert("Failed to delete product."); }
  };

  const resetForm = () => {
    setShowForm(false); setForm(EMPTY_FORM);
    setCustomLabel(""); setShowCustom(false);
    clearImage(); setError(null);
  };

  const handleCategorySelect = (value) => {
    if (value === "__new__") {
      setShowCustom(true); setForm((p) => ({ ...p, category: "" }));
    } else {
      setShowCustom(false); setCustomLabel("");
      setForm((p) => ({ ...p, category: value })); 
    }
  };

  const selectedCat = categories.find((c) => c._id === form.category);

  if (loading || !user) return <Loader />;

  const inputStyle = { width: "100%", padding: "10px 12px", fontSize: 13, border: "1px solid #e5e7eb", borderRadius: 8, fontFamily: "inherit", background: "#fafaf9" };
  const labelStyle = { fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 };

  return (
    <>
      <style>{css}</style>
      <ShopkeeperSidebar>
        <div style={{ padding: "48px 40px" }}>

          {/* Header */}
          <div className="fade-in" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
            <div>
              <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, color: "#0f172a", fontWeight: 400 }}>Products</h1>
              <p style={{ color: "#64748b", marginTop: 6, fontSize: 15 }}>Manage your product listings.</p>
            </div>
            <button
              onClick={() => { if (showForm) resetForm(); else setShowForm(true); }}
              style={{ background: showForm ? "#f1f5f9" : "#0f172a", color: showForm ? "#64748b" : "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
            >{showForm ? "Cancel" : "+ Add Product"}</button>
          </div>

          {/* Form */}
          {showForm && (
            <div className="fade-in" style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 28, marginBottom: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", marginBottom: 20 }}>New Product</div>

              {error && <div style={{ background: "#fef2f2", color: "#dc2626", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</div>}

              {/* Image upload */}
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Product Image</label>
                {imagePreview ? (
                  <div style={{ position: "relative", display: "inline-block" }}>
                    <img src={imagePreview} alt="preview" style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 10, border: "1px solid #e5e7eb" }} />
                    <button onClick={clearImage} style={{ position: "absolute", top: -8, right: -8, width: 24, height: 24, borderRadius: "50%", background: "#dc2626", color: "#fff", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>✕</button>
                  </div>
                ) : (
                  <div className="upload-area" onClick={() => fileRef.current?.click()} style={{ border: "2px dashed #e5e7eb", borderRadius: 10, padding: "28px 20px", textAlign: "center", cursor: "pointer", transition: "all 0.15s", background: "#fafaf9" }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>📷</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", marginBottom: 4 }}>Click to upload image</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>PNG, JPG, WEBP — max 2MB</div>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageChange} style={{ display: "none" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div><label style={labelStyle}>Product Name *</label><input className="input" placeholder="e.g. Hazelnut" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} style={inputStyle} /></div>
                <div><label style={labelStyle}>Price (Rs.) *</label><input className="input" type="number" placeholder="e.g. 300" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} style={inputStyle} /></div>
                <div><label style={labelStyle}>Original Price</label><input className="input" type="number" placeholder="e.g. 450" value={form.originalPrice} onChange={(e) => setForm((p) => ({ ...p, originalPrice: e.target.value }))} style={inputStyle} /></div>
                <div><label style={labelStyle}>Stock Qty</label><input className="input" type="number" placeholder="e.g. 20" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))} style={inputStyle} /></div>

                {/* ── Category dropdown ── */}
                <div>
                  <label style={labelStyle}>
                    Category
                    {catLoading && <span style={{ marginLeft: 6, fontSize: 10, color: "#94a3b8", fontWeight: 400 }}>loading…</span>}
                  </label>
                  {!showCustom ? (
                    <select className="input" value={form.category} onChange={(e) => handleCategorySelect(e.target.value)}
                      style={{ ...inputStyle, cursor: "pointer", color: form.category ? "#0f172a" : "#94a3b8" }}>
                      <option value="" disabled>Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                      <option value="__new__">+ Add new category…</option>
                    </select>
                  ) : (
                    <div style={{ display: "flex", gap: 6 }}>
                      <input className="input" placeholder="e.g. Spices" value={customLabel}
                        onChange={(e) => setCustomLabel(e.target.value)}
                        style={{ ...inputStyle, flex: 1 }} autoFocus
                      />
                      <button onClick={() => { setShowCustom(false); setCustomLabel(""); setForm((p) => ({ ...p, category: "" })); }}
                        style={{ padding: "0 10px", background: "#f1f5f9", border: "1px solid #e5e7eb", borderRadius: 8, cursor: "pointer", fontSize: 13, color: "#64748b" }} title="Back">↩</button>
                    </div>
                  )}
                  {selectedCat && !showCustom && (
                    <div style={{ marginTop: 6 }}>
                      <span style={{ background: "#f0fdf4", color: "#16a34a", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99 }}>
                        {selectedCat.icon} {selectedCat.label}
                      </span>
                    </div>
                  )}
                </div>

                <div><label style={labelStyle}>Weight</label><input className="input" placeholder="e.g. 0.5kg" value={form.weight} onChange={(e) => setForm((p) => ({ ...p, weight: e.target.value }))} style={inputStyle} /></div>
              </div>

              <div style={{ marginTop: 14 }}>
                <label style={labelStyle}>Description</label>
                <textarea className="input" placeholder="Describe your product..." value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
              </div>

              <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 10 }}>
                <input type="checkbox" id="isVeg" checked={form.isVegetarian} onChange={(e) => setForm((p) => ({ ...p, isVegetarian: e.target.checked }))} style={{ width: 16, height: 16, cursor: "pointer" }} />
                <label htmlFor="isVeg" style={{ fontSize: 13, color: "#0f172a", cursor: "pointer", fontWeight: 500 }}>Mark as Vegetarian</label>
              </div>

              <button onClick={handleSubmit} disabled={saving} style={{ marginTop: 20, background: "#0f172a", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", opacity: saving ? 0.6 : 1 }}>
                {saving ? "Saving…" : "Save Product"}
              </button>
            </div>
          )}

          {/* Table */}
          <div className="fade-in" style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            {fetching ? (
              <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Loading...</div>
            ) : products.length === 0 ? (
              <div style={{ padding: 60, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>No products yet. Click <strong>+ Add Product</strong> to get started.</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                    {["Image", "Product", "Category", "Price", "Stock", "Actions"].map((h) => (
                      <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => (
                    <tr key={p._id} className="row" style={{ borderBottom: i < products.length - 1 ? "1px solid #f8fafc" : "none", background: "#fff", transition: "background 0.15s" }}>
                      <td style={{ padding: "12px 20px" }}>
                        {p.image
                          ? <img src={p.image} alt={p.name} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8, border: "1px solid #e5e7eb" }} />
                          : <div style={{ width: 48, height: 48, borderRadius: 8, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📦</div>}
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: "#0f172a" }}>{p.name}</div>
                        {p.description && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{p.description.length > 50 ? p.description.slice(0, 50) + "…" : p.description}</div>}
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        {/* ✅ p.category is now a populated object */}
                        {p.category ? (
                          <span style={{ background: "#f0fdf4", color: "#16a34a", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99 }}>
                            {p.category?.icon} {p.category?.label || p.category?.name}
                          </span>
                        ) : <span style={{ color: "#94a3b8", fontSize: 13 }}>—</span>}
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>Rs. {p.price?.toLocaleString()}</div>
                        {p.originalPrice && <div style={{ fontSize: 11, color: "#94a3b8", textDecoration: "line-through" }}>Rs. {p.originalPrice?.toLocaleString()}</div>}
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <span style={{ background: p.stock > 0 ? "#ecfdf5" : "#fef2f2", color: p.stock > 0 ? "#059669" : "#dc2626", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 99 }}>
                          {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                        </span>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <button onClick={() => handleDelete(p._id)} style={{ background: "#fef2f2", color: "#dc2626", border: "none", borderRadius: 7, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </ShopkeeperSidebar>
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