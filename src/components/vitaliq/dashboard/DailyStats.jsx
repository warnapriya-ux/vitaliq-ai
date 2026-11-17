import GlassCard from "@/components/vitaliq/GlassCard";
import { Droplets, Flame, Footprints, Moon } from "lucide-react";

const ICONS = { steps: Footprints, water: Droplets, calories: Flame, sleep: Moon };

export default function DailyStats({ stats = [] }) {
  return (
    <GlassCard className="p-3">
      <div className="grid grid-cols-4 gap-1">
        {stats.map((stat) => {
          const Icon = ICONS[stat.icon] || Footprints;
          return (
            <div key={stat.label} className="flex flex-col items-center gap-1.5 rounded-2xl px-1 py-2">
              <span className="grid h-9 w-9 place-items-center rounded-2xl bg-white/[0.06] text-cyan-300">
                <Icon className="h-4 w-4" />
              </span>
              <p className="text-[13px] font-semibold text-white">{stat.value}</p>
              <p className="text-[9px] uppercase tracking-wider text-white/35">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}