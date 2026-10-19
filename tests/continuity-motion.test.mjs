import test from 'node:test';
import assert from 'node:assert/strict';
import { continuityFrame } from '../src/continuityMotion.mjs';

test('the travelling bloom does not cover the approved homepage arrival', () => {
  assert.equal(continuityFrame({ scroll: 0, start: 2400, end: 9000 }).opacity, 0);
  assert.equal(continuityFrame({ scroll: 2400, start: 2400, end: 9000 }).opacity, 1);
});
test('secondary routes have their bloom on arrival', () => {
  assert.equal(continuityFrame({ secondary: true }).opacity, 1);
});
test('the camera reverses exactly and remains bounded beyond the document', () => {
  const geometry = { start: 2000, end: 10000 };
  const forward = [0, 2000, 4500, 8000, 12000].map(scroll => continuityFrame({ ...geometry, scroll }));
  const reverse = [12000, 8000, 4500, 2000, 0].map(scroll => continuityFrame({ ...geometry, scroll })).reverse();
  assert.deepEqual(forward, reverse);
  for (const frame of forward) {
    assert.ok(frame.progress >= 0 && frame.progress <= 1);
    assert.ok(frame.scale >= 1.04 && frame.scale <= 1.17);
    assert.ok(Object.values(frame).every(Number.isFinite));
  }
});
test('collapsed and resized documents still yield finite frames', () => {
  for (const end of [0, 2000, 6000]) {
    assert.ok(Object.values(continuityFrame({ scroll: 2000, start: 2000, end, viewport: 0 })).every(Number.isFinite));
  }
});
