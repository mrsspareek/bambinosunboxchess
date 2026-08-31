import { NextRequest, NextResponse } from 'next/server';
import {
  createTeacherSession,
  safeSecretEqual,
  teacherAccessCode,
  TEACHER_COOKIE_NAME
} from '../../../../lib/server/integrationSecurity';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const expectedCode = teacherAccessCode();
  if (!expectedCode) {
    return NextResponse.json(
      { error: 'Teacher sign-in is not configured. Set TEACHER_ACCESS_CODE.' },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => null)) as { accessCode?: unknown; teacherId?: unknown } | null;
  const accessCode = typeof body?.accessCode === 'string' ? body.accessCode : '';
  if (!safeSecretEqual(accessCode, expectedCode)) {
    return NextResponse.json({ error: 'The access code is incorrect.' }, { status: 401 });
  }

  const teacherId =
    typeof body?.teacherId === 'string' && body.teacherId.trim()
      ? body.teacherId.trim().slice(0, 80)
      : 'teacher-main';
  const response = NextResponse.json({ ok: true });
  response.cookies.set(TEACHER_COOKIE_NAME, createTeacherSession(teacherId), {
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
  response.cookies.set(TEACHER_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  });
  return response;
}
