import type { Metadata } from "next";
import { ClosingCta, Eyebrow } from "@/components/ui";
import { claims } from "@/lib/claims";

export const metadata: Metadata = {
  title: "About",
  description: "Lykan AI Studio is a private engineering partner that designs and builds web applications, cloud platforms and AI-powered workflows.",
};

const principles = [
  {
    title: "Your information stays yours",
    text: "Product plans and operational details belong to the client. We share them only with the people who need them to do the work.",
  },
  {
    title: "Plain, maintainable engineering",
    text: "We favour clear, well-documented systems your own team can read, run and extend, rather than clever ones only we understand.",
  },
  {
    title: "Honest about scope",
    text: "We say what is realistic for the problem in front of us, and we flag trade-offs early instead of leaving them for later.",
  },
];

export default function About() {
  return (
    <>
      <section className="py-20">
        <div className="wrap">
          <Eyebrow>About</Eyebrow>
          <h1 className="h-display max-w-2xl text-4xl sm:text-5xl">A private engineering partner.</h1>
          <p className="measure mt-6 text-slate-300">Lykan AI Studio designs and builds web applications, cloud platforms, and AI-powered workflows.</p>
        </div>
      </section>
      <section className="light-band py-20">
        <div className="wrap">
          <Eyebrow tone="light">How we work</Eyebrow>
          <ol className="space-y-5">
            {principles.map((p, i) => (
              <li key={p.title} className="grid gap-3 rounded-xl border border-line-light bg-white p-7 md:grid-cols-[80px_1fr]">
                <span className="text-2xl font-semibold text-steel">0{i + 1}</span>
                <div>
                  <h2 className="text-lg font-semibold">{p.title}</h2>
                  <p className="mt-1 text-slate-600">{p.text}</p>
                </div>
              </li>
            ))}
          </ol>
          {claims.timeline && <p className="mt-8 text-sm text-slate-600">{`How long projects take: ${claims.timeline}`}</p>}
        </div>
      </section>
      <ClosingCta />
    </>
  );
}
