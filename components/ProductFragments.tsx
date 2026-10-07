// Static interface fragments for the hero. Sample data only; no client names or metrics.
export function LogisticsFragment() {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-[#141c2e] text-xs" role="img" aria-label="Logistics map with a selected late shipment and exception panel">
      <div className="flex">
        <div className="relative h-52 flex-1 bg-[#0f1728]">
          <svg viewBox="0 0 300 200" className="h-full w-full">
            <path d="M20 160 C80 150 90 80 150 90 S230 40 285 50" stroke="#658cb8" strokeWidth="2" fill="none" />
            <path d="M30 40 C90 60 120 120 180 130 S250 150 280 170" stroke="#38c6c3" strokeWidth="2" strokeDasharray="4 4" fill="none" />
            {[[150, 90], [180, 130], [90, 110]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" fill={i === 1 ? "#f2b84b" : "#38c6c3"} />)}
          </svg>
        </div>
        <div className="w-40 border-l border-line bg-white p-3 text-[#172235]">
          <p className="font-semibold">Exception</p>
          <span className="mt-1 inline-block rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-800">At risk</span>
          <p className="mt-2 text-[11px] text-slate-600">Predicted arrival slipping. Owner unassigned.</p>
        </div>
      </div>
    </div>
  );
}
export function DocumentFragment() {
  return (
    <div className="flex overflow-hidden rounded-lg border border-[#dbe2ec] bg-[#fbf9f4] text-xs text-[#172235]" role="img" aria-label="Document viewer beside extracted fields with one flagged mismatch">
      <div className="flex-1 space-y-2 p-4">
        <div className="h-2 w-2/3 rounded bg-slate-300" /><div className="h-2 w-full rounded bg-slate-200" />
        <div className="h-2 w-full rounded bg-amber-200" /><div className="h-2 w-5/6 rounded bg-slate-200" />
      </div>
      <div className="w-44 space-y-2 border-l border-[#dbe2ec] bg-white p-3">
        <div className="rounded border border-slate-200 p-1.5">Vendor <b>Matched</b></div>
        <div className="rounded border border-amber-300 bg-amber-50 p-1.5">Payment terms <b className="text-amber-800">Needs review</b></div>
        <div className="rounded bg-[#172235] p-1.5 text-center text-white">Approve</div>
      </div>
    </div>
  );
}
export function VideoFragment() {
  return (
    <div className="overflow-hidden rounded-lg border border-[#2a2a33] bg-[#0a0a0d] p-3 text-xs" role="img" aria-label="Video timeline with a saved clip range and a highlighted transcript result">
      <div className="h-24 rounded bg-[#15151b]" />
      <div className="relative mt-3 h-3 rounded bg-[#1d1d26]"><div className="absolute left-[30%] h-3 w-[22%] rounded bg-violet-500/70" /><div className="absolute left-[41%] -top-1 h-5 w-0.5 bg-white" /></div>
      <p className="mt-3 rounded bg-violet-500/15 px-2 py-1 text-violet-200">00:41 “…agreed on the revised schedule…”</p>
    </div>
  );
}
