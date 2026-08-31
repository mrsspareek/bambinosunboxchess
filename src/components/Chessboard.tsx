'use client';

import React, { useState, useEffect } from 'react';
import { Chess, Square } from 'chess.js';
import { MoveAnnotation } from '../types/chess';
import { sound } from '../lib/sound';

interface ChessboardProps {
  fen?: string;
  onMove?: (from: string, to: string) => void;
  orientation?: 'white' | 'black';
  annotation?: MoveAnnotation | null;
  interactive?: boolean;
  showEvalBar?: boolean;
  evaluation?: number;
}

const PIECE_UNICODE: Record<string, string> = {
  'w-p': '♙', 'w-r': '♖', 'w-n': '♘', 'w-b': '♗', 'w-q': '♕', 'w-k': '♔',
  'b-p': '♟', 'b-r': '♜', 'b-n': '♞', 'b-b': '♝', 'b-q': '♛', 'b-k': '♚'
};

export const Chessboard: React.FC<ChessboardProps> = ({
  fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  onMove,
  orientation = 'white',
  annotation,
  interactive = true,
  showEvalBar = true,
  evaluation = 0.2
}) => {
  const [game, setGame] = useState<Chess>(new Chess(fen));
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Square[]>([]);

  useEffect(() => {
    try {
      setGame(new Chess(fen));
      setSelectedSquare(null);
      setPossibleMoves([]);
    } catch (e) {
      console.error('Invalid FEN passed to Chessboard:', fen);
    }
  }, [fen]);

  const handleSquareClick = (square: Square) => {
    if (!interactive) return;

    if (selectedSquare) {
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setPossibleMoves([]);
        return;
      }

      if (possibleMoves.includes(square)) {
        const pieceOnTarget = game.get(square);
        if (onMove) {
          onMove(selectedSquare, square);
        }

        if (pieceOnTarget) {
          sound.playCapture();
        } else {
          sound.playMove();
        }

        setSelectedSquare(null);
        setPossibleMoves([]);
        return;
      }
    }

    const piece = game.get(square);
    if (piece) {
      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true }).map(m => m.to as Square);
      setPossibleMoves(moves);
    } else {
      setSelectedSquare(null);
      setPossibleMoves([]);
    }
  };

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const displayFiles = orientation === 'white' ? files : [...files].reverse();
  const displayRanks = orientation === 'white' ? ranks : [...ranks].reverse();

  const evalPercent = Math.min(95, Math.max(5, 50 + evaluation * 8));

  return (
    <div className="flex items-center gap-2 sm:gap-3 w-full justify-center">
      {/* Stockfish Engine Evaluation Bar (Hidden on ultra-small screens, visible on sm+) */}
      {showEvalBar && (
        <div className="hidden sm:flex relative w-3.5 sm:w-4 h-[320px] sm:h-[420px] md:h-[480px] bg-slate-900 rounded-full overflow-hidden border border-slate-300 shadow-md flex-col justify-end shrink-0">
          <div 
            className="w-full bg-white transition-all duration-300" 
            style={{ height: `${evalPercent}%` }}
          />
          <div className="absolute top-1 left-0.5 right-0.5 text-[8px] font-black text-center text-white">
            {evaluation > 0 ? `+${evaluation.toFixed(1)}` : evaluation.toFixed(1)}
          </div>
        </div>
      )}

      {/* 8x8 Board Container - Fully Responsive across Phone, Tablet & Desktop */}
      <div className="relative select-none w-full max-w-[340px] sm:max-w-[420px] md:max-w-[480px] aspect-square rounded-2xl overflow-hidden shadow-2xl border-2 sm:border-4 border-bambinos-600 bg-white">
        <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
          {displayRanks.map((rank, rIdx) =>
            displayFiles.map((file, fIdx) => {
              const square = `${file}${rank}` as Square;
              const piece = game.get(square);
              const isDark = (rIdx + fIdx) % 2 === 1;
              const isSelected = selectedSquare === square;
              const isPossible = possibleMoves.includes(square);
              const isAnnotated = annotation?.square === square;

              return (
                <div
                  key={square}
                  onClick={() => handleSquareClick(square)}
                  className={`relative flex items-center justify-center cursor-pointer transition-all duration-150 ${
                    isDark ? 'bg-bambinos-600 text-white' : 'bg-slate-100 text-bambinos-900'
                  } ${isSelected ? '!bg-amber-300' : ''}`}
                >
                  {/* Rank & File Coordinates */}
                  {fIdx === 0 && (
                    <span className={`absolute top-0.5 left-1 text-[8px] sm:text-[10px] font-extrabold opacity-75 ${isDark ? 'text-white' : 'text-bambinos-700'}`}>
                      {rank}
                    </span>
                  )}
                  {rIdx === 7 && (
                    <span className={`absolute bottom-0.5 right-1 text-[8px] sm:text-[10px] font-extrabold opacity-75 ${isDark ? 'text-white' : 'text-bambinos-700'}`}>
                      {file}
                    </span>
                  )}

                  {/* Possible Move Indicator */}
                  {isPossible && (
                    <div className={`absolute rounded-full z-10 ${piece ? 'w-full h-full border-2 sm:border-4 border-bambinos-400 bg-bambinos-400/20' : 'w-3 h-3 sm:w-4 sm:h-4 bg-bambinos-500/80 shadow-md animate-pulse'}`} />
                  )}

                  {/* Move Evaluation Badge Overlay */}
                  {isAnnotated && annotation && (
                    <div className="absolute -top-1.5 -right-1.5 z-20 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black text-white shadow-lg animate-bounce"
                      style={{
                        backgroundColor:
                          annotation.type === 'brilliant' ? '#06b6d4' :
                          annotation.type === 'blunder' ? '#ef4444' :
                          annotation.type === 'good' ? '#22c55e' : '#f97316'
                      }}
                    >
                      <span>{annotation.symbol}</span>
                    </div>
                  )}

                  {/* Clean Serif Piece Display */}
                  {piece && (
                    <span className={`text-3xl sm:text-4xl md:text-5xl font-serif transform hover:scale-110 transition-transform ${
                      piece.color === 'w' 
                        ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] [text-shadow:_0_1px_2px_rgba(0,0,0,0.8)]' 
                        : 'text-slate-900 drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]'
                    }`}>
                      {PIECE_UNICODE[`${piece.color}-${piece.type}`]}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
