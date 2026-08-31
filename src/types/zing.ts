export type ZingPuzzleMode = 'square_sequence' | 'move_sequence';

export interface ZingPuzzleStep {
  id: string;
  prompt: string;
  answer: string;
  successMessage: string;
}

export interface ZingPuzzleDefinition {
  id: string;
  title: string;
  lessonTitle: string;
  lessonNumber: number;
  description: string;
  coachPrompt: string;
  fen: string;
  orientation: 'white' | 'black';
  mode: ZingPuzzleMode;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedMinutes: number;
  steps: ZingPuzzleStep[];
}

export interface ZingLaunchRecord {
  id: string;
  assignmentId: string;
  puzzleId: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  classId?: string;
  zingDeckId?: string;
  zingSessionId?: string;
  returnUrl?: string;
  createdAt: string;
  expiresAt: string;
}

export type ZingAttemptStatus = 'started' | 'completed';
export type ZingSyncStatus = 'not_configured' | 'pending' | 'delivered' | 'failed';

export interface ZingAttempt {
  id: string;
  launchId: string;
  assignmentId: string;
  puzzleId: string;
  puzzleTitle: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  classId?: string;
  zingDeckId?: string;
  zingSessionId?: string;
  status: ZingAttemptStatus;
  score: number;
  accuracy: number;
  correctAnswers: number;
  totalQuestions: number;
  mistakes: number;
  hintsUsed: number;
  durationSeconds: number;
  startedAt: string;
  completedAt?: string;
  updatedAt: string;
  syncStatus: ZingSyncStatus;
}

export interface ZingAttemptEvent {
  launchToken: string;
  event: ZingAttemptStatus;
  score?: number;
  accuracy?: number;
  correctAnswers?: number;
  totalQuestions?: number;
  mistakes?: number;
  hintsUsed?: number;
  durationSeconds?: number;
}
