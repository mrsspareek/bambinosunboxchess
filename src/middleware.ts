import { NextRequest, NextResponse } from 'next/server';

const ADMIN_COOKIE_NAME = 'unbox_admin_session';

function base64UrlToBytes(value: string): Uint8Array {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function validAdminSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [encoded, suppliedSignature, extra] = token.split('.');
  if (!encoded || !suppliedSignature || extra) return false;

  const secret = process.env.ADMIN_SESSION_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'local-admin-session-secret-change-before-deploying');
  if (!secret) return false;

  try {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    const signatureValid = await crypto.subtle.verify(
      'HMAC',
      key,
      base64UrlToBytes(suppliedSignature) as unknown as BufferSource,
      new TextEncoder().encode(encoded)
    );
    if (!signatureValid) return false;

    const payload = JSON.parse(new TextDecoder().decode(base64UrlToBytes(encoded))) as { role?: string; exp?: number };
    return payload.role === 'admin' && typeof payload.exp === 'number' && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

function addSecurityHeaders(response: NextResponse, production: boolean) {
  response.headers.set('x-content-type-options', 'nosniff');
  response.headers.set('referrer-policy', 'strict-origin-when-cross-origin');
  response.headers.set('permissions-policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  response.headers.set('content-security-policy', "frame-ancestors 'self' https://zing.bambinos.live; object-src 'none'; base-uri 'self'");
  if (production) response.headers.set('strict-transport-security', 'max-age=31536000; includeSubDomains');
  return response;
}

export async function middleware(request: NextRequest) {
  const protectedAdminRoute = request.nextUrl.pathname === '/admin' || request.nextUrl.pathname.startsWith('/admin-portal');
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
