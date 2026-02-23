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
  .card:hover { box-shadow: 0 4px 24px rgba(0,0,0,0.09) !important; transform: translateY(-1px); transition: all 0.2s ease; }
  .nav-link:hover { color: #0f172a !important; }
  .btn-primary:hover { background: #1e293b !important; }
  .stat-card { animation: fadeUp 0.4s ease both; }
  .stat-card:nth-child(1) { animation-delay: 0.05s; }
  .stat-card:nth-child(2) { animation-delay: 0.1s; }
  .stat-card:nth-child(3) { animation-delay: 0.15s; }
  .stat-card:nth-child(4) { animation-delay: 0.2s; }
`;

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [recentRequests, setRecentRequests] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) router.replace("/login");
  }, [user, loading]);

  useEffect(() => {
    if (user?.role === "admin") fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      const [all, pending, approved, rejected] = await Promise.all([
        axios.get("/api/admin/shopRequests"),
        axios.get("/api/admin/shopRequests?status=pending"),
        axios.get("/api/admin/shopRequests?status=approved"),
        axios.get("/api/admin/shopRequests?status=rejected"),
      ]);
      setStats({
        total:    all.data.requests?.length || 0,
        pending:  pending.data.requests?.length || 0,
        approved: approved.data.requests?.length || 0,
        rejected: rejected.data.requests?.length || 0,
      });
      setRecentRequests(all.data.requests?.slice(0, 5) || []);
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  };

  if (loading || !user) return <Loader />;

  const statCards = [
    { label: "Total Requests", value: stats.total,    accent: "#0f172a" },
    { label: "Pending",        value: stats.pending,  accent: "#f59e0b" },
    { label: "Approved",       value: stats.approved, accent: "#10b981" },
    { label: "Rejected",       value: stats.rejected, accent: "#ef4444" },
  ];

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
            <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, color: "#0f172a" }}>
              Admin
            </span>
            <Link href="/dashboard/admin" className="nav-link" style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", textDecoration: "none" }}>Overview</Link>
            <Link href="/dashboard/admin/request" className="nav-link" style={{ fontSize: 13, color: "#64748b", textDecoration: "none" }}>Shop Requests</Link>
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
          <div className="fade-in" style={{ marginBottom: 40 }}>
           
            <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, color: "#0f172a", fontWeight: 400 }}>
              Good morning, {user.userName} 👋
            </h1>
            <p style={{ color: "#64748b", marginTop: 6, fontSize: 15 }}>
              Here's what's happening with your platform today.
            </p>
          </div>

          {/* Stat Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 40 }}>
            {statCards.map((s) => (
              <div key={s.label} className="stat-card card" style={{
                background: "#fff", border: "1px solid #e5e7eb",
                borderRadius: 12, padding: 24,
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                borderTop: `3px solid ${s.accent}`,
                cursor: "default",
              }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: s.accent, fontFamily: "'Instrument Serif', serif" }}>
                  {fetching ? "—" : s.value}
                </div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 4, fontWeight: 500 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Recent Requests */}
          <div className="fade-in" style={{
            background: "#fff", border: "1px solid #e5e7eb",
            borderRadius: 12, overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}>
            <div style={{
              padding: "20px 24px", borderBottom: "1px solid #f1f5f9",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>Recent Shop Requests</span>
              <Link href="/dashboard/admin/request" style={{
                fontSize: 13, color: "#3b82f6", textDecoration: "none", fontWeight: 600,
              }}>View all →</Link>
            </div>
            {fetching ? (
              <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>Loading...</div>
            ) : recentRequests.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>No requests yet</div>
            ) : (
              recentRequests.map((r, i) => (
                <div key={r._id} style={{
                  padding: "16px 24px",
                  borderBottom: i < recentRequests.length - 1 ? "1px solid #f8fafc" : "none",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "#0f172a" }}>{r.shopName}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                      {r.user?.userName} · {r.user?.email}
                    </div>
                  </div>
                  <StatusBadge status={r.status} />
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
    pending:  { bg: "#fff8e1", color: "#d97706", label: "Pending" },
    approved: { bg: "#ecfdf5", color: "#059669", label: "Approved" },
    rejected: { bg: "#fef2f2", color: "#dc2626", label: "Rejected" },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{
      background: s.bg, color: s.color, fontSize: 11,
      fontWeight: 700, padding: "4px 10px", borderRadius: 99,
      letterSpacing: 0.5,
    }}>{s.label}</span>
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