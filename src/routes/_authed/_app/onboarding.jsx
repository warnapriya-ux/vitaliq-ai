import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import PageTitle from "@/components/vitaliq/PageTitle";
import GlassCard from "@/components/vitaliq/GlassCard";
import ProfileForm from "@/components/vitaliq/ProfileForm";
import { base44 } from "@/api/base44Client";
import { useVitaliq } from "@/hooks/useVitaliq";

export const Route = createFileRoute("/_authed/_app/onboarding")({
  head: () => ({ meta: [{ title: "VITALIQ AI — Health profile setup" }] }),
  component: OnboardingPage,
});

function OnboardingPage() {
  const { profile, user, reload } = useVitaliq();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  async function save(values) {
    setSaving(true);
    try {
      const payload = { ...values, email: user?.email, display_name: values.display_name || user?.full_name || "Member" };
      if (profile) await base44.entities.HealthProfile.update(profile.id, payload);
      else await base44.entities.HealthProfile.create(payload);

      const existing = await base44.entities.Subscription.filter({ user_email: user?.email }, { limit: 1 });
      if (!existing.items?.length) {
        await base44.entities.Subscription.create({
          user_name: user?.full_name,
          user_email: user?.email,
          plan: "free",
          status: "active",
          billing_cycle: "monthly",
          amount: 0,
          currency: "USD",
          auto_renew: false,
        });
      }
      await reload();
      toast.success("Health profile saved");
      navigate({ to: "/" });
    } catch (error) {
      console.error(error);
      toast.error("Could not save your health profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <PageTitle eyebrow="Step 1 of 1" title="Build your health profile" />
      <p className="-mt-2 text-xs leading-relaxed text-white/45">
        VITALIQ uses these details to build your daily diet and workout programme. Your health data is private to you and the professionals you approve.
      </p>
      <GlassCard>
        <ProfileForm initial={profile ?? { display_name: user?.full_name }} onSubmit={save} saving={saving} submitLabel="Create my programme" />
      </GlassCard>
      <p className="px-1 text-[10px] leading-relaxed text-white/30">
        By continuing you consent to VITALIQ processing your health information to personalise your plan. Guidance is wellness support and does not replace medical advice.
      </p>
    </div>
  );
}