"use client";

import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Leaf } from "lucide-react";

export default function CartPage() {
  const { cart, cartTotal, cartCount, removeFromCart, updateQuantity } = useCart();

  const DELIVERY_FEE = cartTotal >= 2000 ? 0 : 150;
  const total = cartTotal + DELIVERY_FEE;

  if (cart.length === 0) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500;600&display=swap');
          .font-cormorant { font-family: 'Cormorant Garamond', serif; }
          .font-jost { font-family: 'Jost', sans-serif; }
          @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
          .fade-up { animation: fadeUp 0.5s ease both; }
        `}</style>
        <div className="font-jost min-h-[70vh] flex flex-col items-center justify-center bg-stone-50 px-4">
          <div className="fade-up text-center">
            <div className="w-24 h-24 rounded-full bg-green-50 border-2 border-green-100 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={36} className="text-green-400" />
            </div>
            <h1 className="font-cormorant text-4xl font-semibold text-[#1a3820] mb-3">Your cart is empty</h1>
            <p className="text-stone-500 text-sm mb-8 max-w-xs mx-auto">
              Looks like you haven't added anything yet. Explore our fresh organic produce!
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#1a3820] text-white px-8 py-3.5 rounded-xl text-sm font-medium hover:bg-[#244d2a] transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              Browse Shop <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500;600&display=swap');
        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        .font-jost { font-family: 'Jost', sans-serif; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.45s ease both; }
        .item-row { transition: all 0.2s ease; }
        .item-row:hover { background: #f9fafb; }
        .qty-btn { transition: all 0.15s ease; }
        .qty-btn:hover { background: #1a3820; color: white; }
        .remove-btn { transition: all 0.15s ease; }
        .remove-btn:hover { color: #dc2626; }
      `}</style>

      <div className="font-jost min-h-screen bg-stone-50">
        {/* Header */}
        <div className="bg-white border-b border-stone-200">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
            <div className="fade-up flex items-center gap-3">
              <Leaf size={20} className="text-green-600" />
              <p className="text-xs font-medium tracking-[2px] uppercase text-green-600">Shopping Cart</p>
            </div>
            <h1 className="fade-up font-cormorant text-4xl md:text-5xl font-semibold text-[#1a3820] mt-2">
              Your Cart <span className="text-stone-400 text-3xl">({cartCount} {cartCount === 1 ? "item" : "items"})</span>
            </h1>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3">
              {cart.map((item, i) => (
                <div
                  key={item.id}
                  className="item-row fade-up bg-white border border-stone-200 rounded-2xl p-4 flex gap-4"
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center shrink-0 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <span className="text-3xl">🥦</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-[#1a2e1a] text-sm leading-tight truncate">{item.name}</h3>
                        {item.category && (
                          <span className="text-xs text-stone-400 mt-0.5 block">
                            {item.category?.label || item.category?.name || item.category}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="remove-btn text-stone-300 p-1 rounded-lg shrink-0"
                        aria-label="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1 border border-stone-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="qty-btn w-8 h-8 flex items-center justify-center text-stone-600 rounded-l-lg"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-[#1a2e1a]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="qty-btn w-8 h-8 flex items-center justify-center text-stone-600 rounded-r-lg"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="font-semibold text-[#1a3820] text-sm">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-xs text-stone-400">Rs. {item.price} each</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-sm text-green-700 font-medium hover:text-green-900 transition-colors mt-2"
              >
                ← Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="fade-up" style={{ animationDelay: "0.2s" }}>
              <div className="bg-white border border-stone-200 rounded-2xl p-6 sticky top-24">
                <h2 className="font-cormorant text-2xl font-semibold text-[#1a3820] mb-5">Order Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal ({cartCount} items)</span>
                    <span className="font-medium text-[#1a2e1a]">Rs. {cartTotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-stone-600">
                    <span>Delivery Fee</span>
                    {DELIVERY_FEE === 0 ? (
                      <span className="text-green-600 font-semibold">FREE</span>
                    ) : (
                      <span className="font-medium text-[#1a2e1a]">Rs. {DELIVERY_FEE}</span>
                    )}
                  </div>

                  {DELIVERY_FEE > 0 && (
                    <div className="bg-green-50 border border-green-100 rounded-lg px-3 py-2 text-xs text-green-700">
                      Add Rs. {(2000 - cartTotal).toLocaleString()} more for free delivery
                    </div>
                  )}

                  <div className="border-t border-stone-200 pt-3 mt-1 flex justify-between font-semibold text-[#1a2e1a]">
                    <span>Total</span>
                    <span className="text-lg">Rs. {total.toLocaleString()}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="mt-6 w-full flex items-center justify-center gap-2 bg-[#1a3820] hover:bg-[#244d2a] text-white py-3.5 rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  Proceed to Checkout <ArrowRight size={16} />
                </Link>

                {/* Trust badges */}
                <div className="mt-5 pt-4 border-t border-stone-100 grid grid-cols-3 gap-2 text-center">
                  {[
                    { icon: "🔒", label: "Secure" },
                    { icon: "🌿", label: "Organic" },
                    { icon: "🚚", label: "Fast" },
                  ].map((b) => (
                    <div key={b.label} className="flex flex-col items-center gap-1">
                      <span className="text-lg">{b.icon}</span>
                      <span className="text-[10px] text-stone-400 font-medium">{b.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}