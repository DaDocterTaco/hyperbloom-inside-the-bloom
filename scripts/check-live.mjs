import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const build = path.join(root, 'dist/client');
const base = new URL(process.argv[2] || 'https://hyperbloom-bloom-2026.web.app/');
assert.equal(base.protocol, 'https:', 'Check the secure public deployment URL.');
const builtHtml = readFileSync(path.join(build, 'index.html'), 'utf8');
const entry = builtHtml.match(/<script[^>]+src="([^"]+)"/)?.[1];
assert.ok(entry, 'Build the app before checking the live release.');
const assets = new Set();
const add = (reference, parent = '/index.html') => {
  if (/^(https?:|data:|#)/.test(reference)) return;
  const url = new URL(reference, 'https://local.invalid' + parent);
  assert.ok(existsSync(path.join(build, url.pathname)), `Missing local build reference: ${url.pathname}`);
  assets.add(url.pathname);
};
for (const match of builtHtml.matchAll(/(?:src|href)="([^"#]+)"/g)) add(match[1]);
for (const name of readdirSync(path.join(build, 'assets')).filter(name => /\.(js|css)$/.test(name))) {
  const text = readFileSync(path.join(build, 'assets', name), 'utf8');
  for (const match of text.matchAll(/\/(?:art|brand|source)\/[A-Za-z0-9_.-]+\.(?:webp|png|jpg|avif|svg)/g)) add(match[0]);
  if (name.endsWith('.css')) for (const match of text.matchAll(/url\(["']?([^)'"\s]+)["']?\)/g)) add(match[1], '/assets/' + name);
}
const experience = readFileSync(path.join(root, 'src/Experience.jsx'), 'utf8');
for (const match of experience.matchAll(/['"]([a-f0-9]{16}\.(?:png|jpg))['"]/g)) add('/source/' + match[1]);
assets.add('/hyperbloom-october.ics');
const routes = ['/', '/terms', '/terms/', '/blog', '/blog?q=API', '/gallery', '/v1-gallery', '/reg-closed', '/post/what-is-the-n8n-hype', '/post/neural-networks-the-technology-behind-modern-ai', '/post/what-is-an-api-the-invisible-messenger-behind-modern-apps', '/post/what-are-ai-agents-and-how-are-they-impacting-the-world', '/unknown-page'];
const report = { base: base.origin, checkedAt: new Date().toISOString(), routes: [], assets: [] };
for (const route of routes) {
  const response = await fetch(new URL(route, base), { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, `Direct app route failed: ${route}`);
  assert.match(response.headers.get('content-type') || '', /text\/html/, route);
  assert.ok((await response.text()).includes(entry), `Stale or incorrect app shell at ${route}`);
  report.routes.push({ path: route, status: response.status, cache: response.headers.get('cache-control') });
}
const pending = [...assets];
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
await Promise.all(Array.from({ length: 6 }, async () => {
  while (pending.length) {
    const asset = pending.pop();
    const response = await fetch(new URL(asset, base), { signal: AbortSignal.timeout(30000) });
    assert.equal(response.status, 200, `Live asset failed: ${asset}`);
    const type = response.headers.get('content-type') || '';
    assert.ok(!type.includes('text/html'), `Asset fell through to the HTML shell: ${asset}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(digest(bytes), digest(readFileSync(path.join(build, asset))), `Deployed bytes differ from the tested build: ${asset}`);
    report.assets.push({ path: asset, status: response.status, type, bytes: bytes.length, cache: response.headers.get('cache-control') });
  }
}));
const js = report.assets.find(asset => asset.path === entry);
assert.match(js.cache || '', /immutable/, 'Hashed build assets should have immutable caching.');
assert.match(report.routes[0].cache || '', /max-age=0/, 'HTML should revalidate for fresh releases.');
report.passed = true;
const output = path.join(root, 'qa/submission-release');
mkdirSync(output, { recursive: true });
writeFileSync(path.join(output, 'live-http-checks.json'), JSON.stringify(report, null, 2));
console.log(`LIVE PASS: ${report.routes.length} direct routes and ${report.assets.length} exact-match assets at ${base.origin}. HTML revalidation and immutable bundle caching verified.`);
