import Link from "next/link";
import { Wordmark } from "./Header";
import { capabilityGroups } from "@/lib/services";
import { solutions } from "@/lib/solutions";

const columns: { heading: string; links: [label: string, href: string][] }[] = [
  { heading: "Company", links: [["About", "/about"], ["Approach", "/approach"], ["Work", "/work"], ["Contact", "/contact"]] },
  { heading: "Services", links: [...capabilityGroups.map((g): [string, string] => [g.name, `/services/${g.slug}`]), ["All services", "/services"]] },
  { heading: "Solutions", links: solutions.map((s) => [s.name, `/solutions/${s.slug}`]) },
  { heading: "Connect", links: [["Discuss a project", "/contact"], ["See what we build", "/solutions"], ["Interactive estimator", "/estimator"], ["Client portal demo", "/portal"]] },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink py-12 text-sm text-slate-400">
      <div className="wrap flex flex-col justify-between gap-10 lg:flex-row">
        <div className="lg:max-w-xs">
          <Wordmark />
          <p className="mt-3 max-w-xs">Lykan AI Studio. Complex products, quietly delivered.</p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {columns.map((c) => (
            <div key={c.heading}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">{c.heading}</h2>
              <ul className="mt-4 space-y-2">
                {c.links.map(([l, h]) => (
                  <li key={`${c.heading}-${l}`}><Link href={h} className="hover:text-white">{l}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <p className="wrap mt-10 text-xs text-slate-500">The solution showcases on this site are illustrative designs, not client engagements. Real client work is confidential.</p>
    </footer>
  );
}
