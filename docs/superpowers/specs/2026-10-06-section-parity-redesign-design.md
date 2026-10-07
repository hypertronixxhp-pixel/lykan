# Lykan site: section-parity redesign (design spec)

Date: 2026-10-06 · Status: **awaiting review** · Project: `E:\project\lykan` (Next.js 16, Tailwind 4, no git repo)

## 1. Goal and success criteria

Make the Lykan site follow the same page architecture, section order and section types as the partner public site, using Lykan's own teal-on-ink theme, wording and original visuals. Present the partner's real projects as **anonymous** case studies.

Success means:
1. Every page type and section type below exists and is reachable from the nav.
2. No client or partner name, place, figure, date, URL, quote, tagline or third-party product name appears anywhere in shipped output (checked by an automated scan, section 8).
3. `tsc`, `next build`, the link crawl and the privacy scan all pass.

Stated by the user: keep the current theme; mirror every section including case studies; no names or details of the partner's sites; the relationship between the two firms stays private; owner has confirmed the work may be described this way.

## 2. Out of scope (deliberately)

- Visual copying: no partner copy, illustrations, logo, screenshots, fonts-as-brand or colour palette. Lykan keeps teal `#38C6C3` on ink `#0B1220`.
- Partner pages with no Lykan equivalent: Industries, Venture studio, Insights/blog, SEO landing pages, privacy page (add later if wanted).
- Testimonials, team biographies, "years of trust / launches / market cap" stats, free-offer CTAs, client logos, and any claim number other than the owner-supplied ones in section 10. None of these are confirmed Lykan facts. Components exist so they can be switched on when real, approved data is supplied.
- The three Solutions showcases, their demos, and the Approach page stay unchanged.

## 3. Page map

| Route | Status | Mirrors |
|---|---|---|
| `/` | Restructured (section 4) | Home |
| `/services` | Restructured | Services index |
| `/services/[slug]` ×9 | **New** | Service detail pages |
| `/work` | Restructured | Work index |
| `/work/[slug]` ×6 | **New** | Case-study pages |
| `/about` | Restructured | About |
| `/contact` | Extended (FAQ) | Contact |
| `/solutions`, `/solutions/[slug]`, `/approach` | Unchanged | none (Lykan-only) |

Service slugs: `strategy-discovery`, `design`, `build`, `optimize`, `cloud`, `ai-automation`, `business-systems`, `security`, `quality-support`.

## 4. Home page sections (in order)

1. **Hero.** Eyebrow pill ("Private engineering partner"), existing headline/body/CTAs, an oversized low-contrast LYKAN wordmark, existing product fragments retained.
2. **"Your team is good. Engineering makes them faster."** Four cards: *Answer every customer* (chatbots/support assistants), *Run operations on autopilot* (workflow automation), *Know what's happening* (dashboards, anomaly detection), *Create at scale* (AI content and data generation). Each has an "e.g." line with no figures. CTA: "Talk through your workflows" → `/contact`.
3. **Process rows.** Heading carries the owner's timeline claim (section 10). Three numbered rows: *Problem first*, *One team, no handoffs*, *Automation does the repetitive work*. No comparison bar.
4. **Capabilities.** "Full-stack capabilities, tailored to your stage." Nine linked rows, one per service group → `/services/[slug]`.
5. **Work.** Three anonymous case cards → `/work`.
6. **How we engage.** Two cards: *Established teams* and *New products*. No venture/capital claim.
7. Tech stack (existing) and Private-by-default band (existing).
8. Solutions showcase cards (existing).
9. Closing CTA and footer.

## 5. Service detail template (`/services/[slug]`)

