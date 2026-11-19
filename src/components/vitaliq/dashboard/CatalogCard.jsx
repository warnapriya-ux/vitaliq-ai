import { Link } from "@tanstack/react-router";
import { ChevronRight, Play } from "lucide-react";
import GlassCard from "@/components/vitaliq/GlassCard";
import { EXERCISES } from "@/lib/exerciseCatalog";

export default function CatalogCard() {
  return (
    <GlassCard className="border-cyan-400/20 bg-cyan-400/[0.06] p-3">
      <Link to="/catalog" className="flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
          <Play className="ml-0.5 h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-[0.18em] text-cyan-200/80">Video library</p>
          <p className="mt-0.5 font-heading text-sm font-semibold text-white">Exercise catalog</p>
          <p className="truncate text-[11px] text-white/45">{EXERCISES.length} clips · tap any one to watch</p>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-white/35" />
      </Link>
    </GlassCard>
  );
}