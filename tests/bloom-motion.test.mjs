import test from 'node:test';
import assert from 'node:assert/strict';
import { bloomFrame } from '../src/bloomMotion.js';

test('the four chapter states occur in order at desktop and mobile sizes', () => {
  for (const config of [
    { heroHeight: 1467, viewportHeight: 720, width: 1280 },
    { heroHeight: 1097, viewportHeight: 1663, width: 946 },
    { heroHeight: 1050, viewportHeight: 844, width: 390 },
  ]) {
    assert.equal(bloomFrame({ ...config, scroll: 0 }).phase, 'arrival');
    assert.equal(bloomFrame({ ...config, scroll: config.heroHeight * .2 }).phase, 'opening');
    assert.equal(bloomFrame({ ...config, scroll: config.heroHeight * .53 }).phase, 'bloom');
    assert.equal(bloomFrame({ ...config, scroll: config.heroHeight }).phase, 'handoff');
  }
});
test('tracks stay finite and bounded, and the text linger has a strict limit', () => {
  for (const width of [320, 390, 768, 946, 1440]) {
    for (const scroll of [-500, 0, 1, 200, 600, 1100, 9000, NaN]) {
      const frame = bloomFrame({ width, scroll });
      for (const key of ['open','left','right','front','center','handoff','release','sweep','settle']) {
        assert.ok(Number.isFinite(frame[key]) && frame[key] >= 0 && frame[key] <= 1);
      }
      assert.ok(frame.follow >= 0 && frame.follow <= (width <= 760 ? 38 : 56));
    }
  }
});
test('opening and handoff are monotonic, with staggered petal movement', () => {
  let previous = bloomFrame({ scroll: 0 });
  for (let scroll = 10; scroll <= 1600; scroll += 10) {
    const frame = bloomFrame({ scroll });
    for (const key of ['open','left','right','front','center','handoff','release','sweep','settle']) assert.ok(frame[key] >= previous[key]);
    previous = frame;
  }
  const middle = bloomFrame({ scroll: 240 });
  assert.notEqual(middle.left, middle.right);
  assert.notEqual(middle.front, middle.center);
});

test('the handoff follows the overlapping challenge and settles before its anchor lands', () => {
  for (const config of [
    { heroHeight: 1485, challengeStart: 1365, viewportHeight: 800, width: 1280 },
    { heroHeight: 1050, challengeStart: 950, viewportHeight: 844, width: 390 },
    { heroHeight: 1050, challengeStart: 950, viewportHeight: 568, width: 320 },
  ]) {
    const landed = bloomFrame({ ...config, scroll: config.challengeStart - 104 });
    assert.equal(landed.handoff, 1);
    assert.equal(landed.release, 1);
    assert.equal(landed.sweep, 1);
    assert.equal(landed.settle, 1);
    const approach = bloomFrame({ ...config, scroll: config.heroHeight * .6 });
    assert.ok(approach.release > 0 && approach.release < 1);
    assert.ok(approach.settle < 1);
    assert.ok(approach.release > approach.sweep);
  }
});
test('reverse scrolling returns the identical frame without a replay or accumulated drift', () => {
  const forward = [0,100,250,500,800,1100].map(scroll => bloomFrame({ scroll }));
  const backward = [1100,800,500,250,100,0].map(scroll => bloomFrame({ scroll })).reverse();
  assert.deepEqual(forward, backward);
});
