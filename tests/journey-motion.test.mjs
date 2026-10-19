import test from 'node:test';
import assert from 'node:assert/strict';
import { journeyFrame } from '../src/journeyMotion.js';

test('the guide starts at the reading path and completes as the final step arrives', () => {
  const scene = { top: 1984, height: 663, railTop: 2130, railHeight: 426, viewport: 900 };
  assert.equal(journeyFrame({ ...scene, scroll: 1400 }).progress, 0);
  assert.ok(journeyFrame({ ...scene, scroll: 1800 }).progress > 0);
  assert.ok(journeyFrame({ ...scene, scroll: 1800 }).progress < 1);
  assert.equal(journeyFrame({ ...scene, scroll: 2100 }).progress, 1);
});
test('decorative motion stays bounded across phone, tablet, and desktop geometry', () => {
  for (const viewport of [568, 844, 1024]) {
    const scene = { top: 1500, height: 750, railTop: 1680, railHeight: 500, viewport };
    for (const scroll of [-1000, 0, 1200, 1500, 1800, 9000, NaN]) {
      for (const value of Object.values(journeyFrame({ ...scene, scroll }))) {
        assert.ok(Number.isFinite(value) && value >= 0 && value <= 1);
      }
    }
  }
});
test('the guide and glass retrace the same positions when scrolling reverses', () => {
  const scene = { top: 1984, height: 663, railTop: 2130, railHeight: 426, viewport: 900 };
  const positions = [1200, 1500, 1800, 2100, 2400];
  const forward = positions.map(scroll => journeyFrame({ ...scene, scroll }));
  const reverse = [...positions].reverse().map(scroll => journeyFrame({ ...scene, scroll })).reverse();
  assert.deepEqual(forward, reverse);
  for (let i = 1; i < forward.length; i++) assert.ok(forward[i].progress >= forward[i - 1].progress);
});
test('the foreground petals open on staggered tracks while the camera moves deeper', () => {
  const scene = { top: 1984, height: 960, railTop: 2150, railHeight: 500, viewport: 900 };
  const frame = journeyFrame({ ...scene, scroll: 1950 });
  assert.ok(frame.left > frame.right);
  assert.ok(frame.depth > 0 && frame.depth < frame.left);
  const end = journeyFrame({ ...scene, scroll: 3000 });
  assert.equal(end.left, 1);
  assert.equal(end.right, 1);
  assert.equal(end.depth, 1);
});
test('most petal opening remains ahead when the reader reaches the chapter', () => {
  for (const viewport of [568, 844, 1000]) {
    const scene = { top: 1984, height: 1000, railTop: 2150, railHeight: 600, viewport };
    const arrival = journeyFrame({ ...scene, scroll: scene.top - 95 });
    const reading = journeyFrame({ ...scene, scroll: scene.top + 300 });
    assert.ok(arrival.left < .2 && arrival.right < .1);
    assert.ok(reading.left - arrival.left > .4);
    assert.ok(reading.right - arrival.right > .3);
    assert.ok(reading.depth - arrival.depth > .3);
  }
});
