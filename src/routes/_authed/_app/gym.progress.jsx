import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { signUri } from "@/lib/files";
import { formatDate } from "@/lib/health";
import SubPageHeader from "@/components/vitaliq/SubPageHeader";
import GlassCard from "@/components/vitaliq/GlassCard";
import ProStatGrid from "@/components/pro/ProStatGrid";
import { Button } from "@/components/ui/button";

function WorkoutProgress({ user }) {
  const [videos, setVideos] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [videoPage, planPage] = await Promise.all([
      base44.entities.WorkoutVideo.filter({ client_user_id: user.id }, { sort: "-created_date", limit: 60 }),
      base44.entities.WorkoutPlan.filter({ client_user_id: user.id }, { limit: 20 }),
    ]);
    setVideos(videoPage.items ?? []);
    setPlans(planPage.items ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load().catch((error) => console.error(error));
  }, [load]);

  async function open(video) {
    const url = await signUri(video.file_uri);
    if (url) window.open(url, "_blank");
  }

  const approved = videos.filter((v) => v.status === "approved").length;
  const needsWork = videos.filter((v) => v.status === "needs_work").length;

  return (
    <div className="space-y-4">
      <SubPageHeader title="Workout progress" subtitle="Technique reviews" />
      <ProStatGrid
        stats={[
          { label: "Submissions", value: videos.length },
          { label: "Technique approved", value: approved, accent: "text-emerald-300" },
          { label: "Needs work", value: needsWork, accent: "text-amber-300" },
          { label: "Plans", value: plans.length },
        ]}
      />

      {loading ? (
        <div className="h-40 animate-pulse rounded-[26px] bg-white/5" />
      ) : videos.length === 0 ? (
        <GlassCard className="text-center">
          <p className="font-heading text-sm font-semibold text-white">Nothing to review yet</p>
          <p className="mt-1 text-xs text-white/40">Upload a set from My workout and your instructor's feedback appears here.</p>
        </GlassCard>
      ) : (
        <div className="space-y-2">
          {videos.map((video) => (
            <GlassCard key={video.id} className="p-3.5">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-medium text-white/85">{video.exercise}</p>
                  <p className="text-[10px] text-white/35">{formatDate(video.created_date)} · {video.instructor_name || "AI coach"}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                  video.status === "approved" ? "bg-emerald-400/12 text-emerald-300"
                    : video.status === "needs_work" ? "bg-amber-400/12 text-amber-300"
                      : "bg-white/[0.07] text-white/50"
                }`}>
                  {video.status.replace("_", " ")}
                </span>
              </div>
              {video.feedback && <p className="mt-2 rounded-xl bg-white/[0.04] p-2.5 text-[11px] leading-relaxed text-white/60">{video.feedback}</p>}
              <Button variant="ghost" onClick={() => open(video)} className="mt-1 h-8 px-0 text-[10px] font-semibold text-cyan-300 hover:bg-transparent">
                Watch submission
              </Button>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}

export const Route = createFileRoute("/_authed/_app/gym/progress")({
  head: () => ({ meta: [{ title: "Workout progress — VITALIQ AI" }] }),
  component: ProgressPage,
});

function ProgressPage() {
  const { user, isLoadingAuth } = useAuth();
  if (isLoadingAuth || !user) return <div className="h-40 animate-pulse rounded-[26px] bg-white/5" />;
  return <WorkoutProgress user={user} />;
}