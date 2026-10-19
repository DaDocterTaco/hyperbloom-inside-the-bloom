import { useEffect, useRef, useState } from 'react';

export function useClock() {
  const [now, setNow] = useState(Date.now);
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(timer); }, []);
  return now;
}

// A position-based decorative camera. Content is never hidden or pinned.
export function useAmbientScene(enabled) {
  const ref = useRef(null);
  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    let frame = 0;
    let active = true;
    let visible = false;
    let top = 0;
    let height = 1;
    let view = 1;
    const draw = () => {
      frame = 0;
      if (!active) return;
      const progress = enabled ? Math.max(0, Math.min(1, (window.scrollY + view - top) / (height + view))) : .45;
      section.style.setProperty('--scene-progress', progress.toFixed(4));
    };
    const schedule = () => { if (!frame && visible) frame = requestAnimationFrame(draw); };
    const measure = () => { const box = section.getBoundingClientRect(); top = box.top + window.scrollY; height = box.height; view = window.innerHeight; schedule(); };
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) { measure(); schedule(); } }, { rootMargin: '160px' });
    const resize = new ResizeObserver(measure);
    intersection.observe(section);
    resize.observe(section);
    if (enabled) window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
    document.fonts.ready.then(() => { if (active) measure(); });
    measure(); draw();
    return () => { active = false; cancelAnimationFrame(frame); intersection.disconnect(); resize.disconnect(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', measure); };
  }, [enabled]);
  return ref;
}
