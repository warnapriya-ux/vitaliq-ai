import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { useProfessional } from "@/components/pro/useProfessional";
import ProShell from "@/components/pro/ProShell";
import ProHeader from "@/components/pro/ProHeader";
import DietPlanComposer from "@/components/pro/DietPlanComposer";
import FoodLibrary from "@/components/pro/FoodLibrary";
import GlassCard from "@/components/vitaliq/GlassCard";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/health";

export const Route = createFileRoute("/_authed/pro/dietitian_/plans")({
  head: () => ({ meta: [{ title: "Diet plans — VITALIQ AI" }] }),
  component: PlansPage,
});

function PlansPage() {
  const { loading, profile, subscription, links, plans, reload } = useProfessional("diet");
  const active = links.filter((link) => link.status === "active");

  async function approve(plan) {
    await base44.entities.DietPlan.update(plan.id, { status: "approved", approved_at: new Date().toISOString() });
    toast.success("Meal plan approved and sent.");
    await reload();
  }

  async function remove(plan) {
    await base44.entities.DietPlan.delete(plan.id);
    await reload();
  }

  if (loading) return <ProShell track="diet"><div className="h-56 animate-pulse rounded-[26px] bg-white/5" /></ProShell>;

  return (
    <ProShell track="diet">
      <div className="space-y-4">
        <ProHeader track="diet" profile={profile} subscription={subscription} />
        {profile?.status === "active" ? (
          <DietPlanComposer links={active} onSaved={reload} />
        ) : (
          <GlassCard className="text-center">
            <p className="font-heading text-sm font-semibold text-white">Plan builder unlocks after activation</p>
            <p className="mt-1 text-xs text-white/40">Your credentials are being verified by the VITALIQ AI team.</p>
          </GlassCard>
        )}

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/30">Your plans ({plans.length})</p>
            {plans.length === 0 && <p className="text-xs text-white/35">No plans created yet.</p>}
            {plans.map((plan) => (
              <div key={plan.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-medium text-white/85">{plan.title}</p>
                    <p className="text-[10px] text-white/35">
                      {plan.client_name} · {plan.days?.length ?? 0} days · {formatDate(plan.created_date)}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                    plan.status === "approved" ? "bg-emerald-400/12 text-emerald-300" : "bg-amber-400/12 text-amber-300"
                  }`}>{plan.status}</span>
                </div>
                <div className="mt-2 flex gap-2">
                  {plan.status !== "approved" && (
                    <Button size="sm" onClick={() => approve(plan)} className="h-8 rounded-lg bg-emerald-400 text-[10px] font-semibold text-slate-950 hover:bg-emerald-300">
                      Approve & send
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => remove(plan)} className="h-8 rounded-lg text-[10px] text-white/35 hover:bg-transparent hover:text-rose-300">
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <FoodLibrary />
        </div>
      </div>
    </ProShell>
  );
}