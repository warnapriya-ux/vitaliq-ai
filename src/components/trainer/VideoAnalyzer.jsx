import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { FileVideo, Loader2, Upload } from "lucide-react";
import { base44 } from "@/api/base44Client";
import AnalysisResult from "@/components/trainer/AnalysisResult";
import ExercisePicker from "@/components/trainer/ExercisePicker";
import GlassCard from "@/components/vitaliq/GlassCard";
import { exerciseById } from "@/lib/exercises";
import { captureFrames } from "@/lib/frameCapture";
import { analyzeWorkoutForm } from "@/lib/server-fns";

const STEP_LABEL = {
  capture: "Reading the clip and sampling frames",
  upload: "Preparing frames securely",
  analyze: "Your coach is reviewing the frames",
};

export default function VideoAnalyzer() {
  const analyze = useServerFn(analyzeWorkoutForm);
  const inputRef = useRef(null);
  const [exerciseId, setExerciseId] = useState("squat");
  const [phase, setPhase] = useState("idle");
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [duration, setDuration] = useState(0);

  const busy = phase === "capture" || phase === "upload" || phase === "analyze";

  async function handleFile(file) {
    if (!file) return;
    setError(null);
    setResult(null);
    setDuration(0);

    try {
      setPhase("capture");
      const captured = await captureFrames(file, 6);
      if (!captured.frames.length) throw new Error("No frames could be read from that video.");

      setPhase("upload");
      const frameUrls = [];
      for (const frame of captured.frames) {
        const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file: frame });
        const { signed_url } = await base44.integrations.Core.CreateFileSignedUrl({ file_uri, expires_in: 900 });
        frameUrls.push(signed_url);
      }

      setPhase("analyze");
      const analysis = await analyze({
        data: { exercise: exerciseById(exerciseId).name, durationSec: captured.duration, frameUrls },
      });

      setResult(analysis);
      setDuration(captured.duration);
      setPhase("done");

      try {
        await base44.entities.TrainerSession.create({
          exercise: exerciseById(exerciseId).name,
          detected_exercise: analysis.exercise_detected ?? "",
          mode: "video",
          reps: Number(analysis.reps_estimate) || 0,
          form_score: Math.round(Number(analysis.form_score) || 0),
          duration_sec: Math.round(captured.duration),
          summary: analysis.summary ?? "",
          issues: analysis.issues ?? [],
          cues: analysis.cues ?? [],
          drills: analysis.drills ?? [],
        });
      } catch (saveError) {
        console.error(saveError);
      }
    } catch (analysisError) {
      console.error(analysisError);
      setError(analysisError?.message || "Form analysis failed. Try a shorter clip filmed from the side.");
      setPhase("error");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-4">
      <ExercisePicker value={exerciseId} onChange={setExerciseId} disabled={busy} />

      <GlassCard className="border-fuchsia-400/20 bg-fuchsia-500/[0.05]">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-fuchsia-400/15 text-fuchsia-200">
            <FileVideo className="h-4 w-4" />
          </span>
          <div className="flex-1">
            <p className="text-[12px] font-semibold text-white">Analyse a recorded set</p>
            <p className="mt-1 text-[11px] leading-relaxed text-white/50">
              Six frames are sampled from your clip and reviewed for alignment, depth and control.
            </p>
          </div>
        </div>

        <label
          className={`mt-4 flex items-center justify-center gap-2 rounded-2xl border border-dashed py-4 text-[12px] font-semibold transition ${
            busy
              ? "border-white/10 text-white/30"
              : "cursor-pointer border-cyan-300/40 text-cyan-100 hover:bg-cyan-400/10"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            className="hidden"
            disabled={busy}
            onChange={(event) => handleFile(event.target.files?.[0])}
          />
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {busy ? STEP_LABEL[phase] : "Choose a workout video"}
        </label>
        <p className="mt-2 text-center text-[10px] text-white/30">Frames are stored privately, only to run this review.</p>
      </GlassCard>

      {error && (
        <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-[11px] leading-relaxed text-rose-100">
          {error}
        </div>
      )}

      <AnalysisResult analysis={result} durationSec={duration} />
    </div>
  );
}