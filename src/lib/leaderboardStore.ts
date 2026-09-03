export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  matchPoints: number;
  puzzlePoints: number;
  totalPoints: number;
  streak: number;
  wins: number;
  city: string;
  isCurrentUser?: boolean;
}

export interface UserPointsState {
  matchPoints: number;
  puzzlePoints: number;
  totalPoints: number;
  streak: number;
}

export function maskName(fullName: string): string {
  if (!fullName) return '';
  const cleanName = fullName.replace(/\s*\(You\)/gi, '').trim();
  const parts = cleanName.split(' ');
  return parts.map(part => {
    if (part.length <= 2) return part[0] + '*';
    const visible = part.slice(0, 2);
    const hidden = '*'.repeat(Math.max(2, part.length - 2));
    return visible + hidden;
  }).join(' ');
}

export function getChessPieceForCandidate(rank: number, isCurrentUser?: boolean): string {
  if (isCurrentUser) {
    return '/pieces/cburnett/wK.svg'; // Student User DP is ALWAYS King!
  }
  switch (rank) {
    case 1:
      return '/pieces/cburnett/wK.svg'; // Rank 1 is King!
    case 2:
      return '/pieces/cburnett/wQ.svg'; // Rank 2 is Queen!
    case 3:
      return '/pieces/cburnett/wR.svg'; // Rank 3 is Rook!
    case 4:
      return '/pieces/cburnett/wB.svg'; // Rank 4 is Bishop!
    case 5:
      return '/pieces/cburnett/wN.svg'; // Rank 5 is Knight!
    default:
      return '/pieces/cburnett/wP.svg'; // Pawn for others
  }
}

const POINTS_STORAGE_KEY = 'unbox_user_points';

const INITIAL_MOCK_LEADERBOARD: Omit<LeaderboardEntry, 'rank'>[] = [
  {
    id: 'usr-1',
    name: 'Aarav Sharma',
    avatar: '/pieces/cburnett/wK.svg',
    matchPoints: 1250,
    puzzlePoints: 980,
    totalPoints: 2230,
    streak: 12,
    wins: 28,
    city: 'Mumbai'
  },
  {
    id: 'usr-2',
    name: 'Ananya Gupta',
    avatar: '/pieces/cburnett/wQ.svg',
    matchPoints: 1100,
    puzzlePoints: 1050,
    totalPoints: 2150,
    streak: 9,
    wins: 24,
    city: 'Delhi'
  },
  {
    id: 'usr-3',
    name: 'Rohan Verma',
    avatar: '/pieces/cburnett/wR.svg',
    matchPoints: 950,
    puzzlePoints: 890,
    totalPoints: 1840,
    streak: 7,
    wins: 21,
    city: 'Bangalore'
  },
  {
    id: 'usr-5',
    name: 'Vihaan Patel',
    avatar: '/pieces/cburnett/wB.svg',
    matchPoints: 620,
    puzzlePoints: 680,
    totalPoints: 1300,
    streak: 4,
    wins: 13,
    city: 'Ahmedabad'
  },
  {
    id: 'usr-6',
    name: 'Diya Reddy',
    avatar: '/pieces/cburnett/wN.svg',
    matchPoints: 540,
    puzzlePoints: 710,
    totalPoints: 1250,
    streak: 6,
    wins: 11,
    city: 'Hyderabad'
  },
  {
    id: 'usr-4',
    name: 'Shyam Pareek',   // 👈 Put your name here
    avatar: '/pieces/cburnett/wK.svg',
    matchPoints: 450,
    puzzlePoints: 320,
    totalPoints: 770,
    streak: 5,
    wins: 14,
    city: 'Bangalore',
    isCurrentUser: true
  },
  {
    id: 'usr-7',
    name: 'Kabir Mehta',
    avatar: '/pieces/cburnett/wP.svg',
    matchPoints: 480,
    puzzlePoints: 530,
    totalPoints: 1010,
    streak: 3,
    wins: 9,
    city: 'Pune'
  }
];

export function getUserPointsState(): UserPointsState {
  if (typeof window === 'undefined') {
    return { matchPoints: 450, puzzlePoints: 320, totalPoints: 770, streak: 5 };
  }
  try {
    const raw = localStorage.getItem(POINTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        matchPoints: parsed.matchPoints ?? 450,
        puzzlePoints: parsed.puzzlePoints ?? 320,
        totalPoints: (parsed.matchPoints ?? 450) + (parsed.puzzlePoints ?? 320),
        streak: parsed.streak ?? 5
      };
    }
  } catch (e) {
    console.error('Failed to parse user points', e);
  }
  return { matchPoints: 450, puzzlePoints: 320, totalPoints: 770, streak: 5 };
}

export function saveUserPointsState(state: Partial<UserPointsState>): UserPointsState {
  const current = getUserPointsState();
  const updated: UserPointsState = {
    matchPoints: state.matchPoints ?? current.matchPoints,
    puzzlePoints: state.puzzlePoints ?? current.puzzlePoints,
    totalPoints: (state.matchPoints ?? current.matchPoints) + (state.puzzlePoints ?? current.puzzlePoints),
    streak: state.streak ?? current.streak
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(POINTS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save user points', e);
    }
  }
  return updated;
}

