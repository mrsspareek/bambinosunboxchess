import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, validAdminSession } from './src/lib/server/adminSecurity';

function addSecurityHeaders(response: NextResponse, production: boolean) {
  response.headers.set('x-content-type-options', 'nosniff');
  response.headers.set('referrer-policy', 'strict-origin-when-cross-origin');
  response.headers.set('permissions-policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  response.headers.set(
    'content-security-policy',
    "frame-ancestors 'self' https://zing.bambinos.live; object-src 'none'; base-uri 'self'"
  );
  if (production) response.headers.set('strict-transport-security', 'max-age=31536000; includeSubDomains');
  return response;
}

export default async function middleware(request: NextRequest) {
  const protectedAdminRoute =
    request.nextUrl.pathname === '/admin' || request.nextUrl.pathname.startsWith('/admin-portal');

  if (protectedAdminRoute) {
    const authorized = await validAdminSession(request.cookies.get(ADMIN_COOKIE_NAME)?.value);
    if (!authorized) {
      return addSecurityHeaders(NextResponse.next(), process.env.NODE_ENV === 'production');
    }
  }

  return addSecurityHeaders(NextResponse.next(), process.env.NODE_ENV === 'production');
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.png).*)']
};
