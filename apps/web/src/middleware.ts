import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow public assets, internal Next.js files, and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Allow login page unconditionally so users can switch accounts or re-authenticate
  if (pathname === '/login') {
    return NextResponse.next();
  }

  // 3. Check for active session & role cookies
  const sessionCookie = request.cookies.get('school_erp_session')?.value;
  const userRole = request.cookies.get('school_erp_role')?.value;
  const isAuthenticated = Boolean(sessionCookie);

  // 4. If NOT authenticated, redirect to login
  if (!isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    if (pathname !== '/') {
      loginUrl.searchParams.set('redirect', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // 5. Strict Role-Based Route Boundaries
  // -------------------------------------------------------------
  // A. Super Admin Platform Console (/platform-admin)
  // -------------------------------------------------------------
  if (pathname.startsWith('/platform-admin')) {
    if (userRole !== 'super_admin') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // -------------------------------------------------------------
  // B. Admin Office Desk (/office/*)
  // -------------------------------------------------------------
  if (pathname.startsWith('/office')) {
    // Only office staff and principals can access office desk
    if (userRole !== 'office' && userRole !== 'principal') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // -------------------------------------------------------------
  // C. Executive Principal Suite & Academic Administration
  // Paths: /, /attendance, /marks, /settings, /circulars, /staff, /students
  // -------------------------------------------------------------
  const isPrincipalRoute =
    pathname === '/' ||
    pathname.startsWith('/attendance') ||
    pathname.startsWith('/marks') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/circulars') ||
    pathname.startsWith('/staff') ||
    pathname.startsWith('/students');

  if (isPrincipalRoute) {
    if (userRole !== 'principal') {
      // If an office user tries to visit Principal route, redirect to login so they must authenticate as Principal
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
