import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SubPageHeader from "@/components/vitaliq/SubPageHeader";
import SessionRow from "@/components/trainer/SessionRow";

export const Route = createFileRoute("/_authed/_app/trainer/history")({
  head: () => ({ meta: [{ title: "Training history — VITALIQ AI" }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const [sessions, setSessions] = useState(null);

  useEffect(() => {
    let alive = true;
    base44.entities.TrainerSession.list("-created_date", 60)
      .then((records) => alive && setSessions(records ?? []))
      .catch((error) => {
        console.error(error);
        if (alive) setSessions([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  const scored = (sessions ?? []).filter((session) => session.form_score > 0);
  const average = scored.length ? Math.round(scored.reduce((sum, session) => sum + session.form_score, 0) / scored.length) : 0;
  const totalReps = (sessions ?? []).reduce((sum, session) => sum + (session.reps ?? 0), 0);

  return (
    <div className="space-y-4">
      <SubPageHeader subtitle="AI personal trainer" title="Training history" />

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Sessions", value: sessions?.length ?? "—" },
          { label: "Avg form", value: average || "—" },
          { label: "Reps", value: totalReps },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 text-center">
            <p className="font-heading text-xl font-semibold text-white">{stat.value}</p>
            <p className="text-[9px] uppercase tracking-[0.18em] text-white/35">{stat.label}</p>
          </div>
        ))}
      </div>

      {sessions === null ? (
        <div className="flex items-center justify-center gap-2 py-10 text-[11px] text-white/40">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading sessions
        </div>
      ) : sessions.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-[11px] leading-relaxed text-white/45">
          Nothing here yet. Run a live form check or analyse a video and every set will be listed here.
        </p>
      ) : (
        <div className="space-y-2">
          {sessions.map((session) => (
            <SessionRow key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
}