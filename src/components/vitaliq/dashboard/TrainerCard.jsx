import { Link } from "@tanstack/react-router";
import { ArrowRight, PersonStanding } from "lucide-react";

export default function TrainerCard() {
  return (
    <Link to="/trainer" className="block">
      <div className="relative overflow-hidden rounded-[26px] border border-cyan-300/25 bg-gradient-to-br from-cyan-400/15 via-cyan-400/[0.04] to-orange-500/15 p-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-cyan-300/20 text-cyan-200 ring-1 ring-cyan-300/40">
            <PersonStanding className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/70">AI personal trainer</p>
            <p className="font-heading text-[13px] font-semibold text-white">Live form check & voice coaching</p>
            <p className="mt-0.5 text-[10px] leading-relaxed text-white/45">
              Pose tracking counts reps and corrects technique in real time.
            </p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-cyan-200/70" />
        </div>
      </div>
    </Link>
  );
}