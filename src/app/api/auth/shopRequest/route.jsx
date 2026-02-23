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
  .row-item { transition: background 0.15s; }
  .row-item:hover { background: #f8fafc !important; }
  .btn-approve:hover { background: #059669 !important; }
  .btn-reject:hover { background: #dc2626 !important; }
  .nav-link:hover { color: #0f172a !important; }
  .btn-primary:hover { background: #1e293b !important; }
  .filter-btn:hover { border-color: #0f172a !important; color: #0f172a !important; }
`;

const FILTERS = ["all", "pending", "approved", "rejected"];

export default function AdminShopRequests() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [requests, setRequests]   = useState([]);
  const [filter, setFilter]       = useState("pending");
  const [fetching, setFetching]   = useState(true);
  const [actionId, setActionId]   = useState(null);
  const [toast, setToast]         = useState(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) router.replace("/login");
  }, [user, loading]);

  useEffect(() => {
    if (user?.role === "admin") fetchRequests();
  }, [user, filter]);

  const fetchRequests = async () => {
    setFetching(true);
    try {
      const url = filter === "all"
        ? "/api/admin/shopRequests"
        : `/api/admin/shopRequests?status=${filter}`;
      const { data } = await axios.get(url);
      setRequests(data.requests || []);
    } catch (e) {
      showToast("Failed to fetch requests", "error");
    } finally {
      setFetching(false);
    }
  };

  const handleAction = async (requestId, action) => {
    setActionId(requestId);
    try {
      const { data } = await axios.patch("/api/admin/shopRequests", { requestId, action });
      showToast(
        action === "approve"
          ? "✓ Approved — user is now a shopkeeper"
          : "Request rejected",
        action === "approve" ? "success" : "error"
      );
      fetchRequests();
    } catch (e) {
      showToast(e.response?.data?.error || "Action failed", "error");
    } finally {
      setActionId(null);
    }
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  if (loading || !user) return <Loader />;

  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: "100vh", background: "#fafaf9" }}>

        {/* Toast */}
        {toast && (
          <div style={{
            position: "fixed", top: 20, right: 20, zIndex: 999,
            background: toast.type === "success" ? "#0f172a" : "#ef4444",
            color: "#fff", padding: "12px 20px", borderRadius: 10,
            fontSize: 13, fontWeight: 600, boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            animation: "fadeUp 0.3s ease",
          }}>{toast.msg}</div>
        )}

        {/* Nav */}
        <nav style={{
          background: "#fff", borderBottom: "1px solid #e5e7eb",
          padding: "0 40px", height: 60,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, zIndex: 50,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, color: "#0f172a" }}>Admin</span>
            <Link href="/dashboard/admin" className="nav-link" style={{ fontSize: 13, color: "#64748b", textDecoration: "none", fontWeight: 500 }}>Overview</Link>
            <Link href="/dashboard/admin/request" className="nav-link" style={{ fontSize: 13, color: "#0f172a", textDecoration: "none", fontWeight: 600 }}>Shop Requests</Link>
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
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: "#94a3b8", textTransform: "uppercase", marginBottom: 8 }}>
              Admin · Shop Requests
            </p>
            <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 34, color: "#0f172a", fontWeight: 400 }}>
              Shop Applications
            </h1>
            <p style={{ color: "#64748b", marginTop: 6, fontSize: 14 }}>
              Review and manage user requests to become shopkeepers.
            </p>
          </div>

          {/* Filters */}
          <div className="fade-in" style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            {FILTERS.map(f => (
              <button key={f} className="filter-btn" onClick={() => setFilter(f)} style={{
                padding: "7px 18px", borderRadius: 99, fontSize: 12, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                textTransform: "capitalize", letterSpacing: 0.3,
                background: filter === f ? "#0f172a" : "#fff",
                color: filter === f ? "#fff" : "#64748b",
                border: filter === f ? "1px solid #0f172a" : "1px solid #e2e8f0",
              }}>{f}</button>
            ))}
          </div>

          {/* Table */}
          <div className="fade-in" style={{
            background: "#fff", border: "1px solid #e5e7eb",
            borderRadius: 12, overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}>
            {/* Table Header */}
            <div style={{
              display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 160px",
              padding: "12px 24px", background: "#f8fafc",
              borderBottom: "1px solid #e5e7eb",
            }}>
              {["Shop Name", "Applicant", "Date", "Status", "Actions"].map(h => (
                <span key={h} style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: 1, textTransform: "uppercase" }}>{h}</span>
              ))}
            </div>

            {fetching ? (
              <div style={{ padding: 60, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>Loading...</div>
            ) : requests.length === 0 ? (
              <div style={{ padding: 60, textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
                <div style={{ color: "#94a3b8", fontSize: 14 }}>No {filter} requests</div>
              </div>
            ) : (
              requests.map((r, i) => (
                <div key={r._id} className="row-item" style={{
                  display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 160px",
                  padding: "16px 24px", alignItems: "center",
                  borderBottom: i < requests.length - 1 ? "1px solid #f1f5f9" : "none",
                  background: "#fff",
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "#0f172a" }}>{r.shopName}</div>
                    {r.shopDescription && (
                      <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {r.shopDescription}
                      </div>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#0f172a" }}>{r.user?.userName}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>{r.user?.email}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>
                    {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                  <StatusBadge status={r.status} />
                  <div style={{ display: "flex", gap: 8 }}>
                    {r.status === "pending" && (
                      <>
                        <button
                          className="btn-approve"
                          disabled={actionId === r._id}
                          onClick={() => handleAction(r._id, "approve")}
                          style={{
                            background: "#10b981", color: "#fff", border: "none",
                            borderRadius: 7, padding: "6px 14px", fontSize: 12,
                            fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                            transition: "background 0.15s",
                          }}>
                          {actionId === r._id ? "..." : "Approve"}
                        </button>
                        <button
                          className="btn-reject"
                          disabled={actionId === r._id}
                          onClick={() => handleAction(r._id, "reject")}
                          style={{
                            background: "#fff", color: "#ef4444",
                            border: "1px solid #fca5a5",
                            borderRadius: 7, padding: "6px 14px", fontSize: 12,
                            fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                            transition: "all 0.15s",
                          }}>
                          Reject
                        </button>
                      </>
                    )}
                    {r.status !== "pending" && (
                      <span style={{ fontSize: 12, color: "#cbd5e1", fontStyle: "italic" }}>Processed</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending:  { bg: "#fff8e1", color: "#d97706" },
    approved: { bg: "#ecfdf5", color: "#059669" },
    rejected: { bg: "#fef2f2", color: "#dc2626" },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{
      background: s.bg, color: s.color, fontSize: 11,
      fontWeight: 700, padding: "4px 10px", borderRadius: 99,
      letterSpacing: 0.5, textTransform: "capitalize", width: "fit-content",
    }}>{status}</span>
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