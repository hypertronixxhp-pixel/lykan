# Section-parity redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the Lykan site so its pages and sections mirror the partner's public site (home, services + 9 detail pages, work + 6 anonymous case studies, about, contact FAQ) in Lykan's own theme, with no partner or client details and with the owner's claims held in one file.

**Architecture:** Content lives in typed data files (`lib/services.ts`, `lib/work.ts`, `lib/claims.ts`); small server components render it; two dynamic routes (`/services/[slug]`, `/work/[slug]`) use `generateStaticParams` with `dynamicParams = false`, matching the existing solutions route. Tests are `node:test` files that read the **built** HTML in `.next/server/app`, so every task is verified by `npm run build && npm test`.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind 4, TypeScript, zod, `node:test`.

**Spec:** `docs/superpowers/specs/2026-10-06-section-parity-redesign-design.md`

## Global Constraints

- Keep the theme: ink `#0B1220`, stone `#F5F7FA`, teal `#38C6C3`, steel `#658CB8` (tokens in `app/globals.css`). No lime, no partner palette.
- Nothing from the partner's site may be copied: no copy, illustration, logo, screenshot, tagline, name, place, third-party product name, quote, or figure. Original SVG and Lykan wording only.
- Anonymization removes: company/founder/subsidiary/developer names; taglines; cities, countries, regions, destinations; third-party product and channel names; every count, rating, score, percentage, duration, year, language count; URLs. Use qualitative words ("multilingual", "several destinations", "multiple verticals").
- The only numbers allowed in marketing copy are the owner's, and only via `lib/claims.ts`: timeline "about 15 weeks", cost "around 30% lower cost than traditional agency development". No other source file may contain "15 weeks" or "30%".
- No per-project figures on case studies. No testimonials, team bios, stats, client logos, free-offer CTAs.
- Solutions pages, their three demos, and the Approach page stay unchanged.
- Service slugs: `strategy-discovery`, `design`, `build`, `optimize`, `cloud`, `ai-automation`, `business-systems`, `security`, `quality-support`. Case slugs: `property-portal`, `holiday-rental-booking`, `rental-marketplace`, `investment-platform`, `design-studio-portfolio`, `construction-operations`.
- `dynamicParams = false` on both new dynamic routes; every page exports metadata title and description.
- Accessibility: FAQ uses native `<details>`; Services menu is keyboard operable (`aria-expanded`, Escape closes); no horizontal overflow at 375 px.

## Review Focus

Failure modes the spec implies but no feature task exercises. Each has a test in the owning task.

1. An unknown `/services/x` or `/work/x` must 404, not render an empty template (Tasks 7, 9).
2. A case with missing sections (construction) must not render empty headings, "undefined", or an empty tab (Task 9).
3. Partner details leaking through metadata, `<title>`, or the RSC payload, not just visible text (Task 1 scans every built HTML file in full).
4. Claim numbers hard-coded outside `lib/claims.ts`, or the claims missing from pages that must show them (Tasks 2, 10, 11).
5. The Services menu trapping keyboard users, or mobile overflow on the new templates (Tasks 6, 12).

## File Structure

| File | Responsibility |
|---|---|
| `scripts/site.test.mjs` | All build-output tests (routes, links, privacy, claims) |
| `scripts/banned-terms.local.txt` | Gitignored list of terms that must never ship |
| `lib/claims.ts` | Owner claims, the only place the numbers exist |
| `lib/services.ts` | Service groups: slug, items, standOut, inPractice, faqs, figure |
| `lib/work.ts` | Case studies: slug, scope, highlights, sections, relatedServices |
| `components/Faq.tsx` | `<details>` accordion |
| `components/ServiceFigure.tsx` | "FIG. 0N" caption + original SVG motif |
| `components/CaseCards.tsx` | `ProjectCard`, `CaseGrid` (moved from sections.tsx) |
| `components/ServiceBlocks.tsx` | `StandOutGrid`, `ExploreServices`, `RecentWork` |
| `components/ServicesMenu.tsx` | Header dropdown (client component) |
| `app/services/[slug]/page.tsx`, `app/work/[slug]/page.tsx` | New templates |
| `app/page.tsx`, `app/services/page.tsx`, `app/work/page.tsx`, `app/about/page.tsx`, `app/contact/page.tsx` | Restructured pages |
| `components/Header.tsx`, `components/Footer.tsx`, `lib/nav.ts` | Navigation and footer groups |

