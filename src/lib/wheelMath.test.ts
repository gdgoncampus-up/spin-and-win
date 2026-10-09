import test from 'node:test';
import assert from 'node:assert/strict';
import { categoryAtPointer, getSliceDegrees, makeSpinAngle, normalizeAngle, targetRotation } from './wheelMath.ts';

test('normalizes negative and multi-turn angles', () => {
  assert.equal(normalizeAngle(-60), 300);
  assert.equal(normalizeAngle(720 + 45), 45);
});

test('all six categories land under the pointer even after previous spins', () => {
  for (const current of [0, 20, 180, 359, 2480.25]) {
    for (let index = 0; index < 6; index++) {
      for (const jitter of [-11.99, 0, 11.99]) {
        const angle = makeSpinAngle(current, index, 6, jitter, 7);
        assert.equal(categoryAtPointer(angle, 6), index, `current=${current}, index=${index}, jitter=${jitter}`);
      }
    }
  }
});

test('validates slice count, category, and safe jitter', () => {
  assert.equal(getSliceDegrees(6), 60);
  assert.throws(() => getSliceDegrees(1), RangeError);
  assert.throws(() => targetRotation(6, 6, 0), RangeError);
  assert.throws(() => targetRotation(1, 6, 20), RangeError);
});
