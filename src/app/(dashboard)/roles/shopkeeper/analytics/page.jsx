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
  .stat-card { animation: fadeUp 0.4s ease both; }
  .stat-card:nth-child(1) { animation-delay: 0.05s; }
  .stat-card:nth-child(2) { animation-delay: 0.10s; }
  .stat-card:nth-child(3) { animation-delay: 0.15s; }
  .stat-card:nth-child(4) { animation-delay: 0.20s; }
  .row:hover { background: #f8fafc !important; }
`;

export default function ShopkeeperAnalyticsPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [orders, setOrders]     = useState([]);
  const [products, setProducts] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !["shopkeeper", "admin"].includes(user.role))) {
      router.replace("/login");
    }
  }, [user, loading]);

  useEffect(() => {
    if (user) fetchAll();
  }, [user]);

  const fetchAll = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        axios.get("/api/shopkeeper/orders"),      // orders belonging to this shopkeeper
        axios.get("/api/shopkeeper/products"),
      ]);
      setOrders(ordersRes.data.orders || []);
      setProducts(productsRes.data.products || []);
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  };

  if (loading || !user) return <Loader />;

  // --- Derived stats ---
  const activeOrders    = orders.filter((o) => o.status !== "cancelled");
  const totalRevenue    = activeOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders   = orders.filter((o) => o.status === "pending").length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
  const totalProducts   = products.length;
  const outOfStock      = products.filter((p) => p.stock === 0).length;

  const statCards = [
    { label: "Total Revenue",    value: `Rs. ${totalRevenue.toLocaleString()}`, accent: "#10b981", icon: "💰" },
    { label: "Total Orders",     value: orders.length,                          accent: "#0f172a", icon: "📦" },
    { label: "Pending Orders",   value: pendingOrders,                          accent: "#f59e0b", icon: "⏳" },
    { label: "Delivered Orders", value: deliveredOrders,                        accent: "#6366f1", icon: "✅" },
  ];

  // Top products by revenue (match order items to products)
  // This is a simple approximation — adjust based on your Order model structure
  const productSales = {};
  activeOrders.forEach((order) => {
    (order.items || []).forEach((item) => {
      const key = item.productId || item.name || "Unknown";
      const name = item.name || item.productName || key;
      if (!productSales[key]) productSales[key] = { name, revenue: 0, qty: 0 };
      productSales[key].revenue += (item.price || 0) * (item.quantity || 1);
      productSales[key].qty     += item.quantity || 1;
    });
  });
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Orders by status for the breakdown
  const statusBreakdown = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map((s) => ({
    status: s,
    count:  orders.filter((o) => o.status === s).length,
  })).filter((s) => s.count > 0);

  const statusColors = {
    pending:    { bg: "#fff8e1", color: "#d97706" },
    confirmed:  { bg: "#eff6ff", color: "#3b82f6" },
    processing: { bg: "#f5f3ff", color: "#7c3aed" },
    shipped:    { bg: "#ecfeff", color: "#0891b2" },
    delivered:  { bg: "#ecfdf5", color: "#059669" },
    cancelled:  { bg: "#fef2f2", color: "#dc2626" },
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
            <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, color: "#0f172a" }}>Shopkeeper</span>
            <Link href="/roles/shopkeeper" className="nav-link" style={{ fontSize: 13, fontWeight: 500, color: "#64748b", textDecoration: "none" }}>Dashboard</Link>
            <Link href="/roles/shopkeeper/products" className="nav-link" style={{ fontSize: 13, fontWeight: 500, color: "#64748b", textDecoration: "none" }}>Products</Link>
            <Link href="/roles/shopkeeper/analytics" className="nav-link" style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", textDecoration: "none" }}>Analytics</Link>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 13, color: "#64748b" }}>{user.userName}</span>
            <button onClick={logout} className="btn-primary" style={{
              background: "#0f172a", color: "#fff", border: "none",
              borderRadius: 8, padding: "7px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>Logout</button>
          </div>
        </nav>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 40px" }}>

          {/* Header */}
          <div className="fade-in" style={{ marginBottom: 36 }}>
            <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, color: "#0f172a", fontWeight: 400 }}>Analytics</h1>
            <p style={{ color: "#64748b", marginTop: 6, fontSize: 15 }}>Your shop's performance at a glance.</p>
          </div>

          {/* Stat Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
            {statCards.map((s) => (
              <div key={s.label} className="stat-card" style={{
                background: "#fff", border: "1px solid #e5e7eb",
                borderRadius: 12, padding: 20,
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                borderTop: `3px solid ${s.accent}`,
              }}>
                <div style={{ fontSize: 22, marginBottom: 10 }}>{s.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: s.accent, fontFamily: "'Instrument Serif', serif" }}>
                  {fetching ? "—" : s.value}
                </div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4, fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

            {/* Top Products */}
            <div className="fade-in" style={{
              background: "#fff", border: "1px solid #e5e7eb",
              borderRadius: 12, overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}>
              <div style={{ padding: "18px 24px", borderBottom: "1px solid #f1f5f9" }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Top Products by Revenue</span>
              </div>
              {fetching ? (
                <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>Loading...</div>
              ) : topProducts.length === 0 ? (
                <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No sales data yet</div>
              ) : (
                <div style={{ padding: "8px 0" }}>
                  {topProducts.map((p, i) => {
                    const maxRev = topProducts[0].revenue;
                    const pct = maxRev > 0 ? (p.revenue / maxRev) * 100 : 0;
                    return (
                      <div key={p.name} className="row" style={{
                        padding: "12px 24px",
                        borderBottom: i < topProducts.length - 1 ? "1px solid #f8fafc" : "none",
                        background: "#fff", transition: "background 0.15s",
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{
                              width: 20, height: 20, borderRadius: "50%", background: "#f1f5f9",
                              fontSize: 10, fontWeight: 700, color: "#64748b",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}>{i + 1}</span>
                            <span style={{ fontWeight: 600, fontSize: 13, color: "#0f172a" }}>{p.name}</span>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontWeight: 700, fontSize: 13, color: "#10b981" }}>Rs. {p.revenue.toLocaleString()}</div>
                            <div style={{ fontSize: 11, color: "#94a3b8" }}>{p.qty} sold</div>
                          </div>
                        </div>
                        <div style={{ height: 4, background: "#f1f5f9", borderRadius: 99 }}>
                          <div style={{
                            height: "100%", borderRadius: 99,
                            background: "linear-gradient(90deg, #10b981, #34d399)",
                            width: `${pct}%`, transition: "width 0.6s ease",
                          }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Order Status Breakdown */}
            <div className="fade-in" style={{
              background: "#fff", border: "1px solid #e5e7eb",
              borderRadius: 12, overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}>
              <div style={{ padding: "18px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Order Breakdown</span>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{orders.length} total</span>
              </div>
              {fetching ? (
                <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>Loading...</div>
              ) : statusBreakdown.length === 0 ? (
                <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No orders yet</div>
              ) : (
                <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
                  {statusBreakdown.map((s) => {
                    const sc = statusColors[s.status] || { bg: "#f1f5f9", color: "#64748b" };
                    const pct = orders.length > 0 ? (s.count / orders.length) * 100 : 0;
                    return (
                      <div key={s.status}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <span style={{
                            background: sc.bg, color: sc.color,
                            fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99,
                            textTransform: "capitalize",
                          }}>{s.status}</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{s.count}</span>
                        </div>
                        <div style={{ height: 6, background: "#f1f5f9", borderRadius: 99 }}>
                          <div style={{
                            height: "100%", borderRadius: 99,
                            background: sc.color,
                            width: `${pct}%`, transition: "width 0.6s ease",
                          }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Inventory Summary */}
            <div className="fade-in" style={{
              background: "#fff", border: "1px solid #e5e7eb",
              borderRadius: 12, padding: 24,
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a", marginBottom: 20 }}>Inventory</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { label: "Total Products", value: totalProducts, accent: "#6366f1" },
                  { label: "Out of Stock",   value: outOfStock,    accent: "#ef4444" },
                  { label: "In Stock",       value: totalProducts - outOfStock, accent: "#10b981" },
                  { label: "Low Stock (≤5)", value: products.filter((p) => p.stock > 0 && p.stock <= 5).length, accent: "#f59e0b" },
                ].map((item) => (
                  <div key={item.label} style={{
                    background: "#fafaf9", border: "1px solid #f1f5f9",
                    borderRadius: 10, padding: "14px 16px",
                  }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: item.accent, fontFamily: "'Instrument Serif', serif" }}>
                      {fetching ? "—" : item.value}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 4, fontWeight: 500 }}>{item.label}</div>
                  </div>
                ))}
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