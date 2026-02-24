"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Leaf, CheckCircle, ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
  const { cart, cartTotal, checkout, orderSuccess } = useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const DELIVERY_FEE = cartTotal >= 2000 ? 0 : 150;
  const total = cartTotal + DELIVERY_FEE;

  const [form, setForm] = useState({
    fullName:      "",
    email:         "",
    phone:         "",
    street:        "",
    city:          "",
    state:         "",
    zip:           "",
    paymentMethod: "cod",
    notes:         "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsLoading(true);
    try {
      await checkout({
        customer: {
          fullName: form.fullName,
          email:    form.email,
          phone:    form.phone,
        },
        address: {
          street:  form.street,
          city:    form.city,
          state:   form.state,
          zip:     form.zip,
        },
        paymentMethod: form.paymentMethod,
        notes:         form.notes,
      });
      toast.success("Order placed successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500;600&display=swap');
          .font-cormorant { font-family: 'Cormorant Garamond', serif; }
          .font-jost { font-family: 'Jost', sans-serif; }
          @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
          @keyframes scaleIn { from { opacity:0; transform:scale(0.7); } to { opacity:1; transform:scale(1); } }
          .fade-up { animation: fadeUp 0.5s ease both; }
          .scale-in { animation: scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
        `}</style>
        <div className="font-jost min-h-[80vh] flex items-center justify-center bg-stone-50 px-4">
          <div className="text-center max-w-md">
            <div className="scale-in w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h1 className="fade-up font-cormorant text-4xl font-semibold text-[#1a3820] mb-3">
              Order Placed!
            </h1>
            <p className="fade-up text-stone-500 text-sm mb-2">
              Thank you for your order. We've received it and will process it shortly.
            </p>
            <p className="fade-up text-xs text-stone-400 mb-8 font-mono bg-stone-100 px-3 py-2 rounded-lg inline-block">
              Order ID: {String(orderSuccess).slice(-8).toUpperCase()}
            </p>
            <div className="fade-up flex gap-3 justify-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-[#1a3820] text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-[#244d2a] transition-all"
              >
                Back to Home
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 border border-stone-200 text-stone-700 px-6 py-3 rounded-xl text-sm font-medium hover:bg-stone-50 transition-all"
              >
                Shop More
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (cart.length === 0) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&display=swap');
          .font-jost { font-family: 'Jost', sans-serif; }
        `}</style>
        <div className="font-jost min-h-[60vh] flex flex-col items-center justify-center bg-stone-50 px-4 text-center">
          <p className="text-stone-500 mb-4">Your cart is empty. Add some products first.</p>
          <Link href="/shop" className="bg-[#1a3820] text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-[#244d2a] transition-all">
            Go to Shop
          </Link>
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
        .d1 { animation-delay: 0.05s; } .d2 { animation-delay: 0.1s; }
        .d3 { animation-delay: 0.15s; } .d4 { animation-delay: 0.2s; }
        .input-field {
          width: 100%; padding: 10px 14px; border-radius: 10px;
          border: 1px solid #e5e7eb; background: white;
          font-size: 14px; color: #1a2e1a; outline: none;
          font-family: 'Jost', sans-serif;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .input-field:focus { border-color: #64a828; box-shadow: 0 0 0 3px rgba(100,168,40,0.12); }
        .input-field::placeholder { color: #d1d5db; }
        .section-label { font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #6b7280; margin-bottom: 14px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { animation: spin 0.7s linear infinite; }
      `}</style>

      <div className="font-jost min-h-screen bg-stone-50">
        {/* Header */}
        <div className="bg-white border-b border-stone-200">
          <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
            <div className="fade-up flex items-center gap-3 mb-2">
              <Leaf size={16} className="text-green-600" />
              <p className="text-xs font-medium tracking-[2px] uppercase text-green-600">Checkout</p>
            </div>
            <div className="flex items-center justify-between">
              <h1 className="fade-up font-cormorant text-4xl font-semibold text-[#1a3820]">
                Complete Your Order
              </h1>
              <Link href="/cart" className="fade-up flex items-center gap-1.5 text-sm text-stone-500 hover:text-[#1a3820] transition-colors">
                <ArrowLeft size={14} /> Back to Cart
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">

              {/* Left: Form Fields */}
              <div className="lg:col-span-2 space-y-6">

                {/* Contact Info */}
                <div className="fade-up d1 bg-white border border-stone-200 rounded-2xl p-6">
                  <p className="section-label">Contact Information</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-[#3a5a2a] mb-1.5">Full Name *</label>
                      <input
                        className="input-field"
                        name="fullName" type="text"
                        placeholder="Ali Hassan"
                        value={form.fullName} onChange={handleChange} required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#3a5a2a] mb-1.5">Email Address *</label>
                      <input
                        className="input-field"
                        name="email" type="email"
                        placeholder="ali@example.com"
                        value={form.email} onChange={handleChange} required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#3a5a2a] mb-1.5">Phone Number</label>
                      <input
                        className="input-field"
                        name="phone" type="tel"
                        placeholder="03XX-XXXXXXX"
                        value={form.phone} onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="fade-up d2 bg-white border border-stone-200 rounded-2xl p-6">
                  <p className="section-label">Delivery Address</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-[#3a5a2a] mb-1.5">Street Address *</label>
                      <input
                        className="input-field"
                        name="street" type="text"
                        placeholder="House # , Street, Area"
                        value={form.street} onChange={handleChange} required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#3a5a2a] mb-1.5">City *</label>
                      <input
                        className="input-field"
                        name="city" type="text"
                        placeholder="Lahore"
                        value={form.city} onChange={handleChange} required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#3a5a2a] mb-1.5">State / Province</label>
                      <input
                        className="input-field"
                        name="state" type="text"
                        placeholder="Punjab"
                        value={form.state} onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#3a5a2a] mb-1.5">Postal Code</label>
                      <input
                        className="input-field"
                        name="zip" type="text"
                        placeholder="54000"
                        value={form.zip} onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="fade-up d3 bg-white border border-stone-200 rounded-2xl p-6">
                  <p className="section-label">Payment Method</p>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {[
                      { value: "cod",           label: "Cash on Delivery", icon: "💵" },
                      { value: "card",          label: "Card Payment",     icon: "💳" },
                      { value: "bank_transfer", label: "Bank Transfer",    icon: "🏦" },
                    ].map((method) => (
                      <label
                        key={method.value}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          form.paymentMethod === method.value
                            ? "border-[#64a828] bg-green-50"
                            : "border-stone-200 hover:border-stone-300"
                        }`}
                      >
                        <input
                          type="radio" name="paymentMethod"
                          value={method.value}
                          checked={form.paymentMethod === method.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <span className="text-xl">{method.icon}</span>
                        <span className="text-xs font-semibold text-[#1a2e1a] leading-tight">{method.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

            
                <div className="fade-up d4 bg-white border border-stone-200 rounded-2xl p-6">
                  <p className="section-label">Order Notes (Optional)</p>
                  <textarea
                    className="input-field resize-none"
                    name="notes"
                    rows={3}
                    placeholder="Any special instructions for delivery..."
                    value={form.notes}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Right: Order Summary */}
              <div className="fade-up d2">
                <div className="bg-white border border-stone-200 rounded-2xl p-6 sticky top-24">
                  <h2 className="font-cormorant text-2xl font-semibold text-[#1a3820] mb-4">
                    Order Summary
                  </h2>

                  {/* Items */}
                  <div className="space-y-3 mb-4 max-h-52 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center shrink-0 overflow-hidden">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <span className="text-lg">🥦</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-[#1a2e1a] truncate">{item.name}</p>
                          <p className="text-xs text-stone-400">x{item.quantity}</p>
                        </div>
                        <span className="text-xs font-semibold text-[#1a3820]">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-stone-100 pt-4 space-y-2 text-sm">
                    <div className="flex justify-between text-stone-500">
                      <span>Subtotal</span>
                      <span className="font-medium text-[#1a2e1a]">Rs. {cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-stone-500">
                      <span>Delivery</span>
                      {DELIVERY_FEE === 0 ? (
                        <span className="text-green-600 font-semibold">FREE</span>
                      ) : (
                        <span className="font-medium text-[#1a2e1a]">Rs. {DELIVERY_FEE}</span>
                      )}
                    </div>
                    <div className="flex justify-between font-bold text-[#1a2e1a] text-base pt-2 border-t border-stone-100">
                      <span>Total</span>
                      <span>Rs. {total.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-5 w-full flex items-center justify-center gap-2 bg-[#1a3820] hover:bg-[#244d2a] text-white py-3.5 rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinner inline-block" />
                        Placing Order…
                      </>
                    ) : (
                      <>Place Order — Rs. {total.toLocaleString()}</>
                    )}
                  </button>

                  <p className="text-center text-xs text-stone-400 mt-3">
                    🔒 Your information is safe with us
                  </p>
                </div>
              </div>

            </div>
          </form>
        </div>
      </div>
    </>
  );
}