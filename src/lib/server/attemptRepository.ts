import { ZingAttempt, ZingSyncStatus } from '../../types/zing';
import { readJsonCollection, updateJsonCollection } from './jsonStore';

const FILE_NAME = 'zing-attempts.json';

export async function saveAttempt(attempt: ZingAttempt): Promise<ZingAttempt> {
  return updateJsonCollection<ZingAttempt, ZingAttempt>(FILE_NAME, (attempts) => {
    const existingIndex = attempts.findIndex((item) => item.id === attempt.id);
    const next = [...attempts];
    if (existingIndex >= 0) next[existingIndex] = attempt;
    else next.unshift(attempt);
    return { items: next.slice(0, 50000), result: attempt };
  });
}

export async function getAttempt(attemptId: string): Promise<ZingAttempt | null> {
  const attempts = await readJsonCollection<ZingAttempt>(FILE_NAME);
  return attempts.find((attempt) => attempt.id === attemptId) || null;
}

export async function listAttempts(teacherId?: string): Promise<ZingAttempt[]> {
  const attempts = await readJsonCollection<ZingAttempt>(FILE_NAME);
  return attempts
    .filter((attempt) => !teacherId || attempt.teacherId === teacherId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function updateAttemptSyncStatus(
  attemptId: string,
  syncStatus: ZingSyncStatus
): Promise<ZingAttempt | null> {
  return updateJsonCollection<ZingAttempt, ZingAttempt | null>(FILE_NAME, (attempts) => {
    const index = attempts.findIndex((attempt) => attempt.id === attemptId);
    if (index < 0) return { items: attempts, result: null };
    const updated = { ...attempts[index], syncStatus, updatedAt: new Date().toISOString() };
    const next = [...attempts];
    next[index] = updated;
    return { items: next, result: updated };
  });
}
