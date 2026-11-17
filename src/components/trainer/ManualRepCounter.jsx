import { useEffect, useRef, useState } from "react";
import { Check, Loader2, Plus, Save } from "lucide-react";
import { base44 } from "@/api/base44Client";
import GlassCard from "@/components/vitaliq/GlassCard";
import { exerciseById } from "@/lib/exercises";
import { setVoiceEnabled, speak } from "@/lib/voiceCoach";

// Fallback when the pose model cannot load: tap to count, still coached by voice.
export default function ManualRepCounter({ exerciseId, voice }) {
  const exercise = exerciseById(exerciseId);
  const [reps, setReps] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [active, setActive] = useState(false);
  const [saved, setSaved] = useState("idle");
  const timer = useRef(null);

  useEffect(() => setVoiceEnabled(voice), [voice]);

  useEffect(() => {
    setReps(0);
    setSeconds(0);
    setActive(false);
    setSaved("idle");
  }, [exerciseId]);

  useEffect(() => {
    if (!active) return;
    timer.current = setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => clearInterval(timer.current);
  }, [active]);

  function addRep() {
    if (!active) setActive(true);
    const next = reps + 1;
    setReps(next);
    if (next % 5 === 0) speak(`${next} reps. Keep your form tight.`);
  }

  async function save() {
    setSaved("saving");
    try {
      await base44.entities.TrainerSession.create({
        exercise: exercise.name,
        mode: "live",
        reps,
        form_score: 0,
        duration_sec: seconds,
        voice_enabled: voice,
        summary: `${exercise.name}: ${reps} reps counted manually over ${seconds}s.`,
        cues: [exercise.cues.bottom ?? exercise.cues.hold, exercise.cues.top].filter(Boolean),
      });
      setActive(false);
      setSaved("saved");
    } catch (error) {
      console.error(error);
      setSaved("error");
    }
  }

  return (
    <GlassCard>
      <p className="text-[10px] uppercase tracking-[0.22em] text-white/35">Manual coach mode</p>
      <p className="mt-1 text-[11px] leading-relaxed text-white/45">
        Pose tracking is unavailable on this device. Tap each rep and the voice coach keeps cuing you.
      </p>

      <div className="mt-3 flex items-center justify-between">
        <div>
          <p className="font-heading text-2xl font-semibold text-white">{reps}</p>
          <p className="text-[9px] uppercase tracking-[0.18em] text-white/35">reps</p>
        </div>
        <div className="text-right">
          <p className="font-heading text-2xl font-semibold text-white">{seconds}s</p>
          <p className="text-[9px] uppercase tracking-[0.18em] text-white/35">time</p>
        </div>
      </div>

      <button
        type="button"
        onClick={addRep}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-cyan-300/40 bg-cyan-400/15 py-4 text-[12px] font-semibold text-cyan-100 active:scale-[0.99]"
      >
        <Plus className="h-4 w-4" /> Count a rep
      </button>

      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-[10px] text-white/40">
          {saved === "saving" && <Loader2 className="h-3 w-3 animate-spin" />}
          {saved === "saved" && (
            <span className="flex items-center gap-1 text-emerald-300">
              <Check className="h-3 w-3" /> Saved
            </span>
          )}
          {saved === "error" && <span className="text-rose-300">Could not save</span>}
        </span>
        <button
          type="button"
          onClick={save}
          disabled={!reps || saved === "saving"}
          className="flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-[11px] text-white/70 disabled:opacity-40"
        >
          <Save className="h-3 w-3" /> Save session
        </button>
      </div>
    </GlassCard>
  );
}