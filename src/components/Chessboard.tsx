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
  lastMove?: { from: string; to: string } | null;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Chessboard: React.FC<ChessboardProps> = ({
  fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  onMove,
  orientation = 'white',
  annotation,
  interactive = true,
  showEvalBar = true,
  evaluation = 0.2,
  lastMove = null,
  size = 'xl'
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

  const sizeClasses = {
    sm: 'w-full max-w-[280px] sm:max-w-[340px]',
    md: 'w-full max-w-[340px] sm:max-w-[420px]',
    lg: 'w-full max-w-[380px] sm:max-w-[460px]',
    xl: 'w-full max-w-[92vw] sm:max-w-[480px] md:max-w-[520px]',
    full: 'w-full max-w-[56vh] sm:max-w-[58vh] md:max-w-[60vh] lg:max-w-[62vh]'
  }[size || 'full'];

  const evalBarHeight = {
    sm: 'h-[280px] sm:h-[340px]',
    md: 'h-[340px] sm:h-[420px]',
    lg: 'h-[380px] sm:h-[460px]',
    xl: 'h-[92vw] sm:h-[480px] md:h-[520px]',
    full: 'h-[56vh] sm:h-[58vh] md:h-[60vh] lg:h-[62vh]'
  }[size || 'full'];

  return (
    <div className="flex items-center gap-2 sm:gap-4 w-full justify-center">
      {/* Engine Evaluation Bar */}
      {showEvalBar && (
        <div className={`hidden sm:flex relative w-3.5 sm:w-4 ${evalBarHeight} bg-slate-900 rounded-full overflow-hidden border border-slate-300 shadow-md flex-col justify-end shrink-0`}>
          <div 
            className="w-full bg-emerald-500 transition-all duration-300 shadow-inner" 
            style={{ height: `${evalPercent}%` }}
          />
          <div className="absolute top-1 left-0.5 right-0.5 text-[8px] font-black text-center text-white drop-shadow">
            {evaluation > 0 ? `+${evaluation.toFixed(1)}` : evaluation.toFixed(1)}
          </div>
        </div>
      )}

      {/* 8x8 Board Container (Rich Blue #2b70d3 & Solid White #FFFFFF Theme) */}
      <div className={`relative select-none w-full ${sizeClasses} aspect-square rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border-4 sm:border-[6px] border-[#1e293b] bg-[#1e293b] touch-manipulation`}>
        <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
          {displayRanks.map((rank, rIdx) =>
            displayFiles.map((file, fIdx) => {
              const square = `${file}${rank}` as Square;
              const piece = game.get(square);
              const isDark = (rIdx + fIdx) % 2 === 1;
              const isSelected = selectedSquare === square;
              const isPossible = possibleMoves.includes(square);
              const isAnnotated = annotation?.square === square;
              const isLastMoveSquare = lastMove && (lastMove.from === square || lastMove.to === square);

              const pieceCode = piece ? `${piece.color}${piece.type.toUpperCase()}` : null;

              return (
                <div
                  key={square}
                  onClick={() => handleSquareClick(square)}
                  className={`relative flex items-center justify-center cursor-pointer transition-all duration-150 touch-manipulation ${
                    isDark ? 'bg-[#2b70d3]' : 'bg-[#ffffff]'
                  } ${isSelected ? '!bg-[#f59e0b]' : ''} ${isLastMoveSquare ? '!bg-[#60a5fa]/70' : ''}`}
                >
                  {/* Rank Labels (Column 0) */}
                  {fIdx === 0 && (
                    <span className={`absolute top-1 left-1.5 text-[11px] sm:text-sm font-bold select-none pointer-events-none z-10 ${isDark ? 'text-[#ffffff]' : 'text-[#2b70d3]'}`}>
                      {rank}
                    </span>
                  )}

                  {/* File Labels (Row 7) */}
                  {rIdx === 7 && (
                    <span className={`absolute bottom-1 right-1.5 text-[11px] sm:text-sm font-bold select-none pointer-events-none z-10 ${isDark ? 'text-[#ffffff]' : 'text-[#2b70d3]'}`}>
                      {file}
                    </span>
                  )}

                  {/* Possible Move Indicator Dot / Ring */}
                  {isPossible && (
                    <div className={`absolute rounded-full z-10 pointer-events-none ${piece ? 'w-full h-full border-4 border-[#1e293b]/40 bg-[#1e293b]/15' : 'w-4 h-4 sm:w-5 sm:h-5 bg-[#1e293b]/30'}`} />
                  )}

                  {/* Move Evaluation Badge Overlay */}
                  {isAnnotated && annotation && (
                    <div className="absolute -top-1.5 -right-1.5 z-20 flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-black text-white shadow-lg animate-bounce"
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

                  {/* Authentic Cburnett SVG Piece Image */}
                  {pieceCode && (
                    <img
                      src={`./pieces/cburnett/${pieceCode}.svg`}
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (!target.dataset.tried) {
                          target.dataset.tried = 'true';
                          target.src = `pieces/${pieceCode}.svg`;
                        }
                      }}
                      alt={pieceCode}
                      draggable={false}
                      className="piece w-[88%] h-[88%] object-contain select-none pointer-events-none drop-shadow-sm transition-transform duration-100 active:scale-105"
                    />
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
