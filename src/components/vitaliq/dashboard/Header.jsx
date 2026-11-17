import { Crown } from "lucide-react";

export default function Header({ name = "there", plan = "Free", subtitle = "You're on track to reach your goal" }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyan-400/45 to-fuchsia-500/45 font-heading text-lg font-semibold text-white ring-1 ring-white/20">
        {name.charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <h1 className="truncate font-heading text-xl font-semibold leading-tight text-white">Hello, {name}!</h1>
        <p className="truncate text-[11px] text-white/45">{subtitle} 💪</p>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wide text-amber-950 shadow-[0_10px_26px_-14px_rgba(251,191,36,0.9)]">
        <Crown className="h-3 w-3" /> <span className="capitalize">{plan} plan</span>
      </span>
    </div>
  );
}