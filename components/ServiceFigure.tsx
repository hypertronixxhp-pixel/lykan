import type { ReactNode } from "react";
import type { FigureMotif } from "@/lib/services";

/** Original line-art motifs on a 160x120 grid. `t` strokes are teal, `s` strokes are steel. */
const motifs: Record<FigureMotif, { label: string; art: ReactNode }> = {
  compass: {
    label: "Line drawing of a compass inside a circle",
    art: (
      <>
        <circle className="s" cx="80" cy="60" r="44" />
        <circle className="s" cx="80" cy="60" r="36" strokeDasharray="2 5" />
        <path className="t" d="M80 22 L90 60 L80 98 L70 60 Z" />
        <path className="t" d="M42 60 L80 50 L118 60 L80 70 Z" />
        <circle className="t" cx="80" cy="60" r="3" />
      </>
    ),
  },
  layers: {
    label: "Line drawing of three stacked layers",
    art: (
      <>
        <path className="s" d="M80 24 L132 46 L80 68 L28 46 Z" />
        <path className="s" d="M28 60 L80 82 L132 60" />
        <path className="t" d="M28 74 L80 96 L132 74" />
        <path className="t" d="M28 46 V74 M132 46 V74" />
      </>
    ),
  },
  stack: {
    label: "Line drawing of a stack of horizontal service bars",
    art: (
      <>
        <rect className="t" x="34" y="20" width="92" height="20" rx="3" />
        <rect className="s" x="34" y="50" width="92" height="20" rx="3" />
        <rect className="t" x="34" y="80" width="92" height="20" rx="3" />
        <path className="s" d="M44 30 H70 M44 60 H70 M44 90 H70" />
        <circle className="t" cx="112" cy="30" r="3" />
        <circle className="s" cx="112" cy="60" r="3" />
        <circle className="t" cx="112" cy="90" r="3" />
      </>
    ),
  },
  gauge: {
    label: "Line drawing of a speed gauge with a needle",
    art: (
      <>
        <path className="s" d="M28 90 A52 52 0 0 1 132 90" />
        <path className="s" d="M36 90 A44 44 0 0 1 124 90" strokeDasharray="2 6" />
        <path className="t" d="M80 90 L108 52" />
        <circle className="t" cx="80" cy="90" r="5" />
        <path className="s" d="M28 90 H40 M120 90 H132 M80 38 V50" />
      </>
    ),
  },
  cloud: {
    label: "Line drawing of a cloud with connected nodes beneath it",
    art: (
      <>
        <path className="t" d="M46 70 A18 18 0 0 1 52 36 A28 28 0 0 1 106 38 A16 16 0 0 1 112 70 Z" />
        <path className="s" d="M60 70 V86 M80 70 V96 M100 70 V86" />
        <circle className="s" cx="60" cy="90" r="4" />
        <circle className="t" cx="80" cy="100" r="4" />
        <circle className="s" cx="100" cy="90" r="4" />
      </>
    ),
  },
  network: {
    label: "Line drawing of connected nodes forming a network",
    art: (
      <>
        <path className="s" d="M80 30 L36 56 M80 30 L124 56 M36 56 L56 94 M124 56 L104 94 M56 94 L104 94 M36 56 L124 56" />
        <path className="t" d="M80 30 L56 94 M80 30 L104 94" />
        <circle className="t" cx="80" cy="30" r="8" />
        <circle className="s" cx="36" cy="56" r="6" />
        <circle className="s" cx="124" cy="56" r="6" />
        <circle className="t" cx="56" cy="94" r="6" />
        <circle className="t" cx="104" cy="94" r="6" />
      </>
    ),
  },
  chart: {
    label: "Line drawing of a rising line chart over bars",
    art: (
      <>
        <path className="s" d="M28 100 H132 M28 100 V24" />
        <path className="s" d="M48 100 V80 M72 100 V68 M96 100 V56 M120 100 V44" />
        <path className="t" d="M40 84 L64 62 L88 70 L112 38 L124 30" />
        <path className="t" d="M114 30 H124 V40" />
      </>
    ),
  },
  shield: {
    label: "Line drawing of a shield with a keyhole",
    art: (
      <>
        <path className="t" d="M80 20 L120 34 V62 C120 82 104 96 80 104 C56 96 40 82 40 62 V34 Z" />
        <path className="s" d="M80 30 L110 40 V62 C110 76 98 87 80 94 C62 87 50 76 50 62 V40 Z" strokeDasharray="2 5" />
        <circle className="t" cx="80" cy="56" r="7" />
        <path className="t" d="M80 63 V78" />
      </>
    ),
  },
  check: {
    label: "Line drawing of a checklist with ticked items",
    art: (
      <>
        <rect className="s" x="34" y="16" width="92" height="88" rx="6" />
        <path className="t" d="M46 38 L52 44 L62 32 M46 62 L52 68 L62 56 M46 86 L52 92 L62 80" />
        <path className="s" d="M74 38 H114 M74 62 H114 M74 86 H100" />
      </>
    ),
  },
};

export function ServiceFigure({ n, title, motif }: { n: number; title: string; motif: FigureMotif }) {
  const { label, art } = motifs[motif];
  return (
    <figure className="m-0">
      <svg
        viewBox="0 0 160 120"
        role="img"
        aria-label={label}
        className="w-full max-w-sm fill-none stroke-[1.5] [&_.s]:stroke-steel [&_.t]:stroke-teal"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {art}
      </svg>
      <figcaption className="mt-3 text-xs uppercase tracking-[0.18em] text-steel">
        {`FIG. ${String(n).padStart(2, "0")} — ${title}`}
      </figcaption>
    </figure>
  );
}
