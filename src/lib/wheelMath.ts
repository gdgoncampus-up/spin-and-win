/** All angles are degrees, measured clockwise from the top of the wheel. */
export function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

export function getSliceDegrees(categoryCount: number): number {
  if (!Number.isInteger(categoryCount) || categoryCount < 2) {
    throw new RangeError('Wheel needs at least two categories');
  }
  return 360 / categoryCount;
}

/**
 * The wheel starts with category 0 centered under the top pointer.
 * Rotating clockwise by -index * sliceDegrees brings category index to the top.
 * Jitter must remain inside the center portion of the target slice.
 */
export function targetRotation(index: number, categoryCount: number, jitter: number): number {
  const slice = getSliceDegrees(categoryCount);
  if (!Number.isInteger(index) || index < 0 || index >= categoryCount) {
    throw new RangeError('Invalid category index');
  }
  if (Math.abs(jitter) > slice * 0.2) {
    throw new RangeError('Jitter must stay safely inside the target slice');
  }
  return normalizeAngle(-index * slice + jitter);
}

export function makeSpinAngle(
  currentAngle: number,
  index: number,
  count: number,
  jitter: number,
  fullTurns: number,
): number {
  if (!Number.isInteger(fullTurns) || fullTurns < 1) throw new RangeError('At least one full turn required');
  const current = normalizeAngle(currentAngle);
  const destination = targetRotation(index, count, jitter);
  const remainder = normalizeAngle(destination - current);
  return current + fullTurns * 360 + remainder;
}

/** Returns the segment actually aligned with the fixed top pointer. */
export function categoryAtPointer(rotationDegrees: number, count: number): number {
  const slice = getSliceDegrees(count);
  return Math.round(normalizeAngle(-rotationDegrees) / slice) % count;
}

export function polarPoint(angleDegrees: number, radius: number, center = 300): [number, number] {
  const radians = angleDegrees * Math.PI / 180;
  return [center + radius * Math.sin(radians), center - radius * Math.cos(radians)];
}
