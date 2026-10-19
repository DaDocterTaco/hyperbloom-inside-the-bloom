import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const publicRoot = path.join(root, 'dist/client');
const hosting = JSON.parse(readFileSync(path.join(root, 'firebase.json'), 'utf8')).hosting;
assert.equal(hosting.public, 'dist/client', 'Firebase must serve only the compiled public output.');
assert.ok(hosting.rewrites.some(rule => rule.destination === '/index.html'), 'Direct app routes need a SPA fallback.');
const checked = new Set();
const verify = (reference, parent = 'index.html') => {
  const clean = reference.split(/[?#]/)[0];
  if (!clean || /^(data:|https?:|#)/.test(clean)) return;
  const relative = clean.startsWith('/') ? clean.slice(1) : path.posix.join(path.posix.dirname(parent), clean);
  const resolved = path.resolve(publicRoot, relative);
  assert.ok(resolved.startsWith(path.resolve(publicRoot) + path.sep), `Asset escaped public output: ${reference}`);
  assert.ok(existsSync(resolved), `Missing built asset: ${relative} (from ${parent})`);
  assert.ok(!/^art\/.*\.png$/.test(relative.replaceAll('\\', '/')) || relative === 'art/bloom-scene.png', `App references an unpublished source PNG: ${relative}`);
  checked.add(relative);
};
const html = readFileSync(path.join(publicRoot, 'index.html'), 'utf8');
for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) verify(match[1]);
const codeFiles = readdirSync(path.join(publicRoot, 'assets')).filter(name => /\.(css|js)$/.test(name));
for (const name of codeFiles) {
  const text = readFileSync(path.join(publicRoot, 'assets', name), 'utf8');
  assert.ok(!text.includes('127.0.0.1:4173'), `Local preview URL leaked into ${name}`);
  assert.ok(!text.includes('C:\\Users\\Victor'), `Local path leaked into ${name}`);
  for (const match of text.matchAll(/\/(?:art|brand|source)\/[A-Za-z0-9_.-]+\.(?:webp|png|jpg|avif|svg)/g)) verify(match[0]);
  if (name.endsWith('.css')) {
    for (const match of text.matchAll(/url\(["']?([^)'"\s]+)["']?\)/g)) verify(match[1], 'assets/' + name);
  }
}
// Dynamic partner filenames are assembled at runtime, so check those separately.
const experience = readFileSync(path.join(root, 'src/Experience.jsx'), 'utf8');
for (const match of experience.matchAll(/['"]([a-f0-9]{16}\.(?:png|jpg))['"]/g)) verify('/source/' + match[1]);
for (const forbidden of ['.env', '.git', 'node_modules', 'qa', 'mockups', 'src', 'firebase-debug.log']) {
  assert.ok(!existsSync(path.join(publicRoot, forbidden)), `Private/development content in public output: ${forbidden}`);
}
let publishedBytes = 0;
const walk = dir => {
  for (const name of readdirSync(dir)) {
    const file = path.join(dir, name);
    if (statSync(file).isDirectory()) walk(file);
    else {
      const relative = path.relative(publicRoot, file).replaceAll('\\', '/');
      if ((/^art\/.*\.png$/.test(relative) && relative !== 'art/bloom-scene.png') || /art\/journey-interior-(desktop|mobile)-v1.webp/.test(relative)) continue;
      publishedBytes += statSync(file).size;
      assert.ok(statSync(file).size < 100 * 1024 * 1024, `Unexpected oversized release file: ${relative}`);
    }
  }
};
walk(publicRoot);
console.log(`Release assets verified: ${checked.size} references; approximately ${(publishedBytes / 1024 / 1024).toFixed(1)} MB published static files. Unused source PNGs, QA and development files are excluded from Hosting; the hero PNG fallback is retained.`);
