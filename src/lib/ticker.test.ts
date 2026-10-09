import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pegPush, planSpin } from './ticker.ts';

test('a planned spin comes to rest exactly on the requested angle', () => {
  for (const start of [0, 17, 133.5]) {
    for (const distance of [1810, 1990, 2170, 2330]) {
      const path = planSpin(start, distance, 60);
      assert.ok(Math.abs(path[path.length - 1]! - distance) < 1e-6, `start ${start}, distance ${distance}`);
    }
  }
});

test('the wheel only ever moves forward and slows down overall', () => {
  const path = planSpin(0, 2000, 60);
  for (let i = 1; i < path.length; i++) assert.ok(path[i]! >= path[i - 1]!);
  const early = path[200]! - path[100]!;
  const late = path[path.length - 1]! - path[path.length - 101]!;
  assert.ok(late < early / 10);
});

test('a spin lasts long enough to build suspense but not to bore', () => {
  const ms = planSpin(0, 2000, 60).length;
  assert.ok(ms > 4500 && ms < 8000, `${ms} ms`);
});

test('pegs touch the flapper only near the top', () => {
  assert.equal(pegPush(0, 60), 0); // slice centre under the flapper
  assert.ok(pegPush(30, 60) > 0); // a divider right under it
  assert.equal(pegPush(45, 60), 0);
});
