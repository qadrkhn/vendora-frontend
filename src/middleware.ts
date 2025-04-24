import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard'];
const authPages = ['/sign-in', '/sign-up'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('access_token')?.value;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthPage = authPages.includes(pathname);

  // Redirect to /sign-in if trying to access protected route without token
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Prevent access to /sign-in or /sign-up if already logged in
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// 🔍 Match all relevant routes
export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up'],
};
