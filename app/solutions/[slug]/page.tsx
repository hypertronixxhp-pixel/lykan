import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClosingCta, Eyebrow } from "@/components/ui";
import { getSolution, solutions } from "@/lib/solutions";
import LogisticsDemo from "@/components/demos/LogisticsDemo";
import ProcurementDemo from "@/components/demos/ProcurementDemo";
import MediaDemo from "@/components/demos/MediaDemo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => solutions.map((s) => ({ slug: s.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = getSolution((await params).slug);
  return s ? { title: s.name, description: s.intro } : {};
}

const demos: Record<string, React.ComponentType> = {
  "logistics-control-platform": LogisticsDemo,
  "procurement-intelligence-workspace": ProcurementDemo,
  "media-operations-hub": MediaDemo,
};

export default async function SolutionPage({ params }: Props) {
  const s = getSolution((await params).slug);
  if (!s) notFound();
  const Demo = demos[s.slug];

  return (
    <>
      <section className="py-20">
        <div className="wrap">
          <Eyebrow>{s.category} · {s.cloud}</Eyebrow>
          <h1 className="h-display max-w-3xl text-4xl sm:text-6xl">{s.headline}</h1>
          <p className="measure mt-6 text-lg text-slate-300">{s.intro}</p>
          <p className="mt-3 text-sm text-slate-500">A possible implementation uses {s.stack}. Illustrative example, not a client engagement.</p>
          <div className="mt-12"><Demo /></div>
        </div>
      </section>

      <section className="light-band py-20">
        <div className="wrap grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold">Who it serves</h2>
            <ul className="mt-4 space-y-2">{s.serves.map((x) => <li key={x} className="flex gap-2"><span className="text-steel">▸</span>{x}</li>)}</ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">The operational challenge</h2>
            <p className="mt-4 text-slate-600">{s.challenge}</p>
          </div>
        </div>
        <div className="wrap mt-16">
          <h2 className="text-2xl font-semibold">A guided product journey</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-5">
            {s.journey.map((j, i) => (
              <li key={j.title} className="rounded-xl border border-line-light bg-white p-5">
                <span className="text-sm font-medium text-steel">0{i + 1}</span>
                <h3 className="mt-1 font-semibold">{j.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{j.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-20">
        <div className="wrap">
          <h2 className="text-2xl font-semibold">Capabilities</h2>
          <div className="mt-6 overflow-hidden rounded-xl border border-line">
            {s.structure.map((r) => (
              <div key={r.area} className="grid gap-1 border-b border-line p-4 last:border-0 md:grid-cols-[240px_1fr]">
                <p className="font-medium">{r.area}</p><p className="text-slate-300">{r.features}</p>
              </div>
            ))}
          </div>
          <h3 className="mt-12 text-xl font-semibold">Applied AI</h3>
          <ul className="mt-4 space-y-2 text-slate-300">{s.ai.map((x) => <li key={x} className="flex gap-2"><span className="text-teal">▸</span>{x}</li>)}</ul>
          <p className="mt-4 text-sm text-slate-400">{s.honesty}</p>
        </div>
      </section>

      <section className="light-band py-20">
        <div className="wrap">
          <h2 className="text-2xl font-semibold">How the system is designed</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {s.architecture.map((layer) => (
              <div key={layer.label} className="rounded-xl border border-line-light bg-white p-5">
                <p className="text-xs uppercase tracking-wide text-steel">{layer.label}</p>
                <ul className="mt-3 space-y-2 text-sm">{layer.nodes.map((n) => <li key={n} className="rounded bg-stone px-3 py-2">{n}</li>)}</ul>
              </div>
            ))}
          </div>
          <ul className="mt-8 space-y-2 text-slate-700">{s.decisions.map((d) => <li key={d} className="flex gap-2"><span className="text-steel">▸</span>{d}</li>)}</ul>
          <h2 className="mt-14 text-2xl font-semibold">Where people stay in control</h2>
          <ul className="mt-4 space-y-2 text-slate-700">{s.control.map((d) => <li key={d} className="flex gap-2"><span className="text-steel">▸</span>{d}</li>)}</ul>
        </div>
      </section>

      <ClosingCta title={s.cta} text="Share the problem at a level you are comfortable with. We can discuss sensitive details in a direct conversation." />
    </>
  );
}
