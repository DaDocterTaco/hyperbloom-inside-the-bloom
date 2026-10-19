export const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
export const smoothstep = (start, end, value) => {
  const t = clamp((value - start) / Math.max(1, end - start));
  return t * t * (3 - 2 * t);
};

// All tracks are functions of position: reversing scroll retraces the same scene.
// Distances are local to this chapter, rather than a percentage of the whole page.
export function bloomFrame({ scroll = 0, heroHeight = 1100, challengeStart = heroHeight, viewportHeight = 720, width = 1280 }) {
  const distance = Math.max(0, Number.isFinite(scroll) ? scroll : 0);
  const hero = Math.max(1, heroHeight);
  const viewport = Math.max(1, viewportHeight);
  const mobile = width <= 760;
  const open = smoothstep(0, hero * .64, distance);
  const left = smoothstep(0, hero * .57, distance);
  const right = smoothstep(hero * .025, hero * .65, distance);
  const front = smoothstep(hero * .07, hero * .69, distance);
  const center = smoothstep(hero * .06, hero * .48, distance);
  const challenge = Math.max(hero * .65, challengeStart);
  const handoffStart = Math.max(hero * .49, challenge - viewport * .8);
  const handoffEnd = Math.max(handoffStart + 140, challenge - clamp(viewport * .18, 120, 220));
  const handoff = smoothstep(handoffStart, handoffEnd, distance);
  const release = smoothstep(Math.max(hero * .43, handoffStart - 100), handoffEnd - 60, distance);
  const sweep = smoothstep(handoffStart + 40, handoffEnd - 20, distance);
  const settle = smoothstep(handoffStart + 90, handoffEnd, distance);
  const follow = smoothstep(0, Math.min(360, hero * .28), distance) * (mobile ? 38 : 56);
  const mark = Math.min(distance * .13, mobile ? 20 : 36);
  const phase = handoff > .55 ? 'handoff' : open > .88 ? 'bloom' : open > .015 ? 'opening' : 'arrival';
  return { open, left, right, front, center, handoff, release, sweep, settle, follow, mark, phase };
}

export const BLOOM_ASSETS = [
  '/art/bloom-atmosphere.webp', '/art/bloom-scene.webp',
  '/art/petals-left.webp', '/art/petals-right.webp',
  '/art/bloom-center.webp', '/art/bloom-foreground.webp', '/art/event-stage.webp',
  '/art/event-stage-blend.webp',
];
