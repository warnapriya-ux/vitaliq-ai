import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { PRO_PLANS, TRACKS, priceFor, trackApi } from "@/lib/professional";
import SubPageHeader from "@/components/vitaliq/SubPageHeader";
import GlassCard from "@/components/vitaliq/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/health";

export default function SubscriptionRenewal({ track }) {
  const { user } = useAuth();
  const config = TRACKS[track];
  const api = trackApi(track);
  const [profile, setProfile] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [prices, setPrices] = useState([]);
  const [plan, setPlan] = useState("basic");
  const [cycle, setCycle] = useState("monthly");
  const [reference, setReference] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    const profilePage = await api.profile.filter({ user_id: user.id }, { limit: 1 });
    const own = profilePage.items?.[0] ?? null;
    setProfile(own);
    if (own) {
      const nameKey = track === "diet" ? "dietitian" : "instructor";
      const [subPage, pricePage] = await Promise.all([
        api.subscription.filter({ [`${nameKey}_id`]: own.id }, { sort: "-created_date", limit: 20 }),
        base44.entities.ProfessionalPrice.filter({ track: config.priceTrack }, { limit: 20 }),
      ]);
      setSubscriptions(subPage.items ?? []);
      setPrices(pricePage.items ?? []);
      setPlan(own.plan || "basic");
    }
  }, [api, config.priceTrack, track, user]);

  useEffect(() => {
    load().catch((error) => console.error(error));
  }, [load]);

  async function submit() {
    if (!profile || reference.trim().length < 2) {
      toast.error("Enter the payment reference so the team can verify it.");
      return;
    }
    setSaving(true);
    try {
      const nameKey = track === "diet" ? "dietitian" : "instructor";
      const amount = priceFor(prices, config.priceTrack, plan, cycle);
      await api.subscription.create({
        [`${nameKey}_id`]: profile.id,
        [`${nameKey}_user_id`]: user.id,
        [`${nameKey}_name`]: profile.name,
        [`${nameKey}_email`]: profile.email,
        plan,
        cycle,
        amount,
        currency: "USD",
        status: "pending",
        payment_reference: reference.trim(),
      });
      await base44.entities.ProfessionalPayment.create({
        track: config.priceTrack,
        professional_id: profile.id,
        professional_name: profile.name,
        professional_email: profile.email,
        plan,
        cycle,
        amount,
        currency: "USD",
        method: "Bank transfer",
        reference: reference.trim(),
        status: "pending",
        paid_on: new Date().toISOString().slice(0, 10),
      });
      toast.success("Renewal submitted. An administrator will activate it shortly.");
      setReference("");
      await load();
    } catch (error) {
      toast.error("Could not submit the renewal.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <SubPageHeader title="Subscription" subtitle={`${config.label} packages`} />

      <GlassCard className="p-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">Current status</p>
        <p className="mt-1 font-heading text-sm font-semibold text-white">
          {profile ? `${profile.plan} · ${profile.status}` : "No professional account"}
        </p>
        <p className="mt-1 text-[11px] text-white/40">
          Client limit {profile?.max_clients ?? 0}. {subscriptions[0]?.renews_on ? `Renews ${formatDate(subscriptions[0].renews_on)}.` : ""}
        </p>
      </GlassCard>

      <GlassCard className="space-y-3 p-4">
        <p className="font-heading text-sm font-semibold text-white">Renew or upgrade</p>
        <div className="grid grid-cols-3 gap-2">
          {PRO_PLANS.map((item) => (
            <button
              key={item.id}
              onClick={() => setPlan(item.id)}
              className={`rounded-xl border p-2.5 text-left transition ${
                plan === item.id ? "border-cyan-400/50 bg-cyan-400/[0.08]" : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <p className="text-[11px] font-semibold text-white">{item.name}</p>
              <p className="text-[9px] text-white/40">{item.clients} clients</p>
              <p className="mt-1 text-[10px] text-cyan-300">${priceFor(prices, config.priceTrack, item.id, cycle)}</p>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {["monthly", "annual"].map((option) => (
            <button
              key={option}
              onClick={() => setCycle(option)}
              className={`rounded-xl border py-2 text-[11px] capitalize transition ${
                cycle === option ? "border-cyan-400/50 bg-cyan-400/[0.08] text-white" : "border-white/10 text-white/50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="space-y-1.5">
          <Label className="text-[11px] text-white/50">Payment reference</Label>
          <Input
            value={reference}
            onChange={(event) => setReference(event.target.value)}
            placeholder="Bank transfer or receipt number"
            className="border-white/10 bg-[#0b1220] text-white"
          />
        </div>
        <Button onClick={submit} disabled={saving} className="h-11 w-full rounded-xl bg-cyan-400 text-sm font-semibold text-slate-950 hover:bg-cyan-300">
          {saving ? "Submitting…" : `Submit ${cycle} payment`}
        </Button>
      </GlassCard>

      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-[0.22em] text-white/30">History</p>
        {subscriptions.length === 0 && <p className="text-xs text-white/35">No subscriptions yet.</p>}
        {subscriptions.map((sub) => (
          <div key={sub.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-[11px]">
            <div>
              <p className="text-white/75">{sub.plan} · {sub.cycle}</p>
              <p className="text-[10px] text-white/35">{formatDate(sub.started_on || sub.created_date)} · ref {sub.payment_reference || "—"}</p>
            </div>
            <span className="text-white/50">${sub.amount}</span>
            <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
              sub.status === "active" ? "bg-emerald-400/12 text-emerald-300" : "bg-amber-400/12 text-amber-300"
            }`}>{sub.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}