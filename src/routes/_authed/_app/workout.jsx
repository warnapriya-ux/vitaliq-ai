import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Check, Dumbbell, Flame, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import PageTitle from "@/components/vitaliq/PageTitle";
import GlassCard from "@/components/vitaliq/GlassCard";
import { useVitaliq } from "@/hooks/useVitaliq";
import { generateHealthPlan } from "@/lib/server-fns";
import { planItems, profileSummary, todayISO } from "@/lib/health";

export const Route = createFileRoute("/_authed/_app/workout")({
  head: () => ({ meta: [{ title: "VITALIQ Coach — Today's workout" }] }),
  component: WorkoutPage,
});

function WorkoutPage() {
  const { profile, workout, today, measurements, user, reload } = useVitaliq();
  const generate = useServerFn(generateHealthPlan);
  const [log, setLog] = useState(today);
  const [done, setDone] = useState(null);
  const [busy, setBusy] = useState(false);

  const items = planItems(workout);
  const doneNow = done ?? (log?.workout_done ? items.map((_, i) => i) : []);

  useEffect(() => setLog(today), [today]);

  async function toggle(index) {
    const next = doneNow.includes(index) ? doneNow.filter((i) => i !== index) : [...doneNow, index];
    setDone(next);
    if (!profile) return;
    if (next.length === items.length && items.length > 0) {
      try {
        if (log) setLog(await base44.entities.DailyLog.update(log.id, { workout_done: true, calories_burned: 380 }));
        else setLog(await base44.entities.DailyLog.create({ profile_id: profile.id, log_date: todayISO(), workout_done: true, calories_burned: 380 }));
        toast.success("Workout complete. Nice work!");
      } catch (error) {
        console.error(error);
        toast.error("Could not save your workout.");
      }
    }
  }

  async function regenerate() {
    if (!profile) return;
    setBusy(true);
    try {
      const plan = await generate({
        data: { kind: "workout", profileSummary: profileSummary(profile, measurements[measurements.length - 1]) },
      });
      await base44.entities.Plan.create({
        kind: "workout",
        title: plan.title,
        summary: plan.summary,
        items: plan.items,
        status: "ai_draft",
        client_id: user.id,
        client_name: user.full_name,
        client_email: user.email,
        program: profile.program,
      });
      await reload();
      toast.success("New AI workout created");
    } catch (error) {
      console.error(error);
      toast.error("Could not create a new workout right now.");
    } finally {
      setBusy(false);
    }
  }

  const progress = items.length ? Math.round((doneNow.length / items.length) * 100) : 0;

  return (
    <div className="space-y-4">
      <PageTitle
        eyebrow="Vitaliq Coach"
        title="Today's workout"
        action={
          <button
            type="button"
            onClick={regenerate}
            disabled={busy}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/60 transition hover:text-white disabled:opacity-40"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </button>
        }
      />

      <GlassCard className="border-cyan-400/20 bg-cyan-400/[0.05]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-200/70">AI workout</p>
            <p className="mt-1 font-heading text-base font-semibold text-white">{workout?.title || "No workout yet"}</p>
          </div>
          <div className="text-right">
            <p className="font-heading text-xl font-semibold text-white">{progress}%</p>
            <p className="text-[10px] uppercase tracking-widest text-white/35">complete</p>
          </div>
        </div>
        {workout?.summary && <p className="mt-3 text-xs leading-relaxed text-white/55">{workout.summary}</p>}
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-blue-400 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </GlassCard>

      <GlassCard>
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/40">
          <Dumbbell className="h-3.5 w-3.5" /> Exercises
        </div>
        <ul className="mt-3 space-y-2">
          {items.length === 0 && <li className="text-xs text-white/40">Tap refresh to generate a workout for today.</li>}
          {items.map((item, index) => {
            const complete = doneNow.includes(index);
            return (
              <li key={`${item.label}-${index}`}>
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className={`flex w-full items-start gap-3 rounded-2xl border px-3 py-3 text-left transition ${
                    complete ? "border-cyan-300/30 bg-cyan-400/10" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                  }`}
                >
                  <span
                    className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
                      complete ? "border-cyan-300 bg-cyan-300 text-slate-900" : "border-white/20 text-transparent"
                    }`}
                  >
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="text-[13px] font-semibold text-white">{item.label}</span>
                      <span className="text-[10px] text-white/35">{item.meta}</span>
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-relaxed text-white/50">{item.detail}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </GlassCard>

      <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[11px] text-white/45">
        <Flame className="h-4 w-4 text-amber-300" />
        Estimated burn 380 kcal · logged automatically when you finish every exercise.
      </div>
    </div>
  );
}