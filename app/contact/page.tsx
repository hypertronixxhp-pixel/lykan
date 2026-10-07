import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { Faq } from "@/components/Faq";
import { Eyebrow } from "@/components/ui";
import { NDA_LINE } from "@/components/sections";
import { claims } from "@/lib/claims";

export const metadata: Metadata = { title: "Contact" };

const faqs = [
  {
    q: "How do you estimate a project?",
    a: "We start from a conversation about the problem and its scope. Estimates follow from that conversation, once we understand what needs to be built and what is already in place.",
  },
  {
    q: "Do you work with early-stage products?",
    a: "Yes. Early-stage products can be a good fit when the problem is clear enough to describe, even if the details are still moving. We can help shape a first version that is straightforward to extend as you learn more.",
  },
  {
    q: "How long does a project usually take?",
    a: `${claims.timeline} A conversation about scope gives a clearer picture for your own project.`,
  },
  {
    q: "What does it cost, and is there a minimum?",
    a: `${claims.cost} Whether there is a minimum depends on the scope, so the best way to find out is to describe what you need and hear back on what is realistic.`,
  },
  {
    q: "Can you take on one part, or work with our in-house team?",
    a: "Yes to both. We can take on a single part of a product, or work alongside your in-house team. How the work is split is agreed up front, so responsibilities stay clear.",
  },
];

export default function Contact() {
  return (
    <>
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
      <section className="light-band py-20">
        <div className="wrap">
          <Eyebrow tone="light">FAQ</Eyebrow>
          <h2 className="h-display mb-8 max-w-2xl text-3xl sm:text-4xl">Common questions</h2>
          <Faq items={faqs} tone="light" />
        </div>
      </section>
    </>
  );
}
