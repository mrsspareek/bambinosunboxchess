import { NextRequest, NextResponse } from 'next/server';
import { readJsonCollection, updateJsonCollection } from '@/lib/server/jsonStore';
import { Puzzle } from '@/types/chess';

const ROTATING_DAILY_PUZZLES: Puzzle[] = [
  {
    id: "daily-1-greek-gift",
    title: "Daily Tactical Challenge: Greek Gift Sacrifice",
    theme: "Greek Gift Bishop Sacrifice",
    fen: "r1bq1rk1/ppp2ppp/2n1pn2/3p4/2PP4/2NBPN2/PP3PPP/R1BQK2R w KQ - 0 7",
    solution: ["d3h7", "g8h7", "f3g5"],
    rating: 1350,
    turn: 'w',
    difficulty: "Medium",
    puzzleType: "standard",
    description: "Launch the classic bishop sacrifice on h7 to shatter the black king's pawn shield.",
    characterPrompt: "Coach Zaid says: 'Look at Black's castled king. Can you break the defense with a brilliant bishop sacrifice on h7?'"
  },
  {
    id: "daily-2-smothered-mate",
    title: "Daily Tactical Challenge: Classic Smothered Mate",
    theme: "Smothered Checkmate",
    fen: "6rk/6pp/7N/8/8/8/8/6K1 w - - 0 1",
    solution: ["h6f7"],
    rating: 980,
    turn: 'w',
    difficulty: "Easy",
    puzzleType: "standard",
    description: "Find the knight jump delivering checkmate because Black's king is boxed in by its own pieces.",
    characterPrompt: "Coach Zaid says: 'The enemy king is trapped by its own rook and pawns. Deliver the knockout knight strike!'"
  },
  {
    id: "daily-3-back-rank-mate",
    title: "Daily Tactical Challenge: Back Rank Infiltration",
    theme: "Back-Rank Checkmate",
    fen: "3r2k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1",
    solution: ["d1d8"],
    rating: 650,
    turn: 'w',
    difficulty: "Easy",
    puzzleType: "standard",
    description: "Punish Black's lack of king escape square on the back rank.",
    characterPrompt: "Coach Zaid says: 'Spot the weak back rank and strike with your rook!'"
  },
  {
    id: "daily-4-queen-fork",
    title: "Daily Tactical Challenge: Royal Double Attack",
    theme: "Royal Double Attack Fork",
    fen: "r1bqk2r/pppp1ppp/2n5/4p3/1bB1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 5",
    solution: ["d1b3"],
    rating: 820,
    turn: 'w',
    difficulty: "Medium",
    puzzleType: "standard",
    description: "Use queen and bishop coordination to double-attack f7 and b4.",
    characterPrompt: "Coach Zaid says: 'Attack two targets at once with an aggressive queen centralization!'"
  },
  {
    id: "daily-5-decoy-deflection",
    title: "Daily Tactical Challenge: Decoy Deflection",
    theme: "Deflection & Skewer",
    fen: "4r1k1/5ppp/8/8/8/2Q5/5PPP/6K1 b - - 0 1",
    solution: ["e8e1", "c3e1"],
    rating: 1100,
    turn: 'b',
    difficulty: "Medium",
    puzzleType: "standard",
    description: "Deflect the defending queen to win critical advantage.",
    characterPrompt: "Coach Zaid says: 'Distract the defender from guarding the critical square!'"
  },
  {
    id: "daily-6-knight-outpost",
    title: "Daily Tactical Challenge: Knight Outpost Fork",
    theme: "Royal Knight Fork",
    fen: "r1b1k2r/pp3ppp/2n1pn2/q1bp4/4P3/2NB1N2/PPP2PPP/R1BQK2R w KQkq - 0 8",
    solution: ["e4e5", "f6d7", "c1d2"],
    rating: 1200,
    turn: 'w',
    difficulty: "Medium",
    puzzleType: "standard",
    description: "Push the center pawn to dislodge the defender and prepare a knight strike.",
    characterPrompt: "Coach Zaid says: 'Control key outposts to dismantle the opponent's pieces!'"
  },
  {
    id: "daily-7-opera-game-pin",
    title: "Daily Tactical Challenge: Morphy's Pin & Sacrifice",
    theme: "Pin & Discovered Check",
    fen: "4kb1r/p2rqppp/5n2/1B2p1B1/4P3/1Q6/PPP2PPP/R3K2R w KQk - 0 13",
    solution: ["e1c1", "a7a6", "b5d7"],
    rating: 1400,
    turn: 'w',
    difficulty: "Hard",
    puzzleType: "standard",
    description: "Castle queenside to bring maximum pressure on the pinned d7 rook, just like Paul Morphy.",
    characterPrompt: "Coach Zaid says: 'Bring all your pieces into the attack! Castle queenside with overwhelming pressure.'"
  }
];

interface DailyPuzzleRecord {
  date: string;
  puzzle: Puzzle;
  updatedAt: string;
}

function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDailyPuzzleForDate(dateStr: string): Puzzle {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % ROTATING_DAILY_PUZZLES.length;
  const base = ROTATING_DAILY_PUZZLES[index];
  return {
    ...base,
    id: `daily-${dateStr}`,
    title: `Daily Puzzle (${dateStr}): ${base.theme}`
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get('date') || getTodayDateString();

    const stored = await readJsonCollection<DailyPuzzleRecord>('daily_puzzles.json');
    const customRecord = stored.find(r => r.date === dateParam);

    const puzzle = customRecord ? customRecord.puzzle : getDailyPuzzleForDate(dateParam);

    return NextResponse.json({
      success: true,
      date: dateParam,
      puzzle,
      isAutoUpdated: true,
      lastSyncedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching daily puzzle:', error);
    const fallbackDate = getTodayDateString();
    return NextResponse.json({
      success: true,
      date: fallbackDate,
      puzzle: getDailyPuzzleForDate(fallbackDate),
      isAutoUpdated: false,
      lastSyncedAt: new Date().toISOString()
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const date = body.date || getTodayDateString();
    const puzzle: Puzzle = body.puzzle;

    if (!puzzle || !puzzle.fen) {
      return NextResponse.json({ success: false, error: 'Invalid puzzle payload' }, { status: 400 });
    }

    const newRecord: DailyPuzzleRecord = {
      date,
      puzzle: {
        ...puzzle,
        id: puzzle.id || `daily-${date}`,
        title: puzzle.title || `Daily Puzzle (${date})`
      },
      updatedAt: new Date().toISOString()
    };

    await updateJsonCollection<DailyPuzzleRecord, void>('daily_puzzles.json', (records) => {
      const filtered = records.filter(r => r.date !== date);
      return {
        items: [newRecord, ...filtered],
        result: undefined
      };
    });

    return NextResponse.json({
      success: true,
      message: `Daily puzzle for ${date} updated successfully`,
      record: newRecord
    });
  } catch (error) {
    console.error('Error updating daily puzzle:', error);
    return NextResponse.json({ success: false, error: 'Failed to update daily puzzle' }, { status: 500 });
  }
}
