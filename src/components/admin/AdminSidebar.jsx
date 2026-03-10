"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Store, Users, ShoppingBag,
  MessageSquare, Handshake, ChevronLeft, ChevronRight,
  LogOut, Shield,
} from "lucide-react";

const NAV = [
  { label: "Overview",         href: "/roles/admin",                       icon: LayoutDashboard },
  { label: "Sell Interests",   href: "/roles/admin/interests",             icon: Users           },
  { label: "Orders",           href: "/roles/admin/orders",                icon: ShoppingBag     },
  { label: "Contact Messages", href: "/roles/admin/contact-messages",      icon: MessageSquare   },
  { label: "Partners",         href: "/roles/admin/partners",              icon: Handshake       },
];

export default function AdminSidebar({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const W = collapsed ? 68 : 240;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#fafaf9" }}>

      {/* Sidebar */}
      <aside style={{
        width: W, minWidth: W, background: "#0f172a",
        display: "flex", flexDirection: "column",
        position: "sticky", top: 0, height: "100vh",
        transition: "width 0.2s ease, min-width 0.2s ease",
        overflow: "hidden", zIndex: 40,
      }}>

        {/* Logo */}
        <div style={{
          height: 64, display: "flex", alignItems: "center",
          padding: collapsed ? "0 0 0 18px" : "0 20px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          gap: 10, overflow: "hidden",
        }}>
          <Shield size={22} color="#10b981" style={{ flexShrink: 0 }} />
          {!collapsed && (
            <span style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 18, color: "#fff", whiteSpace: "nowrap",
            }}>Admin Panel</span>
          )}
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: "12px 0", overflowY: "auto", overflowX: "hidden" }}>
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || (href !== "/roles/admin" && pathname?.startsWith(href));
            return (
              <Link key={href} href={href} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center",
                  gap: 12, padding: "11px 20px",
                  margin: "2px 8px", borderRadius: 8,
                  background: active ? "rgba(16,185,129,0.12)" : "transparent",
                  borderLeft: active ? "3px solid #10b981" : "3px solid transparent",
                  cursor: "pointer", transition: "background 0.15s",
                  overflow: "hidden",
                }}>
                  <Icon size={18} color={active ? "#10b981" : "#94a3b8"} style={{ flexShrink: 0 }} />
                  {!collapsed && (
                    <span style={{
                      fontSize: 13, fontWeight: active ? 700 : 500,
                      color: active ? "#fff" : "#94a3b8",
                      whiteSpace: "nowrap",
                    }}>{label}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User pill + logout */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.07)",
          padding: "12px 8px",
        }}>
          {!collapsed && user && (
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 12px", marginBottom: 6,
              background: "rgba(255,255,255,0.05)", borderRadius: 8,
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                background: "#10b981", display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0,
              }}>
                {user.userName?.charAt(0).toUpperCase()}
              </div>
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {user.userName}
                </div>
                <div style={{ fontSize: 10, color: "#64748b" }}>Administrator</div>
              </div>
            </div>
          )}

          <button onClick={logout} style={{
            width: "100%", display: "flex", alignItems: "center",
            gap: 10, padding: "9px 12px", borderRadius: 8,
            background: "transparent", border: "none",
            cursor: "pointer", transition: "background 0.15s",
          }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            <LogOut size={16} color="#ef4444" style={{ flexShrink: 0 }} />
            {!collapsed && (
              <span style={{ fontSize: 13, color: "#ef4444", fontWeight: 500 }}>Logout</span>
            )}
          </button>
        </div>

        {/* Collapse toggle */}
        <button onClick={() => setCollapsed((v) => !v)} style={{
          position: "absolute", top: "50%", right: -12,
          transform: "translateY(-50%)",
          width: 24, height: 24, borderRadius: "50%",
          background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", zIndex: 50,
        }}>
          {collapsed
            ? <ChevronRight size={12} color="#94a3b8" />
            : <ChevronLeft  size={12} color="#94a3b8" />}
        </button>
      </aside>

      {/* Page content */}
      <main style={{ flex: 1, overflow: "auto", minWidth: 0 }}>
        {children}
      </main>
    </div>
  );
}