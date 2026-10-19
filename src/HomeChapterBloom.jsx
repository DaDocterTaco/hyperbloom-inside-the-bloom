import { useEffect, useRef } from 'react';

/** Decorative, reversible flower opening. The section's real content never moves. */
export function HomeChapterBloom({ variant = 'community', motion = true }) {
  const root = useRef(null);

  useEffect(() => {
    const element = root.current;
    const section = element?.parentElement;
    if (!section) return;
    let alive = true;
    let visible = false;
    let frame = 0;
    let top = 0;
    let height = 1;
    let viewport = window.innerHeight;
    let progress = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const draw = () => {
      frame = 0;
      if (!alive) return;
      const enabled = motion && !reduced.matches;
      // Open during arrival, then keep an open flower around the content.
      const target = enabled ? Math.max(0, Math.min(1,
        (window.scrollY + viewport * .88 - top) / Math.min(height * .7, viewport * 1.12))) : .72;
      progress = enabled ? progress + (target - progress) * .12 : target;
      if (Math.abs(target - progress) < .001) progress = target;
      element.style.setProperty('--chapter-open', progress.toFixed(4));
      element.dataset.open = progress.toFixed(3);
      if (enabled && visible && Math.abs(target - progress) > .001) schedule();
    };
    const schedule = () => {
      if (alive && visible && !frame) frame = requestAnimationFrame(draw);
    };
    const measure = () => {
      const rect = section.getBoundingClientRect();
      top = rect.top + window.scrollY;
      height = Math.max(1, rect.height);
      viewport = window.innerHeight;
      schedule();
    };
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) { measure(); schedule(); }
      else { cancelAnimationFrame(frame); frame = 0; }
    }, { rootMargin: '100px' });
    const resize = new ResizeObserver(measure);
    intersection.observe(section);
    resize.observe(section);
    if (motion) window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
    reduced.addEventListener('change', schedule);
    document.fonts.ready.then(() => { if (alive) measure(); });
    measure();
    draw();
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      intersection.disconnect();
      resize.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      reduced.removeEventListener('change', schedule);
    };
  }, [motion]);

  return <div ref={root} className={`chapter-bloom chapter-bloom--${variant}`} aria-hidden="true">
    <div className="chapter-bloom-light" />
    <div className="chapter-bloom-flower">
      <img className="chapter-bloom-petal petal-outer-left" src="/art/glass-petal-v1.webp" alt="" loading="lazy" decoding="async" />
      <img className="chapter-bloom-petal petal-outer-right" src="/art/glass-petal-v1.webp" alt="" loading="lazy" decoding="async" />
      <img className="chapter-bloom-petal petal-crown" src="/art/glass-petal-v1.webp" alt="" loading="lazy" decoding="async" />
      <img className="chapter-bloom-petal petal-inner-left" src="/art/glass-petal-v1.webp" alt="" loading="lazy" decoding="async" />
      <img className="chapter-bloom-petal petal-inner-right" src="/art/glass-petal-v1.webp" alt="" loading="lazy" decoding="async" />
      <div className="chapter-bloom-heart" />
    </div>
  </div>;
}

