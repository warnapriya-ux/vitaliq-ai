import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Panel from "@/components/console/Panel";
import SubPageHeader from "@/components/vitaliq/SubPageHeader";
import Kpi from "@/components/console/Kpi";
import StatusPill, { statusTone } from "@/components/console/StatusPill";
import { formatDate } from "@/lib/health";

export const Route = createFileRoute("/_authed/_console/command/")({
  head: () => ({ meta: [{ title: "VITALIQ Command — Overview" }] }),
  component: CommandOverview,
});

const TIERS = ["free", "basic", "premium", "professional", "family"];

function CommandOverview() {
  const [subs, setSubs] = useState([]);
  const [payments, setPayments] = useState([]);
  const [pros, setPros] = useState([]);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    (async () => {
      const [s, p, pr, pl] = await Promise.all([
        base44.entities.Subscription.list({ sort: "-created_date", limit: 200 }),
        base44.entities.Payment.list({ sort: "-paid_on", limit: 200 }),
        base44.entities.Professional.list({ limit: 50 }),
        base44.entities.Plan.list({ sort: "-created_date", limit: 200 }),
      ]);
      setSubs(s.items ?? []);
      setPayments(p.items ?? []);
      setPros(pr.items ?? []);
      setPlans(pl.items ?? []);
    })().catch((error) => console.error(error));
  }, []);

  const active = subs.filter((s) => s.status === "active");
  const mrr = active.reduce((sum, s) => sum + (s.amount ?? 0), 0);
  const revenue = payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + (p.amount ?? 0), 0);
  const pendingPros = pros.filter((p) => p.status === "pending");
  const pendingSubs = subs.filter((s) => s.status === "pending");
  const drafts = plans.filter((p) => p.status !== "approved");

  const chart = TIERS.map((tier) => ({
    name: tier,
    members: subs.filter((s) => s.plan === tier).length,
  }));
  const COLORS = ["#64748b", "#38bdf8", "#a78bfa", "#f472b6", "#fbbf24"];

  return (
    <div className="space-y-6">
      <div className="lg:hidden">
        <SubPageHeader subtitle="Super admin" title="Platform overview" to="/" />
      </div>
      <header>
        <p className="text-[12px] uppercase tracking-[0.24em] text-white/60">Super admin</p>
        <h1 className="mt-1.5 font-heading text-2xl font-semibold text-white">Platform overview</h1>
        <p className="mt-1 text-xs text-white/40">Membership, revenue and AI activity across VITALIQ AI.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Members" value={subs.length} hint={`${active.length} active subscriptions`} />
        <Kpi label="Monthly recurring" value={`$${mrr}`} accent="text-emerald-300" hint="active plans" />
        <Kpi label="Collected revenue" value={`$${revenue}`} accent="text-cyan-300" hint="verified payments" />
        <Kpi label="Awaiting activation" value={pendingSubs.length} accent="text-amber-300" hint="payment verification" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Members by plan" className="lg:col-span-2">
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#0b1220", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 11 }} />
                <Bar dataKey="members" radius={[8, 8, 0, 0]}>
                  {chart.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Needs action">
          <div className="space-y-2 text-[12px]">
            <Link to="/command/subscriptions" className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2.5 hover:bg-white/[0.06]">
              <span className="text-white/60">Subscriptions pending</span>
              <span className="flex items-center gap-1 text-amber-300">{pendingSubs.length} <ArrowRight className="h-3 w-3" /></span>
            </Link>
            <Link to="/command/professionals" className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2.5 hover:bg-white/[0.06]">
              <span className="text-white/60">Professionals to verify</span>
              <span className="flex items-center gap-1 text-amber-300">{pendingPros.length} <ArrowRight className="h-3 w-3" /></span>
            </Link>
            <Link to="/command/ai" className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2.5 hover:bg-white/[0.06]">
              <span className="text-white/60">AI plans to publish</span>
              <span className="flex items-center gap-1 text-cyan-300">{drafts.length} <ArrowRight className="h-3 w-3" /></span>
            </Link>
          </div>
        </Panel>
      </div>

      <Panel title="Recent payments" subtitle="Latest verified and pending transactions">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-white/55">
                <th className="pb-2 font-medium">Member</th>
                <th className="pb-2 font-medium">Plan</th>
                <th className="pb-2 font-medium">Amount</th>
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.slice(0, 6).map((p) => (
                <tr key={p.id} className="border-t border-white/5 text-white/65">
                  <td className="py-2">{p.user_name || p.user_email}</td>
                  <td className="py-2 capitalize">{p.plan}</td>
                  <td className="py-2">${p.amount}</td>
                  <td className="py-2 text-white/35">{formatDate(p.paid_on)}</td>
                  <td className="py-2"><StatusPill tone={statusTone(p.status)}>{p.status}</StatusPill></td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr><td colSpan={5} className="py-3 text-white/35">No payments recorded yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}