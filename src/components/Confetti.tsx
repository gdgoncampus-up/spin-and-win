import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import type { Category } from '../types';
import { randomFloat, randomInt } from '../lib/random';

interface ConfettiProps { burst: number; categories: readonly Category[] }

interface Particle { id: number; style: CSSProperties }

export function Confetti({ burst, categories }: ConfettiProps) {
  const [pieces, setPieces] = useState<Particle[]>([]);

  useEffect(() => {
    if (burst === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const colors = categories.map(category => category.color);
    const newPieces = Array.from({ length: 64 }, (_, id) => ({
      id,
      style: {
        '--left': `${(randomFloat() * 100).toFixed(1)}%`,
        '--color': colors[randomInt(colors.length)] ?? '#4285F4',
        '--width': `${(5 + randomFloat() * 6).toFixed(1)}px`,
        '--height': `${(7 + randomFloat() * 10).toFixed(1)}px`,
        '--duration': `${(2.5 + randomFloat() * 2).toFixed(2)}s`,
        '--delay': `${(randomFloat() * 0.6).toFixed(2)}s`,
        '--drift': `${((randomFloat() - 0.5) * 250).toFixed(1)}px`,
        '--rotation': `${((randomFloat() - 0.5) * 1300).toFixed(1)}deg`,
      } as CSSProperties,
    }));
    setPieces(newPieces);
    const timeout = setTimeout(() => setPieces([]), 5600);
    return () => clearTimeout(timeout);
  }, [burst, categories]);

  return <div className="confetti-layer" aria-hidden="true">
    {pieces.map(piece => <i key={`${burst}-${piece.id}`} className="confetti-piece" style={piece.style}/>)}
  </div>;
}
