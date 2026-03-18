"use client";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ShopkeeperSidebar from "@/components/shopkeeper/ShopkeeperSidebar";

const features = [
  { icon: "🏪", title: "My Shop",   desc: "Manage your shop profile, description, and settings.", href: "/roles/shopkeeper/shop",      accent: "#6366f1" },
  { icon: "📦", title: "Products",  desc: "Add, edit, and manage your product listings.",          href: "/roles/shopkeeper/products",  accent: "#0f172a" },
  { icon: "📊", title: "Analytics", desc: "Track your sales, visits, and performance metrics.",    href: "/roles/shopkeeper/analytics", accent: "#10b981" },
];

export default function ShopkeeperDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !["shopkeeper", "admin"].includes(user.role))) {
      router.replace("/login");
    }
  }, [user, loading]);

  if (loading || !user) return <Loader />;

  return (
    <ShopkeeperSidebar>
      <div className="p-5 sm:p-8 md:p-10 max-w-4xl">

        {/* Header */}
        <div className="mb-10 animate-[fadeUp_0.4s_ease_both]">
          <p className="text-xs font-bold tracking-[2px] text-slate-400 uppercase mb-2">Shopkeeper Portal</p>
          <h1 className="text-3xl md:text-4xl text-slate-900 font-light" style={{ fontFamily: "Georgia, serif" }}>
            Welcome back, {user.userName} 🏪
          </h1>
          <p className="text-slate-500 mt-2 text-sm md:text-base">
            Your shop is live. Start managing your products and track your performance.
          </p>
        </div>

        {/* Status Banner */}
        <div className="flex items-start gap-4 bg-green-50 border border-green-200 rounded-xl p-4 sm:p-5 mb-8">
          <div className="w-9 h-9 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">✓</div>
          <div>
            <div className="font-bold text-green-800 text-sm">Your shop application was approved!</div>
            <div className="text-green-700 text-xs mt-1">You now have full shopkeeper access. Start setting up your shop below.</div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {features.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="group block bg-white border border-gray-200 rounded-xl p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 no-underline"
              style={{ borderTop: `3px solid ${f.accent}` }}
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-sm text-slate-900">{f.title}</div>
                <span className="text-base opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" style={{ color: f.accent }}>→</span>
              </div>
              <div className="text-xs text-slate-500 leading-relaxed">{f.desc}</div>
            </Link>
          ))}
        </div>

        {/* Info tip */}
        <div className="flex gap-4 items-start bg-white border border-gray-200 rounded-xl p-4 sm:p-5">
          <span className="text-xl">💡</span>
          <div>
            <div className="font-semibold text-sm text-slate-900 mb-1">You're all set</div>
            <div className="text-xs text-slate-500 leading-relaxed">
              Click <strong>Products</strong> to start adding items, or visit <strong>Analytics</strong> to track your performance.
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }`}</style>
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