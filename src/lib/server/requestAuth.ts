import { NextRequest } from 'next/server';
import { safeSecretEqual, TEACHER_COOKIE_NAME, verifyTeacherSession } from './integrationSecurity';

export interface TeacherAuthorization {
  teacherId: string;
  method: 'session' | 'api_key';
}

export function authorizeTeacherRequest(request: NextRequest): TeacherAuthorization | null {
  const session = verifyTeacherSession(request.cookies.get(TEACHER_COOKIE_NAME)?.value);
  if (session) return { teacherId: session.teacherId, method: 'session' };

  const configuredApiKey = process.env.ZING_API_KEY;
  const suppliedApiKey = request.headers.get('x-zing-api-key');
  if (configuredApiKey && suppliedApiKey && safeSecretEqual(suppliedApiKey, configuredApiKey)) {
    return { teacherId: '', method: 'api_key' };
  }

  return null;
}
