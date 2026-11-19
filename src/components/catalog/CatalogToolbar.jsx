import { Search, Sparkles, Table2, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORIES, EXERCISES, LEVELS } from "@/lib/exerciseCatalog";

const VIEWS = [
  { id: "grid", label: "Grid", icon: LayoutGrid },
  { id: "video", label: "Video", icon: Sparkles },
  { id: "table", label: "Table", icon: Table2 },
];

function Segmented({ items, value, onChange }) {
  return (
    <div className="flex rounded-full border border-white/10 bg-white/[0.03] p-0.5">
      {items.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] transition",
            value === id ? "bg-cyan-400 text-[#04121a]" : "text-white/50 hover:text-white",
          )}
        >
          {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
          {label}
        </button>
      ))}
    </div>
  );
}

export default function CatalogToolbar({ search, onSearch, level, onLevel, view, onView, category, onCategory, total, videos }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-300/70">Exercise catalog · All categories</p>
          <h1 className="mt-1.5 font-heading text-2xl font-semibold leading-tight text-white sm:text-[30px]">
            Master exercise &amp; media index
          </h1>
        </div>
        <div className="flex gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">Matching</p>
            <p className="font-heading text-lg font-semibold text-white tabular-nums">
              {total}
              <span className="text-white/30"> / {EXERCISES.length}</span>
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">AI videos</p>
            <p className="font-heading text-lg font-semibold text-cyan-300 tabular-nums">{videos}</p>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search by ID, exercise, equipment or coaching cue…"
          className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] pl-11 pr-4 text-[13px] text-white placeholder:text-white/30 focus:border-cyan-400/40 focus:outline-none"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          items={[{ id: "all", label: "All levels" }, ...LEVELS.map((l) => ({ id: l, label: l[0].toUpperCase() + l.slice(1) }))]}
          value={level}
          onChange={onLevel}
        />
        <Segmented items={VIEWS} value={view} onChange={onView} />
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar lg:hidden">
        <button
          type="button"
          onClick={() => onCategory("all")}
          className={cn(
            "shrink-0 rounded-full border px-3 py-1.5 text-[11px] transition",
            category === "all" ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-200" : "border-white/10 text-white/50",
          )}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onCategory(c.id)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-[11px] transition",
              category === c.id ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-200" : "border-white/10 text-white/50",
            )}
          >
            {c.short}
          </button>
        ))}
      </div>
    </div>
  );
}