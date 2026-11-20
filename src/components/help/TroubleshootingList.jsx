import { LifeBuoy } from "lucide-react";

/** One troubleshooting card per known issue, anchored for direct links. */
export default function TroubleshootingList({ items }) {
  return (
    <div className="space-y-2.5">
      {items.map((item) => (
        <section
          key={item.id}
          id={item.id}
          className="scroll-mt-24 rounded-[22px] border border-white/10 bg-white/[0.035] p-4"
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-rose-400/10 text-rose-300 ring-1 ring-rose-400/25">
              <LifeBuoy className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0">
              <p className="text-[10.5px] uppercase tracking-[0.16em] text-white/40">
                {item.category}
              </p>
              <h3 className="mt-0.5 font-heading text-[14px] font-semibold leading-snug text-white">
                {item.issue}
              </h3>
              <p className="mt-1 text-[12.5px] leading-relaxed text-white/60">{item.summary}</p>
            </div>
          </div>
          <ol className="mt-3 space-y-1.5 pl-1">
            {item.steps.map((step, index) => (
              <li key={step} className="flex gap-2 text-[12.5px] leading-relaxed text-white/70">
                <span className="mt-0.5 w-4 shrink-0 text-[11px] font-semibold tabular-nums text-cyan-300/80">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}