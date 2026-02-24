"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();

  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/auth/me");
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email, password) => {
    setError(null);
    try {
      const { data } = await axios.post("/api/auth/login", { email, password });
      await fetchUser();
      return { success: true, role: data.role };
    } catch (err) {
      const msg = err.response?.data?.error || "Login failed";
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    try {
      await axios.get("/api/auth/logout");
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  const isAdmin      = user?.role === "admin";
  const isShopkeeper = user?.role === "shopkeeper";
  const isLoggedIn   = !!user;

  const hasRole = (...roles) => roles.includes(user?.role);

  const value = {
    user,
    loading,
    error,
    isLoggedIn,
    isAdmin,
    isShopkeeper,
    hasRole,
    login,
    logout,
    refetchUser: fetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export function useRole() {
  const { user, loading } = useAuth();
  return { role: user?.role ?? null, loading };
}