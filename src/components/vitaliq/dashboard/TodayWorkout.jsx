import { useEffect, useState } from "react";
import { Dumbbell, Play, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import WorkoutVideo from "@/components/vitaliq/WorkoutVideo";
import { DEMO_VIDEOS } from "@/lib/exerciseCatalog";

// Today's workout on the home screen, each move opening its demo clip in place.
export default function TodayWorkout({ title, items = [] }) {
  const [media, setMedia] = useState({});
  const [openVideo, setOpenVideo] = useState(null);

  useEffect(() => {
    let alive = true;
    base44.entities.ExerciseMedia.filter({ status: "generated" })
      .then((res) => {
        const rows = Array.isArray(res) ? res : res?.items ?? [];
        if (!alive) return;
        const map = {};
        rows.forEach((row) => {
          if (row.video_url) map[row.exercise_id] = row.video_url;
        });
        setMedia(map);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div>
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-cyan-200/70">
        <Dumbbell className="h-3.5 w-3.5" /> Workout plan
      </div>
      <p className="mt-1 font-heading text-sm font-semibold text-white">{title}</p>
      <ul className="mt-2 space-y-2">
        {items.length === 0 && <li className="text-[11px] text-white/40">Your AI workout is being built.</li>}
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="space-y-2">
            <div className="flex items-stretch gap-2">
              <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[12.5px] font-semibold text-white">{item.label}</span>
                  <span className="shrink-0 text-[10px] text-white/35">{item.meta}</span>
                </div>
                <p className="mt-0.5 text-[11px] leading-relaxed text-white/50">{item.detail}</p>
              </div>
              {item.exercise_id && (
                <button
                  type="button"
                  onClick={() => setOpenVideo(openVideo === index ? null : index)}
                  aria-label={openVideo === index ? `Hide ${item.label} demo` : `Watch ${item.label}`}
                  className={`grid w-11 shrink-0 place-items-center rounded-2xl border transition ${
                    openVideo === index
                      ? "border-cyan-300/40 bg-cyan-400/15 text-cyan-200"
                      : "border-white/10 bg-white/[0.03] text-cyan-300 hover:bg-white/[0.06]"
                  }`}
                >
                  {openVideo === index ? <X className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                </button>
              )}
            </div>
            {item.exercise_id && openVideo === index && (
              <WorkoutVideo
                exerciseId={item.exercise_id}
                videoUrl={media[item.exercise_id] || DEMO_VIDEOS[item.exercise_id]}
                onGenerated={(id, url) => setMedia((prev) => ({ ...prev, [id]: url }))}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}