"use client";
import { useState } from "react";

const passage = "Payment is due within forty-five (45) days of invoice receipt.";
type Decision = { who: string; what: string };

export default function ProcurementDemo() {
  const [asked, setAsked] = useState(false);
  const [flag, setFlag] = useState(true);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [comment, setComment] = useState("");

  const record = (what: string) => {
    setDecisions([{ who: "Analyst (you)", what: comment ? `${what}: ${comment}` : what }, ...decisions]);
    if (what === "Approved") setFlag(false);
    setComment("");
  };
  const reset = () => { setAsked(false); setFlag(true); setDecisions([]); setComment(""); };

  return (
    <div className="overflow-hidden rounded-xl border border-[#dbe2ec] bg-[#fbf9f4] text-[#172235]">
      <div className="flex items-center justify-between border-b border-[#dbe2ec] px-4 py-2 text-xs text-slate-500">
        <span>Sample workspace · Procurement</span>
        <button onClick={reset} className="rounded border border-slate-300 px-2 py-1 hover:bg-white">Reset example</button>
      </div>
      <div className="grid gap-px bg-[#dbe2ec] md:grid-cols-2">
        <div className="bg-[#fbf9f4] p-5 text-sm leading-relaxed">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">Vendor agreement · source</p>
          <p>1. Services are delivered per the attached schedule.</p>
          <p className="mt-2">2. <mark className={`rounded px-1 ${asked ? "bg-amber-200" : "bg-transparent"}`}>{passage}</mark></p>
          <p className="mt-2">3. Either party may terminate with thirty (30) days written notice.</p>
        </div>
        <div className="bg-white p-5 text-sm">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">Extracted fields · invoice</p>
          <div className="space-y-2">
            <div className="rounded border border-slate-200 p-2">Vendor <b className="float-right">Matched</b></div>
            <button onClick={() => setAsked(true)} className={`w-full rounded border p-2 text-left ${flag ? "border-amber-400 bg-amber-50" : "border-slate-200"}`}>
              Payment terms: 30 days <b className={`float-right ${flag ? "text-amber-800" : "text-emerald-700"}`}>{flag ? "Needs review" : "Approved"}</b>
            </button>
          </div>
          <button onClick={() => setAsked(true)} className="mt-4 rounded border border-slate-300 px-3 py-1.5 hover:bg-slate-50">Ask: what are the payment terms?</button>
          {asked && (
            <p className="mt-3 rounded bg-slate-50 p-3" aria-live="polite">
              The agreement states 45 days from receipt (clause 2, highlighted at left). The invoice says 30 days, so this item is flagged for your review.
            </p>
          )}
          <input value={comment} onChange={(e) => setComment(e.target.value)} aria-label="Comment" placeholder="Add a comment (optional)" className="mt-4 w-full rounded border border-slate-300 px-3 py-2" />
          <div className="mt-2 flex gap-2">
            <button onClick={() => record("Approved")} className="flex-1 rounded bg-[#172235] px-3 py-2 text-white">Approve</button>
            <button onClick={() => record("Returned for correction")} className="flex-1 rounded border border-slate-300 px-3 py-2">Return</button>
          </div>
          {decisions.length > 0 && <div className="mt-4 border-t pt-3 text-xs text-slate-600"><p className="mb-1 font-medium">Decision history</p>{decisions.map((d, i) => <p key={i}>{d.who} · {d.what}</p>)}</div>}
        </div>
      </div>
    </div>
  );
}
