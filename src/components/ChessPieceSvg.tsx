'use client';

import React from 'react';

interface PieceSvgProps {
  type: 'p' | 'r' | 'n' | 'b' | 'q' | 'k';
  color: 'w' | 'b';
  className?: string;
}

export const ChessPieceSvg: React.FC<PieceSvgProps> = ({ type, color, className = "w-10 h-10" }) => {
  const isWhite = color === 'w';
  const fill = isWhite ? '#FFFFFF' : '#312E2B';
  const stroke = '#1E1C18';
  const detailStroke = isWhite ? '#475569' : '#94A3B8';

  // Crisp SVG Paths matching Chess.com Neo Piece Vector Set
  const renderPiece = () => {
    switch (type) {
      case 'p': // Pawn
        return (
          <g stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill={fill}>
            <path d="M 22 9 C 19.79 9 18 10.79 18 13 C 18 13.89 18.29 14.71 18.78 15.38 C 16.83 16.5 15.5 18.59 15.5 21 C 15.5 21.53 15.56 22.05 15.66 22.56 C 14.04 23.36 13 25.04 13 27 C 13 29.76 15.24 32 18 32 L 26 32 C 28.76 32 31 29.76 31 27 C 31 25.04 29.96 23.36 28.34 22.56 C 28.44 22.05 28.5 21.53 28.5 21 C 28.5 18.59 27.17 16.5 25.22 15.38 C 25.71 14.71 26 13.89 26 13 C 26 10.79 24.21 9 22 9 Z" />
            <path d="M 12 36 L 32 36 A 2 2 0 0 1 34 38 L 10 38 A 2 2 0 0 1 12 36 Z" />
          </g>
        );

      case 'r': // Rook
        return (
          <g stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill={fill}>
            <path d="M 9 39 L 35 39 L 35 36 L 9 36 Z" />
            <path d="M 12 36 L 12 32 L 32 32 L 32 36 Z" />
            <path d="M 11 14 L 11 9 L 15 9 L 15 11 L 19 11 L 19 9 L 25 9 L 25 11 L 29 11 L 29 9 L 33 9 L 33 14 Z" />
            <path d="M 12 14 L 32 14 L 30 32 L 14 32 Z" />
          </g>
        );

      case 'n': // Knight
        return (
          <g stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill={fill}>
            <path d="M 22 10 C 32.5 11 38.5 18 31 26 C 28.5 28.5 24 31 24 35 L 12 35 C 12 28 10 26 13 20 C 13.6 18.8 14.5 16 13 14 C 11 12 10 9 14 6 C 18 8 20 8.5 22 10 Z" />
            <circle cx="16" cy="12" r="1.5" fill={isWhite ? '#1E1C18' : '#FFFFFF'} />
          </g>
        );

      case 'b': // Bishop
        return (
          <g stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill={fill}>
            <path d="M 9 36 L 35 36 L 35 39 L 9 39 Z" />
            <path d="M 15 32 C 15 28 13 22 22 14 C 31 22 29 28 29 32 Z" />
            <circle cx="22" cy="10" r="2.5" />
            <path d="M 19 22 L 25 22 M 22 19 L 22 25" stroke={detailStroke} strokeWidth="2" />
          </g>
        );

      case 'q': // Queen
        return (
          <g stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill={fill}>
            <path d="M 9 36 L 35 36 L 35 39 L 9 39 Z" />
            <path d="M 9 36 L 11 20 L 17 26 L 22 14 L 27 26 L 33 20 L 35 36 Z" />
            <circle cx="9" cy="18" r="2" />
            <circle cx="17" cy="24" r="2" />
            <circle cx="22" cy="12" r="2" />
            <circle cx="27" cy="24" r="2" />
            <circle cx="33" cy="18" r="2" />
          </g>
        );

      case 'k': // King
        return (
          <g stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill={fill}>
            <path d="M 9 36 L 35 36 L 35 39 L 9 39 Z" />
            <path d="M 11 36 L 11 31 L 33 31 L 33 36 Z" />
            <path d="M 11 31 C 11 25 15 19 22 19 C 29 19 33 25 33 31 Z" />
            <path d="M 22 8 L 22 17 M 17.5 12.5 L 26.5 12.5" stroke={stroke} strokeWidth="3" />
          </g>
        );

      default:
        return null;
    }
  };

  return (
    <svg viewBox="0 0 44 44" className={`${className} filter drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]`}>
      {renderPiece()}
    </svg>
  );
};
