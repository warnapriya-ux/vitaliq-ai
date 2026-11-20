import { LayoutTemplate, Trash2 } from "lucide-react";

export default function WorkoutTemplatePicker({ templates, onPick, onRemove }) {
  if (!templates.length) return null;

  return (
    <div className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-white/35">
        <LayoutTemplate className="h-3 w-3" /> Start from a template
      </p>
      <div className="space-y-1.5">
        {templates.map((template) => (
          <div key={template.id} className="flex items-center gap-2 rounded-xl bg-white/[0.03] px-2 py-1.5">
            <button type="button" onClick={() => onPick(template)} className="min-w-0 flex-1 text-left">
              <p className="truncate text-[12px] font-medium text-white/85">{template.title}</p>
              <p className="text-[10px] text-white/35">
                {template.level} · {template.days?.length ?? 0} days
                {template.use_count ? ` · used ${template.use_count}×` : ""}
              </p>
            </button>
            <button
              type="button"
              onClick={() => onRemove(template)}
              className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-white/25 hover:text-rose-300"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}