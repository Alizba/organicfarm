"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreed: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return;
    setIsLoading(true);
    
    setTimeout(() => setIsLoading(false), 1500);
  };

  // Password strength helper
  const getStrength = (pwd) => {
    if (!pwd) return null;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;
    const levels = [
      { label: "Weak",   color: "bg-red-400",    text: "text-red-500",    w: "w-1/4" },
      { label: "Fair",   color: "bg-amber-400",   text: "text-amber-600",  w: "w-2/4" },
      { label: "Good",   color: "bg-[#7fc93e]",   text: "text-[#5a8a20]", w: "w-3/4" },
      { label: "Strong", color: "bg-[#2d6a10]",   text: "text-[#2d6a10]", w: "w-full" },
    ];
    return levels[score - 1] || null;
  };

  const strength = getStrength(formData.password);
  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;
  const passwordsMismatch =
    formData.confirmPassword.length > 0 &&
    formData.password !== formData.confirmPassword;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Jost:wght@300;400;500&display=swap');
        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        .font-jost      { font-family: 'Jost', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-fade-up { animation: fadeUp 0.55s ease both; }
        .delay-1 { animation-delay: 0.06s; }
        .delay-2 { animation-delay: 0.12s; }
        .delay-3 { animation-delay: 0.18s; }
        .delay-4 { animation-delay: 0.24s; }
        .delay-5 { animation-delay: 0.30s; }
        .delay-6 { animation-delay: 0.36s; }
        .delay-7 { animation-delay: 0.42s; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { animation: spin 0.7s linear infinite; }
      `}</style>

      <div className="font-jost min-h-screen grid lg:grid-cols-2 bg-stone-50">

        {/* ── LEFT: Visual Panel ── */}
        <div className="relative hidden lg:flex flex-col items-center justify-center overflow-hidden bg-[#162e18]">
          {/* Radial glows */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_15%_10%,rgba(120,185,55,0.2)_0%,transparent_58%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_75%_at_90%_90%,rgba(30,70,20,0.65)_0%,transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_55%_48%,rgba(70,130,40,0.1)_0%,transparent_55%)]" />

          {/* Decorative leaves */}
          <div className="absolute -top-12 -left-12 text-[260px] opacity-[0.07] select-none pointer-events-none rotate-15">🍃</div>
          <div className="absolute -bottom-20 -right-10 text-[230px] opacity-[0.07] select-none pointer-events-none -rotate-20">🌿</div>
          <div className="absolute top-[45%] right-3 text-[100px] opacity-[0.06] select-none pointer-events-none rotate-10">🌱</div>

          <div className="relative z-10 flex flex-col items-center px-12 text-center">
            {/* Brand */}
            <div className="w-17 h-17 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm flex items-center justify-center text-3xl mb-7 shadow-lg">
              🌾
            </div>
            <h1 className="font-cormorant text-[48px] font-semibold leading-tight text-stone-100 mb-3 tracking-tight">
              Bio<em className="not-italic text-[#96d44e]">Prox</em>
            </h1>
            <p className="text-[11px] font-light tracking-[3px] uppercase text-white/40 mb-12">
              Farm · Fresh · Organic
            </p>

            {/* Perks list */}
            <div className="flex flex-col gap-4 w-full max-w-75 text-left">
              {[
                { icon: "🥦", title: "Certified Organic Only",    desc: "Every product is 100% certified — no exceptions." },
                { icon: "🚚", title: "Free Delivery Over $40",     desc: "Same-week delivery, fresh from the farm." },
                { icon: "♻️", title: "Zero-Waste Packaging",      desc: "Compostable and fully recyclable materials." },
                { icon: "💚", title: "Member Rewards",            desc: "Earn points on every order, redeem for free produce." },
              ].map((perk) => (
                <div
                  key={perk.title}
                  className="flex items-start gap-3.5 bg-white/ border border-white/10 rounded-xl px-4 py-3.5 backdrop-blur-sm"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#96d44e]/15 flex items-center justify-center text-lg shrink-0">
                    {perk.icon}
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-stone-100">{perk.title}</div>
                    <div className="text-[11.5px] text-white/45 font-light mt-0.5 leading-relaxed">{perk.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Form Panel ── */}
        <div className="flex items-start justify-center px-6 py-12 sm:px-14 overflow-y-auto">
          <div className="w-full max-w-100">

            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8">
              <span className="font-cormorant text-3xl font-semibold text-[#162e18]">
                Bio<em className="not-italic text-[#5a9a30]">Prox</em>
              </span>
            </div>

            {/* Heading */}
            <div className="anim-fade-up mb-8">
              <p className="text-[11px] font-medium tracking-[2.5px] uppercase text-[#64a828] mb-2">
                Join our community
              </p>
              <h2 className="font-cormorant text-[38px] font-semibold text-[#1a2e1a] leading-[1.1]">
                Create your<br />free account
              </h2>
              <p className="text-sm text-stone-500 font-light mt-3">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[#3a7a18] font-medium border-b border-[#3a7a18]/30 hover:border-[#3a7a18] transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Name row */}
              <div className="anim-fade-up delay-1 grid grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="firstName" className="block text-[11px] font-medium tracking-[0.8px] uppercase text-[#3a5a2a] mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-[14px] pointer-events-none select-none">👤</span>
                    <input
                      id="firstName"
                      type="text"
                      name="firstName"
                      placeholder="Jane"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full pl-9 pr-3 py-3 rounded-xl border border-stone-200 bg-white text-[#1a2e1a] text-sm placeholder-stone-300 outline-none transition-all focus:border-[#64a828] focus:ring-2 focus:ring-[#64a828]/15 hover:border-stone-300"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-[11px] font-medium tracking-[0.8px] uppercase text-[#3a5a2a] mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-[14px] pointer-events-none select-none">👤</span>
                    <input
                      id="lastName"
                      type="text"
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full pl-9 pr-3 py-3 rounded-xl border border-stone-200 bg-white text-[#1a2e1a] text-sm placeholder-stone-300 outline-none transition-all focus:border-[#64a828] focus:ring-2 focus:ring-[#64a828]/15 hover:border-stone-300"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="anim-fade-up delay-2">
                <label htmlFor="email" className="block text-[11px] font-medium tracking-[0.8px] uppercase text-[#3a5a2a] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-[14px] pointer-events-none select-none">✉</span>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-white text-[#1a2e1a] text-sm placeholder-stone-300 outline-none transition-all focus:border-[#64a828] focus:ring-2 focus:ring-[#64a828]/15 hover:border-stone-300"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="anim-fade-up delay-3">
                <label htmlFor="phone" className="block text-[11px] font-medium tracking-[0.8px] uppercase text-[#3a5a2a] mb-2">
                  Phone Number{" "}
                  <span className="normal-case tracking-normal text-stone-400 font-light">· optional</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-[14px] pointer-events-none select-none">📞</span>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-white text-[#1a2e1a] text-sm placeholder-stone-300 outline-none transition-all focus:border-[#64a828] focus:ring-2 focus:ring-[#64a828]/15 hover:border-stone-300"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="anim-fade-up delay-4">
                <label htmlFor="password" className="block text-[11px] font-medium tracking-[0.8px] uppercase text-[#3a5a2a] mb-2">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-[14px] pointer-events-none select-none">🔒</span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-stone-200 bg-white text-[#1a2e1a] text-sm placeholder-stone-300 outline-none transition-all focus:border-[#64a828] focus:ring-2 focus:ring-[#64a828]/15 hover:border-stone-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#3a7a18] transition-colors text-base"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>

                {/* Strength bar */}
                {strength && (
                  <div className="mt-2 space-y-1">
                    <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.w}`} />
                    </div>
                    <span className={`text-[11px] font-medium ${strength.text}`}>{strength.label}</span>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div className="anim-fade-up delay-5">
                <label htmlFor="confirmPassword" className="block text-[11px] font-medium tracking-[0.8px] uppercase text-[#3a5a2a] mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-[14px] pointer-events-none select-none">🔐</span>
                  <input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className={`w-full pl-10 pr-11 py-3 rounded-xl border bg-white text-[#1a2e1a] text-sm placeholder-stone-300 outline-none transition-all hover:border-stone-300
                      ${passwordsMismatch ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/15" : ""}
                      ${passwordsMatch   ? "border-[#64a828] focus:border-[#64a828] focus:ring-2 focus:ring-[#64a828]/15" : ""}
                      ${!passwordsMatch && !passwordsMismatch ? "border-stone-200 focus:border-[#64a828] focus:ring-2 focus:ring-[#64a828]/15" : ""}
                    `}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#3a7a18] transition-colors text-base"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirm ? "🙈" : "👁"}
                  </button>
                </div>
                {passwordsMismatch && (
                  <p className="text-[11.5px] text-red-500 mt-1.5">Passwords do not match</p>
                )}
                {passwordsMatch && (
                  <p className="text-[11.5px] text-[#3a7a18] mt-1.5">✓ Passwords match</p>
                )}
              </div>

              {/* Terms */}
              <div className="anim-fade-up delay-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreed"
                    checked={formData.agreed}
                    onChange={handleChange}
                    required
                    className="w-4 h-4 mt-0.5 rounded accent-[#64a828] cursor-pointer shrink-0"
                  />
                  <span className="text-[13px] text-stone-600 font-light leading-relaxed">
                    I agree to the{" "}
                    <a href="#" className="text-[#3a7a18] font-medium border-b border-[#3a7a18]/30 hover:border-[#3a7a18] transition-colors">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-[#3a7a18] font-medium border-b border-[#3a7a18]/30 hover:border-[#3a7a18] transition-colors">
                      Privacy Policy
                    </a>
                    . I consent to receive order updates via email.
                  </span>
                </label>
              </div>

              {/* Submit */}
              <div className="anim-fade-up delay-7 pt-1">
                <button
                  type="submit"
                  disabled={isLoading || !formData.agreed || passwordsMismatch}
                  className="w-full py-3.5 bg-[#162e18] hover:bg-[#1f3f22] text-stone-100 text-[15px] font-medium rounded-xl transition-all duration-200 hover:shadow-[0_8px_28px_rgba(22,46,24,0.35)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-55 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading && (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinner inline-block" />
                  )}
                  {isLoading ? "Creating account…" : "Create Account →"}
                </button>
              </div>

              {/* Divider */}
              <div className="anim-fade-up delay-7 flex items-center gap-3">
                <div className="flex-1 h-px bg-stone-200" />
                <span className="text-[12px] text-stone-400 whitespace-nowrap">or sign up with</span>
                <div className="flex-1 h-px bg-stone-200" />
              </div>

              {/* Social */}
              <div className="anim-fade-up delay-7 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2.5 py-3.5 border border-stone-200 rounded-xl bg-white text-[#1a2e1a] text-sm font-medium hover:border-[#64a828] hover:bg-[#f4fbee] transition-all"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2.5 py-3.5 border border-stone-200 rounded-xl bg-white text-[#1a2e1a] text-sm font-medium hover:border-[#64a828] hover:bg-[#f4fbee] transition-all"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  Apple
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </>
  );
}