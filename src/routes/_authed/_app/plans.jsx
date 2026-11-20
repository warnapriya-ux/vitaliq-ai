import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Crown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import SubPageHeader from "@/components/vitaliq/SubPageHeader";
import { useVitaliq } from "@/hooks/useVitaliq";
import { PLAN_TIERS, formatDate, todayISO } from "@/lib/health";
import { CYCLES, addMonthsISO, amountFor, cycleNoun, monthsFor, perMonth } from "@/lib/pricing";

export const Route = createFileRoute("/_authed/_app/plans")({
  head: () => ({ meta: [{ title: "VITALIQ AI — Subscription plans" }] }),
  component: PlansPage,
});

function money(amount, currency = "USD") {
  const value = Number(amount) || 0;
  return currency === "USD" ? `$${value}` : `${value} ${currency}`;
}

function PlansPage() {
  const { subscription, user, reload } = useVitaliq();
  const [prices, setPrices] = useState({});
  const [cycle, setCycle] = useState("monthly");
  const [busy, setBusy] = useState("");

  useEffect(() => {
    base44.entities.PlanPrice.list({ limit: 50 })
      .then((page) => setPrices(Object.fromEntries((page.items ?? []).map((row) => [row.plan, row]))))
      .catch((error) => console.error(error));
  }, []);

  async function request(tier) {
    const amount = amountFor(prices[tier.id], tier, cycle);
    setBusy(tier.id);
    try {
      const existing = await base44.entities.Subscription.filter({ user_email: user?.email }, { limit: 1 });
      const isFree = tier.id === "free";
      const payload = {
        user_name: user?.full_name,
        user_email: user?.email,
        plan: tier.id,
        status: isFree ? "active" : "pending",
        billing_cycle: cycle,
        amount,
        currency: prices[tier.id]?.currency || "USD",
        started_on: todayISO(),
        renews_on: addMonthsISO(monthsFor(cycle)),
        auto_renew: !isFree,
      };
      if (existing.items?.length) await base44.entities.Subscription.update(existing.items[0].id, payload);
      else await base44.entities.Subscription.create(payload);
      await reload();
      toast.success(
        isFree
          ? "You are on the free plan."
          : `${tier.name} requested on ${cycle} billing. It activates once payment is confirmed.`,
      );
    } catch (error) {
      console.error(error);
      toast.error("Could not submit the subscription request.");
    } finally {
      setBusy("");
    }
  }

  const activePlan = subscription?.status === "active" ? subscription.plan : "free";
  const awaitingActivation = subscription?.status === "pending";

  return (
    <div className="space-y-4">
      <SubPageHeader subtitle="Membership" title="Choose your programme" to="/profile" />
      <p className="-mt-2 text-xs leading-relaxed text-white/45">
        Every plan includes the AI health advisor. Higher tiers add personalised plans and human professionals.
      </p>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-2">
        <div className="grid grid-cols-3 gap-1">
          {CYCLES.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setCycle(option.id)}
              className={`rounded-xl py-2 text-[11px] font-semibold transition ${
                cycle === option.id ? "bg-primary text-primary-foreground" : "text-white/50 hover:text-white"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {subscription && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[11px] text-white/50">
          <p>
            Current plan: <span className="capitalize text-white/85">{activePlan}</span>
            {subscription.status === "active" && subscription.renews_on
              ? ` · renews ${formatDate(subscription.renews_on)}`
              : ""}
          </p>
          {(awaitingActivation || subscription.status === "expired" || subscription.status === "cancelled") && (
            <p className="mt-1 capitalize text-amber-300/80">
              {subscription.status === "pending"
                ? `Request sent on ${subscription.billing_cycle} billing · awaiting payment confirmation`
                : `Previous plan ${subscription.plan} is ${subscription.status}`}
            </p>
          )}
        </div>
      )}

      <div className="space-y-3">
        {PLAN_TIERS.map((tier) => {
          const active = activePlan === tier.id;
          const amount = amountFor(prices[tier.id], tier, cycle);
          const currency = prices[tier.id]?.currency || "USD";
          return (
            <div
              key={tier.id}
              className={`rounded-[26px] border p-5 transition ${
                active
                  ? "border-cyan-300/40 bg-cyan-400/[0.08]"
                  : tier.id === "premium"
                    ? "border-orange-400/30 bg-gradient-to-br from-orange-500/15 to-transparent"
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
                  <p className="font-heading text-xl font-semibold text-white">{money(amount, currency)}</p>
                  <p className="text-[10px] text-white/35">{cycleNoun(cycle)}</p>
                  {amount > 0 && (
                    <p className="text-[9px] text-white/25">{money(perMonth(amount, cycle), currency)}/mo</p>
                  )}
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
                disabled={active || busy === tier.id || awaitingActivation}
                onClick={() => request(tier)}
                className={`mt-4 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-xs font-semibold transition ${
                  active || awaitingActivation
                    ? "bg-white/10 text-white/40"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {busy === tier.id && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {active
                  ? "Current plan"
                  : awaitingActivation
                    ? "Awaiting activation"
                    : tier.id === "free"
                      ? "Switch to Free"
                      : `Choose ${cycle} billing`}
              </button>
            </div>
          );
        })}
      </div>

      <p className="px-1 text-[10px] leading-relaxed text-white/30">
        Requests are confirmed by the VITALIQ team once payment is verified, and your plan then runs for the chosen
        cycle. You can change tier or billing cycle at any time; a lapsed renewal returns the account to Free.
      </p>
    </div>
  );
}