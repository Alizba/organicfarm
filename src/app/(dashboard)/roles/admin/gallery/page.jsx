"use client";
import { useState, useEffect, useRef } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import axios from "axios";
import toast from "react-hot-toast";
import { Plus, Trash2, ImageIcon, X } from "lucide-react";

const CATEGORIES = ["general", "farm", "products", "events", "team"];

export default function AdminGalleryPage() {
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState({ title: "", description: "", category: "general", image: "" });
  const [saving,   setSaving]   = useState(false);
  const fileRef = useRef();

  const load = () => {
    setLoading(true);
    axios.get("/api/admin/gallery")
      .then((r) => setItems(r.data.items || []))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) { toast.error("Please select an image"); return; }
    setSaving(true);
    try {
      await axios.post("/api/admin/gallery", form);
      toast.success("Photo added!");
      setShowForm(false);
      setForm({ title: "", description: "", category: "general", image: "" });
      load();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to add photo");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this photo?")) return;
    try {
      await axios.delete(`/api/admin/gallery?id=${id}`);
      toast.success("Deleted");
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <AdminSidebar>
      <div style={{ padding: "28px 32px", fontFamily: "sans-serif" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a2e1a", margin: 0 }}>Gallery</h1>
            <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0" }}>{items.length} photos</p>
          </div>
          <button onClick={() => setShowForm(true)} style={{
            display: "flex", alignItems: "center", gap: 8, background: "#16a34a", color: "#fff",
            border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>
            <Plus size={16} /> Add Photo
          </button>
        </div>

        {/* Add form modal */}
        {showForm && (
          <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 480, padding: 28, boxShadow: "0 24px 80px rgba(0,0,0,0.2)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1a2e1a", margin: 0 }}>Add Photo</h3>
                <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={labelStyle}>Title *</label>
                  <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required style={inputStyle} placeholder="e.g. Morning Harvest" />
                </div>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} style={inputStyle}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Description</label>
                  <input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} style={inputStyle} placeholder="Optional caption" />
                </div>
                <div>
                  <label style={labelStyle}>Image *</label>
                  <div onClick={() => fileRef.current.click()} style={{ border: "2px dashed #e5e7eb", borderRadius: 12, padding: "20px", textAlign: "center", cursor: "pointer", background: "#fafaf9" }}>
                    {form.image ? (
                      <img src={form.image} alt="preview" style={{ maxHeight: 160, borderRadius: 8, objectFit: "cover" }} />
                    ) : (
                      <div style={{ color: "#9ca3af" }}>
                        <ImageIcon size={28} style={{ margin: "0 auto 8px" }} />
                        <p style={{ fontSize: 13, margin: 0 }}>Click to upload image</p>
                      </div>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
                </div>
                <button type="submit" disabled={saving} style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
                  {saving ? "Saving…" : "Add Photo"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16 }}>
            {[...Array(6)].map((_, i) => <div key={i} style={{ height: 180, borderRadius: 12, background: "#e5e7eb", animation: "pulse 1.5s infinite" }} />)}
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
            <ImageIcon size={40} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
            <p>No photos yet. Add your first one!</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16 }}>
            {items.map((item) => (
              <div key={item._id} style={{ borderRadius: 12, overflow: "hidden", background: "#fff", border: "1px solid #e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", position: "relative", group: true }}>
                <img src={item.image} alt={item.title} style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
                <div style={{ padding: "10px 12px" }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#1a2e1a", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</p>
                  <p style={{ fontSize: 11, color: "#9ca3af", margin: 0, textTransform: "capitalize" }}>{item.category}</p>
                </div>
                <button onClick={() => handleDelete(item._id)} style={{
                  position: "absolute", top: 8, right: 8, width: 30, height: 30, borderRadius: "50%",
                  background: "rgba(239,68,68,0.9)", border: "none", color: "#fff", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}><Trash2 size={13} /></button>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
    </AdminSidebar>
  );
}

const labelStyle = { display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280", marginBottom: 6 };
const inputStyle = { width: "100%", padding: "10px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, outline: "none", fontFamily: "sans-serif", boxSizing: "border-box", background: "#fafaf9" };