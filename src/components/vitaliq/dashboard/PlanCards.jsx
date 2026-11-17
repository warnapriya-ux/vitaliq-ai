import { Link } from "@tanstack/react-router";
import GlassCard from "@/components/vitaliq/GlassCard";
import { Apple, Dumbbell, UtensilsCrossed } from "lucide-react";

export default function PlanCards({ workout, diet = [] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <GlassCard className="border-emerald-400/20 bg-emerald-400/[0.06]">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-emerald-200/80">
          <Dumbbell className="h-3.5 w-3.5" /> Workout plan
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400/25 to-teal-500/10 text-emerald-200">
            <Dumbbell className="h-6 w-6" />
          </div>
          <div>
            <p className="font-heading text-sm font-semibold text-white">{workout.title}</p>
            <p className="text-[11px] text-white/45">{workout.duration} · {workout.detail}</p>
          </div>
        </div>
        <Link
          to="/workout"
          className="mt-4 flex items-center justify-center rounded-full bg-white py-2.5 text-xs font-semibold text-slate-900 transition hover:bg-white/90"
        >
          Start workout
        </Link>
      </GlassCard>

      <GlassCard className="border-amber-400/20 bg-amber-400/[0.06]">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-amber-200/80">
          <Apple className="h-3.5 w-3.5" /> Diet plan
        </div>
        <ul className="mt-3 space-y-1.5">
          {diet.map((item) => (
            <li key={item} className="flex items-start gap-2 text-[11px] leading-relaxed text-white/65">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-300" />
              {item}
            </li>
          ))}
        </ul>
        <Link
          to="/nutrition"
          className="mt-4 flex items-center justify-center gap-1.5 rounded-full bg-white py-2.5 text-xs font-semibold text-slate-900 transition hover:bg-white/90"
        >
          <UtensilsCrossed className="h-3.5 w-3.5" /> View diet plan
        </Link>
      </GlassCard>
    </div>
  );
}