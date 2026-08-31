import { ZingPuzzleDefinition } from '../types/zing';

export const ZING_PUZZLES: ZingPuzzleDefinition[] = [
  {
    id: 'guided-puzzle-1-piece-coordinates',
    title: 'Guided Puzzle 1: Piece Coordinates',
    lessonTitle: 'Meet the Board and Meet the Army',
    lessonNumber: 1,
    description: 'Identify the exact board coordinates of the pieces from the Zing lesson.',
    coachPrompt: 'Find each piece by reading the file letter first and the rank number second.',
    fen: '6k1/8/8/2b1p3/4P3/2N5/8/6K1 w - - 0 1',
    orientation: 'white',
    mode: 'square_sequence',
    difficulty: 'Easy',
    estimatedMinutes: 3,
    steps: [
      {
        id: 'white-pawn',
        prompt: 'Tap the square occupied by the White Pawn.',
        answer: 'e4',
        successMessage: 'Correct — the White Pawn is on e4.'
      },
      {
        id: 'black-bishop',
        prompt: 'Tap the square occupied by the Black Bishop.',
        answer: 'c5',
        successMessage: 'Correct — the Black Bishop is on c5.'
      },
      {
        id: 'white-knight',
        prompt: 'Tap the square occupied by the White Knight.',
        answer: 'c3',
        successMessage: 'Correct — the White Knight is on c3.'
      },
      {
        id: 'black-pawn',
        prompt: 'Tap the square occupied by the Black Pawn.',
        answer: 'e5',
        successMessage: 'Correct — the Black Pawn is on e5.'
      }
    ]
  },
  {
    id: 'guided-puzzle-2-back-rank',
    title: 'Guided Puzzle 2: Back-Rank Mate',
    lessonTitle: 'Checkmate Patterns',
    lessonNumber: 10,
    description: 'Deliver checkmate while the King is trapped behind its own pawns.',
    coachPrompt: 'Look at the open eighth rank. Which rook move ends the game?',
    fen: '6k1/5ppp/8/8/8/8/8/1R4K1 w - - 0 1',
    orientation: 'white',
    mode: 'move_sequence',
    difficulty: 'Easy',
    estimatedMinutes: 2,
    steps: [
      {
        id: 'mate-in-one',
        prompt: 'Deliver checkmate in one move.',
        answer: 'b1b8',
        successMessage: 'Checkmate! The rook controls the entire back rank.'
      }
    ]
  }
];

export function getZingPuzzle(puzzleId: string): ZingPuzzleDefinition | undefined {
  return ZING_PUZZLES.find((puzzle) => puzzle.id === puzzleId);
}
