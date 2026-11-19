import { Link } from "@tanstack/react-router";
import { ChevronRight, Dumbbell, UtensilsCrossed } from "lucide-react";
import GlassCard from "@/components/vitaliq/GlassCard";

// Home launcher: each plan opens its own full screen.
export default function TodayPlan({ workout, diet }) {
  const rows = [
    {
      to: "/workout",
      label: "Today's plan",
      icon: Dumbbell,
      summary: workout?.title || "No workout yet",
      meta: workout?.exerciseCount ? `${workout.exerciseCount} exercises` : "Being built",
      tone: "border-cyan-300/30 bg-cyan-400/10 text-cyan-300",
    },
    {
      to: "/nutrition",
      label: "Daily plan",
      icon: UtensilsCrossed,
      summary: diet?.title || "No daily plan yet",
      meta: diet?.mealCount
        ? `${diet.mealCount} meals${diet?.calories ? ` · ${diet.calories} kcal` : ""}`
        : "Being built",
      tone: "border-amber-300/30 bg-amber-400/10 text-amber-300",
    },
  ];

  return (
    <GlassCard className="space-y-3">
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Your plans</p>
      {rows.map((row) => {
        const Icon = row.icon;
        return (
          <Link
            key={row.to}
            to={row.to}
            className="flex items-center gap-3 rounded-[20px] border border-white/10 bg-white/[0.045] px-3.5 py-3.5 transition active:scale-[0.99] hover:bg-white/[0.07]"
          >
            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl border ${row.tone}`}>
              <Icon className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-heading text-[13.5px] font-semibold text-white">{row.label}</span>
              <span className="mt-0.5 block truncate text-[11px] text-white/45">{row.summary}</span>
              <span className="mt-0.5 block text-[10px] uppercase tracking-[0.14em] text-white/30">{row.meta}</span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-white/30" />
          </Link>
        );
      })}
    </GlassCard>
  );
}