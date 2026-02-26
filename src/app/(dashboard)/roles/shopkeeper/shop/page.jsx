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
  .input:focus { outline: none; border-color: #0f172a !important; }
  .save-btn:hover { background: #1e293b !important; }
`;

export default function ShopkeeperShopPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [shop, setShop]       = useState(null);
  const [fetching, setFetching] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState(null);
  const [form, setForm]       = useState({ shopName: "", shopDescription: "", phone: "" });

  useEffect(() => {
    if (!loading && (!user || !["shopkeeper", "admin"].includes(user.role))) {
      router.replace("/login");
    }
  }, [user, loading]);

  useEffect(() => {
    if (user) fetchShop();
  }, [user]);

  const fetchShop = async () => {
    try {
      const { data } = await axios.get("/api/shopkeeper/shop");
      setShop(data.shop);
      setForm({
        shopName:        data.shop?.shopName        || "",
        shopDescription: data.shop?.shopDescription || "",
        phone:           data.shop?.phone           || "",
      });
    } catch (e) {
      console.error(e);
      setError("Failed to load shop info.");
    } finally {
      setFetching(false);
    }
  };

  const handleSave = async () => {
    if (!form.shopName) return setError("Shop name is required.");
    setSaving(true);
    setError(null);
    try {
      const { data } = await axios.patch("/api/shopkeeper/shop", form);
      setShop(data.shop);
      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      setError(e?.response?.data?.error || "Failed to save.");
    } finally {
      setSaving(false);
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
            <Link href="/roles/shopkeeper/shop" className="nav-link" style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", textDecoration: "none" }}>My Shop</Link>
            <Link href="/roles/shopkeeper/products" className="nav-link" style={{ fontSize: 13, fontWeight: 500, color: "#64748b", textDecoration: "none" }}>Products</Link>
            <Link href="/roles/shopkeeper/analytics" className="nav-link" style={{ fontSize: 13, fontWeight: 500, color: "#64748b", textDecoration: "none" }}>Analytics</Link>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 13, color: "#64748b" }}>{user.userName}</span>
            <button onClick={logout} className="btn-primary" style={{
              background: "#0f172a", color: "#fff", border: "none",
              borderRadius: 8, padding: "7px 16px", fontSize: 12,
              fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>Logout</button>
          </div>
        </nav>

        <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 40px" }}>

          {/* Header */}
          <div className="fade-in" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 36 }}>
            <div>
              <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, color: "#0f172a", fontWeight: 400 }}>My Shop</h1>
              <p style={{ color: "#64748b", marginTop: 6, fontSize: 15 }}>View and update your shop profile.</p>
            </div>
            {!editing && !fetching && (
              <button
                onClick={() => { setEditing(true); setSuccess(false); }}
                style={{
                  background: "#0f172a", color: "#fff", border: "none",
                  borderRadius: 8, padding: "10px 20px", fontSize: 13,
                  fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                }}
              >Edit Shop</button>
            )}
          </div>

          {/* Success banner */}
          {success && (
            <div className="fade-in" style={{
              background: "#f0fdf4", border: "1px solid #bbf7d0",
              borderRadius: 10, padding: "12px 16px", marginBottom: 20,
              display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#065f46",
            }}>
              <span>✓</span> Shop updated successfully!
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              background: "#fef2f2", color: "#dc2626",
              padding: "12px 16px", borderRadius: 10, marginBottom: 20, fontSize: 14,
            }}>{error}</div>
          )}

          {fetching ? (
            <div style={{ padding: 60, textAlign: "center", color: "#94a3b8" }}>Loading...</div>
          ) : (
            <div className="fade-in" style={{
              background: "#fff", border: "1px solid #e5e7eb",
              borderRadius: 16, overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}>

              {/* Shop Avatar / Banner */}
              <div style={{
                height: 100, background: "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: "#fff", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 28, border: "3px solid rgba(255,255,255,0.3)",
                }}>🏪</div>
              </div>

              <div style={{ padding: 32 }}>

                {editing ? (
                  /* ── Edit Form ── */
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {[
                      { key: "shopName",        label: "Shop Name *",   placeholder: "Your shop name" },
                      { key: "phone",           label: "Phone",          placeholder: "Contact number" },
                    ].map((f) => (
                      <div key={f.key}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>
                          {f.label}
                        </label>
                        <input
                          className="input"
                          value={form[f.key]}
                          onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                          placeholder={f.placeholder}
                          style={{
                            width: "100%", padding: "10px 12px", fontSize: 14,
                            border: "1px solid #e5e7eb", borderRadius: 8,
                            fontFamily: "inherit", background: "#fafaf9",
                            transition: "border-color 0.15s",
                          }}
                        />
                      </div>
                    ))}
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>
                        Shop Description
                      </label>
                      <textarea
                        className="input"
                        value={form.shopDescription}
                        onChange={(e) => setForm((prev) => ({ ...prev, shopDescription: e.target.value }))}
                        placeholder="Tell customers about your shop..."
                        rows={4}
                        style={{
                          width: "100%", padding: "10px 12px", fontSize: 14,
                          border: "1px solid #e5e7eb", borderRadius: 8,
                          fontFamily: "inherit", background: "#fafaf9", resize: "vertical",
                        }}
                      />
                    </div>

                    <div style={{ display: "flex", gap: 10 }}>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="save-btn"
                        style={{
                          background: "#0f172a", color: "#fff", border: "none",
                          borderRadius: 8, padding: "10px 24px", fontSize: 13,
                          fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                          opacity: saving ? 0.6 : 1, transition: "background 0.15s",
                        }}
                      >{saving ? "Saving…" : "Save Changes"}</button>
                      <button
                        onClick={() => { setEditing(false); setError(null); }}
                        style={{
                          background: "#f1f5f9", color: "#64748b", border: "none",
                          borderRadius: 8, padding: "10px 20px", fontSize: 13,
                          fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                        }}
                      >Cancel</button>
                    </div>
                  </div>

                ) : (
                  /* ── View Mode ── */
                  <div>
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 26, color: "#0f172a", fontWeight: 400 }}>
                        {shop?.shopName || "—"}
                      </div>
                      <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>@{user.userName}</div>
                    </div>

                    {[
                      { label: "Description", value: shop?.shopDescription || "No description added yet." },
                      { label: "Email",       value: shop?.email || user.email || "—" },
                      { label: "Phone",       value: shop?.phone || "—" },
                      { label: "Status",      value: shop?.status || "approved" },
                      { label: "Member Since", value: shop?.createdAt ? new Date(shop.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" }) : "—" },
                    ].map((row) => (
                      <div key={row.label} style={{
                        padding: "14px 0",
                        borderBottom: "1px solid #f8fafc",
                        display: "flex", gap: 16,
                      }}>
                        <div style={{ width: 130, fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, paddingTop: 2, flexShrink: 0 }}>
                          {row.label}
                        </div>
                        <div style={{ fontSize: 14, color: "#0f172a", lineHeight: 1.6, flex: 1 }}>
                          {row.label === "Status" ? (
                            <span style={{
                              background: "#ecfdf5", color: "#059669",
                              fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99,
                              textTransform: "capitalize",
                            }}>{row.value}</span>
                          ) : row.value}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
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