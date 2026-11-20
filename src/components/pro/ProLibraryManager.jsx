import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2, Upload } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { uploadPrivate } from "@/lib/files";
import { LEVELS, WORKOUT_CATEGORIES, WORKOUT_PROGRAMMES } from "@/lib/professional";
import SelectSheet from "@/components/vitaliq/SelectSheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ProLibraryManager({ profile }) {
  const [videos, setVideos] = useState([]);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: WORKOUT_CATEGORIES[0],
    level: "beginner",
    programme: WORKOUT_PROGRAMMES[0],
  });

  const load = useCallback(async () => {
    if (!profile) return;
    const page = await base44.entities.VirtualGymVideo.filter({ instructor_id: profile.id }, { sort: "-created_date", limit: 100 });
    setVideos(page.items ?? []);
  }, [profile]);

  useEffect(() => {
    load().catch((error) => console.error(error));
  }, [load]);

  async function upload() {
    if (!file || !form.title.trim()) return toast.error("Add a title and a video file.");
    setSaving(true);
    try {
      const videoUri = await uploadPrivate(file);
      await base44.entities.VirtualGymVideo.create({
        instructor_id: profile.id,
        instructor_user_id: profile.user_id,
        instructor_name: profile.name,
        title: form.title.trim(),
        description: form.description,
        category: form.category,
        level: form.level,
        programme: form.programme,
        video_url: videoUri,
      });
      toast.success("Added to your virtual gym.");
      setFile(null);
      setForm({ ...form, title: "", description: "" });
      await load();
    } catch (error) {
      toast.error("Upload failed.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(video) {
    try {
      await base44.entities.VirtualGymVideo.delete(video.id);
      await load();
    } catch (error) {
      toast.error("Could not remove this video.");
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2.5 rounded-[26px] border border-white/10 bg-white/[0.035] p-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">Add to your virtual gym</p>
        <Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Video title" className="border-white/10 bg-[#0b1220] text-white" />
        <Textarea rows={2} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="What this session covers" className="border-white/10 bg-[#0b1220] text-white" />
        <div className="grid grid-cols-2 gap-2">
          <SelectSheet label="Category" value={form.category} onChange={(value) => setForm({ ...form, category: value })} options={WORKOUT_CATEGORIES.map((c) => ({ value: c, label: c }))} />
          <SelectSheet label="Level" value={form.level} onChange={(value) => setForm({ ...form, level: value })} options={LEVELS.map((l) => ({ value: l, label: l }))} />
        </div>
        <SelectSheet label="Programme" value={form.programme} onChange={(value) => setForm({ ...form, programme: value })} options={WORKOUT_PROGRAMMES.map((p) => ({ value: p, label: p }))} />
        <label className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.03] text-[11px] text-white/50">
          <Upload className="h-4 w-4" />
          {file ? file.name : "Attach session video"}
          <input type="file" accept="video/*" className="hidden" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
        </label>
        <Button onClick={upload} disabled={saving} className="h-11 w-full rounded-xl bg-cyan-400 text-sm font-semibold text-slate-950 hover:bg-cyan-300">
          {saving ? "Uploading…" : "Publish to library"}
        </Button>
        <p className="text-[10px] text-white/30">Your clients unlock these sessions as soon as they are connected to you.</p>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] uppercase tracking-[0.22em] text-white/30">Your library ({videos.length})</Label>
        {videos.length === 0 && <p className="text-xs text-white/35">No videos uploaded yet.</p>}
        {videos.map((video) => (
          <div key={video.id} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] text-white/85">{video.title}</p>
              <p className="text-[10px] text-white/35">{video.category} · {video.level} · {video.programme}</p>
            </div>
            <button onClick={() => remove(video)} className="grid h-8 w-8 place-items-center rounded-lg text-white/30 hover:text-rose-300">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}