import { createHmac } from 'node:crypto';
import { ZingAttempt } from '../../types/zing';

export async function deliverZingResult(attempt: ZingAttempt): Promise<'not_configured' | 'delivered' | 'failed'> {
  const webhookUrl = process.env.ZING_RESULTS_WEBHOOK_URL;
  const webhookSecret = process.env.ZING_WEBHOOK_SECRET;
  if (!webhookUrl || !webhookSecret) return 'not_configured';

  const payload = JSON.stringify({
    event: 'unbox_chess.puzzle.completed',
    version: '2026-08-31',
    occurredAt: attempt.completedAt,
    data: {
      attemptId: attempt.id,
      assignmentId: attempt.assignmentId,
      studentId: attempt.studentId,
      puzzleId: attempt.puzzleId,
      score: attempt.score,
      accuracy: attempt.accuracy,
      correctAnswers: attempt.correctAnswers,
      totalQuestions: attempt.totalQuestions,
      mistakes: attempt.mistakes,
      hintsUsed: attempt.hintsUsed,
      durationSeconds: attempt.durationSeconds
    }
  });
  const webhookSignature = createHmac('sha256', webhookSecret).update(payload).digest('hex');

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-unbox-event': 'unbox_chess.puzzle.completed',
        'x-unbox-signature': `sha256=${webhookSignature}`
      },
      body: payload,
      signal: AbortSignal.timeout(5000)
    });
    return response.ok ? 'delivered' : 'failed';
  } catch {
    return 'failed';
  }
}
