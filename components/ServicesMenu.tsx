"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { capabilityGroups } from "@/lib/services";

// The panel stays in the DOM (hidden when closed) so the service links are present
// in the server HTML and crawlable.
export default function ServicesMenu() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const linkClass = "block rounded px-3 py-2 text-slate-300 hover:bg-line/40 hover:text-white";

  return (
    <div
      ref={root}
      className="relative"
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          setOpen(false);
          button.current?.focus();
        }
      }}
      onBlur={(e) => {
        if (open && !root.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={button}
        type="button"
        className="inline-flex items-center gap-1 hover:text-white"
        aria-expanded={open}
        aria-controls="services-menu"
        onClick={() => setOpen(!open)}
      >
        Services
        <svg aria-hidden="true" viewBox="0 0 12 12" className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2.5 4.5 6 8l3.5-3.5" />
        </svg>
      </button>
      <ul
        id="services-menu"
        hidden={!open}
        className="absolute left-0 top-full z-50 mt-3 w-72 max-w-[calc(100vw-2rem)] rounded-lg border border-line bg-ink-2 p-2 shadow-xl"
      >
        {capabilityGroups.map((g) => (
          <li key={g.slug}>
            <Link href={`/services/${g.slug}`} className={linkClass} onClick={() => setOpen(false)}>{g.name}</Link>
          </li>
        ))}
        <li className="mt-1 border-t border-line pt-1">
          <Link href="/services" className={`${linkClass} font-medium text-teal`} onClick={() => setOpen(false)}>All services</Link>
        </li>
      </ul>
    </div>
  );
}
