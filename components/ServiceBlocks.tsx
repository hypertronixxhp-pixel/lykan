import Link from "next/link";
import { Eyebrow } from "@/components/ui";
import { ProjectCard } from "@/components/CaseCards";
import { capabilityGroups } from "@/lib/services";
import { projects } from "@/lib/work";

export function StandOutGrid({ service, items }: { service: string; items: { title: string; text: string }[] }) {
  return (
    <section className="py-20">
      <div className="wrap">
        <h2 className="h-display max-w-2xl text-3xl sm:text-4xl">{`What makes our ${service} stand out`}</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {items.slice(0, 4).map((i) => (
            <article key={i.title} className="rounded-xl border border-line bg-ink-2 p-6">
              <h3 className="text-lg font-semibold">{i.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{i.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ExploreServices({ exclude }: { exclude: string }) {
  const start = capabilityGroups.findIndex((g) => g.slug === exclude);
  const others = capabilityGroups.filter((g) => g.slug !== exclude);
  // The three groups that follow the excluded one, wrapping around.
  const ordered = start < 0 ? others : [...others.slice(start), ...others.slice(0, start)];
  return (
    <section className="py-20">
      <div className="wrap">
        <Eyebrow>Keep exploring</Eyebrow>
        <h2 className="h-display max-w-2xl text-3xl sm:text-4xl">Explore our other services</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {ordered.slice(0, 3).map((g) => (
            <Link key={g.slug} href={`/services/${g.slug}`} className="group rounded-xl border border-line bg-ink-2 p-6 transition-colors hover:border-teal">
              <h3 className="text-lg font-semibold group-hover:text-teal">{g.name}</h3>
              <p className="mt-2 text-sm text-slate-300">{g.summary}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RecentWork({ serviceSlug }: { serviceSlug: string }) {
  const related = projects.filter((p) => p.relatedServices.includes(serviceSlug));
  const shown = (related.length > 0 ? related : projects).slice(0, 2);
  return (
    <section className="py-20">
      <div className="wrap">
        <Eyebrow>Work</Eyebrow>
        <h2 className="h-display max-w-2xl text-3xl sm:text-4xl">Recent work</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {shown.map((p) => <ProjectCard key={p.slug} p={p} />)}
        </div>
      </div>
    </section>
  );
}
