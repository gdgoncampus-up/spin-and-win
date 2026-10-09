/**
 * Prize-wheel physics. Pegs sit on every divider; the flapper rides over each
 * peg as it passes, and pushing the flapper aside costs the wheel speed. The
 * whole spin is simulated up front, and the launch speed is solved so the
 * wheel comes to rest exactly on the chosen angle.
 *
 * Angles are degrees, clockwise; time is milliseconds.
 */

/** Radius of the peg ring and length of the flapper, in wheel viewBox units. */
export const PEG_RADIUS = 274;
export const FLAPPER_LENGTH = 74;

/** Flapper turn (deg) per degree of wheel travel while a peg pushes it. */
const LEVER = PEG_RADIUS / FLAPPER_LENGTH;
/** A peg first touches the flapper this many degrees before the top... */
const CONTACT_FROM = -3;
/** ...and slips past its tip this many degrees after. */
const CONTACT_TO = 6;

const FRICTION = 0.000032; // constant drag, deg/ms²
const AIR = 0.00036; // drag proportional to speed, 1/ms
const PEG_DRAG = 0.0000105; // extra drag per degree the flapper is pushed aside

/** How far a peg is currently pushing the flapper aside (0 when no peg touches it). */
export function pegPush(wheelAngle: number, slice: number): number {
  const a = (((wheelAngle % slice) + slice) % slice) - slice / 2; // nearest peg, relative to the top
  return a >= CONTACT_FROM && a <= CONTACT_TO ? (a - CONTACT_FROM) * LEVER : 0;
}

/** Wheel angle (relative to the start) for every millisecond of a spin launched at `speed` deg/ms. */
export function simulate(start: number, speed: number, slice: number): Float64Array {
  const path: number[] = [0];
  let angle = start;
  let velocity = speed;
  while (velocity > 0 && path.length < 20000) {
    velocity -= FRICTION + AIR * velocity + PEG_DRAG * pegPush(angle, slice);
    if (velocity <= 0) break;
    angle += velocity;
    path.push(angle - start);
  }
  return Float64Array.from(path);
}

/** Simulates a spin from `start` that comes to rest exactly `distance` degrees later. */
export function planSpin(start: number, distance: number, slice: number): Float64Array {
  let low = 0.01;
  let high = 6;
  let best = simulate(start, high, slice);
  for (let i = 0; i < 40; i++) {
    const mid = (low + high) / 2;
    const path = simulate(start, mid, slice);
    const travelled = path[path.length - 1]!;
    best = path;
    if (Math.abs(travelled - distance) < 0.01) break;
    if (travelled < distance) low = mid; else high = mid;
  }
  // Remove the last fraction of a degree of error so the wheel lands on the exact angle.
  const travelled = best[best.length - 1]!;
  const fix = travelled > 0 ? distance / travelled : 1;
  return best.map(v => v * fix);
}
