import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact";

// Delivery: POSTs the inquiry to CONTACT_WEBHOOK_URL (e.g. Slack/Teams/Zapier/email relay).
// Without it, production returns 503 rather than pretending the message was received.
export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 422 });
  if (parsed.data.website) return NextResponse.json({ ok: true }); // bot: silently accept

  const { name, email, company, topic, message } = parsed.data;
  const hook = process.env.CONTACT_WEBHOOK_URL;
  if (!hook) {
    if (process.env.NODE_ENV !== "production") { console.log("[contact:dev]", { name, email, company, topic, message }); return NextResponse.json({ ok: true }); }
    return NextResponse.json({ error: "Contact destination not configured" }, { status: 503 });
  }
  try {
    const res = await fetch(hook, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: `New Lykan inquiry\nName: ${name}\nEmail: ${email}\nCompany: ${company || "-"}\nInterest: ${topic || "-"}\n\n${message}`, name, email, company, topic, message }),
    });
    if (!res.ok) throw new Error(String(res.status));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not deliver your message" }, { status: 502 });
  }
}
