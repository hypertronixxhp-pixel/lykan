import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const appDir = path.join(root, '.next', 'server', 'app');
const staticDir = path.join(root, '.next', 'static');
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

/** Boundary regex for "30%": matches claim contexts but not CSS arbitrary values like left-[30%]. */
const thirtyPercentRegex = /(?<![\[\d.])30%(?![\]\d])/;

/** Case-insensitive matcher for a banned term: not inside a longer word/number, but a trailing full stop is allowed. */
export function bannedTermRegExp(term) {
  // A leading letter is only blocked by another word character, so "www.<term>.com" and "sub.<term>.com" are caught.
  // A leading digit/symbol is also blocked by a dot, so a numeric term is not matched inside a longer number.
  // After the term: not a longer word, and not a dot-word ("term.baz") unless the dot-word is a common top-level domain ("term.com").
  const after = '(?!\\w|\\.(?!(?:com|net|org|io|co|ai|app|dev|info|biz)\\b)\\w)';
  const before = /^[a-z]/i.test(term) ? '(?<!\\w)' : '(?<![\\w.])';
  return new RegExp(`${before}${escapeRegExp(term)}${after}`, 'i');
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
  // Neutral fake term for the host-name cases: a leading letter must be caught after a dot (www.x / sub.x).
  const host = bannedTermRegExp('foo-bar');
  assert.ok(host.test('visit www.foo-bar.com today'), 'term inside www.<term>.com');
  assert.ok(host.test('"url":"https://sub.foo-bar.com/x"'), 'term inside a subdomain host name');
  assert.ok(host.test('visit foo-bar.com today'), 'term as the bare host name');
  assert.ok(!host.test('foo-barn'), 'term inside a longer word (suffix)');
  assert.ok(!host.test('afoo-bar'), 'term inside a longer word (prefix)');
  assert.ok(!host.test('foo-bar.baz'), 'term followed by a non-TLD dot-word');
  assert.ok(!host.test('foo-bar.company'), 'term followed by a dot-word that merely starts like a TLD');
});

test('home page builds', () => {
  const html = readBuilt('/');
  assert.match(html, /<html[\s>]/i);
  assert.ok(html.length > 1000, 'home page html suspiciously small');
});

/** Next.js ships a fixed crawler user-agent regex literal in its own runtime chunk; it is framework text, not site copy, and can collide with common words. */
function stripFrameworkNoise(text) {
  return text.replace(/\/\[\\w-\]\+-Google\|[^/]*?googleweblight\/i/g, '');
}

/** Every .js file under .next/static (client chunks), with its full text. */
export function allClientChunks() {
  assert.ok(fs.existsSync(staticDir), `Build output missing at ${staticDir} (run npm run build first)`);
  const out = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.js')) {
        out.push({ file: `.next/static/${path.relative(staticDir, full).replaceAll('\\', '/')}`, text: stripFrameworkNoise(fs.readFileSync(full, 'utf8')) });
      }
    }
  };
  walk(staticDir);
  return out;
}

/** Every tracked text file (git ls-files), skipping the lockfile and anything binary. */
export function trackedTextFiles() {
  const listed = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
  const out = [];
  for (const rel of listed) {
    if (rel === 'package-lock.json') continue;
    const full = path.join(root, rel);
    if (!fs.existsSync(full)) continue; // deleted in the working tree but not yet committed
    const buf = fs.readFileSync(full);
    if (buf.includes(0)) continue; // binary
    out.push({ file: rel, text: buf.toString('utf8') });
  }
  return out;
}

test('banned terms never appear in built output, client chunks or tracked files', () => {
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
  const sets = {
    'built html (.next/server/app)': allBuiltHtml(),
    'client chunks (.next/static)': allClientChunks(),
    'tracked files (git ls-files)': trackedTextFiles(),
  };
  for (const [name, files] of Object.entries(sets)) {
    assert.ok(files.length > 0, `the privacy scan found no files in ${name}; run npm run build first / check git`);
  }
  const hits = [];
  for (const [name, files] of Object.entries(sets)) {
    for (const { file, text } of files) {
      for (const { index, re } of patterns) {
        if (re.test(text)) hits.push(`${file}: banned term #${index} in banned-terms.local.txt (non-blank entries, 1-based) [${name}]`);
      }
    }
  }
  assert.deepEqual(hits, [], `Banned terms found:\n${hits.join('\n')}`);
});

