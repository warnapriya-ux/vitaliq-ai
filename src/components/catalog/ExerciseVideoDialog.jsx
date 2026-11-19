import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Lock, Sparkles, Video } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { generateExerciseVideo } from "@/lib/server-fns";
import { CATEGORY_LABEL, EQUIPMENT_SHORT } from "@/lib/exerciseCatalog";

export default function ExerciseVideoDialog({ exercise, videoUrl, open, onOpenChange, onGenerated }) {
  const [rendered, setRendered] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const generate = useServerFn(generateExerciseVideo);
  const { isAuthenticated, navigateToLogin } = useAuth();

  if (!exercise) return null;
  const src = rendered || videoUrl;

  async function handleGenerate() {
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
      onGenerated(exercise.id, result.video_url);
    } catch {
      setError("The render did not finish. Please try again in a moment.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-hidden border-white/10 bg-[#070d18] p-0">
        <div className="relative aspect-video w-full bg-[#0a1120]">
          {src ? (
            <video src={src} className="h-full w-full object-cover" autoPlay muted loop playsInline controls />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
                <Sparkles className="h-5 w-5" />
              </span>
              {busy ? (
                <>
                  <p className="font-heading text-sm font-semibold text-white">Rendering your AI demo…</p>
                  <p className="flex items-center gap-2 text-[12px] text-white/45">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> This takes about a minute.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-heading text-sm font-semibold text-white">No clip yet for this movement</p>
                  <p className="max-w-sm text-[12px] leading-relaxed text-white/45">
                    Generate a six-second AI demonstration of {exercise.name.toLowerCase()} coached exactly to this cue.
                  </p>
                  {isAuthenticated ? (
                    <Button onClick={handleGenerate} className="h-11 rounded-full bg-cyan-400 px-5 text-[13px] font-semibold text-[#04121a] hover:bg-cyan-300">
                      <Video className="mr-2 h-4 w-4" /> Generate AI video
                    </Button>
                  ) : (
                    <Button onClick={() => navigateToLogin()} variant="outline" className="h-11 rounded-full border-white/15 px-5 text-[13px] text-white">
                      <Lock className="mr-2 h-4 w-4" /> Sign in to generate
                    </Button>
                  )}
                  {error ? <p className="text-[11px] text-rose-300">{error}</p> : null}
                </>
              )}
            </div>
          )}
        </div>

        <div className="p-5">
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/35">
            {exercise.id} · {CATEGORY_LABEL[exercise.cat]}
          </p>
          <DialogTitle className="mt-1 font-heading text-lg font-semibold text-white">{exercise.name}</DialogTitle>
          <p className="mt-2 text-[13px] leading-relaxed text-white/55">{exercise.desc}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px]">
            <span className="rounded-full border border-white/10 px-2.5 py-1 text-white/50">{EQUIPMENT_SHORT[exercise.equip]}</span>
            <span className="rounded-full border border-white/10 px-2.5 py-1 capitalize text-white/50">{exercise.level}</span>
            <span className="rounded-full border border-white/10 px-2.5 py-1 text-white/50">{exercise.style}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}