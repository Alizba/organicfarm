"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import axios from "axios";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  * { box-sizing: border-box; }
  body { font-family: 'DM Sans', sans-serif; background: #fafaf9; }
  .fade-in { animation: fadeUp 0.4s ease both; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  .row-item { transition: background 0.15s; cursor: pointer; }
  .row-item:hover { background: #f8fafc !important; }
  .filter-btn:hover { border-color: #0f172a !important; color: #0f172a !important; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

const FILTERS = ["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

const STATUS_MAP = {
  pending:    { bg: "#fff8e1", color: "#d97706",  label: "Pending"    },
  confirmed:  { bg: "#eff6ff", color: "#3b82f6",  label: "Confirmed"  },
  processing: { bg: "#f5f3ff", color: "#7c3aed",  label: "Processing" },
  shipped:    { bg: "#ecfeff", color: "#0891b2",  label: "Shipped"    },
  delivered:  { bg: "#ecfdf5", color: "#059669",  label: "Delivered"  },
  cancelled:  { bg: "#fef2f2", color: "#dc2626",  label: "Cancelled"  },
};

const STATUS_FLOW = ["pending", "confirmed", "processing", "shipped", "delivered"];

export default function AdminOrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders]     = useState([]);
  const [filter, setFilter]     = useState("all");
  const [fetching, setFetching] = useState(true);
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [toast, setToast]       = useState(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) router.replace("/login");
  }, [user, loading]);

  useEffect(() => {
    if (user?.role === "admin") fetchOrders();
  }, [user, filter]);

  const fetchOrders = async () => {
    setFetching(true);
    try {
      const url = filter === "all" ? "/api/checkout" : `/api/checkout?status=${filter}`;
      const { data } = await axios.get(url);
      setOrders(data.orders || []);
    } catch { showToast("Failed to fetch orders", "error"); }
    finally { setFetching(false); }
  };

  const updateStatus = async (orderId, status) => {
    setUpdating(true);
    try {
      await axios.patch("/api/checkout", { orderId, status });
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status } : o));
      if (selected?._id === orderId) setSelected((prev) => ({ ...prev, status }));
      showToast(`Order marked as ${status}`, "success");
    } catch { showToast("Failed to update status", "error"); }
    finally { setUpdating(false); }
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading || !user) return <Loader />;

  const totalRevenue = orders.filter((o) => o.status !== "cancelled").reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <>
      <style>{css}</style>

      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 999,
          background: toast.type === "success" ? "#0f172a" : "#ef4444",
          color: "#fff", padding: "12px 20px", borderRadius: 10,
          fontSize: 13, fontWeight: 600, boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          animation: "fadeUp 0.3s ease",
        }}>{toast.msg}</div>
      )}

      <AdminSidebar>
        <div style={{ padding: "48px 40px" }}>

          <div className="fade-in" style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: "#94a3b8", textTransform: "uppercase", marginBottom: 8 }}>Admin · Orders</p>
              <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 34, color: "#0f172a", fontWeight: 400 }}>Customer Orders</h1>
              <p style={{ color: "#64748b", marginTop: 6, fontSize: 14 }}>All guest checkout orders. Click any row to view details.</p>
            </div>
            {!fetching && (
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#10b981", fontFamily: "'Instrument Serif', serif" }}>Rs. {totalRevenue.toLocaleString()}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Revenue ({filter === "all" ? "all" : filter})</div>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="fade-in" style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
            {FILTERS.map((f) => (
              <button key={f} className="filter-btn" onClick={() => setFilter(f)} style={{
                padding: "7px 16px", borderRadius: 99, fontSize: 12, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                textTransform: "capitalize",
                background: filter === f ? "#0f172a" : "#fff",
                color: filter === f ? "#fff" : "#64748b",
                border: filter === f ? "1px solid #0f172a" : "1px solid #e2e8f0",
              }}>{f}</button>
            ))}
          </div>

          {/* Table */}
          <div className="fade-in" style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1.5fr 0.8fr 0.8fr 1fr 1.2fr", padding: "12px 24px", background: "#f8fafc", borderBottom: "1px solid #e5e7eb" }}>
              {["Customer", "Contact", "Items", "Total", "Payment", "Status"].map((h) => (
                <span key={h} style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: 1, textTransform: "uppercase" }}>{h}</span>
              ))}
            </div>

            {fetching ? (
              <div style={{ padding: 60, textAlign: "center", color: "#94a3b8" }}>Loading...</div>
            ) : orders.length === 0 ? (
              <div style={{ padding: 60, textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
                <div style={{ color: "#94a3b8", fontSize: 14 }}>No {filter} orders</div>
              </div>
            ) : orders.map((o, i) => {
              const s = STATUS_MAP[o.status] || STATUS_MAP.pending;
              return (
                <div key={o._id} className="row-item" onClick={() => setSelected(o)} style={{
                  display: "grid", gridTemplateColumns: "1.5fr 1.5fr 0.8fr 0.8fr 1fr 1.2fr",
                  padding: "16px 24px", alignItems: "center",
                  borderBottom: i < orders.length - 1 ? "1px solid #f1f5f9" : "none",
                  background: "#fff",
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "#0f172a" }}>{o.customer?.fullName}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{new Date(o.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>{o.customer?.email}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{o.customer?.phone || "—"}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#0f172a" }}>{o.items?.length} item{o.items?.length !== 1 ? "s" : ""}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Rs. {o.total?.toLocaleString()}</div>
                  <div style={{ fontSize: 12, color: "#64748b", textTransform: "capitalize" }}>{o.paymentMethod === "cod" ? "Cash on Delivery" : o.paymentMethod?.replace("_", " ")}</div>
                  <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 99, letterSpacing: 0.5, width: "fit-content" }}>{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </AdminSidebar>

      {/* Order Detail Modal */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setSelected(null)}>
          <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 560, maxHeight: "85vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#fff", zIndex: 1 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>Order Details</div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2, fontFamily: "monospace" }}>#{String(selected._id).slice(-8).toUpperCase()}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 14 }}>✕</button>
            </div>

            <div style={{ padding: 24 }}>
              <Section title="Customer">
                <Row label="Name"  value={selected.customer?.fullName} />
                <Row label="Email" value={selected.customer?.email} />
                <Row label="Phone" value={selected.customer?.phone || "—"} />
              </Section>
              <Section title="Delivery Address">
                <Row label="Street" value={selected.address?.street} />
                <Row label="City"   value={selected.address?.city} />
                <Row label="State"  value={selected.address?.state || "—"} />
                <Row label="ZIP"    value={selected.address?.zip || "—"} />
              </Section>
              <Section title="Items">
                {selected.items?.map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "#0f172a" }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>x{item.quantity} @ Rs. {item.price}</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Rs. {(item.price * item.quantity).toLocaleString()}</div>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid #f1f5f9", marginTop: 8, paddingTop: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748b", marginBottom: 4 }}><span>Subtotal</span><span>Rs. {selected.subtotal?.toLocaleString()}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748b", marginBottom: 4 }}>
                    <span>Delivery</span>
                    <span style={{ color: selected.deliveryFee === 0 ? "#059669" : "#64748b" }}>{selected.deliveryFee === 0 ? "FREE" : `Rs. ${selected.deliveryFee}`}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700, color: "#0f172a" }}><span>Total</span><span>Rs. {selected.total?.toLocaleString()}</span></div>
                </div>
              </Section>
              {selected.notes && <Section title="Notes"><div style={{ fontSize: 13, color: "#64748b" }}>{selected.notes}</div></Section>}
              <Section title="Update Status">
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {STATUS_FLOW.map((s) => {
                    const info = STATUS_MAP[s];
                    const isCurrent = selected.status === s;
                    return (
                      <button key={s} disabled={updating || isCurrent || selected.status === "cancelled"} onClick={() => updateStatus(selected._id, s)} style={{
                        padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                        cursor: isCurrent || selected.status === "cancelled" ? "default" : "pointer",
                        fontFamily: "inherit", border: "none", transition: "opacity 0.15s",
                        background: isCurrent ? info.color : info.bg,
                        color: isCurrent ? "#fff" : info.color,
                        opacity: updating ? 0.6 : 1,
                        outline: isCurrent ? `2px solid ${info.color}` : "none",
                      }}>{info.label}</button>
                    );
                  })}
                  <button disabled={updating || selected.status === "cancelled" || selected.status === "delivered"} onClick={() => updateStatus(selected._id, "cancelled")} style={{
                    padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                    cursor: "pointer", fontFamily: "inherit", border: "none", transition: "opacity 0.15s",
                    background: selected.status === "cancelled" ? "#dc2626" : "#fef2f2",
                    color: selected.status === "cancelled" ? "#fff" : "#dc2626",
                    opacity: updating ? 0.6 : 1,
                  }}>Cancelled</button>
                </div>
              </Section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
      <span style={{ fontSize: 12, color: "#94a3b8" }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 500, color: "#0f172a" }}>{value}</span>
    </div>
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