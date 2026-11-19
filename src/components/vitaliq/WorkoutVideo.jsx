import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Video } from "lucide-react";
import { generateExerciseVideo } from "@/lib/server-fns";
import { CATEGORY_LABEL, EXERCISES } from "@/lib/exerciseCatalog";

// Inline demo clip for one workout move: plays the stored clip when one exists,
// otherwise offers to render a six-second AI demonstration in place.
export default function WorkoutVideo({ exerciseId, videoUrl, onGenerated }) {
  const exercise = EXERCISES.find((item) => item.id === exerciseId);
  const generate = useServerFn(generateExerciseVideo);
  const [rendered, setRendered] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const src = rendered || videoUrl;

  async function render() {
    if (!exercise) return;
    setBusy(true);
    setError("");
    try {
      const result = await generate({
        data: {
          exerciseId: exercise.id,
          name: exercise.name,
          cue: exercise.desc,
          category: CATEGORY_LABEL[exercise.cat],
        },
      });
      setRendered(result.video_url);
      onGenerated?.(exercise.id, result.video_url);
    } catch {
      setError("The demo did not finish. Please try again in a moment.");
    } finally {
      setBusy(false);
    }
  }

  if (src) {
    return (
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/50">
        <video
          src={src}
          className="aspect-video w-full bg-black object-cover"
          controls
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3">
      {busy ? (
        <p className="flex items-center gap-2 text-[11px] text-white/55">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-300" /> Rendering your AI demo, about a minute.
        </p>
      ) : (
        <div className="flex items-center gap-2">
          <p className="flex-1 text-[11px] leading-relaxed text-white/40">No demo clip for this move yet.</p>
          <button
            type="button"
            onClick={render}
            className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-cyan-400 px-3 text-[11px] font-semibold text-[#04121a]"
          >
            <Video className="h-3.5 w-3.5" /> Generate
          </button>
        </div>
      )}
      {error ? <p className="mt-2 text-[11px] text-rose-300">{error}</p> : null}
    </div>
  );
}