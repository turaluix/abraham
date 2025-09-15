import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if user has access token in cookies
  const accessToken = request.cookies.get('access_token')?.value;
  
  // Auth pages that should redirect authenticated users
  const authPages = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/verify-otp',
    '/auth/verify-reset-otp',
    '/auth/set-password',
    '/auth/reset-password',
  ];
  
  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (accessToken && authPages.some(page => pathname.startsWith(page))) {
    return NextResponse.redirect(new URL('/search', request.url));
  }
  
  // If user is not authenticated and trying to access protected routes, redirect to login
  if (!accessToken && pathname.startsWith('/(authenticated)')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
