"use client";
import { useState } from "react";

type Status = "On schedule" | "At risk" | "Delayed" | "Resolved";
type Ship = { id: string; route: string; driver: string; status: Status; eta: string; note: string; owner?: string };

const initial: Ship[] = [
  { id: "SH-1042", route: "Route 3 · North", driver: "Driver A", status: "At risk", eta: "14:35 (predicted)", note: "Traffic reported on the route; predicted arrival moving later." },
  { id: "SH-1043", route: "Route 3 · North", driver: "Driver A", status: "On schedule", eta: "15:10", note: "No issues." },
  { id: "SH-1051", route: "Route 7 · East", driver: "Driver B", status: "Delayed", eta: "16:20", note: "Proof-of-delivery photo flagged for review." },
  { id: "SH-1060", route: "Route 9 · South", driver: "Driver C", status: "On schedule", eta: "13:55", note: "No issues." },
];
const chip: Record<Status, string> = {
  "On schedule": "bg-emerald-100 text-emerald-800", "At risk": "bg-amber-100 text-amber-800",
  Delayed: "bg-red-100 text-red-800", Resolved: "bg-slate-200 text-slate-700",
};

export default function LogisticsDemo() {
  const [ships, setShips] = useState<Ship[]>(initial);
  const [sel, setSel] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const cur = ships.find((s) => s.id === sel);
  const count = (s: Status) => ships.filter((x) => x.status === s).length;

  const assign = () => {
    if (!cur) return;
    setShips(ships.map((s) => (s.id === cur.id ? { ...s, status: "Resolved", owner: "Dispatcher (you)" } : s)));
    setLog([`${cur.id}: assigned to Dispatcher, marked Resolved`, ...log]);
  };
  const reset = () => { setShips(initial); setSel(null); setLog([]); };

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-[#141c2e]">
      <div className="flex items-center justify-between border-b border-line px-4 py-2 text-xs text-slate-400">
        <span>Sample workspace · Logistics</span>
        <button onClick={reset} className="rounded border border-line px-2 py-1 hover:text-white">Reset example</button>
      </div>
      <div className="grid gap-px bg-line md:grid-cols-[1fr_320px]">
        <div className="bg-white p-4 text-[#172235]">
          <div className="mb-4 grid grid-cols-4 gap-2 text-center text-xs">
            {(["On schedule", "At risk", "Delayed", "Resolved"] as Status[]).map((s) => (
              <div key={s} className="rounded border border-slate-200 p-2"><div className="text-xl font-semibold" aria-live="polite">{count(s)}</div>{s}</div>
            ))}
          </div>
          <ul className="space-y-2">
            {ships.map((s) => (
              <li key={s.id}>
                <button onClick={() => setSel(s.id)} aria-pressed={sel === s.id}
                  className={`flex w-full items-center justify-between rounded border p-3 text-left text-sm ${sel === s.id ? "border-teal bg-teal/10" : "border-slate-200 hover:bg-slate-50"}`}>
                  <span><b>{s.id}</b> <span className="text-slate-500">· {s.route}</span></span>
                  <span className={`rounded px-2 py-0.5 text-xs ${chip[s.status]}`}>{s.status}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-500">Select a delivery to open its exception panel.</p>
        </div>
        <aside className="bg-[#1b2438] p-4 text-sm" aria-label="Exception panel">
          {cur ? (
            <>
              <div className="flex items-center justify-between"><b>{cur.id}</b><span className={`rounded px-2 py-0.5 text-xs ${chip[cur.status]}`}>{cur.status}</span></div>
              <dl className="mt-3 space-y-1 text-slate-300">
                <div><dt className="inline text-slate-500">Driver: </dt><dd className="inline">{cur.driver}</dd></div>
                <div><dt className="inline text-slate-500">ETA: </dt><dd className="inline">{cur.eta}</dd></div>
                <div><dt className="inline text-slate-500">Owner: </dt><dd className="inline">{cur.owner ?? "Unassigned"}</dd></div>
              </dl>
              <p className="mt-3 text-slate-300">{cur.note}</p>
              <p className="mt-2 text-xs text-slate-500">ETA is a prediction; the dispatcher decides.</p>
              <button onClick={assign} disabled={cur.status === "Resolved"} className="mt-4 w-full rounded bg-teal px-3 py-2 font-medium text-ink disabled:opacity-40">
                Assign to me and resolve
              </button>
            </>
          ) : <p className="text-slate-400">No delivery selected.</p>}
          {log.length > 0 && (
            <div className="mt-5 border-t border-line pt-3 text-xs text-slate-400"><p className="mb-1 font-medium text-slate-300">Event history</p>{log.map((l, i) => <p key={i}>{l}</p>)}</div>
          )}
        </aside>
      </div>
    </div>
  );
}
