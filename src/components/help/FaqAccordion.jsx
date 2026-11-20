import { useState } from "react";
import { ChevronDown } from "lucide-react";

/** Short question and answer list, one panel open at a time. */
export default function FaqAccordion({ items }) {
  const [openId, setOpenId] = useState(items[0]?.id ?? null);

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div
            key={item.id}
            id={item.id}
            className="scroll-mt-24 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035]"
          >
            <button
              type="button"
              onClick={() => setOpenId(open ? null : item.id)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
            >
              <span className="font-heading text-[13px] font-semibold leading-snug text-white">
                {item.question}
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-white/40 transition ${open ? "rotate-180 text-cyan-300" : ""}`}
              />
            </button>
            {open && (
              <p className="border-t border-white/[0.07] px-3.5 py-3 text-[12.5px] leading-relaxed text-white/65">
                {item.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}