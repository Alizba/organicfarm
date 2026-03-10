"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import axios from "axios";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  * { box-sizing: border-box; }
  body { font-family: 'DM Sans', sans-serif; }
  .fade-in { animation: fadeUp 0.4s ease both; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  .stat-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important; transform: translateY(-1px); }
`;

const STATUS_COLORS = {
  pending:  { bg: "#fef9c3", color: "#92400e" },
  approved: { bg: "#ecfdf5", color: "#059669" },
  rejected: { bg: "#fef2f2", color: "#dc2626" },
};

export default function AdminOverviewPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) router.replace("/login");
  }, [user, loading]);

  useEffect(() => {
    if (user) {
      axios.get("/api/admin/shop-requests").then(({ data }) => {
        setRequests(data.requests || []);
      }).catch(console.error).finally(() => setFetching(false));
    }
  }, [user]);

  if (loading || !user) return <Loader />;

  const pending  = requests.filter((r) => r.status === "pending").length;
  const approved = requests.filter((r) => r.status === "approved").length;
  const rejected = requests.filter((r) => r.status === "rejected").length;

  const STATS = [
    { label: "Pending Requests",  value: pending,            color: "#f59e0b", bg: "#fffbeb" },
    { label: "Approved Shops",    value: approved,           color: "#10b981", bg: "#ecfdf5" },
    { label: "Rejected",          value: rejected,           color: "#ef4444", bg: "#fef2f2" },
    { label: "Total Applications",value: requests.length,    color: "#6366f1", bg: "#eef2ff" },
  ];

  return (
    <>
      <style>{css}</style>
      <AdminSidebar>
        <div style={{ padding: "48px 40px" }}>

          <div className="fade-in" style={{ marginBottom: 36 }}>
            <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, color: "#0f172a", fontWeight: 400 }}>
              Overview
            </h1>
            <p style={{ color: "#64748b", marginTop: 6, fontSize: 15 }}>
              Welcome back, {user.userName}. Here's what's happening.
            </p>
          </div>

          {/* Stat cards */}
          <div className="fade-in" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 40 }}>
            {STATS.map((s) => (
              <div key={s.label} className="stat-card" style={{
                background: s.bg, border: `1px solid ${s.color}22`,
                borderRadius: 14, padding: "24px 20px",
                transition: "all 0.2s", cursor: "default",
              }}>
                <div style={{ fontSize: 32, fontWeight: 700, color: s.color }}>{fetching ? "—" : s.value}</div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Recent requests */}
          <div className="fade-in">
            <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", marginBottom: 16 }}>Recent Applications</div>
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
              {fetching ? (
                <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Loading...</div>
              ) : requests.slice(0, 5).map((req, i) => {
                const s = STATUS_COLORS[req.status] || STATUS_COLORS.pending;
                return (
                  <div key={req._id} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "14px 20px",
                    borderBottom: i < Math.min(requests.length, 5) - 1 ? "1px solid #f1f5f9" : "none",
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "#0f172a" }}>{req.shopName}</div>
                      <div style={{ fontSize: 12, color: "#94a3b8" }}>{req.fullName} · {new Date(req.createdAt).toLocaleDateString()}</div>
                    </div>
                    <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, textTransform: "capitalize" }}>{req.status}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </AdminSidebar>
    </>
  );
}

function Loader() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, border: "3px solid #e2e8f0", borderTopColor: "#0f172a", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}