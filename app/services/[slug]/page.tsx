import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClosingCta, Eyebrow } from "@/components/ui";
import { Faq } from "@/components/Faq";
import { ServiceFigure } from "@/components/ServiceFigure";
import { ExploreServices, RecentWork, StandOutGrid } from "@/components/ServiceBlocks";
import { capabilityGroups, getGroup } from "@/lib/services";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => capabilityGroups.map((g) => ({ slug: g.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = getGroup((await params).slug);
  return g ? { title: g.name, description: g.summary } : {};
}

/** Lower-case the leading letter for use mid-sentence, keeping acronyms such as "AI" intact. */
const inSentence = (name: string) => name.replace(/^[A-Z](?![A-Z])/, (c) => c.toLowerCase());

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const g = getGroup(slug);
  if (!g) notFound();

  return (
    <>
      <section className="py-20">
        <div className="wrap grid items-center gap-12 md:grid-cols-[1.3fr_1fr]">
          <div>
            <Eyebrow>Service</Eyebrow>
            <h1 className="h-display max-w-2xl text-4xl sm:text-6xl">{g.name}</h1>
            <p className="measure mt-6 text-lg text-slate-300">{g.summary}</p>
          </div>
          <ServiceFigure n={g.figure.n} title={g.figure.title} motif={g.figure.motif} />
        </div>
      </section>

      <StandOutGrid service={inSentence(g.name)} items={g.standOut} />

      <section className="light-band py-20">
        <div className="wrap grid gap-12 md:grid-cols-2">
          <div>
            <Eyebrow>In practice</Eyebrow>
            <p className="h-display max-w-xl text-2xl sm:text-3xl">{g.inPractice}</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">What we offer</h2>
            <ul className="mt-4 space-y-2 text-slate-700">
              {g.items.map((item) => (
                <li key={item} className="flex gap-2"><span className="text-steel">▸</span>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <RecentWork serviceSlug={g.slug} />

      <section className="light-band py-20">
        <div className="wrap">
          <h2 className="h-display max-w-2xl text-3xl sm:text-4xl">{`Questions about ${inSentence(g.name)}`}</h2>
          <div className="mt-10"><Faq items={g.faqs} tone="light" /></div>
        </div>
      </section>

      <ExploreServices exclude={g.slug} />
      <ClosingCta />
    </>
  );
}
