import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Crown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import PageTitle from "@/components/vitaliq/PageTitle";
import { useVitaliq } from "@/hooks/useVitaliq";
import { PLAN_TIERS, todayISO, shiftISO } from "@/lib/health";

export const Route = createFileRoute("/_authed/_app/plans")({
  head: () => ({ meta: [{ title: "VITALIQ AI — Subscription plans" }] }),
  component: PlansPage,
});

function PlansPage() {
  const { subscription, user, reload } = useVitaliq();
  const [busy, setBusy] = useState("");

  async function request(tier) {
    setBusy(tier.id);
    try {
      const existing = await base44.entities.Subscription.filter({ user_email: user?.email }, { limit: 1 });
      const payload = {
        user_name: user?.full_name,
        user_email: user?.email,
        plan: tier.id,
        status: "pending",
        billing_cycle: "monthly",
        amount: tier.price,
        currency: "USD",
        started_on: todayISO(),
        renews_on: shiftISO(30),
        auto_renew: true,
      };
      if (existing.items?.length) await base44.entities.Subscription.update(existing.items[0].id, payload);
      else await base44.entities.Subscription.create(payload);
      await reload();
      toast.success(`${tier.name} requested. Our team activates it once payment is verified.`);
    } catch (error) {
      console.error(error);
      toast.error("Could not submit the upgrade request.");
    } finally {
      setBusy("");
    }
  }

  const current = subscription?.plan || "free";

  return (
    <div className="space-y-4">
      <PageTitle eyebrow="Membership" title="Choose your programme" />
      <p className="-mt-2 text-xs leading-relaxed text-white/45">
        Every plan includes the AI health advisor. Higher tiers add personalised plans and human professionals.
      </p>

      <div className="space-y-3">
        {PLAN_TIERS.map((tier) => {
          const active = current === tier.id;
          return (
            <div
              key={tier.id}
              className={`rounded-[26px] border p-5 transition ${
                active
                  ? "border-cyan-300/40 bg-cyan-400/[0.08]"
                  : tier.id === "premium"
                    ? "border-violet-400/30 bg-gradient-to-br from-violet-500/15 to-transparent"
                    : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-heading text-base font-semibold text-white">{tier.name}</p>
                    {tier.id === "premium" && (
                      <span className="flex items-center gap-1 rounded-full bg-amber-300/90 px-2 py-0.5 text-[9px] font-bold uppercase text-amber-950">
                        <Crown className="h-2.5 w-2.5" /> Popular
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] text-white/40">{tier.tagline}</p>
                </div>
                <div className="text-right">
                  <p className="font-heading text-xl font-semibold text-white">${tier.price}</p>
                  <p className="text-[10px] text-white/35">per month</p>
                </div>
              </div>

              <ul className="mt-3 space-y-1.5">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-[11px] text-white/55">
                    <Check className="mt-0.5 h-3 w-3 shrink-0 text-cyan-300" /> {feature}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                disabled={active || busy === tier.id}
                onClick={() => request(tier)}
                className={`mt-4 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-xs font-semibold transition ${
                  active
                    ? "bg-white/10 text-white/40"
                    : "bg-white text-slate-900 hover:bg-white/90"
                }`}
              >
                {busy === tier.id && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {active ? "Current plan" : subscription?.status === "pending" && current === tier.id ? "Awaiting activation" : "Request this plan"}
              </button>
            </div>
          );
        })}
      </div>

      <p className="px-1 text-[10px] leading-relaxed text-white/30">
        Requests are reviewed by the VITALIQ team. Your plan activates once payment is verified, and you can cancel or change tier at any time.
      </p>
    </div>
  );
}