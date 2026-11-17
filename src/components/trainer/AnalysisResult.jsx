import { useEffect, useState } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";
import GlassCard from "@/components/vitaliq/GlassCard";
import { setVoiceEnabled, speak, speakSequence, stopVoice } from "@/lib/voiceCoach";

const SEVERITY = {
  high: "border-rose-400/30 bg-rose-500/10",
  medium: "border-amber-300/25 bg-amber-400/10",
  low: "border-white/10 bg-white/[0.03]",
};

// What the voice coach reads out loud after a video review.
function coachingLines(analysis) {
  if (!analysis) return [];
  const score = Math.round(Number(analysis.form_score) || 0);
  const fixes = (analysis.issues ?? []).slice(0, 2).map((issue) => issue.fix || issue.issue);
  return [
    `Form score ${score} out of 100.`,
    analysis.summary,
    ...fixes,
    ...(analysis.cues ?? []).slice(0, 3),
    "That is your review. Go again and keep it clean.",
  ].filter((line) => typeof line === "string" && line.trim().length > 0);
}

export default function AnalysisResult({ analysis, durationSec }) {
  const [voice, setVoice] = useState(true);

  useEffect(() => () => stopVoice(), []);

  useEffect(() => {
    setVoiceEnabled(voice);
    if (!analysis || !voice) {
      stopVoice();
      return;
    }
    speakSequence(coachingLines(analysis));
  }, [analysis, voice]);

  if (!analysis) return null;
  const issues = Array.isArray(analysis.issues) ? analysis.issues : [];
  const cues = Array.isArray(analysis.cues) ? analysis.cues : [];
  const drills = Array.isArray(analysis.drills) ? analysis.drills : [];
  const score = Math.round(Number(analysis.form_score) || 0);

  return (
    <div className="space-y-3">
      <GlassCard className="border-fuchsia-400/25 bg-fuchsia-500/[0.07]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-fuchsia-200/70">Form report</p>
            <p className="mt-1 font-heading text-base font-semibold text-white">{analysis.exercise_detected || "Movement"}</p>
            <p className="mt-1 text-[11px] text-white/45">
              {analysis.reps_estimate ?? 0} reps detected
              {durationSec ? ` · ${Math.round(durationSec)}s clip` : ""}
            </p>
          </div>
          <div className="text-right">
            <p className={`font-heading text-3xl font-semibold ${score >= 80 ? "text-emerald-300" : score >= 65 ? "text-amber-300" : "text-rose-300"}`}>
              {score}
            </p>
            <p className="text-[9px] uppercase tracking-[0.18em] text-white/35">form</p>
          </div>
        </div>
        {analysis.summary && <p className="mt-3 text-[12px] leading-relaxed text-white/65">{analysis.summary}</p>}

        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setVoice(true);
              setVoiceEnabled(true);
              speakSequence(coachingLines(analysis));
            }}
            className="flex items-center gap-1.5 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1.5 text-[11px] font-semibold text-cyan-100"
          >
            <Play className="h-3 w-3" /> Play voice coaching
          </button>
          <button
            type="button"
            onClick={() => setVoice((value) => !value)}
            aria-label={voice ? "Mute voice coaching" : "Unmute voice coaching"}
            className="grid h-8 w-8 place-items-center rounded-full border border-white/15 text-white/55"
          >
            {voice ? <Volume2 className="h-3.5 w-3.5 text-cyan-300" /> : <VolumeX className="h-3.5 w-3.5" />}
          </button>
        </div>
      </GlassCard>

      {issues.length > 0 && (
        <GlassCard>
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/35">What to fix</p>
          <ul className="mt-3 space-y-2">
            {issues.map((issue, index) => (
              <li key={`${issue.area}-${index}`} className={`rounded-2xl border px-3 py-2.5 ${SEVERITY[issue.severity] ?? SEVERITY.low}`}>
                <p className="flex items-center justify-between gap-2 text-[12px] font-semibold text-white">
                  {issue.area}
                  <span className="text-[9px] uppercase tracking-[0.16em] text-white/35">{issue.severity}</span>
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-white/60">{issue.issue}</p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-cyan-200/80">Fix: {issue.fix}</p>
              </li>
            ))}
          </ul>
        </GlassCard>
      )}

      {cues.length > 0 && (
        <GlassCard>
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/35">Say this next set</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {cues.map((cue, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setVoice(true);
                  setVoiceEnabled(true);
                  speak(cue);
                }}
                className="flex items-center gap-1.5 rounded-full border border-cyan-300/25 bg-cyan-400/10 px-3 py-1.5 text-left text-[11px] text-cyan-100 transition hover:bg-cyan-400/20"
              >
                <Volume2 className="h-3 w-3 shrink-0" /> {cue}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-white/30">Tap a cue to hear it spoken.</p>
        </GlassCard>
      )}

      {drills.length > 0 && (
        <GlassCard>
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/35">Corrective drills</p>
          <ul className="mt-3 space-y-2">
            {drills.map((drill, index) => (
              <li key={index} className="flex items-start justify-between gap-3 rounded-xl bg-white/[0.03] px-3 py-2">
                <span className="text-[12px] text-white/80">{drill.name}</span>
                <span className="shrink-0 text-[10px] text-white/40">{drill.dose}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      )}
    </div>
  );
}