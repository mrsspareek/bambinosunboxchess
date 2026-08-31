import { createHmac, timingSafeEqual } from 'node:crypto';

export const ADMIN_COOKIE_NAME = 'unbox_admin_session';

interface AdminSessionPayload {
  role: 'admin';
  iat: number;
  exp: number;
}

function sessionSecret(): string {
  if (process.env.ADMIN_SESSION_SECRET) return process.env.ADMIN_SESSION_SECRET;
  if (process.env.NODE_ENV === 'production') throw new Error('ADMIN_SESSION_SECRET is required in production.');
  return 'local-admin-session-secret-change-before-deploying';
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

export function configuredAdminAccessCode(): string | null {
  if (process.env.ADMIN_ACCESS_CODE) return process.env.ADMIN_ACCESS_CODE;
  return process.env.NODE_ENV === 'production' ? null : 'admin-demo-2026';
}

export function safeAdminCodeEqual(supplied: string, expected: string): boolean {
  const suppliedHash = createHmac('sha256', 'unbox-admin-code').update(supplied).digest();
  const expectedHash = createHmac('sha256', 'unbox-admin-code').update(expected).digest();
  return timingSafeEqual(suppliedHash, expectedHash);
}
