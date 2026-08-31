import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_COOKIE_NAME,
  configuredAdminAccessCode,
  createAdminSession,
  safeAdminCodeEqual
} from '../../../../lib/server/adminSecurity';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const expected = configuredAdminAccessCode();
  if (!expected) {
    return NextResponse.json({ error: 'Admin access is not configured.' }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as { accessCode?: unknown } | null;
  const supplied = typeof body?.accessCode === 'string' ? body.accessCode : '';
  if (!safeAdminCodeEqual(supplied, expected)) {
    return NextResponse.json({ error: 'The access code is incorrect.' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE_NAME, createAdminSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 8 * 60 * 60
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  });
  return response;
}
