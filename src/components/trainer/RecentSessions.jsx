import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { formatDate } from "@/lib/health";

export default function RecentSessions() {
  const [sessions, setSessions] = useState(null);

  useEffect(() => {
    let alive = true;
    base44.entities.TrainerSession.list("-created_date", 3)
      .then((records) => alive && setSessions(records ?? []))
      .catch((error) => {
        console.error(error);
        if (alive) setSessions([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  if (sessions !== null && sessions.length === 0) {
    return (
      <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[11px] text-white/40">
        No sessions yet. Your first form check will show up here.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {(sessions ?? []).map((session) => (
        <div key={session.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-400/10 text-[10px] font-semibold text-cyan-200">
            {Math.round(Number(session.form_score) || 0)}
          </span>
          <div className="flex-1">
            <p className="text-[11px] font-semibold text-white">{session.exercise}</p>
            <p className="text-[10px] text-white/35">
              {formatDate(session.created_date)} · {session.reps ? `${session.reps} reps` : `${session.hold_seconds ?? 0}s hold`}
            </p>
          </div>
          <ArrowUpRight className="h-3.5 w-3.5 text-white/25" />
        </div>
      ))}
      <Link to="/trainer/history" className="inline-block px-1 text-[11px] text-cyan-200/80">
        See all sessions
      </Link>
    </div>
  );
}