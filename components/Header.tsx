"use client";
import Link from "next/link";
import { useState } from "react";
import { nav, type ServiceLink } from "@/lib/nav";
import ServicesMenu from "./ServicesMenu";


export function LogoMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect width="28" height="28" rx="7" fill="#111A2E" stroke="#263249" />
      <path d="M7 8V20H11" stroke="#38C6C3" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 14L19 8M15.5 12.5L20 20" stroke="#658CB8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="20" cy="8" r="1.5" fill="#38C6C3" />
    </svg>
  );
}

export function Wordmark() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark />
      <span className="flex items-baseline gap-1.5 text-base font-semibold tracking-[0.16em] text-white">
        LYKAN <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-teal">AI STUDIO</span>
      </span>
    </span>
  );
}

const otherLinks = nav.filter(([, h]) => h !== "/services");

export default function Header({ services }: { services: ServiceLink[] }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between">
        <Link href="/" aria-label="Lykan AI Studio, home" onClick={() => setOpen(false)}><Wordmark /></Link>
        <nav aria-label="Primary" className="hidden items-center gap-8 text-sm text-slate-300 lg:flex">
          <ServicesMenu services={services} />
          {otherLinks.map(([l, h]) => <Link key={h} href={h} className="hover:text-white">{l}</Link>)}
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
          <Link href="/services" onClick={() => setOpen(false)} className="py-3 text-slate-200">Services</Link>
          {services.map((g) => (
            <Link key={g.slug} href={`/services/${g.slug}`} onClick={() => setOpen(false)} className="py-2 pl-4 text-sm text-slate-400">{g.name}</Link>
          ))}
          {otherLinks.map(([l, h]) => <Link key={h} href={h} onClick={() => setOpen(false)} className="py-3 text-slate-200">{l}</Link>)}
        </nav>
      )}
    </header>
  );
}
