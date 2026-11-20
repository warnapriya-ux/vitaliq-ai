import { Link } from "@tanstack/react-router";
import { ArrowRight, Stethoscope } from "lucide-react";

// Always rendered on the home screen, so instructors and dietitians can reach
// their portal whether or not they have finished onboarding.
export default function ProPortalLink() {
  return (
    <Link
      to="/pro"
      className="flex items-center gap-3 rounded-[26px] border border-cyan-400/25 bg-cyan-400/[0.07] px-4 py-3 transition active:scale-[0.99] hover:border-cyan-400/40 hover:bg-cyan-400/[0.11]"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-cyan-400/15 text-cyan-300">
        <Stethoscope className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-heading text-[13px] font-semibold text-white">Professional portal</span>
        <span className="block text-[11px] leading-tight text-white/50">Instructor &amp; dietitian dashboard</span>
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-cyan-300" />
    </Link>
  );
}