import { Link } from "@tanstack/react-router";
import GlassCard from "@/components/vitaliq/GlassCard";
import { Image } from "@/components/ui/image";
import { Apple, Check, Dumbbell, UtensilsCrossed } from "lucide-react";

const SQUAT_IMAGE =
  "https://media.base44.com/images/public/6afbd52c2f8bd7e10d10de9b/f84e7fc5b_generated_image.png";
const MEAL_IMAGE =
  "https://media.base44.com/images/public/6afbd52c2f8bd7e10d10de9b/b43f2e2c4_generated_image.png";

export default function PlanCards({ workout, diet = [] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <GlassCard className="border-emerald-400/20 bg-emerald-400/[0.06] p-3">
        <Image
          src={SQUAT_IMAGE}
          alt="Bodyweight squat demonstration"
          className="h-24 w-full overflow-hidden rounded-2xl"
          focalPointY={0.45}
        />
        <div className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-emerald-200/80">
          <Dumbbell className="h-3.5 w-3.5" /> Workout plan
        </div>
        <p className="mt-1 font-heading text-sm font-semibold text-white">{workout.title}</p>
        <p className="text-[11px] text-white/45">
          {workout.duration} · {workout.detail}
        </p>
        <Link
          to="/workout"
          className="mt-3 flex items-center justify-center rounded-full bg-white py-2 text-[11px] font-semibold text-slate-900 transition hover:bg-white/90"
        >
          Start workout
        </Link>
      </GlassCard>

      <GlassCard className="border-amber-400/20 bg-amber-400/[0.06] p-3">
        <Image src={MEAL_IMAGE} alt="Healthy meal bowl" className="h-24 w-full overflow-hidden rounded-2xl" />
        <div className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-amber-200/80">
          <Apple className="h-3.5 w-3.5" /> Diet plan
        </div>
        <ul className="mt-1.5 space-y-1">
          {diet.map((item) => (
            <li key={item} className="flex items-center gap-1.5 text-[10.5px] leading-snug text-white/65">
              <Check className="h-3 w-3 shrink-0 text-emerald-400" />
              <span className="min-w-0">{item}</span>
            </li>
          ))}
        </ul>
        <Link
          to="/nutrition"
          className="mt-3 flex items-center justify-center gap-1.5 rounded-full bg-white py-2 text-[11px] font-semibold text-slate-900 transition hover:bg-white/90"
        >
          <UtensilsCrossed className="h-3.5 w-3.5" /> View diet plan
        </Link>
      </GlassCard>
    </div>
  );
}