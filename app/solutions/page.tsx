import type { Metadata } from "next";
import Link from "next/link";
import { ClosingCta, Eyebrow } from "@/components/ui";
import { solutions } from "@/lib/solutions";

export const metadata: Metadata = { title: "Solutions" };

export default function Solutions() {
  return (
    <>
      <section className="py-20">
        <div className="wrap">
          <Eyebrow>Solutions</Eyebrow>
          <h1 className="h-display max-w-2xl text-4xl sm:text-5xl">Systems shaped around demanding workflows</h1>
          <p className="measure mt-6 text-slate-300">Three example systems showing how we would approach different products, stacks, and clouds. They are illustrative designs, not client engagements.</p>
          <div className="mt-12 space-y-5">
            {solutions.map((s) => (
              <Link key={s.slug} href={`/solutions/${s.slug}`} className="block rounded-xl border border-line bg-ink-2 p-8 hover:border-teal">
                <p className="text-xs text-steel">{s.category} · {s.cloud}</p>
                <h2 className="mt-2 text-2xl font-semibold">{s.name}</h2>
                <p className="mt-2 text-slate-300">{s.short}</p>
                <p className="mt-3 text-sm text-slate-500">{s.stack}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <ClosingCta />
    </>
  );
}
