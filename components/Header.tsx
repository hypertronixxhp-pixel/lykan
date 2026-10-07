"use client";
import Link from "next/link";
import { useState } from "react";
import { nav } from "@/lib/nav";


export function Wordmark() {
  return <span className="text-lg font-semibold tracking-[0.2em]">LYKAN<span className="text-teal">.</span></span>;
}

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between">
        <Link href="/" aria-label="Lykan Cloud & AI Services, home" onClick={() => setOpen(false)}><Wordmark /></Link>
        <nav aria-label="Primary" className="hidden items-center gap-8 text-sm text-slate-300 lg:flex">
          {nav.map(([l, h]) => <Link key={h} href={h} className="hover:text-white">{l}</Link>)}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/contact" className="rounded-md bg-teal px-4 py-2 text-sm font-medium text-ink hover:bg-[#5fd6d3]">
            <span className="hidden sm:inline">Discuss a project</span><span className="sm:hidden">Contact</span>
          </Link>
          <button className="rounded-md border border-line px-3 py-2 text-sm lg:hidden" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="wrap flex flex-col gap-1 border-t border-line pb-4 pt-2 lg:hidden">
          {nav.map(([l, h]) => <Link key={h} href={h} onClick={() => setOpen(false)} className="py-3 text-slate-200">{l}</Link>)}
        </nav>
      )}
    </header>
  );
}
