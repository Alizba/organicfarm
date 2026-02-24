// src/components/home/ShopInterestModal.jsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { X, Store, CheckCircle } from "lucide-react";

export default function ShopInterestModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", shopName: "", shopDescription: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Lock body scroll when modal open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("/api/shop-interest", form);
      setSubmitted(true);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset after close animation
    setTimeout(() => { setSubmitted(false); setForm({ fullName: "", email: "", phone: "", shopName: "", shopDescription: "" }); }, 300);
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500;600&display=swap');
        .modal-font { font-family: 'Jost', sans-serif; }
        .modal-serif { font-family: 'Cormorant Garamond', serif; }
        @keyframes backdropIn { from { opacity:0; } to { opacity:1; } }
        @keyframes modalIn { from { opacity:0; transform:translateY(24px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes successIn { from { opacity:0; transform:scale(0.8); } to { opacity:1; transform:scale(1); } }
        @keyframes spin { to { transform:rotate(360deg); } }
        .backdrop-anim { animation: backdropIn 0.2s ease both; }
        .modal-anim { animation: modalIn 0.3s cubic-bezier(0.34,1.2,0.64,1) both; }
        .success-anim { animation: successIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
        .spinner { animation: spin 0.7s linear infinite; }
        .modal-input {
          width: 100%; padding: 10px 14px; border-radius: 10px;
          border: 1.5px solid #e5e7eb; background: #fafaf9;
          font-size: 14px; color: #1a2e1a; outline: none;
          font-family: 'Jost', sans-serif;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
        }
        .modal-input:focus {
          border-color: #64a828; box-shadow: 0 0 0 3px rgba(100,168,40,0.12);
          background: white;
        }
        .modal-input::placeholder { color: #d1d5db; }
      `}</style>

      {/* Backdrop */}
      <div
        className="backdrop-anim fixed inset-0 z-100 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={handleClose}
      >
        {/* Modal */}
        <div
          className="modal-anim modal-font relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top accent bar */}
          <div className="h-1 w-full bg-linear-to-r from-green-400 via-green-600 to-green-800" />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-all z-10"
          >
            <X size={18} />
          </button>

          {submitted ? (
            // ── Success State ──────────────────────────────────────────────
            <div className="success-anim flex flex-col items-center justify-center py-14 px-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h3 className="modal-serif text-3xl font-semibold text-[#1a3820] mb-2">
                Request Received!
              </h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-6 max-w-xs">
                Thank you for your interest! Our team will review your application and get back to you at <strong>{form.email}</strong> shortly.
              </p>
              <button
                onClick={handleClose}
                className="bg-[#1a3820] hover:bg-[#244d2a] text-white px-8 py-3 rounded-xl text-sm font-semibold transition-all hover:shadow-lg"
              >
                Done
              </button>
            </div>
          ) : (
            // ── Form State ─────────────────────────────────────────────────
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-11 h-11 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center shrink-0">
                  <Store size={20} className="text-green-700" />
                </div>
                <div>
                  <h2 className="modal-serif text-2xl font-semibold text-[#1a3820]">
                    Open Your Shop
                  </h2>
                  <p className="text-stone-500 text-xs mt-1 leading-relaxed">
                    Fill in your details and we'll reach out to get you set up as a seller.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Name + Email */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wide text-[#3a5a2a] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      className="modal-input"
                      name="fullName" type="text"
                      placeholder="Ali Hassan"
                      value={form.fullName} onChange={handleChange} required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wide text-[#3a5a2a] mb-1.5">
                      Phone
                    </label>
                    <input
                      className="modal-input"
                      name="phone" type="tel"
                      placeholder="03XX-XXXXXXX"
                      value={form.phone} onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wide text-[#3a5a2a] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    className="modal-input"
                    name="email" type="email"
                    placeholder="you@example.com"
                    value={form.email} onChange={handleChange} required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wide text-[#3a5a2a] mb-1.5">
                    Shop Name *
                  </label>
                  <input
                    className="modal-input"
                    name="shopName" type="text"
                    placeholder="e.g. Green Valley Organics"
                    value={form.shopName} onChange={handleChange} required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wide text-[#3a5a2a] mb-1.5">
                    What will you sell?
                  </label>
                  <textarea
                    className="modal-input resize-none"
                    name="shopDescription"
                    rows={3}
                    placeholder="Describe your products, farm, or business..."
                    value={form.shopDescription}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-[#1a3820] hover:bg-[#244d2a] text-white py-3.5 rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-1"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinner inline-block" />
                      Submitting…
                    </>
                  ) : "Submit Interest →"}
                </button>

                <p className="text-center text-xs text-stone-400">
                  No account needed. We'll contact you directly.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}