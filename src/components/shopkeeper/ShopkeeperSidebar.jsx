"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Package, BarChart2, Store,
  LogOut, ChevronLeft, ChevronRight, ShoppingBag,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/roles/shopkeeper",           icon: LayoutDashboard, label: "Dashboard" },
  { href: "/roles/shopkeeper/shop",      icon: Store,           label: "My Shop"   },
  { href: "/roles/shopkeeper/products",  icon: Package,         label: "Products"  },
  { href: "/roles/shopkeeper/analytics", icon: BarChart2,        label: "Analytics" },
];

export default function ShopkeeperLayout({ children }) {
  const { user, logout } = useAuth();
  const pathname          = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .sk-layout * { box-sizing: border-box; }
        .sk-layout { font-family: 'DM Sans', sans-serif; }
        .sk-nav-item { transition: all 0.15s ease; }
        .sk-nav-item:hover { background: rgba(255,255,255,0.08) !important; }
        .sk-collapse-btn:hover { background: rgba(255,255,255,0.1) !important; }
        .sk-logout:hover { background: rgba(239,68,68,0.12) !important; color: #f87171 !important; }
        @keyframes sk-fadeup { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .sk-fadein { animation: sk-fadeup 0.35s ease both; }
      `}</style>

      <div className="sk-layout" style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>

        <aside style={{
          width: collapsed ? 68 : 240,
          background: "#0f172a",
          display: "flex", flexDirection: "column",
          position: "sticky", top: 0, height: "100vh",
          flexShrink: 0,
          transition: "width 0.25s cubic-bezier(.4,0,.2,1)",
          overflow: "hidden",
          zIndex: 40,
        }}>

          <div style={{
            padding: collapsed ? "20px 0" : "20px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            display: "flex", alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            minHeight: 64,
          }}>
            {!collapsed && (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 30, height: 30, background: "#10b981",
                  borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <ShoppingBag size={16} color="#fff" />
                </div>
                <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 17, color: "#f8fafc", fontWeight: 400 }}>
                  Shopkeeper
                </span>
              </div>
            )}
            {collapsed && (
              <div style={{ width: 30, height: 30, background: "#10b981", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ShoppingBag size={16} color="#fff" />
              </div>
            )}
          </div>

          <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
            {NAV_ITEMS.map((item) => {
              const Icon     = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="sk-nav-item"
                  title={collapsed ? item.label : undefined}
                  style={{
                    display: "flex", alignItems: "center",
                    gap: 12, padding: collapsed ? "10px 0" : "10px 12px",
                    justifyContent: collapsed ? "center" : "flex-start",
                    borderRadius: 9, textDecoration: "none",
                    background: isActive ? "rgba(16,185,129,0.15)" : "transparent",
                    color: isActive ? "#10b981" : "rgba(255,255,255,0.6)",
                    fontWeight: isActive ? 600 : 400,
                    fontSize: 13,
                    borderLeft: isActive ? "3px solid #10b981" : "3px solid transparent",
                    transition: "all 0.15s ease",
                  }}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} style={{ flexShrink: 0 }} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

=          <div style={{
            padding: "12px 8px",
            borderTop: "1px solid rgba(255,255,255,0.07)",
          }}>
            {!collapsed && (
              <div style={{
                padding: "10px 12px", marginBottom: 4,
                borderRadius: 9, background: "rgba(255,255,255,0.04)",
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#f8fafc", marginBottom: 2 }}>
                  {user?.userName}
                </div>
                <div style={{
                  fontSize: 10, fontWeight: 700, color: "#10b981",
                  textTransform: "uppercase", letterSpacing: 0.8,
                }}>
                  Shopkeeper
                </div>
              </div>
            )}

            <button
              onClick={logout}
              className="sk-nav-item sk-logout"
              title={collapsed ? "Logout" : undefined}
              style={{
                width: "100%", display: "flex", alignItems: "center",
                gap: 12, padding: collapsed ? "10px 0" : "10px 12px",
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius: 9, border: "none", cursor: "pointer",
                background: "transparent", color: "rgba(255,255,255,0.4)",
                fontSize: 13, fontFamily: "inherit",
                transition: "all 0.15s ease",
              }}
            >
              <LogOut size={16} style={{ flexShrink: 0 }} />
              {!collapsed && <span>Logout</span>}
            </button>

            <button
              onClick={() => setCollapsed((v) => !v)}
              className="sk-collapse-btn"
              style={{
                width: "100%", display: "flex", alignItems: "center",
                justifyContent: collapsed ? "center" : "flex-end",
                padding: "8px 12px", marginTop: 4,
                border: "none", cursor: "pointer", background: "transparent",
                color: "rgba(255,255,255,0.25)", borderRadius: 9,
                transition: "all 0.15s ease",
              }}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>
        </aside>

        <main style={{ flex: 1, minWidth: 0, overflowX: "hidden" }}>
          {children}
        </main>
      </div>
    </>
  );
}