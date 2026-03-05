"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OrderSuccessPage() {
  const { orderIds, orderCount } = useCart();
  const { user } = useAuth();
  const router   = useRouter();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!orderIds || orderIds.length === 0) {
      const t = setTimeout(() => router.replace("/"), 3000);
      return () => clearTimeout(t);
    }
  }, [orderIds]);

  const isMultiShop = orderCount > 1;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600&family=Jost:wght@300;400;500;600&display=swap');
        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        .font-jost      { font-family: 'Jost', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0%   { transform: scale(0);    opacity: 0; }
          60%  { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1);    opacity: 1; }
        }
        @keyframes ripple {
          0%   { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes dash {
          from { stroke-dashoffset: 60; }
          to   { stroke-dashoffset: 0; }
        }

        .anim-fadeup  { animation: fadeUp 0.5s ease both; }
        .anim-pop     { animation: popIn  0.5s cubic-bezier(.34,1.56,.64,1) both; }
        .ripple       { animation: ripple 1.6s ease-out infinite; }
        .check-path   { stroke-dasharray: 60; stroke-dashoffset: 60; animation: dash 0.5s ease 0.4s forwards; }

        .d1 { animation-delay: 0.15s; }
        .d2 { animation-delay: 0.25s; }
        .d3 { animation-delay: 0.35s; }
        .d4 { animation-delay: 0.45s; }
        .d5 { animation-delay: 0.55s; }

        .btn-shop {
          transition: all 0.2s ease;
        }
        .btn-shop:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(26,56,32,0.25);
        }
      `}</style>

      <div
        className="font-jost min-h-screen bg-stone-50 flex items-center justify-center px-4 py-16"
        style={{ opacity: show ? 1 : 0, transition: "opacity 0.3s ease" }}
      >
        <div className="w-full max-w-lg text-center">

          <div className="anim-pop d1 relative inline-flex items-center justify-center mb-8">
            {/* Ripple rings */}
            <div className="ripple absolute w-24 h-24 rounded-full bg-green-200 opacity-40" style={{ animationDelay: "0s" }} />
            <div className="ripple absolute w-24 h-24 rounded-full bg-green-200 opacity-30" style={{ animationDelay: "0.5s" }} />

            {/* Circle */}
            <div className="relative w-24 h-24 rounded-full bg-[#1a3820] flex items-center justify-center shadow-xl">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <path
                  className="check-path"
                  d="M8 22 L18 32 L36 12"
                  stroke="#96d44e"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="anim-fadeup d2 mb-2">
            <p className="text-xs font-medium tracking-[3px] uppercase text-[#64a828] mb-3">
              Order Confirmed
            </p>
            <h1 className="font-cormorant text-[42px] font-semibold text-[#1a2e1a] leading-tight">
              Thank you{user?.userName ? `, ${user.userName}` : ""}!
            </h1>
          </div>

          <p className="anim-fadeup d3 text-gray-500 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
            {isMultiShop
              ? `Your order has been split into ${orderCount} shop orders and confirmed. Each shop will process their part separately.`
              : "Your order has been placed and confirmed. We'll get it ready and on its way to you soon."}
          </p>

          {orderIds && orderIds.length > 0 && (
            <div className="anim-fadeup d3 mb-8">
              {isMultiShop ? (
                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm text-left space-y-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Order IDs</p>
                  {orderIds.map((id, i) => (
                    <div key={id} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#1a3820] text-[#96d44e] text-xs font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="font-mono text-sm text-gray-700 break-all">{id}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-gray-100 rounded-2xl px-6 py-4 shadow-sm inline-block">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Order ID</p>
                  <p className="font-mono text-sm text-[#1a3820] font-semibold">{orderIds[0]}</p>
                </div>
              )}
            </div>
          )}

          <div className="anim-fadeup d4 grid grid-cols-3 gap-3 mb-8">
            {[
              { icon: "📦", label: "Processing",  desc: "Order received" },
              { icon: "🚚", label: "Delivery",     desc: "On the way soon" },
              { icon: "✅", label: "Confirmation", desc: "Check your email" },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="text-xs font-semibold text-gray-700">{s.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{s.desc}</div>
              </div>
            ))}
          </div>

          <div className="anim-fadeup d4 bg-amber-50 border border-amber-100 rounded-xl px-5 py-3 mb-8 text-left">
            <div className="flex gap-3 items-start">
              <span className="text-amber-500 text-lg mt-0.5">💵</span>
              <div>
                <p className="text-sm font-semibold text-amber-700">Cash on Delivery</p>
                <p className="text-xs text-amber-600 mt-0.5">
                  Please keep exact change ready at the time of delivery.
                </p>
              </div>
            </div>
          </div>

          <div className="anim-fadeup d5 flex gap-3 justify-center">
            <Link
              href="/"
              className="btn-shop flex-1 max-w-48 py-3.5 bg-[#1a3820] text-stone-100 text-sm font-medium rounded-xl text-center cursor-pointer"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="btn-shop flex-1 max-w-48 py-3.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl text-center cursor-pointer hover:bg-gray-50"
            >
              Back to Home
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}