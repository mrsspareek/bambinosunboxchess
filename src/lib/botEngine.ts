import { Chess } from 'chess.js';
import { MoveAnnotation } from '../types/chess';

export interface BotProfile {
  name: string;
  rating: number;
  avatar: string;
  openings: string[][]; // Array of PGN move sequences
  style: 'aggressive' | 'tactical' | 'solid' | 'positional';
}

export const BOT_PROFILES: BotProfile[] = [
  {
    name: "UnboxBot_Zaid",
    rating: 885,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
    style: "tactical",
    openings: [
      ["e2e4", "e7e5", "g1f3", "b8c6", "f1c4", "f8c5"], // Italian Game
      ["e2e4", "e7e5", "d2d4", "e5d4", "c2c3"] // Danish Gambit
    ]
  },
  {
    name: "KnightRider_99",
    rating: 940,
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80",
    style: "aggressive",
    openings: [
      ["e2e4", "c7c5", "g1f3", "d7d6", "d2d4"], // Sicilian Defense
      ["e2e4", "e7e5", "g1f3", "b8c6", "f1b5"] // Ruy Lopez
    ]
  },
  {
    name: "UnboxChessMaster",
    rating: 1020,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    style: "solid",
    openings: [
      ["d2d4", "d7d5", "c2c4", "e7e6"], // Queen's Gambit
      ["d2d4", "g8f6", "c1f4", "d7d5"] // London System
    ]
  },
  {
    name: "PawnStar_India",
    rating: 860,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    style: "positional",
    openings: [
      ["e2e4", "e7e6", "d2d4", "d7d5"], // French Defense
      ["c2c4", "e7e5", "b1c3", "g8f6"] // English Opening
    ]
  }
];

export function getRandomBot(): BotProfile {
  const randomIndex = Math.floor(Math.random() * BOT_PROFILES.length);
  return BOT_PROFILES[randomIndex];
}

// Generate move annotation (Brilliant, Blunder, Good Move, Checkmate)
export function evaluateMove(chess: Chess, moveFrom: string, moveTo: string): MoveAnnotation | null {
  const moveResult = chess.move({ from: moveFrom, to: moveTo, promotion: 'q' });
  if (!moveResult) return null;

  if (chess.isCheckmate()) {
    return { type: 'mate', symbol: '#', label: 'Checkmate!', square: moveTo };
  }
  if (chess.isCheck()) {
    return { type: 'check', symbol: '+', label: 'Check!', square: moveTo };
  }

  // Random evaluation for demo responsiveness
  const rand = Math.random();
  if (rand < 0.1) {
    return { type: 'brilliant', symbol: '!!', label: 'Brilliant Move!', square: moveTo };
  } else if (rand < 0.18) {
    return { type: 'blunder', symbol: '??', label: 'Blunder!', square: moveTo };
  } else if (rand < 0.35) {
    return { type: 'good', symbol: '!', label: 'Good Move', square: moveTo };
  }

  return null;
}

// Calculate bot move given current board FEN
export function getBotNextMove(fen: string, profile: BotProfile): { from: string; to: string } | null {
  const chess = new Chess(fen);
  const possibleMoves = chess.moves({ verbose: true });
  if (possibleMoves.length === 0) return null;

  // Prefer captures or checks if available
  const capturesOrChecks = possibleMoves.filter(m => m.captured || m.san.includes('+'));
  let chosenMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

  if (capturesOrChecks.length > 0 && Math.random() < 0.6) {
    chosenMove = capturesOrChecks[Math.floor(Math.random() * capturesOrChecks.length)];
  }

  return { from: chosenMove.from, to: chosenMove.to };
}
