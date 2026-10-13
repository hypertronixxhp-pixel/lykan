"use client";
import { useState } from "react";

type State = "idle" | "sending" | "success" | "error";

// Where submissions go. Unset = this site's own /api/contact route. The static GitHub Pages build sets
// NEXT_PUBLIC_CONTACT_ENDPOINT to an external form URL, or to "" when none is configured (preview mode).
const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? "/api/contact";
const CONNECTED = "connected";

function validate(d: Record<string, FormDataEntryValue>) {
  const e: Record<string, string[]> = {};
  if (!String(d.name ?? "").trim()) e.name = ["Please enter your name"];
  if (!/^\S+@\S+\.\S+$/.test(String(d.email ?? "").trim())) e.email = ["Please enter a valid email address"];
  if (String(d.message ?? "").trim().length < 10) e.message = ["Please share a little more detail"];
  return e;
}

export default function ContactForm({ topics }: { topics: string[] }) {
  const [state, setState] = useState<State>("idle");
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState("sending"); setErrors({});
    const data = Object.fromEntries(new FormData(form));
    const problems = validate(data);
    if (Object.keys(problems).length) { setErrors(problems); setState("idle"); return; }
    try {
      const res = await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) });
      if (res.status === 422) {
        const fieldErrors = (await res.json().catch(() => null))?.errors;
        if (fieldErrors && !Array.isArray(fieldErrors)) { setErrors(fieldErrors); setState("idle"); return; }
        throw new Error();
      }
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
          {topics.map((t) => <option key={t} value={t}>{t}</option>)}
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
      {!CONNECTED && <p role="note" className="text-sm text-slate-400">This preview is not connected to a mailbox yet, so messages cannot be sent from here.</p>}
      <button disabled={state === "sending" || !CONNECTED} className="rounded-md bg-teal px-6 py-3 font-medium text-ink disabled:opacity-60">{state === "sending" ? "Sending…" : "Start a private conversation"}</button>
    </form>
  );
}
