import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { OCTOBER_START, OCTOBER_DEADLINE, OCTOBER_GRADING_START, octoberEventPhase, octoberState, eventIsOpen, selectEvents, selectArticles, routeFor, fragmentId } from '../src/siteLogic.mjs';
import { articleForPath, articlePath, articles } from '../src/content.js';
import { readingGuides } from '../src/articleContent.js';

test('the submission state changes at the actual EDT deadline, not midnight', () => {
  assert.equal(new Date(OCTOBER_DEADLINE).toISOString(), '2026-10-19T21:00:00.000Z');
  assert.equal(octoberState(OCTOBER_START - 1), 'upcoming');
  assert.equal(octoberState(OCTOBER_START), 'open');
  assert.equal(octoberState(OCTOBER_DEADLINE - 1), 'open');
  assert.equal(octoberState(OCTOBER_DEADLINE), 'closed');
});
test('submission availability closes at the deadline while October remains current', () => {
  const upcoming = { title: 'Current', current: true };
  const past = { title: 'Earlier' };
  const input = [upcoming, past];
  assert.deepEqual(selectEvents(input, 'open', OCTOBER_DEADLINE - 1), [upcoming]);
  assert.deepEqual(selectEvents(input, 'past', OCTOBER_DEADLINE - 1), [past]);
  assert.deepEqual(selectEvents(input, 'open', OCTOBER_DEADLINE), []);
  assert.deepEqual(selectEvents(input, 'past', OCTOBER_DEADLINE), [past]);
  assert.deepEqual(selectEvents(input, 'current', OCTOBER_DEADLINE), [upcoming]);
  assert.equal(eventIsOpen(past, OCTOBER_DEADLINE - 1), false);
  assert.equal(eventIsOpen(upcoming, OCTOBER_START - 1), false);
});
test('October automatically enters grading after October 19 in Eastern time and stays featured', () => {
  assert.equal(new Date(OCTOBER_GRADING_START).toISOString(), '2026-10-20T04:00:00.000Z');
  assert.equal(octoberEventPhase(OCTOBER_START - 1), 'upcoming');
  assert.equal(octoberEventPhase(OCTOBER_DEADLINE), 'open');
  assert.equal(octoberEventPhase(OCTOBER_GRADING_START - 1), 'open');
  assert.equal(octoberEventPhase(OCTOBER_GRADING_START), 'grading');
  assert.equal(octoberEventPhase(Date.parse('2026-10-21T12:00:00Z')), 'grading');
  const current = { current: true };
  const past = { title: 'Earlier' };
  assert.deepEqual(selectEvents([current, past], 'current', OCTOBER_GRADING_START), [current]);
  assert.deepEqual(selectEvents([current, past], 'past', OCTOBER_GRADING_START), [past]);
  assert.equal(eventIsOpen(current, OCTOBER_GRADING_START), false);
});
test('multiword article search normalizes accents and matches across title and description', () => {
  const input = [{ title: 'Café APIs', intro: 'Connecting services', category: 'DEVELOPMENT' }, { title: 'Networks', intro: 'Learning from data', category: 'AI' }];
  assert.deepEqual(selectArticles(input, '  CAFE   SERVICES '), [input[0]]);
  assert.deepEqual(selectArticles(input, 'api', 'AI'), []);
  assert.deepEqual(selectArticles(input, '   ', 'AI'), [input[1]]);
  assert.deepEqual(selectArticles(input, 'missing'), []);
  assert.equal(input.length, 2);
});
test('canonical and trailing slash routes resolve without accepting an unknown path', () => {
  assert.equal(routeFor('/'), 'home');
  assert.equal(routeFor('/blog/'), 'blog');
  assert.equal(routeFor('/gallery'), 'gallery');
  assert.equal(routeFor('/v1-gallery'), 'v1');
  assert.equal(routeFor('/reg-closed'), 'closed');
  assert.equal(routeFor('/terms'), 'terms');
  assert.equal(routeFor('/terms/'), 'terms');
  assert.equal(routeFor('/terms/not-a-page'), 'missing');
  assert.equal(routeFor('/gallery/not-an-event'), 'missing');
});
test('malformed fragments cannot break initial navigation', () => {
  assert.equal(fragmentId('#v1-presentations'), 'v1-presentations');
  assert.equal(fragmentId('#hello%20world'), 'hello world');
  assert.equal(fragmentId('#%E0%A4%A'), '');
  assert.equal(fragmentId(''), '');
});

test('every original article has a direct local reader and preserves its official source', () => {
  for (const article of articles) {
    const path = articlePath(article);
    assert.equal(new URL(article.href).host, 'www.hyperbloomhacks.com');
    assert.equal(routeFor(path), 'article');
    assert.equal(routeFor(path + '/'), 'article');
    assert.equal(articleForPath(path + '/'), article);
    const guide = readingGuides[path.split('/').pop()];
    assert.ok(guide?.lead && guide.sections.length);
    assert.equal(new Set(guide.sections.map(section => section.id)).size, guide.sections.length);
  }
  assert.equal(routeFor('/post/unknown-article'), 'missing');
  assert.equal(routeFor('/post/what-is-the-n8n-hype/extra'), 'missing');
});
test('the downloadable calendar describes the official submission deadline in UTC', async () => {
  const calendar = await readFile(new URL('../public/hyperbloom-october.ics', import.meta.url), 'utf8');
  assert.match(calendar, /BEGIN:VCALENDAR\r?\nVERSION:2\.0/);
  assert.match(calendar, /DTSTART:20261019T210000Z/);
  assert.match(calendar, /UID:.+/);
  assert.match(calendar, /DTSTAMP:\d{8}T\d{6}Z/);
  assert.match(calendar, /SUMMARY:Hyperbloom October submission deadline/);
  assert.match(calendar, /END:VEVENT\r?\nEND:VCALENDAR/);
});