---

### Task 1: Test harness and privacy scan

**Files:**
- Create: `scripts/site.test.mjs`, `scripts/banned-terms.local.txt`
- Modify: `package.json` (add `"test": "node --test scripts/"`), `.gitignore` (add `scripts/banned-terms.local.txt`)

**Interfaces:**
- Produces: `readBuilt(route: string): string` (reads `.next/server/app/<index|route>.html`), `allBuiltHtml(): {file:string, text:string}[]` (every `.html` under `.next/server/app`), `internalLinks(html: string): string[]` (unique root-relative hrefs, query/hash stripped). Later tasks append tests to this file using them.

- [ ] **Step 1:** Write `scripts/banned-terms.local.txt`, one term per line, case-insensitive, covering every name, place, third-party product, tagline and figure in the spec's anonymization rules that appeared in the partner's pages: the partner and its six clients' names; both founders' and the testimonial givers' names; the cities, countries, regions and destinations; the developers, channel and PMS product names; the quoted taglines; and the figures `110+`, `100k+`, `4.95`, `12 weeks`, `40%`, `3x`, `six languages`. Add the file to `.gitignore`.
- [ ] **Step 2:** In `scripts/site.test.mjs` write tests: `banned terms never appear in built output` (for each file from `allBuiltHtml()`, no term matches, using `(?<![\w.])term(?![\w.])`; the test **fails** with a clear message if the banned file is missing); `every internal link resolves to a built route` (crawl from `/`, each href maps to an existing built file or a known API route); `home page builds`.
- [ ] **Step 3:** Run `npm run build && npm test`. Expected: the privacy and link tests PASS on the current site (baseline), proving the harness works. Print the list of built files once to confirm the `readBuilt` path mapping (dynamic pages live at `.next/server/app/solutions/<slug>.html`); fix the helper if not.
- [ ] **Step 4:** Prove the scan can fail: temporarily add a banned term to `app/about/page.tsx`, rebuild, confirm FAIL, then remove it and confirm PASS.
- [ ] **Step 5:** Checkpoint: if the folder is a git repo, `git add -A && git commit -m "test: build-output harness and privacy scan"`; if not, ask the owner whether to `git init` (the plan assumes commits are optional).

### Task 2: Claims module

**Files:**
- Create: `lib/claims.ts`
- Modify: `scripts/site.test.mjs`

**Interfaces:**
- Produces: `export const claims: { timeline: string; cost: string; revenue: string; speed: string; hosting: string }` (readonly strings), with the spec's default wording: timeline "Typical projects ship in about 15 weeks, depending on scope."; cost "Around 30% lower cost than traditional agency development."; revenue "We help clients grow revenue."; speed "Faster websites and applications."; hosting "Lower hosting and production costs."

- [ ] **Step 1:** Add test `claim numbers exist only in lib/claims.ts`: read every file under `app/`, `components/`, `lib/` except `lib/claims.ts`; none contains `15 weeks` or `30%`.
- [ ] **Step 2:** Run `npm test`. Expected: PASS (nothing uses them yet).
- [ ] **Step 3:** Create `lib/claims.ts` with the five strings exactly as above.
- [ ] **Step 4:** Run `npm test`. Expected: PASS. Checkpoint commit.

### Task 3: Services data model and new services

**Files:**
- Modify: `lib/services.ts`, `components/ContactForm.tsx` (no code change expected; verify), `scripts/site.test.mjs`

**Interfaces:**
- Produces: `type FigureMotif = "compass"|"layers"|"stack"|"gauge"|"cloud"|"network"|"chart"|"shield"|"check"`; `type CapabilityGroup = { slug: string; name: string; summary: string; items: string[]; standOut: {title:string; text:string}[]; inPractice: string; faqs: {q:string; a:string}[]; figure: {n:number; title:string; motif: FigureMotif} }`; `capabilityGroups: CapabilityGroup[]` (nine entries, order as the slug list in Global Constraints); `getGroup(slug: string): CapabilityGroup | undefined`.

