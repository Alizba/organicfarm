"use client";

import Image from "next/image";
import { ShoppingCart, Store, Package } from "lucide-react";
import Button from "@/components/ui/Button";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const router = useRouter();

  const hasDiscount  = product.originalPrice && product.originalPrice > product.price;
  const isOutOfStock = product.instock === false;
  const discountPct  = hasDiscount ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

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

  const handleCardClick = () => {
    router.push(`/product/${product._id || product.id}`);
  };

  const isBase64 = product.image?.startsWith("data:");

  return (
    <div
      onClick={handleCardClick}
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
          className={`group relative overflow-hidden transition-all duration-300 ease-in-out cursor-pointer flex-1 ${
            isOutOfStock ? "bg-gray-300 cursor-not-allowed" : "bg-green-500 hover:bg-orange-400"
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
  );
}