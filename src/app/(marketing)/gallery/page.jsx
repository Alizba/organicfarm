"use client";
import { useEffect, useState } from "react";
import { ImageIcon, X } from "lucide-react";

const CATEGORIES = ["all", "general", "farm", "products", "events", "team"];

export default function GalleryPage() {
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState("all");
  const [lightbox, setLightbox] = useState(null); 

  useEffect(() => {
    fetch("/api/public/gallery")
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? items : items.filter((i) => i.category === filter);

  return (
    <div style={{ minHeight: "100vh", background: "#f7f9f4", fontFamily: "sans-serif" }}>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#1a3820 0%,#2d5a1e 60%,#3a7a28 100%)", padding: "60px 24px 52px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <span style={{ width: 32, height: 1, background: "#86efac" }} />
          <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.4em", color: "#86efac", fontWeight: 600 }}>Our Farm</span>
          <span style={{ width: 32, height: 1, background: "#86efac" }} />
        </div>
        <h1 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 700, color: "#fff", margin: "0 0 12px", fontFamily: "Georgia, serif" }}>
          Photo <em style={{ color: "#86efac" }}>Gallery</em>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, maxWidth: 420, margin: "0 auto", lineHeight: 1.7 }}>
          A window into life on the farm — from harvest to delivery.
        </p>
      </div>

      {/* Filter tabs */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 4, overflowX: "auto", paddingBottom: 0 }}>
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setFilter(c)} style={{
              padding: "14px 18px", fontSize: 13, fontWeight: 600, border: "none",
              borderBottom: filter === c ? "2px solid #16a34a" : "2px solid transparent",
              color: filter === c ? "#16a34a" : "#6b7280", background: "none",
              cursor: "pointer", textTransform: "capitalize", whiteSpace: "nowrap", transition: "all 0.15s",
            }}>{c}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ borderRadius: 16, background: "#e5e7eb", height: 220, animation: "pulse 1.5s infinite" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#9ca3af" }}>
            <ImageIcon size={48} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
            <p style={{ fontSize: 16 }}>No photos in this category yet.</p>
          </div>
        ) : (
          <div style={{ columns: "3 260px", gap: 16 }}>
            {filtered.map((item) => (
              <div key={item._id} onClick={() => setLightbox(item)} style={{
                breakInside: "avoid", marginBottom: 16, borderRadius: 16,
                overflow: "hidden", cursor: "pointer", position: "relative",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)", transition: "transform 0.2s, box-shadow 0.2s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"; }}
              >
                <img src={item.image} alt={item.title} style={{ width: "100%", display: "block", objectFit: "cover" }} />
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
                  padding: "32px 14px 14px",
                }}>
                  <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, margin: 0 }}>{item.title}</p>
                  {item.description && <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, margin: "3px 0 0" }}>{item.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{
          position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.85)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 800, width: "100%", background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.4)" }}>
            <div style={{ position: "relative" }}>
              <img src={lightbox.image} alt={lightbox.title} style={{ width: "100%", maxHeight: 500, objectFit: "cover", display: "block" }} />
              <button onClick={() => setLightbox(null)} style={{
                position: "absolute", top: 12, right: 12, width: 36, height: 36,
                borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "none",
                color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}><X size={18} /></button>
              <span style={{
                position: "absolute", top: 12, left: 12, background: "#16a34a",
                color: "#fff", fontSize: 11, fontWeight: 600, padding: "4px 10px",
                borderRadius: 20, textTransform: "capitalize",
              }}>{lightbox.category}</span>
            </div>
            <div style={{ padding: "18px 20px" }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1a2e1a", margin: "0 0 6px" }}>{lightbox.title}</h3>
              {lightbox.description && <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{lightbox.description}</p>}
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
}