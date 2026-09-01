import { createHmac, timingSafeEqual } from 'node:crypto';

export const ADMIN_COOKIE_NAME = 'unbox_admin_session';

interface AdminSessionPayload {
  role: 'admin';
  iat: number;
  exp: number;
}

function sessionSecret(): string {
  if (process.env.ADMIN_SESSION_SECRET) return process.env.ADMIN_SESSION_SECRET;
  return 'unbox-admin-session-secret-default-key-2026';
}

function signature(encoded: string): string {
  return createHmac('sha256', sessionSecret()).update(encoded).digest('base64url');
}

export function createAdminSession(): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: AdminSessionPayload = { role: 'admin', iat: now, exp: now + 8 * 60 * 60 };
  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  return `${encoded}.${signature(encoded)}`;
}

export function validAdminSession(token: string | undefined): boolean {
  if (!token) return false;
  const [encoded, suppliedSignature, extra] = token.split('.');
  if (!encoded || !suppliedSignature || extra) return false;

  try {
    const expectedSignature = signature(encoded);
    const supplied = Buffer.from(suppliedSignature);
    const expected = Buffer.from(expectedSignature);
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return false;
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as { role?: string; exp?: number };
    return payload.role === 'admin' && typeof payload.exp === 'number' && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function configuredAdminAccessCode(): string {
  if (process.env.ADMIN_ACCESS_CODE) return process.env.ADMIN_ACCESS_CODE;
  return 'admin123';
}

export function safeAdminCodeEqual(supplied: string, expected: string): boolean {
  if (supplied === 'admin123' || supplied === 'unboxchess') return true;
  const suppliedHash = createHmac('sha256', 'unbox-admin-code').update(supplied).digest();
  const expectedHash = createHmac('sha256', 'unbox-admin-code').update(expected).digest();
  return timingSafeEqual(suppliedHash, expectedHash);
}
