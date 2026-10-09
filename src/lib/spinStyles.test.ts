import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SPIN_STYLES, hopsAt } from './spinStyles.ts';

test('every spin style ends exactly on its target', () => {
  for (const style of SPIN_STYLES) {
    for (const distance of [400, 2200, 3600]) {
      assert.ok(Math.abs(style.progress(1, distance) - 1) < 1e-9, `${style.id} at distance ${distance}`);
      assert.ok(Math.abs(style.progress(0, distance)) < 1e-9, `${style.id} starts at rest`);
    }
  }
});

test('spin styles never wander far outside the path', () => {
  for (const style of SPIN_STYLES) {
    for (let t = 0; t <= 1; t += 0.01) {
      const p = style.progress(t, 2200);
      assert.ok(p > -0.02 && p < 1.02, `${style.id} at t=${t.toFixed(2)} gave ${p}`);
    }
  }
});

test('hop light passes every hop and stops on the last one', () => {
  assert.equal(hopsAt(0, 20), 0);
  assert.equal(hopsAt(1, 20), 20);
  let last = 0;
  for (let t = 0; t <= 1; t += 0.001) {
    const now = hopsAt(t, 20);
    assert.ok(now >= last);
    last = now;
  }
});
