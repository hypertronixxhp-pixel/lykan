import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { Eyebrow } from "@/components/ui";
import { NDA_LINE } from "@/components/sections";

export const metadata: Metadata = { title: "Contact" };

export default function Contact() {
  return (
    <section className="py-20">
      <div className="wrap grid gap-14 lg:grid-cols-2">
        <div>
          <Eyebrow>Contact</Eyebrow>
          <h1 className="h-display text-4xl sm:text-5xl">Tell us what your team needs to build.</h1>
          <p className="measure mt-6 text-slate-300">Share the problem at a level you are comfortable with. We can discuss sensitive details in a direct conversation.</p>
          <p className="measure mt-4 text-sm text-slate-400">{NDA_LINE}</p>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
