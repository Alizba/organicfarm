"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

// ─── Shared input style ────────────────────────────────────────────────────
const inputCls =
  "w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-white text-[#1a2e1a] text-sm placeholder-stone-300 outline-none transition-all focus:border-[#64a828] focus:ring-2 focus:ring-[#64a828]/15 font-jost";

const labelCls =
  "block text-[10px] font-medium tracking-[0.8px] uppercase text-[#3a5a2a] mb-1.5";

export default function AuthModal({ isOpen, onClose, onSuccess, defaultTab = "login" }) {
  const { login, register } = useAuth();
  const [tab, setTab]           = useState(defaultTab); // "login" | "register"
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm]     = useState({ username: "", email: "", password: "", confirmPassword: "" });

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setTab(defaultTab);
      setLoginForm({ email: "", password: "" });
      setRegForm({ username: "", email: "", password: "", confirmPassword: "" });
      setShowPass(false);
    }
  }, [isOpen, defaultTab]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // ── Login submit ───────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const result = await login(loginForm.email, loginForm.password);
      if (result.success) {
        toast.success("Welcome back!");
        onSuccess?.(result);
        onClose();
      } else {
        toast.error(result.error || "Login failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Register submit ────────────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regForm.username || !regForm.email || !regForm.password) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (regForm.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (regForm.password !== regForm.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const result = await register(regForm.username, regForm.email, regForm.password);
      if (result.success) {
        toast.success("Account created! You're now logged in.");
        onSuccess?.(result);
        onClose();
      } else {
        toast.error(result.error || "Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap');
        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        .font-jost      { font-family: 'Jost', sans-serif; }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        .modal-anim { animation: modalIn 0.22s ease both; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { animation: spin 0.7s linear infinite; }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="modal-anim font-jost bg-stone-50 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-[#1a3820] px-8 pt-8 pb-6">
            {/* Decorative */}
            <div className="absolute top-0 right-0 text-[120px] opacity-[0.06] leading-none select-none pointer-events-none">🌿</div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            <div className="relative z-10">
              <p className="font-cormorant text-[28px] font-semibold text-stone-100 leading-tight">
                Bio<em className="not-italic text-[#96d44e]">Prox</em>
              </p>
              <p className="text-white/50 text-xs tracking-widest uppercase mt-1">
                {tab === "login" ? "Welcome back" : "Create your account"}
              </p>
            </div>

            {/* Tab switcher */}
            <div className="relative z-10 flex gap-1 mt-5 bg-white/10 rounded-xl p-1">
              {["login", "register"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer capitalize ${
                    tab === t
                      ? "bg-white text-[#1a3820] shadow-sm"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {t === "login" ? "Sign In" : "Register"}
                </button>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-6">

            {/* ── LOGIN FORM ─────────────────────────────────────────── */}
            {tab === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className={labelCls}>Email Address</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm pointer-events-none">✉</span>
                    <input
                      type="email" placeholder="you@example.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      className={inputCls} required
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Password</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm pointer-events-none">🔒</span>
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className={`${inputCls} pr-10`} required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#3a7a18] transition-colors text-sm cursor-pointer"
                    >{showPass ? "🙈" : "👁"}</button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !loginForm.email || !loginForm.password}
                  className="w-full py-3 bg-[#1a3820] hover:bg-[#244d2a] text-stone-100 text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinner inline-block" />}
                  {loading ? "Signing in…" : "Sign In →"}
                </button>

                <p className="text-center text-xs text-stone-400 mt-2">
                  Don't have an account?{" "}
                  <button type="button" onClick={() => setTab("register")} className="text-[#64a828] hover:underline font-medium cursor-pointer">
                    Register
                  </button>
                </p>
              </form>
            )}

            {/* ── REGISTER FORM ──────────────────────────────────────── */}
            {tab === "register" && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className={labelCls}>Username</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm pointer-events-none">👤</span>
                    <input
                      type="text" placeholder="Choose a username"
                      value={regForm.username}
                      onChange={(e) => setRegForm({ ...regForm, username: e.target.value })}
                      className={inputCls} required
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Email Address</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm pointer-events-none">✉</span>
                    <input
                      type="email" placeholder="you@example.com"
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      className={inputCls} required
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Password</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm pointer-events-none">🔒</span>
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="Min. 6 characters"
                      value={regForm.password}
                      onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                      className={`${inputCls} pr-10`} required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#3a7a18] transition-colors text-sm cursor-pointer"
                    >{showPass ? "🙈" : "👁"}</button>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Confirm Password</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm pointer-events-none">🔒</span>
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="Repeat your password"
                      value={regForm.confirmPassword}
                      onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                      className={inputCls} required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !regForm.username || !regForm.email || !regForm.password || !regForm.confirmPassword}
                  className="w-full py-3 bg-[#1a3820] hover:bg-[#244d2a] text-stone-100 text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinner inline-block" />}
                  {loading ? "Creating account…" : "Create Account →"}
                </button>

                <p className="text-center text-xs text-stone-400 mt-2">
                  Already have an account?{" "}
                  <button type="button" onClick={() => setTab("login")} className="text-[#64a828] hover:underline font-medium cursor-pointer">
                    Sign In
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}