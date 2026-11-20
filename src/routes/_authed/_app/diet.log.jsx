import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Camera } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { uploadPrivate } from "@/lib/files";
import { todayISO, formatDate } from "@/lib/health";
import SubPageHeader from "@/components/vitaliq/SubPageHeader";
import GlassCard from "@/components/vitaliq/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const num = (value) => (value === "" ? undefined : Number(value));

function NutritionLog({ user }) {
  const [entry, setEntry] = useState(null);
  const [link, setLink] = useState(null);
  const [plannedMeals, setPlannedMeals] = useState(5);
  const [logs, setLogs] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    weight: "",
    meals_completed: "3",
    water_l: "",
    hunger: "3",
    activity: "",
    difficulties: "",
    note: "",
  });

  const load = useCallback(async () => {
    const [logPage, linkPage, planPage] = await Promise.all([
      base44.entities.DailyDietLog.filter({ client_user_id: user.id }, { sort: "-log_date", limit: 30 }),
      base44.entities.DietitianClient.filter({ client_user_id: user.id }, { limit: 20 }),
      base44.entities.DietPlan.filter({ client_user_id: user.id }, { sort: "-created_date", limit: 5 }),
    ]);
    const items = logPage.items ?? [];
    setLogs(items);
    const todayEntry = items.find((item) => item.log_date === todayISO()) ?? null;
    setEntry(todayEntry);
    if (todayEntry) {
      setForm({
        weight: todayEntry.weight ?? "",
        meals_completed: String(todayEntry.meals_completed ?? 3),
        water_l: todayEntry.water_l ?? "",
        hunger: String(todayEntry.hunger ?? 3),
        activity: todayEntry.activity ?? "",
        difficulties: todayEntry.difficulties ?? "",
        note: todayEntry.note ?? "",
      });
    }
    const activeLink = (linkPage.items ?? []).find((l) => l.status === "active") ?? null;
    setLink(activeLink);
    const plan = (planPage.items ?? []).find((p) => p.status === "approved");
    const todayPlan = plan?.days?.find((d) => d.day?.toLowerCase().includes(new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()));
    const meals = (todayPlan?.meals ?? plan?.days?.[0]?.meals ?? []).length;
    setPlannedMeals(meals || 5);
  }, [user]);

  useEffect(() => {
    load().catch((error) => console.error(error));
  }, [load]);

  function set(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save() {
    setSaving(true);
    try {
      let photoUri = entry?.photo_uri || "";
      if (photo) photoUri = await uploadPrivate(photo);
      const payload = {
        client_user_id: user.id,
        client_name: user.full_name || "Member",
        dietitian_id: link?.dietitian_id || "",
        dietitian_user_id: link?.dietitian_user_id || "",
        log_date: todayISO(),
        weight: num(form.weight),
        meals_completed: num(form.meals_completed),
        meals_planned: plannedMeals,
        water_l: num(form.water_l),
        hunger: num(form.hunger),
        activity: form.activity,
        difficulties: form.difficulties,
        note: form.note,
        photo_uri: photoUri,
      };
      if (entry) await base44.entities.DailyDietLog.update(entry.id, payload);
      else await base44.entities.DailyDietLog.create(payload);
      toast.success("Today's nutrition saved.");
      setPhoto(null);
      await load();
    } catch (error) {
      toast.error("Could not save today's log.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <SubPageHeader title="Daily nutrition" subtitle={link ? link.dietitian_name : "Self tracking"} />

      <GlassCard className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <p className="font-heading text-sm font-semibold text-white">Today · {formatDate(todayISO())}</p>
          <span className="text-[10px] text-white/35">{plannedMeals} meals planned</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="space-y-1.5">
            <Label className="text-[11px] text-white/50">Weight (kg)</Label>
            <Input inputMode="decimal" value={form.weight} onChange={(e) => set("weight", e.target.value)} className="border-white/10 bg-[#0b1220] text-white" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] text-white/50">Meals completed</Label>
            <Input inputMode="numeric" value={form.meals_completed} onChange={(e) => set("meals_completed", e.target.value)} className="border-white/10 bg-[#0b1220] text-white" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] text-white/50">Water (litres)</Label>
            <Input inputMode="decimal" value={form.water_l} onChange={(e) => set("water_l", e.target.value)} className="border-white/10 bg-[#0b1220] text-white" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] text-white/50">Hunger (1–5)</Label>
            <Input inputMode="numeric" value={form.hunger} onChange={(e) => set("hunger", e.target.value)} className="border-white/10 bg-[#0b1220] text-white" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-[11px] text-white/50">Daily activity</Label>
          <Input value={form.activity} onChange={(e) => set("activity", e.target.value)} placeholder="45 min walk, office day" className="border-white/10 bg-[#0b1220] text-white" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[11px] text-white/50">Difficulties</Label>
          <Input value={form.difficulties} onChange={(e) => set("difficulties", e.target.value)} placeholder="Late meetings, missed afternoon snack" className="border-white/10 bg-[#0b1220] text-white" />
        </div>
        <label className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.03] text-[11px] text-white/50">
          <Camera className="h-4 w-4" />
          {photo ? photo.name : entry?.photo_uri ? "Replace meal photo" : "Add a meal photo"}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} />
        </label>
        <div className="space-y-1.5">
          <Label className="text-[11px] text-white/50">Notes for your dietitian</Label>
          <Textarea rows={2} value={form.note} onChange={(e) => set("note", e.target.value)} className="border-white/10 bg-[#0b1220] text-white" />
        </div>
        <Button onClick={save} disabled={saving} className="h-11 w-full rounded-xl bg-emerald-400 text-sm font-semibold text-slate-950 hover:bg-emerald-300">
          {saving ? "Saving…" : entry ? "Update today" : "Save today"}
        </Button>
      </GlassCard>

      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-[0.22em] text-white/30">Recent days</p>
        {logs.length === 0 && <p className="text-xs text-white/35">No entries yet.</p>}
        {logs.slice(0, 10).map((log) => (
          <div key={log.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
            <div className="min-w-0">
              <p className="text-[12px] text-white/80">{formatDate(log.log_date)}</p>
              <p className="text-[10px] text-white/35">
                {log.meals_completed ?? 0}/{log.meals_planned ?? plannedMeals} meals · {log.water_l ?? 0}L water
              </p>
            </div>
            <span className="text-[11px] text-emerald-300">{log.weight ? `${log.weight} kg` : "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_authed/_app/diet/log")({
  head: () => ({ meta: [{ title: "Daily nutrition — VITALIQ AI" }] }),
  component: LogPage,
});

function LogPage() {
  const { user, isLoadingAuth } = useAuth();
  if (isLoadingAuth || !user) return <div className="h-40 animate-pulse rounded-[26px] bg-white/5" />;
  return <NutritionLog user={user} />;
}