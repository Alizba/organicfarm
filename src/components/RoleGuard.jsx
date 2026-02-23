"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function RoleGuard({ children, roles = [], fallback = null }) {
  const { user, loading, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!isLoggedIn) {
      router.replace("/login");
      return;
    }

    if (roles.length > 0 && !roles.includes(user?.role)) {
      const dashboardMap = {
        admin:      "/dashboard/admin",
        shopkeeper: "/dashboard/shopkeeper",
        user:       "/dashboard/user",
      };
      router.replace(dashboardMap[user?.role] || "/login");
    }
  }, [loading, isLoggedIn, user, roles, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!isLoggedIn || (roles.length > 0 && !roles.includes(user?.role))) {
    return fallback;
  }

  return children;
}

export function ShowFor({ roles = [], children }) {
  const { user, loading } = useAuth();
  if (loading || !roles.includes(user?.role)) return null;
  return children;
}