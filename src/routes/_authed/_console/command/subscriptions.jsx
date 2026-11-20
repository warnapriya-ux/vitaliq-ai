import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import Panel from "@/components/console/Panel";
import SelectSheet from "@/components/vitaliq/SelectSheet";
import SubPageHeader from "@/components/vitaliq/SubPageHeader";
import StatusPill, { statusTone } from "@/components/console/StatusPill";
import { formatDate, todayISO } from "@/lib/health";
import { addMonthsISO, monthsFor } from "@/lib/pricing";

export const Route = createFileRoute("/_authed/_console/command/subscriptions")({
  head: () => ({ meta: [{ title: "VITALIQ Command — Subscriptions" }] }),
  component: SubscriptionsPage,
});

const STATUSES = ["active", "pending", "expired", "cancelled"];

function SubscriptionsPage() {
  const [subs, setSubs] = useState([]);
  const [payments, setPayments] = useState([]);

  const load = useCallback(async () => {
    const [s, p] = await Promise.all([
      base44.entities.Subscription.list({ sort: "-created_date", limit: 200 }),
      base44.entities.Payment.list({ sort: "-paid_on", limit: 200 }),
    ]);
    setSubs(s.items ?? []);
    setPayments(p.items ?? []);
  }, []);

  useEffect(() => {
    load().catch((error) => console.error(error));
  }, [load]);

  async function setStatus(sub, status) {
    try {
      const patch = { status };
      // Activating starts the paid cycle from today so the renewal date always matches the cycle.
      if (status === "active") {
        patch.started_on = sub.started_on || todayISO();
        patch.renews_on = addMonthsISO(monthsFor(sub.billing_cycle));
      }
      await base44.entities.Subscription.update(sub.id, patch);
      await load();
      toast.success(`${sub.user_name || sub.user_email} is now ${status}`);
    } catch (error) {
      console.error(error);
      toast.error("Could not update the subscription.");
    }
  }

  return (
    <div className="space-y-5">
      <div className="lg:hidden">
        <SubPageHeader subtitle="Super admin" title="Subscriptions & billing" to="/command" />
      </div>
      <header>
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">Super admin</p>
        <h1 className="mt-1.5 font-heading text-2xl font-semibold text-white">Subscriptions & billing</h1>
        <p className="mt-1 text-xs text-white/40">Activate members once payment is verified, or cancel at any time.</p>
      </header>

      <Panel title="Subscriptions" subtitle={`${subs.length} records`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-white/25">
                <th className="pb-2 font-medium">Member</th>
                <th className="pb-2 font-medium">Plan</th>
                <th className="pb-2 font-medium">Cycle</th>
                <th className="pb-2 font-medium">Amount</th>
                <th className="pb-2 font-medium">Renews</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Change</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((sub) => (
                <tr key={sub.id} className="border-t border-white/5 text-white/65">
                  <td className="py-2">
                    <p>{sub.user_name || "—"}</p>
                    <p className="text-[12px] text-white/60">{sub.user_email}</p>
                  </td>
                  <td className="py-2 capitalize">{sub.plan}</td>
                  <td className="py-2 capitalize">{sub.billing_cycle}</td>
                  <td className="py-2">${sub.amount}</td>
                  <td className="py-2 text-white/35">{formatDate(sub.renews_on)}</td>
                  <td className="py-2"><StatusPill tone={statusTone(sub.status)}>{sub.status}</StatusPill></td>
                  <td className="py-2">
                    <div className="w-[132px]">
                      <SelectSheet
                        label="Subscription status"
                        value={sub.status}
                        options={STATUSES.map((s) => ({ value: s, label: s }))}
                        onChange={(value) => setStatus(sub, value)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {subs.length === 0 && <tr><td colSpan={7} className="py-3 text-white/35">No subscriptions yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Payments" subtitle="History of all transactions">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-white/25">
                <th className="pb-2 font-medium">Member</th>
                <th className="pb-2 font-medium">Reference</th>
                <th className="pb-2 font-medium">Method</th>
                <th className="pb-2 font-medium">Amount</th>
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-t border-white/5 text-white/65">
                  <td className="py-2">{p.user_name || p.user_email}</td>
                  <td className="py-2 text-white/35">{p.reference || "—"}</td>
                  <td className="py-2">{p.method || "—"}</td>
                  <td className="py-2">${p.amount}</td>
                  <td className="py-2 text-white/35">{formatDate(p.paid_on)}</td>
                  <td className="py-2"><StatusPill tone={statusTone(p.status)}>{p.status}</StatusPill></td>
                </tr>
              ))}
              {payments.length === 0 && <tr><td colSpan={6} className="py-3 text-white/35">No payments yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}