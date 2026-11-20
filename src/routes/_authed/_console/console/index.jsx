import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Panel from "@/components/console/Panel";
import SubPageHeader from "@/components/vitaliq/SubPageHeader";
import Kpi from "@/components/console/Kpi";
import StatusPill, { statusTone } from "@/components/console/StatusPill";
import { bmi, bmiLabel } from "@/lib/health";

export const Route = createFileRoute("/_authed/_console/console/")({
  head: () => ({ meta: [{ title: "VITALIQ Professional — Clients" }] }),
  component: ClientsPage,
});

function ClientsPage() {
  const [profiles, setProfiles] = useState([]);
  const [pending, setPending] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [p, pl, c] = await Promise.all([
        base44.entities.HealthProfile.filter({}, { sort: "-created_date", limit: 50 }),
        base44.entities.Plan.filter({ status: "pending_review" }, { sort: "-created_date", limit: 50 }),
        base44.entities.Consultation.filter({ status: "requested" }, { limit: 50 }),
      ]);
      setProfiles(p.items ?? []);
      setPending(pl.items ?? []);
      setConsultations(c.items ?? []);
      setLoading(false);
    })().catch((error) => {
      console.error(error);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="lg:hidden">
        <SubPageHeader subtitle="Professional portal" title="Client caseload" to="/" />
      </div>
      <header>
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">Professional portal</p>
        <h1 className="mt-1.5 font-heading text-2xl font-semibold text-white">Client caseload</h1>
        <p className="mt-1 text-xs text-white/40">Review AI plans, record measurements and run consultations.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <Kpi label="Clients" value={profiles.length} hint="with a health profile" />
        <Kpi label="Plans awaiting approval" value={pending.length} accent="text-amber-300" hint="AI drafts & revisions" />
        <Kpi label="Consultation requests" value={consultations.length} accent="text-cyan-300" hint="new this week" />
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-xs text-white/40">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading clients…
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {profiles.map((profile) => {
            const index = bmi(profile.current_weight, profile.height_cm);
            const clientPending = pending.filter((p) => p.client_email === profile.email).length;
            return (
              <Panel key={profile.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-heading text-sm font-semibold text-white">{profile.display_name}</p>
                      <StatusPill tone={profile.program === "men" ? "blue" : profile.program === "women" ? "purple" : "gray"}>
                        {profile.program}
                      </StatusPill>
                    </div>
                    <p className="mt-0.5 text-[11px] text-white/35">{profile.city || "—"} · {profile.activity_level} activity</p>
                  </div>
                  {clientPending > 0 && <StatusPill tone={statusTone("pending")}>{clientPending} to review</StatusPill>}
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-white/[0.04] py-2">
                    <p className="text-[9px] uppercase tracking-wider text-white/30">Weight</p>
                    <p className="text-sm font-semibold text-white">{profile.current_weight ?? "—"} kg</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.04] py-2">
                    <p className="text-[9px] uppercase tracking-wider text-white/30">Target</p>
                    <p className="text-sm font-semibold text-white/70">{profile.target_weight ?? "—"} kg</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.04] py-2">
                    <p className="text-[9px] uppercase tracking-wider text-white/30">BMI</p>
                    <p className="text-sm font-semibold text-cyan-300">{index ?? "—"}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <p className="text-[11px] text-white/35">{bmiLabel(index)} · {profile.food_preference?.replace("_", " ")}</p>
                  <Link
                    to="/console/$clientId"
                    params={{ clientId: profile.id }}
                    className="flex items-center gap-1 text-[11px] font-semibold text-cyan-300 hover:text-cyan-200"
                  >
                    Open case <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </Panel>
            );
          })}
          {profiles.length === 0 && <Panel>No client profiles yet.</Panel>}
        </div>
      )}
    </div>
  );
}