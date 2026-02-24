// src/app/(dashboard)/roles/admin/interests/page.jsx
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
  .row:hover { background: #f8fafc; }
  .nav-link:hover { color: #0f172a !important; }
  .btn-primary:hover { background: #1e293b !important; }
`;

const STATUS_MAP = {
  new:       { bg: "#eff6ff", color: "#3b82f6",  label: "New"       },
  contacted: { bg: "#fff8e1", color: "#d97706",  label: "Contacted" },
  approved:  { bg: "#ecfdf5", color: "#059669",  label: "Approved"  },
  rejected:  { bg: "#fef2f2", color: "#dc2626",  label: "Rejected"  },
};

export default function AdminInterestsPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [interests, setInterests] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [selected, setSelected] = useState(null); // detail modal
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) router.replace("/login");
  }, [user, loading]);

  useEffect(() => {
    if (user?.role === "admin") fetchInterests();
  }, [user]);

  const fetchInterests = async () => {
    try {
      const { data } = await axios.get("/api/shop-interest");
      setInterests(data.interests || []);
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  };

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await axios.patch("/api/shop-interest", { id, status });
      setInterests((prev) =>
        prev.map((i) => (i._id === id ? { ...i, status } : i))
      );
      if (selected?._id === id) setSelected((prev) => ({ ...prev, status }));
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading || !user) return <Loader />;

  const counts = {
    all:       interests.length,
    new:       interests.filter((i) => i.status === "new").length,
    contacted: interests.filter((i) => i.status === "contacted").length,
    approved:  interests.filter((i) => i.status === "approved").length,
    rejected:  interests.filter((i) => i.status === "rejected").length,
  };

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
            <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, color: "#0f172a" }}>Admin</span>
            <Link href="/roles/admin" className="nav-link" style={{ fontSize: 13, color: "#64748b", textDecoration: "none" }}>Overview</Link>
            <Link href="/roles/admin/request" className="nav-link" style={{ fontSize: 13, color: "#64748b", textDecoration: "none" }}>Shop Requests</Link>
            <Link href="/roles/admin/interests" className="nav-link" style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", textDecoration: "none" }}>Sell Interests</Link>
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

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 40px" }}>

          {/* Header */}
          <div className="fade-in" style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, color: "#0f172a", fontWeight: 400 }}>
              Seller Interest Requests
            </h1>
            <p style={{ color: "#64748b", marginTop: 6, fontSize: 15 }}>
              People who submitted interest via the "Want to Sell?" form.
            </p>
          </div>

          {/* Stat pills */}
          <div className="fade-in" style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
            {Object.entries(counts).map(([key, val]) => (
              <div key={key} style={{
                background: "#fff", border: "1px solid #e5e7eb",
                borderRadius: 99, padding: "6px 16px", fontSize: 13,
                color: "#64748b", fontWeight: 500,
              }}>
                <span style={{ textTransform: "capitalize" }}>{key}</span>
                <span style={{ marginLeft: 8, background: "#f1f5f9", borderRadius: 99, padding: "1px 8px", fontSize: 12, fontWeight: 700, color: "#0f172a" }}>
                  {val}
                </span>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="fade-in" style={{
            background: "#fff", border: "1px solid #e5e7eb",
            borderRadius: 12, overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}>
            {fetching ? (
              <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Loading...</div>
            ) : interests.length === 0 ? (
              <div style={{ padding: 60, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
                No interest requests yet.
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                    {["Name", "Email", "Shop Name", "Submitted", "Status", "Actions"].map((h) => (
                      <th key={h} style={{
                        padding: "12px 20px", textAlign: "left",
                        fontSize: 11, fontWeight: 700, color: "#94a3b8",
                        textTransform: "uppercase", letterSpacing: 0.5,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {interests.map((item, i) => {
                    const s = STATUS_MAP[item.status] || STATUS_MAP.new;
                    return (
                      <tr key={item._id} className="row" style={{
                        borderBottom: i < interests.length - 1 ? "1px solid #f8fafc" : "none",
                        transition: "background 0.15s",
                      }}>
                        <td style={{ padding: "14px 20px", fontSize: 14, fontWeight: 600, color: "#0f172a" }}>
                          {item.fullName}
                        </td>
                        <td style={{ padding: "14px 20px", fontSize: 13, color: "#64748b" }}>
                          {item.email}
                        </td>
                        <td style={{ padding: "14px 20px", fontSize: 13, color: "#0f172a", fontWeight: 500 }}>
                          {item.shopName}
                        </td>
                        <td style={{ padding: "14px 20px", fontSize: 12, color: "#94a3b8" }}>
                          {new Date(item.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td style={{ padding: "14px 20px" }}>
                          <span style={{
                            background: s.bg, color: s.color,
                            fontSize: 11, fontWeight: 700,
                            padding: "4px 10px", borderRadius: 99,
                          }}>{s.label}</span>
                        </td>
                        <td style={{ padding: "14px 20px" }}>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button
                              onClick={() => setSelected(item)}
                              style={{
                                background: "#f1f5f9", color: "#0f172a",
                                border: "none", borderRadius: 7,
                                padding: "6px 12px", fontSize: 12,
                                fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                              }}
                            >
                              View
                            </button>
                            {item.status === "new" && (
                              <button
                                onClick={() => updateStatus(item._id, "contacted")}
                                disabled={updatingId === item._id}
                                style={{
                                  background: "#fff8e1", color: "#d97706",
                                  border: "none", borderRadius: 7,
                                  padding: "6px 12px", fontSize: 12,
                                  fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                                  opacity: updatingId === item._id ? 0.6 : 1,
                                }}
                              >
                                Mark Contacted
                              </button>
                            )}
                            {["new", "contacted"].includes(item.status) && (
                              <>
                                <button
                                  onClick={() => updateStatus(item._id, "approved")}
                                  disabled={updatingId === item._id}
                                  style={{
                                    background: "#ecfdf5", color: "#059669",
                                    border: "none", borderRadius: 7,
                                    padding: "6px 12px", fontSize: 12,
                                    fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                                    opacity: updatingId === item._id ? 0.6 : 1,
                                  }}
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => updateStatus(item._id, "rejected")}
                                  disabled={updatingId === item._id}
                                  style={{
                                    background: "#fef2f2", color: "#dc2626",
                                    border: "none", borderRadius: 7,
                                    padding: "6px 12px", fontSize: 12,
                                    fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                                    opacity: updatingId === item._id ? 0.6 : 1,
                                  }}
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
            zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
          }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{
              background: "#fff", borderRadius: 16, padding: 32,
              maxWidth: 480, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>{selected.shopName}</div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>by {selected.fullName}</div>
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{ background: "#f1f5f9", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 14 }}
              >✕</button>
            </div>

            {[
              { label: "Email",       value: selected.email },
              { label: "Phone",       value: selected.phone || "—" },
              { label: "Description", value: selected.shopDescription || "—" },
              { label: "Submitted",   value: new Date(selected.createdAt).toLocaleString() },
              { label: "Status",      value: selected.status },
            ].map((row) => (
              <div key={row.label} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>
                  {row.label}
                </div>
                <div style={{ fontSize: 14, color: "#0f172a", lineHeight: 1.6 }}>{row.value}</div>
              </div>
            ))}

            {/* Quick actions inside modal */}
            {["new", "contacted"].includes(selected.status) && (
              <div style={{ display: "flex", gap: 8, marginTop: 20, borderTop: "1px solid #f1f5f9", paddingTop: 20 }}>
                {selected.status === "new" && (
                  <button onClick={() => updateStatus(selected._id, "contacted")} style={{ flex: 1, background: "#fff8e1", color: "#d97706", border: "none", borderRadius: 8, padding: "10px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    Mark Contacted
                  </button>
                )}
                <button onClick={() => updateStatus(selected._id, "approved")} style={{ flex: 1, background: "#ecfdf5", color: "#059669", border: "none", borderRadius: 8, padding: "10px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  Approve
                </button>
                <button onClick={() => updateStatus(selected._id, "rejected")} style={{ flex: 1, background: "#fef2f2", color: "#dc2626", border: "none", borderRadius: 8, padding: "10px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}
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