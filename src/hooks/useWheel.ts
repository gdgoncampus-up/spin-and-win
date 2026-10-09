import { useCallback, useEffect, useRef, useState } from 'react';
import type { WheelState } from '../types';
import { randomFloat, randomInt } from '../lib/random';
import { getSliceDegrees, makeSpinAngle, normalizeAngle } from '../lib/wheelMath';
import { pegPush, planSpin } from '../lib/ticker';

const INITIAL_STATE: WheelState = { status: 'idle', winnerIndex: null, restAngle: 0 };
const TURNS = 5;
const REDUCED_MS = 90;
/** Flapper spring: stiffness and damping per millisecond; lightly underdamped so it swings back past centre. */
const SPRING = 0.0016;
const DAMPING = 0.045;
/** Keeps animating after the wheel stops so the flapper can settle. */
const SETTLE_MS = 600;

interface WheelOptions {
  /** Fires each time a peg strikes the flapper. */
  onTick?: () => void;
}

/**
 * React owns game state; every frame is written straight to the DOM through
 * refs so the motion never waits on a re-render.
 */
export function useWheel(categoryCount: number, { onTick }: WheelOptions = {}) {
  const [state, setState] = useState<WheelState>(INITIAL_STATE);
  const rotatorRef = useRef<SVGGElement | null>(null);
  const flapperRef = useRef<SVGGElement | null>(null);
  const angleRef = useRef(0);
  const spinningRef = useRef(false);
  const frameRef = useRef<number | null>(null);
  const tickRef = useRef(onTick);
  tickRef.current = onTick;

  const spin = useCallback(() => {
    const rotator = rotatorRef.current;
    if (!rotator || spinningRef.current || categoryCount < 2) return;
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current); // stop a flapper still settling
    spinningRef.current = true;
    setState(prev => ({ ...prev, status: 'spinning', winnerIndex: null }));

    const slice = getSliceDegrees(categoryCount);
    const index = randomInt(categoryCount);
    const jitter = (randomFloat() - 0.5) * slice * 0.4; // safely inside the segment
    const start = normalizeAngle(angleRef.current);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finalAngle = makeSpinAngle(start, index, categoryCount, jitter, reduced ? 1 : TURNS);
    const path = reduced ? null : planSpin(start, finalAngle - start, slice);
    const travelMs = path ? path.length - 1 : REDUCED_MS;

    let began = 0;
    let simulated = 0; // milliseconds of flapper physics already run
    let flap = 0;
    let flapVelocity = 0;
    let lastPush = 0;
    let finished = false;

    const wheelAt = (ms: number) => {
      if (!path) return start + (finalAngle - start) * Math.min(1, ms / REDUCED_MS);
      const i = Math.min(path.length - 1, Math.floor(ms));
      const next = path[Math.min(path.length - 1, i + 1)]!;
      return start + path[i]! + (next - path[i]!) * (ms - i);
    };

    const frame = (now: number) => {
      began ||= now;
      const elapsed = now - began;
      const angle = wheelAt(Math.min(elapsed, travelMs));

      // Step the flapper in 1 ms increments: a spring pulls it to centre, a peg can only push it aside.
      while (path && simulated < elapsed) {
        simulated += 1;
        const push = pegPush(wheelAt(Math.min(simulated, travelMs)), slice);
        flapVelocity += -SPRING * flap - DAMPING * flapVelocity;
        flap += flapVelocity;
        if (flap < push) {
          flapVelocity = Math.max(flapVelocity, push - lastPush);
          flap = push;
        }
        if (push > 0 && lastPush === 0) tickRef.current?.();
        lastPush = push;
      }

      rotator.style.transform = `rotate(${angle}deg)`;
      if (flapperRef.current) flapperRef.current.style.transform = `rotate(${(-flap).toFixed(2)}deg)`;

      if (!finished && elapsed >= travelMs) {
        finished = true;
        angleRef.current = finalAngle;
        spinningRef.current = false;
        setState({ status: 'winner', winnerIndex: index, restAngle: normalizeAngle(finalAngle) });
      }
      frameRef.current = elapsed < travelMs + SETTLE_MS ? requestAnimationFrame(frame) : null;
    };
    frameRef.current = requestAnimationFrame(frame);
  }, [categoryCount]);

  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
  }, []);

  return { state, rotatorRef, flapperRef, spin };
}
