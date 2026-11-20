import GlassCard from "@/components/vitaliq/GlassCard";
import { Droplets, Flame, Footprints, Moon } from "lucide-react";

const STYLES = {
  steps: { Icon: Footprints, tone: "bg-sky-500/15 text-sky-300" },
  water: { Icon: Droplets, tone: "bg-blue-500/15 text-blue-300" },
  calories: { Icon: Flame, tone: "bg-orange-500/15 text-orange-300" },
  sleep: { Icon: Moon, tone: "bg-indigo-500/15 text-indigo-300" },
};

export default function DailyStats({ stats = [] }) {
  return (
    <GlassCard className="p-3">
      <div className="grid grid-cols-4 gap-1">
        {stats.map((stat) => {
          const { Icon, tone } = STYLES[stat.icon] || STYLES.steps;
          return (
            <div key={stat.label} className="flex flex-col items-center gap-1.5 rounded-2xl px-1 py-2">
              <span className={`grid h-9 w-9 place-items-center rounded-2xl ${tone}`}>
                <Icon className="h-4 w-4" />
              </span>
              <p className="text-[14px] font-semibold text-white">{stat.value}</p>
              <p className="text-[12px] uppercase tracking-wider text-white/60">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}