- [ ] **Step 1:** Add a unit-style test reading `lib/services.ts` via dynamic `import()` of the compiled form is not available; instead test through the build: `contact page lists 9 service options` (the contact HTML has 9 service `<option>` values plus "Not sure yet" and "Something else").
- [ ] **Step 2:** Run `npm run build && npm test`. Expected: PASS (9 groups exist today). This pins the count before the refactor.
- [ ] **Step 3:** Extend `CapabilityGroup` and fill each of the nine groups: unique `slug`; 4 `standOut` points of general working principles (no numbers, no tool claims beyond the Tech stack list); one `inPractice` sentence; 3 `faqs` with non-committal answers (no price, timeline or guarantee promises); `figure.n` 1-9. Add the spec section 10 items: Optimize gets "SEO optimization (technical SEO, content structure, search visibility)", "Website speed and Core Web Vitals", "Hosting and production cost reduction" (replacing "Infrastructure cost review"); Business systems gets "Conversion and revenue growth support"; Cloud's cost line becomes "Right-sizing infrastructure to cut hosting and production costs". Optimize, Cloud and Business systems `inPractice` use `claims.speed`/`claims.hosting`/`claims.revenue`; Optimize FAQ includes "Can you help our site rank better?", Cloud FAQ includes "How do you reduce hosting costs?". Export `getGroup`.
- [ ] **Step 4:** Run `npm run lint && npm run build && npm test`. Expected: all PASS. Checkpoint commit.

### Task 4: Work data model and anonymous cases

**Files:**
- Modify: `lib/work.ts`, `components/sections.tsx` (rename `p.services` to `p.scope` in `ProjectCard`), `scripts/site.test.mjs`

**Interfaces:**
- Produces: `type CaseSections = { summary?: string; client?: string; challenge?: string; solution?: string; results?: string }`; `type Project = { slug: string; title: string; category: string; industry: string; summary: string; scope: string[]; highlights: string[]; sections: CaseSections; relatedServices: string[] }` (`relatedServices` are service slugs); `projects: Project[]` (six, in Global Constraints order); `getProject(slug: string): Project | undefined`.

- [ ] **Step 1:** Add test `case cards and case pages are qualitative`: the visible text of each case card on `/work` (category, title, summary, scope pills) matches no `\d`, and (once Task 9 exists) neither do the case pages' section texts.
- [ ] **Step 2:** Run `npm run build && npm test`. Expected: PASS on the current six cards.
- [ ] **Step 3:** Rewrite `lib/work.ts` to the interface above, authoring each case's `sections` from the spec's section 6 table (anonymized, qualitative); construction has only `summary`. `highlights` are three non-numeric chips each. Update `ProjectCard` to show `p.scope` and link to `/work/${p.slug}`.
- [ ] **Step 4:** Run `npm run lint && npm run build && npm test`. Expected: PASS, including the privacy scan. Checkpoint commit.

### Task 5: Shared presentation components

**Files:**
- Create: `components/Faq.tsx`, `components/ServiceFigure.tsx`, `components/CaseCards.tsx`, `components/ServiceBlocks.tsx`
- Modify: `components/sections.tsx` (move `ProjectCard`, `WorkPreview` out to `CaseCards.tsx`; update importers), `scripts/site.test.mjs`

**Interfaces:**
- Produces: `Faq({items: {q:string; a:string}[]})`; `ServiceFigure({n:number; title:string; motif: FigureMotif})`; `ProjectCard({p: Project})`, `CaseGrid({items: Project[]})`, `WorkPreview()` (3 cases + link); `StandOutGrid({service:string; items:{title:string; text:string}[]})`; `ExploreServices({exclude:string})` (three other groups as links to `/services/[slug]`); `RecentWork({relatedServices:string[]})` (up to 2 cases whose `relatedServices` include the group slug).

- [ ] **Step 1:** Add test `home page still renders work preview and tech stack` (headings "Projects we have delivered" or its successor and "Tech stack" present).
- [ ] **Step 2:** Run `npm run build && npm test`. Expected: PASS before the move.
- [ ] **Step 3:** Implement the four component files as server components in the existing Tailwind style (dark cards `border-line bg-ink-2`, light bands `light-band`); `ServiceFigure` draws one original line-art SVG per motif (stroke teal/steel, `role="img"` with an `aria-label`), captioned "FIG. 0N — title"; `Faq` renders one `<details><summary>` per item.
- [ ] **Step 4:** Move the moved components and fix imports; run `npm run lint && npm run build && npm test`. Expected: PASS. Checkpoint commit.

### Task 6: Header Services menu and footer groups

**Files:**
- Create: `components/ServicesMenu.tsx`
- Modify: `components/Header.tsx`, `components/Footer.tsx`, `lib/nav.ts`

