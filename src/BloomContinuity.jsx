import { useEffect, useRef } from 'react';
import { continuityFrame } from './continuityMotion.mjs';

export function BloomContinuity({ motion, route }) {
  const root = useRef(null);
  useEffect(() => {
    const element = root.current;
    let alive = true;
    let frame = 0;
    let start = 0;
    let end = 1;
    let position = window.scrollY;
    const measure = () => {
      const chapter = document.getElementById('journey');
      start = chapter ? chapter.getBoundingClientRect().top + window.scrollY : 0;
      end = Math.max(start + 1, document.documentElement.scrollHeight - window.innerHeight);
      schedule();
    };
    const draw = () => {
      frame = 0;
      if (!alive) return;
      const began = performance.now();
      const target = window.scrollY;
      position = motion ? position + (target - position) * .16 : target;
      if (Math.abs(target - position) < .25) position = target;
      const state = continuityFrame({ scroll: position, start, end, viewport: window.innerHeight, secondary: route !== 'home' });
      element.style.opacity = state.opacity.toFixed(4);
      element.style.setProperty('--bloom-left-y', `${motion ? state.leftY : 0}px`);
      element.style.setProperty('--bloom-right-y', `${motion ? state.rightY : 0}px`);
      element.style.setProperty('--bloom-left-angle', `${motion ? state.leftAngle : -15}deg`);
      element.style.setProperty('--bloom-right-angle', `${motion ? state.rightAngle : 16}deg`);
      element.style.setProperty('--bloom-scale', motion ? state.scale.toFixed(4) : '1.1');
      element.style.setProperty('--bloom-light-y', `${motion ? state.lightY : 50}%`);
      element.dataset.progress = state.progress.toFixed(4);
      element.dataset.updateMs = (performance.now() - began).toFixed(3);
      if (position !== target && motion) schedule();
    };
    const schedule = () => { if (alive && !frame) frame = requestAnimationFrame(draw); };
    const resize = new ResizeObserver(measure);
    resize.observe(document.querySelector('main'));
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
    document.fonts.ready.then(() => { if (alive) measure(); });
    measure();
    return () => { alive = false; cancelAnimationFrame(frame); resize.disconnect(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', measure); };
  }, [motion, route]);
  return <div ref={root} className={`bloom-continuity ${route !== 'home' ? 'secondary-scene' : ''}`} aria-hidden="true">
    <div className="continuity-light" />
    <img className="continuity-left" src="/art/petals-left.webp" alt="" decoding="async" />
    <img className="continuity-right" src="/art/bloom-sculpture-v1.webp" alt="" decoding="async" />
    <div className="continuity-quiet" />
  </div>;
}
