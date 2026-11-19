import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import GlassCard from "@/components/vitaliq/GlassCard";
import TodayWorkout from "./TodayWorkout";
import TodayMeals from "./TodayMeals";

export default function TodayPlan({ workoutTitle, workoutItems, meals }) {
  return (
    <GlassCard>
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Today's plan</p>
        <Link to="/plans" className="flex items-center gap-1 text-[11px] font-semibold text-cyan-300">
          All plans <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="mt-3">
        <TodayWorkout title={workoutTitle} items={workoutItems} />
      </div>

      <div className="mt-4">
        <TodayMeals items={meals} />
      </div>

      <Link
        to="/workout"
        className="mt-4 flex items-center justify-center gap-1.5 rounded-full bg-primary py-2 text-[11px] font-semibold text-primary-foreground transition hover:bg-primary/90"
      >
        Open today's workout <ChevronRight className="h-3.5 w-3.5" />
      </Link>
    </GlassCard>
  );
}