import { Link } from "@tanstack/react-router";
import { Play, Sparkles } from "lucide-react";

export default function AiAdvice({ advice, to = "/coach" }) {
  return (
    <div className="relative overflow-hidden rounded-[26px] border border-white/15 bg-gradient-to-br from-[#6d3bff] via-[#5a34e8] to-[#2f7bff] p-5">
      <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-8 h-36 w-36 rounded-full bg-fuchsia-400/30 blur-2xl" />
      <div className="relative">
        <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white/80">
          <Sparkles className="h-3.5 w-3.5" /> Today's AI recommendation
        </div>
        <p className="mt-2.5 max-w-[85%] font-heading text-[15px] font-medium leading-relaxed text-white">{advice}</p>
        <Link
          to={to}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-2 text-xs font-semibold text-white ring-1 ring-white/25 backdrop-blur-md transition hover:bg-white/30"
        >
          <Play className="h-3 w-3" /> View details
        </Link>
      </div>
    </div>
  );
}