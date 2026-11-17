import { Link } from "@tanstack/react-router";
import { Image } from "@/components/ui/image";
import { Play, Sparkles } from "lucide-react";

const MASCOT =
  "https://media.base44.com/images/public/6afbd52c2f8bd7e10d10de9b/2591d81dc_generated_image.png";

export default function AiAdvice({ advice, to = "/coach" }) {
  return (
    <div className="relative overflow-hidden rounded-[26px] border border-white/15 bg-gradient-to-br from-[#6d3bff] via-[#5a34e8] to-[#2f7bff] p-4">
      <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-8 h-36 w-36 rounded-full bg-fuchsia-400/30 blur-2xl" />
      <div className="relative flex items-start gap-3">
        <Image
          src={MASCOT}
          alt="VITALIQ AI coach"
          className="h-16 w-16 shrink-0 overflow-hidden rounded-full ring-1 ring-white/30"
          focalPointY={0.42}
        />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-white/80">
            <Sparkles className="h-3 w-3" /> Today's AI recommendation
          </div>
          <p className="mt-1.5 font-heading text-[13.5px] font-medium leading-relaxed text-white">{advice}</p>
          <Link
            to={to}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1.5 text-[11px] font-semibold text-white ring-1 ring-white/25 backdrop-blur-md transition hover:bg-white/30"
          >
            <Play className="h-3 w-3" /> View details
          </Link>
        </div>
      </div>
    </div>
  );
}