import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { formatDate } from "@/lib/health";
import { signUri } from "@/lib/files";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function VideoReviews({ user }) {
  const [videos, setVideos] = useState([]);
  const [openFor, setOpenFor] = useState("");
  const [feedback, setFeedback] = useState("");

  const load = useCallback(async () => {
    if (!user) return;
    const page = await base44.entities.WorkoutVideo.filter(
      { instructor_user_id: user.id },
      { sort: "-created_date", limit: 50 },
    );
    setVideos(page.items ?? []);
  }, [user]);

  useEffect(() => {
    load().catch((error) => console.error(error));
  }, [load]);

  async function watch(video) {
    const url = await signUri(video.file_uri);
    if (url) window.open(url, "_blank");
  }

  async function review(video, status) {
    if (!feedback.trim()) return toast.error("Add your correction notes first.");
    try {
      await base44.entities.WorkoutVideo.update(video.id, {
        feedback: feedback.trim(),
        status,
        reviewed_at: new Date().toISOString(),
      });
      toast.success("Feedback sent to your client.");
      setOpenFor("");
      setFeedback("");
      await load();
    } catch (error) {
      toast.error("Could not save the review.");
    }
  }

  const waiting = videos.filter((video) => video.status === "submitted");

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] uppercase tracking-[0.22em] text-white/35">Video reviews</h2>
        <span className="text-[10px] text-white/30">{waiting.length} waiting</span>
      </div>
      {videos.length === 0 && (
        <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs text-white/35">
          Client submissions appear here for a technique review.
        </p>
      )}
      {videos.map((video) => (
        <div key={video.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-[12px] font-medium text-white/85">{video.exercise} · {video.client_name}</p>
              <p className="text-[10px] text-white/35">{formatDate(video.created_date)}</p>
              {video.note && <p className="mt-1 line-clamp-2 text-[10px] text-white/40">"{video.note}"</p>}
            </div>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold ${
              video.status === "approved" ? "bg-emerald-400/12 text-emerald-300"
                : video.status === "needs_work" ? "bg-amber-400/12 text-amber-300"
                  : "bg-white/[0.07] text-white/50"
            }`}>{video.status.replace("_", " ")}</span>
          </div>
          <button onClick={() => watch(video)} className="mt-1.5 text-[10px] font-semibold text-cyan-300">Watch video →</button>
          {openFor === video.id ? (
            <div className="mt-2 space-y-1.5">
              <Textarea
                rows={2}
                value={feedback}
                onChange={(event) => setFeedback(event.target.value)}
                placeholder="What to fix and the cue to use next set."
                className="border-white/10 bg-[#0b1220] text-[11px] text-white"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => review(video, "approved")} className="h-8 flex-1 rounded-lg bg-emerald-400 text-[10px] font-semibold text-slate-950 hover:bg-emerald-300">
                  Approve technique
                </Button>
                <Button size="sm" variant="outline" onClick={() => review(video, "needs_work")} className="h-8 flex-1 rounded-lg border-white/15 bg-transparent text-[10px] text-white/65">
                  Needs work
                </Button>
              </div>
            </div>
          ) : (
            <button onClick={() => { setOpenFor(video.id); setFeedback(video.feedback || ""); }} className="ml-3 mt-1.5 text-[10px] font-semibold text-white/45">
              Review →
            </button>
          )}
        </div>
      ))}
    </div>
  );
}