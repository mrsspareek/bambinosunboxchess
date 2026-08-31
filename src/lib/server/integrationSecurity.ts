import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';

interface SignedLaunchToken {
  launchId: string;
  jti: string;
  iat: number;
  exp: number;
}

interface TeacherSessionToken {
  role: 'teacher';
  teacherId: string;
  iat: number;
  exp: number;
}

type SignedPayload = SignedLaunchToken | TeacherSessionToken;

export const TEACHER_COOKIE_NAME = 'unbox_teacher_session';

function signingSecret(): string {
  const configured = process.env.ZING_LAUNCH_SECRET || process.env.TEACHER_SESSION_SECRET;
  if (configured) return configured;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('ZING_LAUNCH_SECRET is required in production.');
  }
  return 'local-development-secret-change-before-deploying';
}

function signature(value: string): string {
  return createHmac('sha256', signingSecret()).update(value).digest('base64url');
}

function signPayload(payload: SignedPayload): string {
  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  return `${encoded}.${signature(encoded)}`;
}

function verifyPayload<T extends SignedPayload>(token: string): T | null {
  const [encoded, suppliedSignature, extra] = token.split('.');
  if (!encoded || !suppliedSignature || extra) return null;

  const expectedSignature = signature(encoded);
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as T;
    if (!payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function createLaunchToken(launchId: string, expiresAt: string): string {
  const now = Math.floor(Date.now() / 1000);
  return signPayload({
    launchId,
    jti: randomUUID(),
    iat: now,
    exp: Math.floor(new Date(expiresAt).getTime() / 1000)
  });
}

export function verifyLaunchToken(token: string): SignedLaunchToken | null {
  const payload = verifyPayload<SignedLaunchToken>(token);
  return payload && typeof payload.launchId === 'string' && typeof payload.jti === 'string' ? payload : null;
}

export function createTeacherSession(teacherId: string): string {
  const now = Math.floor(Date.now() / 1000);
  return signPayload({ role: 'teacher', teacherId, iat: now, exp: now + 8 * 60 * 60 });
}

export function verifyTeacherSession(token?: string): TeacherSessionToken | null {
  if (!token) return null;
  const payload = verifyPayload<TeacherSessionToken>(token);
  return payload?.role === 'teacher' && typeof payload.teacherId === 'string' ? payload : null;
}

export function safeSecretEqual(supplied: string, expected: string): boolean {
  const suppliedHash = createHmac('sha256', 'unbox-secret-comparison').update(supplied).digest();
  const expectedHash = createHmac('sha256', 'unbox-secret-comparison').update(expected).digest();
  return timingSafeEqual(suppliedHash, expectedHash);
}

export function isAllowedReturnUrl(value?: string): boolean {
  if (!value) return true;
  try {
    const url = new URL(value);
    const configured = process.env.ZING_ALLOWED_RETURN_ORIGINS
      ?.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);
    const allowedOrigins = configured?.length ? configured : ['https://zing.bambinos.live'];
    return url.protocol === 'https:' && allowedOrigins.includes(url.origin);
  } catch {
    return false;
  }
}

export function teacherAccessCode(): string | null {
  if (process.env.TEACHER_ACCESS_CODE) return process.env.TEACHER_ACCESS_CODE;
  return process.env.NODE_ENV === 'production' ? null : 'teacher-demo-2026';
}
