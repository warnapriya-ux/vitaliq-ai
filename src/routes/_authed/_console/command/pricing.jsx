import { createFileRoute } from "@tanstack/react-router";
import PlanPriceEditor from "@/components/console/PlanPriceEditor";
import SubPageHeader from "@/components/vitaliq/SubPageHeader";

export const Route = createFileRoute("/_authed/_console/command/pricing")({
  head: () => ({ meta: [{ title: "VITALIQ Command — Plan pricing" }] }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <div className="space-y-5">
      <div className="lg:hidden">
        <SubPageHeader subtitle="Super admin" title="Plan pricing" to="/command" />
      </div>
      <header>
        <p className="text-[12px] uppercase tracking-[0.24em] text-white/60">Super admin</p>
        <h1 className="mt-1.5 font-heading text-2xl font-semibold text-white">Plan pricing</h1>
        <p className="mt-1 text-xs text-white/40">Control what members pay per month, quarter and year.</p>
      </header>
      <PlanPriceEditor />
    </div>
  );
}