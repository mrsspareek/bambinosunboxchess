import { Puzzle, SessionFolder } from '../types/chess';

// LEVEL 1: BEGINNER PUZZLES (Fundamentals, Coordinates, 1-Move Captures & Mates)
export const LEVEL_1_PUZZLES: Puzzle[] = [
  {
    id: "lvl1-puz-1-coords",
    title: "Guided Activity: Coordinates & Piece Values",
    sessionNumber: 1,
    level: 1,
    category: "beginner",
    fen: "6k1/8/8/2b1p3/4P3/2N5/8/6K1 w - - 0 1",
    solution: [],
    rating: 300,
    theme: "Coordinates & Values",
    description: "Read the board, identify exact chessboard coordinates, and recall basic material values.",
    characterPrompt: "Coach Zaid says: 'Can you read the board, find the correct square, and remember which pieces are worth 3 points?'",
    turn: "w",
    difficulty: "Easy",
    puzzleType: "guided_activity",
    activities: [
      {
        id: "mission-1",
        type: "mcq",
        question: "What is the coordinate of the White Pawn?",
        helper: "Look at the file letter first, then the rank number.",
        choices: ["e4", "d4", "e5", "c3"],
        answer: "e4",
        focusSquare: "e4",
        hint: "Find the White Pawn, then read the file letter (e) and rank number (4)."
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
        question: "Which pieces are worth 3 points?",
        helper: "Recall the material values from lesson.",
        choices: ["Knight only", "Bishop only", "Both Knight and Bishop", "Pawn"],
        answer: "Both Knight and Bishop",
        focusSquare: null,
        hint: "Both minor pieces share 3 points value."
      }
    ]
  },
  {
    id: "lvl1-puz-2-scholars-mate",
    title: "Scholar's Mate Knockout",
    sessionNumber: 2,
    level: 1,
    category: "beginner",
    fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 4 4",
    solution: ["f3f7"],
    rating: 400,
    theme: "Checkmate in 1",
    description: "Deliver immediate checkmate by attacking the weak f7 square with Queen supported by Bishop.",
    characterPrompt: "Coach Zaid says: 'Spot the weak f7 square and strike with your Queen for victory!'",
    turn: "w",
    difficulty: "Easy",
    puzzleType: "standard"
  },
  {
    id: "lvl1-puz-3-hanging-rook",
    title: "Capture the Free Hanging Rook",
    sessionNumber: 3,
    level: 1,
    category: "beginner",
    fen: "r1bqk2r/pppp1ppp/2n5/4p3/8/5N2/PPPP1PPP/R1BQKB1R w KQkq - 0 6",
    solution: ["f3e5"],
    rating: 350,
    theme: "Free Material Capture",
    description: "Find the unprotected piece and grab it safely.",
    characterPrompt: "Coach Zaid says: 'Look for undefended material and win free points!'",
    turn: "w",
    difficulty: "Easy",
    puzzleType: "standard"
  },
  {
    id: "lvl1-puz-4-backrank-mate",
    title: "Back-Rank Queen Checkmate",
    sessionNumber: 4,
    level: 1,
    category: "beginner",
    fen: "4r1k1/5ppp/8/8/8/8/1Q3PPP/6K1 w - - 0 1",
    solution: ["b2b8"],
    rating: 450,
    theme: "Back-Rank Mate",
    description: "Invade the 8th rank with your Queen to deliver mate against the trapped king.",
    characterPrompt: "Coach Zaid says: 'The opponent\'s king has no breathing room. Strike the back rank!'",
    turn: "w",
    difficulty: "Easy",
    puzzleType: "standard"
  },
  {
    id: "lvl1-puz-5-fools-mate",
    title: "Fool's Mate Diagonal Strike",
    sessionNumber: 5,
    level: 1,
    category: "beginner",
    fen: "rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 2",
    solution: ["d8h4"],
    rating: 320,
    theme: "Checkmate in 1",
    description: "Exploit the opened e1-h4 diagonal to deliver the fastest checkmate in chess.",
    characterPrompt: "Coach Zaid says: 'White weakened the diagonal to the king. Punish them with Qh4#!'",
    turn: "b",
    difficulty: "Easy",
    puzzleType: "standard"
  }
];

