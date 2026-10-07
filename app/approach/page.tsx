import type { Metadata } from "next";
import { ClosingCta, Eyebrow } from "@/components/ui";
import { PrivacyBlock } from "@/components/sections";
import { steps } from "@/lib/steps";

export const metadata: Metadata = { title: "Approach" };

export default function Approach() {
  return (
    <>
      <section className="py-20">
        <div className="wrap">
          <Eyebrow>Approach</Eyebrow>
          <h1 className="h-display max-w-2xl text-4xl sm:text-5xl">Discovery, delivery, communication, handover.</h1>
          <p className="measure mt-6 text-slate-300">We treat product plans and operational details as the client's information. Public descriptions are agreed with the client; deeper technical discussions happen directly with the relevant team.</p>
        </div>
      </section>
      <section className="light-band py-20">
        <div className="wrap">
          <ol className="space-y-5">
            {steps.map((s, i) => (
              <li key={s.title} className="grid gap-3 rounded-xl border border-line-light bg-white p-7 md:grid-cols-[80px_1fr_1fr]">
                <span className="text-2xl font-semibold text-steel">0{i + 1}</span>
                <div><h2 className="text-lg font-semibold">{s.title}</h2><p className="mt-1 text-slate-600">{s.text}</p></div>
                <p className="text-sm"><b>Tangible output</b><br />{s.output}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-sm text-slate-600">Some work cannot be shown publicly. In those cases, we can discuss our approach, responsibilities, and technical decisions at a level the client permits.</p>
        </div>
      </section>
      <PrivacyBlock />
      <ClosingCta />
    </>
  );
}
