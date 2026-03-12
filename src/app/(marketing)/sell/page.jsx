"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Store, CheckCircle, Eye, EyeOff, Leaf, ShieldCheck, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function SellPage() {
  const [form, setForm] = useState({
    fullName: "", userName: "", email: "",
    phone: "", password: "", shopName: "", shopDescription: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [submitted, setSubmitted]       = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
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

  const PERKS = [
    { icon: Leaf,        title: "Organic First",    desc: "Join a marketplace dedicated to clean, chemical-free produce." },
    { icon: TrendingUp,  title: "Grow Your Reach",  desc: "Access thousands of customers who care about quality." },
    { icon: ShieldCheck, title: "Verified & Trusted",desc: "Every seller is reviewed before going live." },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500;600&display=swap');
        .sell-font  { font-family: 'Jost', sans-serif; }
        .sell-serif { font-family: 'Cormorant Garamond', serif; }
        .sell-input {
          width: 100%; padding: 11px 14px; border-radius: 10px;
          border: 1.5px solid #e5e7eb; background: #fafaf9;
          font-size: 14px; color: #1a2e1a; outline: none;
          font-family: 'Jost', sans-serif;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
          box-sizing: border-box;
        }
        .sell-input:focus {
          border-color: #4a7c2f; box-shadow: 0 0 0 3px rgba(74,124,47,0.1);
          background: white;
        }
        .sell-input::placeholder { color: #d1d5db; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin    { to { transform:rotate(360deg); } }
        @keyframes successIn { from { opacity:0; transform:scale(0.9); } to { opacity:1; transform:scale(1); } }
        .fade-up    { animation: fadeUp 0.5s ease both; }
        .spinner    { animation: spin 0.7s linear infinite; }
        .success-in { animation: successIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
      `}</style>

      <div className="sell-font" style={{ minHeight: "100vh", background: "#f7f9f4" }}>

        {/* Hero strip */}
        <div style={{
          background: "linear-gradient(135deg, #1a3820 0%, #2d5a1e 60%, #3a7a28 100%)",
          padding: "56px 24px 48px", textAlign: "center",
        }}>
          <p className="fade-up" style={{ fontSize: 11, letterSpacing: "0.45em", textTransform: "uppercase", color: "#86efac", marginBottom: 12, animationDelay: "0.05s" }}>
            Become a Seller
          </p>
          <h1 className="fade-up sell-serif" style={{ fontSize: "clamp(36px, 5vw, 56px)", color: "#fff", fontWeight: 600, lineHeight: 1.1, margin: "0 0 14px", animationDelay: "0.1s" }}>
            Open Your <em style={{ color: "#86efac" }}>Organic Shop</em>
          </h1>
          <p className="fade-up" style={{ color: "rgba(255,255,255,0.65)", fontSize: 15, maxWidth: 480, margin: "0 auto", lineHeight: 1.7, animationDelay: "0.15s" }}>
            Join our network of certified organic farmers and reach customers who value clean, sustainable produce.
          </p>
        </div>

        {/* Perks row */}
        <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
            {PERKS.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="fade-up" style={{ display: "flex", gap: 14, alignItems: "flex-start", animationDelay: `${0.2 + i * 0.08}s` }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#f0fdf4", border: "1px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={18} color="#16a34a" />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#1a3820", marginBottom: 3 }}>{title}</div>
                  <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form card */}
        <div style={{ maxWidth: 580, margin: "48px auto", padding: "0 24px 80px" }}>
          <div className="fade-up" style={{ background: "#fff", borderRadius: 20, boxShadow: "0 4px 32px rgba(0,0,0,0.08)", overflow: "hidden", animationDelay: "0.3s" }}>

            {/* Green top bar */}
            <div style={{ height: 4, background: "linear-gradient(to right, #4ade80, #16a34a, #14532d)" }} />

            {submitted ? (
              <div className="success-in" style={{ padding: "60px 32px", textAlign: "center" }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#f0fdf4", border: "2px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <CheckCircle size={36} color="#16a34a" />
                </div>
                <h3 className="sell-serif" style={{ fontSize: 32, color: "#1a3820", fontWeight: 600, margin: "0 0 10px" }}>
                  Application Received!
                </h3>
                <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.7, maxWidth: 340, margin: "0 auto 28px" }}>
                  Thank you! Our team will review your application. Once approved, you can log in with the username and password you provided.
                </p>
                <Link href="/" style={{
                  display: "inline-block", background: "#1a3820", color: "#fff",
                  padding: "12px 32px", borderRadius: 12, fontSize: 14,
                  fontWeight: 600, textDecoration: "none",
                }}>← Back to Home</Link>
              </div>
            ) : (
              <div style={{ padding: "32px 32px 36px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "#f0fdf4", border: "1px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Store size={20} color="#16a34a" />
                  </div>
                  <div>
                    <div className="sell-serif" style={{ fontSize: 22, fontWeight: 600, color: "#1a3820" }}>Your Details</div>
                    <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>Fill in the form below to apply as a seller.</div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                  {/* Full Name + Phone */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <Label>Full Name *</Label>
                      <input className="sell-input" name="fullName" type="text" placeholder="Ali Hassan" value={form.fullName} onChange={handleChange} required />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <input className="sell-input" name="phone" type="tel" placeholder="03XX-XXXXXXX" value={form.phone} onChange={handleChange} />
                    </div>
                  </div>

                  {/* Username */}
                  <div>
                    <Label>Username * <Hint>used to log in</Hint></Label>
                    <input className="sell-input" name="userName" type="text" placeholder="alihassan_shop" value={form.userName} onChange={handleChange} required />
                  </div>

                  {/* Email */}
                  <div>
                    <Label>Email Address *</Label>
                    <input className="sell-input" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
                  </div>

                  {/* Password */}
                  <div>
                    <Label>Password * <Hint>min 6 characters</Hint></Label>
                    <div style={{ position: "relative" }}>
                      <input className="sell-input" name="password" type={showPassword ? "text" : "password"} placeholder="Choose a secure password" value={form.password} onChange={handleChange} required style={{ paddingRight: 42 }} />
                      <button type="button" onClick={() => setShowPassword((v) => !v)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex" }}>
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Shop Name */}
                  <div>
                    <Label>Shop Name *</Label>
                    <input className="sell-input" name="shopName" type="text" placeholder="e.g. Green Valley Organics" value={form.shopName} onChange={handleChange} required />
                  </div>

                  {/* Description */}
                  <div>
                    <Label>What will you sell?</Label>
                    <textarea className="sell-input" name="shopDescription" rows={3} placeholder="Describe your products, farm, or business..." value={form.shopDescription} onChange={handleChange} style={{ resize: "vertical" }} />
                  </div>

                  <button type="submit" disabled={isLoading} style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: "#1a3820", color: "#fff", padding: "14px", borderRadius: 12,
                    fontSize: 14, fontWeight: 600, border: "none", cursor: isLoading ? "not-allowed" : "pointer",
                    opacity: isLoading ? 0.7 : 1, transition: "background 0.2s, transform 0.15s",
                    fontFamily: "inherit", marginTop: 4,
                  }}
                    onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.background = "#244d2a"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#1a3820"; }}
                  >
                    {isLoading ? (
                      <><span className="spinner" style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block" }} />Submitting…</>
                    ) : "Submit Application →"}
                  </button>

                  <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: 4 }}>
                    Your account will be created once our team approves your request.
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Label({ children }) {
  return <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#3a5a2a", marginBottom: 6 }}>{children}</label>;
}
function Hint({ children }) {
  return <span style={{ fontWeight: 400, textTransform: "none", color: "#9ca3af", marginLeft: 4 }}>{children}</span>;
}