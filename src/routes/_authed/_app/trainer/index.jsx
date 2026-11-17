import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, ChevronRight, FileVideo, ScanFace } from "lucide-react";
import PageTitle from "@/components/vitaliq/PageTitle";
import GlassCard from "@/components/vitaliq/GlassCard";
import RecentSessions from "@/components/trainer/RecentSessions";
import WeeklyFormSummary from "@/components/trainer/WeeklyFormSummary";

export const Route = createFileRoute("/_authed/_app/trainer/")({
  head: () => ({ meta: [{ title: "AI Personal Trainer — VITALIQ AI" }] }),
  component: TrainerHub,
});

const MODES = [
  {
    to: "/trainer/live",
    icon: Camera,
    eyebrow: "Live",
    title: "Camera form check",
    detail: "Pose tracking counts your reps, scores your technique and speaks corrections while you train.",
    accent: "border-cyan-300/30 bg-cyan-400/[0.07] text-cyan-200",
  },
  {
    to: "/trainer/video",
    icon: FileVideo,
    eyebrow: "Recorded",
    title: "Video form analysis",
    detail: "Upload a set you already filmed and get a full written breakdown with corrective drills.",
    accent: "border-fuchsia-400/30 bg-fuchsia-500/[0.07] text-fuchsia-200",
  },
];

function TrainerHub() {
  return (
    <div className="space-y-4">
      <PageTitle eyebrow="AI personal trainer" title="Train your form" />

      {MODES.map(({ to, icon: Icon, eyebrow, title, detail, accent }) => (
        <Link key={to} to={to} className="block">
          <GlassCard className={`${accent.split(" ")[0]} ${accent.split(" ")[1]}`}>
            <div className="flex items-start gap-3">
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/10 ${accent.split(" ")[2]}`}>
                <Icon className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <p className="text-[9px] uppercase tracking-[0.22em] text-white/40">{eyebrow}</p>
                <p className="mt-0.5 font-heading text-[14px] font-semibold text-white">{title}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-white/50">{detail}</p>
              </div>
              <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-white/25" />
            </div>
          </GlassCard>
        </Link>
      ))}

      <WeeklyFormSummary />

      <GlassCard>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/35">
          <ScanFace className="h-3.5 w-3.5" /> How a live check works
        </div>
        <ol className="mt-3 space-y-2 text-[11px] leading-relaxed text-white/55">
          <li>
            <span className="text-cyan-300">1.</span> Prop your phone two metres away with your whole body in frame.
          </li>
          <li>
            <span className="text-cyan-300">2.</span> Pick the movement and start the set. The skeleton overlay confirms the model sees you.
          </li>
          <li>
            <span className="text-cyan-300">3.</span> Reps, depth and form score update live, and the voice coach calls out corrections.
          </li>
          <li>
            <span className="text-cyan-300">4.</span> Finish the set and it is saved to your training history.
          </li>
        </ol>
      </GlassCard>

      <div className="space-y-2">
        <p className="px-1 text-[10px] uppercase tracking-[0.22em] text-white/35">Recent sessions</p>
        <RecentSessions />
      </div>

      <p className="px-1 text-[10px] leading-relaxed text-white/30">
        Form feedback is general training guidance, not medical advice. Stop if you feel pain and check with a clinician.
      </p>
    </div>
  );
}