export function Faq({ items, tone = "dark" }: { items: { q: string; a: string }[]; tone?: "dark" | "light" }) {
  const light = tone === "light";
  const row = light ? "border-line-light" : "border-line";
  const answer = light ? "text-slate-600" : "text-slate-300";
  const marker = light ? "text-steel" : "text-teal";
  return (
    <div className={`divide-y border-y ${light ? "divide-line-light border-line-light" : "divide-line border-line"}`}>
      {items.map((item) => (
        <details key={item.q} className={`group ${row}`}>
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-left text-lg font-medium marker:content-none [&::-webkit-details-marker]:hidden">
            <span>{item.q}</span>
            <span aria-hidden="true" className={`mt-1 shrink-0 text-xl leading-none transition-transform group-open:rotate-45 ${marker}`}>+</span>
          </summary>
          <p className={`measure pb-6 ${answer}`}>{item.a}</p>
        </details>
      ))}
    </div>
  );
}
