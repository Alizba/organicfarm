"use client";

import { ShoppingCart, Package } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import toast from "react-hot-toast";

export default function DealCard({ product }) {
  const { addToCart } = useCart();

  const { name, image, price, originalPrice, weight, deal, category, instock } = product;
  const isOutOfStock = instock === false;
  const hasDiscount  = originalPrice && originalPrice > price;
  const discountPct  = hasDiscount ? Math.round((1 - price / originalPrice) * 100) : null;
  const categoryLabel = category?.label || category?.name || "";
  const isBase64 = image?.startsWith("data:");

  const handleAddToCart = (e) => {
    e?.stopPropagation();
    if (isOutOfStock) return;
    addToCart({ ...product, id: product._id });
    toast.success(`${name} added to cart`, {
      duration: 2000,
      style: { borderRadius: "10px", background: "#333", color: "#fff" },
    });
  };

  return (
    <div className="group relative bg-linear-to-br from-white/30 to-white/40 rounded-3xl p-6 border border-green-600 transition-all duration-500 cursor-pointer h-full flex flex-col">

      {deal?.dealLabel && (
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 bg-linear-to-r from-green-600 to-emerald-600 text-white text-xs font-semibold rounded-full shadow-lg">
            {deal.dealLabel}
          </span>
        </div>
      )}

      {discountPct && (
        <div className="absolute top-4 right-4 z-10">
          <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
            -{discountPct}%
          </span>
        </div>
      )}

      <div className="relative w-full h-48 mb-6 flex items-center justify-center rounded-2xl">
        <div className="relative w-full h-full p-4">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out drop-shadow-2xl"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl">
              <Package className="w-12 h-12 text-gray-300" />
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto space-y-3 relative z-10">
        {categoryLabel && (
          <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">
            {category?.icon} {categoryLabel}
          </span>
        )}

        <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors duration-300 leading-tight line-clamp-2">
          {name}
        </h3>

        <div className="flex items-center justify-between pt-2 border-t border-gray-200/50">
          {weight && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
              <span className="text-sm font-medium text-gray-600">{weight}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-green-700 group-hover:text-green-600 transition-colors">
              Rs. {price?.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">Rs. {originalPrice?.toLocaleString()}</span>
            )}
          </div>
        </div>

        {deal?.dealEndsAt && <DealCountdown endsAt={deal.dealEndsAt} />}

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full py-3 font-semibold rounded-xl transform transition-all duration-300 shadow-lg
            ${isOutOfStock
              ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60 translate-y-0"
              : "bg-linear-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 cursor-pointer hover:shadow-xl"
            }`}
        >
          {isOutOfStock ? "Out of Stock" : (
            <span className="flex items-center justify-center gap-2">
              <ShoppingCart className="w-4 h-4" /> Add to Cart
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

function DealCountdown({ endsAt }) {
  const [timeLeft, setTimeLeft] = React.useState(getTimeLeft(endsAt));

  React.useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(endsAt)), 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  if (!timeLeft) return null;

  return (
    <div className="flex gap-2 justify-center">
      {[["H", timeLeft.hours], ["M", timeLeft.minutes], ["S", timeLeft.seconds]].map(([label, val]) => (
        <div key={label} className="flex flex-col items-center bg-green-50 border border-green-200 rounded-lg px-2 py-1 min-w-10">
          <span className="text-base font-bold text-green-700 leading-none">{String(val).padStart(2, "0")}</span>
          <span className="text-[9px] text-green-500 font-semibold uppercase">{label}</span>
        </div>
      ))}
    </div>
  );
}

function getTimeLeft(endsAt) {
  const diff = new Date(endsAt) - new Date();
  if (diff <= 0) return null;
  return {
    hours:   Math.floor(diff / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

import React from "react";