import { Play, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORY_SHORT } from "@/lib/exerciseCatalog";
import { CATEGORY_STYLE, LEVEL_TONE } from "@/components/catalog/categoryStyle";

export default function VideoWall({ exercises, videoFor, onOpen }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {exercises.map((exercise) => {
        const style = CATEGORY_STYLE[exercise.cat] ?? CATEGORY_STYLE.functional;
        const Icon = style.icon;
        const videoUrl = videoFor(exercise);
        return (
          <article key={exercise.id} className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">
            <div className="relative aspect-video w-full bg-[#0a1120]">
              {videoUrl ? (
                <button
                  type="button"
                  onClick={() => onOpen(exercise)}
                  aria-label={`Watch ${exercise.name}`}
                  className="group relative block h-full w-full"
                >
                  <video src={videoUrl} muted loop autoPlay playsInline className="h-full w-full object-cover" />
                  <span className="absolute inset-0 grid place-items-center bg-black/0 transition group-hover:bg-black/30">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-cyan-400 text-[#04121a] opacity-0 transition group-hover:opacity-100">
                      <Play className="ml-0.5 h-4 w-4" />
                    </span>
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpen(exercise)}
                  className={cn("flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br", style.gradient)}
                >
                  <Icon className="h-7 w-7 text-white/25" />
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-black/40 px-3 py-1.5 text-[11px] text-cyan-200">
                    <Sparkles className="h-3 w-3" /> Generate AI video
                  </span>
                </button>
              )}
            </div>
            <div className="flex items-start justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/35">
                  {exercise.id} · {CATEGORY_SHORT[exercise.cat]}
                </p>
                <h3 className="mt-1 truncate font-heading text-[15px] font-semibold text-white">{exercise.name}</h3>
                <p className="mt-1 line-clamp-2 text-[12px] text-white/45">{exercise.desc}</p>
              </div>
              <span className={cn("shrink-0 text-[11px] font-medium capitalize", LEVEL_TONE[exercise.level])}>{exercise.level}</span>
            </div>
          </article>
        );
      })}
    </div>
  );
}