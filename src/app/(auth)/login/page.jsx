"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    setButtonDisabled(!(formData.email.length > 0 && formData.password.length > 0));
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please enter your email and password.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post("/api/auth/login", formData);
      toast.success("Logged in successfully!");
      const role = res.data.role;
      if (role === "admin") router.push("/roles/admin");
      else if (role === "shopkeeper") router.push("/roles/shopkeeper");
      else router.push("/login"); // fallback — shouldn't happen
    } catch (err) {
      toast.error(err?.response?.data?.error || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Jost:wght@300;400;500&display=swap');
        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        .font-jost      { font-family: 'Jost', sans-serif; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        .anim-fade-up { animation: fadeUp 0.55s ease both; }
        .delay-1 { animation-delay: 0.08s; } .delay-2 { animation-delay: 0.16s; }
        .delay-3 { animation-delay: 0.24s; } .delay-4 { animation-delay: 0.32s; }
        .delay-5 { animation-delay: 0.40s; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { animation: spin 0.7s linear infinite; }
      `}</style>

      <div className="font-jost min-h-screen grid lg:grid-cols-2 bg-stone-50">

        {/* LEFT: Visual Panel */}
        <div className="relative hidden lg:flex flex-col items-center justify-center overflow-hidden bg-[#1a3820]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_20%_10%,rgba(130,190,65,0.22)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_70%_at_88%_88%,rgba(35,75,25,0.6)_0%,transparent_55%)]" />
          <div className="absolute -top-14 -right-14 text-[280px] opacity-[0.07] select-none pointer-events-none">🌿</div>
          <div className="absolute -bottom-20 -left-10 text-[240px] opacity-[0.07] select-none pointer-events-none">🍃</div>

          <div className="relative z-10 flex flex-col items-center px-14 text-center">
            <div className="w-17 h-17 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm flex items-center justify-center text-3xl mb-7 shadow-lg">
              🌾
            </div>
            <h1 className="font-cormorant text-[48px] font-semibold leading-tight text-stone-100 mb-3 tracking-tight">
              Bio<em className="not-italic text-[#96d44e]">Prox</em>
            </h1>
            <p className="text-[11px] font-light tracking-[3px] uppercase text-white/45 mb-12">
              Farm · Fresh · Organic
            </p>
            <div className="bg-white/[0.07] border border-white/12 rounded-2xl p-7 backdrop-blur-md max-w-75 text-left">
              <div className="text-[#96d44e] text-sm mb-3">★★★★★</div>
              <p className="font-cormorant italic text-white/85 text-[17px] leading-relaxed mb-5">
                "The difference in quality is something you can actually taste."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#96d44e] to-[#4a8a2a] flex items-center justify-center text-[#1a3820] font-semibold text-sm shrink-0">E</div>
                <div>
                  <div className="text-white text-[13px] font-medium leading-none">Emma R.</div>
                  <div className="text-white/40 text-[11px] mt-1">Member since 2022</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Form Panel */}
        <div className="flex items-center justify-center px-6 py-16 sm:px-14">
          <div className="w-full max-w-97.5">

            <div className="lg:hidden text-center mb-10">
              <span className="font-cormorant text-3xl font-semibold text-[#1a3820]">
                Bio<em className="not-italic text-[#5a9a30]">Prox</em>
              </span>
            </div>

            <div className="anim-fade-up mb-9">
              <p className="text-[11px] font-medium tracking-[2.5px] uppercase text-[#64a828] mb-2">
                Staff Portal
              </p>
              <h2 className="font-cormorant text-[38px] font-semibold text-[#1a2e1a] leading-[1.1]">
                Sign in to<br />your account
              </h2>
              {/* NOTE: No register link — accounts are created by admin only */}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div className="anim-fade-up delay-1">
                <label htmlFor="email" className="block text-[11px] font-medium tracking-[0.8px] uppercase text-[#3a5a2a] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-[15px] pointer-events-none select-none">✉</span>
                  <input
                    id="email" type="email" name="email"
                    placeholder="you@example.com"
                    value={formData.email} onChange={handleChange} required
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-stone-200 bg-white text-[#1a2e1a] text-sm placeholder-stone-300 outline-none transition-all focus:border-[#64a828] focus:ring-2 focus:ring-[#64a828]/15"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="anim-fade-up delay-2">
                <label htmlFor="password" className="block text-[11px] font-medium tracking-[0.8px] uppercase text-[#3a5a2a] mb-2">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-[15px] pointer-events-none select-none">🔒</span>
                  <input
                    id="password" type={showPassword ? "text" : "password"} name="password"
                    placeholder="Enter your password"
                    value={formData.password} onChange={handleChange} required
                    className="w-full pl-10 pr-12 py-3.5 rounded-xl border border-stone-200 bg-white text-[#1a2e1a] text-sm placeholder-stone-300 outline-none transition-all focus:border-[#64a828] focus:ring-2 focus:ring-[#64a828]/15"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#3a7a18] transition-colors text-base">
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <div className="anim-fade-up delay-4 pt-1">
                <button type="submit" disabled={isLoading || buttonDisabled}
                  className="w-full py-3.5 bg-[#1a3820] hover:bg-[#244d2a] text-stone-100 text-[15px] font-medium rounded-xl transition-all duration-200 hover:shadow-[0_8px_28px_rgba(26,56,32,0.35)] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {isLoading && (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinner inline-block" />
                  )}
                  {isLoading ? "Signing in…" : "Sign In →"}
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </>
  );
}