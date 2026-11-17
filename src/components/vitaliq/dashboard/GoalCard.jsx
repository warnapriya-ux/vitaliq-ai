import GlassCard from "@/components/vitaliq/GlassCard";
import ProgressRing from "@/components/vitaliq/ProgressRing";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";
import { ArrowDownRight, Crosshair, User } from "lucide-react";

const HYDRATION_IMAGE =
  "https://media.base44.com/images/public/6afbd52c2f8bd7e10d10de9b/17be37f31_generated_image.png";

function Stat({ icon: Icon, tone, label, value }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-full", tone)}>
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[9px] uppercase tracking-[0.14em] text-white/40">{label}</p>
        <p className="truncate font-heading text-[12px] font-semibold leading-tight text-white">{value}</p>
      </div>
    </div>
  );
}

export default function GoalCard({ percent, current, target, toGo, unit = "kg" }) {
  return (
    <GlassCard className="bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-transparent">
      <div className="flex items-center gap-3">
        <ProgressRing value={percent} size={96} stroke={10} from="#00d4ff" to="#ffcc00">
          <div>
            <p className="font-heading text-xl font-semibold text-white">{percent}%</p>
            <p className="text-[8px] uppercase tracking-[0.14em] text-white/40">daily goal</p>
          </div>
        </ProgressRing>

        <div className="min-w-0 flex-1 space-y-2">
          <Stat icon={User} tone="bg-sky-400/12 text-sky-300" label="Current" value={`${current} ${unit}`} />
          <Stat icon={Crosshair} tone="bg-rose-400/12 text-rose-300" label="Target" value={`${target} ${unit}`} />
          <Stat
            icon={ArrowDownRight}
            tone="bg-emerald-400/12 text-emerald-300"
            label="To go"
            value={`${toGo} ${unit}`}
          />
        </div>

        <Image
          src={HYDRATION_IMAGE}
          alt="Drinking water after training"
          className="h-[92px] w-[60px] shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/10 sm:h-[104px] sm:w-[72px]"
          focalPointX={0.5}
          focalPointY={0.3}
        />
      </div>
    </GlassCard>
  );
}