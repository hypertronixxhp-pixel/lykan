import type { Metadata } from "next";
import { ClosingCta, Eyebrow } from "@/components/ui";
import { AiByTeam, PrivacyBlock, TechStack, WaysToStart, WorkTypes } from "@/components/sections";
import { capabilityGroups } from "@/lib/services";

export const metadata: Metadata = { title: "Services" };

const rows = [
  ["A new digital product", "Product and web application engineering", "Customer portal, marketplace, internal platform"],
  ["Disconnected systems brought together", "Cloud and integration engineering", "APIs, data pipelines, deployment infrastructure"],
  ["Manual work reduced", "Applied AI and automation", "Document review, search, prediction, media analysis"],
  ["A trusted long-term team", "Product delivery and support", "Discovery, build, launch, improvement"],
];

export default function Services() {
  return (
    <>
      <section className="py-20">
        <div className="wrap">
          <Eyebrow>Services</Eyebrow>
          <h1 className="h-display max-w-2xl text-4xl sm:text-5xl">Start with the problem. We'll choose the technology.</h1>
          <p className="measure mt-6 text-slate-300">From an internal operations platform to a customer-facing product, we bring product design, full-stack engineering, cloud infrastructure, and applied AI into one delivery team.</p>
        </div>
      </section>
      <section className="light-band py-20">
        <div className="wrap space-y-4">
          {rows.map(([need, offer, ex]) => (
            <div key={need} className="grid gap-2 rounded-xl border border-line-light bg-white p-6 md:grid-cols-3 md:gap-8">
              <div><p className="text-xs uppercase tracking-wide text-slate-500">A client needs</p><p className="font-semibold">{need}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-slate-500">Lykan offers</p><p>{offer}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-slate-500">Examples</p><p className="text-slate-600">{ex}</p></div>
            </div>
          ))}
        </div>
      </section>
      <section className="py-20">
        <div className="wrap">
          <h2 className="h-display max-w-2xl text-3xl sm:text-4xl">Everything we do</h2>
          <div className="mt-10 space-y-5">
            {capabilityGroups.map((g) => (
              <div key={g.name} className="grid gap-4 rounded-xl border border-line bg-ink-2 p-7 md:grid-cols-[1fr_1.4fr] md:gap-10">
                <div>
                  <h3 className="text-xl font-semibold">{g.name}</h3>
                  <p className="mt-2 text-sm text-slate-300">{g.summary}</p>
                </div>
                <ul className="grid gap-2 text-slate-200 sm:grid-cols-2">
                  {g.items.map((i) => <li key={i} className="flex gap-2 text-sm"><span className="text-teal">▸</span>{i}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      <AiByTeam />
      <TechStack />
      <WorkTypes />
      <WaysToStart />
      <PrivacyBlock />
      <ClosingCta />
    </>
  );
}
