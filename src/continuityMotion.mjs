const clamp = value => Math.max(0, Math.min(1, value));
const ease = value => { const t = clamp(value); return t * t * (3 - 2 * t); };

// A single document camera, independent of chapter lengths and scroll direction.
export function continuityFrame({ scroll = 0, start = 0, end = 1, viewport = 800, secondary = false }) {
  const safeScroll = Number.isFinite(scroll) ? scroll : 0;
  const distance = Math.max(1, end - start);
  const progress = clamp((safeScroll - start) / distance);
  const arrival = secondary ? 1 : ease((safeScroll - start + viewport * .65) / Math.max(1, viewport * .65));
  return {
    progress,
    opacity: arrival,
    leftY: -45 + progress * 110,
    rightY: 70 - progress * 180,
    leftAngle: -13 - progress * 9,
    rightAngle: 11 + progress * 14,
    scale: 1.04 + Math.sin(progress * Math.PI) * .13,
    lightY: 30 + progress * 40,
  };
}
