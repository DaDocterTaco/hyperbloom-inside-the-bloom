import { useEffect, useRef } from 'react';
import { continuityFrame } from './continuityMotion.mjs';
import { lowerBloomFrame } from './lowerBloomMotion.mjs';

export function BloomContinuity({ motion, route }) {
  const root = useRef(null);
  useEffect(() => {
    const element = root.current;
    let alive = true;
    let frame = 0;
    let start = 0;
    let end = 1;
    let chapters = [];
    let position = window.scrollY;
    const petals = Array.from(element.querySelectorAll('.bloom-living-petal'));
    const measure = () => {
      const chapter = document.getElementById('journey');
      start = chapter ? chapter.getBoundingClientRect().top + window.scrollY : 0;
      end = Math.max(start + 1, document.documentElement.scrollHeight - window.innerHeight);
      if (route === 'home') {
        chapters = ['showcase','events','journal','about','questions','contact'].map(id => document.getElementById(id)).filter(Boolean).map(section => section.getBoundingClientRect().top + window.scrollY);
        chapters.push(Math.max(end + window.innerHeight * .52, (chapters.at(-1) || start) + 1));
      }
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
      if (route === 'home') {
        const flower = lowerBloomFrame({ scroll: position, start, end, viewport: window.innerHeight, chapters, paused: !motion });
        element.style.setProperty('--flower-camera-y', `${flower.cameraY.toFixed(3)}vh`);
        element.style.setProperty('--flower-camera-scale', flower.cameraScale.toFixed(4));
        element.style.setProperty('--flower-light-x', `${flower.lightX.toFixed(3)}%`);
        element.style.setProperty('--flower-light-y', `${flower.lightY.toFixed(3)}%`);
        element.dataset.flowerPhase = flower.phase.toFixed(4);
        petals.forEach((petal,index) => {
          const pose = flower.petals[index];
          petal.style.setProperty('--petal-x', `${pose.x.toFixed(3)}vw`);
          petal.style.setProperty('--petal-y', `${pose.y.toFixed(3)}vh`);
          petal.style.setProperty('--petal-angle', `${pose.angle.toFixed(3)}deg`);
          petal.style.setProperty('--petal-tilt', `${pose.tilt.toFixed(3)}deg`);
          petal.style.setProperty('--petal-scale', pose.scale.toFixed(4));
          petal.dataset.opening = pose.opening.toFixed(4);
        });
      }
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
  return <div ref={root} className={`bloom-continuity ${route !== 'home' ? 'secondary-scene' : 'home-scene'}`} aria-hidden="true">
    {route === 'home' && <picture className="continuity-vault"><source media="(max-width: 760px)" srcSet="/art/journey-interior-mobile-v2.webp" /><img src="/art/journey-interior-desktop-v2.webp" alt="" decoding="async" /></picture>}
    {route === 'home' && <><div className="bloom-radiance" /><div className="bloom-articulated">{Array.from({ length: 6 }, (_,index) => <div className="bloom-living-petal" key={index}><img src="/art/glass-petal-v1.webp" alt="" decoding="async" width="1024" height="1024" /></div>)}</div></>}
    <div className="continuity-light" />
    <img className="continuity-left" src="/art/petals-left.webp" alt="" decoding="async" />
    <img className="continuity-right" src="/art/bloom-sculpture-v1.webp" alt="" decoding="async" />
    <div className="continuity-quiet" />
  </div>;
}
