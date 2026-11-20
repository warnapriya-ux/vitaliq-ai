import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { base44 } from "@/api/base44Client";
import { useProfessional } from "@/components/pro/useProfessional";
import ProShell from "@/components/pro/ProShell";
import ProHeader from "@/components/pro/ProHeader";
import ProStatGrid from "@/components/pro/ProStatGrid";
import ClientRequests from "@/components/pro/ClientRequests";
import ClientList from "@/components/pro/ClientList";
import ClientProgressReview from "@/components/pro/ClientProgressReview";
import FoodLibrary from "@/components/pro/FoodLibrary";
import GlassCard from "@/components/vitaliq/GlassCard";

export const Route = createFileRoute("/_authed/pro/dietitian")({
  head: () => ({ meta: [{ title: "Dietitian dashboard — VITALIQ AI" }] }),
  component: DietitianDashboard,
});

function DietitianDashboard() {
  const { loading, profile, subscription, links, plans, reload } = useProfessional("diet");
  const [logs, setLogs] = useState([]);

  const loadLogs = useCallback(async () => {
    if (!profile) return;
    const page = await base44.entities.DailyDietLog.filter(
      { dietitian_user_id: profile.user_id },
      { sort: "-log_date", limit: 100 },
    );
    setLogs(page.items ?? []);
  }, [profile]);

  useEffect(() => {
    loadLogs().catch((error) => console.error(error));
  }, [loadLogs]);

  if (loading) return <ProShell track="diet"><div className="h-56 animate-pulse rounded-[26px] bg-white/5" /></ProShell>;

  if (!profile) {
    return (
      <ProShell track="diet">
        <GlassCard className="space-y-2 text-center">
          <p className="font-heading text-base font-semibold text-white">No dietitian account yet</p>
          <p className="text-xs text-white/45">Register with your licence and qualifications to start managing customers.</p>
          <Link to="/pro/dietitian/register" className="mt-2 inline-flex rounded-full bg-emerald-400 px-4 py-2 text-xs font-semibold text-slate-950">
            Start registration
          </Link>
        </GlassCard>
      </ProShell>
    );
  }

  const active = links.filter((link) => link.status === "active");
  const pending = links.filter((link) => link.status === "requested");
  const limit = profile.max_clients ?? 5;
  const compliance = logs.length
    ? Math.round(logs.reduce((sum, log) => sum + ((log.meals_completed ?? 0) / Math.max(1, log.meals_planned ?? 5)) * 100, 0) / logs.length)
    : 0;
  const needsReview = logs.filter((log) => (log.meals_completed ?? 0) < (log.meals_planned ?? 5)).length;

  return (
    <ProShell track="diet">
      <div className="space-y-5">
        <ProHeader track="diet" profile={profile} subscription={subscription} />

        <ProStatGrid
          stats={[
            { label: "Total customers", value: links.length },
            { label: "Active", value: active.length, accent: "text-emerald-300" },
            { label: "Pending requests", value: pending.length, accent: pending.length ? "text-amber-300" : "text-white" },
            { label: "Available slots", value: Math.max(0, limit - active.length), accent: "text-cyan-300", hint: `of ${limit}` },
          ]}
        />

        <ProStatGrid
          stats={[
            { label: "Active plans", value: plans.filter((plan) => plan.status === "approved").length },
            { label: "Daily compliance", value: `${compliance}%`, accent: "text-emerald-300" },
            { label: "Logs needing review", value: needsReview, accent: needsReview ? "text-amber-300" : "text-white" },
            { label: "Days logged", value: logs.length },
          ]}
        />

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="space-y-2.5">
            <h2 className="text-[10px] uppercase tracking-[0.22em] text-white/35">Customer requests</h2>
            {pending.length ? (
              <ClientRequests track="diet" links={pending} onDone={reload} />
            ) : (
              <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs text-white/35">No new requests.</p>
            )}
          </section>
          <section className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] uppercase tracking-[0.22em] text-white/35">Active customers</h2>
              <Link to="/pro/dietitian/plans" className="text-[10px] font-semibold text-emerald-300">Build a plan →</Link>
            </div>
            <ClientList track="diet" links={active} actionLabel="Meal plan" />
          </section>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="space-y-2">
            <h2 className="text-[10px] uppercase tracking-[0.22em] text-white/35">Progress review</h2>
            <ClientProgressReview links={active} onSaved={loadLogs} />
          </section>
          <FoodLibrary compact />
        </div>
      </div>
    </ProShell>
  );
}