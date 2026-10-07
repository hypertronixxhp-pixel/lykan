"use client";
import { useState } from "react";
import { capabilityGroups } from "@/lib/services";

type State = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState("sending"); setErrors({});
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.status === 422) { setErrors((await res.json()).errors ?? {}); setState("idle"); return; }
      if (!res.ok) throw new Error();
      form.reset(); setState("success");
    } catch { setState("error"); }
  }

  if (state === "success")
    return <p role="status" className="rounded-xl border border-teal/40 bg-teal/10 p-6">Thank you. We've received your message and will reply directly.</p>;

  const field = "mt-1 w-full rounded-md border border-line bg-ink-2 px-3 py-2.5 text-white";
  const Err = ({ k }: { k: string }) => errors[k] ? <p id={`${k}-err`} className="mt-1 text-sm text-red-300">{errors[k][0]}</p> : null;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {[["name", "Name", "text"], ["email", "Email", "email"], ["company", "Company (optional)", "text"]].map(([k, l, t]) => (
        <div key={k}>
          <label htmlFor={k} className="text-sm text-slate-300">{l}</label>
          <input id={k} name={k} type={t} className={field} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `${k}-err` : undefined} autoComplete={k === "name" ? "name" : k === "email" ? "email" : "organization"} />
          <Err k={k} />
        </div>
      ))}
      <div>
        <label htmlFor="topic" className="text-sm text-slate-300">What do you need? (optional)</label>
        <select id="topic" name="topic" defaultValue="" className={field}>
          <option value="">Not sure yet</option>
          {capabilityGroups.map((g) => <option key={g.name} value={g.name}>{g.name}</option>)}
          <option value="Something else">Something else</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="text-sm text-slate-300">What do you need to build?</label>
        <textarea id="message" name="message" rows={6} className={field} aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-err" : undefined} placeholder="Share the problem at a level you are comfortable with." />
        <Err k="message" />
      </div>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      {state === "error" && <p role="alert" className="text-sm text-red-300">Something went wrong sending your message. Please try again shortly.</p>}
      <button disabled={state === "sending"} className="rounded-md bg-teal px-6 py-3 font-medium text-ink disabled:opacity-60">{state === "sending" ? "Sending…" : "Start a private conversation"}</button>
    </form>
  );
}
