"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast"; 
import { useRouter } from "next/navigation"; 

export default function LoginPage() {
  const router = useRouter(); 
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled]  = useState(true)

  useEffect(()=>{
    if(formData.email.length > 0 && formData.password.length > 0){
      setButtonDisabled(false)
    }
    else{
      setButtonDisabled(true)
    }
  }, [formData])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(!formData.email || !formData.password){
      toast.error ("Please enter your email and password.")
      return
    }
    
    setIsLoading(true);

    try {
      const res = await axios.post("/api/auth/login", formData);
      console.log("login success", res.data);
      toast.success("Logged in successfully!");
      const role = res.data.role;

      if(role === "admin"){
        router.push("/roles/admin")
      }
      else if(role === "shopkeeper"){
        router.push("/roles/shopkeeper")
      }
      else{
        router.push("/roles/user")
      }

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

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-fade-up   { animation: fadeUp 0.55s ease both; }
        .delay-1 { animation-delay: 0.08s; }
        .delay-2 { animation-delay: 0.16s; }
        .delay-3 { animation-delay: 0.24s; }
        .delay-4 { animation-delay: 0.32s; }
        .delay-5 { animation-delay: 0.40s; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { animation: spin 0.7s linear infinite; }
      `}</style>

      <div className="font-jost min-h-screen grid lg:grid-cols-2 bg-stone-50">

        {/* ── LEFT: Visual Panel ── */}
        <div className="relative hidden lg:flex flex-col items-center justify-center overflow-hidden bg-[#1a3820]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_20%_10%,rgba(130,190,65,0.22)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_70%_at_88%_88%,rgba(35,75,25,0.6)_0%,transparent_55%)]" />
          <div className="absolute -top-14 -right-14 text-[280px] opacity-[0.07] select-none pointer-events-none -rotate-18">🌿</div>
          <div className="absolute -bottom-20 -left-10 text-[240px] opacity-[0.07] select-none pointer-events-none rotate-25">🍃</div>
          <div className="absolute top-[42%] left-1 text-[110px] opacity-[0.06] select-none pointer-events-none -rotate-[8deg]">🌱</div>

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
                "The difference in quality is something you can actually taste. Nothing compares."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#96d44e] to-[#4a8a2a] flex items-center justify-center text-[#1a3820] font-semibold text-sm shrink-0">
                  E
                </div>
                <div>
                  <div className="text-white text-[13px] font-medium leading-none">Emma R.</div>
                  <div className="text-white/40 text-[11px] mt-1">Member since 2022</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-16 sm:px-14">
          <div className="w-full max-w-97.5">

            <div className="lg:hidden text-center mb-10">
              <span className="font-cormorant text-3xl font-semibold text-[#1a3820]">
                Bio<em className="not-italic text-[#5a9a30]">Prox</em>
              </span>
            </div>

            <div className="anim-fade-up mb-9">
              <p className="text-[11px] font-medium tracking-[2.5px] uppercase text-[#64a828] mb-2">
                Welcome back
              </p>
              <h2 className="font-cormorant text-[38px] font-semibold text-[#1a2e1a] leading-[1.1]">
                Sign in to<br />your account
              </h2>
              <p className="text-sm text-stone-500 font-light mt-3">
                New here?{" "}
                <Link href="/register" className="text-[#3a7a18] font-medium border-b border-[#3a7a18]/30 hover:border-[#3a7a18] transition-colors">
                  Create a free account
                </Link>
              </p>
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
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-stone-200 bg-white text-[#1a2e1a] text-sm placeholder-stone-300 outline-none transition-all focus:border-[#64a828] focus:ring-2 focus:ring-[#64a828]/15 hover:border-stone-300"
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
                    className="w-full pl-10 pr-12 py-3.5 rounded-xl border border-stone-200 bg-white text-[#1a2e1a] text-sm placeholder-stone-300 outline-none transition-all focus:border-[#64a828] focus:ring-2 focus:ring-[#64a828]/15 hover:border-stone-300"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#3a7a18] transition-colors text-base"
                    aria-label="Toggle password visibility">
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              {/* Options row */}
              <div className="anim-fade-up delay-3 flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#64a828] cursor-pointer" />
                  <span className="text-[13px] text-stone-600">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-[13px] text-[#3a7a18] font-medium border-b border-transparent hover:border-[#3a7a18] transition-colors">
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <div className="anim-fade-up delay-4 pt-1">
                <button type="submit" disabled={isLoading || buttonDisabled}
                  className="w-full py-3.5 bg-[#1a3820] hover:bg-[#244d2a] text-stone-100 text-[15px] font-medium rounded-xl transition-all duration-200 hover:shadow-[0_8px_28px_rgba(26,56,32,0.35)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {isLoading && (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinner inline-block" />
                  )}
                  {isLoading ? "Signing in…" : "Sign In →"}
                </button>
              </div>

              {/* Divider */}
              <div className="anim-fade-up delay-5 flex items-center gap-3">
                <div className="flex-1 h-px bg-stone-200" />
                <span className="text-[12px] text-stone-400 whitespace-nowrap">or continue with</span>
                <div className="flex-1 h-px bg-stone-200" />
              </div>

              {/* Social buttons */}
              <div className="anim-fade-up delay-5 grid grid-cols-2 gap-3">
                <button type="button"
                  className="flex items-center justify-center gap-2.5 py-3.5 border border-stone-200 rounded-xl bg-white text-[#1a2e1a] text-sm font-medium hover:border-[#64a828] hover:bg-[#f4fbee] transition-all">
                  <svg width="17" height="17" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </button>
                <button type="button"
                  className="flex items-center justify-center gap-2.5 py-3.5 border border-stone-200 rounded-xl bg-white text-[#1a2e1a] text-sm font-medium hover:border-[#64a828] hover:bg-[#f4fbee] transition-all">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
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