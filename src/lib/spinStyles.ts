/**
 * Spin styles. Each maps normalised time t (0..1) to how far the wheel has
 * travelled towards its target, so every style still lands exactly on the
 * chosen category. Values may dip below 0 (wind-up) or pass 1 (overshoot).
 */
export type SpinStyleId = 'glide' | 'ticker' | 'spring' | 'focus' | 'hop';

export interface SpinStyle {
  id: SpinStyleId;
  name: string;
  blurb: string;
  /** Milliseconds for the travel phase. */
  duration: number;
  /** Extra full turns on top of what it takes to reach the target. */
  turns: number;
  /** Travel progress for normalised time t; must return 1 at t = 1. */
  progress: (t: number, distance: number) => number;
}

const outQuart = (t: number) => 1 - (1 - t) ** 4;
const outQuint = (t: number) => 1 - (1 - t) ** 5;
const outCubic = (t: number) => 1 - (1 - t) ** 3;

/** Pull back a few degrees first, then release: a hand winding up before it throws. */
function glide(t: number, distance: number): number {
  const windUp = 14 / distance;
  const split = 0.09;
  if (t < split) return -windUp * Math.sin((t / split) * Math.PI / 2);
  return -windUp + (1 + windUp) * outQuint((t - split) / (1 - split));
}

/** Shoots a little past the winner, then a damped spring pulls it back. */
function spring(t: number, distance: number): number {
  const over = 9 / distance;
  const split = 0.8;
  if (t < split) return (1 + over) * outCubic(t / split);
  const u = (t - split) / (1 - split);
  return 1 + over * Math.exp(-5 * u) * Math.cos(2.5 * Math.PI * u) * (1 - u);
}

export const SPIN_STYLES: readonly SpinStyle[] = [
  { id: 'glide', name: 'Glide', blurb: 'Winds up, then a long, soft coast to a stop.', duration: 5600, turns: 6, progress: glide },
  { id: 'ticker', name: 'Ticker', blurb: 'The pointer clicks against every divider and slows with the wheel.', duration: 6400, turns: 5, progress: t => outQuart(t) },
  { id: 'spring', name: 'Spring', blurb: 'Overshoots the winner and settles back with a little wobble.', duration: 5000, turns: 6, progress: spring },
  { id: 'focus', name: 'Focus', blurb: 'Blurs with speed, sharpens as it stops, and the winner lifts out.', duration: 5200, turns: 9, progress: t => outQuint(t) },
  { id: 'hop', name: 'Hop', blurb: 'The wheel stays put; a light hops from slice to slice, then the winner turns to the top.', duration: 4200, turns: 3, progress: t => outCubic(t) },
];

export function getSpinStyle(id: SpinStyleId): SpinStyle {
  return SPIN_STYLES.find(style => style.id === id) ?? SPIN_STYLES[0]!;
}

/** Hop: how many slices the light has passed at time t, for `hops` total hops. */
export function hopsAt(t: number, hops: number): number {
  return Math.min(hops, Math.floor(outCubic(Math.min(1, t)) * hops + 1e-9));
}
