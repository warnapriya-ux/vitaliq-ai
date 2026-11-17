import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";
import { CalendarCheck, Upload } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { signUri, uploadPrivate } from "@/lib/files";
import SubPageHeader from "@/components/vitaliq/SubPageHeader";
import GlassCard from "@/components/vitaliq/GlassCard";
import SelectSheet from "@/components/vitaliq/SelectSheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function MyWorkout({ user }) {
  const [link, setLink] = useState(null);
  const [plans, setPlans] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [exercise, setExercise] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const [linkPage, planPage, videoPage] = await Promise.all([
      base44.entities.GymClient.filter({ client_user_id: user.id }, { sort: "-created_date", limit: 20 }),
      base44.entities.WorkoutPlan.filter({ client_user_id: user.id }, { sort: "-created_date", limit: 20 }),
      base44.entities.WorkoutVideo.filter({ client_user_id: user.id }, { sort: "-created_date", limit: 20 }),
    ]);
    setLink((linkPage.items ?? []).find((l) => l.status === "active") ?? null);
    setPlans(planPage.items ?? []);
    setVideos(videoPage.items ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load().catch((error) => console.error(error));
  }, [load]);

  async function submitVideo() {
    if (!file || !exercise) {
      toast.error("Choose an exercise and attach your video.");
      return;
    }
    setSaving(true);
    try {
      const fileUri = await uploadPrivate(file);
      await base44.entities.WorkoutVideo.create({
        instructor_id: link?.instructor_id || "",
        instructor_user_id: link?.instructor_user_id || "",
        instructor_name: link?.instructor_name || "",
        client_user_id: user.id,
        client_name: user.full_name || "Member",
        exercise,
        note,
        file_uri: fileUri,
        status: "submitted",
      });
      toast.success(link ? "Sent to your instructor." : "Saved. Your instructor will see it once you connect.");
      setFile(null);
      setExercise("");
      setNote("");
      await load();
    } catch (error) {
      toast.error("Upload failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function play(video) {
    const url = await signUri(video.file_uri);
    if (url) window.open(url, "_blank");
  }

  const approved = plans.filter((p) => p.status === "approved");
  const current = approved[0] ?? plans[0];

  return (
    <div className="space-y-4">
      <SubPageHeader title="My workout" subtitle="Plan & coach review" />

      <GlassCard className="p-4">
        <p className="text-[9px] uppercase tracking-[0.2em] text-white/35">Your instructor</p>
        {link ? (
          <div className="mt-1 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-heading text-sm font-semibold text-white">{link.instructor_name}</p>
              <p className="text-[11px] text-white/40">Connected {link.started_on}</p>
            </div>
            <span className="rounded-full bg-emerald-400/12 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">Active</span>
          </div>
        ) : (
          <div className="mt-1">
            <p className="text-xs text-white/45">You are training with the AI coach. Connect a gym instructor for a human plan.</p>
            <Link to="/gym/find" className="mt-2 inline-flex text-xs font-semibold text-cyan-300">Find a gym instructor →</Link>
          </div>
        )}
      </GlassCard>

      {loading ? (
        <div className="h-48 animate-pulse rounded-[26px] bg-white/5" />
      ) : current ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/35">{current.status === "approved" ? "Approved plan" : "Draft plan"}</p>
              <h2 className="font-heading text-lg font-semibold text-white">{current.title}</h2>
            </div>
            <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-[10px] text-cyan-300">
              {current.days?.length ?? 0} days
            </span>
          </div>
          {current.summary && <p className="text-xs leading-relaxed text-white/50">{current.summary}</p>}
          {(current.days || []).map((day) => (
            <GlassCard key={day.day} className="p-4">
              <div className="flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-cyan-300" />
                <p className="font-heading text-sm font-semibold text-white">{day.day}</p>
                <span className="ml-auto text-[10px] uppercase tracking-wider text-white/35">{day.focus}</span>
              </div>
              <ul className="mt-2.5 space-y-2">
                {(day.exercises || []).map((exerciseItem, index) => (
                  <li key={`${day.day}-${index}`} className="rounded-xl bg-white/[0.03] p-2.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-[12px] font-medium text-white/85">{exerciseItem.name}</p>
                      <p className="shrink-0 text-[10px] text-cyan-300">{exerciseItem.sets} × {exerciseItem.reps}</p>
                    </div>
                    <p className="mt-0.5 text-[10px] text-white/35">
                      Rest {exerciseItem.rest}
                      {exerciseItem.notes ? ` · ${exerciseItem.notes}` : ""}
                      {exerciseItem.ai_generated ? " · AI suggested" : ""}
                    </p>
                  </li>
                ))}
              </ul>
            </GlassCard>
          ))}
        </div>
      ) : (
        <GlassCard className="text-center">
          <p className="font-heading text-sm font-semibold text-white">No plan yet</p>
          <p className="mt-1 text-xs text-white/40">Your instructor's plan appears here once it is approved.</p>
        </GlassCard>
      )}

      <GlassCard className="space-y-3 p-4" id="upload">
        <div className="flex items-center gap-2">
          <Upload className="h-4 w-4 text-cyan-300" />
          <p className="font-heading text-sm font-semibold text-white">Upload workout video</p>
        </div>
        <p className="text-[11px] leading-relaxed text-white/45">
          Record a set and send it to your instructor for a technique review. Videos are stored privately.
        </p>
        <SelectSheet
          label="Exercise"
          value={exercise}
          onChange={setExercise}
          options={[
            "Squat",
            "Deadlift",
            "Bench press",
            "Overhead press",
            "Barbell row",
            "Lunge",
            "Push-up",
            "Pull-up",
            "Plank",
            "Kettlebell swing",
          ].map((item) => ({ value: item, label: item }))}
        />
        <Input
          value={exercise}
          onChange={(event) => setExercise(event.target.value)}
          placeholder="Or type the exercise, e.g. Back squat"
          className="border-white/10 bg-[#0b1220] text-white"
        />
        <label className="flex h-11 cursor-pointer items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.03] text-xs text-white/50">
          {file ? file.name : "Attach video file"}
          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
        </label>
        <div className="space-y-1.5">
          <Label className="text-[11px] text-white/50">Note for your instructor</Label>
          <Textarea
            rows={2}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Felt my lower back rounding on the last reps."
            className="border-white/10 bg-[#0b1220] text-white"
          />
        </div>
        <Button onClick={submitVideo} disabled={saving} className="h-11 w-full rounded-xl bg-cyan-400 text-sm font-semibold text-slate-950 hover:bg-cyan-300">
          {saving ? "Uploading…" : "Submit to instructor"}
        </Button>
      </GlassCard>

      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-[0.22em] text-white/30">Your submissions</p>
        {videos.length === 0 && <p className="text-xs text-white/35">No videos submitted yet.</p>}
        {videos.map((video) => (
          <div key={video.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-[12px] font-medium text-white/85">{video.exercise}</p>
              <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                video.status === "approved" ? "bg-emerald-400/12 text-emerald-300"
                  : video.status === "needs_work" ? "bg-amber-400/12 text-amber-300"
                    : "bg-white/[0.07] text-white/50"
              }`}>
                {video.status.replace("_", " ")}
              </span>
            </div>
            {video.feedback && <p className="mt-1.5 rounded-xl bg-white/[0.04] p-2 text-[11px] text-white/60">{video.feedback}</p>}
            <button onClick={() => play(video)} className="mt-1.5 text-[10px] font-semibold text-cyan-300">Open video</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_authed/_app/gym/my-workout")({
  head: () => ({ meta: [{ title: "My workout — VITALIQ AI" }] }),
  component: MyWorkoutPage,
});

function MyWorkoutPage() {
  const { user, isLoadingAuth } = useAuth();
  if (isLoadingAuth || !user) return <div className="h-40 animate-pulse rounded-[26px] bg-white/5" />;
  return <MyWorkout user={user} />;
}