**Interfaces:**
- Consumes: `capabilityGroups` (slug, name).
- Produces: `ServicesMenu()` client component: a button `aria-expanded`/`aria-controls` that toggles a list of nine links to `/services/[slug]` plus "All services" → `/services`; Escape closes and returns focus to the button; clicking a link closes it. Mobile menu lists the same nine links inline under "Services".

- [ ] **Step 1:** Add test `header contains links to all nine service pages` (home HTML contains `href="/services/<slug>"` for each slug, from the menu and footer).
- [ ] **Step 2:** Run `npm run build && npm test`. Expected: FAIL (routes not linked).
- [ ] **Step 3:** Implement `ServicesMenu` and wire it into `Header` in place of the plain "Services" link (desktop at `lg:`); footer gains grouped columns: Company (About, Work, Contact), Services (nine links), Solutions (three solution links), Connect (contact link). Keep the existing disclaimer line.
- [ ] **Step 4:** Run `npm run lint && npm run build && npm test`. Expected: link test PASS; the crawl test will fail on `/services/<slug>` until Task 7, so build Task 7 before running the crawl; run only the header test here with `node --test --test-name-pattern="header" scripts/`.
- [ ] **Step 5:** Browser check at 1280 px: open the menu by keyboard (Enter), press Escape, confirm it closes and focus returns. Checkpoint commit.

### Task 7: Service detail template

**Files:**
- Create: `app/services/[slug]/page.tsx`
- Modify: `scripts/site.test.mjs`

**Interfaces:**
- Consumes: `getGroup`, `capabilityGroups`, `ServiceFigure`, `StandOutGrid`, `Faq`, `RecentWork`, `ExploreServices`, `ClosingCta`.
- Produces: nine static pages `/services/<slug>`; `generateMetadata` returns the group name and summary.

- [ ] **Step 1:** Add tests: `all nine service pages render with 4 standOut points, 3 FAQs and the figure caption` (each built page has four standOut headings, three `<details>`, and "FIG. 0N"); `unknown service slug 404s` (no built file for `/services/nope`; with `dynamicParams=false` assert `.next/server/app/services/nope.html` is absent); `optimize page shows the speed claim and SEO item`.
- [ ] **Step 2:** Run `npm run build && npm test`. Expected: FAIL (pages missing).
- [ ] **Step 3:** Implement the page with the spec section 5 order: hero with `ServiceFigure`, `StandOutGrid`, an "In practice" statement band, "What we offer" list from `items`, `RecentWork`, `Faq`, `ExploreServices`, `ClosingCta`. Use `notFound()` for unknown slugs, `generateStaticParams`, `dynamicParams = false`.
- [ ] **Step 4:** Run `npm run lint && npm run build && npm test`. Expected: all PASS including the crawl and privacy scans. Checkpoint commit.

### Task 8: Services index restructure

**Files:**
- Modify: `app/services/page.tsx`, `scripts/site.test.mjs`

