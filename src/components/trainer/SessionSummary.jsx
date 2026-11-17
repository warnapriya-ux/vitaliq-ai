import { Link } from "@tanstack/react-router";
import { Check, Loader2, RotateCcw } from "lucide-react";
import GlassCard from "@/components/vitaliq/GlassCard";

const SAVE_STATE = {
  saving: <span className="flex items-center gap-1.5 text-[10px] text-white/40"><Loader2 className="h-3 w-3 animate-spin" /> Saving session</span>,
  saved: <span className="flex items-center gap-1.5 text-[10px] text-emerald-300"><Check className="h-3 w-3" /> Saved to your progress</span>,
  error: <span className="text-[10px] text-rose-300">Session could not be saved</span>,
};

export default function SessionSummary({ snapshot, exercise, saved, onRestart }) {
  const isStatic = Boolean(exercise?.static);
  return (
    <GlassCard className="border-cyan-400/25 bg-cyan-400/[0.06]">
      <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/70">Set complete</p>
      <div className="mt-2 flex items-end justify-between">
        <div>
          <p className="font-heading text-3xl font-semibold text-white">
            {isStatic ? `${snapshot.hold}s` : `${snapshot.reps} reps`}
          </p>
          <p className="mt-1 text-[11px] text-white/45">
            {exercise?.name} · {snapshot.seconds}s · form score {snapshot.score}
          </p>
        </div>
        <div className="text-right">
          <p className="font-heading text-2xl font-semibold text-white">{snapshot.score}</p>
          <p className="text-[9px] uppercase tracking-[0.18em] text-white/35">form</p>
        </div>
      </div>

      {snapshot.warnings?.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {snapshot.warnings.map((warning) => (
            <li key={warning.code} className="rounded-xl bg-black/20 px-3 py-2 text-[11px] text-white/60">
              {warning.text}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="min-h-[14px]">{SAVE_STATE[saved] ?? null}</div>
        <div className="flex items-center gap-2">
          <Link
            to="/trainer/history"
            className="rounded-full border border-white/15 px-3 py-1.5 text-[11px] text-white/60 transition hover:text-white"
          >
            History
          </Link>
          <button
            type="button"
            onClick={onRestart}
            className="flex items-center gap-1.5 rounded-full bg-cyan-400 px-3.5 py-1.5 text-[11px] font-semibold text-slate-950"
          >
            <RotateCcw className="h-3 w-3" /> Again
          </button>
        </div>
      </div>
    </GlassCard>
  );
}