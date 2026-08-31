import { NextRequest, NextResponse } from 'next/server';
import { getZingPuzzle } from '../../../../../lib/zingPuzzleCatalog';
import {
  getAttempt,
  listAttempts,
  saveAttempt,
  updateAttemptSyncStatus
} from '../../../../../lib/server/attemptRepository';
import { getLaunch } from '../../../../../lib/server/launchRepository';
import { verifyLaunchToken } from '../../../../../lib/server/integrationSecurity';
import { authorizeTeacherRequest } from '../../../../../lib/server/requestAuth';
import { deliverZingResult } from '../../../../../lib/server/zingWebhook';
import { ZingAttempt, ZingAttemptEvent } from '../../../../../types/zing';

export const runtime = 'nodejs';

function boundedInteger(value: unknown, min: number, max: number): number {
  const number = typeof value === 'number' && Number.isFinite(value) ? Math.round(value) : min;
  return Math.min(max, Math.max(min, number));
}

export async function GET(request: NextRequest) {
  const authorization = authorizeTeacherRequest(request);
  if (!authorization) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  const teacherFilter = authorization.teacherId || request.nextUrl.searchParams.get('teacherId') || undefined;
  const attempts = await listAttempts(teacherFilter);
  return NextResponse.json({ attempts: attempts.slice(0, 500) });
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as ZingAttemptEvent | null;
  if (!body || typeof body.launchToken !== 'string') {
    return NextResponse.json({ error: 'A valid launchToken is required.' }, { status: 400 });
  }
  if (body.event !== 'started' && body.event !== 'completed') {
    return NextResponse.json({ error: 'event must be started or completed.' }, { status: 400 });
  }

  const tokenPayload = verifyLaunchToken(body.launchToken);
  if (!tokenPayload) return NextResponse.json({ error: 'This launch link is invalid or expired.' }, { status: 401 });

  const launch = await getLaunch(tokenPayload.launchId);
  if (!launch || new Date(launch.expiresAt).getTime() <= Date.now()) {
    return NextResponse.json({ error: 'This assignment launch has expired.' }, { status: 410 });
  }
  const puzzle = getZingPuzzle(launch.puzzleId);
  if (!puzzle) return NextResponse.json({ error: 'The assigned puzzle is no longer published.' }, { status: 404 });

  const now = new Date().toISOString();
  const existing = await getAttempt(tokenPayload.jti);
  if (existing?.status === 'completed') return NextResponse.json({ attempt: existing });

  const mistakes = boundedInteger(body.mistakes, 0, 1000);
  const hintsUsed = boundedInteger(body.hintsUsed, 0, puzzle.steps.length);
  const correctAnswers = body.event === 'completed' ? puzzle.steps.length : 0;
  const totalInteractions = correctAnswers + mistakes;
  const accuracy = totalInteractions > 0 ? Math.round((correctAnswers / totalInteractions) * 100) : 0;
  const score = body.event === 'completed' ? Math.max(0, 100 - mistakes * 10 - hintsUsed * 5) : 0;
  const webhookConfigured = Boolean(process.env.ZING_RESULTS_WEBHOOK_URL && process.env.ZING_WEBHOOK_SECRET);

  const attempt: ZingAttempt = {
    id: tokenPayload.jti,
    launchId: launch.id,
    assignmentId: launch.assignmentId,
    puzzleId: puzzle.id,
    puzzleTitle: puzzle.title,
    studentId: launch.studentId,
    studentName: launch.studentName,
    teacherId: launch.teacherId,
    classId: launch.classId,
    zingDeckId: launch.zingDeckId,
    zingSessionId: launch.zingSessionId,
    status: body.event,
    score,
    accuracy,
    correctAnswers,
    totalQuestions: puzzle.steps.length,
    mistakes,
    hintsUsed,
    durationSeconds: boundedInteger(body.durationSeconds, 0, 4 * 60 * 60),
    startedAt: existing?.startedAt || now,
    completedAt: body.event === 'completed' ? now : undefined,
    updatedAt: now,
    syncStatus: body.event === 'completed' && webhookConfigured ? 'pending' : 'not_configured'
  };

  await saveAttempt(attempt);
  if (body.event === 'completed' && webhookConfigured) {
    const syncStatus = await deliverZingResult(attempt);
    const syncedAttempt = await updateAttemptSyncStatus(attempt.id, syncStatus);
    return NextResponse.json({ attempt: syncedAttempt || attempt });
  }

  return NextResponse.json({ attempt });
}
