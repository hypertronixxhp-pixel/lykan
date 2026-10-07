import type { Metadata } from "next";
import { ClosingCta, Eyebrow } from "@/components/ui";

export const metadata: Metadata = { title: "About" };

export default function About() {
  return (
    <>
      <section className="py-20">
        <div className="wrap">
          <Eyebrow>About</Eyebrow>
          <h1 className="h-display max-w-2xl text-4xl sm:text-5xl">A private engineering partner.</h1>
          <p className="measure mt-6 text-slate-300">Lykan Cloud &amp; AI Services designs and builds web applications, cloud platforms, and AI-powered workflows.</p>
          {/* TODO(content): replace with approved company details — trading name, location, team, and privacy practices. */}
          <div className="mt-10 rounded-xl border border-dashed border-line p-6 text-sm text-slate-400">
            Company and team details will be added here once approved.
          </div>
        </div>
      </section>
      <ClosingCta />
    </>
  );
}
