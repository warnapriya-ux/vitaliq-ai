import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import Panel from "@/components/console/Panel";
import SubPageHeader from "@/components/vitaliq/SubPageHeader";
import StatusPill, { statusTone } from "@/components/console/StatusPill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/AuthContext";
import { bmi, bmiLabel, formatDate, planItems, todayISO } from "@/lib/health";

export const Route = createFileRoute("/_authed/_console/console/$clientId")({
  head: () => ({ meta: [{ title: "VITALIQ Professional — Client case" }] }),
  component: ClientCasePage,
});

function ClientCasePage() {
  const { clientId } = Route.useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [plans, setPlans] = useState([]);
  const [note, setNote] = useState("");
  const [when, setWhen] = useState("");
  const [busy, setBusy] = useState("");

  const load = useCallback(async () => {
    const record = await base44.entities.HealthProfile.get(clientId);
    setProfile(record);
    const [m, p] = await Promise.all([
      base44.entities.Measurement.filter({ profile_id: clientId }, { sort: "-measured_on", limit: 20 }),
      base44.entities.Plan.filter({ client_email: record.email }, { sort: "-created_date", limit: 20 }),
    ]);
    setMeasurements(m.items ?? []);
    setPlans(p.items ?? []);
  }, [clientId]);

  useEffect(() => {
    load().catch((error) => console.error(error));
  }, [load]);

  async function approve(plan) {
    setBusy(plan.id);
    try {
      await base44.entities.Plan.update(plan.id, {
        status: "approved",
        review_note: note || plan.review_note || "",
        reviewed_by: user?.full_name || "Professional",
        reviewed_at: todayISO(),
      });
      setNote("");
      await load();
      toast.success("Plan approved and published to the client");
    } catch (error) {
      console.error(error);
      toast.error("Could not approve this plan.");
    } finally {
      setBusy("");
    }
  }

  async function schedule() {
    if (!profile || !when) {
      toast.error("Pick a date and time first.");
      return;
    }
    setBusy("consult");
    try {
      await base44.entities.Consultation.create({
        client_name: profile.display_name,
        client_email: profile.email,
        professional_name: user?.full_name || "VITALIQ Professional",
        topic: "Progress review",
        scheduled_for: when,
        status: "scheduled",
      });
      setWhen("");
      toast.success("Consultation scheduled");
    } catch (error) {
      console.error(error);
      toast.error("Could not schedule the consultation.");
    } finally {
      setBusy("");
    }
  }

  if (!profile) {
    return (
      <div className="flex items-center gap-2 text-xs text-white/40">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading case…
      </div>
    );
  }

  const index = bmi(measurements[0]?.weight ?? profile.current_weight, profile.height_cm);

  return (
    <div className="space-y-5">
      <div className="lg:hidden">
        <SubPageHeader subtitle="Professional portal" title="Client case" to="/console" />
      </div>
      <Link to="/console" className="hidden items-center gap-1.5 text-[11px] text-white/40 hover:text-white lg:inline-flex">
        <ArrowLeft className="h-3.5 w-3.5" /> All clients
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-white">{profile.display_name}</h1>
          <p className="mt-1 text-xs text-white/40">
            {profile.program} programme · {profile.email || "no email on file"} · {profile.city || "—"}
          </p>
          {profile.conditions && <p className="mt-1 max-w-xl text-[11px] text-amber-200/70">Health: {profile.conditions}</p>}
        </div>
        <div className="flex gap-2">
          <StatusPill tone="blue">BMI {index ?? "—"}</StatusPill>
          <StatusPill tone="gray">{bmiLabel(index)}</StatusPill>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Profile" className="lg:col-span-1">
          <dl className="space-y-2 text-[12px]">
            {[
              ["Height", `${profile.height_cm ?? "—"} cm`],
              ["Current weight", `${profile.current_weight ?? "—"} kg`],
              ["Target weight", `${profile.target_weight ?? "—"} kg`],
              ["Activity", profile.activity_level],
              ["Lifestyle", profile.lifestyle],
              ["Food", profile.food_preference?.replace("_", " ")],
              ["Experience", profile.experience],
              ["Consent", profile.consent ? "Given" : "Missing"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between border-b border-white/5 pb-1.5">
                <dt className="text-white/35">{label}</dt>
                <dd className="capitalize text-white/75">{value}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        <Panel title="Measurements" className="lg:col-span-2">
          <div className="space-y-2">
            {measurements.length === 0 && <p className="text-xs text-white/35">No measurements recorded.</p>}
            {measurements.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2 text-[11px]">
                <span className="text-white/40">{formatDate(m.measured_on)}</span>
                <span className="text-white/70">
                  {m.weight ?? "—"} kg · waist {m.waist ?? "—"} cm · hip {m.hip ?? "—"} cm · fat {m.body_fat ?? "—"}%
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Plan review" subtitle="Approve or annotate the AI-generated plan before it reaches the client">
        <div className="space-y-3">
          {plans.length === 0 && <p className="text-xs text-white/35">No plans generated yet.</p>}
          {plans.map((plan) => (
            <div key={plan.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-heading text-[13px] font-semibold text-white">{plan.title}</p>
                  <p className="text-[10px] uppercase tracking-widest text-white/30">{plan.kind} · {formatDate(plan.created_date)}</p>
                </div>
                <StatusPill tone={statusTone(plan.status)}>{plan.status}</StatusPill>
              </div>
              {plan.summary && <p className="mt-2 text-[11px] leading-relaxed text-white/45">{plan.summary}</p>}
              <ul className="mt-2 space-y-1">
                {planItems(plan).map((item, i) => (
                  <li key={i} className="text-[11px] text-white/55">
                    <span className="text-white/80">{item.label}:</span> {item.detail} <span className="text-white/25">· {item.meta}</span>
                  </li>
                ))}
              </ul>
              {plan.review_note && (
                <p className="mt-2 rounded-lg bg-emerald-400/10 px-2.5 py-1.5 text-[10px] text-emerald-200/80">
                  Reviewed by {plan.reviewed_by}: {plan.review_note}
                </p>
              )}
              {plan.status !== "approved" && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Input
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Add a professional note for the client…"
                    className="h-9 flex-1 border-white/10 bg-white/[0.04] text-xs text-white"
                  />
                  <Button
                    onClick={() => approve(plan)}
                    disabled={busy === plan.id}
                    className="h-9 gap-1.5 rounded-full bg-emerald-400 px-4 text-xs font-semibold text-slate-950 hover:bg-emerald-300"
                  >
                    {busy === plan.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                    Approve
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Schedule a consultation">
        <div className="flex flex-wrap items-end gap-2">
          <div className="flex-1">
            <Input type="datetime-local" value={when} onChange={(event) => setWhen(event.target.value)} className="h-9 border-white/10 bg-white/[0.04] text-xs text-white" />
          </div>
          <Button onClick={schedule} disabled={busy === "consult"} className="h-9 rounded-full bg-cyan-400 px-4 text-xs font-semibold text-slate-950 hover:bg-cyan-300">
            {busy === "consult" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Book"}
          </Button>
        </div>
      </Panel>
    </div>
  );
}