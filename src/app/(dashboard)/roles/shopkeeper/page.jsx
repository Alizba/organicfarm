"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #fafaf9; }
  .fade-in { animation: fadeUp 0.4s ease both; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  .feature-card { transition: all 0.2s ease; cursor: pointer; text-decoration: none; display: block; }
  .feature-card:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.08) !important; }
  .feature-card:hover .card-arrow { opacity: 1 !important; transform: translateX(3px); }
  .card-arrow { transition: all 0.2s ease; }
  .nav-link:hover { color: #0f172a !important; }
  .btn-primary:hover { background: #1e293b !important; }
  .d1 { animation-delay: 0.05s; }
  .d2 { animation-delay: 0.10s; }
  .d3 { animation-delay: 0.15s; }
`;

export default function ShopkeeperDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !["shopkeeper", "admin"].includes(user.role))) {
      router.replace("/login");
    }
  }, [user, loading]);

  if (loading || !user) return <Loader />;

  const features = [
    {
      icon: "🏪",
      title: "My Shop",
      desc: "Manage your shop profile, description, and settings.",
      href: "/roles/shopkeeper/shop",        // ← coming soon, no page needed yet
      comingSoon: false,
      delay: "d1",
      accent: "#6366f1",
    },
    {
      icon: "📦",
      title: "Products",
      desc: "Add, edit, and manage your product listings.",
      href: "/roles/shopkeeper/products",    // ← will create this page
      comingSoon: false,
      delay: "d2",
      accent: "#0f172a",
    },
    {
      icon: "📊",
      title: "Analytics",
      desc: "Track your sales, visits, and performance metrics.",
      href: "/roles/shopkeeper/analytics",   // ← will create this page
      comingSoon: false,
      delay: "d3",
      accent: "#10b981",
    },
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
              Shopkeeper
            </span>
            <Link href="/roles/shopkeeper" className="nav-link" style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", textDecoration: "none" }}>Dashboard</Link>
            <Link href="/roles/shopkeeper/products" className="nav-link" style={{ fontSize: 13, fontWeight: 500, color: "#64748b", textDecoration: "none" }}>Products</Link>
            <Link href="/roles/shopkeeper/analytics" className="nav-link" style={{ fontSize: 13, fontWeight: 500, color: "#64748b", textDecoration: "none" }}>Analytics</Link>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              background: "#ecfdf5", color: "#059669",
              fontSize: 11, fontWeight: 700, padding: "4px 10px",
              borderRadius: 99, letterSpacing: 0.5,
            }}>SHOPKEEPER</div>
            <span style={{ fontSize: 13, color: "#64748b" }}>{user.userName}</span>
            <button onClick={logout} className="btn-primary" style={{
              background: "#0f172a", color: "#fff", border: "none",
              borderRadius: 8, padding: "7px 16px", fontSize: 12,
              fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>Logout</button>
          </div>
        </nav>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 40px" }}>

          {/* Header */}
          <div className="fade-in" style={{ marginBottom: 48 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: "#94a3b8", textTransform: "uppercase", marginBottom: 8 }}>
              Shopkeeper Portal
            </p>
            <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, color: "#0f172a", fontWeight: 400 }}>
              Welcome back, {user.userName} 🏪
            </h1>
            <p style={{ color: "#64748b", marginTop: 8, fontSize: 15 }}>
              Your shop is live. Start managing your products and track your performance.
            </p>
          </div>

          {/* Status Banner */}
          <div className="fade-in" style={{
            background: "#f0fdf4", border: "1px solid #bbf7d0",
            borderRadius: 12, padding: "20px 24px", marginBottom: 40,
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <div style={{
              width: 40, height: 40, background: "#10b981",
              borderRadius: "50%", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 18, flexShrink: 0,
            }}>✓</div>
            <div>
              <div style={{ fontWeight: 700, color: "#065f46", fontSize: 14 }}>
                Your shop application was approved!
              </div>
              <div style={{ color: "#059669", fontSize: 13, marginTop: 2 }}>
                You now have full shopkeeper access. Start setting up your shop below.
              </div>
            </div>
          </div>

          {/* Feature Cards — now clickable Links */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {features.map((f) => (
              <Link
                key={f.title}
                href={f.comingSoon ? "#" : f.href}
                className={`fade-in feature-card ${f.delay}`}
                style={{
                  background: "#fff", border: "1px solid #e5e7eb",
                  borderRadius: 12, padding: 28,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  borderTop: `3px solid ${f.accent}`,
                  opacity: f.comingSoon ? 0.7 : 1,
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>{f.title}</div>
                  {f.comingSoon ? (
                    <span style={{
                      fontSize: 10, fontWeight: 700, color: "#94a3b8",
                      background: "#f1f5f9", padding: "3px 8px", borderRadius: 99,
                    }}>Soon</span>
                  ) : (
                    <span className="card-arrow" style={{ fontSize: 16, color: f.accent, opacity: 0 }}>→</span>
                  )}
                </div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{f.desc}</div>
              </Link>
            ))}
          </div>

          {/* Info */}
          <div className="fade-in" style={{
            marginTop: 40, padding: "20px 24px",
            background: "#fff", border: "1px solid #e5e7eb",
            borderRadius: 12, display: "flex", gap: 16, alignItems: "flex-start",
          }}>
            <span style={{ fontSize: 20 }}>💡</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#0f172a", marginBottom: 4 }}>
                You're all set
              </div>
              <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7 }}>
                Your role has been upgraded from <strong>user</strong> to <strong>shopkeeper</strong>.
                Click <strong>Products</strong> to start adding items, or visit <strong>Analytics</strong> to track your performance.
              </div>
            </div>
          </div>
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