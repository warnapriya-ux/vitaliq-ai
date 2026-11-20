import { createFileRoute } from "@tanstack/react-router";
import { useProfessional } from "@/components/pro/useProfessional";
import ProShell from "@/components/pro/ProShell";
import ProHeader from "@/components/pro/ProHeader";
import WorkoutTemplateLibrary from "@/components/pro/WorkoutTemplateLibrary";
import GlassCard from "@/components/vitaliq/GlassCard";

export const Route = createFileRoute("/_authed/pro/instructor_/templates")({
  head: () => ({ meta: [{ title: "Workout templates — VITALIQ AI" }] }),
  component: TemplatesPage,
});

function TemplatesPage() {
  const { loading, profile, subscription, links } = useProfessional("gym");

  if (loading) return <ProShell track="gym"><div className="h-56 animate-pulse rounded-[26px] bg-white/5" /></ProShell>;

  return (
    <ProShell track="gym">
      <div className="space-y-4">
        <ProHeader track="gym" profile={profile} subscription={subscription} />
        {profile ? (
          <WorkoutTemplateLibrary profile={profile} links={links} />
        ) : (
          <GlassCard className="text-center">
            <p className="font-heading text-sm font-semibold text-white">Templates need an instructor account</p>
            <p className="mt-1 text-xs text-white/40">Register first, then save programmes you can reuse.</p>
          </GlassCard>
        )}
      </div>
    </ProShell>
  );
}