import { UtensilsCrossed } from "lucide-react";

export default function TodayMeals({ items = [] }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-amber-200/70">
        <UtensilsCrossed className="h-3.5 w-3.5" /> Daily plan
      </div>
      <ul className="mt-2 space-y-1.5">
        {items.length === 0 && <li className="text-[11px] text-white/40">Your AI meal plan is being built.</li>}
        {items.map((item, index) => (
          <li
            key={`${item.label}-${index}`}
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2"
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[12px] font-semibold text-white">{item.label}</span>
              <span className="shrink-0 text-[10px] text-white/35">{item.meta}</span>
            </div>
            <p className="mt-0.5 text-[11px] leading-relaxed text-white/50">{item.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}