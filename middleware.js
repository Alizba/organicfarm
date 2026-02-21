import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = ["/profile"];
const authRoutes = ["/login", "/register"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  let isLoggedIn = false;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.TOKEN_SECRET);
      await jwtVerify(token, secret);
      isLoggedIn = true;
    } catch {
      isLoggedIn = false;
    }
  }

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
  
  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const isAuthPage = authRoutes.some((route) => pathname === route);
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  console.log("SECRET:", process.env.TOKEN_SECRET);

  return NextResponse.next();
}


export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};