- [ ] **Step 1:** Add test `services index links each group to its detail page and shows the AI-by-team and tech stack sections` (nine `href="/services/<slug>"`, "Everything we do" replaced by linked rows, "AI for every team", "Tech stack", "Ways to start").
- [ ] **Step 2:** Run `npm run build && npm test`. Expected: FAIL (rows aren't links yet).
- [ ] **Step 3:** Make each "Everything we do" row a link to `/services/<slug>` showing the figure number, name, summary and the first four items; keep the needs-to-offer table, AI-by-team, Tech stack, Kinds of work, Ways to start, Private-by-default blocks.
- [ ] **Step 4:** Run `npm run lint && npm run build && npm test`. Expected: PASS. Checkpoint commit.

### Task 9: Work index and case-study template

**Files:**
- Create: `app/work/[slug]/page.tsx`
- Modify: `app/work/page.tsx`, `scripts/site.test.mjs`

**Interfaces:**
- Consumes: `projects`, `getProject`, `CaseGrid`, `ProjectCard`, `ClosingCta`.
- Produces: six static pages `/work/<slug>`; `CaseSection({title:string; text?:string})` renders nothing when `text` is empty (add to `ServiceBlocks.tsx` or a local component).

- [ ] **Step 1:** Add tests: `all six case pages render` with Industry and Scope in a details panel and the three highlight chips; `construction case renders no empty headings` (no `<h2>`/`<h3>` immediately followed by another heading or by an empty element, no "undefined"/"null" text); `case pages carry no client, year, duration or link rows`; `unknown work slug 404s`.
- [ ] **Step 2:** Run `npm run build && npm test`. Expected: FAIL.
- [ ] **Step 3:** Implement the case page: header (category, title, summary), three highlight chips, Details panel (Industry, Scope list), stacked Project summary / About the client / Challenge / Solution / Results via `CaseSection`, "More work this way" with two other cases, `ClosingCta`. Restructure `/work`: hero "The proof is in the product.", `CaseGrid` of all six, privacy note.
- [ ] **Step 4:** Run `npm run lint && npm run build && npm test`. Expected: all PASS. Checkpoint commit.

### Task 10: Home page restructure

**Files:**
- Modify: `app/page.tsx`, `scripts/site.test.mjs`
- Consumes: `claims.timeline`, `claims.cost`, `claims.revenue`, `claims.speed`, `capabilityGroups`, `WorkPreview`.

- [ ] **Step 1:** Add tests: `home shows the claims` (HTML contains `claims.timeline` text in the process section and `claims.cost` text in the hero sub-line); `home has the four AI cards, three process rows, nine capability links, three case cards, two engagement cards`; `home contains no testimonial or stats section` (no "testimonial", no "launches").
- [ ] **Step 2:** Run `npm run build && npm test`. Expected: FAIL.
- [ ] **Step 3:** Restructure per spec section 4: hero keeps headline/body/CTAs, adds the eyebrow pill, an oversized low-contrast LYKAN wordmark, a sub-line using `claims.cost`; "Your team is good. Engineering makes them faster." four cards with "e.g." lines (no figures) and CTA "Talk through your workflows" → `/contact`; three numbered process rows under a heading using `claims.timeline`; nine linked capability rows (use `claims.revenue`/`claims.speed` on the relevant rows); `WorkPreview`; "How we engage" two cards (Established teams, New products); keep Tech stack, Private-by-default, Solutions and ClosingCta.
- [ ] **Step 4:** Run `npm run lint && npm run build && npm test`. Expected: all PASS. Checkpoint commit.

### Task 11: About and Contact

**Files:**
- Modify: `app/about/page.tsx`, `app/contact/page.tsx`, `scripts/site.test.mjs`
- Consumes: `Faq`, `claims`.

- [ ] **Step 1:** Add tests: `contact shows five FAQs using the claims` (five `<details>`; timeline claim in the "how long" answer; cost claim in the budget answer); `about has the principle rows and no team or stats section`.
- [ ] **Step 2:** Run `npm run build && npm test`. Expected: FAIL.
- [ ] **Step 3:** Contact gains the five-question FAQ from spec section 7 with non-committal accurate answers; About gets a statement headline, three principle rows (keep the existing approved-details placeholder, no team or stats), and `claims.timeline`.
- [ ] **Step 4:** Run `npm run lint && npm run build && npm test`. Expected: all PASS. Checkpoint commit.

### Task 12: Final verification

**Files:** none (verification only).

- [ ] **Step 1:** `npm run lint && npm run build && npm test`. Expected: exit 0, route list shows nine `/services/[slug]` and six `/work/[slug]` pages, all tests pass.
- [ ] **Step 2:** Start `npx next start -p 3111`; browser-walk every new template at 375, 768 and 1280 px; for each page assert `scrollWidth <= clientWidth`. Expected: no overflow.
- [ ] **Step 3:** Confirm the three solution demos still work (select SH-1042 and resolve; procurement approve; media search and save) and the contact form still validates and posts the selected topic.
- [ ] **Step 4:** Stop the server. Report the evidence (test counts, overflow results) and the open owner items from spec section 9.

## Self-review

- **Spec coverage:** sections 3-5 → Tasks 7-10; section 6 and anonymization → Tasks 1, 4, 9; section 7 components and header/footer/about/contact → Tasks 5, 6, 11; section 8 verification → Tasks 1, 12; section 10 claims and services → Tasks 2, 3, 7, 10, 11. Case and service copy is authored under the spec's rules and checked by the scan.
- **Type consistency:** `FigureMotif`, `CapabilityGroup.figure`, `Project.scope` and `relatedServices` are defined in Tasks 3-4 and consumed in 5-9 with the same names.
- **Known coupling:** the crawl test depends on Task 7; Task 6 runs only the header test, noted in its steps.
