"use client";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import axios from "axios";

export default function AdminPartnersPage() {
  const { user, loading } = useAuth();
  const router  = useRouter();
  const fileRef = useRef(null);
  const [partners, setPartners]         = useState([]);
  const [fetching, setFetching]         = useState(true);
  const [showForm, setShowForm]         = useState(false);
  const [saving, setSaving]             = useState(false);
  const [error, setError]               = useState(null);
  const [name, setName]                 = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile]       = useState(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) router.replace("/login");
  }, [user, loading]);

  useEffect(() => { if (user) fetchPartners(); }, [user]);

  const fetchPartners = async () => {
    try {
      const { data } = await axios.get("/api/admin/partners");
      setPartners(data.partners || []);
    } catch (e) { console.error(e); }
    finally { setFetching(false); }
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

  const handleSubmit = async () => {
    if (!name.trim() || !imageFile) return setError("Name and logo image are required.");
    setSaving(true); setError(null);
    try {
      const imageBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });
      await axios.post("/api/admin/partners", { name: name.trim(), image: imageBase64 });
      setName(""); setImageFile(null); setImagePreview(null);
      if (fileRef.current) fileRef.current.value = "";
      setShowForm(false); fetchPartners();
    } catch (e) { setError(e?.response?.data?.error || "Failed to save partner."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this partner?")) return;
    try {
      await axios.delete(`/api/admin/partners?id=${id}`);
      setPartners((prev) => prev.filter((p) => p._id !== id));
    } catch { alert("Failed to delete."); }
  };

  if (loading || !user) return null;

  const inp = { width: "100%", padding: "10px 12px", fontSize: 13, border: "1px solid #e5e7eb", borderRadius: 8, outline: "none", boxSizing: "border-box" };
  const lbl = { fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: 6 };

  return (
    <AdminSidebar>
      <div style={{ padding: "48px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, color: "#0f172a", fontWeight: 400 }}>Partners</h1>
            <p style={{ color: "#64748b", marginTop: 6, fontSize: 15 }}>Manage farm partners shown on the home page.</p>
          </div>
          <button onClick={() => setShowForm((v) => !v)}
            style={{ background: showForm ? "#f1f5f9" : "#0f172a", color: showForm ? "#64748b" : "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            {showForm ? "Cancel" : "+ Add Partner"}
          </button>
        </div>

        {showForm && (
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a", marginBottom: 16 }}>New Partner</div>
            {error && <div style={{ background: "#fef2f2", color: "#dc2626", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 14 }}>{error}</div>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
              <div>
                <label style={lbl}>Partner Name *</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. FarmFresh Co." style={inp} />
              </div>
              <div>
                <label style={lbl}>Logo Image *</label>
                {imagePreview ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <img src={imagePreview} alt="preview" style={{ width: 80, height: 48, objectFit: "contain", border: "1px solid #e5e7eb", borderRadius: 8, background: "#f8fafc", padding: 4 }} />
                    <button onClick={() => { setImageFile(null); setImagePreview(null); if (fileRef.current) fileRef.current.value = ""; }} style={{ fontSize: 12, color: "#dc2626", cursor: "pointer", background: "none", border: "none" }}>Remove</button>
                  </div>
                ) : (
                  <div onClick={() => fileRef.current?.click()} style={{ border: "2px dashed #e5e7eb", borderRadius: 8, padding: "16px", textAlign: "center", cursor: "pointer", background: "#fafaf9" }}>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>🖼</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>Click to upload logo</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>PNG, JPG, SVG — max 2MB</div>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
              </div>
            </div>
            <button onClick={handleSubmit} disabled={saving} style={{ marginTop: 18, background: "#0f172a", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
              {saving ? "Saving…" : "Save Partner"}
            </button>
          </div>
        )}

        {fetching ? (
          <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>Loading...</div>
        ) : partners.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, color: "#94a3b8", background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb" }}>No partners yet. Click <strong>+ Add Partner</strong> to get started.</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
            {partners.map((p) => (
              <div key={p._id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <img src={p.image} alt={p.name} style={{ width: 100, height: 56, objectFit: "contain" }} />
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", textAlign: "center" }}>{p.name}</div>
                <button onClick={() => handleDelete(p._id)} style={{ background: "#fef2f2", color: "#dc2626", border: "none", borderRadius: 7, padding: "5px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminSidebar>
  );
}