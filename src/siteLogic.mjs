import { articleForPath } from './content.js';

export const OCTOBER_START = Date.parse('2026-10-01T00:00:00-04:00');
export const OCTOBER_DEADLINE = Date.parse('2026-10-19T17:00:00-04:00');
export const OCTOBER_GRADING_START = Date.parse('2026-10-20T00:00:00-04:00');

// The event remains current during judging; its submission deadline is separate.
export function octoberEventPhase(now = Date.now()) {
  const time = Number.isFinite(now) ? now : Date.now();
  if (time < OCTOBER_START) return 'upcoming';
  return time < OCTOBER_GRADING_START ? 'open' : 'grading';
}

export function octoberState(now = Date.now()) {
  const time = Number.isFinite(now) ? now : Date.now();
  if (time < OCTOBER_START) return 'upcoming';
  return time < OCTOBER_DEADLINE ? 'open' : 'closed';
}

export function eventIsOpen(event, now = Date.now()) {
  return Boolean(event.current && octoberState(now) === 'open');
}

export function selectEvents(events, filter = 'all', now = Date.now()) {
  return events.filter(event => filter === 'current' ? event.current : filter === 'open' ? eventIsOpen(event, now) : filter === 'past' ? !event.current : true);
}

const normalize = value => String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export function selectArticles(articles, query = '', category = 'all') {
  const words = normalize(query).trim().split(/\s+/).filter(Boolean);
  return articles.filter(article => (category === 'all' || article.category === category) && words.every(word => normalize([article.title, article.category, article.intro, 'kashvi1729'].join(' ')).includes(word)));
}

export function routeFor(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/') return 'home';
  if (path === '/terms') return 'terms';
  if (path === '/blog') return 'blog';
  if (path === '/gallery') return 'gallery';
  if (path === '/v1-gallery') return 'v1';
  if (path === '/reg-closed') return 'closed';
  if (articleForPath(path)) return 'article';
  return 'missing';
}

export function fragmentId(hash) {
  try { return decodeURIComponent(hash.replace(/^#/, '')); }
  catch { return ''; }
}
