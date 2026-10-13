import type { Metadata } from "next";
import { ClosingCta, Eyebrow } from "@/components/ui";
import Estimator from "@/components/Estimator";

export const metadata: Metadata = {
  title: "Interactive Scope & Architecture Estimator",
  description:
    "Scope technical capabilities, map architecture stacks, and generate milestone delivery plans for bespoke software and automation initiatives.",
};

export default function EstimatorPage() {
  return (
    <>
      <section className="py-20">
        <div className="wrap">
          <Eyebrow>Self-Serve Architecture Planning</Eyebrow>
          <h1 className="h-display max-w-3xl text-4xl sm:text-5xl">
            Interactive Scope &amp; Architecture Estimator
          </h1>
          <p className="measure mt-6 text-slate-300">
            Define your operational priorities, configure key technical capabilities, and preview
            the recommended architecture blueprint and milestone stages for your initiative.
          </p>

          <div className="mt-12">
            <Estimator />
          </div>
        </div>
      </section>

      <ClosingCta
        title="Ready to turn this blueprint into production software?"
        text="Review your scoped requirements directly with our engineering team under strict operational confidentiality."
        button="Discuss your project"
      />
    </>
  );
}
