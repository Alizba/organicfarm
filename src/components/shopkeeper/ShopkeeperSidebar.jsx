"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Package, BarChart2, Store,
  LogOut, ChevronLeft, ChevronRight, ShoppingBag, Menu, X, BookOpen,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/roles/shopkeeper",           icon: LayoutDashboard, label: "Dashboard" },
  { href: "/roles/shopkeeper/shop",      icon: Store,           label: "My Shop"   },
  { href: "/roles/shopkeeper/products",  icon: Package,         label: "Products"  },
  { href: "/roles/shopkeeper/analytics", icon: BarChart2,       label: "Analytics" },
  { href: "/roles/shopkeeper/blog",      icon: BookOpen,        label: "Blog"      },
];

export default function ShopkeeperLayout({ children }) {
  const { user, logout }  = useAuth();
  const pathname          = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center ${collapsed && !mobile ? "justify-center px-0 py-5" : "justify-between px-5 py-5"} border-b border-white/10 min-h-16`}>
        {(!collapsed || mobile) && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shrink-0">
              <ShoppingBag size={16} color="#fff" />
            </div>
            <span className="text-[17px] text-slate-100 font-light" style={{ fontFamily: "Georgia, serif" }}>Shopkeeper</span>
          </div>
        )}
        {collapsed && !mobile && (
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <ShoppingBag size={16} color="#fff" />
          </div>
        )}
        {mobile && (
          <button onClick={() => setMobileOpen(false)} className="text-white/40 hover:text-white/80 transition-colors">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 flex flex-col gap-0.5 mt-1">
        {NAV_ITEMS.map((item) => {
          const Icon     = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              title={collapsed && !mobile ? item.label : undefined}
              className={`flex items-center gap-3 rounded-xl text-[13px] transition-all duration-150
                ${collapsed && !mobile ? "justify-center px-0 py-2.5" : "px-3 py-2.5"}
                ${isActive
                  ? "bg-emerald-500/15 text-emerald-400 font-semibold border-l-[3px] border-emerald-500"
                  : "text-white/55 hover:bg-white/8 border-l-[3px] border-transparent hover:text-white/90"
                }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} className="shrink-0" />
              {(!collapsed || mobile) && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-white/8">
        {(!collapsed || mobile) && (
          <div className="px-3 py-2.5 mb-1 rounded-xl bg-white/4">
            <div className="text-[12px] font-semibold text-slate-100">{user?.userName}</div>
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide mt-0.5">Shopkeeper</div>
          </div>
        )}
        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 rounded-xl text-[13px] text-white/40 hover:bg-red-500/10 hover:text-red-400 transition-all duration-150 border-none cursor-pointer bg-transparent
            ${collapsed && !mobile ? "justify-center px-0 py-2.5" : "px-3 py-2.5"}`}
        >
          <LogOut size={16} className="shrink-0" />
          {(!collapsed || mobile) && <span>Logout</span>}
        </button>
        {!mobile && (
          <button
            onClick={() => setCollapsed((v) => !v)}
            className={`w-full flex items-center rounded-xl text-white/25 hover:bg-white/8 transition-all duration-150 border-none cursor-pointer bg-transparent py-2 mt-1
              ${collapsed ? "justify-center px-0" : "justify-end px-3"}`}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col shrink-0 bg-slate-900 sticky top-0 h-screen overflow-hidden z-40 transition-all duration-250"
        style={{ width: collapsed ? 68 : 240 }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 flex items-center justify-between px-4 h-14 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center">
            <ShoppingBag size={14} color="#fff" />
          </div>
          <span className="text-slate-100 font-light text-base" style={{ fontFamily: "Georgia, serif" }}>Shopkeeper</span>
        </div>
        <button onClick={() => setMobileOpen(true)} className="text-white/60 hover:text-white transition-colors">
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 bg-slate-900 h-full flex flex-col z-10">
            <SidebarContent mobile />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-x-hidden pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
}