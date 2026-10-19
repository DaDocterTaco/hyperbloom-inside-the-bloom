import { useEffect, useRef } from 'react';

const clamp = value => Math.max(0, Math.min(1, value));

/** Decorative chapter punctuation. The content never waits for the animation. */
export function BloomFinale({ variant = 'journal', motion = true }) {
  const root = useRef(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let visible = true;
    let disposed = false;
    let opening = !motion || reduced.matches ? 1 : 0;

    const draw = () => {
      frame = 0;
      if (disposed || document.hidden || !visible) return;
      const bounds = element.getBoundingClientRect();
      const target = !motion || reduced.matches ? 1 : clamp((window.innerHeight * .96 - bounds.top) / (window.innerHeight * .72 + Math.min(bounds.height, 280)));
      opening += (target - opening) * .18;
      if (Math.abs(target - opening) < .001) opening = target;
      element.style.setProperty('--finale-open', opening.toFixed(4));
      element.dataset.opening = opening.toFixed(3);
      if (opening !== target) schedule();
    };
    const schedule = () => {
      if (!disposed && visible && !frame) frame = requestAnimationFrame(draw);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
      else if (frame) { cancelAnimationFrame(frame); frame = 0; }
    }, { rootMargin: '160px' });
    observer.observe(element);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    document.addEventListener('visibilitychange', schedule);
    reduced.addEventListener('change', schedule);
    schedule();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      document.removeEventListener('visibilitychange', schedule);
      reduced.removeEventListener('change', schedule);
    };
  }, [motion, variant]);

  return <div ref={root} className={`bloom-finale bloom-finale--${variant}`} aria-hidden="true">
    <div className="finale-gold-light" />
    {variant === 'closing' ? <div className="finale-radial-flower">
      {[-154, -103, -51, 0, 51, 103, 154].map((angle, index) => <img key={angle} className="finale-radial-petal" style={{ '--petal-angle': `${angle}deg`, '--petal-depth': Math.abs(index - 3) }} src="/art/glass-petal-v1.webp" alt="" loading="lazy" decoding="async" width="1024" height="1024" />)}
      <div className="finale-gold-heart"><i /><i /><i /></div>
    </div> : <div className="finale-flower">
      <img className="finale-flower-half finale-flower-left" src="/art/bloom-sculpture-v1.webp" alt="" loading="lazy" decoding="async" width="1536" height="1024" />
      <img className="finale-flower-half finale-flower-right" src="/art/bloom-sculpture-v1.webp" alt="" loading="lazy" decoding="async" width="1536" height="1024" />
    </div>}
    <div className="finale-ground-light" />
  </div>;
}
