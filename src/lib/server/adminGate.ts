import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const COOKIE_NAME = 'unbox_admin_session';

function validSession(token: string | undefined): boolean {
  if (!token) return false;
  const [encoded, suppliedSignature, extra] = token.split('.');
  if (!encoded || !suppliedSignature || extra) return false;
  const secret = process.env.ADMIN_SESSION_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'local-admin-session-secret-change-before-deploying');
  if (!secret) return false;

  try {
    const expectedSignature = createHmac('sha256', secret).update(encoded).digest('base64url');
    const supplied = Buffer.from(suppliedSignature);
    const expected = Buffer.from(expectedSignature);
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return false;
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as { role?: string; exp?: number };
    return payload.role === 'admin' && typeof payload.exp === 'number' && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function requireAdminSession(nextPath: string): void {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!validSession(token)) redirect(`/admin-login?next=${encodeURIComponent(nextPath)}`);
}