// LEVEL 2: INTERMEDIATE PUZZLES (Forks, Pins, Skewers, Discovered Attacks, Mate in 2)
export const LEVEL_2_PUZZLES: Puzzle[] = [
  {
    id: "lvl2-puz-1-royal-fork",
    title: "Royal Knight Fork",
    sessionNumber: 6,
    level: 2,
    category: "beginner",
    fen: "r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 5",
    solution: ["c4f7", "e8f7"],
    rating: 750,
    theme: "Knight Fork & King Trap",
    description: "Sacrifice on f7 to pull out the king, setting up a winning knight fork.",
    characterPrompt: "Coach Zaid says: 'Disrupt the enemy king\'s safety with a dynamic sacrifice!'",
    turn: "w",
    difficulty: "Medium",
    puzzleType: "standard"
  },
  {
    id: "lvl2-puz-2-absolute-pin",
    title: "Pin the Queen to the King",
    sessionNumber: 7,
    level: 2,
    category: "beginner",
    fen: "r1b1k2r/pppp1ppp/8/4q3/1b6/2N5/PPP1BPPP/R1BQK2R w KQkq - 0 9",
    solution: ["e1g1"],
    rating: 820,
    theme: "Absolute Pin & Safety",
    description: "Castle to safety and prepare to pin the Black Queen on the e-file with Re1.",
    characterPrompt: "Coach Zaid says: 'Castle first, then prepare an unstoppable pin on the open e-file!'",
    turn: "w",
    difficulty: "Medium",
    puzzleType: "standard"
  },
  {
    id: "lvl2-puz-3-discovered-check",
    title: "Discovered Attack Battery",
    sessionNumber: 8,
    level: 2,
    category: "beginner",
    fen: "r1bqk2r/pppp1ppp/2n5/2b1P3/2B3n1/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 1 6",
    solution: ["d2d4"],
    rating: 880,
    theme: "Center Fork & Discovery",
    description: "Strike in the center with d4, attacking the bishop and opening lines.",
    characterPrompt: "Coach Zaid says: 'Take the center with d4! It attacks the bishop and controls key squares.'",
    turn: "w",
    difficulty: "Medium",
    puzzleType: "standard"
  },
  {
    id: "lvl2-puz-4-anastasia-mate",
    title: "Anastasia's Mate Combination",
    sessionNumber: 9,
    level: 2,
    category: "beginner",
    fen: "5rk1/1p3ppp/8/2N5/8/8/1Q3PPP/5RK1 w - - 0 1",
    solution: ["b2b7"],
    rating: 920,
    theme: "Knight Dominance & Mate",
    description: "Win material and establish dominating knight outpost.",
    characterPrompt: "Coach Zaid says: 'Clean up the queenside pawns while maintaining kingside pressure.'",
    turn: "w",
    difficulty: "Medium",
    puzzleType: "standard"
  },
  {
    id: "lvl2-puz-5-skewer-tactic",
    title: "Rook Skewer on 7th Rank",
    sessionNumber: 10,
    level: 2,
    category: "beginner",
    fen: "4k3/R7/8/8/8/8/6r1/4K3 w - - 0 1",
    solution: ["e1f1"],
    rating: 850,
    theme: "King & Rook Skewer",
    description: "Drive away the attacking rook to seize complete endgame control.",
    characterPrompt: "Coach Zaid says: 'Use your king actively to repel the opponent\'s rook!'",
    turn: "w",
    difficulty: "Medium",
    puzzleType: "standard"
  }
];

// LEVEL 3: ADVANCED PUZZLES (Master Motifs, Sacrifices, Smothered Mates, Complex Tactics)
export const LEVEL_3_PUZZLES: Puzzle[] = [
  {
    id: "lvl3-puz-1-smothered-mate",
    title: "Philidor's Smothered Mate Trap",
    sessionNumber: 11,
    level: 3,
    category: "advanced",
    fen: "6rk/5Npp/8/8/8/8/8/6K1 w - - 0 1",
    solution: ["f7h6"],
    rating: 1250,
    theme: "Smothered Mate",
    description: "Advanced smothered mate combination with double check.",
    characterPrompt: "Coach Zaid says: 'Can you execute the famous 2-move smothered checkmate?'",
    turn: "w",
    difficulty: "Hard",
    puzzleType: "standard"
  },
  {
    id: "lvl3-puz-2-greek-gift",
    title: "Greek Gift Masterpiece",
    sessionNumber: 12,
    level: 3,
    category: "advanced",
    fen: "r1bq1rk1/ppp2ppp/2n1pn2/3p4/2PP4/2NBPN2/PP3PPP/R1BQK2R w KQ - 0 7",
    solution: ["d3h7", "g8h7", "f3g5"],
    rating: 1350,
    theme: "Bxh7+ Sacrifice",
    description: "Shatter the king shield with a tactical bishop sacrifice on h7.",
    characterPrompt: "Coach Zaid says: 'Sacrifice the bishop on h7 to force the king into the open!'",
    turn: "w",
    difficulty: "Hard",
    puzzleType: "standard"
  },
  {
    id: "lvl3-puz-3-queen-deflection",
    title: "Brilliant Deflection Combination",
    sessionNumber: 13,
    level: 3,
    category: "advanced",
    fen: "4r1k1/5ppp/8/8/8/2Q5/5PPP/6K1 b - - 0 1",
    solution: ["e8e1", "c3e1"],
    rating: 1100,
    theme: "Queen Deflection",
    description: "Deflect the queen from guarding back-rank defense.",
    characterPrompt: "Coach Zaid says: 'Distract the defender from guarding the critical square!'",
    turn: "b",
    difficulty: "Hard",
    puzzleType: "standard"
  },
  {
    id: "lvl3-puz-4-opera-pin",
    title: "Morphy's Opera House Pin",
    sessionNumber: 14,
    level: 3,
    category: "advanced",
    fen: "4kb1r/p2rqppp/5n2/1B2p1B1/4P3/1Q6/PPP2PPP/R3K2R w KQk - 0 13",
    solution: ["e1c1", "a7a6", "b5d7"],
    rating: 1400,
    theme: "Discovered Pin & Mate",
    description: "Castle queenside to bring maximum pressure on the pinned d7 rook.",
    characterPrompt: "Coach Zaid says: 'Bring all your pieces into the attack! Castle queenside with crushing force.'",
    turn: "w",
    difficulty: "Hard",
    puzzleType: "standard"
  },
  {
    id: "lvl3-puz-5-endgame-opposition",
    title: "King Opposition Key Square",
    sessionNumber: 15,
    level: 3,
    category: "advanced",
    fen: "8/8/4k3/8/4K3/8/4P3/8 w - - 0 1",
    solution: ["e4d4", "e6d6", "e2e4"],
    rating: 1300,
    theme: "Endgame Opposition",
    description: "Take direct opposition to queen the passed pawn.",
    characterPrompt: "Coach Zaid says: 'Take direct opposition to guide your pawn to promotion!'",
    turn: "w",
    difficulty: "Hard",
    puzzleType: "standard"
  }
];

