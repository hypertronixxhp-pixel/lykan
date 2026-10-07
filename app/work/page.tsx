import type { Metadata } from "next";
import { ClosingCta, Eyebrow } from "@/components/ui";
import { CaseGrid, WORK_NOTE } from "@/components/CaseCards";
import { projects } from "@/lib/work";

export const metadata: Metadata = { title: "Work" };

export default function Work() {
  return (
    <>
      <section className="py-20">
        <div className="wrap">
          <Eyebrow>Work</Eyebrow>
          <h1 className="h-display max-w-3xl text-4xl sm:text-5xl">Products we have built, shared on our clients' terms.</h1>
          <p className="measure mt-6 text-slate-300">{WORK_NOTE} Each project is described by type and by the services we provided, so you can see the range without exposing anyone's business.</p>
          <div className="mt-12">
            <CaseGrid items={projects} />
          </div>
          <p className="mt-10 text-sm text-slate-400">Want to know whether we have done something close to what you need? Ask. We can talk through relevant experience directly.</p>
        </div>
      </section>
      <ClosingCta />
    </>
  );
}
