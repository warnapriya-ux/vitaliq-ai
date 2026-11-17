import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { todayISO } from "@/lib/health";

export default function MeasurementDialog({ profile, onSaved }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ measured_on: todayISO(), weight: "", waist: "", body_fat: "" });

  const set = (key) => (event) => setForm((f) => ({ ...f, [key]: event.target.value }));

  async function save() {
    if (!profile) return;
    setSaving(true);
    try {
      await base44.entities.Measurement.create({
        profile_id: profile.id,
        measured_on: form.measured_on,
        weight: Number(form.weight) || null,
        waist: Number(form.waist) || null,
        body_fat: Number(form.body_fat) || null,
      });
      if (Number(form.weight)) {
        await base44.entities.HealthProfile.update(profile.id, { current_weight: Number(form.weight) });
      }
      setOpen(false);
      setForm({ measured_on: todayISO(), weight: "", waist: "", body_fat: "" });
      await onSaved?.();
      toast.success("Measurement saved");
    } catch (error) {
      console.error(error);
      toast.error("Could not save the measurement.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 rounded-full text-[11px] text-cyan-300 hover:bg-white/5">
          <Plus className="h-3.5 w-3.5" /> Add
        </Button>
      </DialogTrigger>
      <DialogContent className="border-white/10 bg-[#0a0f1a] text-white sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg">New measurement</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wide text-white/45">Date</Label>
            <Input type="date" value={form.measured_on} onChange={set("measured_on")} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wide text-white/45">Weight (kg)</Label>
              <Input type="number" step="0.1" value={form.weight} onChange={set("weight")} placeholder="72.4" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wide text-white/45">Waist (cm)</Label>
              <Input type="number" step="0.1" value={form.waist} onChange={set("waist")} placeholder="92" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wide text-white/45">Body fat (%)</Label>
              <Input type="number" step="0.1" value={form.body_fat} onChange={set("body_fat")} placeholder="30.6" />
            </div>
          </div>
          <Button onClick={save} disabled={saving} className="w-full rounded-full bg-cyan-400 text-slate-950 hover:bg-cyan-300">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save measurement"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}