export const ALL_LEVEL_PUZZLES: Puzzle[] = [
  ...LEVEL_1_PUZZLES,
  ...LEVEL_2_PUZZLES,
  ...LEVEL_3_PUZZLES
];

export function getLevelPuzzles(level: 1 | 2 | 3): Puzzle[] {
  if (level === 1) return LEVEL_1_PUZZLES;
  if (level === 2) return LEVEL_2_PUZZLES;
  return LEVEL_3_PUZZLES;
}

export function getAllPuzzles(): Puzzle[] {
  return ALL_LEVEL_PUZZLES;
}

export function getPuzzles(): Puzzle[] {
  return ALL_LEVEL_PUZZLES;
}

// ---------------------------------------------------------------------
// PUZZLE TRACKER PERSISTENCE HELPERS
// ---------------------------------------------------------------------
const SOLVED_STORAGE_KEY = 'unbox_solved_puzzle_ids';

export function getSolvedPuzzleIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SOLVED_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function isPuzzleSolved(puzzleId: string): boolean {
  const solved = getSolvedPuzzleIds();
  return solved.includes(puzzleId);
}

export function markPuzzleSolved(puzzleId: string): { totalSolved: number; isNew: boolean } {
  if (typeof window === 'undefined') return { totalSolved: 0, isNew: false };
  try {
    const solved = getSolvedPuzzleIds();
    const isNew = !solved.includes(puzzleId);
    if (isNew) {
      const updated = [...solved, puzzleId];
      localStorage.setItem(SOLVED_STORAGE_KEY, JSON.stringify(updated));
      return { totalSolved: updated.length, isNew: true };
    }
    return { totalSolved: solved.length, isNew: false };
  } catch (e) {
    return { totalSolved: 0, isNew: false };
  }
}

export interface PuzzleTrackerStats {
  totalSolved: number;
  totalPuzzles: number;
  level1Count: number;
  level1Solved: number;
  level2Count: number;
  level2Solved: number;
  level3Count: number;
  level3Solved: number;
  dailySolved: boolean;
  accuracy: number;
  streak: number;
  rating: number;
}

export function getPuzzleTrackerStats(): PuzzleTrackerStats {
  const solvedIds = getSolvedPuzzleIds();
  const lvl1Ids = LEVEL_1_PUZZLES.map(p => p.id);
  const lvl2Ids = LEVEL_2_PUZZLES.map(p => p.id);
  const lvl3Ids = LEVEL_3_PUZZLES.map(p => p.id);

  const level1Solved = lvl1Ids.filter(id => solvedIds.includes(id)).length;
  const level2Solved = lvl2Ids.filter(id => solvedIds.includes(id)).length;
  const level3Solved = lvl3Ids.filter(id => solvedIds.includes(id)).length;

  const todayStr = new Date().toISOString().split('T')[0];
  const dailySolved = solvedIds.some(id => id.includes(todayStr) || id.startsWith('daily-'));

  const totalPuzzles = ALL_LEVEL_PUZZLES.length;
  const totalSolved = solvedIds.length;
  const accuracy = totalSolved > 0 ? Math.min(100, Math.round(75 + totalSolved * 1.5)) : 82;
  const rating = 450 + totalSolved * 35;
  const streak = Math.max(1, Math.min(15, totalSolved));

  return {
    totalSolved,
    totalPuzzles,
    level1Count: LEVEL_1_PUZZLES.length,
    level1Solved,
    level2Count: LEVEL_2_PUZZLES.length,
    level2Solved,
    level3Count: LEVEL_3_PUZZLES.length,
    level3Solved,
    dailySolved,
    accuracy,
    streak,
    rating
  };
}

// Group Puzzles into Session Folders (maintained for backward compatibility)
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

// Automated JSON File Parser with Category Support for Admin Studio
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
