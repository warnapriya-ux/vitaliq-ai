import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SelectSheet from "@/components/vitaliq/SelectSheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function AssignTemplateDialog({ open, onOpenChange, template, links, onAssigned }) {
  const [linkId, setLinkId] = useState("");
  const [status, setStatus] = useState("approved");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setLinkId(links[0]?.id ?? "");
      setStatus("approved");
    }
  }, [open, links]);

  const client = links.find((link) => link.id === linkId);

  async function assign() {
    if (!template || !client) return toast.error("Choose a client first.");
    setSaving(true);
    try {
      await base44.entities.WorkoutPlan.create({
        instructor_id: client.instructor_id,
        instructor_user_id: client.instructor_user_id,
        instructor_name: client.instructor_name,
        client_user_id: client.client_user_id,
        client_name: client.client_name,
        title: template.title || "Workout programme",
        goal: template.goal || client.goal,
        level: template.level,
        summary: template.summary,
        source: "manual",
        status,
        approved_at: status === "approved" ? new Date().toISOString() : undefined,
        days: (template.days ?? []).map((day) => ({
          day: day.day,
          focus: day.focus,
          exercises: (day.exercises ?? []).map((ex) => ({ ...ex, ai_generated: false })),
        })),
      });
      await base44.entities.WorkoutTemplate.update(template.id, {
        use_count: (template.use_count ?? 0) + 1,
        last_used_on: new Date().toISOString().slice(0, 10),
      });
      toast.success(status === "approved" ? `Sent to ${client.client_name}.` : `Saved as a draft for ${client.client_name}.`);
      onOpenChange(false);
      await onAssigned();
    } catch (error) {
      toast.error("Could not assign the template.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm border-white/10 bg-[#0b1220] text-white">
        <DialogHeader>
          <DialogTitle className="text-sm">Assign “{template?.title}”</DialogTitle>
        </DialogHeader>
        {links.length === 0 ? (
          <p className="text-[12px] text-white/45">Accept a client request first, then you can assign this template.</p>
        ) : (
          <div className="space-y-2">
            <SelectSheet
              label="Client"
              value={linkId}
              onChange={setLinkId}
              options={links.map((link) => ({ value: link.id, label: `${link.client_name}${link.goal ? ` · ${link.goal}` : ""}` }))}
            />
            <div className="flex gap-2">
              {[
                { id: "approved", label: "Send now" },
                { id: "draft", label: "Save as draft" },
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setStatus(option.id)}
                  className={`flex-1 rounded-xl border py-2 text-[11px] transition ${
                    status === option.id ? "border-cyan-400/50 bg-cyan-400/[0.08] text-white" : "border-white/10 text-white/50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <Button onClick={assign} disabled={saving} className="h-11 w-full rounded-xl bg-cyan-400 text-sm font-semibold text-slate-950 hover:bg-cyan-300">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Assign to client
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}