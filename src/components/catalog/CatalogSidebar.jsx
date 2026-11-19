import { CATEGORIES, EQUIPMENT, LEVELS, EXERCISES } from "@/lib/exerciseCatalog";
import { cn } from "@/lib/utils";

const LEVEL_LABEL = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" };

function Group({ title, children }) {
  return (
    <div className="mb-6">
      <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">{title}</p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function Item({ active, label, count, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-[13px] transition",
        active ? "bg-cyan-400/10 text-cyan-200" : "text-white/55 hover:bg-white/5 hover:text-white",
      )}
    >
      <span className="truncate">{label}</span>
      <span className={cn("shrink-0 text-[11px] tabular-nums", active ? "text-cyan-300/80" : "text-white/25")}>{count}</span>
    </button>
  );
}

const countBy = (key, value) => (value === "all" ? EXERCISES.length : EXERCISES.filter((e) => e[key] === value).length);

export default function CatalogSidebar({ category, equipment, level, onCategory, onEquipment, onLevel }) {
  return (
    <div className="sticky top-[92px] max-h-[calc(100vh-120px)] overflow-y-auto pr-1 no-scrollbar">
      <Group title="Categories">
        <Item label="All categories" count={EXERCISES.length} active={category === "all"} onClick={() => onCategory("all")} />
        {CATEGORIES.map((c) => (
          <Item key={c.id} label={c.label} count={countBy("cat", c.id)} active={category === c.id} onClick={() => onCategory(c.id)} />
        ))}
      </Group>

      <Group title="Equipment">
        <Item label="All equipment" count={EXERCISES.length} active={equipment === "all"} onClick={() => onEquipment("all")} />
        {EQUIPMENT.map((e) => (
          <Item key={e.id} label={e.label} count={countBy("equip", e.id)} active={equipment === e.id} onClick={() => onEquipment(e.id)} />
        ))}
      </Group>

      <Group title="Level">
        <Item label="All levels" count={EXERCISES.length} active={level === "all"} onClick={() => onLevel("all")} />
        {LEVELS.map((l) => (
          <Item key={l} label={LEVEL_LABEL[l]} count={countBy("level", l)} active={level === l} onClick={() => onLevel(l)} />
        ))}
      </Group>
    </div>
  );
}