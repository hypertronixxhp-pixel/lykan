import { Eyebrow } from "@/components/ui";
import { engagements, workTypes } from "@/lib/engagements";
import { techStack } from "@/lib/stack";
import { aiByTeam } from "@/lib/aiByTeam";

export const NDA_LINE = "We sign an NDA before you share any materials.";

export function PrivacyBlock({ className = "" }: { className?: string }) {
  return (
    <section className={`border-y border-line bg-ink-2 py-12 ${className}`}>
      <div className="wrap grid gap-8 md:grid-cols-[1fr_1.4fr] md:items-center">
        <div>
          <Eyebrow>Private by default</Eyebrow>
          <h2 className="h-display text-2xl sm:text-3xl">Your product is your business.</h2>
        </div>
        <div className="space-y-3 text-slate-300">
          <p>{NDA_LINE} We discuss requirements privately, limit access to project materials, and agree on what, if anything, can be shared publicly.</p>
          <p className="text-sm text-slate-400">Some work cannot be shown, so we talk about approach and technical decisions at a level you permit.</p>
        </div>
      </div>
    </section>
  );
}

export function WorkTypes() {
  return (
    <section className="py-20">
      <div className="wrap">
        <Eyebrow>Kinds of work</Eyebrow>
        <h2 className="h-display max-w-2xl text-3xl sm:text-4xl">Products we build and support</h2>
        <p className="measure mt-4 text-slate-300">Client details stay private, so we describe the work by type rather than by name.</p>
        <ul className="mt-8 flex flex-wrap gap-3">
          {workTypes.map((w) => (
            <li key={w} className="rounded-full border border-line bg-ink-2 px-4 py-2 text-sm text-slate-200">{w}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function WaysToStart() {
  return (
    <section className="light-band py-20">
      <div className="wrap">
        <h2 className="h-display max-w-xl text-3xl sm:text-4xl">Ways to start</h2>
        <p className="measure mt-4 text-slate-600">You do not need a large brief. Many teams begin with one problem.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {engagements.map((e) => (
            <article key={e.name} className="rounded-xl border border-line-light bg-white p-7">
              <h3 className="text-lg font-semibold">{e.name}</h3>
              <p className="mt-2 text-slate-600">{e.text}</p>
              <p className="mt-4 border-t border-line-light pt-3 text-sm"><b>Output:</b> {e.output}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TechStack() {
  return (
    <section className="light-band py-20">
      <div className="wrap">
        <h2 className="h-display max-w-xl text-3xl sm:text-4xl">Tech stack</h2>
        <p className="measure mt-4 text-slate-600">We choose tools to fit the problem. These are the ones we build with most.</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {techStack.map((g) => (
            <div key={g.group} className="rounded-xl border border-line-light bg-white p-6">
              <h3 className="text-xs font-medium uppercase tracking-wide text-steel">{g.group}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {g.items.map((i) => <li key={i} className="rounded bg-stone px-3 py-1.5 text-sm">{i}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AiByTeam() {
  return (
    <section className="py-20">
      <div className="wrap">
        <Eyebrow>AI for every team</Eyebrow>
        <h2 className="h-display max-w-2xl text-3xl sm:text-4xl">Automation tailored to how each team works</h2>
        <p className="measure mt-4 text-slate-300">We build these into your existing tools and keep a person in charge of every decision.</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {aiByTeam.map((t) => (
            <article key={t.team} className="rounded-xl border border-line bg-ink-2 p-6">
              <h3 className="text-lg font-semibold">{t.team}</h3>
              <p className="mt-2 text-sm text-slate-300">{t.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
