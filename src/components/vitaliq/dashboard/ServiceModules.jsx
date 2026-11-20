import { Link } from "@tanstack/react-router";
import { Apple, Bot, CalendarCheck, Camera, ChartNoAxesColumn, Dumbbell, Salad, UserSearch, Video } from "lucide-react";

const FITNESS = [
  { to: "/trainer", label: "AI Personal Trainer", icon: Bot },
  { to: "/gym/find", label: "Find a Gym Instructor", icon: UserSearch },
  { to: "/gym/my-workout", label: "My Workout Schedule", icon: CalendarCheck },
  { to: "/gym/my-workout", label: "Upload Workout Video", icon: Video },
  { to: "/gym/progress", label: "Workout Progress", icon: ChartNoAxesColumn },
  { to: "/gym/library", label: "Virtual Gym", icon: Dumbbell },
];

const NUTRITION = [
  { to: "/nutrition", label: "AI Diet Planner", icon: Apple },
  { to: "/diet/find", label: "Find a Dietitian", icon: UserSearch },
  { to: "/diet/my-plan", label: "My Diet Plan", icon: Salad },
  { to: "/diet/my-plan", label: "Daily Meal Schedule", icon: CalendarCheck },
  { to: "/diet/log", label: "Nutrition Tracking", icon: Camera },
  { to: "/diet/progress", label: "Diet Progress", icon: ChartNoAxesColumn },
];

function Column({ eyebrow, title, items, tone }) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-white/[0.035] p-4">
      <p className="text-[9px] uppercase tracking-[0.24em] text-white/35">{eyebrow}</p>
      <h2 className="mt-1 font-heading text-[15px] font-semibold text-white">{title}</h2>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {items.map(({ to, label, icon: Icon }, index) => (
          <Link
            key={`${to}-${label}`}
            to={to}
            className="flex min-h-[74px] flex-col justify-between rounded-2xl border border-white/[0.07] bg-white/[0.04] p-2.5 transition active:scale-[0.98] hover:border-white/15 hover:bg-white/[0.07]"
          >
            <span className={`grid h-7 w-7 place-items-center rounded-lg ${tone}`}>
              <Icon className="h-3.5 w-3.5" />
            </span>
            <span className="mt-2 text-[10px] font-medium leading-tight text-white/80">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function ServiceModules() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Column
        eyebrow="Fitness & workout"
        title="Train with AI or a professional"
        items={FITNESS}
        tone="bg-cyan-400/12 text-cyan-300"
      />
      <Column
        eyebrow="Diet & nutrition"
        title="Eat well with AI or a dietitian"
        items={NUTRITION}
        tone="bg-emerald-400/12 text-emerald-300"
      />
    </div>
  );
}