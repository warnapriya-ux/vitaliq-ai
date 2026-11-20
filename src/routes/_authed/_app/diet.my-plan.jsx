import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { formatDate } from "@/lib/health";
import SubPageHeader from "@/components/vitaliq/SubPageHeader";
import GlassCard from "@/components/vitaliq/GlassCard";

function MyDietPlan({ user }) {
  const [plan, setPlan] = useState(null);
  const [link, setLink] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [dayIndex, setDayIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [planPage, linkPage, feedbackPage] = await Promise.all([
      base44.entities.DietPlan.filter({ client_user_id: user.id }, { sort: "-created_date", limit: 10 }),
      base44.entities.DietitianClient.filter({ client_user_id: user.id }, { limit: 20 }),
      base44.entities.DietitianFeedback.filter({ client_user_id: user.id }, { sort: "-created_date", limit: 10 }),
    ]);
    const items = planPage.items ?? [];
    setPlan(items.find((p) => p.status === "approved") ?? items[0] ?? null);
    setLink((linkPage.items ?? []).find((l) => l.status === "active") ?? null);
    setFeedback(feedbackPage.items ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load().catch((error) => console.error(error));
  }, [load]);

  if (loading) return <div className="h-48 animate-pulse rounded-[26px] bg-white/5" />;

  const days = plan?.days ?? [];
  const day = days[dayIndex] ?? days[0];

  return (
    <div className="space-y-4">
      <SubPageHeader title="My diet plan" subtitle={link ? link.dietitian_name : "AI nutrition"} />

      {!plan ? (
        <GlassCard className="text-center">
          <p className="font-heading text-sm font-semibold text-white">No diet plan yet</p>
          <p className="mt-1 text-xs text-white/40">
            Connect a dietitian or use the AI diet planner to create your first plan.
          </p>
          <Link to="/diet/find" className="mt-3 inline-flex text-xs font-semibold text-emerald-300">Find a dietitian →</Link>
        </GlassCard>
      ) : (
        <>
          <GlassCard className="p-4">
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/35">
              {plan.status === "approved" ? "Approved by your dietitian" : "Awaiting approval"}
            </p>
            <h2 className="mt-1 font-heading text-lg font-semibold text-white">{plan.title}</h2>
            {plan.summary && <p className="mt-1.5 text-[11px] leading-relaxed text-white/50">{plan.summary}</p>}
            {plan.target_calories ? (
              <p className="mt-2 text-[10px] text-emerald-300">Daily target · {plan.target_calories} kcal</p>
            ) : null}
          </GlassCard>

          <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 no-scrollbar">
            {days.map((item, index) => (
              <button
                key={item.day || index}
                onClick={() => setDayIndex(index)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium transition ${
                  index === dayIndex ? "bg-emerald-400 text-slate-950" : "border border-white/10 bg-white/[0.03] text-white/55"
                }`}
              >
                {item.day}
              </button>
            ))}
          </div>

          <div className="space-y-2.5">
            {(day?.meals ?? []).map((meal, index) => (
              <div key={`${meal.time}-${index}`} className="rounded-[22px] border border-white/10 bg-white/[0.035] p-3.5">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-white/35">{meal.time}</p>
                    <p className="font-heading text-[13px] font-semibold text-white">{meal.meal}</p>
                  </div>
                  {meal.calories ? (
                    <span className="shrink-0 rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] text-emerald-300">{meal.calories} kcal</span>
                  ) : null}
                </div>
                <p className="mt-1.5 text-[12px] leading-relaxed text-white/70">{meal.detail}</p>
                {meal.portion && <p className="mt-1 text-[10px] text-white/40">Portion · {meal.portion}</p>}
                {(meal.protein || meal.carbs || meal.fat) ? (
                  <p className="mt-1 text-[10px] text-white/35">
                    P {meal.protein ?? 0}g · C {meal.carbs ?? 0}g · F {meal.fat ?? 0}g
                  </p>
                ) : null}
                {meal.prep && <p className="mt-1.5 text-[10px] leading-relaxed text-white/45">How: {meal.prep}</p>}
                {meal.alternatives && (
                  <p className="mt-1.5 rounded-xl bg-white/[0.03] p-2 text-[10px] leading-relaxed text-white/50">
                    Swap: {meal.alternatives}
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {feedback.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/30">From your dietitian</p>
          {feedback.map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
              <p className="text-[10px] uppercase tracking-wider text-white/30">{item.kind.replace("_", " ")} · {formatDate(item.created_date)}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-white/60">{item.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const Route = createFileRoute("/_authed/_app/diet/my-plan")({
  head: () => ({ meta: [{ title: "My diet plan — VITALIQ AI" }] }),
  component: PlanPage,
});

function PlanPage() {
  const { user, isLoadingAuth } = useAuth();
  if (isLoadingAuth || !user) return <div className="h-40 animate-pulse rounded-[26px] bg-white/5" />;
  return <MyDietPlan user={user} />;
}