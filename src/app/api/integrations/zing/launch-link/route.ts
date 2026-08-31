import { NextRequest, NextResponse } from 'next/server';
import { getZingPuzzle } from '../../../../../lib/zingPuzzleCatalog';
import { createLaunch } from '../../../../../lib/server/launchRepository';
import {
  createLaunchToken,
  isAllowedReturnUrl
} from '../../../../../lib/server/integrationSecurity';
import { authorizeTeacherRequest } from '../../../../../lib/server/requestAuth';

export const runtime = 'nodejs';

function textField(value: unknown, maxLength = 120): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

export async function POST(request: NextRequest) {
  const authorization = authorizeTeacherRequest(request);
  if (!authorization) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: 'A JSON request body is required.' }, { status: 400 });

  const puzzleId = textField(body.puzzleId);
  const assignmentId = textField(body.assignmentId);
  const studentId = textField(body.studentId);
  const studentName = textField(body.studentName);
  const requestedTeacherId = textField(body.teacherId, 80);
  const teacherId = authorization.teacherId || requestedTeacherId;
  const returnUrl = textField(body.returnUrl, 500) || undefined;

  if (!puzzleId || !getZingPuzzle(puzzleId)) {
    return NextResponse.json({ error: 'Select a valid published puzzle.' }, { status: 400 });
  }
  if (!assignmentId || !studentId || !studentName || !teacherId) {
    return NextResponse.json(
      { error: 'assignmentId, studentId, studentName, and teacherId are required.' },
      { status: 400 }
    );
  }
  if (!isAllowedReturnUrl(returnUrl)) {
    return NextResponse.json({ error: 'The Zing return URL is not on the allow-list.' }, { status: 400 });
  }

  const expiresAt = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString();
  const launch = await createLaunch({
    assignmentId,
    puzzleId,
    studentId,
    studentName,
    teacherId,
    classId: textField(body.classId, 80) || undefined,
    zingDeckId: textField(body.zingDeckId, 80) || undefined,
    zingSessionId: textField(body.zingSessionId, 80) || undefined,
    returnUrl,
    expiresAt
  });
  const token = createLaunchToken(launch.id, expiresAt);
  const publicBaseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
  const launchUrl = new URL('/zing/launch', publicBaseUrl);
  launchUrl.searchParams.set('token', token);

  return NextResponse.json({
    launchUrl: launchUrl.toString(),
    launchId: launch.id,
    expiresAt,
    puzzle: getZingPuzzle(puzzleId)
  });
}
