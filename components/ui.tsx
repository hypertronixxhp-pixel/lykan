import Link from "next/link";
import type { ReactNode } from "react";

export function Button({ href, children, variant = "primary", className = "" }: { href: string; children: ReactNode; variant?: "primary" | "ghost" | "ghostLight"; className?: string }) {
  const base = "inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-medium transition-colors";
  const styles = {
    primary: "bg-teal text-ink hover:bg-[#5fd6d3]",
    ghost: "border border-white/20 text-white hover:border-teal hover:text-teal",
    ghostLight: "border border-[#172235]/25 text-text hover:border-[#0b1220] hover:bg-white",
  }[variant];
  return <Link href={href} className={`${base} ${styles} ${className}`}>{children}</Link>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-teal">{children}</p>;
}

export function ClosingCta({ title = "Tell us what your team needs to build.", text = "Share the problem at a level you are comfortable with. We can discuss sensitive details in a direct conversation.", button = "Start a private conversation" }: { title?: string; text?: string; button?: string }) {
  return (
    <section className="bg-ink py-24">
      <div className="wrap text-center">
        <h2 className="h-display mx-auto max-w-2xl text-3xl sm:text-5xl">{title}</h2>
        <p className="mx-auto mt-5 max-w-xl text-slate-300">{text}</p>
        <Button href="/contact" className="mt-8">{button}</Button>
      </div>
    </section>
  );
}
