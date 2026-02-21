"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    agreed: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonDisabled, setButtonDisable] = useState(true); 

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post("/api/auth/signup", {
        username: formData.userName,
        email: formData.email,
        password: formData.password,
      });
      console.log("signup success", res.data);
      toast.success("Account created! Please verify your email.");
      router.push("/login"); 
    } catch (err) {
      
      toast.error(err?.response?.data?.error || "Something went wrong.");
    } finally {
      setIsLoading(false); 
    }
  };

  const getStrength = (pwd) => {
    if (!pwd) return null;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;
    const levels = [
      { label: "Weak", color: "bg-red-400", text: "text-red-500", w: "w-1/4" },
      { label: "Fair", color: "bg-amber-400", text: "text-amber-600", w: "w-2/4" },
      { label: "Good", color: "bg-[#7fc93e]", text: "text-[#5a8a20]", w: "w-3/4" },
      { label: "Strong", color: "bg-[#2d6a10]", text: "text-[#2d6a10]", w: "w-full" },
    ];
    return levels[score - 1] || null;
  };

  const strength = getStrength(formData.password);

  useEffect(() => {
    if (formData.userName.length > 0 && formData.email.length > 0 && formData.password.length > 0) {
      setButtonDisable(false);
    } else {
      setButtonDisable(true);
    }
  }, [formData]);

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
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_15%_10%,rgba(120,185,55,0.2)_0%,transparent_58%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_75%_at_90%_90%,rgba(30,70,20,0.65)_0%,transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_55%_48%,rgba(70,130,40,0.1)_0%,transparent_55%)]" />
          <div className="absolute -top-12 -left-12 text-[260px] opacity-[0.07] select-none pointer-events-none rotate-15">🍃</div>
          <div className="absolute -bottom-20 -right-10 text-[230px] opacity-[0.07] select-none pointer-events-none -rotate-20">🌿</div>
          <div className="absolute top-[45%] right-3 text-[100px] opacity-[0.06] select-none pointer-events-none rotate-10">🌱</div>

          <div className="relative z-10 flex flex-col items-center px-12 text-center">
            <div className="w-17 h-17 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm flex items-center justify-center text-3xl mb-7 shadow-lg">
              🌾
            </div>
            <h1 className="font-cormorant text-[48px] font-semibold leading-tight text-stone-100 mb-3 tracking-tight">
              Bio<em className="not-italic text-[#96d44e]">Prox</em>
            </h1>
            <p className="text-[11px] font-light tracking-[3px] uppercase text-white/40 mb-12">
              Farm · Fresh · Organic
            </p>
            <div className="flex flex-col gap-4 w-full max-w-75 text-left">
              {[
                { icon: "🥦", title: "Certified Organic Only", desc: "Every product is 100% certified — no exceptions." },
                { icon: "🚚", title: "Free Delivery Over $40", desc: "Same-week delivery, fresh from the farm." },
                { icon: "♻️", title: "Zero-Waste Packaging", desc: "Compostable and fully recyclable materials." },
                { icon: "💚", title: "Member Rewards", desc: "Earn points on every order, redeem for free produce." },
              ].map((perk) => (
                <div key={perk.title} className="flex items-start gap-3.5 border border-white/10 rounded-xl px-4 py-3.5 backdrop-blur-sm">
                  <div className="w-9 h-9 rounded-lg bg-[#96d44e]/15 flex items-center justify-center text-lg shrink-0">{perk.icon}</div>
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
        <div className="flex items-center justify-center px-6 py-12 sm:px-14 overflow-y-auto">
          <div className="w-full max-w-100">

            <div className="lg:hidden text-center mb-8">
              <span className="font-cormorant text-3xl font-semibold text-[#162e18]">
                Bio<em className="not-italic text-[#5a9a30]">Prox</em>
              </span>
            </div>

            <div className="anim-fade-up mb-8">
              <p className="text-[11px] font-medium tracking-[2.5px] uppercase text-[#64a828] mb-2">Join our community</p>
              <h2 className="font-cormorant text-[38px] font-semibold text-[#1a2e1a] leading-[1.1]">
                Create your<br />free account
              </h2>
              <p className="text-sm text-stone-500 font-light mt-3">
                Already have an account?{" "}
                <Link href="/login" className="text-[#3a7a18] font-medium border-b border-[#3a7a18]/30 hover:border-[#3a7a18] transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Username */}
              <div className="anim-fade-up delay-1">
                <label htmlFor="userName" className="block text-[11px] font-medium tracking-[0.8px] uppercase text-[#3a5a2a] mb-2">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-[14px] pointer-events-none select-none">👤</span>
                  <input
                    id="userName" type="text"
                    name="userName"
                    placeholder="Ali"
                    value={formData.userName}
                    onChange={handleChange}
                    required
                    className="w-full pl-9 pr-3 py-3 rounded-xl border border-stone-200 bg-white text-[#1a2e1a] text-sm placeholder-stone-300 outline-none transition-all focus:border-[#64a828] focus:ring-2 focus:ring-[#64a828]/15 hover:border-stone-300"
                  />
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
                    id="email" type="email" name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
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
                    id="password" type={showPassword ? "text" : "password"} name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-stone-200 bg-white text-[#1a2e1a] text-sm placeholder-stone-300 outline-none transition-all focus:border-[#64a828] focus:ring-2 focus:ring-[#64a828]/15 hover:border-stone-300"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#3a7a18] transition-colors text-base"
                    aria-label="Toggle password visibility">
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
                {strength && (
                  <div className="mt-2 space-y-1">
                    <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.w}`} />
                    </div>
                    <span className={`text-[11px] font-medium ${strength.text}`}>{strength.label}</span>
                  </div>
                )}
              </div>

              {/* Terms checkbox */}
              <div className="anim-fade-up delay-5">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreed"
                    checked={formData.agreed}
                    onChange={handleChange}
                    className="mt-0.5 w-4 h-4 rounded accent-[#64a828] cursor-pointer"
                  />
                  <span className="text-[13px] text-stone-600">
                    I agree to the{" "}
                    <Link href="/terms" className="text-[#3a7a18] font-medium border-b border-[#3a7a18]/30 hover:border-[#3a7a18] transition-colors">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-[#3a7a18] font-medium border-b border-[#3a7a18]/30 hover:border-[#3a7a18] transition-colors">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              {/* Submit */}
              <div className="anim-fade-up delay-7 pt-1">
                <button
                  type="submit"
              
                  disabled={isLoading || buttonDisabled || !formData.agreed}
                  className="w-full py-3.5 bg-[#162e18] hover:bg-[#1f3f22] text-stone-100 text-[15px] font-medium rounded-xl transition-all duration-200 hover:shadow-[0_8px_28px_rgba(22,46,24,0.35)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-55 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {isLoading && (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinner inline-block" />
                  )}
                  {isLoading ? "Creating account…" : "Create Account →"}
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </>
  );
}