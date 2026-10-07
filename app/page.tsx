import Link from "next/link";
import { Button, ClosingCta, Eyebrow } from "@/components/ui";
import { DocumentFragment, LogisticsFragment, VideoFragment } from "@/components/ProductFragments";
import { solutions } from "@/lib/solutions";
import { PrivacyBlock, TechStack, WorkPreview } from "@/components/sections";
import { capabilityGroups } from "@/lib/services";
import { steps } from "@/lib/steps";

export default function Home() {
  return (
    <>
      <section className="py-20 sm:py-28">
        <div className="wrap grid items-center gap-14 lg:grid-cols-2">
          <div>
            <Eyebrow>Complex products. Quietly delivered.</Eyebrow>
            <h1 className="h-display rise text-4xl sm:text-6xl">Engineering ambitious products with discretion.</h1>
            <p className="rise-2 measure mt-6 text-lg text-slate-300">
              Lykan Cloud &amp; AI Services partners with teams to design and build web applications, cloud systems, and useful AI. We work closely with the people behind the product and share project details on their terms.
            </p>
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

      <PrivacyBlock />

      <section className="light-band py-24">
        <div className="wrap">
          <h2 className="h-display max-w-xl text-3xl sm:text-4xl">What we do</h2>
          <p className="measure mt-4 text-slate-600">We start with the business task, then choose the technology.</p>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {capabilityGroups.map((g) => (
              <article key={g.name} className="rounded-xl border border-line-light bg-white p-8">
                <h3 className="text-xl font-semibold">{g.name}</h3>
                <p className="mt-3 text-slate-600">{g.summary}</p>
                <ul className="mt-5 space-y-2 border-t border-line-light pt-5 text-sm">
                  {g.items.slice(0, 4).map((d) => <li key={d} className="flex gap-2"><span className="text-teal">▸</span>{d}</li>)}
                </ul>
              </article>
            ))}
            <article className="flex flex-col justify-between rounded-xl border border-dashed border-line-light p-8">
              <div>
                <h3 className="text-xl font-semibold">Not sure where to start?</h3>
                <p className="mt-3 text-slate-600">Describe the problem and we will suggest a sensible first step.</p>
              </div>
              <Button href="/services" variant="ghostLight" className="mt-6 self-start">See every service</Button>
            </article>
          </div>
        </div>
      </section>

      <WorkPreview />

      <TechStack />

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

      <section className="light-band py-24">
        <div className="wrap">
          <h2 className="h-display max-w-xl text-3xl sm:text-4xl">How we work together</h2>
          <ol className="mt-12 grid gap-6 md:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-xl border border-line-light bg-white p-6">
                <span className="text-sm font-medium text-steel">0{i + 1}</span>
                <h3 className="mt-2 font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{s.text}</p>
                <p className="mt-4 border-t border-line-light pt-3 text-sm"><b>Output:</b> {s.output}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
