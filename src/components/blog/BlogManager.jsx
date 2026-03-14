"use client";
import { useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, Eye, EyeOff, X, ImageIcon, BookOpen } from "lucide-react";

export default function BlogManager({ apiBase, posts, setPosts, reload }) {
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [saving,   setSaving]   = useState(false);
  const fileRef = useRef();

  const empty = { title: "", content: "", coverImage: "", category: "", tags: "", published: false };
  const [form, setForm] = useState(empty);

  const openAdd  = () => { setForm(empty); setEditing(null); setShowForm(true); };
  const openEdit = (p) => {
    setForm({ title: p.title, content: p.content, coverImage: p.coverImage || "", category: p.category || "", tags: (p.tags || []).join(", "), published: p.published });
    setEditing(p._id);
    setShowForm(true);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, coverImage: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean) };
      if (editing) {
        await axios.patch(apiBase, { id: editing, ...payload });
        toast.success("Post updated!");
      } else {
        await axios.post(apiBase, payload);
        toast.success("Post created!");
      }
      setShowForm(false);
      reload();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this post?")) return;
    try {
      await axios.delete(`${apiBase}?id=${id}`);
      toast.success("Deleted");
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      toast.error("Failed to delete");
    }
  };

  const togglePublish = async (post) => {
    try {
      await axios.patch(apiBase, { id: post._id, published: !post.published });
      setPosts((prev) => prev.map((p) => p._id === post._id ? { ...p, published: !p.published } : p));
      toast.success(post.published ? "Unpublished" : "Published!");
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a2e1a", margin: 0 }}>Blog Posts</h1>
          <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0" }}>{posts.length} posts</p>
        </div>
        <button onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: 8, background: "#16a34a", color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          <Plus size={16} /> New Post
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 24px", overflowY: "auto" }}>
          <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 600, padding: 28, boxShadow: "0 24px 80px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1a2e1a", margin: 0 }}>{editing ? "Edit Post" : "New Post"}</h3>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={labelStyle}>Title *</label>
                <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required style={inputStyle} placeholder="Post title" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Category</label>
                  <input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} style={inputStyle} placeholder="e.g. farming" />
                </div>
                <div>
                  <label style={labelStyle}>Tags <span style={{ fontWeight: 400, textTransform: "none" }}>(comma separated)</span></label>
                  <input value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} style={inputStyle} placeholder="organic, tips, harvest" />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Cover Image</label>
                <div onClick={() => fileRef.current.click()} style={{ border: "2px dashed #e5e7eb", borderRadius: 12, padding: "16px", textAlign: "center", cursor: "pointer", background: "#fafaf9" }}>
                  {form.coverImage ? (
                    <img src={form.coverImage} alt="cover" style={{ maxHeight: 140, borderRadius: 8, objectFit: "cover" }} />
                  ) : (
                    <div style={{ color: "#9ca3af" }}>
                      <ImageIcon size={24} style={{ margin: "0 auto 6px" }} />
                      <p style={{ fontSize: 12, margin: 0 }}>Click to upload cover image</p>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
              </div>
              <div>
                <label style={labelStyle}>Content *</label>
                <textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} required rows={8} style={{ ...inputStyle, resize: "vertical" }} placeholder="Write your post content here..." />
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#374151" }}>
                <input type="checkbox" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} />
                Publish immediately
              </label>
              <button type="submit" disabled={saving} style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
                {saving ? "Saving…" : editing ? "Update Post" : "Create Post"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Posts list */}
      {posts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
          <BookOpen size={40} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
          <p>No posts yet. Create your first one!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {posts.map((post) => (
            <div key={post._id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "16px 20px", display: "flex", gap: 16, alignItems: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              {post.coverImage ? (
                <img src={post.coverImage} alt={post.title} style={{ width: 72, height: 56, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
              ) : (
                <div style={{ width: 72, height: 56, background: "#f0fdf4", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <BookOpen size={20} color="#86efac" />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#1a2e1a", margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{post.title}</p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {post.category && <span style={{ fontSize: 11, color: "#6b7280", background: "#f3f4f6", padding: "2px 8px", borderRadius: 10 }}>{post.category}</span>}
                  <span style={{ fontSize: 11, color: post.published ? "#16a34a" : "#f59e0b", background: post.published ? "#dcfce7" : "#fef3c7", padding: "2px 8px", borderRadius: 10, fontWeight: 600 }}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                  <span style={{ fontSize: 11, color: "#9ca3af" }}>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button onClick={() => togglePublish(post)} title={post.published ? "Unpublish" : "Publish"} style={iconBtn("#f3f4f6", "#374151")}>
                  {post.published ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button onClick={() => openEdit(post)} style={iconBtn("#dbeafe", "#2563eb")}><Pencil size={14} /></button>
                <button onClick={() => handleDelete(post._id)} style={iconBtn("#fee2e2", "#dc2626")}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

const labelStyle = { display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280", marginBottom: 6 };
const inputStyle = { width: "100%", padding: "10px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, outline: "none", fontFamily: "sans-serif", boxSizing: "border-box", background: "#fafaf9" };
const iconBtn = (bg, color) => ({ width: 30, height: 30, borderRadius: 8, background: bg, border: "none", color, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" });