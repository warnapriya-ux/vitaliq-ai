import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { formatDate } from "@/lib/health";

export default function SessionRow({ session }) {
  const [open, setOpen] = useState(false);
  const issues = Array.isArray(session.issues) ? session.issues : [];
  const cues = Array.isArray(session.cues) ? session.cues : [];
  const score = Math.round(Number(session.form_score) || 0);
  const volume = session.reps ? `${session.reps} reps` : `${session.hold_seconds ?? 0}s hold`;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-3 px-3.5 py-3 text-left"
      >
        <span
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[11px] font-semibold ${
            score >= 80 ? "bg-emerald-400/15 text-emerald-300" : score >= 65 ? "bg-amber-400/15 text-amber-300" : "bg-white/10 text-white/60"
          }`}
        >
          {score || "—"}
        </span>
        <span className="flex-1">
          <span className="block text-[12px] font-semibold text-white">{session.exercise}</span>
          <span className="block text-[10px] text-white/35">
            {formatDate(session.created_date)} · {session.mode === "video" ? "Video review" : "Live"} · {volume}
          </span>
        </span>
        <ChevronDown className={`h-4 w-4 text-white/30 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="space-y-2 border-t border-white/10 px-3.5 py-3">
          {session.summary && <p className="text-[11px] leading-relaxed text-white/60">{session.summary}</p>}
          {issues.map((issue, index) => (
            <p key={index} className="rounded-xl bg-black/25 px-3 py-2 text-[11px] leading-relaxed text-white/55">
              <span className="text-white/80">{issue.area}: </span>
              {issue.issue}
              {issue.fix && <span className="mt-1 block text-cyan-200/70">Fix: {issue.fix}</span>}
            </p>
          ))}
          {cues.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {cues.map((cue, index) => (
                <span key={index} className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-white/50">
                  {cue}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}