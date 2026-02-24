import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const PROTECTED_ROUTES = [
  { pattern: /^\/roles\/admin/, roles: ["admin"] },
  { pattern: /^\/roles\/shopkeeper/, roles: ["admin", "shopkeeper"] },
  { pattern: /^\/api\/admin/, roles: ["admin"] },
  { pattern: /^\/api\/me/, roles: ["admin", "shopkeeper"] },
];

const PUBLIC_ROUTES = [
  /^\/(login|forgot-password)(\/.*)?$/,
  /^\/$/,
  /^\/_next/,
  /^\/favicon\.ico/,
  /^\/api\/auth\/(login|logout)/,
  /^\/api\/checkout/,          
  /^\/api\/products/,          
];

function isPublicRoute(pathname) {
  return PUBLIC_ROUTES.some((pattern) => pattern.test(pathname));
}

function getRequiredRoles(pathname) {
  const match = PROTECTED_ROUTES.find(({ pattern }) => pattern.test(pathname));
  return match ? match.roles : null;
}

function canAccess(userRole, allowedRoles) {
  return allowedRoles.includes(userRole);
}

function getRoleDashboard(role) {
  switch (role) {
    case "admin":      return "/roles/admin";
    case "shopkeeper": return "/roles/shopkeeper";
    default:           return "/login";
  }
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.TOKEN_SECRET);
  } catch {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    return response;
  }

  const { role, id } = decoded;

  // Block any lingering "user" role tokens
  if (role === "user") {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    return response;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", id);
  requestHeaders.set("x-user-role", role);

  const requiredRoles = getRequiredRoles(pathname);

  if (requiredRoles && !canAccess(role, requiredRoles)) {
    return NextResponse.redirect(new URL(getRoleDashboard(role), request.url));
  }

  if (/^\/login$/.test(pathname)) {
    return NextResponse.redirect(new URL(getRoleDashboard(role), request.url));
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};