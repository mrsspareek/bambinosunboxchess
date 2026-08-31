'use client';

import React, { useEffect, useState } from 'react';
import { Chess, Square } from 'chess.js';
import { MoveAnnotation } from '../types/chess';

interface LessonChessboardProps {
  fen: string;
  orientation?: 'white' | 'black';
  mode: 'squares' | 'moves';
  onAnswer: (answer: string, destinationSquare: string) => void;
  annotation?: MoveAnnotation | null;
  highlightedSquare?: string | null;
  interactive?: boolean;
}

const PIECES: Record<string, string> = {
  'w-p': '♙', 'w-r': '♖', 'w-n': '♘', 'w-b': '♗', 'w-q': '♕', 'w-k': '♔',
  'b-p': '♟', 'b-r': '♜', 'b-n': '♞', 'b-b': '♝', 'b-q': '♛', 'b-k': '♚'
};

export function LessonChessboard({
  fen,
  orientation = 'white',
  mode,
  onAnswer,
  annotation,
  highlightedSquare,
  interactive = true
}: LessonChessboardProps) {
  const [game, setGame] = useState(() => new Chess(fen));
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Square[]>([]);

  useEffect(() => {
    setGame(new Chess(fen));
    setSelectedSquare(null);
    setPossibleMoves([]);
  }, [fen]);

  const handleSquareClick = (square: Square) => {
    if (!interactive) return;
    if (mode === 'squares') {
      onAnswer(square, square);
      return;
    }

    if (selectedSquare && possibleMoves.includes(square)) {
      onAnswer(`${selectedSquare}${square}`, square);
      setSelectedSquare(null);
      setPossibleMoves([]);
      return;
    }

    const piece = game.get(square);
    if (!piece) {
      setSelectedSquare(null);
      setPossibleMoves([]);
      return;
    }

    setSelectedSquare(square);
    setPossibleMoves(game.moves({ square, verbose: true }).map((move) => move.to as Square));
  };

  const files = orientation === 'white'
    ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    : ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];
  const ranks = orientation === 'white'
    ? ['8', '7', '6', '5', '4', '3', '2', '1']
    : ['1', '2', '3', '4', '5', '6', '7', '8'];

  return (
    <div className="aspect-square w-full overflow-hidden rounded-2xl border-4 border-bambinos-600 bg-white shadow-2xl">
      <div className="grid h-full w-full grid-cols-8 grid-rows-8">
        {ranks.map((rank, rankIndex) =>
          files.map((file, fileIndex) => {
            const square = `${file}${rank}` as Square;
            const piece = game.get(square);
            const dark = (rankIndex + fileIndex) % 2 === 1;
            const selected = selectedSquare === square;
            const possible = possibleMoves.includes(square);
            const annotated = annotation?.square === square;
            const highlighted = highlightedSquare === square;

            return (
              <button
                type="button"
                key={square}
                aria-label={`Square ${square}${piece ? `, ${piece.color === 'w' ? 'white' : 'black'} ${piece.type}` : ''}`}
                onClick={() => handleSquareClick(square)}
                className={`relative flex items-center justify-center transition-all ${dark ? 'bg-bambinos-600' : 'bg-slate-100'} ${selected ? '!bg-amber-300' : ''} ${highlighted ? 'z-10 ring-4 ring-inset ring-amber-400' : ''}`}
              >
                {fileIndex === 0 && (
                  <span className={`absolute left-1 top-0.5 text-[9px] font-black ${dark ? 'text-white/80' : 'text-bambinos-700'}`}>{rank}</span>
                )}
                {rankIndex === 7 && (
                  <span className={`absolute bottom-0 right-1 text-[9px] font-black ${dark ? 'text-white/80' : 'text-bambinos-700'}`}>{file}</span>
                )}
                {possible && <span className={`absolute z-10 rounded-full ${piece ? 'inset-1 border-4 border-emerald-400' : 'h-3 w-3 bg-emerald-500'}`} />}
                {annotated && annotation && (
                  <span className={`absolute right-0 top-0 z-20 rounded-bl-lg px-1.5 py-0.5 text-[10px] font-black text-white ${annotation.type === 'blunder' ? 'bg-rose-500' : 'bg-emerald-500'}`}>
                    {annotation.symbol}
                  </span>
                )}
                {piece && (
                  <span className={`relative z-[5] select-none font-serif text-[clamp(1.7rem,7vw,4.5rem)] leading-none ${piece.color === 'w' ? 'text-white [text-shadow:_0_2px_3px_rgb(15_23_42_/_95%)]' : 'text-slate-950 [text-shadow:_0_1px_2px_rgb(255_255_255_/_80%)]'}`}>
                    {PIECES[`${piece.color}-${piece.type}`]}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
