"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import AuthModal from "@/components/auth/AuthModal";

export default function CheckoutPage() {
  const { cart, cartTotal, checkout, orderSuccess } = useCart();
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();

  const DELIVERY_FEE = cartTotal >= 2000 ? 0 : 150;
  const grandTotal   = cartTotal + DELIVERY_FEE;

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false); // retry after login
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "", email: "", phone: "",
    street: "", city: "", province: "", zip: "",
    paymentMethod: "cod", notes: "",
  });

  // ── Auto-fill email from logged-in user ──────────────────────────────────
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        email:    prev.email    || user.email    || "",
        fullName: prev.fullName || user.userName || "",
      }));
    }
  }, [user]);

  // ── After login/register, auto-continue checkout if user had tried ───────
  useEffect(() => {
    if (isLoggedIn && pendingSubmit) {
      setPendingSubmit(false);
      placeOrder();
    }
  }, [isLoggedIn, pendingSubmit]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // ── Validate form fields ──────────────────────────────────────────────────
  const validate = () => {
    if (!form.fullName.trim()) { toast.error("Please enter your full name.");    return false; }
    if (!form.email.trim())    { toast.error("Please enter your email.");        return false; }
    if (!form.street.trim())   { toast.error("Please enter your street address."); return false; }
    if (!form.city.trim())     { toast.error("Please enter your city.");         return false; }
    return true;
  };

  // ── Main place order function ─────────────────────────────────────────────
  const placeOrder = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await checkout({
        customer:      { fullName: form.fullName, email: form.email, phone: form.phone },
        address:       { street: form.street, city: form.city, province: form.province, zip: form.zip },
        paymentMethod: form.paymentMethod,
        notes:         form.notes,
      });
      toast.success("Order placed successfully! 🎉");
      router.push("/order-success");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Form submit — gate behind auth ───────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Not logged in → show auth modal, remember to retry after login
    if (!isLoggedIn) {
      setPendingSubmit(true);
      setShowAuthModal(true);
      return;
    }

    await placeOrder();
  };

  // ── Auth modal success ────────────────────────────────────────────────────
  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // pendingSubmit useEffect will fire placeOrder automatically
  };

  // ── Empty cart state ──────────────────────────────────────────────────────
  if (cart.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="text-5xl mb-4">🛒</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some products before checking out.</p>
          <button
            onClick={() => router.push("/")}
            className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition-colors"
          >
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── Auth Modal ────────────────────────────────────────────────────── */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => { setShowAuthModal(false); setPendingSubmit(false); }}
        onSuccess={handleAuthSuccess}
        defaultTab="login"
      />

      <div className="min-h-screen bg-stone-50 py-10 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Page header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>

            {/* Show logged-in user pill or "Sign in" prompt */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2">
                <span className="text-green-600 text-sm">✓</span>
                <span className="text-sm font-medium text-green-700">{user.userName}</span>
                <span className="text-xs text-green-500 bg-green-100 px-2 py-0.5 rounded-full capitalize">{user.role}</span>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="text-sm text-[#1a3820] border border-[#1a3820]/20 bg-white px-4 py-2 rounded-xl hover:bg-[#1a3820] hover:text-white transition-all duration-200 font-medium cursor-pointer"
              >
                Sign in to your account
              </button>
            )}
          </div>

          {/* Guest notice — only shown when not logged in */}
          {!isLoggedIn && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 mb-6 flex items-center gap-3">
              <span className="text-amber-500 text-lg">ℹ️</span>
              <p className="text-sm text-amber-700">
                You can fill in your details now.{" "}
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="font-semibold underline hover:no-underline cursor-pointer"
                >
                  Sign in or create an account
                </button>{" "}
                to complete your order.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Form ─────────────────────────────────────────────────── */}
            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">

              {/* Contact Info */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: "fullName", label: "Full Name *",   placeholder: "John Doe",           span: true },
                    { name: "email",    label: "Email *",        placeholder: "john@example.com",   type: "email" },
                    { name: "phone",    label: "Phone Number",   placeholder: "+92 300 0000000" },
                  ].map((f) => (
                    <div key={f.name} className={f.span ? "sm:col-span-2" : ""}>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{f.label}</label>
                      <input
                        name={f.name} type={f.type || "text"} placeholder={f.placeholder}
                        value={form[f.name]} onChange={handleChange}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 transition-all"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Delivery Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: "street",   label: "Street Address *", placeholder: "123 Main Street", span: true },
                    { name: "city",     label: "City *",            placeholder: "Karachi" },
                    { name: "province", label: "Province",          placeholder: "Sindh" },
                    { name: "zip",      label: "ZIP Code",          placeholder: "75500" },
                  ].map((f) => (
                    <div key={f.name} className={f.span ? "sm:col-span-2" : ""}>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{f.label}</label>
                      <input
                        name={f.name} placeholder={f.placeholder}
                        value={form[f.name]} onChange={handleChange}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 transition-all"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Method</h2>
                <div className="flex gap-3">
                  {[
                    { value: "cod",    label: "Cash on Delivery", icon: "💵" },
                    { value: "card",   label: "Card",             icon: "💳" },
                    { value: "online", label: "Online Transfer",  icon: "📱" },
                  ].map((p) => (
                    <label key={p.value} className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      form.paymentMethod === p.value
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}>
                      <input
                        type="radio" name="paymentMethod" value={p.value}
                        checked={form.paymentMethod === p.value} onChange={handleChange}
                        className="hidden"
                      />
                      <span className="text-2xl">{p.icon}</span>
                      <span className="text-xs font-semibold text-gray-700">{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Order Notes <span className="text-gray-400 font-normal text-sm">(optional)</span>
                </h2>
                <textarea
                  name="notes" placeholder="Any special instructions..."
                  value={form.notes} onChange={handleChange} rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 transition-all resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-2xl transition-all duration-200 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed text-base cursor-pointer"
              >
                {loading
                  ? "Placing Order…"
                  : isLoggedIn
                  ? `Place Order · Rs. ${grandTotal.toLocaleString()}`
                  : `Sign In & Place Order · Rs. ${grandTotal.toLocaleString()}`}
              </button>
            </form>

            {/* ── Order Summary ─────────────────────────────────────────── */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>

                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        {item.image ? (
                          item.image.startsWith("data:") ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          )
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg">📦</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                        {item.shopName && <p className="text-xs text-green-600">{item.shopName}</p>}
                        <p className="text-xs text-gray-500">x{item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-800">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 mt-4 pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>Rs. {cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery</span>
                    <span className={DELIVERY_FEE === 0 ? "text-green-600 font-medium" : ""}>
                      {DELIVERY_FEE === 0 ? "Free" : `Rs. ${DELIVERY_FEE}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-800 text-base pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span>Rs. {grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                {DELIVERY_FEE > 0 && (
                  <p className="text-xs text-gray-400 mt-3 text-center">
                    Add Rs. {(2000 - cartTotal).toLocaleString()} more for free delivery
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}