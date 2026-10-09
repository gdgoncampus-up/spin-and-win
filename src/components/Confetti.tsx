import { useEffect, useRef } from 'react';
import { launchConfetti, type ConfettiStyleId } from '../lib/confetti';

interface ConfettiProps {
  /** Increments once per celebration. */
  burst: number;
  style: ConfettiStyleId;
  /** Element the burst starts from (the wheel hub). */
  originRef: React.RefObject<HTMLElement | null>;
  categoryId?: string;
}

export function Confetti({ burst, style, originRef, categoryId }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Read at burst time only, so switching styles never replays the last celebration.
  const latest = useRef({ style, categoryId });
  latest.current = { style, categoryId };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (burst === 0 || !canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const box = originRef.current?.getBoundingClientRect();
    const origin = box ? { x: box.left + box.width / 2, y: box.top + box.height / 2 } : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    return launchConfetti(canvas, latest.current.style, origin, latest.current.categoryId);
  }, [burst, originRef]);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-100 size-full" aria-hidden="true" />;
}