export function addMatchPoints(amount: number): UserPointsState {
  const current = getUserPointsState();
  return saveUserPointsState({
    matchPoints: current.matchPoints + amount
  });
}

export function addPuzzlePoints(amount: number): UserPointsState {
  const current = getUserPointsState();
  return saveUserPointsState({
    puzzlePoints: current.puzzlePoints + amount,
    streak: current.streak + 1
  });
}

export function spendMatchPoints(amount: number): {success: boolean; newState: UserPointsState} {
  const current = getUserPointsState();
  if (current.matchPoints >= amount) {
    const newState = saveUserPointsState({
      matchPoints: current.matchPoints - amount
    });
    return { success: true, newState };
  }
  return { success: false, newState: current };
}

export function calculateStudentRank(userPoints: UserPointsState): number {
  const { totalPoints, streak } = userPoints;

  // Rule 3: Plays very well (High performance: totalPoints >= 1000 OR streak >= 8)
  // Show in Top 100, but strictly NOT above top 50 (i.e. rank between 51 and 99)
  if (totalPoints >= 1000 || streak >= 8) {
    const scoreFactor = Math.min(totalPoints, 2500);
    const calculatedRank = Math.max(51, Math.min(99, 100 - Math.floor((scoreFactor - 1000) / 35)));
    return calculatedRank;
  }

  // Rule 2: Skips any day (Inactivity / 0 streak) -> Rank decreases further down
  if (streak === 0) {
    return 485;
  }

  // Rule 1: Plays daily (Regular active player with streak 1 to 7) -> Rank between 200 and 300
  const baseDailyRank = 295 - Math.floor((streak / 7) * 85);
  return Math.max(201, Math.min(299, baseDailyRank));
}

export function getMatchLeaderboard(): LeaderboardEntry[] {
  const userPoints = getUserPointsState();
  const studentRank = calculateStudentRank(userPoints);

  return INITIAL_MOCK_LEADERBOARD.map((item, index) => {
    if (item.isCurrentUser) {
      return {
        ...item,
        matchPoints: userPoints.matchPoints,
        puzzlePoints: userPoints.puzzlePoints,
        totalPoints: userPoints.totalPoints,
        streak: userPoints.streak,
        rank: studentRank
      };
    }
    return { ...item, rank: index + 1 };
  });
}

export function getDailyPuzzleLeaderboard(): LeaderboardEntry[] {
  const userPoints = getUserPointsState();
  const studentRank = calculateStudentRank(userPoints);

  return INITIAL_MOCK_LEADERBOARD.map((item, index) => {
    if (item.isCurrentUser) {
      return {
        ...item,
        matchPoints: userPoints.matchPoints,
        puzzlePoints: userPoints.puzzlePoints,
        totalPoints: userPoints.totalPoints,
        streak: userPoints.streak,
        rank: studentRank
      };
    }
    return { ...item, rank: index + 1 };
  });
}

export function getOverallLeaderboard(): LeaderboardEntry[] {
  const userPoints = getUserPointsState();
  const studentRank = calculateStudentRank(userPoints);

  return INITIAL_MOCK_LEADERBOARD.map((item, index) => {
    if (item.isCurrentUser) {
      return {
        ...item,
        matchPoints: userPoints.matchPoints,
        puzzlePoints: userPoints.puzzlePoints,
        totalPoints: userPoints.totalPoints,
        streak: userPoints.streak,
        rank: studentRank
      };
    }
    return { ...item, rank: index + 1 };
  });
}

export interface MagnusHint {
  cost: number;
  title: string;
  quote: string;
  keyTactics: string;
  recommendedMoveText: string;
}

const MAGNUS_HINT_TEMPLATES: Omit<MagnusHint, 'cost'>[] = [
  {
    title: 'Magnus Carlsen: Intuition & Pressure',
    quote: 'Some people think that if their opponent plays a beautiful move, it must be right. I always double check if there is a refutation!',
    keyTactics: 'Control central squares (e, d, e5, d5). Advance minor pieces into active outposts.',
    recommendedMoveText: 'Look for forward Knight jumps or Rook doubling on open files.'
  },
  {
    title: 'Magnus Carlsen: Piece Activation',
    quote: 'If you want to win, you have to create imbalances. Dont trade off your active pieces for passive defenders.',
    keyTactics: 'Activate your least active piece. Look for knight forks or pinning enemy defenders.',
    recommendedMoveText: 'Bring your Queen and Rook into alignment on the open file.'
  },
  {
    title: 'Magnus Carlsen: Endgame Precision',
    quote: 'In chess, small advantages can be converted into wins by relentless pressure in the endgame.',
    keyTactics: 'Centralize your King! In the endgame, the King becomes an active offensive weapon.',
    recommendedMoveText: 'Push passed pawns while keeping king opposition.'
  },
  {
    title: 'Magnus Carlsen: Defensive Refutation',
    quote: 'Always look for tactical counter-strikes when your opponent attacks prematurely without developing.',
    keyTactics: 'Check for undefended pieces. A sudden diagonal strike can win material on the spot.',
    recommendedMoveText: 'Look for skewers and battery attacks on weak pawns.'
  }
];

export function getRandomMagnusHint(): MagnusHint {
  const template = MAGNUS_HINT_TEMPLATES[Math.floor(Math.random() * MAGNUS_HINT_TEMPLATES.length)];
  return {
    cost: 20,
    ...template
  };
}
