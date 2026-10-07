import Link from "next/link";
import { Wordmark } from "./Header";
import { nav } from "@/lib/nav";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink py-12 text-sm text-slate-400">
      <div className="wrap flex flex-col justify-between gap-8 sm:flex-row">
        <div>
          <Wordmark />
          <p className="mt-3 max-w-xs">Lykan Cloud &amp; AI Services. Complex products, quietly delivered.</p>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {nav.map(([l, h]) => (
            <li key={h}><Link href={h} className="hover:text-white">{l}</Link></li>
          ))}
        </ul>
      </div>
      <p className="wrap mt-8 text-xs text-slate-500">The solution showcases on this site are illustrative designs, not client engagements. Real client work is confidential.</p>
    </footer>
  );
}
