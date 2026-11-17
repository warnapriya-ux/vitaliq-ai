import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Clapperboard, Loader2, RefreshCw, Sparkles, Video } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import GlassCard from "@/components/vitaliq/GlassCard";
import { profileSummary } from "@/lib/health";
import { generateWorkoutVideo } from "@/lib/workout-video-fns";

export default function VideoStudio({ profile, workout, items, user }) {
  const generate = useServerFn(generateWorkoutVideo);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    if (!user?.id) {
      setLoading(false);
      return;
    }
    base44.entities.PlanVideo.filter({ client_id: user.id }, { sort: "-created_date", limit: 1 })
      .then((page) => {
        if (active) setVideo(page.items?.[0] ?? null);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user?.id]);

  const goalLabel = profile?.target_weight ? `Goal: reach ${profile.target_weight} kg` : "Goal: build a consistent routine";

  async function create() {
    if (items.length === 0) {
      toast.error("Generate a workout first, then film it.");
      return;
    }
    setBusy(true);
    try {
      const { url } = await generate({
        data: {
          planTitle: workout?.title || "Today's workout",
          goals: `${profileSummary(profile)}. ${goalLabel}.`,
          exercises: items.slice(0, 6).map((item) => `${item.label} (${item.detail})`),
        },
      });
      if (!url) throw new Error("No video returned");
      const record = await base44.entities.PlanVideo.create({
        client_id: user.id,
        plan_title: workout?.title || "Today's workout",
        goal: goalLabel,
        summary: workout?.summary || "",
        video_url: url,
        duration_sec: 8,
        aspect_ratio: "9:16",
      });
      setVideo(record);
      toast.success("Your workout video is ready");
    } catch (error) {
      console.error(error);
      toast.error("Could not generate the video. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <GlassCard className="border-violet-400/20 bg-violet-400/[0.05]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-violet-200/80">
          <Clapperboard className="h-3.5 w-3.5" /> AI video demo
        </div>
        {video && !busy && (
          <button
            type="button"
            onClick={create}
            className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[10px] text-white/55 transition hover:text-white"
          >
            <RefreshCw className="h-3 w-3" /> New take
          </button>
        )}
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-white/50">
        A short film of today's session, paced to your plan and your goal.
      </p>

      <div className="mt-4 flex justify-center">
        {busy ? (
          <div className="flex aspect-[9/16] w-full max-w-[220px] flex-col items-center justify-center gap-3 rounded-3xl border border-white/10 bg-black/30 px-4 text-center">
            <Loader2 className="h-6 w-6 animate-spin text-violet-300" />
            <p className="text-[11px] leading-relaxed text-white/60">Filming your session. This takes about a minute.</p>
          </div>
        ) : video ? (
          <video
            key={video.id}
            src={video.video_url}
            controls
            playsInline
            className="aspect-[9/16] w-full max-w-[220px] rounded-3xl border border-white/10 bg-black object-cover"
          />
        ) : loading ? (
          <div className="aspect-[9/16] w-full max-w-[220px] animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]" />
        ) : (
          <div className="flex aspect-[9/16] w-full max-w-[220px] flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-white/10 text-center">
            <Video className="h-6 w-6 text-white/30" />
            <p className="px-5 text-[11px] leading-relaxed text-white/40">No video yet for this plan.</p>
          </div>
        )}
      </div>

      {!video && !busy && (
        <button
          type="button"
          onClick={create}
          disabled={loading}
          className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary text-[12px] font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4" /> Generate my workout video
        </button>
      )}
    </GlassCard>
  );
}