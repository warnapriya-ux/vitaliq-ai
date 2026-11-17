import { createFileRoute } from "@tanstack/react-router";
import { useProfessional } from "@/components/pro/useProfessional";
import ProShell from "@/components/pro/ProShell";
import ProHeader from "@/components/pro/ProHeader";
import ProLibraryManager from "@/components/pro/ProLibraryManager";
import GlassCard from "@/components/vitaliq/GlassCard";

export const Route = createFileRoute("/_authed/pro/instructor_/library")({
  head: () => ({ meta: [{ title: "Virtual gym — VITALIQ AI" }] }),
  component: LibraryPage,
});

function LibraryPage() {
  const { loading, profile, subscription } = useProfessional("gym");

  if (loading) return <ProShell track="gym"><div className="h-56 animate-pulse rounded-[26px] bg-white/5" /></ProShell>;

  return (
    <ProShell track="gym">
      <div className="space-y-4">
        <ProHeader track="gym" profile={profile} subscription={subscription} />
        {profile ? (
          <ProLibraryManager profile={profile} />
        ) : (
          <GlassCard className="text-center">
            <p className="font-heading text-sm font-semibold text-white">Virtual gym needs an instructor account</p>
            <p className="mt-1 text-xs text-white/40">Register first, then upload sessions for your clients.</p>
          </GlassCard>
        )}
      </div>
    </ProShell>
  );
}