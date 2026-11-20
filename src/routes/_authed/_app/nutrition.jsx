import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Check, Droplets, Loader2, RefreshCw, Stethoscope, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import PageTitle from "@/components/vitaliq/PageTitle";
import GlassCard from "@/components/vitaliq/GlassCard";
import PullToRefresh from "@/components/vitaliq/PullToRefresh";
import { useVitaliq } from "@/hooks/useVitaliq";
import { generateHealthPlan } from "@/lib/server-fns";
import { planItems, profileSummary, todayISO } from "@/lib/health";

export const Route = createFileRoute("/_authed/_app/nutrition")({
  head: () => ({ meta: [{ title: "VITALIQ Nutrition — AI dietitian" }] }),
  component: NutritionPage,
});

function NutritionPage() {
  const { profile, diet, today, measurements, user, reload } = useVitaliq();
  const generate = useServerFn(generateHealthPlan);
  const [log, setLog] = useState(today);
  const [eaten, setEaten] = useState(null);
  const [busy, setBusy] = useState(false);
  const [requesting, setRequesting] = useState(false);

  const items = planItems(diet);
  const eatenCount = items.length ? Math.min(items.length, Math.round(((log?.diet_adherence ?? 0) / 100) * items.length)) : 0;
  const eatenNow = eaten ?? Array.from({ length: eatenCount }, (_, i) => i);

  useEffect(() => setLog(today), [today]);

  async function saveLog(patch) {
    if (!profile) return;
    if (log) {
      const updated = await base44.entities.DailyLog.update(log.id, patch);
      setLog(updated);
    } else {
      const created = await base44.entities.DailyLog.create({ ...patch, profile_id: profile.id, log_date: todayISO() });
      setLog(created);
    }
  }

  async function toggleMeal(index) {
    const next = eatenNow.includes(index) ? eatenNow.filter((i) => i !== index) : [...eatenNow, index];
    setEaten(next);
    const pct = items.length ? Math.round((next.length / items.length) * 100) : 0;
    try {
      await saveLog({ diet_adherence: pct });
    } catch (error) {
      console.error(error);
      toast.error("Could not update your adherence.");
    }
  }

  async function addWater(delta) {
    const next = Math.max(0, Math.round(((log?.water_l ?? 0) + delta) * 100) / 100);
    try {
      await saveLog({ water_l: next });
    } catch (error) {
      console.error(error);
      toast.error("Could not update your water intake.");
    }
  }

  async function regenerate() {
    if (!profile) return;
    setBusy(true);
    try {
      const plan = await generate({
        data: { kind: "diet", profileSummary: profileSummary(profile, measurements[measurements.length - 1]) },
      });
      await base44.entities.Plan.create({
        kind: "diet",
        title: plan.title,
        summary: plan.summary,
        calories_target: plan.calories_target,
        items: plan.items,
        status: "ai_draft",
        client_id: user.id,
        client_name: user.full_name,
        client_email: user.email,
        program: profile.program,
      });
      await reload();
      toast.success("New AI diet plan created");
    } catch (error) {
      console.error(error);
      toast.error("Could not create a new plan right now.");
    } finally {
      setBusy(false);
    }
  }

  async function requestDietitian() {
    setRequesting(true);
    try {
      await base44.entities.Consultation.create({
        client_name: user?.full_name,
        client_email: user?.email,
        topic: "Diet plan review",
        status: "requested",
        scheduled_for: "",
      });
      toast.success("Request sent to your dietitian team");
    } catch (error) {
      console.error(error);
      toast.error("Could not send the request.");
    } finally {
      setRequesting(false);
    }
  }

  return (
    <PullToRefresh onRefresh={reload}>
    <div className="space-y-4">
      <PageTitle eyebrow="Vitaliq Nutrition" title="Today's nutrition" />

      <GlassCard className="border-emerald-400/20 bg-emerald-400/[0.05]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-200/70">AI diet plan</p>
            <p className="mt-1 font-heading text-base font-semibold text-white">{diet?.title || "No plan yet"}</p>
            <p className="mt-1 text-[11px] text-white/45">
              {diet?.calories_target ? `${diet.calories_target} kcal target` : "Generate your first plan"}
              {diet?.status ? ` · ${diet.status.replace("_", " ")}` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={regenerate}
            disabled={busy}
            aria-label="Generate a new diet plan"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-white/70 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 disabled:opacity-40"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </button>
        </div>
        {diet?.summary && <p className="mt-3 text-xs leading-relaxed text-white/55">{diet.summary}</p>}
        {diet?.review_note && (
          <p className="mt-2 rounded-xl bg-white/[0.05] px-3 py-2 text-[11px] text-emerald-200/80">
            Dietitian note: {diet.review_note}
          </p>
        )}
      </GlassCard>

      <GlassCard>
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/40">
          <UtensilsCrossed className="h-3.5 w-3.5" /> Meals
        </div>
        <ul className="mt-3 space-y-2">
          {items.length === 0 && <li className="text-xs text-white/40">Tap refresh to generate a personalised plan.</li>}
          {items.map((item, index) => {
            const done = eatenNow.includes(index);
            return (
              <li key={`${item.label}-${index}`}>
                <button
                  type="button"
                  onClick={() => toggleMeal(index)}
                  className={`flex w-full items-start gap-3 rounded-2xl border px-3 py-3 text-left transition ${
                    done ? "border-emerald-300/30 bg-emerald-400/10" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                  }`}
                >
                  <span
                    className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
                      done ? "border-emerald-300 bg-emerald-300 text-slate-900" : "border-white/20 text-transparent"
                    }`}
                  >
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="text-[13px] font-semibold text-white">{item.label}</span>
                      <span className="text-[12px] text-white/60">{item.meta}</span>
                    </span>
                    <span className="mt-0.5 block text-[13px] leading-relaxed text-white/65">{item.detail}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </GlassCard>

      <GlassCard>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/40">
            <Droplets className="h-3.5 w-3.5 text-cyan-300" /> Water
          </div>
          <p className="font-heading text-sm text-white">{Number(log?.water_l ?? 0).toFixed(2)} L</p>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => addWater(-0.25)}
            aria-label="Remove a glass of water"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-white/70 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
          >
            −
          </button>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-blue-400 transition-all"
              style={{ width: `${Math.min(100, ((log?.water_l ?? 0) / 3) * 100)}%` }}
            />
          </div>
          <button
            type="button"
            onClick={() => addWater(0.25)}
            aria-label="Add a glass of water"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-white/70 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
          >
            +
          </button>
        </div>
        <p className="mt-2 text-[12px] text-white/60">Goal 3 L · adherence today {log?.diet_adherence ?? 0}%</p>
      </GlassCard>

      <button
        type="button"
        onClick={requestDietitian}
        disabled={requesting}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-3 text-xs font-semibold text-white/70 transition hover:text-white disabled:opacity-50"
      >
        {requesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Stethoscope className="h-4 w-4" />}
        Request a dietitian review
      </button>
    </div>
    </PullToRefresh>
  );
}