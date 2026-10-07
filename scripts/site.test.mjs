import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const appDir = path.join(root, '.next', 'server', 'app');
const bannedFile = path.join(root, 'scripts', 'banned-terms.local.txt');

/** Map a route ("/", "/about", "/solutions/x") to its built html file path. */
function builtPath(route) {
  const clean = route.split(/[?#]/)[0].replace(/^\/+|\/+$/g, '');
  const rel = clean === '' ? 'index' : clean;
  const direct = path.join(appDir, `${rel}.html`);
  if (fs.existsSync(direct)) return direct;
  const nested = path.join(appDir, rel, 'index.html');
  return fs.existsSync(nested) ? nested : null;
}

/** Read the built html for a route. Throws if the route was not built. */
export function readBuilt(route) {
  const file = builtPath(route);
  assert.ok(file, `No built html for route "${route}" under .next/server/app (run npm run build first)`);
  return fs.readFileSync(file, 'utf8');
}

/** Every .html file under .next/server/app with its full text. */
export function allBuiltHtml() {
  assert.ok(fs.existsSync(appDir), `Build output missing at ${appDir} (run npm run build first)`);
  const out = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.html')) {
        out.push({ file: path.relative(appDir, full).replaceAll('\\', '/'), text: fs.readFileSync(full, 'utf8') });
      }
    }
  };
  walk(appDir);
  return out;
}

/** Unique root-relative hrefs in the html, with query/hash stripped. */
export function internalLinks(html) {
  const links = new Set();
  for (const m of html.matchAll(/\shref=(?:"([^"]*)"|'([^']*)')/g)) {
    const href = (m[1] ?? m[2]).trim();
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const stripped = href.split(/[?#]/)[0];
    if (stripped) links.add(stripped);
  }
  return [...links];
}

const isIgnoredLink = (href) =>
  href === '/api' || href.startsWith('/api/') || href.startsWith('/_next/') || /\.[a-z0-9]+$/i.test(href);

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Case-insensitive matcher for a banned term: not inside a longer word/number, but a trailing full stop is allowed. */
export function bannedTermRegExp(term) {
  return new RegExp(`(?<![\\w.])${escapeRegExp(term)}(?!\\w|\\.\\w)`, 'i');
}

test('banned-term matcher boundaries', () => {
  const re = bannedTermRegExp('Foo Bar');
  assert.ok(re.test('we met Foo Bar. Then'), 'term followed by full stop and space');
  assert.ok(re.test('"text":"met foo bar."}'), 'term followed by full stop and quote');
  assert.ok(re.test('ends with Foo Bar.'), 'term followed by full stop at end');
  assert.ok(re.test('<b>Foo Bar</b>'), 'term followed by tag');
  assert.ok(!re.test('xFoo Bar'), 'term inside a longer word (prefix)');
  assert.ok(!re.test('Foo Barn'), 'term inside a longer word (suffix)');
  assert.ok(!re.test('Foo Bar.baz'), 'term followed by dot-word');
  const num = bannedTermRegExp('7.25');
  assert.ok(!num.test('rated 17.25 overall'), 'numeric term inside a larger number');
  assert.ok(num.test('rated 7.25 overall'), 'standalone numeric term');
  assert.ok(num.test('rated 7.25.'), 'standalone numeric term before full stop');
});

test('home page builds', () => {
  const html = readBuilt('/');
  assert.match(html, /<html[\s>]/i);
  assert.ok(html.length > 1000, 'home page html suspiciously small');
});

test('banned terms never appear in built output', () => {
  assert.ok(
    fs.existsSync(bannedFile),
    'scripts/banned-terms.local.txt is missing; the privacy scan cannot run. Restore it (one term per line, gitignored).',
  );
  const terms = fs
    .readFileSync(bannedFile, 'utf8')
    .split(/\r?\n/)
    .map((t) => t.trim())
    .filter(Boolean);
  assert.ok(terms.length > 0, 'scripts/banned-terms.local.txt has no terms');
  const patterns = terms.map((term, i) => ({
    index: i + 1,
    re: bannedTermRegExp(term),
  }));
  const files = allBuiltHtml();
  assert.ok(files.length > 0, 'no built html files found; run npm run build first');
  const hits = [];
  for (const { file, text } of files) {
    for (const { index, re } of patterns) {
      if (re.test(text)) hits.push(`${file}: banned term #${index} in banned-terms.local.txt (non-blank entries, 1-based)`);
    }
  }
  assert.deepEqual(hits, [], `Banned terms found in built output:\n${hits.join('\n')}`);
});

test('every internal link resolves to a built route', () => {
  const seen = new Set();
  const queue = ['/'];
  const broken = [];
  while (queue.length) {
    const route = queue.shift();
    if (seen.has(route)) continue;
    seen.add(route);
    const file = builtPath(route);
    if (!file) {
      broken.push(route);
      continue;
    }
    for (const href of internalLinks(fs.readFileSync(file, 'utf8'))) {
      if (!isIgnoredLink(href) && !seen.has(href)) queue.push(href);
    }
  }
  assert.deepEqual(broken, [], `Internal links with no built page: ${broken.join(', ')}`);
  assert.ok(seen.size > 1, 'link crawl found no pages beyond the home page');
});
