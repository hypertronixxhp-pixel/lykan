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

/** Boundary regex for "30%": matches claim contexts but not CSS arbitrary values like left-[30%]. */
const thirtyPercentRegex = /(?<![\[\d.])30%(?![\]\d])/;

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

  function walk(dir, dirName = '') {
    try {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        const rel = dirName ? `${dirName}/${entry.name}` : entry.name;

        // Skip lib/claims.ts
        if (rel === 'lib/claims.ts') continue;

        if (entry.isDirectory()) {
          walk(full, rel);
        } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.js') || entry.name.endsWith('.jsx'))) {
          const content = fs.readFileSync(full, 'utf8');

          if (content.includes('15 weeks')) {
            hits.push(`${rel}: contains "15 weeks"`);
          }
          if (thirtyPercentRegex.test(content)) {
            hits.push(`${rel}: contains "30%" (outside CSS arbitrary values)`);
          }
        }
      }
    } catch (e) {
      // Directory might not exist, that's ok
    }
  }

  for (const dir of dirs) {
    walk(path.join(root, dir), dir);
  }

  assert.deepEqual(hits, [], `Claim numbers found outside lib/claims.ts:\n${hits.join('\n')}`);
});

test('claims module exports the five claim strings', async () => {
  const claimsPath = path.join(root, 'lib', 'claims.ts');
  const claimsUrl = new URL(`file:///${claimsPath.replace(/\\/g, '/')}`).href;
  const { claims } = await import(claimsUrl);

  const expectedKeys = ['timeline', 'cost', 'revenue', 'speed', 'hosting'];
  const actualKeys = Object.keys(claims).sort();
  const expected = expectedKeys.sort();

  assert.deepEqual(actualKeys, expected, `claims keys mismatch`);

  assert.strictEqual(
    claims.timeline,
    'Typical projects ship in about 15 weeks, depending on scope.',
    'timeline claim incorrect'
  );
  assert.strictEqual(
    claims.cost,
    'Around 30% lower cost than traditional agency development.',
    'cost claim incorrect'
  );
  assert.strictEqual(claims.revenue, 'We help clients grow revenue.', 'revenue claim incorrect');
  assert.strictEqual(claims.speed, 'Faster websites and applications.', 'speed claim incorrect');
  assert.strictEqual(claims.hosting, 'Lower hosting and production costs.', 'hosting claim incorrect');

  // Verify all are non-empty strings
  for (const key of expectedKeys) {
    assert.ok(typeof claims[key] === 'string', `${key} is not a string`);
    assert.ok(claims[key].length > 0, `${key} is empty`);
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
    const text = visibleText(extractTag(readBuilt(`/work/${slug}`), 'main'));
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
    const main = extractTag(html, 'main');
    const text = visibleText(main);
    assert.ok(text.includes(p.title), `${p.slug}: missing title`);
    for (const chip of p.highlights) {
      assert.ok(text.includes(chip), `${p.slug}: missing highlight chip "${chip}"`);
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
    const main = extractTag(readBuilt(`/work/${slug}`), 'main');
    const labels = [...main.matchAll(/<dt[^>]*>([\s\S]*?)<\/dt>/g)].map((m) => visibleText(m[1]));
    assert.deepEqual(labels, ['Industry', 'Scope'], `${slug}: unexpected details rows ${labels.join(', ')}`);
  }
});

test('construction case renders no empty headings', () => {
  const main = extractTag(readBuilt('/work/construction-operations'), 'main');
  assert.ok(!/<h[23][^>]*>\s*<\/h[23]>/.test(main), 'empty heading element');
  assert.ok(!/<\/h[23]>\s*<h[1-6][\s>]/.test(main), 'heading immediately followed by another heading');
  assert.ok(!/<\/h[23]>\s*<(\w+)[^>]*>\s*<\/>/.test(main), 'heading followed by an empty element');
  const text = visibleText(main);
  assert.ok(!/undefined|null/.test(text), 'page text contains undefined or null');
  assert.ok(text.includes('Project summary'), 'missing Project summary heading');
  for (const h of ['About the client', 'Challenge', 'Solution', 'Results']) {
    assert.ok(!text.includes(h), `construction case should not show "${h}"`);
  }
});

test('unknown work slug does not build', () => {
  assert.ok(!fs.existsSync(path.join(appDir, 'work', 'nope.html')), 'work/nope.html was built');
  assert.ok(builtPath('/work/property-portal'), 'expected a real case page to be built');
});

test('case cards link to their case pages', () => {
  const main = extractTag(readBuilt('/work'), 'main');
  for (const slug of caseSlugs) {
    const n = main.split(`href="/work/${slug}"`).length - 1;
    assert.equal(n, 1, `/work: expected one link to /work/${slug}, got ${n}`);
  }
});

test('work note wording', () => {
  const text = visibleText(extractTag(readBuilt('/work'), 'main'));
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
    assert.ok(/<h1[\s>]/.test(html), `${slug}: missing h1`);
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

function extractTag(html, tag) {
  const m = html.match(new RegExp(String.raw`<${tag}[\s>][\s\S]*?</${tag}>`));
  assert.ok(m, `home page has no <${tag}>`);
  return m[0];
}

test('header contains links to all nine service pages', () => {
  const header = extractTag(readBuilt('/'), 'header');
  for (const slug of serviceSlugs) {
    assert.ok(header.includes(`href="/services/${slug}"`), `header is missing a link to /services/${slug}`);
  }
  assert.ok(header.includes('href="/services"'), 'header is missing a link to /services');
});

test('footer contains the grouped columns', () => {
  const footer = extractTag(readBuilt('/'), 'footer');
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
  const header = extractTag(readBuilt('/'), 'header');
  const buttons = [...header.matchAll(/<button[^>]*>/g)].map((m) => m[0]);
  const menu = buttons.find((b) => b.includes('aria-expanded="false"') && /aria-controls="[^"]+"/.test(b) && !b.includes('mobile-nav'));
  assert.ok(menu, 'header has no collapsed services menu button with aria-controls');
  const id = menu.match(/aria-controls="([^"]+)"/)[1];
  assert.ok(header.includes(`id="${id}"`), `aria-controls target #${id} does not exist in the header HTML`);
});

test('services index links each group to its detail page and shows the AI-by-team and tech stack sections', () => {
  const html = readBuilt('/services');
  const main = extractTag(html, 'main');
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
  const text = visibleText(extractTag(readBuilt('/services'), 'main'));
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
  const text = visibleText(extractTag(readBuilt('/'), 'main'));
  assert.ok(text.includes(claims.timeline), 'home is missing the timeline claim');
  const costCount = text.split(claims.cost).length - 1;
  assert.ok(costCount >= 2, `expected the cost claim in the hero and the engage card, got ${costCount}`);
  for (const key of ['speed', 'hosting', 'revenue']) {
    assert.ok(text.includes(claims[key]), `home is missing the ${key} claim`);
  }
});

test('home has the four AI cards, three process rows, nine capability links, three case cards, two engagement cards', () => {
  const main = extractTag(readBuilt('/'), 'main');
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
  const text = visibleText(extractTag(readBuilt('/'), 'main')).toLowerCase();
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
    q: visibleText(extractTag(d, 'summary')).replace(/\s*\+$/, ''),
    a: visibleText(extractTag(d, 'p')),
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
  const main = extractTag(readBuilt('/about'), 'main');
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
