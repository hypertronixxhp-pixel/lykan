import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClosingCta, Eyebrow } from "@/components/ui";
import { CaseSection, ProjectCard } from "@/components/CaseCards";
import { getProject, projects } from "@/lib/work";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => projects.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProject((await params).slug);
  return p ? { title: p.title, description: p.summary } : {};
}

export default async function CasePage({ params }: Props) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const more = projects.filter((x) => x.slug !== p.slug).slice(0, 2);

  return (
    <>
      <section className="py-20">
        <div className="wrap grid gap-12 md:grid-cols-[1.4fr_1fr]">
          <div>
            <Eyebrow>{p.category}</Eyebrow>
            <h1 className="h-display max-w-2xl text-4xl sm:text-6xl">{p.title}</h1>
            <p className="measure mt-6 text-lg text-slate-300">{p.summary}</p>
            {p.highlights.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-2" aria-label="Highlights">
                {p.highlights.map((h) => (
                  <li key={h} className="rounded-full border border-teal/40 px-4 py-1.5 text-sm text-teal">{h}</li>
                ))}
              </ul>
            )}
          </div>
          <aside aria-label="Details" className="self-start rounded-xl border border-line bg-ink-2 p-7">
            <h2 className="text-lg font-semibold">Details</h2>
            <dl className="mt-5 space-y-5">
              <div>
                <dt className="text-xs uppercase tracking-[0.18em] text-steel">Industry</dt>
                <dd className="mt-1 text-slate-200">{p.industry}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.18em] text-steel">Scope</dt>
                <dd className="mt-2">
                  <ul className="flex flex-wrap gap-2">
                    {p.scope.map((s) => <li key={s} className="rounded-full border border-line px-3 py-1 text-xs text-slate-300">{s}</li>)}
                  </ul>
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="light-band py-20">
        <div className="wrap space-y-12">
          <CaseSection title="Project summary" text={p.sections.summary} />
          <CaseSection title="About the client" text={p.sections.client} />
          <CaseSection title="Challenge" text={p.sections.challenge} />
          <CaseSection title="Solution" text={p.sections.solution} />
          <CaseSection title="Results" text={p.sections.results} />
        </div>
      </section>

      <section className="py-20">
        <div className="wrap">
          <Eyebrow>Work</Eyebrow>
          <h2 className="h-display max-w-2xl text-3xl sm:text-4xl">More work this way</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {more.map((x) => <ProjectCard key={x.slug} p={x} />)}
          </div>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
