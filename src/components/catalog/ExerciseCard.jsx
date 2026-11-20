import { Play, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORY_SHORT, EQUIPMENT_SHORT } from "@/lib/exerciseCatalog";
import { CATEGORY_STYLE, LEVEL_TONE } from "@/components/catalog/categoryStyle";

// A light poster card: no <video> element is created until the clip is actually opened,
// which keeps the catalog cheap to scroll on phones.
export default function ExerciseCard({ exercise, videoUrl, onOpen }) {
  const style = CATEGORY_STYLE[exercise.cat] ?? CATEGORY_STYLE.functional;
  const Icon = style.icon;

  return (
    <article className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] transition hover:border-cyan-400/30">
      <button
        type="button"
        onClick={onOpen}
        className="relative block w-full overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
        aria-label={`Open ${exercise.name}`}
      >
        <div className={cn("relative flex aspect-video w-full items-center justify-center bg-gradient-to-br", style.gradient)}>
          <Icon className="h-10 w-10 text-white/30" />
        </div>

        <span className="absolute right-2.5 top-2.5 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/85 backdrop-blur">
          {videoUrl ? "AI video" : "AI clip"}
        </span>
        <span className="absolute bottom-2.5 left-2.5 rounded-full bg-black/60 px-2 py-0.5 text-[11px] text-white/80 backdrop-blur">
          {exercise.style} · 30–60s
        </span>

        <span className="absolute inset-0 grid place-items-center">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-cyan-400 text-[#04121a] shadow-[0_10px_30px_-8px_rgba(0,240,255,0.8)] transition group-hover:scale-105">
            {videoUrl ? <Play className="ml-0.5 h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
          </span>
        </span>
      </button>

      <div className="p-4">
        <p className="text-[12px] uppercase tracking-[0.16em] text-white/60">
          {exercise.id} · {CATEGORY_SHORT[exercise.cat]}
        </p>
        <h3 className="mt-1 font-heading text-[15px] font-semibold leading-snug text-white">{exercise.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-white/65">{exercise.desc}</p>
        <div className="mt-3 flex items-center justify-between border-t border-white/[0.07] pt-2.5 text-[12px]">
          <span className="text-white/60">{EQUIPMENT_SHORT[exercise.equip]}</span>
          <span className={cn("font-medium capitalize", LEVEL_TONE[exercise.level])}>{exercise.level}</span>
        </div>
      </div>
    </article>
  );
}