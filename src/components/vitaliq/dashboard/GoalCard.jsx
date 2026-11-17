import GlassCard from "@/components/vitaliq/GlassCard";
import ProgressRing from "@/components/vitaliq/ProgressRing";
import { Image } from "@/components/ui/image";
import { ArrowDownRight } from "lucide-react";

const HYDRATION_IMAGE =
  "https://media.base44.com/images/public/6afbd52c2f8bd7e10d10de9b/17be37f31_generated_image.png";

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

      <div className="mt-4 flex items-center gap-3">
        <ProgressRing value={percent} size={104} stroke={10}>
          <div>
            <p className="font-heading text-xl font-semibold text-white">{percent}%</p>
            <p className="text-[8px] uppercase tracking-[0.14em] text-white/35">daily goal</p>
          </div>
        </ProgressRing>

        <div className="min-w-0 flex-1 space-y-2">
          <div>
            <p className="text-[9px] uppercase tracking-[0.18em] text-white/35">Current</p>
            <p className="font-heading text-lg font-semibold leading-tight text-white">
              {current} <span className="text-[10px] font-normal text-white/40">{unit}</span>
            </p>
          </div>
          <div className="h-px bg-white/10" />
          <div>
            <p className="text-[9px] uppercase tracking-[0.18em] text-white/35">Target</p>
            <p className="font-heading text-sm font-semibold text-white/80">
              {target} {unit}
            </p>
          </div>
          <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
            <ArrowDownRight className="h-3 w-3" /> {toGo} {unit} to go
          </span>
        </div>

        <Image
          src={HYDRATION_IMAGE}
          alt="Drinking water after training"
          className="h-[104px] w-[76px] shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/10"
          focalPointX={0.5}
          focalPointY={0.3}
        />
      </div>
    </GlassCard>
  );
}