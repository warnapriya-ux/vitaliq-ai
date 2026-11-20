import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { BadgeCheck, FileText, Pause, Play } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { activateProfessional } from "@/lib/professional-fns";
import { PRO_PLANS, TRACKS, DEFAULT_PRICES, priceFor, trackApi } from "@/lib/professional";
import { signUri } from "@/lib/files";
import { formatDate } from "@/lib/health";
import Panel from "@/components/console/Panel";
import Kpi from "@/components/console/Kpi";
import StatusPill, { statusTone } from "@/components/console/StatusPill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function PricingEditor({ track }) {
  const config = TRACKS[track];
  const [rows, setRows] = useState([]);
  const [values, setValues] = useState({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const page = await base44.entities.ProfessionalPrice.filter({ track: config.priceTrack }, { limit: 20 });
    const items = page.items ?? [];
    setRows(items);
    const next = {};
    for (const plan of PRO_PLANS) {
      const row = items.find((item) => item.plan === plan.id);
      next[plan.id] = {
        monthly: String(row?.monthly ?? DEFAULT_PRICES[config.priceTrack][plan.id].monthly),
        annual: String(row?.annual ?? DEFAULT_PRICES[config.priceTrack][plan.id].annual),
      };
    }
    setValues(next);
  }, [config.priceTrack]);

  useEffect(() => {
    load().catch((error) => console.error(error));
  }, [load]);

  async function save() {
    setSaving(true);
    try {
      for (const plan of PRO_PLANS) {
        const existing = rows.find((row) => row.plan === plan.id);
        const payload = {
          track: config.priceTrack,
          plan: plan.id,
          monthly: Number(values[plan.id]?.monthly) || 0,
          annual: Number(values[plan.id]?.annual) || 0,
          currency: "USD",
        };
        if (existing) await base44.entities.ProfessionalPrice.update(existing.id, payload);
        else await base44.entities.ProfessionalPrice.create(payload);
      }
      toast.success("Package pricing updated.");
      await load();
    } catch (error) {
      toast.error("Could not save pricing.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Panel title="Subscription packages" subtitle="Monthly and annual price for each package">
      <div className="space-y-2">
        {PRO_PLANS.map((plan) => (
          <div key={plan.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-2">
            <div>
              <p className="text-[12px] text-white/80">{plan.name}</p>
              <p className="text-[10px] text-white/30">{plan.clients} clients · {plan.reports} reports</p>
            </div>
            <Input
              inputMode="decimal"
              value={values[plan.id]?.monthly ?? ""}
              onChange={(event) => setValues({ ...values, [plan.id]: { ...values[plan.id], monthly: event.target.value } })}
              className="h-9 w-20 border-white/10 bg-[#0b1220] text-[12px] text-white"
              placeholder="Monthly"
            />
            <Input
              inputMode="decimal"
              value={values[plan.id]?.annual ?? ""}
              onChange={(event) => setValues({ ...values, [plan.id]: { ...values[plan.id], annual: event.target.value } })}
              className="h-9 w-20 border-white/10 bg-[#0b1220] text-[12px] text-white"
              placeholder="Annual"
            />
          </div>
        ))}
      </div>
      <Button onClick={save} disabled={saving} className="mt-3 h-9 w-full rounded-lg bg-cyan-400 text-[11px] font-semibold text-slate-950 hover:bg-cyan-300">
        {saving ? "Saving…" : "Save packages"}
      </Button>
    </Panel>
  );
}

export default function ProfessionalAdmin({ track }) {
  const { user } = useAuth();
  const config = TRACKS[track];
  const api = trackApi(track);
  const activate = useServerFn(activateProfessional);

  const [profiles, setProfiles] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [links, setLinks] = useState([]);
  const [busy, setBusy] = useState("");

  const load = useCallback(async () => {
    const nameKey = track === "diet" ? "dietitian" : "instructor";
    const [profilePage, subPage, paymentPage, linkPage] = await Promise.all([
      api.profile.list({ sort: "-created_date", limit: 200 }),
      api.subscription.list({ sort: "-created_date", limit: 200 }),
      base44.entities.ProfessionalPayment.filter({ track: config.priceTrack }, { sort: "-created_date", limit: 200 }),
      api.link.list({ sort: "-created_date", limit: 300 }),
    ]);
    setProfiles(profilePage.items ?? []);
    setSubscriptions(subPage.items ?? []);
    setPayments(paymentPage.items ?? []);
    setLinks((linkPage.items ?? []).filter((link) => link[`${nameKey}_id`]));
  }, [api, config.priceTrack, track]);

  useEffect(() => {
    if (user?.role === "admin") load().catch((error) => console.error(error));
  }, [load, user]);

  if (user?.role !== "admin") {
    return <p className="text-sm text-white/40">This console is available to administrators only.</p>;
  }

  async function activatePro(pro) {
    setBusy(pro.id);
    try {
      const sub = subscriptions.find((item) => item[`${track === "diet" ? "dietitian" : "instructor"}_id`] === pro.id);
      await activate({ data: { track, professionalId: pro.id, plan: pro.plan || "basic", cycle: sub?.cycle || "monthly" } });
      toast.success(`${pro.name} activated.`);
      await load();
    } catch (error) {
      toast.error(error?.message || "Could not activate this professional.");
    } finally {
      setBusy("");
    }
  }

  async function setStatus(pro, status) {
    try {
      await api.profile.update(pro.id, { status });
      toast.success(`${pro.name} is now ${status}.`);
      await load();
    } catch (error) {
      toast.error("Could not update this account.");
    }
  }

  async function openDoc(pro) {
    const url = await signUri(pro.verification_doc_uri);
    if (url) window.open(url, "_blank");
    else toast.error("No verification document on file.");
  }

  const pending = profiles.filter((pro) => pro.status === "pending");
  const active = profiles.filter((pro) => pro.status === "active");
  const pendingPayments = payments.filter((payment) => payment.status === "pending");
  const revenue = payments.filter((payment) => payment.status === "paid").reduce((sum, payment) => sum + (payment.amount ?? 0), 0);
  const rated = profiles.filter((pro) => pro.review_count);
  const satisfaction = rated.length
    ? Math.round((rated.reduce((sum, pro) => sum + (pro.rating ?? 0), 0) / rated.length) * 10) / 10
    : 0;
  const activeClients = (pro) => links.filter((link) => link[`${track === "diet" ? "dietitian" : "instructor"}_id`] === pro.id && link.status === "active").length;

  return (
    <div className="space-y-5">
      <header>
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">Super admin</p>
        <h1 className="mt-1.5 font-heading text-2xl font-semibold text-white">{config.plural} administration</h1>
        <p className="mt-1 text-xs text-white/40">
          Registrations, verification, activation, client limits and subscription revenue for the {config.label.toLowerCase()} practice.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label={`Total ${config.plural.toLowerCase()}`} value={profiles.length} hint={`${pending.length} awaiting verification`} />
        <Kpi label="Active" value={active.length} accent="text-emerald-300" hint="currently activated" />
        <Kpi label="Pending payments" value={pendingPayments.length} accent="text-amber-300" hint={`$${pendingPayments.reduce((s, p) => s + (p.amount ?? 0), 0)} awaiting`} />
        <Kpi label="Subscription revenue" value={`$${revenue}`} accent="text-cyan-300" hint={`Avg rating ${satisfaction || "—"}`} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Panel title="Awaiting verification" subtitle="Confirm qualifications and payment before activation">
          <div className="space-y-2">
            {pending.length === 0 && <p className="text-xs text-white/35">No registrations waiting.</p>}
            {pending.map((pro) => {
              const sub = subscriptions.find((item) => item[`${track === "diet" ? "dietitian" : "instructor"}_id`] === pro.id);
              const payment = payments.find((item) => item.professional_id === pro.id);
              return (
                <div key={pro.id} className="rounded-xl border border-amber-400/20 bg-amber-400/[0.04] p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-medium text-white/90">{pro.name}</p>
                      <p className="text-[10px] text-white/40">{pro.email} · {pro.qualifications || "No qualifications listed"}</p>
                      <p className="mt-1 text-[10px] text-white/35">
                        {planLabel(pro.plan)} · ref {sub?.payment_reference || "—"} · ${payment?.amount ?? sub?.amount ?? "—"}
                      </p>
                    </div>
                    <StatusPill tone="yellow">pending</StatusPill>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => openDoc(pro)} className="h-8 rounded-lg border-white/15 bg-transparent text-[10px] text-white/65">
                      <FileText className="mr-1 h-3 w-3" /> Documents
                    </Button>
                    <Button size="sm" onClick={() => activatePro(pro)} disabled={busy === pro.id} className="h-8 rounded-lg bg-emerald-400 text-[10px] font-semibold text-slate-950 hover:bg-emerald-300">
                      <BadgeCheck className="mr-1 h-3 w-3" /> Verify & activate
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setStatus(pro, "rejected")} className="h-8 rounded-lg text-[10px] text-white/35 hover:bg-transparent hover:text-rose-300">
                      Reject
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        <PricingEditor track={track} />
      </div>

      <Panel title="Professionals" subtitle="Plan, client limit and account status">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-white/25">
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium">Package</th>
                <th className="pb-2 font-medium">Clients</th>
                <th className="pb-2 font-medium">Rating</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium" />
              </tr>
            </thead>
            <tbody>
              {profiles.map((pro) => (
                <tr key={pro.id} className="border-t border-white/5 text-white/65">
                  <td className="py-2">
                    <p className="text-white/85">{pro.name}</p>
                    <p className="text-[10px] text-white/30">{pro.city || pro.email}</p>
                  </td>
                  <td className="py-2 capitalize">{pro.plan}</td>
                  <td className="py-2">{activeClients(pro)} / {pro.max_clients ?? 5}</td>
                  <td className="py-2">{pro.rating ? pro.rating.toFixed(1) : "—"}</td>
                  <td className="py-2"><StatusPill tone={statusTone(pro.status)}>{pro.status}</StatusPill></td>
                  <td className="py-2 text-right">
                    {pro.status === "active" ? (
                      <button onClick={() => setStatus(pro, "suspended")} className="inline-flex items-center gap-1 text-[10px] text-white/40 hover:text-rose-300">
                        <Pause className="h-3 w-3" /> Suspend
                      </button>
                    ) : pro.status === "suspended" ? (
                      <button onClick={() => activatePro(pro)} className="inline-flex items-center gap-1 text-[10px] text-white/40 hover:text-emerald-300">
                        <Play className="h-3 w-3" /> Reactivate
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
              {profiles.length === 0 && (
                <tr><td colSpan={6} className="py-3 text-white/35">No {config.plural.toLowerCase()} registered yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Professional payments" subtitle="Subscription payments awaiting verification">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-white/25">
                <th className="pb-2 font-medium">Professional</th>
                <th className="pb-2 font-medium">Package</th>
                <th className="pb-2 font-medium">Amount</th>
                <th className="pb-2 font-medium">Reference</th>
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.slice(0, 12).map((payment) => (
                <tr key={payment.id} className="border-t border-white/5 text-white/65">
                  <td className="py-2">{payment.professional_name}</td>
                  <td className="py-2 capitalize">{payment.plan} · {payment.cycle}</td>
                  <td className="py-2">${payment.amount}</td>
                  <td className="py-2 text-white/40">{payment.reference}</td>
                  <td className="py-2 text-white/35">{formatDate(payment.paid_on)}</td>
                  <td className="py-2"><StatusPill tone={statusTone(payment.status)}>{payment.status}</StatusPill></td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr><td colSpan={6} className="py-3 text-white/35">No payments recorded yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function planLabel(plan) {
  return PRO_PLANS.find((item) => item.id === plan)?.name ?? "Basic";
}