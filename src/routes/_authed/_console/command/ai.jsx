import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Activity, Apple, Brain, Dumbbell, HeartPulse, Sparkles, Target, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import Panel from "@/components/console/Panel";
import SubPageHeader from "@/components/vitaliq/SubPageHeader";
import StatusPill, { statusTone } from "@/components/console/StatusPill";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/health";

export const Route = createFileRoute("/_authed/_console/command/ai")({
  head: () => ({ meta: [{ title: "VITALIQ Command — AI engine" }] }),
  component: AiPage,
});

const MODULES = [
  { name: "AI Body Analyzer", icon: Activity, detail: "Measurements, BMI and body composition trends" },
  { name: "AI Weight Management", icon: Target, detail: "Deficit planning and plateau detection" },
  { name: "AI Fitness Advisor", icon: Dumbbell, detail: "Personalised workout programming" },
  { name: "AI Diet Advisor", icon: Apple, detail: "Meal plans that respect allergies and preference" },
  { name: "AI Lifestyle Advisor", icon: Sparkles, detail: "Sleep, hydration and daily routine guidance" },
  { name: "AI Progress Monitor", icon: TrendingUp, detail: "Weekly comparison and adherence scoring" },
  { name: "AI Health Risk Screening", icon: HeartPulse, detail: "Flags cases that need professional review" },
  { name: "AI Motivation Agent", icon: Brain, detail: "Nudges, streaks and encouragement" },
];

function AiPage() {
  const [plans, setPlans] = useState([]);

  const load = useCallback(async () => {
    const page = await base44.entities.Plan.list({ sort: "-created_date", limit: 100 });
    setPlans(page.items ?? []);
  }, []);

  useEffect(() => {
    load().catch((error) => console.error(error));
  }, [load]);

  async function publish(plan) {
    try {
      await base44.entities.Plan.update(plan.id, {
        status: "approved",
        reviewed_by: "VITALIQ Command",
        reviewed_at: formatDate(new Date()),
      });
      await load();
      toast.success("Plan published to the client");
    } catch (error) {
      console.error(error);
      toast.error("Could not publish this plan.");
    }
  }

  const queue = plans.filter((p) => p.status !== "approved");

  return (
    <div className="space-y-5">
      <div className="lg:hidden">
        <SubPageHeader subtitle="Super admin" title="AI engine" to="/command" />
      </div>
      <header>
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">Super admin</p>
        <h1 className="mt-1.5 font-heading text-2xl font-semibold text-white">AI engine</h1>
        <p className="mt-1 text-xs text-white/40">
          Eight advisor modules run on every profile. Generated plans wait here until a professional or admin releases them.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {MODULES.map((module) => (
          <div key={module.name} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <module.icon className="h-4 w-4 text-cyan-300" />
            <p className="mt-2 text-[12px] font-semibold text-white">{module.name}</p>
            <p className="mt-1 text-[10px] leading-relaxed text-white/35">{module.detail}</p>
            <span className="mt-2 inline-flex items-center gap-1 text-[9px] uppercase tracking-wider text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> active
            </span>
          </div>
        ))}
      </div>

      <Panel title="Plan review queue" subtitle={`${queue.length} plans awaiting release`}>
        <div className="space-y-2">
          {queue.length === 0 && <p className="text-xs text-white/35">Everything is published. New AI drafts appear here.</p>}
          {queue.map((plan) => (
            <div key={plan.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5">
              <div className="min-w-[200px] flex-1">
                <p className="text-[12px] font-semibold text-white">{plan.title}</p>
                <p className="text-[10px] text-white/35">
                  {plan.client_name || plan.client_email || "unassigned"} · {plan.kind} · {formatDate(plan.created_date)}
                </p>
              </div>
              <StatusPill tone={statusTone(plan.status)}>{plan.status}</StatusPill>
              <Button size="sm" onClick={() => publish(plan)} className="h-8 rounded-full bg-cyan-400 px-3 text-[11px] font-semibold text-slate-950 hover:bg-cyan-300">
                Publish
              </Button>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Published plans" subtitle={`${plans.filter((p) => p.status === "approved").length} live in client apps`}>
        <div className="space-y-1.5">
          {plans.filter((p) => p.status === "approved").slice(0, 8).map((plan) => (
            <div key={plan.id} className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2 text-[11px]">
              <span className="text-white/70">{plan.title}</span>
              <span className="text-white/30">{plan.reviewed_by || plan.client_name || "VITALIQ AI"}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}