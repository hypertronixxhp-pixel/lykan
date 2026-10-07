import Link from "next/link";
import { Button, ClosingCta, Eyebrow } from "@/components/ui";
import { DocumentFragment, LogisticsFragment, VideoFragment } from "@/components/ProductFragments";
import { solutions } from "@/lib/solutions";
import { PrivacyBlock, TechStack } from "@/components/sections";
import { WorkPreview } from "@/components/CaseCards";
import { capabilityGroups, type ServiceSlug } from "@/lib/services";
import { claims } from "@/lib/claims";

const aiCards = [
  {
    title: "Handle customer questions",
    text: "Chatbots and support assistants on your site that answer routine questions and hand the rest to a person.",
    eg: "e.g. a help assistant that knows your product pages and policies",
  },
  {
    title: "Take repetitive work off the team",
    text: "Workflow automation and back-office agents that move information between the tools you already use.",
    eg: "e.g. sorting incoming requests and filling in the follow-up forms",
  },
  {
    title: "See what is happening",
    text: "Dashboards and anomaly detection that bring the signals in your data to the people who act on them.",
    eg: "e.g. an alert when orders or costs drift from their usual pattern",
  },
  {
    title: "Produce content and data at scale",
    text: "AI content generation and database population, reviewed by your team before it goes live.",
    eg: "e.g. drafting catalogue descriptions or seeding a directory from public sources",
  },
];

const processRows = [
  {
    title: "Start with the problem",
    text: "We begin with the task your team needs done, then pick the simplest technology that does it well.",
  },
  {
    title: "One team from design to deployment",
    text: "The people who design the product also build, test and run it, so less is lost between handoffs.",
  },
  {
    title: "Automate the repetitive parts",
    text: "Routine steps in the build and in your operations are automated, which leaves time for the decisions that matter.",
  },
];

