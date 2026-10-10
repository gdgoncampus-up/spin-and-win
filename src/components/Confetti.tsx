import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { launchConfetti } from '../lib/confetti';

interface ConfettiProps {
  /** Increments once per celebration. */
  burst: number;
  /** Element the burst starts from (the wheel). */
  originRef: RefObject<HTMLElement | null>;
  categoryId: string;
}

export function Confetti({ burst, originRef, categoryId }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Read at burst time only, so a later category change never replays the last celebration.
  const categoryRef = useRef(categoryId);
  categoryRef.current = categoryId;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (burst === 0 || !canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const box = originRef.current?.getBoundingClientRect();
    const origin = box ? { x: box.left + box.width / 2, y: box.top + box.height / 2 } : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    return launchConfetti(canvas, origin, categoryRef.current);
  }, [burst, originRef]);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-100 size-full" aria-hidden="true" />;
}
