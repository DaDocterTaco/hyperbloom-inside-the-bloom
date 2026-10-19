const finite = (value, fallback = 0) => Number.isFinite(value) ? value : fallback;
const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };

// Chapters are measured once per layout change. Reading each chapter opens a
// different pair of petals; the last opening belongs to the contact chapter.
export function lowerBloomFrame({ scroll = 0, viewport = 800, start = 0, end = 1, chapters = [], paused = false } = {}) {
  const height = Math.max(1, finite(viewport, 800));
  const first = finite(start);
  const last = Math.max(first + 1, finite(end, first + 1));
  const focus = finite(scroll) + height * .52;
  const stops = chapters.filter(Number.isFinite).filter((value, index, values) => index === 0 || value > values[index - 1]);
  let phase;
  if (stops.length < 2) {
    phase = clamp((focus - first) / (last - first)) * 6;
  } else if (focus <= stops[0]) {
    phase = 0;
  } else {
    phase = stops.length - 1;
    for (let i = 0; i < stops.length - 1; i += 1) {
      if (focus <= stops[i + 1]) {
        phase = i + smooth((focus - stops[i]) / (stops[i + 1] - stops[i]));
        break;
      }
    }
  }
  const progress = clamp(phase / (stops.length > 1 ? stops.length - 1 : 6));
  const pose = paused ? 3.5 : phase;
  const petals = Array.from({ length: 6 }, (_, index) => {
    const side = index % 2 === 0 ? -1 : 1;
    const layer = Math.floor(index / 2);
    const opening = smooth((pose - layer * .9) / (3.2 + layer * .55));
    const lift = smooth((pose - layer * .4) / 5.5);
    return {
      opening,
      x: side * (opening * (2.8 + layer * 1.8)),
      y: (1 - opening) * (18 + layer * 5) - lift * (8 + layer * 6),
      angle: side * (opening * (28 + layer * 10) - 8 - layer * 7),
      tilt: 13 - opening * (23 + layer * 5),
      scale: 1.13 - opening * .12 + layer * .035,
    };
  });
  return {
    phase,
    progress,
    opacity: smooth((finite(scroll) - first + height * .7) / (height * .7)),
    cameraY: paused ? -3 : -10 + progress * 20,
    cameraScale: paused ? 1.08 : 1.13 - progress * .1,
    lightX: paused ? 50 : 43 + progress * 14,
    lightY: paused ? 66 : 80 - progress * 30,
    petals,
  };
}
