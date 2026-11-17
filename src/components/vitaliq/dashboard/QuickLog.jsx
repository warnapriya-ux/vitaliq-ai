import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import GlassCard from "@/components/vitaliq/GlassCard";
import { todayISO } from "@/lib/health";

const INPUT =
  "h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-2.5 text-sm text-white placeholder:text-white/25 focus:border-cyan-400/60 focus:outline-none";

export default function QuickLog({ profile, today, onSaved }) {
  const [form, setForm] = useState({
    steps: today?.steps ?? "",
    water_l: today?.water_l ?? "",
    sleep_hours: today?.sleep_hours ?? "",
    calories_in: today?.calories_in ?? "",
  });
  const [saving, setSaving] = useState(false);
  const set = (key) => (event) => setForm((f) => ({ ...f, [key]: event.target.value }));

  async function save() {
    if (!profile) return;
    setSaving(true);
    const payload = {
      profile_id: profile.id,
      steps: Number(form.steps) || 0,
      water_l: Number(form.water_l) || 0,
      sleep_hours: Number(form.sleep_hours) || 0,
      calories_in: Number(form.calories_in) || 0,
    };
    try {
      if (today) await base44.entities.DailyLog.update(today.id, payload);
      else await base44.entities.DailyLog.create({ ...payload, log_date: todayISO() });
      await onSaved?.();
      toast.success("Today's check-in saved");
    } catch (error) {
      console.error(error);
      toast.error("Could not save your check-in.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <GlassCard>
      <div className="flex items-center justify-between">
        <p className="font-heading text-sm font-semibold text-white">Today's check-in</p>
        <span className="text-[10px] uppercase tracking-wider text-white/30">{todayISO()}</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <label className="space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-white/35">Steps</span>
          <input className={INPUT} type="number" value={form.steps} onChange={set("steps")} placeholder="0" />
        </label>
        <label className="space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-white/35">Water (L)</span>
          <input className={INPUT} type="number" step="0.25" value={form.water_l} onChange={set("water_l")} placeholder="0" />
        </label>
        <label className="space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-white/35">Sleep (h)</span>
          <input className={INPUT} type="number" step="0.5" value={form.sleep_hours} onChange={set("sleep_hours")} placeholder="0" />
        </label>
        <label className="space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-white/35">Calories</span>
          <input className={INPUT} type="number" value={form.calories_in} onChange={set("calories_in")} placeholder="0" />
        </label>
      </div>
      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] py-2 text-[11px] font-semibold text-white/70 transition hover:text-white disabled:opacity-50"
      >
        {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />} Save today's numbers
      </button>
    </GlassCard>
  );
}