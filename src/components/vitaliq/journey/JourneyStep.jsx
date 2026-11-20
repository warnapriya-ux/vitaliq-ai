import { Link } from "@tanstack/react-router";
import { Check, ChevronRight } from "lucide-react";
import GlassCard from "@/components/vitaliq/GlassCard";
import { cn } from "@/lib/utils";

const STATES = {
  done: {
    label: "Complete",
    chip: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    dot: "bg-emerald-400 text-slate-950",
    card: "border-emerald-400/15",
  },
  next: {
    label: "Next step",
    chip: "border-cyan-300/40 bg-cyan-400/10 text-cyan-200",
    dot: "bg-cyan-400 text-slate-950",
    card: "border-cyan-300/30 neon-cyan",
  },
  todo: {
    label: "Upcoming",
    chip: "border-white/10 bg-white/5 text-white/45",
    dot: "bg-[#131B2E] text-white/45 ring-1 ring-white/15",
    card: "border-white/10",
  },
};

export default function JourneyStep({ index, icon: Icon, title, detail, state, to, last }) {
  const s = STATES[state] ?? STATES.todo;

  const body = (
    <GlassCard className={cn("p-4", s.card)}>
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-white/[0.07] text-cyan-200">
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="font-heading text-[13.5px] font-semibold text-white">{title}</p>
            <span className={cn("shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.1em]", s.chip)}>
              {s.label}
            </span>
          </div>
          <p className="mt-1 text-[12.5px] leading-relaxed text-white/65">{detail}</p>
        </div>
        {to && <ChevronRight className="mt-2.5 h-4 w-4 shrink-0 text-white/50" />}
      </div>
    </GlassCard>
  );

  return (
    <li className="relative flex gap-3">
      {!last && <span className="absolute left-[15px] top-10 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-white/20 to-white/[0.04]" />}
      <span className={cn("relative z-10 mt-3 grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-semibold", s.dot)}>
        {state === "done" ? <Check className="h-4 w-4" strokeWidth={3} /> : String(index).padStart(2, "0")}
      </span>
      <div className="min-w-0 flex-1">
        {to ? (
          <Link to={to} className="block transition hover:opacity-90">
            {body}
          </Link>
        ) : (
          body
        )}
      </div>
    </li>
  );
}