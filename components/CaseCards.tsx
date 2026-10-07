import Link from "next/link";
import { Button, Eyebrow } from "@/components/ui";
import { projects, type Project } from "@/lib/work";

export const WORK_NOTE = "Client names, locations, and figures are withheld by agreement.";

export function ProjectCard({ p }: { p: Project }) {
  return (
    <Link href={`/work/${p.slug}`} className="group block h-full">
      <article className="flex h-full flex-col rounded-xl border border-line bg-ink-2 p-7 transition-colors group-hover:border-teal">
        <p className="text-xs text-steel">{p.category}</p>
        <h3 className="mt-2 text-xl font-semibold">{p.title}</h3>
        <p className="mt-2 text-slate-300">{p.summary}</p>
        <ul className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4" aria-label="Services provided">
          {p.scope.map((s) => <li key={s} className="rounded-full border border-line px-3 py-1 text-xs text-slate-300">{s}</li>)}
        </ul>
        <p className="mt-5 text-sm font-medium text-teal">
          View case <span aria-hidden="true">→</span>
        </p>
      </article>
    </Link>
  );
}

/** One stacked section of a case page. Renders nothing when there is no text, so empty headings never appear. */
export function CaseSection({ title, text }: { title: string; text?: string }) {
  if (!text || !text.trim()) return null;
  return (
    <section>
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="measure mt-3 text-slate-700">{text}</p>
    </section>
  );
}

export function CaseGrid({ items }: { items: Project[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => <ProjectCard key={p.slug} p={p} />)}
    </div>
  );
}

export function WorkPreview() {
  return (
    <section className="py-24">
      <div className="wrap">
        <Eyebrow>Work</Eyebrow>
        <h2 className="h-display max-w-2xl text-3xl sm:text-4xl">Projects we have delivered, described discreetly</h2>
        <p className="measure mt-4 text-slate-300">{WORK_NOTE}</p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {projects.slice(0, 3).map((p) => <ProjectCard key={p.slug} p={p} />)}
        </div>
        <Button href="/work" variant="ghost" className="mt-8">See all work</Button>
      </div>
    </section>
  );
}
