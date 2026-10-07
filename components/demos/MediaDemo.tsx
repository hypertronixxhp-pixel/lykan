"use client";
import { useMemo, useState } from "react";

const DURATION = 120;
const lines = [
  { t: 12, text: "Welcome everyone, let's begin with the agenda." },
  { t: 41, text: "We agreed on the revised schedule for the second phase." },
  { t: 68, text: "Budget questions can go to the review thread." },
  { t: 95, text: "Next steps: confirm the schedule with the wider team." },
];
const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
type Clip = { title: string; start: number; end: number };

export default function MediaDemo() {
  const [q, setQ] = useState("");
  const [pos, setPos] = useState(0);
  const [clips, setClips] = useState<Clip[]>([]);
  const results = useMemo(() => (q.trim() ? lines.filter((l) => l.text.toLowerCase().includes(q.trim().toLowerCase())) : []), [q]);
  const active = [...lines].reverse().find((l) => l.t <= pos);

  const save = () => {
    if (!active) return;
    const next = lines.find((l) => l.t > active.t);
    setClips([...clips, { title: `Suggested: ${active.text.slice(0, 32)}…`, start: active.t, end: next ? next.t : DURATION }]);
  };
  const reset = () => { setQ(""); setPos(0); setClips([]); };

  return (
    <div className="overflow-hidden rounded-xl border border-[#2a2a33] bg-[#0a0a0d]">
      <div className="flex items-center justify-between border-b border-[#2a2a33] px-4 py-2 text-xs text-slate-400">
        <span>Sample workspace · Media</span>
        <button onClick={reset} className="rounded border border-[#2a2a33] px-2 py-1 hover:text-white">Reset example</button>
      </div>
      <div className="grid gap-4 p-4 md:grid-cols-[1fr_300px]">
        <div>
          <div className="flex h-44 items-center justify-center rounded bg-[#15151b] text-sm text-slate-500">Sample recording · {fmt(pos)} / {fmt(DURATION)}</div>
          <div className="relative mt-3 h-3 rounded bg-[#1d1d26]">
            {clips.map((c, i) => <div key={i} className="absolute h-3 rounded bg-violet-500/70" style={{ left: `${(c.start / DURATION) * 100}%`, width: `${((c.end - c.start) / DURATION) * 100}%` }} />)}
            <div className="absolute -top-1 h-5 w-0.5 bg-white" style={{ left: `${(pos / DURATION) * 100}%` }} />
          </div>
          <ul className="mt-4 space-y-1 text-sm" aria-label="Transcript">
            {lines.map((l) => (
              <li key={l.t}><button onClick={() => setPos(l.t)} className={`w-full rounded px-2 py-1 text-left ${active?.t === l.t ? "bg-violet-500/20 text-violet-100" : "text-slate-400 hover:text-white"}`}><span className="mr-2 text-xs text-slate-500">{fmt(l.t)}</span>{l.text}</button></li>
            ))}
          </ul>
          <button onClick={save} disabled={!active} className="mt-3 rounded bg-violet-500 px-3 py-2 text-sm font-medium text-white disabled:opacity-40">Save clip from current moment</button>
        </div>
        <div className="space-y-4 text-sm">
          <div>
            <label htmlFor="media-q" className="mb-1 block text-xs text-slate-400">Search transcript</label>
            <input id="media-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder='Try "schedule"' className="w-full rounded border border-[#2a2a33] bg-[#15151b] px-3 py-2 text-white" />
            <ul className="mt-2 space-y-1">
              {results.map((r) => <li key={r.t}><button onClick={() => setPos(r.t)} className="w-full rounded border border-[#2a2a33] p-2 text-left text-slate-200 hover:border-violet-400"><b className="text-violet-300">{fmt(r.t)}</b> {r.text}</button></li>)}
              {q && results.length === 0 && <li className="text-slate-500">No matches.</li>}
            </ul>
          </div>
          <div>
            <p className="mb-1 text-xs text-slate-400">Collection · Saved clips ({clips.length})</p>
            <ul className="space-y-1" aria-live="polite">
              {clips.map((c, i) => <li key={i} className="rounded border border-violet-500/40 p-2 text-slate-200">{c.title}<div className="text-xs text-violet-300">{fmt(c.start)}–{fmt(c.end)} · AI title suggestion, awaiting review</div></li>)}
              {clips.length === 0 && <li className="text-slate-500">No clips yet.</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
