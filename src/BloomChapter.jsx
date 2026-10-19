import { useEffect, useRef, useState } from 'react';
import { BLOOM_ASSETS, bloomFrame } from './bloomMotion';

function useSceneAssets(enabled) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!enabled || ready) return;
    let active = true;
    Promise.all(BLOOM_ASSETS.map(src => new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => image.decode().then(resolve, reject);
      image.onerror = reject;
      image.src = src;
    }))).then(() => { if (active) setReady(true); }).catch(() => {
      // Keep the complete static scene if an optional motion asset cannot load.
      if (active) setReady(false);
    });
    return () => { active = false; };
  }, [enabled, ready]);
  return ready;
}

function useBloomTimeline(root, enabled) {
  useEffect(() => {
    const chapter = root.current;
    if (!chapter) return;
    let scheduled = 0;
    let active = true;
    let metrics = { top: 0, heroHeight: 1100, viewportHeight: 720, width: 1280 };
    const previous = new Map();
    const draw = () => {
      scheduled = 0;
      if (!active) return;
      const started = performance.now();
      const frame = bloomFrame({ ...metrics, scroll: window.scrollY - metrics.top });
      for (const key of ['open','left','right','front','center','handoff','release','sweep','settle','follow','mark']) {
        const value = (enabled ? frame[key] : 0).toFixed(4);
        if (previous.get(key) !== value) {
          chapter.style.setProperty(`--bloom-${key}`, value);
          previous.set(key, value);
        }
      }
      chapter.dataset.phase = enabled ? frame.phase : 'static';
      chapter.dataset.motionUpdateMs = (performance.now() - started).toFixed(2);
    };
    const schedule = () => { if (!scheduled) scheduled = requestAnimationFrame(draw); };
    const measure = () => {
      if (!active) return;
      const top = chapter.getBoundingClientRect().top + window.scrollY;
      metrics = {
        top,
        heroHeight: chapter.querySelector('.hero').getBoundingClientRect().height,
        challengeStart: chapter.querySelector('.october').getBoundingClientRect().top + window.scrollY - top,
        viewportHeight: window.innerHeight,
        width: window.innerWidth,
      };
      schedule();
    };
    const observer = new ResizeObserver(measure);
    observer.observe(chapter);
    observer.observe(chapter.querySelector('.hero'));
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
    document.fonts.ready.then(measure);
    measure();
    return () => {
      active = false;
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      cancelAnimationFrame(scheduled);
    };
  }, [root, enabled]);
}

function BloomStage() {
  return <div className="bloom-stage-track" aria-hidden="true">
    <div className="bloom-stage">
      <div className="bloom-scene-window">
        <img className="bloom-atmosphere" src="/art/bloom-atmosphere.webp" alt="" />
        <div className="bloom-camera">
          <img className="bloom-poster" src="/art/bloom-scene.webp" alt="" />
          <div className="bloom-center"><img src="/art/bloom-center.webp" alt="" /></div>
          <div className="bloom-petal bloom-petal-rear bloom-petal-rear-left"><img src="/art/petals-left.webp" alt="" /></div>
          <div className="bloom-petal bloom-petal-rear bloom-petal-rear-right"><img src="/art/petals-right.webp" alt="" /></div>
          <div className="bloom-petal bloom-petal-front bloom-petal-front-left"><img src="/art/petals-left.webp" alt="" /></div>
          <div className="bloom-petal bloom-petal-front bloom-petal-front-right"><img src="/art/petals-right.webp" alt="" /></div>
          <div className="bloom-foreground"><img src="/art/bloom-foreground.webp" alt="" /></div>
        </div>
        <img className="bloom-floor" src="/art/event-stage.webp" alt="" />
      </div>
    </div>
  </div>;
}

export function BloomChapter({ motion, children }) {
  const root = useRef(null);
  const ready = useSceneAssets(motion);
  const enabled = motion && ready;
  useBloomTimeline(root, enabled);
  return <div ref={root} className="bloom-chapter" data-motion={enabled ? 'on' : 'off'} data-assets={ready ? 'ready' : 'loading'}>
    {motion && <BloomStage />}
    {children}
  </div>;
}
