import { Link } from "@tanstack/react-router";
import GlassCard from "@/components/vitaliq/GlassCard";
import ProgressRing from "@/components/vitaliq/ProgressRing";
import { ArrowRight } from "lucide-react";

export default function ProgressGrid({ items = [] }) {
  return (
    <GlassCard>
      <div className="flex items-center justify-between">
        <p className="font-heading text-sm font-semibold text-white">Your progress</p>
        <Link to="/insights" className="flex items-center gap-1 text-[11px] text-cyan-300 transition hover:text-cyan-200">
          See all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-1.5">
            <ProgressRing value={item.pct} size={62} stroke={6} from={item.from} to={item.to}>
              <span className="text-[10px] font-semibold text-white">{item.value}</span>
            </ProgressRing>
            <p className="text-[9px] uppercase tracking-wider text-white/35">{item.label}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}