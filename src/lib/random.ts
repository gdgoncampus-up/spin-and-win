/** Web Crypto gives good unbiased choices where available, with a local fallback. */
export function randomFloat(): number {
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const values = new Uint32Array(1);
    crypto.getRandomValues(values);
    return values[0]! / 4294967296;
  }
  return Math.random();
}

export function randomInt(maxExclusive: number): number {
  if (!Number.isSafeInteger(maxExclusive) || maxExclusive <= 0) {
    throw new RangeError('maxExclusive must be a positive integer');
  }
  return Math.floor(randomFloat() * maxExclusive);
}
