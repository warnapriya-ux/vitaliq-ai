import { Armchair, CircleDot, Dumbbell, Flower2, Footprints, HeartPulse, Layers, Repeat, Target, Zap } from "lucide-react";

export const CATEGORY_STYLE = {
  cardio: { icon: HeartPulse, gradient: "from-rose-500/25 via-rose-500/5 to-transparent", accent: "text-rose-300" },
  chest: { icon: Dumbbell, gradient: "from-sky-500/25 via-sky-500/5 to-transparent", accent: "text-sky-300" },
  back: { icon: Layers, gradient: "from-indigo-500/25 via-indigo-500/5 to-transparent", accent: "text-indigo-300" },
  arms: { icon: Zap, gradient: "from-amber-500/25 via-amber-500/5 to-transparent", accent: "text-amber-300" },
  legs: { icon: Footprints, gradient: "from-emerald-500/25 via-emerald-500/5 to-transparent", accent: "text-emerald-300" },
  glutes: { icon: CircleDot, gradient: "from-fuchsia-500/25 via-fuchsia-500/5 to-transparent", accent: "text-fuchsia-300" },
  core: { icon: Target, gradient: "from-cyan-500/25 via-cyan-500/5 to-transparent", accent: "text-cyan-300" },
  yoga: { icon: Flower2, gradient: "from-violet-500/25 via-violet-500/5 to-transparent", accent: "text-violet-300" },
  senior: { icon: Armchair, gradient: "from-teal-500/25 via-teal-500/5 to-transparent", accent: "text-teal-300" },
  functional: { icon: Repeat, gradient: "from-orange-500/25 via-orange-500/5 to-transparent", accent: "text-orange-300" },
};

export const LEVEL_TONE = {
  beginner: "text-emerald-300",
  intermediate: "text-amber-300",
  advanced: "text-rose-300",
};