test('30% boundary regex matches claim context but not CSS arbitrary values', () => {
  // Should match: claim contexts
  assert.ok(thirtyPercentRegex.test('save 30% today'), 'matches "save 30% today"');
  assert.ok(thirtyPercentRegex.test('up to 30% faster'), 'matches "up to 30% faster"');
  assert.ok(thirtyPercentRegex.test('30%.'), 'matches "30%." with trailing period');
  // Should NOT match: CSS arbitrary values and numeric contexts
  assert.ok(!thirtyPercentRegex.test('left-[30%]'), 'does not match CSS arbitrary value "left-[30%]"');
  assert.ok(!thirtyPercentRegex.test('w-[130%]'), 'does not match larger percentage "w-[130%]"');
  assert.ok(!thirtyPercentRegex.test('130%'), 'does not match digit-prefixed "130%"');
  assert.ok(!thirtyPercentRegex.test('30.5%'), 'does not match decimal "30.5%"');
});

test('claim numbers exist only in lib/claims.ts', () => {
  // Check for "15 weeks" as literal substring and "30%" with boundary regex
  // (regex prevents false positives from CSS values like left-[30%])
  const dirs = ['app', 'components', 'lib'];
  const hits = [];
  let scanned = 0;

  function walk(dir, dirName = '') {
    assert.ok(fs.existsSync(dir), `expected source directory "${dirName}" to exist`);
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      const rel = dirName ? `${dirName}/${entry.name}` : entry.name;

      // Skip lib/claims.ts
      if (rel === 'lib/claims.ts') continue;

      if (entry.isDirectory()) {
        walk(full, rel);
      } else if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(entry.name)) {
        scanned++;
        const content = fs.readFileSync(full, 'utf8');
        if (content.includes('15 weeks')) hits.push(`${rel}: contains "15 weeks"`);
        if (thirtyPercentRegex.test(content)) hits.push(`${rel}: contains "30%" (outside CSS arbitrary values)`);
      }
    }
  }

  for (const dir of dirs) {
    walk(path.join(root, dir), dir);
  }

  assert.ok(scanned > 0, 'claim-number scan read no source files');
  assert.deepEqual(hits, [], `Claim numbers found outside lib/claims.ts:\n${hits.join('\n')}`);
});

