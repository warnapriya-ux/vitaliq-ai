import { Link } from "@tanstack/react-router";
import { Image } from "@/components/ui/image";
import { Play, Sparkles } from "lucide-react";

const MASCOT =
  "https://media.base44.com/images/public/6afbd52c2f8bd7e10d10de9b/2591d81dc_generated_image.png";

export default function AiAdvice({ advice, to = "/coach" }) {
  return (
    <div className="relative overflow-hidden rounded-[26px] border border-violet-300/20 bg-gradient-to-br from-[#151B33] via-[#1B1740] to-[#0B1024] p-4">
      <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-violet-500/25 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-8 h-36 w-36 rounded-full bg-fuchsia-500/20 blur-2xl" />
      <div className="relative flex items-start gap-3">
        <Image
          src={MASCOT}
          alt="VITALIQ Coach"
          className="h-16 w-16 shrink-0 overflow-hidden rounded-full ring-1 ring-cyan-300/40"
          focalPointY={0.42}
        />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-amber-200/90">
            <Sparkles className="h-3 w-3 text-amber-300" /> Today's AI recommendation
          </div>
          <p className="mt-1.5 font-heading text-[13.5px] font-medium leading-relaxed text-white">{advice}</p>
          <Link
            to={to}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-4 py-2 text-[11px] font-semibold text-white shadow-[0_10px_28px_-12px_rgba(139,92,246,0.9)] transition hover:from-violet-400 hover:to-blue-400"
          >
            <Play className="h-3 w-3" /> View Details
          </Link>
        </div>
      </div>
    </div>
  );
}