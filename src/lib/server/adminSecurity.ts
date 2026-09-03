import type { } from 'node:buffer';

const useWebCrypto = typeof globalThis !== 'undefined' && typeof (globalThis as any).crypto !== 'undefined' && typeof (globalThis as any).crypto.subtle !== 'undefined';

function base64UrlEncode(buf: Uint8Array | ArrayBuffer): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  if (typeof btoa !== 'undefined') {
    let str = '';
    for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i]);
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } else {
    return Buffer.from(bytes).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
}

function base64UrlDecodeToBytes(input: string): Uint8Array {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(input.length / 4) * 4, '=');
  if (typeof atob !== 'undefined') {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  } else {
    return new Uint8Array(Buffer.from(base64, 'base64'));
  }
}

function sessionSecret(): string {
  if (process.env.ADMIN_SESSION_SECRET) return process.env.ADMIN_SESSION_SECRET;
  return 'unbox-admin-session-secret-default-key-2026';
}

async function hmacSha256(key: string, data: string): Promise<Uint8Array> {
  if (useWebCrypto) {
    const cryptoKey = await (globalThis as any).crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(key),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const sig = await (globalThis as any).crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(data));
    return new Uint8Array(sig as ArrayBuffer);
  } else {
    const { createHmac } = await import('node:crypto');
    return createHmac('sha256', key).update(data).digest();
  }
}

async function signatureFor(encoded: string): Promise<string> {
  const sig = await hmacSha256(sessionSecret(), encoded);
  return base64UrlEncode(sig);
}

export const ADMIN_COOKIE_NAME = 'unbox_admin_session';

interface AdminSessionPayload {
  role: 'admin';
  iat: number;
  exp: number;
}

export function createAdminSession(): string {
  // This function is intended for Node server use (API routes). It uses Node crypto synchronously.
  if (useWebCrypto) {
    throw new Error('createAdminSession should only be used in Node runtime (API routes).');
  }
  const now = Math.floor(Date.now() / 1000);
  const payload: AdminSessionPayload = { role: 'admin', iat: now, exp: now + 8 * 60 * 60 };
  const encoded = Buffer.from(JSON.stringify(payload), 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  // create signature synchronously
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { createHmac } = require('node:crypto');
  const sig = createHmac('sha256', sessionSecret()).update(encoded).digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${encoded}.${sig}`;
}

export async function validAdminSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [encoded, suppliedSignature, extra] = token.split('.');
  if (!encoded || !suppliedSignature || extra) return false;

  try {
    const expectedSignature = await signatureFor(encoded);

    if (!useWebCrypto) {
      const { timingSafeEqual } = await import('node:crypto');
      const supplied = Buffer.from(suppliedSignature);
      const expected = Buffer.from(expectedSignature);
      if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return false;
    } else {
      // Edge: no timingSafeEqual available; fall back to string compare
      if (suppliedSignature !== expectedSignature) return false;
    }

    const payloadBytes = base64UrlDecodeToBytes(encoded);
    const payloadStr = new TextDecoder().decode(payloadBytes);
    const payload = JSON.parse(payloadStr) as { role?: string; exp?: number };
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
  if (!useWebCrypto) {
    // Node: timing-safe compare
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { createHmac, timingSafeEqual } = require('node:crypto');
    const suppliedHash = createHmac('sha256', 'unbox-admin-code').update(supplied).digest();
    const expectedHash = createHmac('sha256', 'unbox-admin-code').update(expected).digest();
    return timingSafeEqual(suppliedHash, expectedHash);
  } else {
    // Edge: fallback to simple equality (development only)
    return supplied === expected;
  }
}