test('claims module exports the five claim strings', async () => {
  const claimsPath = path.join(root, 'lib', 'claims.ts');
  const claimsUrl = new URL(`file:///${claimsPath.replace(/\\/g, '/')}`).href;
  const { claims } = await import(claimsUrl);

  // The wording is owned by lib/claims.ts and may change; the contract is the five keys, each a string.
  const expectedKeys = ['cost', 'hosting', 'revenue', 'speed', 'timeline'];
  assert.deepEqual(Object.keys(claims).sort(), expectedKeys, 'claims keys mismatch');
  for (const key of expectedKeys) {
    assert.ok(typeof claims[key] === 'string', `${key} is not a string`);
    assert.ok(claims[key].trim().length > 0, `${key} is empty`);
  }
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

test('contact page lists 9 service options', () => {
  const html = readBuilt('/contact');
  const select = html.match(/<select[^>]*id="topic"[^>]*>([\s\S]*?)<\/select>/);
  assert.ok(select, 'topic select not found on /contact');
  const values = [...select[1].matchAll(/<option[^>]*value="([^"]*)"/g)].map((m) => m[1]);
  const services = values.filter((v) => v !== '' && v !== 'Something else');
  assert.equal(services.length, 9, `expected 9 service options, got ${services.length}: ${services.join(', ')}`);
  assert.ok(values.includes('Something else'), 'missing "Something else" option');
  assert.ok(html.includes('Not sure yet'), 'missing "Not sure yet" option');
});

test('service detail pages list the new SEO, speed and hosting items', () => {
  // The /services index shows only the first six items per group and links to the detail pages, which carry the full lists.
  const html = serviceSlugs.map((slug) => readBuilt(`/services/${slug}`)).join('\n');
  const expected = [
    'SEO optimization (technical SEO, content structure, search visibility)',
    'Website speed and Core Web Vitals',
    'Hosting and production cost reduction',
    'Conversion and revenue growth support',
    'Right-sizing infrastructure to cut hosting and production costs',
  ];
  for (const text of expected) {
    assert.ok(html.includes(text), `service detail pages are missing "${text}"`);
  }
  assert.ok(!html.includes('Infrastructure cost review'), 'service detail pages still list "Infrastructure cost review"');
});

/** Visible text of an html fragment: comments and tags stripped, basic entities decoded, whitespace collapsed. */
function visibleText(fragment) {
  return fragment
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Visible text of each <article> on a built page. */
function articleTexts(html) {
  return [...html.matchAll(/<article[^>]*>([\s\S]*?)<\/article>/g)].map((m) => visibleText(m[1]));
}

test('case cards and case pages are qualitative', async () => {
  const { projects } = await import('../lib/work.ts');
  const cards = articleTexts(readBuilt('/work'));
  assert.equal(cards.length, 6, `expected 6 case cards on /work, got ${cards.length}`);
  for (const text of cards) {
    assert.ok(!/\d/.test(text), `case card contains a digit: "${text}"`);
  }
  for (const { slug } of projects) {
    const text = visibleText(builtTag(`/work/${slug}`, 'main'));
    assert.ok(!/\d/.test(text), `/work/${slug} main text contains a digit`);
  }
});

const caseSlugs = [
  'property-portal',
  'holiday-rental-booking',
  'rental-marketplace',
  'investment-platform',
  'design-studio-portfolio',
  'construction-operations',
];

test('all six case pages render', async () => {
  const { projects } = await import('../lib/work.ts');
  assert.deepEqual(projects.map((p) => p.slug), caseSlugs);
  for (const p of projects) {
    const html = readBuilt(`/work/${p.slug}`);
    const h1s = [...html.matchAll(/<h1[\s>]/g)].length;
    assert.equal(h1s, 1, `${p.slug}: expected exactly one h1, got ${h1s}`);
    const main = extractTag(html, 'main', `route "/work/${p.slug}"`);
    const text = visibleText(main);
    assert.ok(text.includes(p.title), `${p.slug}: missing title`);
    for (const chip of p.highlights) {
      assert.ok(text.includes(chip), `${p.slug}: missing highlight chip "${chip}"`);
    }
    const chipList = main.match(/<ul[^>]*aria-label="Highlights"[^>]*>([\s\S]*?)<\/ul>/);
    if (p.slug === 'construction-operations') {
      assert.equal(p.highlights.length, 0, 'construction case must not invent highlight chips');
      assert.ok(!chipList, 'construction case renders an empty or invented highlights list');
    } else {
      assert.equal(p.highlights.length, 3, `${p.slug}: expected three highlight chips`);
      assert.ok(chipList, `${p.slug}: highlights list not rendered`);
      assert.equal((chipList[1].match(/<li[\s>]/g) ?? []).length, 3, `${p.slug}: expected three chips rendered`);
      for (const chip of p.highlights) assert.ok(!/\d/.test(chip), `${p.slug}: chip "${chip}" contains a digit`);
    }
    const dl = main.match(/<dl[\s>][\s\S]*?<\/dl>/);
    assert.ok(dl, `${p.slug}: no <dl> details panel`);
    const dlText = visibleText(dl[0]);
    assert.ok(dlText.includes('Industry') && dlText.includes(p.industry), `${p.slug}: details panel missing Industry`);
    assert.ok(dlText.includes('Scope'), `${p.slug}: details panel missing Scope`);
    for (const s of p.scope) assert.ok(dlText.includes(s), `${p.slug}: details panel missing scope "${s}"`);
  }
});

test('case pages carry no client, year, duration or link rows', () => {
  for (const slug of caseSlugs) {
    const main = builtTag(`/work/${slug}`, 'main');
    const labels = [...main.matchAll(/<dt[^>]*>([\s\S]*?)<\/dt>/g)].map((m) => visibleText(m[1]));
    assert.deepEqual(labels, ['Industry', 'Scope'], `${slug}: unexpected details rows ${labels.join(', ')}`);
  }
});

test('construction case renders no empty headings', () => {
  const main = builtTag('/work/construction-operations', 'main');
  assert.ok(!/<h[23][^>]*>\s*<\/h[23]>/.test(main), 'empty heading element');
  assert.ok(!/<\/h[23]>\s*<h[1-6][\s>]/.test(main), 'heading immediately followed by another heading');
  assert.ok(!/<\/h[23]>\s*<(\w+)[^>]*>\s*<\/\1>/.test(main), 'heading followed by an empty element');
  const text = visibleText(main);
  assert.ok(!/undefined|null/.test(text), 'page text contains undefined or null');
  assert.ok(text.includes('Project summary'), 'missing Project summary heading');
  assert.ok(
    text.includes('Internal tools and workflow automation for a construction business.'),
    'construction summary should be derived from its scope only',
  );
  for (const h of ['About the client', 'Challenge', 'Solution', 'Results']) {
    assert.ok(!text.includes(h), `construction case should not show "${h}"`);
  }
});

/** The dynamic-route entry for a pattern such as "/work/[slug]" in .next/prerender-manifest.json. */
function dynamicRouteEntry(pattern) {
  const manifestPath = path.join(root, '.next', 'prerender-manifest.json');
  assert.ok(fs.existsSync(manifestPath), 'prerender manifest missing (run npm run build first)');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const entry = manifest.dynamicRoutes?.[pattern];
  assert.ok(entry, `prerender manifest has no dynamic route "${pattern}"`);
  return entry;
}

test('unknown work slug does not build', () => {
  assert.ok(!fs.existsSync(path.join(appDir, 'work', 'nope.html')), 'work/nope.html was built');
  assert.ok(builtPath('/work/property-portal'), 'expected a real case page to be built');
  assert.equal(dynamicRouteEntry('/work/[slug]').fallback, false, '/work/[slug] must not fall back for unknown slugs');
});

test('case cards link to their case pages', () => {
  const main = builtTag('/work', 'main');
  for (const slug of caseSlugs) {
    const n = main.split(`href="/work/${slug}"`).length - 1;
    assert.equal(n, 1, `/work: expected one link to /work/${slug}, got ${n}`);
  }
});

test('work note wording', () => {
  const text = visibleText(builtTag('/work', 'main'));
  assert.ok(text.includes('Client names, locations, and figures are withheld by agreement.'), '/work is missing the work note');
  assert.ok(!text.includes('results are withheld'), '/work still says results are withheld');
});

test('work page shows the six case titles and scope pills', () => {
  const html = readBuilt('/work');
  const titles = [
    'Property portal',
    'Holiday-rental booking platform',
    'Rental marketplace with back office',
    'Investment platform flagship',
    'Design studio portfolio',
    'Construction operations software',
  ];
  for (const title of titles) {
    assert.ok(html.includes(title), `/work is missing case title "${title}"`);
  }
  for (const pill of ['Branding', 'Web design', 'ERP', 'System integration', 'Workflow automation', 'Internal tools']) {
    assert.ok(html.includes(`>${pill}</li>`), `/work is missing scope pill "${pill}"`);
  }
});

test('home page still renders work preview and tech stack', () => {
  const html = readBuilt('/');
  assert.ok(html.includes('Projects we have delivered'), 'home is missing the work preview heading');
  assert.ok(html.includes('Tech stack'), 'home is missing the tech stack heading');
});

test('work page still renders six case cards after the move', () => {
  const cards = articleTexts(readBuilt('/work'));
  assert.equal(cards.length, 6, `expected 6 case cards on /work, got ${cards.length}`);
});

const serviceSlugs = [
  'strategy-discovery',
  'design',
  'build',
  'optimize',
  'cloud',
  'ai-automation',
  'business-systems',
  'security',
  'quality-support',
];

test('all nine service pages render with 4 standOut points, 3 FAQs and the figure caption', () => {
  serviceSlugs.forEach((slug, i) => {
    const html = readBuilt(`/services/${slug}`);
    const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
    assert.equal(h1s, 1, `${slug}: expected exactly one h1, got ${h1s}`);
    const section = html.match(/<section[^>]*>(?:(?!<\/section>)[\s\S])*?What makes our(?:(?!<\/section>)[\s\S])*<\/section>/);
    assert.ok(section, `${slug}: missing stand-out section`);
    const cards = (section[0].match(/<article[\s>]/g) ?? []).length;
    assert.equal(cards, 4, `${slug}: expected 4 stand-out cards, got ${cards}`);
    const faqs = (html.match(/<details[\s>]/g) ?? []).length;
    assert.equal(faqs, 3, `${slug}: expected 3 FAQs, got ${faqs}`);
    const caption = `FIG. 0${i + 1}`;
    assert.ok(visibleText(html).includes(caption), `${slug}: missing figure caption "${caption}"`);
  });
});

test('unknown service slug does not build', () => {
  assert.ok(!fs.existsSync(path.join(appDir, 'services', 'nope.html')), 'services/nope.html was built');
  assert.ok(builtPath('/services/design'), 'expected at least one real service page to be built');
  assert.equal(dynamicRouteEntry('/services/[slug]').fallback, false, '/services/[slug] must not fall back for unknown slugs');
});

test('stand-out heading is a single text node', () => {
  const html = readBuilt('/services/design');
  assert.ok(!html.includes('What makes our <!-- -->'), 'stand-out heading still has split text nodes');
  assert.ok(visibleText(html).includes('What makes our Design service stand out'));
  assert.ok(visibleText(html).includes('Questions about Design'));
  assert.ok(visibleText(readBuilt('/services/quality-support')).includes('What makes our Quality & support service stand out'));
  for (const slug of serviceSlugs) {
    assert.ok(!readBuilt(`/services/${slug}`).includes('<!-- -->'), `${slug}: page has split text nodes`);
  }
});

test('optimize page shows the speed claim and SEO item', async () => {
  const { claims } = await import('../lib/claims.ts');
  const text = visibleText(readBuilt('/services/optimize'));
  assert.ok(text.includes(claims.speed), 'optimize page is missing the speed claim');
  assert.ok(
    text.includes('SEO optimization (technical SEO, content structure, search visibility)'),
    'optimize page is missing the SEO item',
  );
});

test('cloud page shows the hosting claim', async () => {
  const { claims } = await import('../lib/claims.ts');
  assert.ok(visibleText(readBuilt('/services/cloud')).includes(claims.hosting), 'cloud page is missing the hosting claim');
});

test('business-systems page shows the revenue claim', async () => {
  const { claims } = await import('../lib/claims.ts');
  assert.ok(
    visibleText(readBuilt('/services/business-systems')).includes(claims.revenue),
    'business-systems page is missing the revenue claim',
  );
});

function extractTag(html, tag, where = 'the page') {
  const m = html.match(new RegExp(String.raw`<${tag}[\s>][\s\S]*?</${tag}>`));
  assert.ok(m, `${where} has no <${tag}>`);
  return m[0];
}

/** Extract a tag from a built route; failures name the route. */
function builtTag(route, tag) {
  return extractTag(readBuilt(route), tag, `route "${route}"`);
}

test('header contains links to all nine service pages', () => {
  const header = builtTag('/', 'header');
  for (const slug of serviceSlugs) {
    assert.ok(header.includes(`href="/services/${slug}"`), `header is missing a link to /services/${slug}`);
  }
  assert.ok(header.includes('href="/services"'), 'header is missing a link to /services');
});

test('footer contains the grouped columns', () => {
  const footer = builtTag('/', 'footer');
  for (const slug of serviceSlugs) {
    assert.ok(footer.includes(`href="/services/${slug}"`), `footer is missing a link to /services/${slug}`);
  }
  for (const slug of ['logistics-control-platform', 'procurement-intelligence-workspace', 'media-operations-hub']) {
    assert.ok(footer.includes(`href="/solutions/${slug}"`), `footer is missing a link to /solutions/${slug}`);
  }
  for (const href of ['/about', '/work', '/contact']) {
    assert.ok(footer.includes(`href="${href}"`), `footer is missing a link to ${href}`);
  }
  const text = visibleText(footer);
  for (const heading of ['Company', 'Services', 'Solutions', 'Connect']) {
    assert.ok(text.includes(heading), `footer is missing the "${heading}" heading`);
  }
});

test('services menu button is wired for accessibility', () => {
  const header = builtTag('/', 'header');
  const buttons = [...header.matchAll(/<button[^>]*>/g)].map((m) => m[0]);
  const menu = buttons.find((b) => b.includes('aria-expanded="false"') && /aria-controls="[^"]+"/.test(b) && !b.includes('mobile-nav'));
  assert.ok(menu, 'header has no collapsed services menu button with aria-controls');
  const id = menu.match(/aria-controls="([^"]+)"/)[1];
  assert.ok(header.includes(`id="${id}"`), `aria-controls target #${id} does not exist in the header HTML`);
});

test('services index links each group to its detail page and shows the AI-by-team and tech stack sections', () => {
  const html = readBuilt('/services');
  const main = extractTag(html, 'main', 'route "/services"');
  serviceSlugs.forEach((slug, i) => {
    const count = main.split(`href="/services/${slug}"`).length - 1;
    assert.equal(count, 1, `expected exactly one link to /services/${slug} inside <main>, got ${count}`);
    const anchor = main.match(new RegExp(String.raw`<a[^>]*href="/services/${slug}"[^>]*>([\s\S]*?)</a>`));
    assert.ok(anchor, `no anchor element for /services/${slug} inside <main>`);
    const text = visibleText(anchor[1]);
    const figure = String(i + 1).padStart(2, '0');
    assert.ok(text.startsWith(figure), `row for ${slug} should lead with figure number ${figure}, got "${text.slice(0, 20)}"`);
    assert.ok(text.includes('Explore'), `row for ${slug} is missing the Explore affordance`);
  });
  const text = visibleText(main);
  for (const heading of ['Everything we do', 'AI for every team', 'Automation tailored to how each team works', 'Tech stack', 'Ways to start']) {
    assert.ok(text.includes(heading), `services index is missing "${heading}"`);
  }
});

test('services index shows the SEO, speed, hosting and revenue-growth items', () => {
  const text = visibleText(builtTag('/services', 'main'));
  const expected = [
    'SEO optimization (technical SEO, content structure, search visibility)',
    'Website speed and Core Web Vitals',
    'Hosting and production cost reduction',
    'Right-sizing infrastructure to cut hosting and production costs',
    'Conversion and revenue growth support',
  ];
  for (const item of expected) {
    assert.ok(text.includes(item), `services index is missing "${item}"`);
  }
  assert.ok(!text.includes('Infrastructure cost review'), 'services index still lists "Infrastructure cost review"');
});

test('home shows the claims', async () => {
  const { claims } = await import('../lib/claims.ts');
  const text = visibleText(builtTag('/', 'main'));
  assert.ok(text.includes(claims.timeline), 'home is missing the timeline claim');
  const costCount = text.split(claims.cost).length - 1;
  assert.ok(costCount >= 2, `expected the cost claim in the hero and the engage card, got ${costCount}`);
  for (const key of ['speed', 'hosting', 'revenue']) {
    assert.ok(text.includes(claims[key]), `home is missing the ${key} claim`);
  }
});

test('home has the four AI cards, three process rows, nine capability links, three case cards, two engagement cards', () => {
  const main = builtTag('/', 'main');
  const text = visibleText(main);
  for (const t of [
    'Handle customer questions',
    'Take repetitive work off the team',
    'See what is happening',
    'Produce content and data at scale',
    'Start with the problem',
    'One team from design to deployment',
    'Automate the repetitive parts',
    'Established teams',
    'New products',
  ]) {
    assert.ok(text.includes(t), `home is missing "${t}"`);
  }
  assert.ok(text.includes('Talk through your workflows'), 'home is missing the AI CTA');
  assert.ok(main.includes('href="/contact"'), 'home is missing a link to /contact');
  for (const slug of serviceSlugs) {
    const n = main.split(`href="/services/${slug}"`).length - 1;
    assert.equal(n, 1, `home: expected one link to /services/${slug} inside <main>, got ${n}`);
  }
  const cases = main.split('href="/work/').length - 1;
  assert.equal(cases, 3, `home: expected 3 case links, got ${cases}`);
  const aiCards = [...main.matchAll(/<article[^>]*data-ai-card[^>]*>([\s\S]*?)<\/article>/g)];
  assert.equal(aiCards.length, 4, `home: expected 4 AI cards, got ${aiCards.length}`);
  for (const [, body] of aiCards) {
    assert.ok(/e\.g\./i.test(visibleText(body)), 'an AI card is missing its "e.g." line');
    assert.ok(!/\d|%/.test(visibleText(body)), 'an AI card contains a figure');
  }
  const rows = [...main.matchAll(/<li[^>]*data-process-row[^>]*>([\s\S]*?)<\/li>/g)];
  assert.equal(rows.length, 3, `home: expected 3 process rows, got ${rows.length}`);
});

test('home contains no testimonial or stats section', () => {
  const text = visibleText(builtTag('/', 'main')).toLowerCase();
  for (const word of ['testimonial', 'launches', 'years of']) {
    assert.ok(!text.includes(word), `home contains "${word}"`);
  }
});

test('home hero shows the pill and sub-line', async () => {
  const { claims } = await import('../lib/claims.ts');
  const html = readBuilt('/');
  const hero = html.match(/<section[^>]*>(?:(?!<\/section>)[\s\S])*?<h1[\s>](?:(?!<\/section>)[\s\S])*<\/section>/);
  assert.ok(hero, 'home hero section not found');
  const text = visibleText(hero[0]);
  assert.ok(text.includes('Private engineering partner'), 'hero is missing the pill');
  assert.ok(text.includes(claims.cost), 'hero is missing the cost sub-line');
  assert.ok(text.includes(claims.timeline), 'hero is missing the timeline sub-line');
});

const contactFaqQuestions = [
  'How do you estimate a project?',
  'Do you work with early-stage products?',
  'How long does a project usually take?',
  'What does it cost, and is there a minimum?',
  'Can you take on one part, or work with our in-house team?',
];

function contactFaqs() {
  const html = readBuilt('/contact');
  const details = [...html.matchAll(/<details[\s>][\s\S]*?<\/details>/g)].map((m) => m[0]);
  return details.map((d) => ({
    q: visibleText(extractTag(d, 'summary', 'a /contact FAQ')).replace(/\s*\+$/, ''),
    a: visibleText(extractTag(d, 'p', 'a /contact FAQ')),
  }));
}

test('contact shows five FAQs using the claims', async () => {
  const { claims } = await import('../lib/claims.ts');
  const faqs = contactFaqs();
  assert.equal(faqs.length, 5, `expected 5 FAQs on /contact, got ${faqs.length}`);
  const long = faqs.find((f) => f.q.startsWith('How long'));
  assert.ok(long?.a.includes(claims.timeline), 'timeline answer is missing the timeline claim');
  const cost = faqs.find((f) => f.q.startsWith('What does it cost'));
  assert.ok(cost?.a.includes(claims.cost), 'cost answer is missing the cost claim');
  const rest = faqs.map((f) => f.a).join(' ').replace(claims.timeline, '').replace(claims.cost, '');
  assert.ok(!/\d/.test(rest), `FAQ answers contain digits outside the claims: ${rest.match(/\S*\d\S*/g)}`);
});

test('contact FAQ questions are exactly the five approved', () => {
  assert.deepEqual(contactFaqs().map((f) => f.q), contactFaqQuestions);
});

test('about has the principle rows and no team or stats section', async () => {
  const { claims } = await import('../lib/claims.ts');
  const main = builtTag('/about', 'main');
  const text = visibleText(main);
  for (const title of ['Your information stays yours', 'Plain, maintainable engineering', 'Honest about scope']) {
    assert.ok(text.includes(title), `about is missing principle "${title}"`);
  }
  assert.ok(text.includes(claims.timeline), 'about is missing the timeline claim');
  const headings = [...main.matchAll(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/g)].map((m) => visibleText(m[1]));
  // The shared closing CTA heading ("...what your team needs to build.") legitimately says "team".
  const teamHeadings = headings.filter((h) => /team/i.test(h) && !h.startsWith('Tell us what your team needs'));
  assert.deepEqual(teamHeadings, [], 'about has a team heading');
  for (const phrase of ['years of', 'clients served', 'projects delivered']) {
    assert.ok(!text.toLowerCase().includes(phrase), `about contains "${phrase}"`);
  }
});

/** Anchors whose own markup contains another anchor, and articles inside an anchor that contain an anchor. Returns descriptions. */
export function nestedAnchorProblems(html) {
  const problems = [];
  for (const m of html.matchAll(/<a[\s>][\s\S]*?<\/a>/g)) {
    const inner = m[0].slice(m[0].indexOf('>') + 1, -4);
    if (/<a[\s>]/.test(inner)) problems.push(`anchor containing another anchor: ${visibleText(m[0]).slice(0, 60)}`);
    for (const art of inner.matchAll(/<article[^>]*>([\s\S]*?)<\/article>/g)) {
      if (/<a[\s>]/.test(art[1])) problems.push(`link-wrapped article containing an anchor: ${visibleText(art[1]).slice(0, 60)}`);
    }
  }
  return problems;
}

test('nested-anchor detector self-test', () => {
  assert.deepEqual(nestedAnchorProblems('<a href="/x"><article><h3>T</h3></article></a>'), []);
  assert.equal(nestedAnchorProblems('<a href="/x">one <a href="/y">two</a></a>').length, 1, 'plain nested anchor');
  assert.equal(nestedAnchorProblems('<a href="/x"><article><a href="/y">in</a></article></a>').length >= 1, true, 'anchor inside a link-wrapped article');
  assert.deepEqual(nestedAnchorProblems('<a href="/x"><aside>not an anchor</aside></a>'), [], '<aside> is not an anchor');
});

test('no nested anchors on the main pages', () => {
  for (const route of ['/', '/work', '/services', '/services/design', '/work/property-portal']) {
    assert.deepEqual(nestedAnchorProblems(readBuilt(route)), [], `${route}: nested anchors`);
  }
});

test('services index arrow motion respects reduced motion', () => {
  const html = readBuilt('/services');
  const classes = [...html.matchAll(/class="([^"]*)"/g)].flatMap((m) => m[1].split(/\s+/));
  assert.ok(!classes.includes('group-hover:translate-x-1'), 'arrow translate is not wrapped in motion-safe:');
  assert.ok(classes.includes('motion-safe:group-hover:translate-x-1'), 'services index arrow is missing motion-safe:group-hover:translate-x-1');
});

test('copy stays qualified: no absolute or unconditional wording', () => {
  const banned = [
    'No honest team can',
    'cannot open every door',
    'so it stays fixed',
    'no surprises later',
    'removes guesswork',
    'from the first day',
    'nothing is lost between',
    'without disrupting the work',
    'Yes to both',
    'agreed up front',
    'usually come first',
    'both are closed before anyone outside',
  ];
  for (const { file, text } of allBuiltHtml()) {
    const visible = visibleText(text);
    for (const phrase of banned) {
      assert.ok(!visible.includes(phrase), `${file}: contains unqualified wording "${phrase}"`);
    }
  }
  for (const f of contactFaqs()) {
    assert.ok(!/^Yes\./.test(f.a), `FAQ "${f.q}" opens with an unconditional "Yes."`);
  }
});

test('about leads the timeline claim in', async () => {
  const { claims } = await import('../lib/claims.ts');
  const text = visibleText(builtTag('/about', 'main'));
  assert.ok(text.includes(`How long projects take: ${claims.timeline}`), 'about timeline line is missing its lead-in');
});

test('optimize page uses the speed and hosting claims', async () => {
  const { claims } = await import('../lib/claims.ts');
  const text = visibleText(readBuilt('/services/optimize'));
  assert.ok(text.includes(claims.speed), 'optimize page is missing the speed claim');
  assert.ok(text.includes(claims.hosting), 'optimize page is missing the hosting claim');
});