/** Secondary claim lines for the capability rows that carry one. */
const capabilityClaims: Partial<Record<ServiceSlug, string>> = {
  optimize: claims.speed,
  cloud: claims.hosting,
  "business-systems": claims.revenue,
};

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden py-20 sm:py-28">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 select-none text-center font-semibold uppercase leading-none tracking-[0.12em] text-white/[0.04]"
          style={{ fontSize: "clamp(5rem, 22vw, 20rem)" }}
        >
          Lykan
        </span>
        <div className="wrap relative grid items-center gap-14 lg:grid-cols-2">
          <div>
            <p className="mb-5 inline-block rounded-full border border-line px-3 py-1 text-xs font-medium text-slate-300">Private engineering partner</p>
            <h1 className="h-display rise text-4xl sm:text-6xl">Engineering ambitious products with discretion.</h1>
            <p className="rise-2 measure mt-6 text-lg text-slate-300">
              Lykan Cloud &amp; AI Services partners with teams to design and build web applications, cloud systems, and useful AI. We work closely with the people behind the product and share project details on their terms.
            </p>
            {(claims.cost || claims.timeline) && (
              <div className="rise-2 mt-4 space-y-1">
                {claims.cost && <p className="text-base font-medium text-teal">{claims.cost}</p>}
                {claims.timeline && <p className="text-sm text-slate-400">{claims.timeline}</p>}
              </div>
            )}
            <div className="rise-3 mt-8 flex flex-wrap gap-3">
              <Button href="/contact">Discuss a project</Button>
              <Button href="/solutions" variant="ghost">See what we build</Button>
            </div>
          </div>
          <div className="space-y-4" aria-label="Example product interface fragments">
            <LogisticsFragment />
            <div className="grid gap-4 sm:grid-cols-2"><DocumentFragment /><VideoFragment /></div>
            <p className="text-xs text-slate-500">Illustrative interface fragments with sample data.</p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="wrap">
          <Eyebrow>Applied AI</Eyebrow>
          <h2 className="h-display max-w-2xl text-3xl sm:text-4xl">Give your team its time back.</h2>
          <p className="measure mt-4 text-slate-300">Your people already know the work. We build the systems that take the routine parts off their plate.</p>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {aiCards.map((c) => (
              <article key={c.title} data-ai-card className="flex flex-col rounded-xl border border-line bg-ink-2 p-7">
                <h3 className="text-lg font-semibold">{c.title}</h3>
                <p className="mt-3 text-slate-300">{c.text}</p>
                <p className="mt-5 border-t border-line pt-4 text-sm text-steel">{c.eg}</p>
              </article>
            ))}
          </div>
          <Button href="/contact" className="mt-10">Talk through your workflows</Button>
        </div>
      </section>

      <section className="light-band py-24">
        <div className="wrap">
          <Eyebrow tone="light">How we work</Eyebrow>
          {claims.timeline && <h2 className="h-display max-w-2xl text-3xl sm:text-4xl">{claims.timeline}</h2>}
          <ol className="mt-12 space-y-4">
            {processRows.map((r, i) => (
              <li key={r.title} data-process-row className="grid gap-4 rounded-xl border border-line-light bg-white p-6 sm:grid-cols-[auto_1fr_1.4fr] sm:items-center sm:gap-8 sm:p-8">
                <span className="font-mono text-2xl text-text">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-xl font-semibold">{r.title}</h3>
                <p className="text-slate-600">{r.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-24">
        <div className="wrap">
          <Eyebrow>Capabilities</Eyebrow>
          <h2 className="h-display max-w-2xl text-3xl sm:text-4xl">Everything from first sketch to production</h2>
          <div className="mt-12 space-y-4">
            {capabilityGroups.map((g) => (
              <Link
                key={g.slug}
                href={`/services/${g.slug}`}
                className="group grid gap-3 rounded-xl border border-line bg-ink-2 p-6 transition-colors hover:border-teal sm:grid-cols-[auto_1fr_1.4fr] sm:items-center sm:gap-8"
              >
                <span className="font-mono text-sm text-teal">{String(g.figure.n).padStart(2, "0")}</span>
                <span className="text-lg font-semibold">{g.name}</span>
                <span className="text-sm text-slate-300">
                  {g.summary}
                  {capabilityClaims[g.slug] && <span className="mt-2 block font-medium text-teal">{capabilityClaims[g.slug]}</span>}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <WorkPreview />

      <section className="light-band py-24">
        <div className="wrap">
          <Eyebrow tone="light">How we engage</Eyebrow>
          <h2 className="h-display max-w-2xl text-3xl sm:text-4xl">Two ways to work with us</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <article className="rounded-xl border border-line-light bg-white p-8">
              <h3 className="text-xl font-semibold">Established teams</h3>
              <p className="mt-3 text-slate-600">You have a product, a platform or an operation that needs to run better. We join your team, learn your systems and improve them with minimal disruption to the work underway.</p>
            </article>
            <article className="rounded-xl border border-line-light bg-white p-8">
              <h3 className="text-xl font-semibold">New products</h3>
              <p className="mt-3 text-slate-600">You have an idea and need it built properly. We take it from rough concept to a running product with one team.</p>
              {claims.cost && <p className="mt-4 border-t border-line-light pt-4 text-sm font-medium text-text">{claims.cost}</p>}
            </article>
          </div>
        </div>
      </section>

      <TechStack />

      <PrivacyBlock />

      <section className="py-24">
        <div className="wrap">
          <Eyebrow>Solutions</Eyebrow>
          <h2 className="h-display max-w-2xl text-3xl sm:text-4xl">Systems shaped around demanding workflows</h2>
          <p className="measure mt-4 text-slate-300">Every product has its own users, decisions, data, and operating constraints. These solution showcases show the depth of product thinking and engineering we bring to an engagement.</p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {solutions.map((s) => (
              <Link key={s.slug} href={`/solutions/${s.slug}`} className="group rounded-xl border border-line bg-ink-2 p-7 transition-colors hover:border-teal">
                <p className="text-xs text-steel">{s.category} · {s.cloud}</p>
                <h3 className="mt-3 text-xl font-semibold">{s.name}</h3>
                <p className="mt-2 text-slate-300">{s.short}</p>
                <p className="mt-6 text-sm text-teal group-hover:underline">Explore the solution →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
