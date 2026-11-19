import { Play, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORY_SHORT, EQUIPMENT_SHORT } from "@/lib/exerciseCatalog";
import { LEVEL_TONE } from "@/components/catalog/categoryStyle";

export default function ExerciseTable({ exercises, videoFor, onOpen }) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.02]">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.16em] text-white/35">
            <th className="px-4 py-3 font-medium">ID</th>
            <th className="px-4 py-3 font-medium">Exercise</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Equipment</th>
            <th className="px-4 py-3 font-medium">Level</th>
            <th className="px-4 py-3 font-medium">Media</th>
          </tr>
        </thead>
        <tbody>
          {exercises.map((exercise) => {
            const hasVideo = Boolean(videoFor(exercise));
            return (
              <tr key={exercise.id} className="border-b border-white/[0.06] last:border-0 hover:bg-white/[0.03]">
                <td className="whitespace-nowrap px-4 py-3 text-[11px] text-white/35">{exercise.id}</td>
                <td className="px-4 py-3">
                  <p className="text-[13px] font-medium text-white">{exercise.name}</p>
                  <p className="text-[11px] text-white/35">{exercise.style}</p>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-[12px] text-white/55">{CATEGORY_SHORT[exercise.cat]}</td>
                <td className="whitespace-nowrap px-4 py-3 text-[12px] text-white/45">{EQUIPMENT_SHORT[exercise.equip]}</td>
                <td className={cn("whitespace-nowrap px-4 py-3 text-[12px] capitalize", LEVEL_TONE[exercise.level])}>{exercise.level}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onOpen(exercise)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] transition",
                      hasVideo
                        ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20"
                        : "border-white/10 text-white/50 hover:text-white",
                    )}
                  >
                    {hasVideo ? <Play className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
                    {hasVideo ? "Play" : "Generate"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}