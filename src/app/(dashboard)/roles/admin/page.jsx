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
  .card { transition: all 0.2s ease; }
  .card:hover { box-shadow: 0 4px 24px rgba(0,0,0,0.09) !important; transform: translateY(-1px); }
  .nav-link:hover { color: #0f172a !important; }
  .btn-primary:hover { background: #1e293b !important; }
  .stat-card { animation: fadeUp 0.4s ease both; }
  .stat-card:nth-child(1) { animation-delay: 0.05s; }
  .stat-card:nth-child(2) { animation-delay: 0.10s; }
  .stat-card:nth-child(3) { animation-delay: 0.15s; }
  .stat-card:nth-child(4) { animation-delay: 0.20s; }
  .stat-card:nth-child(5) { animation-delay: 0.25s; }
  .row:hover { background: #f8fafc !important; }
`;

const NAV = [
  { label: "Overview",      href: "/roles/admin",           active: true  },
  { label: "Sell Interests", href: "/roles/admin/interests", active: false },
  { label: "Orders",        href: "/roles/admin/orders",     active: false },
];

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [stats, setStats]                   = useState({ interests: 0, newInterests: 0, orders: 0, pendingOrders: 0, revenue: 0 });
  const [recentInterests, setRecentInterests] = useState([]);
  const [recentOrders, setRecentOrders]       = useState([]);
  const [fetching, setFetching]               = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) router.replace("/login");
  }, [user, loading]);

  useEffect(() => {
    if (user?.role === "admin") fetchAll();
  }, [user]);

  const fetchAll = async () => {
    try {
      const [interests, orders] = await Promise.all([
        axios.get("/api/admin/users"),
        axios.get("/api/checkout"),
      ]);

      const interestList = interests.data.interests || [];
      const orderList    = orders.data.orders || [];

      const revenue = orderList
        .filter((o) => o.status !== "cancelled")
        .reduce((sum, o) => sum + (o.total || 0), 0);

      setStats({
        interests:    interestList.length,
        newInterests: interestList.filter((i) => i.status === "new").length,
        orders:       orderList.length,
        pendingOrders: orderList.filter((o) => o.status === "pending").length,
        revenue,
      });

      setRecentInterests(interestList.slice(0, 5));
      setRecentOrders(orderList.slice(0, 5));
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  };

  if (loading || !user) return <Loader />;

  const statCards = [
    { label: "Sell Interests",  value: stats.interests,     accent: "#6366f1", icon: "🏪" },
    { label: "New Interests",   value: stats.newInterests,  accent: "#f59e0b", icon: "✨" },
    { label: "Total Orders",    value: stats.orders,        accent: "#0f172a", icon: "📦" },
    { label: "Pending Orders",  value: stats.pendingOrders, accent: "#ef4444", icon: "⏳" },
    { label: "Total Revenue",   value: `Rs. ${stats.revenue.toLocaleString()}`, accent: "#10b981", icon: "💰" },
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
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="nav-link" style={{
                fontSize: 13, textDecoration: "none", transition: "color 0.15s",
                fontWeight: n.active ? 700 : 500,
                color: n.active ? "#0f172a" : "#64748b",
              }}>{n.label}</Link>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 13, color: "#64748b" }}>{user.userName}</span>
            <button onClick={logout} className="btn-primary" style={{
              background: "#0f172a", color: "#fff", border: "none",
              borderRadius: 8, padding: "7px 16px", fontSize: 12,
              fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              transition: "background 0.15s",
            }}>Logout</button>
          </div>
        </nav>

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 40px" }}>

          {/* Header */}
          <div className="fade-in" style={{ marginBottom: 40 }}>
            <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, color: "#0f172a", fontWeight: 400 }}>
              Good morning, {user.userName} 👋
            </h1>
            <p style={{ color: "#64748b", marginTop: 6, fontSize: 15 }}>
              Here's what's happening on your platform today.
            </p>
          </div>

          {/* Stat Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 40 }}>
            {statCards.map((s) => (
              <div key={s.label} className="stat-card card" style={{
                background: "#fff", border: "1px solid #e5e7eb",
                borderRadius: 12, padding: 20,
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                borderTop: `3px solid ${s.accent}`,
                cursor: "default",
              }}>
                <div style={{ fontSize: 22, marginBottom: 10 }}>{s.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: s.accent, fontFamily: "'Instrument Serif', serif" }}>
                  {fetching ? "—" : s.value}
                </div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4, fontWeight: 500 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Two column panels */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

            {/* Recent Sell Interests */}
            <div className="fade-in" style={{
              background: "#fff", border: "1px solid #e5e7eb",
              borderRadius: 12, overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}>
              <div style={{
                padding: "18px 24px", borderBottom: "1px solid #f1f5f9",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 16 }}>🏪</span>
                  <span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Sell Interests</span>
                  {stats.newInterests > 0 && (
                    <span style={{ background: "#6366f1", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99 }}>
                      {stats.newInterests} new
                    </span>
                  )}
                </div>
                <Link href="/roles/admin/interests" style={{ fontSize: 12, color: "#3b82f6", textDecoration: "none", fontWeight: 600 }}>
                  View all →
                </Link>
              </div>

              {fetching ? (
                <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>Loading...</div>
              ) : recentInterests.length === 0 ? (
                <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No interests yet</div>
              ) : (
                recentInterests.map((r, i) => (
                  <div key={r._id} className="row" style={{
                    padding: "14px 24px",
                    borderBottom: i < recentInterests.length - 1 ? "1px solid #f8fafc" : "none",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: "#fff", transition: "background 0.15s",
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "#0f172a" }}>{r.shopName}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{r.fullName} · {r.email}</div>
                    </div>
                    <InterestBadge status={r.status} />
                  </div>
                ))
              )}
            </div>

            {/* Recent Orders */}
            <div className="fade-in" style={{
              background: "#fff", border: "1px solid #e5e7eb",
              borderRadius: 12, overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}>
              <div style={{
                padding: "18px 24px", borderBottom: "1px solid #f1f5f9",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 16 }}>📦</span>
                  <span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Recent Orders</span>
                  {stats.pendingOrders > 0 && (
                    <span style={{ background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99 }}>
                      {stats.pendingOrders} pending
                    </span>
                  )}
                </div>
                <Link href="/roles/admin/orders" style={{ fontSize: 12, color: "#3b82f6", textDecoration: "none", fontWeight: 600 }}>
                  View all →
                </Link>
              </div>

              {fetching ? (
                <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>Loading...</div>
              ) : recentOrders.length === 0 ? (
                <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No orders yet</div>
              ) : (
                recentOrders.map((o, i) => (
                  <div key={o._id} className="row" style={{
                    padding: "14px 24px",
                    borderBottom: i < recentOrders.length - 1 ? "1px solid #f8fafc" : "none",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: "#fff", transition: "background 0.15s",
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "#0f172a" }}>
                        {o.customer?.fullName}
                      </div>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                        {o.items?.length} item{o.items?.length !== 1 ? "s" : ""} · Rs. {o.total?.toLocaleString()}
                      </div>
                    </div>
                    <OrderBadge status={o.status} />
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

function InterestBadge({ status }) {
  const map = {
    new:       { bg: "#eff6ff", color: "#3b82f6",  label: "New"       },
    contacted: { bg: "#fff8e1", color: "#d97706",  label: "Contacted" },
    approved:  { bg: "#ecfdf5", color: "#059669",  label: "Approved"  },
    rejected:  { bg: "#fef2f2", color: "#dc2626",  label: "Rejected"  },
  };
  const s = map[status] || map.new;
  return <Badge bg={s.bg} color={s.color} label={s.label} />;
}

function OrderBadge({ status }) {
  const map = {
    pending:    { bg: "#fff8e1", color: "#d97706",  label: "Pending"    },
    confirmed:  { bg: "#eff6ff", color: "#3b82f6",  label: "Confirmed"  },
    processing: { bg: "#f5f3ff", color: "#7c3aed",  label: "Processing" },
    shipped:    { bg: "#ecfeff", color: "#0891b2",  label: "Shipped"    },
    delivered:  { bg: "#ecfdf5", color: "#059669",  label: "Delivered"  },
    cancelled:  { bg: "#fef2f2", color: "#dc2626",  label: "Cancelled"  },
  };
  const s = map[status] || map.pending;
  return <Badge bg={s.bg} color={s.color} label={s.label} />;
}

function Badge({ bg, color, label }) {
  return (
    <span style={{
      background: bg, color, fontSize: 11,
      fontWeight: 700, padding: "4px 10px", borderRadius: 99, letterSpacing: 0.5,
    }}>{label}</span>
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