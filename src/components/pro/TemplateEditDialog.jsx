import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { LEVELS } from "@/lib/professional";
import WorkoutDaysEditor from "@/components/pro/WorkoutDaysEditor";
import SelectSheet from "@/components/vitaliq/SelectSheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const emptyTemplate = () => ({
  title: "",
  goal: "",
  level: "beginner",
  summary: "",
  days: [{ day: "Day 1", focus: "", exercises: [{ name: "", sets: "3", reps: "10", rest: "60s", notes: "" }] }],
});

export default function TemplateEditDialog({ open, onOpenChange, template, profile, onSaved }) {
  const [form, setForm] = useState(emptyTemplate);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(
      template
        ? {
            title: template.title ?? "",
            goal: template.goal ?? "",
            level: LEVELS.includes(template.level) ? template.level : "beginner",
            summary: template.summary ?? "",
            days: template.days?.length ? template.days : emptyTemplate().days,
          }
        : emptyTemplate(),
    );
  }, [open, template]);

  async function save() {
    if (!form.title.trim()) return toast.error("Give the template a name.");
    setSaving(true);
    try {
      const payload = {
        instructor_id: profile?.id,
        instructor_user_id: profile?.user_id,
        instructor_name: profile?.name,
        title: form.title.trim(),
        goal: form.goal,
        level: form.level,
        summary: form.summary,
        days: form.days,
      };
      if (template) await base44.entities.WorkoutTemplate.update(template.id, payload);
      else await base44.entities.WorkoutTemplate.create(payload);
      toast.success(template ? "Template updated." : "Template saved.");
      onOpenChange(false);
      await onSaved();
    } catch (error) {
      toast.error("Could not save the template.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[86vh] max-w-lg overflow-y-auto border-white/10 bg-[#0b1220] text-white">
        <DialogHeader>
          <DialogTitle className="text-sm">{template ? "Edit template" : "New workout template"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Template name" className="h-10 border-white/10 bg-[#070d18] text-[13px] text-white" />
          <Input value={form.goal} onChange={(event) => setForm({ ...form, goal: event.target.value })} placeholder="Goal (fat loss, strength…)" className="h-10 border-white/10 bg-[#070d18] text-[13px] text-white" />
          <Textarea rows={2} value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} placeholder="Coach notes for this programme" className="border-white/10 bg-[#070d18] text-[12px] text-white" />
          <SelectSheet label="Level" value={form.level} onChange={(value) => setForm({ ...form, level: value })} options={LEVELS.map((level) => ({ value: level, label: level }))} />
          <WorkoutDaysEditor days={form.days} onChange={(days) => setForm({ ...form, days })} />
        </div>
        <Button onClick={save} disabled={saving} className="h-11 w-full rounded-xl bg-cyan-400 text-sm font-semibold text-slate-950 hover:bg-cyan-300">
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {template ? "Save changes" : "Create template"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}