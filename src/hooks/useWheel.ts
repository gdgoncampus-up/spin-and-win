import { useCallback, useEffect, useRef, useState } from 'react';
import type { WheelState } from '../types';
import { randomFloat, randomInt } from '../lib/random';
import { categoryAtPointer, getSliceDegrees, makeSpinAngle, normalizeAngle, targetRotation } from '../lib/wheelMath';
import { getSpinStyle, hopsAt, type SpinStyleId } from '../lib/spinStyles';

const INITIAL_STATE: WheelState = { status: 'idle', winnerIndex: null, restAngle: 0, cursorIndex: null };
const HOP_TURN_MS = 900;
const REDUCED_MS = 90;

interface WheelOptions {
  style: SpinStyleId;
  /** Fires each time a divider passes the pointer (or the light hops). */
  onTick?: () => void;
}

const inOutCubic = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * React owns game state; every frame of motion is written straight to the DOM
 * through refs so the animation never waits on a re-render.
 */
export function useWheel(categoryCount: number, { style, onTick }: WheelOptions) {
  const [state, setState] = useState<WheelState>(INITIAL_STATE);
  const rotatorRef = useRef<SVGGElement | null>(null);
  const layerRef = useRef<HTMLDivElement | null>(null);
  const pointerRef = useRef<SVGGElement | null>(null);
  const angleRef = useRef(0);
  const spinningRef = useRef(false);
  const frameRef = useRef<number | null>(null);
  const tickRef = useRef(onTick);
  tickRef.current = onTick;

  const paint = useCallback((angle: number, blur = 0, scale = 1, pointer = 0) => {
    if (rotatorRef.current) rotatorRef.current.style.transform = `rotate(${angle}deg)`;
    if (layerRef.current) {
      layerRef.current.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : '';
      layerRef.current.style.transform = scale !== 1 ? `scale(${scale.toFixed(4)})` : '';
    }
    if (pointerRef.current) pointerRef.current.style.transform = pointer ? `rotate(${pointer.toFixed(2)}deg)` : '';
  }, []);

  const spin = useCallback(() => {
    if (!rotatorRef.current || spinningRef.current || categoryCount < 2) return;
    spinningRef.current = true;

    const config = getSpinStyle(style);
    const slice = getSliceDegrees(categoryCount);
    const index = randomInt(categoryCount);
    const jitter = (randomFloat() - 0.5) * slice * 0.4; // safely inside the segment
    const start = normalizeAngle(angleRef.current);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const startIndex = categoryAtPointer(start, categoryCount);

    let finalAngle: number;
    let total: number;
    let hops = 0;
    if (style === 'hop') {
      // The light travels clockwise from the slice under the pointer to the winner.
      hops = config.turns * categoryCount + ((index - startIndex + categoryCount) % categoryCount);
      const delta = normalizeAngle(targetRotation(index, categoryCount, jitter) - start);
      finalAngle = start + (delta > 180 ? delta - 360 : delta);
      total = reduced ? REDUCED_MS : config.duration + HOP_TURN_MS;
    } else {
      finalAngle = makeSpinAngle(start, index, categoryCount, jitter, reduced ? 1 : config.turns);
      total = reduced ? REDUCED_MS : config.duration;
    }

    setState(prev => ({ ...prev, status: 'spinning', winnerIndex: null, cursorIndex: style === 'hop' ? startIndex : null }));

    const distance = finalAngle - start;
    let began = 0;
    let prevAngle = start;
    let prevTime = 0;
    let pointer = 0;
    let lastDivider = Math.floor((start + slice / 2) / slice);
    let lastHop = 0;

    const frame = (now: number) => {
      began ||= now;
      const elapsed = now - began;
      const t = Math.min(1, elapsed / total);
      let angle: number;
      let blur = 0;
      let scale = 1;

      if (reduced) {
        angle = start + distance * t;
      } else if (style === 'hop') {
        const travel = Math.min(1, elapsed / config.duration);
        const passed = hopsAt(travel, hops);
        if (passed !== lastHop) {
          lastHop = passed;
          tickRef.current?.();
          setState(prev => ({ ...prev, cursorIndex: (startIndex + passed) % categoryCount }));
        }
        const turn = Math.max(0, (elapsed - config.duration) / HOP_TURN_MS);
        angle = start + distance * inOutCubic(Math.min(1, turn));
      } else {
        angle = start + distance * config.progress(t, distance);
        const dt = Math.max(1, now - (prevTime || now - 16));
        const speed = Math.abs(angle - prevAngle) / dt; // degrees per millisecond

        if (style === 'ticker') {
          // A divider passing the pointer kicks it sideways; it springs back between kicks.
          const divider = Math.floor((angle + slice / 2) / slice);
          if (divider !== lastDivider) {
            lastDivider = divider;
            pointer = Math.min(30, 9 + speed * 14);
            tickRef.current?.();
          }
          pointer *= 0.82;
        }
        if (style === 'focus') {
          blur = Math.min(5, speed * 3.2);
          scale = 1 - Math.min(0.05, speed * 0.03);
        }
      }

      paint(angle, blur, scale, -pointer);
      prevAngle = angle;
      prevTime = now;

      if (t < 1) {
        frameRef.current = requestAnimationFrame(frame);
        return;
      }
      paint(finalAngle);
      angleRef.current = finalAngle;
      spinningRef.current = false;
      frameRef.current = null;
      setState({ status: 'winner', winnerIndex: index, restAngle: normalizeAngle(finalAngle), cursorIndex: null });
    };
    frameRef.current = requestAnimationFrame(frame);
  }, [categoryCount, style, paint]);

  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
  }, []);

  return { state, rotatorRef, layerRef, pointerRef, spin };
}
