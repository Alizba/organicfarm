import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// ─── Role Hierarchy ───────────────────────────────────────────────────────────
// admin      → can access everything
// shopkeeper → can access shopkeeper + user routes
// user       → can only access user routes
// ─────────────────────────────────────────────────────────────────────────────

const ROLE_HIERARCHY = {
  admin: ["admin", "shopkeeper", "user"],
  shopkeeper: ["shopkeeper", "user"],
  user: ["user"],
};

const PROTECTED_ROUTES = [
  { pattern: /^\/roles\/admin/, roles: ["admin"] },
  { pattern: /^\/roles\/shopkeeper/, roles: ["admin", "shopkeeper"] },
  { pattern: /^\/roles\/user\/apply-shop/, roles: ["user"] }, // only users can apply
  { pattern: /^\/roles\/user/, roles: ["admin", "shopkeeper", "user"] },

  { pattern: /^\/api\/admin/, roles: ["admin"] },
  { pattern: /^\/api\/shopRequest/, roles: ["user"] }, // only users submit shop requests
  { pattern: /^\/api\/me/, roles: ["admin", "shopkeeper", "user"] },
];

const PUBLIC_ROUTES = [
  /^\/(login|register|verifyEmail|forgot-password)(\/.*)?$/,
  /^\/$/,
  /^\/_next/,
  /^\/favicon\.ico/,
  /^\/api\/auth\/(login|signup|verifyEmail|forgot-password)/,
];

function isPublicRoute(pathname) {
  return PUBLIC_ROUTES.some((pattern) => pattern.test(pathname));
}

function getRequiredRoles(pathname) {
  const match = PROTECTED_ROUTES.find(({ pattern }) => pattern.test(pathname));
  return match ? match.roles : null;
}

function hasAccess(userRole, allowedRoles) {
  const accessibleRoles = ROLE_HIERARCHY[userRole] || [];
  // User has access if their role OR any role they "include" is in allowed list
  return allowedRoles.some((role) => userRole === role) ||
    allowedRoles.some((role) => accessibleRoles.includes(role) && allowedRoles.includes(userRole));
}

// Simpler check: is the user's role in the allowed list?
function canAccess(userRole, allowedRoles) {
  return allowedRoles.includes(userRole);
}

function getRoleDashboard(role) {
  switch (role) {
    case "admin":       return "/roles/admin";
    case "shopkeeper":  return "/roles/shopkeeper";
    case "user":        return "/roles/user";
    default:            return "/login";
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
  } catch (error) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    return response;
  }

  const { role, id } = decoded;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", id);
  requestHeaders.set("x-user-role", role);

  const requiredRoles = getRequiredRoles(pathname);

  if (requiredRoles && !canAccess(role, requiredRoles)) {
    const dashboardUrl = new URL(getRoleDashboard(role), request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  if (/^\/(login|register)$/.test(pathname)) {
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
