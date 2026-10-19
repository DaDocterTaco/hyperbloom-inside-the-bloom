import { useEffect } from 'react';
import { clamp, smoothstep } from './bloomMotion.js';

// Only the decorative guide and existing glass move. Copy stays in document flow.
export function journeyFrame({ scroll, top, height, railTop, railHeight, viewport }) {
  const position = Number.isFinite(scroll) ? scroll : 0;
  const view = Math.max(1, viewport);
  return {
    progress: clamp((position + view * .72 - railTop) / Math.max(1, railHeight + view * .2)),
    travel: smoothstep(top - view * .4, top + height * .8, position),
    left: smoothstep(top - view * .28, top + height * .55, position),
    right: smoothstep(top - view * .18, top + height * .68, position),
    depth: smoothstep(top - view * .32, top + height * .78, position),
  };
}

export function useJourneyMotion(root, enabled) {
  useEffect(() => {
    const section = root.current;
    if (!section) return;
    let scheduled = 0;
    let active = true;
    let visible = true;
    let metrics;
    let previousScroll = NaN;
    const draw = () => {
      scheduled = 0;
      if (!active || !metrics) return;
      const position = window.scrollY;
      if (position !== previousScroll) {
        const frame = enabled ? journeyFrame({ ...metrics, scroll: position }) : { progress: 1, travel: .5, left: .5, right: .5, depth: .5 };
        for (const [key, value] of Object.entries(frame)) section.style.setProperty(`--journey-${key}`, value.toFixed(4));
        previousScroll = position;
      }
      // Keep sampling through the last paint of a fling or a direction change.
      // Idle frames only read scrollY; they do not rewrite styles or measure layout.
      if (enabled && visible) scheduled = requestAnimationFrame(draw);
    };
    const schedule = () => { if (!scheduled) scheduled = requestAnimationFrame(draw); };
    const measure = () => {
      if (!active) return;
      const box = section.getBoundingClientRect();
      const rail = section.querySelector('.journey-steps').getBoundingClientRect();
      metrics = { top: box.top + window.scrollY, height: box.height, railTop: rail.top + window.scrollY, railHeight: rail.height, viewport: window.innerHeight };
      previousScroll = NaN;
      schedule();
    };
    const onScroll = () => { if (enabled && visible) schedule(); };
    const resize = new ResizeObserver(measure);
    resize.observe(section);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) { previousScroll = NaN; schedule(); }
      else { cancelAnimationFrame(scheduled); scheduled = 0; }
    }, { rootMargin: '120px' });
    intersection.observe(section);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
    document.fonts.ready.then(measure);
    measure();
    return () => {
      active = false;
      resize.disconnect();
      intersection.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      cancelAnimationFrame(scheduled);
    };
  }, [root, enabled]);
}
