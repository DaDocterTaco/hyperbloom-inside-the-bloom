import { useEffect, useState } from 'react';
import { fragmentId, routeFor } from './siteLogic.mjs';
import { articleForPath } from './content';

const pageNames = { home: 'Make something bloom.', terms: 'Terms & project notice', blog: 'The journal', gallery: 'The gallery', v1: 'Hyperbloom V1', closed: 'Registration closed', missing: 'Page not found' };

function revealAnchor(id) {
  const anchor = id && document.getElementById(id);
  for (let parent = anchor?.parentElement; parent; parent = parent.parentElement) {
    if (parent.tagName === 'DETAILS') parent.open = true;
  }
  return anchor;
}

export function useSiteNavigation() {
  const [location, setLocation] = useState(() => ({ path: window.location.pathname, key: 0, restore: null }));
  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    const pop = event => setLocation(old => ({ path: window.location.pathname, key: old.key + 1, restore: event.state?.hyperbloomScroll ?? null }));
    window.addEventListener('popstate', pop);
    return () => { window.removeEventListener('popstate', pop); window.history.scrollRestoration = previous; };
  }, []);
  useEffect(() => {
    let active = true;
    let frame = 0;
    document.title = `Hyperbloom Redesign — ${articleForPath(location.path)?.title || pageNames[routeFor(location.path)]}`;
    document.fonts.ready.then(() => {
      if (!active) return;
      frame = requestAnimationFrame(() => {
        if (!active) return;
        const id = fragmentId(window.location.hash);
        const anchor = revealAnchor(id);
        if (anchor) {
          anchor.scrollIntoView({ behavior: 'instant', block: 'start' });
          if (location.key) {
            anchor.setAttribute('tabindex', '-1');
            anchor.focus({ preventScroll: true });
          }
        }
        else window.scrollTo({ top: location.restore ?? 0, behavior: 'instant' });
        if (!anchor && location.key) document.querySelector('main h1')?.focus({ preventScroll: true });
      });
    });
    return () => { active = false; cancelAnimationFrame(frame); };
  }, [location]);

  const onLinkClick = event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href]');
    if (!link || link.hasAttribute('download') || link.target && link.target !== '_self') return;
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return;
    if (url.pathname === window.location.pathname) {
      revealAnchor(fragmentId(url.hash));
      return;
    }
    event.preventDefault();
    window.history.replaceState({ ...window.history.state, hyperbloomScroll: window.scrollY }, '');
    window.history.pushState({}, '', url.pathname + url.search + url.hash);
    setLocation(old => ({ path: url.pathname, key: old.key + 1, restore: null }));
  };
  return { route: routeFor(location.path), routeKey: location.key, onLinkClick };
}
