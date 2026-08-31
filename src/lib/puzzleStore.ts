import { Puzzle, SessionFolder } from '../types/chess';

export const GUIDED_PUZZLE_1: Puzzle = {
  id: "guided-puzzle-1-piece-coordinates",
  title: "Guided Puzzle 1: Piece Coordinates",
  sessionNumber: 1,
  category: "beginner",
  fen: "6k1/8/8/2b1p3/4P3/2N5/8/6K1 w - - 0 1",
  solution: [],
  rating: 300,
  theme: "Coordinates and Piece Values",
  description: "Read the board, identify exact chessboard coordinates, and recall basic material values.",
  characterPrompt: "Can you read the board, find the correct square, and remember which pieces are worth 3 points?",
  turn: "w",
  difficulty: "Easy",
  puzzleType: "guided_activity",
  boardSetup: {
    "g8": "black_king",
    "c5": "black_bishop",
    "e5": "black_pawn",
    "e4": "white_pawn",
    "c3": "white_knight",
    "g1": "white_king"
  },
  activities: [
    {
      id: "mission-1",
      type: "mcq",
      question: "What is the coordinate of the White Pawn?",
      helper: "Look at the file letter first, then the rank number.",
      choices: ["e4", "d4", "e5", "c3"],
      answer: "e4",
      focusSquare: "e4",
      hint: "Find the White Pawn, then read the file letter and rank number."
    },
    {
      id: "mission-2",
      type: "mcq",
      question: "What is the coordinate of the Black Bishop?",
      helper: "Find the dark bishop, then read File + Rank.",
      choices: ["c5", "c4", "e5", "b5"],
      answer: "c5",
      focusSquare: "c5",
      hint: "The Bishop is on the c-file and the 5th rank."
    },
    {
      id: "mission-3",
      type: "mcq",
      question: "Which piece is worth 3 points?",
      helper: "Recall the material values from the lesson.",
      choices: ["Knight only", "Bishop only", "Both Knight and Bishop", "Pawn"],
      answer: "Both Knight and Bishop",
      focusSquare: null,
      hint: "Two different minor pieces share the same value."
    }
  ],
  pieceValues: {
    pawn: 1,
    knight: 3,
    bishop: 3,
    rook: 5,
    queen: 9
  },
  scoring: {
    correctQuestions: 3,
    wrongAttemptsAllowed: true,
    accuracyTracking: true
  }
};

export const DEFAULT_PUZZLES: Puzzle[] = [
  GUIDED_PUZZLE_1,
  {
    id: "puz-session1-2",
    title: "Guided Puzzle 2: Material Values & Trades",
    sessionNumber: 1,
    category: "beginner",
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
    solution: ["c6d4", "f3d4"],
    rating: 320,
    theme: "Material Values",
    description: "Identify piece trades and capture the hanging knight.",
    characterPrompt: "Can you capture the unprotected knight?",
    turn: 'w',
    difficulty: "Easy",
    puzzleType: "standard"
  },
  {
    id: "puz-adv-session1-1",
    title: "Advanced Tactical Motif: Smothered Mate Trap",
    sessionNumber: 1,
    category: "advanced",
    fen: "6rk/5Npp/8/8/8/8/8/6K1 w - - 0 1",
    solution: ["f7h6"],
    rating: 1250,
    theme: "Smothered Mate",
    description: "Advanced smothered mate combination with double check.",
    characterPrompt: "Can you execute the famous 2-move smothered checkmate?",
    turn: 'w',
    difficulty: "Hard",
    puzzleType: "standard"
  }
];

export function getPuzzles(): Puzzle[] {
  if (typeof window === 'undefined') return DEFAULT_PUZZLES;
  const stored = localStorage.getItem('unbox_custom_puzzles');
  if (!stored) return DEFAULT_PUZZLES;
  try {
    const custom: Puzzle[] = JSON.parse(stored);
    return [...DEFAULT_PUZZLES, ...custom];
  } catch (e) {
    return DEFAULT_PUZZLES;
  }
}

// Group Puzzles into Session Folders by Category (Beginner vs Advanced)
export function getSessionFolders(category: 'beginner' | 'advanced' = 'beginner'): SessionFolder[] {
  const allPuzzles = getPuzzles().filter(p => (p.category || 'beginner') === category);
  const maxSessions = category === 'beginner' ? 48 : 36;
  const foldersMap: Record<number, Puzzle[]> = {};

  for (let i = 1; i <= maxSessions; i++) {
    foldersMap[i] = [];
  }

  allPuzzles.forEach((p) => {
    const sNum = p.sessionNumber || 1;
    if (foldersMap[sNum]) {
      foldersMap[sNum].push(p);
    }
  });

  return Object.keys(foldersMap).map((key) => {
    const num = parseInt(key, 10);
    return {
      sessionNumber: num,
      category,
      title: `${category === 'beginner' ? 'Beginner' : 'Advanced'} Session ${num} Folder`,
      puzzlesCount: foldersMap[num].length,
      puzzles: foldersMap[num]
    };
  });
}

// Automated JSON File Parser with Category Support
export function parseAndSaveJsonPuzzle(
  jsonInput: string,
  targetSessionNumber?: number,
  targetCategory: 'beginner' | 'advanced' = 'beginner'
): { success: boolean; count: number; puzzle?: Puzzle } {
  try {
    const parsed = JSON.parse(jsonInput);
    let puzzlesToSave: Puzzle[] = [];

    if (Array.isArray(parsed)) {
      puzzlesToSave = parsed.map(p => ({
        ...p,
        sessionNumber: targetSessionNumber || p.sessionNumber || 1,
        category: targetCategory || p.category || 'beginner',
        puzzleType: p.puzzleType || (p.activities && p.activities.length > 0 ? 'guided_activity' : 'standard')
      }));
    } else {
      const p = parsed as Puzzle;
      puzzlesToSave = [{
        ...p,
        sessionNumber: targetSessionNumber || p.sessionNumber || 1,
        category: targetCategory || p.category || 'beginner',
        puzzleType: p.puzzleType || (p.activities && p.activities.length > 0 ? 'guided_activity' : 'standard')
      }];
    }

    if (typeof window !== 'undefined') {
      const current = getPuzzles();
      const updated = [...puzzlesToSave, ...current];
      localStorage.setItem('unbox_custom_puzzles', JSON.stringify(updated));
    }

    return { success: true, count: puzzlesToSave.length, puzzle: puzzlesToSave[0] };
  } catch (e) {
    console.error('JSON Parse error:', e);
    return { success: false, count: 0 };
  }
}

export function saveCustomPuzzle(puzzle: Puzzle): void {
  if (typeof window === 'undefined') return;
  const current = getPuzzles();
  const updated = [puzzle, ...current];
  localStorage.setItem('unbox_custom_puzzles', JSON.stringify(updated));
}
