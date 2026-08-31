import { Activity } from '../types/chess';

export const DEFAULT_ACTIVITIES: Activity[] = [
  {
    id: "act-1",
    type: "multiple_choice",
    title: "Guided Activity: Identify Material Point Value",
    description: "A question about the position with a few answers to pick from.",
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
    options: ["Rook = 5 points", "Bishop = 3 points", "Queen = 9 points", "All of the above are correct"],
    correctAnswer: "All of the above are correct"
  },
  {
    id: "act-2",
    type: "fill_blank",
    title: "Square Coordinates Challenge",
    description: "The child types the answer — a square, a piece, a word.",
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1",
    correctAnswer: "f3"
  },
  {
    id: "act-3",
    type: "click_square",
    title: "Spot the Unprotected Square",
    description: "The child finds squares on the board. Nothing is highlighted for them.",
    fen: "r1bqk2r/pppp1ppp/2n5/4p3/2B1P3/8/PPPP1PPP/RNBQK2R w KQkq - 0 1",
    correctAnswer: "e5"
  },
  {
    id: "act-4",
    type: "place_pieces",
    title: "Rebuild the Starting Position",
    description: "The child rebuilds the position from a tray of pieces.",
    fen: "8/8/8/8/8/8/8/8 w - - 0 1",
    initialTray: [
      { piece: 'r', color: 'w' },
      { piece: 'n', color: 'w' },
      { piece: 'b', color: 'w' },
      { piece: 'q', color: 'w' },
      { piece: 'k', color: 'w' }
    ]
  },
  {
    id: "act-5",
    type: "play_bot",
    title: "Play Out the Endgame vs Bot",
    description: "The child plays the position out against the bot.",
    fen: "6k1/5ppp/8/8/8/8/1Q6/R3K3 w - - 0 1",
    botDifficulty: 1
  }
];

export function getActivities(): Activity[] {
  if (typeof window === 'undefined') return DEFAULT_ACTIVITIES;
  const stored = localStorage.getItem('unbox_custom_activities');
  if (!stored) return DEFAULT_ACTIVITIES;
  try {
    const custom: Activity[] = JSON.parse(stored);
    return [...DEFAULT_ACTIVITIES, ...custom];
  } catch (e) {
    return DEFAULT_ACTIVITIES;
  }
}

export function saveCustomActivity(activity: Activity): void {
  if (typeof window === 'undefined') return;
  const current = getActivities();
  const updated = [activity, ...current];
  localStorage.setItem('unbox_custom_activities', JSON.stringify(updated));
}
