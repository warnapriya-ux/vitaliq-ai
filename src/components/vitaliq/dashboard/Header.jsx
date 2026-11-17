import { Bell } from "lucide-react";

export default function Header({ name = "Sarah", plan = "Premium", subtitle = "You're on track to reach your goal" }) {
  return (
    <header className="flex items-start justify-between gap-3">
      <div>
        <p className="text-[10px] uppercase tracking-[0.32em] text-white/35">Vitaliq AI</p>
        <h1 className="mt-2 font-heading text-[26px] font-semibold leading-tight tracking-tight text-white">
          Hello, {name}!
        </h1>
        <p className="mt-1 text-[13px] text-white/45">{subtitle} 💪</p>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-300/90 to-amber-500/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-950">
          👑 {plan} Plan
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Notifications"
          className="relative grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.05] text-white/65 backdrop-blur-xl transition hover:text-white"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
            2
          </span>
        </button>
        <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-cyan-400/40 to-fuchsia-500/40 text-sm font-semibold text-white ring-1 ring-white/20">
          {name.charAt(0)}
        </div>
      </div>
    </header>
  );
}