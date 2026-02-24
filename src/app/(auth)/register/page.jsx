// app/(auth)/register/page.jsx
// Public registration is disabled — accounts are created by admin only.
// This page simply redirects to login.

import { redirect } from "next/navigation";

export default function RegisterPage() {
  redirect("/login");
}