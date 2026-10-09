import { useCallback, useEffect, useRef, useState } from 'react';
import type { WheelState } from '../types';
import { randomFloat, randomInt } from '../lib/random';
import { getSliceDegrees, makeSpinAngle, normalizeAngle } from '../lib/wheelMath';

const INITIAL_STATE: WheelState = { status: 'idle', winnerIndex: null, restAngle: 0 };

/**
 * React owns game state; the SVG transform is updated imperatively to guarantee
 * that consecutive spins start at the exact visual angle of the previous result.
 */
export function useWheel(categoryCount: number) {
  const [state, setState] = useState<WheelState>(INITIAL_STATE);
  const rotatorRef = useRef<SVGGElement | null>(null);
  const angleRef = useRef(0);
  const spinningRef = useRef(false);
  const finishTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frameRef = useRef<number | null>(null);

  const spin = useCallback(() => {
    const rotator = rotatorRef.current;
    if (!rotator || spinningRef.current || categoryCount < 2) return;
    spinningRef.current = true;
    setState(prev => ({ ...prev, status: 'spinning', winnerIndex: null }));

    const index = randomInt(categoryCount);
    const slice = getSliceDegrees(categoryCount);
    const jitter = (randomFloat() - 0.5) * slice * 0.4; // safely inside the segment
    const fullTurns = 6 + randomInt(3);
    const startAngle = normalizeAngle(angleRef.current);
    const finalAngle = makeSpinAngle(startAngle, index, categoryCount, jitter, fullTurns);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reducedMotion ? 90 : 5400 + randomInt(600);

    rotator.style.transition = 'none';
    rotator.style.transform = `rotate(${startAngle}deg)`;
    void rotator.getBoundingClientRect(); // commit the start angle before the animation

    frameRef.current = requestAnimationFrame(() => {
      rotator.style.transition = `transform ${duration}ms cubic-bezier(.13,.78,.15,1)`;
      rotator.style.transform = `rotate(${finalAngle}deg)`;
      frameRef.current = null;
    });

    finishTimeoutRef.current = setTimeout(() => {
      angleRef.current = finalAngle;
      spinningRef.current = false;
      finishTimeoutRef.current = null;
      setState({ status: 'winner', winnerIndex: index, restAngle: normalizeAngle(finalAngle) });
    }, duration + 120);
  }, [categoryCount]);

  useEffect(() => () => {
    if (finishTimeoutRef.current !== null) clearTimeout(finishTimeoutRef.current);
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
  }, []);

  return { state, rotatorRef, spin };
}
