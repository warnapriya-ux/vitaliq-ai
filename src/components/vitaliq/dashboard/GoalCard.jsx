import GlassCard from "@/components/vitaliq/GlassCard";
import ProgressRing from "@/components/vitaliq/ProgressRing";
import { ArrowDownRight } from "lucide-react";

export default function GoalCard({ percent, current, target, toGo, unit = "kg" }) {
  return (
    <GlassCard className="bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-transparent">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-white/35">Goal progress</p>
          <p className="mt-1 font-heading text-lg font-semibold text-white">Weight journey</p>
        </div>
        <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-white/45">This week</span>
      </div>

      <div className="mt-4 flex items-center gap-5">
        <ProgressRing value={percent} size={128} stroke={11}>
          <div>
            <p className="font-heading text-2xl font-semibold text-white">{percent}%</p>
            <p className="text-[10px] uppercase tracking-widest text-white/35">to goal</p>
          </div>
        </ProgressRing>

        <div className="flex-1 space-y-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">Current</p>
            <p className="font-heading text-xl font-semibold text-white">
              {current} <span className="text-xs font-normal text-white/40">{unit}</span>
            </p>
          </div>
          <div className="h-px bg-white/10" />
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">Target</p>
              <p className="font-heading text-base font-semibold text-white/80">{target} {unit}</p>
            </div>
            <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-400/15 px-2 py-1 text-[10px] font-semibold text-emerald-300">
              <ArrowDownRight className="h-3 w-3" /> {toGo} {unit}
            </span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}