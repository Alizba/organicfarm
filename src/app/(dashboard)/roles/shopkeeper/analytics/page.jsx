"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import ShopkeeperSidebar from "@/components/shopkeeper/ShopkeeperSidebar";

export default function ShopkeeperAnalyticsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [orders,   setOrders]   = useState([]);
  const [products, setProducts] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !["shopkeeper", "admin"].includes(user.role))) router.replace("/login");
  }, [user, loading]);

  useEffect(() => { if (user) fetchAll(); }, [user]);

  const fetchAll = async () => {
    try {
      const [o, p] = await Promise.all([axios.get("/api/shopkeeper/orders"), axios.get("/api/shopkeeper/products")]);
      setOrders(o.data.orders || []);
      setProducts(p.data.products || []);
    } catch (e) { console.error(e); }
    finally { setFetching(false); }
  };

  if (loading || !user) return <Loader />;

  const activeOrders    = orders.filter((o) => o.status !== "cancelled");
  const totalRevenue    = activeOrders.reduce((s, o) => s + (o.total || 0), 0);
  const pendingOrders   = orders.filter((o) => o.status === "pending").length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
  const outOfStock      = products.filter((p) => p.stock === 0).length;

  const statCards = [
    { label: "Total Revenue",    value: `Rs. ${totalRevenue.toLocaleString()}`, accent: "#10b981", icon: "💰" },
    { label: "Total Orders",     value: orders.length,                          accent: "#0f172a", icon: "📦" },
    { label: "Pending Orders",   value: pendingOrders,                          accent: "#f59e0b", icon: "⏳" },
    { label: "Delivered Orders", value: deliveredOrders,                        accent: "#6366f1", icon: "✅" },
  ];

  const productSales = {};
  activeOrders.forEach((order) => {
    (order.items || []).forEach((item) => {
      const key  = item.productId || item.name || "Unknown";
      const name = item.name || item.productName || key;
      if (!productSales[key]) productSales[key] = { name, revenue: 0, qty: 0 };
      productSales[key].revenue += (item.price || 0) * (item.quantity || 1);
      productSales[key].qty     += item.quantity || 1;
    });
  });
  const topProducts = Object.values(productSales).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  const statusColors = {
    pending:    { bg: "#fff8e1", color: "#d97706" },
    confirmed:  { bg: "#eff6ff", color: "#3b82f6" },
    processing: { bg: "#f5f3ff", color: "#7c3aed" },
    shipped:    { bg: "#ecfeff", color: "#0891b2" },
    delivered:  { bg: "#ecfdf5", color: "#059669" },
    cancelled:  { bg: "#fef2f2", color: "#dc2626" },
  };

  const statusBreakdown = ["pending","confirmed","processing","shipped","delivered","cancelled"]
    .map((s) => ({ status: s, count: orders.filter((o) => o.status === s).length }))
    .filter((s) => s.count > 0);

  return (
    <ShopkeeperSidebar>
      <div className="p-5 sm:p-8 md:p-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl text-slate-900 font-light" style={{ fontFamily: "Georgia, serif" }}>Analytics</h1>
          <p className="text-slate-500 mt-1.5 text-sm">Your shop performance at a glance.</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {statCards.map((s) => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm" style={{ borderTop: `3px solid ${s.accent}` }}>
              <div className="text-xl sm:text-2xl mb-2">{s.icon}</div>
              <div className="text-2xl sm:text-3xl font-black" style={{ color: s.accent, fontFamily: "Georgia, serif" }}>
                {fetching ? "—" : s.value}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Bottom grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Top Products */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100 font-bold text-sm text-slate-900">Top Products by Revenue</div>
            {fetching ? <div className="p-10 text-center text-slate-400 text-sm">Loading...</div>
              : topProducts.length === 0 ? <div className="p-10 text-center text-slate-400 text-sm">No sales data yet</div>
              : topProducts.map((p, i) => {
                const pct = topProducts[0].revenue > 0 ? (p.revenue / topProducts[0].revenue) * 100 : 0;
                return (
                  <div key={p.name} className={`px-5 py-3 hover:bg-slate-50 transition-colors ${i < topProducts.length - 1 ? "border-b border-slate-50" : ""}`}>
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 flex items-center justify-center">{i+1}</span>
                        <span className="font-semibold text-sm text-slate-900 truncate max-w-35 sm:max-w-none">{p.name}</span>
                      </div>
                      <div className="text-right ml-2 shrink-0">
                        <div className="font-bold text-sm text-emerald-600">Rs. {p.revenue.toLocaleString()}</div>
                        <div className="text-[11px] text-slate-400">{p.qty} sold</div>
                      </div>
                    </div>
                    <div className="h-1 bg-slate-100 rounded-full">
                      <div className="h-full rounded-full bg-linear-to-r from-emerald-500 to-emerald-300 transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
            }
          </div>

          {/* Order Breakdown */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
              <span className="font-bold text-sm text-slate-900">Order Breakdown</span>
              <span className="text-xs text-slate-400">{orders.length} total</span>
            </div>
            {fetching ? <div className="p-10 text-center text-slate-400 text-sm">Loading...</div>
              : statusBreakdown.length === 0 ? <div className="p-10 text-center text-slate-400 text-sm">No orders yet</div>
              : <div className="p-5 flex flex-col gap-3">
                  {statusBreakdown.map((s) => {
                    const sc  = statusColors[s.status] || { bg: "#f1f5f9", color: "#64748b" };
                    const pct = orders.length > 0 ? (s.count / orders.length) * 100 : 0;
                    return (
                      <div key={s.status}>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize" style={{ background: sc.bg, color: sc.color }}>{s.status}</span>
                          <span className="text-sm font-bold text-slate-900">{s.count}</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full">
                          <div className="h-full rounded-full transition-all duration-500" style={{ background: sc.color, width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
            }
          </div>

          {/* Inventory */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="font-bold text-sm text-slate-900 mb-4">Inventory</div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Total Products", value: products.length,                                               accent: "#6366f1" },
                { label: "Out of Stock",   value: outOfStock,                                                    accent: "#ef4444" },
                { label: "In Stock",       value: products.length - outOfStock,                                  accent: "#10b981" },
                { label: "Low Stock (≤5)", value: products.filter((p) => p.stock > 0 && p.stock <= 5).length,   accent: "#f59e0b" },
              ].map((item) => (
                <div key={item.label} className="bg-slate-50 border border-slate-100 rounded-xl p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl font-black" style={{ color: item.accent, fontFamily: "Georgia, serif" }}>
                    {fetching ? "—" : item.value}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 font-medium">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ShopkeeperSidebar>
  );
}

function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-8 h-8 border-[3px] border-slate-200 border-t-slate-900 rounded-full animate-spin" />
    </div>
  );
}