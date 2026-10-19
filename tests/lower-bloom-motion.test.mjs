import test from 'node:test';
import assert from 'node:assert/strict';
import { lowerBloomFrame } from '../src/lowerBloomMotion.mjs';

const layout = { start: 2400, end: 11000, viewport: 800, chapters: [2800,3800,5100,6400,7900,9000,11000] };
test('the lower flower keeps opening after the offer chapter and reaches contact', () => {
  const frames = [2500,3900,5300,6700,8200,10400].map(scroll => lowerBloomFrame({ ...layout, scroll }));
  for (let index = 1; index < frames.length; index += 1) {
    assert.ok(frames[index].phase > frames[index - 1].phase);
    assert.ok(frames[index].petals[5].opening >= frames[index - 1].petals[5].opening);
  }
  assert.ok(frames.at(-1).petals[5].opening > .95);
  assert.notEqual(frames[3].petals[5].angle, frames[5].petals[5].angle);
});
test('petal articulation reverses with native scrolling and never escapes bounds', () => {
  const scrolls = [-1000,2400,4000,6000,9000,15000];
  const forward = scrolls.map(scroll => lowerBloomFrame({ ...layout, scroll }));
  const reverse = [...scrolls].reverse().map(scroll => lowerBloomFrame({ ...layout, scroll })).reverse();
  assert.deepEqual(forward, reverse);
  for (const frame of forward) {
    assert.ok(frame.progress >= 0 && frame.progress <= 1);
    assert.ok(frame.opacity >= 0 && frame.opacity <= 1);
    for (const petal of frame.petals) {
      assert.ok(Object.values(petal).every(Number.isFinite));
      assert.ok(Math.abs(petal.x) <= 6.4);
      assert.ok(Math.abs(petal.angle) <= 48);
    }
  }
});
test('paused petals are stationary across every chapter while arrival remains usable', () => {
  const a = lowerBloomFrame({ ...layout, scroll: 3000, paused: true });
  const b = lowerBloomFrame({ ...layout, scroll: 9500, paused: true });
  assert.deepEqual(a.petals,b.petals);
  assert.equal(a.cameraY,b.cameraY);
  assert.equal(a.cameraScale,b.cameraScale);
  assert.equal(a.opacity,1);
});
test('missing or collapsed chapter geometry has a finite useful fallback', () => {
  for (const frame of [lowerBloomFrame(),lowerBloomFrame({ scroll: NaN, viewport: 0, start: 300, end: 0, chapters: [NaN,300,300] })]) {
    assert.ok([frame.phase,frame.progress,frame.opacity,frame.cameraY,frame.cameraScale,frame.lightX,frame.lightY].every(Number.isFinite));
    assert.equal(frame.petals.length,6);
  }
});
