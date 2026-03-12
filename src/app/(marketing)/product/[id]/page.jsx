"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShoppingCart, Store, Leaf, Package, ArrowLeft, Tag, CheckCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import toast from "react-hot-toast";

export default function ProductPage() {
  const { id } = useParams();
  const router  = useRouter();
  const { addToCart } = useCart();

  const [product,       setProduct]       = useState(null);
  const [shopProducts,  setShopProducts]  = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    fetch(`/api/customer/product/${id}`)
      .then((r) => { if (!r.ok) throw new Error("Product not found"); return r.json(); })
      .then((data) => {
        setProduct(data.product);
        // fetch other products from same shop
        if (data.product?.shopkeeper) {
          return fetch(`/api/customer/shop?shopkeeper=${data.product.shopkeeper}`)
            .then((r) => r.json())
            .then((d) => {
              setShopProducts((d.products || []).filter((p) => p._id !== id).slice(0, 8));
            });
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.instock === false) return;
    addToCart({ ...product, id: product._id });
    toast.success(`${product.name} added to cart`, {
      duration: 2000,
      style: { borderRadius: "10px", background: "#333", color: "#fff" },
    });
  };

  if (loading) return <LoadingSkeleton />;
  if (error || !product) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-500">
      <Package className="w-16 h-16 text-gray-300" />
      <p className="text-lg font-medium">{error || "Product not found"}</p>
      <button onClick={() => router.back()} className="text-sm text-green-600 hover:underline flex items-center gap-1 cursor-pointer">
        <ArrowLeft className="w-4 h-4" /> Go back
      </button>
    </div>
  );

  const hasDiscount  = product.originalPrice && product.originalPrice > product.price;
  const discountPct  = hasDiscount ? Math.round((1 - product.price / product.originalPrice) * 100) : null;
  const isOutOfStock = product.instock === false;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Back bar */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-16 py-3 sticky top-0 z-10">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-700 transition-colors cursor-pointer font-medium">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">

        {/* Product detail card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-12">
          <div className="grid md:grid-cols-2 gap-0">

            {/* Image */}
            <div className="relative bg-gray-50 flex items-center justify-center p-10 min-h-72">
              {product.image ? (
                <img src={product.image} alt={product.name} className="max-h-72 w-full object-contain" />
              ) : (
                <Package className="w-24 h-24 text-gray-200" />
              )}
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {isOutOfStock && <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">Out of stock</span>}
                {discountPct && !isOutOfStock && <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">-{discountPct}% OFF</span>}
                {product.isVegetarian && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Leaf className="w-3 h-3" /> Veg
                  </span>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="p-8 flex flex-col justify-between border-l border-gray-100">
              <div>
                {/* Shop badge */}
                {product.shopName && (
                  <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2 mb-5">
                    <Store className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-[10px] text-green-500 font-medium leading-none mb-0.5">Sold by</p>
                      <p className="text-sm font-bold text-green-700 leading-none">{product.shopName}</p>
                    </div>
                  </div>
                )}

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-5">
                  <span className="text-3xl font-bold text-gray-900">Rs. {product.price?.toFixed(2)}</span>
                  {hasDiscount && (
                    <>
                      <span className="text-lg text-gray-400 line-through">Rs. {product.originalPrice?.toFixed(2)}</span>
                      <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-lg">
                        Save Rs. {(product.originalPrice - product.price).toFixed(2)}
                      </span>
                    </>
                  )}
                </div>

                {/* Chips */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {product.weight && (
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">{product.weight}</span>
                  )}
                  {product.category && (
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium capitalize flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {product.category?.label || product.category?.name || product.category}
                    </span>
                  )}
                  {!isOutOfStock && product.stock > 0 && (
                    <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> {product.stock} in stock
                    </span>
                  )}
                </div>

                {/* Description */}
                {product.description && (
                  <p className="text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4">
                    {product.description}
                  </p>
                )}
              </div>

              {/* CTA */}
              <div className="mt-6">
                <button
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    isOutOfStock
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 text-white cursor-pointer shadow-sm hover:shadow-md"
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* More from same shop */}
        {shopProducts.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Store className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-bold text-gray-800">More from {product.shopName}</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {shopProducts.map((p) => (
                <MiniCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MiniCard({ product }) {
  const router = useRouter();
  const { addToCart } = useCart();

  const isOutOfStock = product.instock === false;
  const hasDiscount  = product.originalPrice && product.originalPrice > product.price;
  const discountPct  = hasDiscount ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

  const handleAdd = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart({ ...product, id: product._id });
    toast.success(`${product.name} added to cart`, {
      duration: 2000,
      style: { borderRadius: "10px", background: "#333", color: "#fff" },
    });
  };

  return (
    <div
      onClick={() => router.push(`/product/${product._id}`)}
      className="bg-white rounded-xl border border-gray-200 p-3 cursor-pointer hover:border-green-300 hover:shadow-md transition-all duration-200 flex flex-col group"
    >
      <div className="relative h-32 bg-gray-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.name} className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300 p-2" />
        ) : (
          <Package className="w-8 h-8 text-gray-200" />
        )}
        {discountPct && !isOutOfStock && (
          <span className="absolute top-1.5 right-1.5 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">-{discountPct}%</span>
        )}
        {isOutOfStock && (
          <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">Out</span>
        )}
      </div>
      <p className="text-sm font-semibold text-gray-800 line-clamp-1 mb-1 group-hover:text-green-700 transition-colors">{product.name}</p>
      <p className="text-sm font-bold text-gray-900 mb-2">Rs. {product.price?.toFixed(2)}</p>
      <button
        onClick={handleAdd}
        disabled={isOutOfStock}
        className={`mt-auto w-full py-1.5 rounded-lg text-xs font-semibold transition-all ${
          isOutOfStock ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-white cursor-pointer"
        }`}
      >
        {isOutOfStock ? "Out of stock" : "Add to Cart"}
      </button>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 md:px-16 py-3 h-12" />
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
          <div className="grid md:grid-cols-2">
            <div className="bg-gray-100 h-80" />
            <div className="p-8 flex flex-col gap-4">
              <div className="h-4 bg-gray-100 rounded w-1/3" />
              <div className="h-8 bg-gray-100 rounded w-3/4" />
              <div className="h-10 bg-gray-100 rounded w-1/2" />
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-5/6" />
              <div className="h-12 bg-gray-100 rounded-xl mt-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}