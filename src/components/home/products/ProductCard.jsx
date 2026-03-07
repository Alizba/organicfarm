"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingCart, X, Store, Leaf, Package } from "lucide-react";
import Button from "@/components/ui/Button";
import { useCart } from "@/contexts/CartContext";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [showModal, setShowModal] = useState(false);

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const isOutOfStock = product.instock === false;
  const discountPct = hasDiscount
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const normalizedProduct = { ...product, id: product._id || product.id };

  const handleAddToCart = (e) => {
    e?.stopPropagation();
    if (isOutOfStock) return;
    addToCart(normalizedProduct);
    toast.success(`${product.name} added to cart`, {
      duration: 2000,
      style: { borderRadius: "10px", background: "#333", color: "#fff" },
    });
  };

  const isBase64 = product.image?.startsWith("data:");

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className="bg-white rounded-2xl p-4 hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-200 hover:border-green-300 flex flex-col h-full"
      >
        {/* Top badges */}
        <div className="flex justify-between items-start mb-3">
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
            {product.weight || "—"}
          </span>
          {isOutOfStock ? (
            <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-semibold">Out of stock</span>
          ) : discountPct ? (
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">-{discountPct}%</span>
          ) : null}
        </div>

        {/* Image */}
        <div className="relative w-full h-48 mb-4 flex items-center justify-center">
          {product.image ? (
            isBase64 ? (
              <img src={product.image} alt={product.name} className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-300" />
            ) : (
              <Image
                src={product.image} alt={product.name} fill
                className="object-contain group-hover:scale-110 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            )
          ) : (
            <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center">
              <Package className="w-10 h-10 text-gray-300" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="grow border-t border-gray-200 pt-3">
          {product.shopName && (
            <div className="flex items-center gap-1 mb-1">
              <Store className="w-3 h-3 text-green-600" />
              <p className="text-xs text-green-600 font-semibold">{product.shopName}</p>
            </div>
          )}
          <h3 className="text-base font-bold text-gray-800 mb-2 group-hover:text-green-700 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-gray-800">Rs. {product.price?.toFixed(2)}</span>
            {hasDiscount && <span className="text-sm text-gray-400 line-through">Rs. {product.originalPrice?.toFixed(2)}</span>}
          </div>
        </div>

        {/* Bottom */}
        <div className="flex justify-between items-center gap-3">
          {product.isVegetarian && (
            <div className="border-2 border-green-600 rounded-sm p-1 w-6 h-6 flex items-center justify-center shrink-0">
              <div className="w-2 h-2 rounded-full bg-green-600" />
            </div>
          )}
          <Button
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={`group relative overflow-hidden transition-all duration-300 ease-in-out cursor-pointer flex-1 ${isOutOfStock ? "bg-gray-300 cursor-not-allowed" : "bg-green-500 hover:bg-orange-400"
              }`}
          >
            <span className="group-hover:opacity-0 group-hover:scale-0 transition-all duration-300">
              {isOutOfStock ? "Out of stock" : "Add to Cart"}
            </span>
            {!isOutOfStock && (
              <ShoppingCart className="w-4 h-4 absolute opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
            )}
          </Button>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
            style={{ animation: "popIn 0.2s ease" }}
            onClick={(e) => e.stopPropagation()}
          >
            <style>{`
              @keyframes popIn {
                from { opacity: 0; transform: scale(0.94) translateY(12px); }
                to   { opacity: 1; transform: scale(1)    translateY(0); }
              }
            `}</style>

            {/* Image area */}
            <div className="relative bg-gray-50 h-56 flex items-center justify-center">
              {product.image ? (
                <img src={product.image} alt={product.name} className="h-full w-full object-contain p-6" />
              ) : (
                <Package className="w-16 h-16 text-gray-300" />
              )}

              {/* Close */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>

              {/* Top-left badges */}
              <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                {isOutOfStock && <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">Out of stock</span>}
                {discountPct && !isOutOfStock && <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">-{discountPct}% OFF</span>}
                {product.isVegetarian && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Leaf className="w-3 h-3" /> Veg
                  </span>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="p-6">

              {/* Shop badge — prominent */}
              {product.shopName && (
                <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2 mb-4">
                  <Store className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-xs text-green-500 font-medium leading-none mb-0.5">Sold by</p>
                    <p className="text-sm font-bold text-green-700 leading-none">{product.shopName}</p>
                  </div>
                </div>
              )}

              {/* Name */}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>

              {/* Price */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-bold text-gray-900">Rs. {product.price?.toFixed(2)}</span>
                {hasDiscount && (
                  <>
                    <span className="text-base text-gray-400 line-through">Rs. {product.originalPrice?.toFixed(2)}</span>
                    <span className="text-sm font-semibold text-green-600">
                      Save Rs. {(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              {/* Chips */}
              <div className="flex gap-2 flex-wrap mb-4">
                {product.weight && (
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">{product.weight}</span>
                )}
                {product.category && (
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium capitalize">
                    {product.category?.label || product.category?.name || product.category}
                  </span>
                )}
                {product.stock > 0 && (
                  <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-medium">{product.stock} in stock</span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-gray-500 text-sm leading-relaxed mb-5 pt-4 border-t border-gray-100">
                  {product.description}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${isOutOfStock
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 text-white cursor-pointer"
                    }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}