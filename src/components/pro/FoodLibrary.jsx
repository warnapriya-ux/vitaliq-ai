import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SRI_LANKAN_FOODS } from "@/lib/sriLankanFoods";
import GlassCard from "@/components/vitaliq/GlassCard";

export default function FoodLibrary({ compact = false }) {
  const [query, setQuery] = useState("");
  const foods = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? SRI_LANKAN_FOODS.filter((food) => `${food.name} ${food.local_name} ${food.category}`.toLowerCase().includes(q))
      : SRI_LANKAN_FOODS;
    return compact ? list.slice(0, 8) : list;
  }, [query, compact]);

  return (
    <GlassCard className="space-y-2.5 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="font-heading text-sm font-semibold text-white">Sri Lankan food library</p>
        <span className="text-[10px] text-white/30">{SRI_LANKAN_FOODS.length} foods</span>
      </div>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search rice, hoppers, dhal, fish…"
          className="h-10 w-full rounded-xl border border-white/10 bg-[#0b1220] pl-8 pr-3 text-[12px] text-white placeholder:text-white/30 focus:outline-none"
        />
      </div>
      <div className="space-y-1.5">
        {foods.map((food) => (
          <div key={food.name} className="flex items-center justify-between gap-2 rounded-xl bg-white/[0.03] px-2.5 py-2">
            <div className="min-w-0">
              <p className="truncate text-[11px] text-white/80">{food.name}</p>
              <p className="truncate text-[9px] text-white/30">{food.local_name} · {food.serving}</p>
            </div>
            <div className="shrink-0 text-right text-[9px] text-white/40">
              <p className="text-emerald-300">{food.calories} kcal</p>
              <p>P {food.protein} · C {food.carbs} · F {food.fat}</p>
            </div>
          </div>
        ))}
        {foods.length === 0 && <p className="text-[11px] text-white/35">No food matches that search.</p>}
      </div>
    </GlassCard>
  );
}