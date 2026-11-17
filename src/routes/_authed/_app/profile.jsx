import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Settings2, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import PageTitle from "@/components/vitaliq/PageTitle";
import GlassCard from "@/components/vitaliq/GlassCard";
import ProfileForm from "@/components/vitaliq/ProfileForm";
import MeasurementDialog from "@/components/vitaliq/MeasurementDialog";
import { useVitaliq } from "@/hooks/useVitaliq";
import { useAuth } from "@/lib/AuthContext";
import { bmi, bmiLabel, formatDate } from "@/lib/health";

export const Route = createFileRoute("/_authed/_app/profile")({
  head: () => ({ meta: [{ title: "VITALIQ AI — Profile" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { profile, measurements, subscription, user, reload } = useVitaliq();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [consultations, setConsultations] = useState([]);

  useEffect(() => {
    base44.entities.Consultation.list({ sort: "-created_date", limit: 5 })
      .then((page) => setConsultations(page.items ?? []))
      .catch(() => {});
  }, []);

  async function save(values) {
    setSaving(true);
    try {
      const payload = { ...values, email: user?.email };
      if (profile) await base44.entities.HealthProfile.update(profile.id, payload);
      else await base44.entities.HealthProfile.create(payload);
      await reload();
      toast.success("Profile updated");
    } catch (error) {
      console.error(error);
      toast.error("Could not save your profile.");
    } finally {
      setSaving(false);
    }
  }

  const latest = measurements[measurements.length - 1];
  const index = bmi(latest?.weight ?? profile?.current_weight, profile?.height_cm);

  return (
    <div className="space-y-4">
      <PageTitle eyebrow="Your account" title="Profile" />

      <GlassCard className="flex items-center gap-3">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400/40 to-orange-500/40 font-heading text-lg font-semibold text-white ring-1 ring-white/20">
          {(profile?.display_name || user?.full_name || "V").charAt(0)}
        </div>
        <div className="flex-1">
          <p className="font-heading text-base font-semibold text-white">{profile?.display_name || user?.full_name}</p>
          <p className="text-[11px] text-white/40">{user?.email}</p>
          <p className="mt-1 text-[11px] text-cyan-300">
            {profile?.program === "men" ? "Men's" : profile?.program === "women" ? "Women's" : "General"} programme · BMI {index ?? "—"} ({bmiLabel(index)})
          </p>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="flex items-center justify-between">
          <p className="font-heading text-sm font-semibold text-white">Measurements</p>
          <MeasurementDialog profile={profile} onSaved={reload} />
        </div>
        <div className="mt-3 space-y-1.5">
          {measurements.length === 0 && <p className="text-xs text-white/40">No measurements yet.</p>}
          {[...measurements].reverse().slice(0, 5).map((m) => (
            <div key={m.id} className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2 text-[11px]">
              <span className="text-white/45">{formatDate(m.measured_on)}</span>
              <span className="text-white/70">
                {m.weight ?? "—"} kg · {m.waist ?? "—"} cm waist · {m.body_fat ?? "—"}% fat
              </span>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="border-amber-300/20 bg-amber-300/[0.05]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-amber-200/70">Subscription</p>
            <p className="mt-1 font-heading text-base font-semibold capitalize text-white">
              {subscription?.plan || "free"} plan
            </p>
            <p className="text-[11px] text-white/45">
              {subscription ? `${subscription.status} · renews ${formatDate(subscription.renews_on)}` : "No active subscription"}
            </p>
          </div>
          <Link to="/plans" className="rounded-full bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground">
            Manage
          </Link>
        </div>
      </GlassCard>

      <GlassCard>
        <p className="flex items-center gap-1.5 font-heading text-sm font-semibold text-white">
          <Stethoscope className="h-3.5 w-3.5 text-emerald-300" /> Professional support
        </p>
        <div className="mt-3 space-y-1.5">
          {consultations.length === 0 && <p className="text-xs text-white/40">No consultations requested yet.</p>}
          {consultations.map((c) => (
            <div key={c.id} className="rounded-xl bg-white/[0.03] px-3 py-2 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-white/75">{c.topic}</span>
                <span className="text-[10px] uppercase tracking-wide text-cyan-300">{c.status}</span>
              </div>
              <p className="text-white/35">
                {c.professional_name || "Awaiting assignment"}
                {c.scheduled_for ? ` · ${formatDate(c.scheduled_for)}` : ""}
              </p>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <p className="flex items-center gap-1.5 font-heading text-sm font-semibold text-white">
          <Settings2 className="h-3.5 w-3.5" /> Health profile
        </p>
        <div className="mt-4">
          <ProfileForm initial={profile ?? {}} onSubmit={save} saving={saving} />
        </div>
      </GlassCard>

      <button
        type="button"
        onClick={async () => {
          await logout();
          navigate({ to: "/login" });
        }}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-white/10 py-3 text-xs font-semibold text-white/50 transition hover:text-rose-300"
      >
        <LogOut className="h-3.5 w-3.5" /> Sign out
      </button>
    </div>
  );
}