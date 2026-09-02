export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type PieceColor = 'w' | 'b';

export interface MoveAnnotation {
  type: 'brilliant' | 'blunder' | 'good' | 'check' | 'mate';
  symbol: '!!' | '??' | '!' | '+' | '#';
  label: string;
  square: string;
}

export interface GameHistoryItem {
  id: string;
  date: string;
  opponent: string;
  opponentRating: number;
  opponentAvatar: string;
  playerRating: number;
  result: 'win' | 'loss' | 'draw';
  accuracy: number;
  timeControl: string;
  movesCount: number;
  isBot: boolean;
  pgn: string;
}

export type ActivityType = 'mcq' | 'multiple_choice' | 'fill_blank' | 'click_square' | 'place_pieces' | 'play_bot';

export interface GuidedActivity {
  id: string;
  type: ActivityType;
  question: string;
  helper?: string;
  choices?: string[];
  answer: string;
  focusSquare?: string | null;
  hint?: string;
}

export interface Puzzle {
  id: string;
  title: string;
  fen: string;
  solution: string[];
  rating: number;
  theme: string;
  description: string;
  characterPrompt?: string;
  turn: 'w' | 'b';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  level?: 1 | 2 | 3;
  sessionNumber?: number;
  category?: 'beginner' | 'advanced'; // Beginner vs Advanced category
  puzzleType?: 'standard' | 'guided_activity';
  boardSetup?: Record<string, string>;
  activities?: GuidedActivity[];
  pieceValues?: Record<string, number>;
  scoring?: {
    correctQuestions: number;
    wrongAttemptsAllowed: boolean;
    accuracyTracking: boolean;
  };
}

export interface SessionFolder {
  sessionNumber: number;
  category: 'beginner' | 'advanced';
  title: string;
  puzzlesCount: number;
  puzzles: Puzzle[];
}

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  fen: string;
  options?: string[];
  correctAnswer?: string | string[];
  initialTray?: { piece: PieceType; color: PieceColor }[];
  botDifficulty?: number;
}

export interface SessionPlan {
  sessionNumber: number;
  title: string;
  section: 'CONCEPT CLASS' | 'GAME & REINFORCEMENT CLASS' | 'IN-CLASS TOURNAMENT SESSION' | 'OPENING & TRICKS MASTERCLASS';
  primaryTool: string;
  topics: string[];
  coreConcept: string;
  kidExplanation: string;
  analogy: string;
  outcomeA: string;
  outcomeB: string;
  lessonSteps: { step: string; title: string; description: string }[];
}