Sections: Hero with figure caption "FIG. 0N — title" and an original SVG motif · "What makes our {service} stand out" (4 titled points) · "In practice" statement (Lykan's own principle, **not** a testimonial) · "What we offer" list (from `capabilityGroups`) · "Recent work" (2 case cards relevant to the service) · FAQ (3 Q&As, native `<details>`) · "Explore other services" (3 cards) · closing CTA.

Copy rules: method statements are general working principles; no numbers; no tooling claim beyond the Tech stack list; the three-sentence FAQ answers avoid promises about price, timelines or guarantees. **All method statements must be confirmed by the Lykan owner** (section 9).

## 6. Work

- `/work`: hero "The proof is in the product." plus a grid of the six cases. Each card shows category, title, summary, scope pills (no metric pills).
- `/work/[slug]`: header (title, category) · three non-numeric highlight chips · Details panel with **Industry**, **Scope** and delivery type only (no client, year, duration or link) · tabbed or stacked Project summary / About the client (type) / Challenge / Solution / Results · "More work this way" · closing CTA.
- Sections render only when data exists. Construction operations has summary and scope only until details are supplied.

### Anonymization rules (applied to every case and verified by the scan)

Remove: company, founder, subsidiary and developer names; brand taglines and quoted positioning slogans; cities, countries, regions, destinations; third-party product and channel names; all counts, ratings, scores, percentages, durations, years, language counts; URLs; photographs and screenshots. Replace figures with qualitative words ("multilingual", "several destinations", "multiple verticals"). Industry stays at coarse level.

### Case content (drafts to be reviewed)

| Slug | Category | Scope | Substance (anonymized) |
|---|---|---|---|
| `property-portal` | Real estate | Branding, design, web | Premium advisory firm for international buyers and investors. Challenge: hard-to-compare listings, manual off-plan updates, no guidance in buyers' own languages, leads lost to larger portals. Solution: new identity, area and developer guides, fast off-plan listings, multilingual layer, enquiry flow for non-resident buyers. Result: became the primary sales channel; enquiries rose; agents spent less time assembling material. |
| `holiday-rental-booking` | Hospitality | Branding, design, web, system integration | Boutique luxury rental operator. Challenge: generic, marketplace-like browsing; high-intent guests leaking to large booking platforms. Solution: luxury positioning, refined property cards, location-led storytelling, fast booking with real availability, editorial content, property-management integration. Result: direct bookings rose in the first season; platform scales to new properties without redesign. |
| `rental-marketplace` | Travel and hospitality | Branding, design, web, ERP | Challenge: inventory in spreadsheets, bookings by phone and manual confirmation, growth across several destinations impossible. Solution: end-to-end marketplace, direct booking with real availability, ERP back office for inventory, bookings and guest communication. Result: portfolio runs from one platform. |
| `investment-platform` | Real estate investment | Branding, design, web, ERP | Challenge: several investment verticals needed one credible brand plus an operational layer. Solution: flagship built around the investor journey, thesis-style content, ERP linking inventory to enquiries. Result: coherent presentation and operations from one system. |
| `design-studio-portfolio` | Architecture and design | Branding, design, web | Challenge: multiple disciplines flattened into a generic site; signature projects and founder story under-weighted. Solution: portfolio-first experience, each discipline its own space, photography-led project pages. Result: primary credentials piece for new business; team can publish alone. |
| `construction-operations` | Construction | Workflow automation, internal tools | Summary and scope only until details are provided. |

Result wording is qualitative and mirrors the source's own qualitative claims; flagged in section 9.

## 7. Shared components and data

- `lib/services.ts` gains `slug`, `standOut[4]`, `inPractice`, `faqs[3]`, `figure` per group; the Services page, home, contact selector and detail pages all read it.
- `lib/work.ts` gains `slug`, `highlights[3]`, `industry`, `sections{summary, client, challenge, solution, results}`; `projects` order drives all cards.
- New components: `Faq` (native `<details>`), `ServiceFigure` (inline SVG + FIG caption), `CaseSection`, `StandOutGrid`, `ExploreServices`, footer link groups (Company, Services, Solutions, Connect).
- Header: **Services** opens a keyboard-accessible menu of the nine groups (inline list on mobile); other links unchanged; **Work** retained.
- About: statement headline, three principle rows, "Questions answered honestly" is on Contact; **no** stats and **no** team section until data is supplied. The existing placeholder block stays.
- Contact: existing form plus a five-question FAQ ("Can you just send me a quote?", "Do you work with early-stage products?", "Is there a minimum time or budget?", "Can you fix just one part of my product?", "We have an in-house team, can we work together?"), answered with non-committal, accurate wording.
- All routes use `generateStaticParams` with `dynamicParams = false`; per-page metadata title and description.

## 8. Verification (run fresh before claiming done)

1. `npm run lint` (tsc) and `npm run build` exit 0; route list shows all 9 service and 6 work pages.
2. **Link crawl:** every internal `href` in the built site returns 200.
3. **Privacy scan:** `scripts/check-private.mjs` scans `.next/server/app` and source for a banned-term list (partner and client names, founder names, places, developers and channels, taglines, figures lifted from the source). The list lives in a gitignored local file so it is not shipped. Zero hits required; the partner's name must not appear. The banned list includes the partner's own figures (their timeline, cost, lead-multiplier, stay and guest counts, ratings and scores), so only the owner-supplied numbers in section 10 can appear, and only from `lib/claims.ts`.
4. Browser walk of each template at 375, 768 and 1280 px: no horizontal overflow, nav menu works by keyboard, FAQ opens and closes, existing three demos still work.
5. Contact form still validates, and the topic selector lists the nine groups.

## 9. Open items for the owner (not blocking the spec)

- Confirm the working principles used in "What makes our … stand out" and the FAQ answers are true for Lykan.
- Confirm the qualitative Results lines are acceptable, given they paraphrase the partner's own claims.
- Supply details for the construction case, and optionally any approved anonymous quote, a team list, or real figures.
- The contact form destination (`CONTACT_WEBHOOK_URL`) is still unset.
- Whether Azure stays in the Cloud group (Tech stack lists AWS only).

## 10. Owner-supplied claims and new services (added 2026-10-06)

The owner has asked for specific performance claims and will substantiate them to clients. They are the owner's statements, not verified by the site builder.

**Single source of truth:** `lib/claims.ts` exports the claim text. Every page reads from it; deleting or editing a value there changes the whole site. Nothing else in the codebase hard-codes these numbers.

| Claim | Default wording | Where it appears |
|---|---|---|
| Timeline | "Typical projects ship in about 15 weeks, depending on scope." | Hero sub-line, Home process heading, Contact FAQ ("How long does a project take?"), About |
| Cost | "Around 30% lower cost than traditional agency development." | Hero sub-line, Home engagement cards, Contact FAQ ("Is there a minimum budget?" / pricing) |
| Revenue | "We help clients grow revenue." (qualitative, no figure) | Home capabilities, Business systems service page, case Results |
| Speed | "Faster websites and applications." (qualitative) | Optimize service page, Home |
| Hosting and production cost | "Lower hosting and production costs." (qualitative) | Cloud and Optimize service pages |

Rules:
- Numbers are stated as typical/around, with the comparator named ("traditional agency development"), so each claim is specific enough to substantiate. The owner may tighten or remove the hedge in `lib/claims.ts`.
- **No per-project figures.** Case studies do not receive invented numbers (no "40% more revenue" on any case); revenue, speed and cost appear only as qualitative result lines or firm-level claims.
- Claims are not attributed to named clients, and no screenshot or chart implies measured data.
- The owner remains responsible for being able to provide evidence on request, and for compliance with advertising rules in the markets they sell into.

**New and extended services** (in `lib/services.ts`, flowing to Services, Home, detail pages and the contact selector):
- *Optimize:* add "SEO optimization (technical SEO, content structure, search visibility)", "Website speed and Core Web Vitals", "Hosting and production cost reduction"; replace "Infrastructure cost review" with it.
- *Business systems:* add "Conversion and revenue growth support".
- *Cloud:* "Right-sizing infrastructure to cut hosting and production costs" in place of the generic cost line.
- Service detail pages for Optimize, Cloud and Business systems each get the matching claim in their "In practice" statement and a FAQ ("Can you help our site rank better?", "How do you reduce hosting costs?").
